const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download: ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${path.basename(dest)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

const images = [
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', file: 'hero-bg.jpg' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r1', file: 'r1.svg' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r2', file: 'r2.svg' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r3', file: 'r3.svg' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r4', file: 'r4.svg' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager', file: 'Manager.svg' },
];

const seeds = [
    'Анастасия Курчева', 'Елена Соколова', 'Руслан Хабибуллин', 'Виктория Ким',
    'Мария С.', 'Иван К.', 'Сергей П.', 'Анна В.', 'Лилия М.', 'Тимур Г.', 'Олег Б.', 'Нина Д.'
];

seeds.forEach(seed => {
    images.push({
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`,
        file: `${seed}.svg`
    });
});

async function run() {
    for (const img of images) {
        await download(img.url, path.join(dir, img.file)).catch(console.error);
    }
    console.log('All downloads finished');
}

run();
