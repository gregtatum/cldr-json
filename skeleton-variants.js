const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";
const skeletonVariants = new Map();

for (const locale of fs.readdirSync(localesPath)) {
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats

  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const parts = skeleton.split('-');
    const bareSkeleton = parts[0]
    const variant = parts.slice(1).join('-')

    // Do an analysis of how many unique variants there are.
    const tag = locale + ', ' + bareSkeleton;
    let variants = skeletonVariants.get(tag);
    if (!variants) {
      variants = {
        variants: [],
        uniquePatterns: new Set(),
      }
      skeletonVariants.set(tag, variants);
    }
    variants.uniquePatterns.add(pattern);
    variants.variants.push({
      locale, bareSkeleton, skeleton, pattern, variant
    })
  }
}

// Output the analysis of the skeleton variants.
for (const variant of skeletonVariants.values()) {
  // console.log(variant);
  if (variant.uniquePatterns.size !== 1) {
    console.log(variant);
  }
}

// Output the analysis of the skeleton variants.
for (const variant of skeletonVariants.values()) {
  if (variant.uniquePatterns.size !== 1) {
    for (const v of variant.variants) {
      console.log(`| ${v.locale} | ${v.skeleton} | ${v.pattern} |`);
    }
  }
}
