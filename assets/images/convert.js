const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = __dirname;
const files = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

// Max dimensions based on actual display size on website (with 2x for retina)
const sizeMap = {
    'hero-bg-delhi-skyline': { width: 1920, height: 1080 },  // full-width hero bg
    'hero-car': { width: 1200, height: 675 },                // hero car visual
    'fleet-bg-road': { width: 1920, height: 1080 },          // full-width bg
    'cta-bg-delhi-night': { width: 1920, height: 1080 },     // full-width cta bg
    'why-us-bg-landmarks': { width: 1920, height: 1080 },    // full-width bg
    'service-delhi-sightseeing': { width: 800, height: 600 }, // card image
    'service-outstation-tours': { width: 800, height: 600 },  // card image
    'service-airport-transfer': { width: 800, height: 600 },  // card image
    'car-dzire': { width: 800, height: 500 },                 // fleet card
    'car-ertiga': { width: 800, height: 500 },                // fleet card
    'car-crysta': { width: 800, height: 500 },                // fleet card
    'pkg-delhi-fullday': { width: 800, height: 600 },         // package card
    'pkg-agra-daytrip': { width: 800, height: 600 },          // package card
    'pkg-jaipur-daytrip': { width: 800, height: 600 },        // package card
    'pkg-vrindavan-mathura': { width: 800, height: 600 },     // package card
};

(async () => {
    let totalOriginal = 0;
    let totalConverted = 0;

    for (const file of files) {
        const input = path.join(imageDir, file);
        const baseName = file.replace(/\.(jpg|png)$/, '');
        const outputWebp = path.join(imageDir, baseName + '.webp');
        const dims = sizeMap[baseName] || { width: 1200, height: 900 };

        try {
            // Create resized WebP
            await sharp(input)
                .resize(dims.width, dims.height, { fit: 'cover', withoutEnlargement: true })
                .webp({ quality: 82, effort: 6 })
                .toFile(outputWebp);

            // Also create optimized JPG (resized, re-compressed) as fallback
            const optimizedJpg = path.join(imageDir, baseName + '-opt.jpg');
            await sharp(input)
                .resize(dims.width, dims.height, { fit: 'cover', withoutEnlargement: true })
                .jpeg({ quality: 82, progressive: true, mozjpeg: true })
                .toFile(optimizedJpg);

            const origSize = fs.statSync(input).size;
            const webpSize = fs.statSync(outputWebp).size;
            const jpgOptSize = fs.statSync(optimizedJpg).size;
            totalOriginal += origSize;
            totalConverted += webpSize;

            // Replace original with optimized JPG
            fs.unlinkSync(input);
            fs.renameSync(optimizedJpg, input);

            const savingsWebp = (((origSize - webpSize) / origSize) * 100).toFixed(0);
            const savingsJpg = (((origSize - jpgOptSize) / origSize) * 100).toFixed(0);
            console.log(`✅ ${file}: ${(origSize / 1024).toFixed(0)}KB → WebP: ${(webpSize / 1024).toFixed(0)}KB (${savingsWebp}%) | JPG: ${(jpgOptSize / 1024).toFixed(0)}KB (${savingsJpg}%)`);
        } catch (err) {
            console.error(`❌ ${file}: ${err.message}`);
        }
    }

    console.log(`\n📊 TOTAL ORIGINAL: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`📊 TOTAL WEBP: ${(totalConverted / 1024 / 1024).toFixed(2)}MB (${(((totalOriginal - totalConverted) / totalOriginal) * 100).toFixed(0)}% saved)`);
})();
