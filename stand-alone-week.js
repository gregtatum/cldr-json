/**
 * Run with `node stand-alone-week.js`
 */

const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";
const patternsWithC = new Set();

console.log("Patterns that contain the stand alone week field:");

for (const locale of fs.readdirSync(localesPath)) {
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats

  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    const patternFields = pattern.replaceAll(/'.*?'/g, '');
    if (patternFields.match(/c/)) {
      console.log({ locale, bareSkeleton, pattern });
      patternsWithC.add(pattern);
    }
  }
}

console.log("\nUnique patterns with the stand alone week field:");

console.log({patternsWithC});
