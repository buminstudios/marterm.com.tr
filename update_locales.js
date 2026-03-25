const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const updates = {
    'tr.json': {
        v_thermal: 'Isıl İletkenlik',
        v_tensile: 'Kopma Mukavemeti',
        v_sound: 'Ort. Ses Yutumu',
        v_res: 'Isıl Direnç'
    },
    'en.json': {
        v_thermal: 'Thermal Conductivity',
        v_tensile: 'Tensile Strength',
        v_sound: 'Avg. Sound Absorp.',
        v_res: 'Thermal Resistance'
    },
    'es.json': {
        v_thermal: 'Conductividad Tér.',
        v_tensile: 'Resist. a Tracción',
        v_sound: 'Absorción Acúst.',
        v_res: 'Resistencia Tér.'
    },
    'ru.json': {
        v_thermal: 'Теплопроводность',
        v_tensile: 'Прочность на разрыв',
        v_sound: 'Звукопоглощение',
        v_res: 'Теплосопротивление'
    },
    'ar.json': {
        v_thermal: 'التوصيل الحراري',
        v_tensile: 'قوة الشد',
        v_sound: 'امتصاص الصوت',
        v_res: 'المقاومة الحرارية'
    }
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.products_page) {
        const fileUpdates = updates[file];
        if (fileUpdates) {
            data.products_page.v_thermal = fileUpdates.v_thermal;
            data.products_page.v_tensile = fileUpdates.v_tensile;
            data.products_page.v_sound = fileUpdates.v_sound;
            data.products_page.v_res = fileUpdates.v_res;
        }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
});
console.log('Locales updated successfully!');
