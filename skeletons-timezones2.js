const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-modern/main";
const tzPatterns = new Set(['v', 'V', 'z', 'Z', 'O', 'x', 'X'])

const validTimeZoneSkeletons = new Map();
const validTimeZonePatterns = new Set();
const timeZonesInLocale = new Set();

// Go through every locale in the CLDR data.
for (const locale of fs.readdirSync(localesPath)) {

  // Read in the data and extract the available formats.
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats

  const localeLetters = new Set()

  // Find any skeletons that have timezones.
  for (const [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    if (bareSkeleton.split('').some(letter => tzPatterns.has(letter))) {
      const count = validTimeZoneSkeletons.get(bareSkeleton) || 0;
      validTimeZoneSkeletons.set(bareSkeleton, count + 1);
      validTimeZonePatterns.add(pattern);


      for (const letter of tzPatterns) {
        if (pattern.indexOf(letter) != -1) {
          localeLetters.add(letter);
        }
      }
    }
  }

  timeZonesInLocale.add([...localeLetters].sort().join(''))
}

// Report out the results:
console.log({ validTimeZoneSkeletons, validTimeZonePatterns, timeZonesInLocale });
