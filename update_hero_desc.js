const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const updates = {
    'tr.json': "Keçi kılı teknolojisiyle geliştirilen Marterm ses ve termal yalıtım keçeleri, yapılarda doğal konfor ve yüksek performans sunar.",
    'en.json': "Marterm sound and thermal insulation felts, developed with goat hair technology, offer natural comfort and high performance in buildings.",
    'es.json': "Los fieltros de aislamiento acústico y térmico Marterm, desarrollados con tecnología de pelo de cabra, ofrecen confort natural y alto rendimiento en las construcciones.",
    'ru.json': "Звуко- и теплоизоляционные войлоки Marterm, разработанные с использованием технологии козьей шерсти, обеспечивают естественный комфорт и высокую эффективность в зданиях.",
    'ar.json': "توفر لبادات العزل الصوتي والحراري من Marterm، المطورة بتقنية شعر الماعز، راحة طبيعية وأداءً عاليًا في المباني."
};

for (const [file, text] of Object.entries(updates)) {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.products_page) {
            data.products_page.hero_desc = text;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        }
    }
}
console.log('Update complete.');
