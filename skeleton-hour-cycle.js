const testFolder = './tests/';
const fs = require('fs');
const path = require('path');

const localesPath = "./cldr-json/cldr-dates-full/main";

const reports = {}
const counts = {
 h: 0,
 H: 0,
 k: 0,
 K: 0,
 j: 0,
 J: 0,
};

const skeletonLetters = new Set();
const patternLetters = new Set();

for (const locale of fs.readdirSync(localesPath)) {
  const calendarPath = path.join(localesPath, locale, "ca-gregorian.json");
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const { availableFormats } = calendar.main[locale].dates.calendars.gregorian.dateTimeFormats
  let h = false;
  let H = false;
  let k = false;
  let K = false;
  let j = false;
  let J = false;

  for (let [skeleton, pattern] of Object.entries(availableFormats)) {
    const bareSkeleton = skeleton.split('-')[0];
    // console.log({ pattern, replaced: pattern.replaceAll(/'.*?'/g, '')});
    pattern = pattern.replaceAll(/'.*?'/g, '');
    const hFlag = pattern.includes('h');
    const HFlag = pattern.includes('H');
    const kFlag = pattern.includes('k');
    const KFlag = pattern.includes('K');
    const jFlag = pattern.includes('j');
    const JFlag = pattern.includes('J');

    h = h || (hFlag ? pattern : false);
    H = H || (HFlag ? pattern : false);
    k = k || (kFlag ? pattern : false);
    K = K || (KFlag ? pattern : false);
    j = j || (jFlag ? pattern : false);
    J = J || (JFlag ? pattern : false);

    for (const letter of bareSkeleton.split('')) {
      skeletonLetters.add(letter)
    }
    for (const letter of pattern.split('')) {
      patternLetters.add(letter)
    }
  }

  if ((h || H) && (k || K)) {
    console.log('!!! mixed', locale, availableFormats);

    throw new Error("mixed")
  } else {
    console.log(`!!! H: ${Boolean(h || H)} K: ${Boolean(k || K)} K: ${Boolean(j || J)}`);
  }

  counts.h += h ? 1 : 0;
  counts.H += H ? 1 : 0;
  counts.k += k ? 1 : 0;
  counts.K += K ? 1 : 0;
  counts.j += j ? 1 : 0;
  counts.J += J ? 1 : 0;

  reports[locale] = {h, H, k, K, j, J};
}

function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

console.log('Reports', reports);
console.log('Counts', counts);
console.log('skeletonLetters', [...skeletonLetters].sort((a,b) => a.localeCompare(b)));
console.log('patternLetters', [...patternLetters].sort((a,b) => a.localeCompare(b)).filter(isASCII));

return;

patternletters = [
  'a',
  'B',
  'c',
  'd',
  'E',
  'G',
  'h',
  'H',
  'K',
  'L',
  'm',
  'M',
  'Q',
  's',
  'v',
  'w',
  'W',
  'y',
  'Y',
  'Z'
]

all_symbols=[
  'a', // done
  'A', // Not supported
  'b', // done
  // 'B',
  // 'c',
  'C', // input skeleton
  // 'd',
  'D', // day of year
  'e',
  // 'E',
  'F',
  'g',
  // 'G',
  // 'h',
  // 'H',
  'j',
  'J',
  'k',
  'K',
  'L',
  // 'm',
  // 'M',
  'O',
  'q',
  // 'Q',
  'r',
  // 's',
  'S',
  'u',
  'U',
  // 'v',
  'V',
  // 'w',
  // 'W',
  'x',
  'X',
  // 'y',
  'Y',
  'z',
  // 'Z'
]

all_skeletons=[
  'B',
  'c',
  'd',
  'E',
  'G',
  'h',
  'H',
  'm',
  'M',
  'Q',
  's',
  'v',
  'w',
  'W',
  'y',
  'Z'
]
