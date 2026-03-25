const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const updates = {
    'tr.json': {
        areas_desc: "Villa, apartman, endüstriyel yapı ve özel uygulama alanlarında, keçi kılı teknolojisiyle geliştirilen doğal yalıtım çözümleri.",
        floor_desc: "Şap altı, parke altı, yerden ısıtma sistemleri altında ve asma tavan aralarında uygulanır. Zemin yalıtımlarında halı altı ısı yalıtımı olarak da tercih edilir.",
        prefab_desc: "Prefabrik yapılarda, konteyner evlerde, çadır ve karavan yalıtımında hafif ve esnek çözüm. Aynı zamanda karavanlarda, araçlarda ve otomotiv sektöründe de kullanılabilir."
    },
    'en.json': {
        areas_desc: "Natural insulation solutions developed with goat hair technology for villas, apartments, industrial buildings, and special applications.",
        floor_desc: "Applied under screed, parquet, underfloor heating systems, and in suspended ceilings. It is also preferred as under-carpet thermal insulation for floors.",
        prefab_desc: "Light and flexible solution for prefab buildings, container homes, tents, and caravan insulation. It can also be used in caravans, vehicles, and the automotive sector."
    },
    'es.json': {
        areas_desc: "Soluciones de aislamiento natural desarrolladas con tecnología de pelo de cabra para villas, apartamentos, edificios industriales y áreas especiales.",
        floor_desc: "Se aplica bajo regla, parquet, sistemas de calefacción por suelo radiante y techos suspendidos. También se prefiere como aislamiento térmico bajo alfombra para pisos.",
        prefab_desc: "Solución ligera y flexible para construcciones modulares, casas contenedor, carpas y aislamiento de caravanas. También se puede utilizar en caravanas, vehículos y el sector de la automoción."
    },
    'ru.json': {
        areas_desc: "Естественные решения для изоляции, разработанные с использованием технологии козьей шерсти для вилл, квартир, промышленных зданий и специальных областей.",
        floor_desc: "Применяется под стяжкой, паркетом, системами теплого пола и в подвесных потолках. Также предпочтителен в качестве теплоизоляции под ковром для полов.",
        prefab_desc: "Легкое и гибкое решение для сборных зданий, контейнерных домов, палаток и изоляции караванов. Также может применяться в автофургонах, транспортных средствах и автомобильном секторе."
    },
    'ar.json': {
        areas_desc: "حلول عزل طبيعية مطورة بتقنية شعر الماعز للفلل، والشقق، والمباني الصناعية ومجالات التطبيق الخاصة.",
        floor_desc: "يستخدم تحت التبليط، والباركيه، وأنظمة التدفئة الأرضية، والأسقف المعلقة. يُفضل أيضًا كعزل حراري تحت السجاد للأرضيات.",
        prefab_desc: "حل خفيف ومرن للمباني الجاهزة، ومنازل الحاويات، والخيام، وعزل الكرفانات. يمكن استخدامه أيضًا في الكرفانات والسيارات وقطاع السيارات."
    }
};

for (const [file, values] of Object.entries(updates)) {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Update Products Page Desc
        if (data.products_page) {
            data.products_page.areas_desc = values.areas_desc;
            if (data.products_page.areas) {
                data.products_page.areas.floor_desc = values.floor_desc;
                data.products_page.areas.prefab_desc = values.prefab_desc;
            }
        }
        
        // Update Home Page equivalent boxes (since home page also uses areas)
        if (data.home_page) {
            data.home_page.area_floor_desc = values.floor_desc;
            data.home_page.area_prefab_desc = values.prefab_desc;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}
console.log('Update boxes complete.');
