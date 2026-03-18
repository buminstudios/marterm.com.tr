const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const LOCALES_DIR = path.join(__dirname, 'locales');
const BUILD_DIR = __dirname; // root

// Desteklenen diller
const languages = ['tr', 'en', 'es', 'ru', 'ar'];
const RTL_LANGUAGES = new Set(['ar']);

// JSON baglantilari
const translations = {};
languages.forEach(lang => {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    if(fs.existsSync(filePath)){
        translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
        translations[lang] = {};
    }
});

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            getHtmlFiles(path.join(dir, file), fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

function getNestedValue(obj, objPath) {
    if (!objPath) return undefined;
    return objPath.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function extractTemplateKeys(content) {
    const keys = new Set();
    const keyRegex = /\{\{\{?\s*([\w.]+)\s*\}\}\}?/g;

    for (const match of content.matchAll(keyRegex)) {
        keys.add(match[1]);
    }

    return keys;
}

function validateSourceLocale(htmlFiles) {
    const missing = [];

    for (const srcFile of htmlFiles) {
        const content = fs.readFileSync(srcFile, 'utf-8');
        for (const key of extractTemplateKeys(content)) {
            if (getNestedValue(translations.tr, key) === undefined) {
                missing.push({
                    file: path.relative(__dirname, srcFile),
                    key
                });
            }
        }
    }

    if (!missing.length) return;

    console.error('Build failed: source templates reference keys missing from locales/tr.json');
    for (const item of missing.slice(0, 60)) {
        console.error(`  - ${item.file}: ${item.key}`);
    }
    if (missing.length > 60) {
        console.error(`  ... ${missing.length - 60} more`);
    }
    process.exit(1);
}

function prefixLocalizedLinks(content, lang) {
    if (lang === 'tr') return content;

    return content.replace(/href="(\/[^"]*)"/g, (match, href) => {
        if (
            href === '/' ||
            /^\/pages\/.+\.html(?:[?#].*)?$/i.test(href)
        ) {
            const prefixed = href === '/' ? `/${lang}/` : `/${lang}${href}`;
            return `href="${prefixed}"`;
        }
        return match;
    });
}

function build() {
    const htmlFiles = getHtmlFiles(SRC_DIR);
    validateSourceLocale(htmlFiles);

    languages.forEach(lang => {
        console.log(`Building for ${lang}...`);
        const isDefault = lang === 'tr';
        // Tr kök dizinde, digerleri /en/, /es/ vb altinda
        const outDir = isDefault ? BUILD_DIR : path.join(BUILD_DIR, lang); 
        
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        
        // nested directories for non-default lang (like pages/)
        if(!isDefault && !fs.existsSync(path.join(outDir, 'pages'))) {
           fs.mkdirSync(path.join(outDir, 'pages'), { recursive: true });
        }

        htmlFiles.forEach(srcFile => {
            let content = fs.readFileSync(srcFile, 'utf-8');
            
            // 1. Triple brace replaced securely (HTML allowed) -> {{{ hero.title }}}
            content = content.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (match, key) => {
                const trVal = getNestedValue(translations[lang], key);
                const fallbackVal = getNestedValue(translations['tr'], key);
                const val = trVal !== undefined ? trVal : fallbackVal;
                return val !== undefined && val !== null ? String(val) : key;
            });

            // 2. Double brace replaced securely (Plain Text) -> {{ hero.subtitle }}
            content = content.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
                const trVal = getNestedValue(translations[lang], key);
                const fallbackVal = getNestedValue(translations['tr'], key);
                let res = trVal !== undefined ? trVal : fallbackVal;
                if (res === undefined || res === null) res = key;
                if(typeof res === 'string') {
                    res = res.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                return res; 
            });

            // 3. Update HTML lang tag
            content = content.replace(/<html[^>]*lang="[^"]*"[^>]*>/i, match => {
                let next = match.replace(/lang="[^"]*"/, `lang="${lang}"`);
                if (RTL_LANGUAGES.has(lang)) {
                    if (/dir="[^"]*"/i.test(next)) {
                        next = next.replace(/dir="[^"]*"/i, 'dir="rtl"');
                    } else {
                        next = next.replace('<html', '<html dir="rtl"');
                    }
                } else {
                    next = next.replace(/\sdir="[^"]*"/i, '');
                }
                return next;
            });

            content = prefixLocalizedLinks(content, lang);

            // 4. Update relative link paths in the subfolders.
            // If the output is in /en/ and the link was `href="pages/urunler.html"`, we don't need to change it because
            // the relative structure inside /en/ is exactly the same as in root. 
            // BUT if there is a link to the root like `href="index.html"`, we might need to be careful. 
            // In our structure, `/en/index.html` connects to `/en/pages/urunler.html`, which is perfect.

            const relativePath = path.relative(SRC_DIR, srcFile);
            const outFile = path.join(outDir, relativePath);
            
            fs.writeFileSync(outFile, content);
        });
    });
    console.log("Build successfully completed!");
}

build();
