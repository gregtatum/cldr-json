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
  const { timeFormats } = calendar.main[locale].dates.calendars.gregorian

  let h = false;
  let H = false;
  let k = false;
  let K = false;
  let j = false;
  let J = false;

  for (let [name, pattern] of Object.entries(timeFormats)) {
    // console.log({ pattern, replaced: pattern.replaceAll(/'.*?'/g, '')});
    pattern = pattern.replaceAll(/'.*?'/g, '');
    // console.log(pattern);
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

    for (const letter of pattern.split('')) {
      patternLetters.add(letter)
    }
  }

  const h11h12 = Boolean(h || K);
  const h23h24 = Boolean(k || H);

  if (h11h12 && h23h24) {
    console.log('!!! mixed', locale);
    throw new Error("mixed")
  } else {
    console.log(`!!! locale ${locale} h11h12: ${h11h12} h23h24: ${h23h24}`);
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

// console.log('Reports', reports);
// console.log('Counts', counts);
// console.log('skeletonLetters', [...skeletonLetters].sort((a,b) => a.localeCompare(b)));
// console.log('patternLetters', [...patternLetters].sort((a,b) => a.localeCompare(b)).filter(isASCII));
