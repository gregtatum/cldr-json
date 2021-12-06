const testFolder = './tests/';
const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";
const skeletons = {};
const patternByteLengths = {}
let patternCount = 0;
let localeCount = 0;
let variantCount = 0;
let skeletonCount = 0;
const variantDistribution = {}
const skeletonSizeDistributions = {}


for (const locale of fs.readdirSync(localesPath)) {
  localeCount++;
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats
  const skeletonVariantCount = new Map();

  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    skeletonVariantCount.set(bareSkeleton, (skeletonVariantCount.get(bareSkeleton) || 0) + 1);
    skeletons[skeleton] = (skeletons[skeleton] || 0) + 1;
    const bytes = Buffer.byteLength(pattern, 'utf8');
    patternByteLengths[bytes] = (patternByteLengths[bytes] || 0) + 1;
    patternCount++;

    skeletonSizeDistributions[bareSkeleton.length] = (skeletonSizeDistributions[bareSkeleton.length] || 0) + 1;
  }

  for (const [skeleton, count] of skeletonVariantCount) {
    if (count > 0) {
      variantCount++;
    }
    variantDistribution[count] = (variantDistribution[count] || 0) + 1
    skeletonCount++;
  }
}

const variantPercentage = variantCount / skeletonCount;
console.log({localeCount, skeletons, patternByteLengths, variantCount, variantPercentage, variantDistribution, skeletonSizeDistributions});

const sortedPatternLengthEntries = Object.entries(patternByteLengths).sort(([a],[b]) => a - b);
let accumulatedCount = 0;
const countTarget = 0.99 * patternCount;
for (const [patternByteLengths, count] of sortedPatternLengthEntries) {
  accumulatedCount += count;
  console.log(`Pattern length: ${patternByteLengths}, ${accumulatedCount / patternCount}%`);
  if (accumulatedCount > countTarget) {
    console.log("Acceptable length of >99% of patterns", patternByteLengths)
    break;
  }
}
