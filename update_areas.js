const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const updates = {
    'tr.json': {
        areas_title: "Her Yapıda",
        areas_title_accent: "Doğal Yalıtım",
        areas_desc: "Villa, apartman, endüstriyel yapı ve özel uygulama alanlarında, keçi kılı teknolojisiyle geliştirilen doğal yalıtım çözümleri. Zemin yalıtımlarına halı altı ısı yalıtım altı. Aynı zamanda karavanlarda, araçlarda otomotiv sektöründe de kullanılabilir."
    },
    'en.json': {
        areas_title: "In Every Structure",
        areas_title_accent: "Natural Insulation",
        areas_desc: "Natural insulation solutions developed with goat hair technology for villas, apartments, industrial buildings, and special applications. Under-carpet thermal insulation for floors. It can also be used in caravans, vehicles, and the automotive sector."
    },
    'es.json': {
        areas_title: "En Cada Estructura",
        areas_title_accent: "Aislamiento Natural",
        areas_desc: "Soluciones de aislamiento natural desarrolladas con tecnología de pelo de cabra para villas, apartamentos, edificios industriales y áreas especiales. Aislamiento térmico bajo alfombra para pisos. También se puede utilizar en caravanas, vehículos y el sector de la automoción."
    },
    'ru.json': {
        areas_title: "В Каждом Здании",
        areas_title_accent: "Естественная Изоляция",
        areas_desc: "Естественные решения для изоляции, разработанные с использованием технологии козьей шерсти для вилл, квартир, промышленных зданий и специальных областей. Теплоизоляция под ковром для полов. Также может использоваться в автофургонах, транспортных средствах и автомобильном секторе."
    },
    'ar.json': {
        areas_title: "في كل مبنى",
        areas_title_accent: "عزل طبيعي",
        areas_desc: "حلول عزل طبيعية مطورة بتقنية شعر الماعز للفلل، والشقق، والمباني الصناعية. عزل حراري تحت السجاد للأرضيات. كما يمكن استخدامه في الكرفانات والسيارات وقطاع المركبات."
    }
};

for (const [file, values] of Object.entries(updates)) {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.products_page) {
            data.products_page.areas_title = values.areas_title;
            data.products_page.areas_title_accent = values.areas_title_accent;
            data.products_page.areas_desc = values.areas_desc;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        }
    }
}
console.log('Update areas complete.');
