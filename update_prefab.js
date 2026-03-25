const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const updates = {
    'tr.json': {
        prefab_desc: "Prefabrik yapılar, konteynerler, bungalovlar, ağaç evler ve çadır izolasyonu için hafif, esnek ve nefes alan doğal yalıtım keçesi.",
        prefab_t3: "Bungalov"
    },
    'en.json': {
        prefab_desc: "Lightweight, flexible, and breathable natural insulation felt for prefab buildings, containers, bungalows, treehouses, and tents.",
        prefab_t3: "Bungalow"
    },
    'es.json': {
        prefab_desc: "Fieltro de aislamiento natural ligero, flexible y transpirable para construcciones prefabricadas, contenedores, bungalows, casas en los árboles y tiendas de campaña.",
        prefab_t3: "Bungalow"
    },
    'ru.json': {
        prefab_desc: "Легкий, гибкий и дышащий натуральный изоляционный войлок для сборных зданий, контейнеров, бунгало, домиков на деревьях и палаток.",
        prefab_t3: "Бунгало"
    },
    'ar.json': {
        prefab_desc: "لباد عزل طبيعي خفيف ومرن وقابل للتنفس للمباني الجاهزة، والحاويات، والأكواخ (بنغل)، وبيوت الشجر، والخيام.",
        prefab_t3: "بنغل"
    }
};

for (const [file, values] of Object.entries(updates)) {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (data.products_page && data.products_page.areas) {
            data.products_page.areas.prefab_desc = values.prefab_desc;
            data.products_page.areas.prefab_t3 = values.prefab_t3;
        }
        
        if (data.home_page) {
            data.home_page.area_prefab_desc = values.prefab_desc;
            data.home_page.area_prefab_t3 = values.prefab_t3;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}
console.log('Update prefab texts complete.');
