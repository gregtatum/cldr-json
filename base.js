const testFolder = './tests/';
const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";
const skeletons = {};

for (const locale of fs.readdirSync(localesPath)) {
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats

  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    skeletons[skeleton] = (skeletons[skeleton] || 0) + 1;
  }
}

console.log({skeletons});
