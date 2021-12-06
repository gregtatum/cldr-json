const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";
const skeletons = {};
const patternsBySkeleton = {}


for (const locale of fs.readdirSync(localesPath)) {
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats

  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    let patterns = patternsBySkeleton[bareSkeleton];
    if (!patterns) {
      patterns = {};
      patternsBySkeleton[bareSkeleton] = patterns;
    }
    patterns[locale] = pattern;
  }
}

console.log({patternsBySkeleton});
