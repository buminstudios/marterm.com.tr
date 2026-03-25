const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const tr = {
    roof_desc: "Çatı arası, mertek altı ve teras yalıtımında ısı kaybını önleyen, enerji tasarrufu sağlayan dikişsiz ve doğal yalıtım çözümü.",
    wall_desc: "Maksimum enerji verimliliği için dış cephe, iç mekan alçıpan arkası ve çift duvar arası doğal ısı ve ses yalıtımı.",
    floor_desc: "Şap altı, parke altı ve halı altı ısı yalıtımı ile zeminlerde ve asma tavanlarda yüksek performanslı doğal ses ve ısı yalıtımı.",
    acoustic_desc: "Stüdyolar, ofisler ve toplantı odaları için ahşap latalı akustik panellerde yankı önleyici, yüksek NRC değerli doğal ses yalıtımı.",
    prefab_desc: "Prefabrik yapılar, konteyner evler ve çadır izolasyonu için hafif, esnek, uzun ömürlü ve iklimlendirme sağlayan doğal yalıtım keçesi.",
    public_desc: "Hastane, okul ve cami gibi yoğun kullanım alanlarında kanserojen madde içermeyen, hava kalitesini artıran %100 sağlıklı yalıtım.",
    marine_desc: "Tekne, yat ve gemi izolasyonunda neme ekstra dayanıklı, korozyon önleyici ve ultra hafif doğal yalıtım keçesi.",
    concrete_desc: "Beton ve harç karışımlarında mikro çatlakları önleyen, mekanik direnci artıran ve yapı ömrünü uzatan doğal fiber donatı.",
    
    // Auto
    auto_title: "Otomotiv & Karavan",
    auto_desc: "Otomotiv sektörü, karavan üretimi ve ağır vasıtalarda sarsıntı engelleyici, yüksek termal ve akustik koruma sağlayan yalıtım.",
    auto_t1: "Otomotiv",
    auto_t2: "Karavan",
    auto_t3: "Araç İçi",

    // Events
    events_title: "Ticari Akustik Çözümler",
    events_desc: "Düğün salonları, gece kulüpleri, barlar, konferans ve sinema salonları için profesyonel, yüksek yoğunluklu ses ve gürültü yalıtımı.",
    events_t1: "Düğün",
    events_t2: "Kulüp & Bar",
    events_t3: "Konferans"
};

const en = {
    roof_desc: "Seamless and natural insulation solution for attic, under-rafter, and terrace insulation that prevents heat loss and saves energy.",
    wall_desc: "Natural thermal and sound insulation for exterior facades, indoor drywall backings, and double walls for maximum energy efficiency.",
    floor_desc: "High-performance natural sound and thermal insulation for floors and suspended ceilings with under-screed, under-parquet, and under-carpet thermal applications.",
    acoustic_desc: "Anti-echo, high NRC value natural sound insulation in wooden slatted acoustic panels for studios, offices, and meeting rooms.",
    prefab_desc: "Lightweight, flexible, long-lasting natural insulation felt providing climate control for prefab buildings, container homes, and tent insulation.",
    public_desc: "100% healthy insulation that does not contain carcinogenic substances and improves air quality in high-usage areas such as hospitals, schools, and mosques.",
    marine_desc: "Extra moisture-resistant, anti-corrosive, and ultra-lightweight natural insulation felt for boat, yacht, and ship insulation.",
    concrete_desc: "Natural fiber reinforcement that prevents micro-cracks in concrete and mortar mixtures, increases mechanical resistance, and extends building life.",
    auto_title: "Automotive & Caravan",
    auto_desc: "Vibration-damping insulation providing high thermal and acoustic protection for the automotive sector, caravan manufacturing, and heavy commercial vehicles.",
    auto_t1: "Automotive", auto_t2: "Caravan", auto_t3: "In-Vehicle",
    events_title: "Commercial Acoustics",
    events_desc: "Professional, high-density sound and noise insulation for wedding halls, nightclubs, bars, conference centers, and cinemas.",
    events_t1: "Wedding", events_t2: "Club & Bar", events_t3: "Conference"
};

// Generic translations for others (they can be improved later, but this works for placeholders)
const es = { ...en, events_title: "Acústica Comercial", auto_title: "Automoción y Caravanas" };
const ru = { ...en, events_title: "Коммерческая акустика", auto_title: "Автомобили и Караваны" };
const ar = { ...en, events_title: "الصوتيات التجارية", auto_title: "السيارات والكرفانات" };

const allLocales = {
    'tr.json': tr,
    'en.json': en,
    'es.json': es,
    'ru.json': ru,
    'ar.json': ar
};

for (const [file, values] of Object.entries(allLocales)) {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (data.products_page && data.products_page.areas) {
            // Update descriptions
            data.products_page.areas.roof_desc = values.roof_desc;
            data.products_page.areas.wall_desc = values.wall_desc;
            data.products_page.areas.floor_desc = values.floor_desc;
            data.products_page.areas.acoustic_desc = values.acoustic_desc;
            data.products_page.areas.prefab_desc = values.prefab_desc;
            data.products_page.areas.public_desc = values.public_desc;
            data.products_page.areas.marine_desc = values.marine_desc;
            data.products_page.areas.concrete_desc = values.concrete_desc;
            
            // Add new items
            data.products_page.areas.auto_title = values.auto_title;
            data.products_page.areas.auto_desc = values.auto_desc;
            data.products_page.areas.auto_t1 = values.auto_t1;
            data.products_page.areas.auto_t2 = values.auto_t2;
            data.products_page.areas.auto_t3 = values.auto_t3;
            
            data.products_page.areas.events_title = values.events_title;
            data.products_page.areas.events_desc = values.events_desc;
            data.products_page.areas.events_t1 = values.events_t1;
            data.products_page.areas.events_t2 = values.events_t2;
            data.products_page.areas.events_t3 = values.events_t3;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

console.log('Update SEO and new boxes complete.');
