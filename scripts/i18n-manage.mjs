import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(PROJECT_ROOT, 'locales');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const META_FILE = path.join(LOCALES_DIR, '.translation-meta.json');

const SUPPORTED_LOCALES = ['tr', 'en', 'es', 'ru', 'ar'];
const LOCALE_NAMES = {
    tr: 'Turkish',
    en: 'English',
    es: 'Spanish',
    ru: 'Russian',
    ar: 'Arabic'
};

const SOURCE_LOCALE = process.env.I18N_SOURCE_LOCALE || 'tr';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DEFAULT_BATCH_SIZE = Number(process.env.I18N_BATCH_SIZE || 12);

const ALLOWED_SHARED_PATHS = new Set([
    'products_page.area_acoustic_t3',
    'products_page.comp_title_accent',
    'products_page.comp_t5_v1',
    'products_page.cta_title_2',
    'about_page.story_title_accent',
    'about_page.stats_v1',
    'about_page.stats_v2',
    'about_page.stats_v3',
    'about_page.stats_v4',
    'about_page.cta_title_2',
    'about_page.rd_badge_d',
    'about_page.env_title_accent',
    'about_page.a1_n',
    'about_page.a2_n',
    'gallery_page.cta_title_2',
    'catalog_page.cat_title',
    'catalog_page.cta_title_2',
    'contact_page.info_phone_v1',
    'contact_page.info_phone_v2',
    'contact_page.phone_val',
    'contact_page.email_val',
    'contact_page.address_val',
    'contact_page.form_email_ph',
    'contact_page.map_company'
]);

const OPTIONAL_EMPTY_TARGET_PATHS = new Set([
    'home_page.cta_title_2',
    'about_page.cta_title_2'
]);

const TEMPLATE_TEXT_ALLOWLIST = new Set([
    'TR',
    'EN',
    'ES',
    'RU',
    'AR',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Instagram',
    'Turkce',
    'Türkçe',
    'English',
    'Español',
    'Русский',
    'العربية',
    'Bumin Studios',
    'info@marterm.com.tr'
]);

function parseArgs(argv) {
    const command = argv.find(arg => !arg.startsWith('--')) || 'report';
    const options = {};

    for (const arg of argv) {
        if (!arg.startsWith('--')) continue;
        const [rawKey, rawValue] = arg.slice(2).split('=');
        options[rawKey] = rawValue === undefined ? true : rawValue;
    }

    return { command, options };
}

function loadJson(filePath, fallback = {}) {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 4)}\n`);
}

function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function getByPath(obj, dottedPath) {
    return dottedPath.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function setByPath(obj, dottedPath, value) {
    const parts = dottedPath.split('.');
    let cursor = obj;

    for (let i = 0; i < parts.length - 1; i += 1) {
        const part = parts[i];
        if (!cursor[part] || typeof cursor[part] !== 'object' || Array.isArray(cursor[part])) {
            cursor[part] = {};
        }
        cursor = cursor[part];
    }

    cursor[parts.at(-1)] = value;
}

function walkLeaves(obj, basePath = '', acc = []) {
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = basePath ? `${basePath}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            walkLeaves(value, currentPath, acc);
        } else {
            acc.push({ path: currentPath, value });
        }
    }
    return acc;
}

function getHtmlFiles(dir, acc = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const filePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            getHtmlFiles(filePath, acc);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            acc.push(filePath);
        }
    }
    return acc;
}

function hasLetters(value) {
    return /\p{L}/u.test(value);
}

function isBlank(value) {
    return typeof value !== 'string' || value.trim() === '';
}

function isExpectedSharedValue(pathKey, value) {
    if (ALLOWED_SHARED_PATHS.has(pathKey)) return true;
    if (pathKey === 'products_page.comp_f3') return true;
    if (pathKey === 'about_page.rd_badge_t') return true;
    if (pathKey.startsWith('catalog_page.en_card_')) return true;
    if (!hasLetters(value)) return true;
    if (/^(Marterm|Bumin Studios)$/u.test(value.trim())) return true;
    return false;
}

function getTargetLocales(options) {
    const raw = options.locale || process.env.I18N_LOCALES;
    if (!raw) return SUPPORTED_LOCALES.filter(locale => locale !== SOURCE_LOCALE);

    const locales = String(raw)
        .split(',')
        .map(locale => locale.trim())
        .filter(Boolean);

    for (const locale of locales) {
        if (!SUPPORTED_LOCALES.includes(locale)) {
            throw new Error(`Unsupported locale: ${locale}`);
        }
        if (locale === SOURCE_LOCALE) {
            throw new Error(`Source locale ${SOURCE_LOCALE} cannot be a sync target.`);
        }
    }

    return locales;
}

function loadLocales() {
    const locales = {};
    for (const locale of SUPPORTED_LOCALES) {
        locales[locale] = loadJson(path.join(LOCALES_DIR, `${locale}.json`));
    }
    return locales;
}

function loadMeta() {
    const meta = loadJson(META_FILE, {
        sourceLocale: SOURCE_LOCALE,
        locales: {}
    });

    meta.sourceLocale ||= SOURCE_LOCALE;
    meta.locales ||= {};
    return meta;
}

function markCurrentTranslations(locales, meta, targets, mode = 'baseline') {
    const sourceLeaves = walkLeaves(locales[SOURCE_LOCALE]);

    for (const locale of targets) {
        meta.locales[locale] ||= {};
        for (const { path: pathKey, value: sourceValue } of sourceLeaves) {
            const translatedValue = getByPath(locales[locale], pathKey);
            if (isBlank(translatedValue)) continue;
            meta.locales[locale][pathKey] = {
                sourceHash: hashValue(String(sourceValue)),
                updatedAt: new Date().toISOString(),
                mode
            };
        }
    }
}

function computeLocaleReport(locales, meta, locale) {
    const sourceLeaves = walkLeaves(locales[SOURCE_LOCALE]);
    const targetLeaves = walkLeaves(locales[locale]);
    const targetSet = new Set(targetLeaves.map(item => item.path));

    const missing = [];
    const stale = [];
    const sameAsSource = [];

    for (const { path: pathKey, value: sourceValue } of sourceLeaves) {
        const translatedValue = getByPath(locales[locale], pathKey);
        const metaEntry = meta.locales?.[locale]?.[pathKey];

        if (typeof sourceValue === 'string' && sourceValue.trim() === '' && isBlank(translatedValue)) {
            continue;
        }

        if (OPTIONAL_EMPTY_TARGET_PATHS.has(pathKey) && isBlank(translatedValue)) {
            continue;
        }

        if (isBlank(translatedValue)) {
            missing.push(pathKey);
            continue;
        }

        if (
            typeof translatedValue === 'string' &&
            typeof sourceValue === 'string' &&
            translatedValue === sourceValue &&
            !isExpectedSharedValue(pathKey, sourceValue)
        ) {
            sameAsSource.push(pathKey);
        }

        if (
            metaEntry?.sourceHash &&
            metaEntry.sourceHash !== hashValue(String(sourceValue))
        ) {
            stale.push(pathKey);
        }
    }

    const extra = targetLeaves
        .map(item => item.path)
        .filter(pathKey => getByPath(locales[SOURCE_LOCALE], pathKey) === undefined && !targetSet.has('__never__'));

    return { missing, stale, sameAsSource, extra };
}

function isIgnorableTemplateValue(value) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) return true;
    if (normalized.includes('{{')) return true;
    if (TEMPLATE_TEXT_ALLOWLIST.has(normalized)) return true;
    if (/^(https?:\/\/|mailto:|tel:)/i.test(normalized)) return true;
    if (/^[A-Z0-9][A-Z0-9 .:/+%()-]*$/u.test(normalized) && normalized.length <= 24) return true;
    if (/^(mm|cm|m²|µ = [0-9–-]+)$/u.test(normalized)) return true;
    if (
        /\d/.test(normalized) &&
        /^[0-9A-Za-zµλ²³·≥≤°/+%.,:;() xmkWNRC\-–—]+$/u.test(normalized)
    ) {
        return true;
    }
    if (/^[\w.-]+@[\w.-]+\.\w+$/u.test(normalized)) return true;
    if (/^(TR|EN|ES|RU|AR)$/u.test(normalized)) return true;
    return false;
}

function scanTemplatesForHardcodedText() {
    const findings = [];

    for (const filePath of getHtmlFiles(SRC_DIR)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const stripped = raw
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '');

        const textNodeRegex = />\s*([^<>{][^<]*)\s*</g;
        for (const match of stripped.matchAll(textNodeRegex)) {
            const value = match[1].replace(/\s+/g, ' ').trim();
            if (!hasLetters(value) || isIgnorableTemplateValue(value)) continue;
            const line = stripped.slice(0, match.index).split('\n').length;
            findings.push({ filePath, line, value, kind: 'text' });
        }

        const attrRegex = /\b(?:title|aria-label|placeholder)\s*=\s*"([^"]+)"/g;
        for (const match of stripped.matchAll(attrRegex)) {
            const value = match[1].trim();
            if (!hasLetters(value) || isIgnorableTemplateValue(value)) continue;
            const line = stripped.slice(0, match.index).split('\n').length;
            findings.push({ filePath, line, value, kind: 'attribute' });
        }
    }

    return findings;
}

function scanTemplatesForMissingSourceKeys(locales) {
    const findings = [];
    const keyRegex = /\{\{\{?\s*([\w.]+)\s*\}\}\}?/g;

    for (const filePath of getHtmlFiles(SRC_DIR)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const seen = new Set();

        for (const match of raw.matchAll(keyRegex)) {
            const key = match[1];
            if (seen.has(key)) continue;
            seen.add(key);

            if (getByPath(locales[SOURCE_LOCALE], key) !== undefined) continue;

            const line = raw.slice(0, match.index).split('\n').length;
            findings.push({ filePath, line, key });
        }
    }

    return findings;
}

function printReport(locales, meta, targets) {
    const templateFindings = scanTemplatesForHardcodedText();
    const missingSourceKeys = scanTemplatesForMissingSourceKeys(locales);
    let hasIssues = false;

    console.log(`Source locale: ${SOURCE_LOCALE}`);
    console.log(`Checked locales: ${targets.join(', ')}`);
    console.log('');

    for (const locale of targets) {
        const report = computeLocaleReport(locales, meta, locale);
        const total = report.missing.length + report.stale.length + report.sameAsSource.length + report.extra.length;

        console.log(`[${locale}] ${LOCALE_NAMES[locale]}`);
        console.log(`  missing: ${report.missing.length}`);
        console.log(`  stale: ${report.stale.length}`);
        console.log(`  same_as_source: ${report.sameAsSource.length}`);
        console.log(`  extra: ${report.extra.length}`);

        if (total > 0) hasIssues = true;

        for (const [label, items] of [
            ['missing', report.missing],
            ['stale', report.stale],
            ['same_as_source', report.sameAsSource],
            ['extra', report.extra]
        ]) {
            if (!items.length) continue;
            console.log(`  ${label}_keys:`);
            for (const item of items.slice(0, 20)) {
                console.log(`    - ${item}`);
            }
            if (items.length > 20) {
                console.log(`    ... ${items.length - 20} more`);
            }
        }

        console.log('');
    }

    if (missingSourceKeys.length) {
        hasIssues = true;
        console.log('Template key findings:');
        for (const finding of missingSourceKeys.slice(0, 40)) {
            console.log(`  - ${path.relative(PROJECT_ROOT, finding.filePath)}:${finding.line} missing_source_key ${finding.key}`);
        }
        if (missingSourceKeys.length > 40) {
            console.log(`  ... ${missingSourceKeys.length - 40} more`);
        }
        console.log('');
    } else {
        console.log('Template key findings: 0');
        console.log('');
    }

    if (templateFindings.length) {
        hasIssues = true;
        console.log('Template scan findings:');
        for (const finding of templateFindings.slice(0, 40)) {
            console.log(`  - ${path.relative(PROJECT_ROOT, finding.filePath)}:${finding.line} (${finding.kind}) ${finding.value}`);
        }
        if (templateFindings.length > 40) {
            console.log(`  ... ${templateFindings.length - 40} more`);
        }
        console.log('');
    } else {
        console.log('Template scan findings: 0');
        console.log('');
    }

    return hasIssues;
}

function extractOutputText(response) {
    if (typeof response.output_text === 'string' && response.output_text.trim()) {
        return response.output_text;
    }

    const textChunks = [];
    for (const item of response.output || []) {
        for (const content of item.content || []) {
            if (typeof content.refusal === 'string') {
                throw new Error(`Model refusal: ${content.refusal}`);
            }
            if (typeof content.text === 'string') {
                textChunks.push(content.text);
            }
        }
    }

    if (!textChunks.length) {
        throw new Error('No text content returned from OpenAI response.');
    }

    return textChunks.join('\n');
}

async function translateBatch({ apiKey, model, targetLocale, payload }) {
    const keys = Object.keys(payload);
    const schema = {
        type: 'object',
        additionalProperties: false,
        properties: Object.fromEntries(keys.map(key => [key, { type: 'string' }])),
        required: keys
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model,
            store: false,
            max_output_tokens: 12000,
            input: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'input_text',
                            text: [
                                'You are a professional website localization editor.',
                                `Translate the provided Turkish strings into ${LOCALE_NAMES[targetLocale]}.`,
                                'Preserve HTML tags exactly.',
                                'Preserve placeholders, braces, newline escapes, URLs, email addresses, phone numbers, units, standards, and brand names.',
                                'Do not add claims that are not present in the source text.',
                                'Return only valid JSON that matches the schema.'
                            ].join(' ')
                        }
                    ]
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: JSON.stringify(payload, null, 2)
                        }
                    ]
                }
            ],
            text: {
                format: {
                    type: 'json_schema',
                    name: 'translation_map',
                    strict: true,
                    schema
                }
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const json = await response.json();
    return JSON.parse(extractOutputText(json));
}

function chunkArray(items, chunkSize) {
    const chunks = [];
    for (let index = 0; index < items.length; index += chunkSize) {
        chunks.push(items.slice(index, index + chunkSize));
    }
    return chunks;
}

async function runSync(locales, meta, targets) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is required for i18n:sync');
    }

    markCurrentTranslations(locales, meta, targets, 'baseline');
    saveJson(META_FILE, meta);

    for (const locale of targets) {
        const report = computeLocaleReport(locales, meta, locale);
        const queue = [...new Set([...report.missing, ...report.stale])];

        if (!queue.length) {
            console.log(`[${locale}] nothing to sync`);
            continue;
        }

        console.log(`[${locale}] syncing ${queue.length} keys with ${DEFAULT_MODEL}`);
        const chunks = chunkArray(queue, DEFAULT_BATCH_SIZE);

        for (let index = 0; index < chunks.length; index += 1) {
            const batchPaths = chunks[index];
            const payload = Object.fromEntries(
                batchPaths.map(pathKey => [pathKey, getByPath(locales[SOURCE_LOCALE], pathKey)])
            );

            console.log(`  batch ${index + 1}/${chunks.length}`);
            const translated = await translateBatch({
                apiKey,
                model: DEFAULT_MODEL,
                targetLocale: locale,
                payload
            });

            for (const [pathKey, value] of Object.entries(translated)) {
                setByPath(locales[locale], pathKey, value);
                meta.locales[locale] ||= {};
                meta.locales[locale][pathKey] = {
                    sourceHash: hashValue(String(getByPath(locales[SOURCE_LOCALE], pathKey))),
                    updatedAt: new Date().toISOString(),
                    mode: 'sync'
                };
            }
        }

        saveJson(path.join(LOCALES_DIR, `${locale}.json`), locales[locale]);
    }

    saveJson(META_FILE, meta);
}

async function main() {
    if (!SUPPORTED_LOCALES.includes(SOURCE_LOCALE)) {
        throw new Error(`Unsupported source locale: ${SOURCE_LOCALE}`);
    }

    const { command, options } = parseArgs(process.argv.slice(2));
    const targets = getTargetLocales(options);
    const locales = loadLocales();
    const meta = loadMeta();

    if (command === 'baseline') {
        markCurrentTranslations(locales, meta, targets, 'baseline');
        saveJson(META_FILE, meta);
        console.log(`Baseline saved for: ${targets.join(', ')}`);
        return;
    }

    if (command === 'sync') {
        await runSync(locales, meta, targets);
        console.log('Translation sync completed.');
        return;
    }

    if (command === 'report') {
        const hasIssues = printReport(locales, meta, targets);
        process.exitCode = hasIssues ? 1 : 0;
        return;
    }

    throw new Error(`Unknown command: ${command}`);
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
