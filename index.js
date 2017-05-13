const rudeWords = require('./rude.json');

const matchWords = rudeWords.match.map(normalise);
const matchesLength = matchWords.length;

const containWords = rudeWords.contain.map(normalise);
const containsLength = containWords.length;

const whitelist = rudeWords.whitelist.map(normalise)

 // this will be a bad idea if multi word matches get too large. Try and use singular matches instead.
const multiWordMatchesExp = new RegExp(rudeWords.multi.join('|'), 'ig');
const asianChars = /[\u1100-\u11FF\u2E80-\u2EFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uFE30-\uFE4F]/;

const suffixes = ["s", "ing", "ed", "able", "er", "ers", "y", "ey", "eys", "ling", "lings", "ly", "ish",
                  "aholic", "aholics", "ful", "less", "oid", "ology", "ous", "uous" ]; // ies

function rude (inputStr, returnWords=false) {

    if (typeof inputStr !== 'string') {
        throw "Input string is not a string";
    }

    let _rude = false; // this var holds the final determinant for if the string is rude
    let inputRudeWords = [];
    let listRudeWords = [];

    const str = inputStr.replace(/  +/g,' '); // make multiple spaces into single
    const multiWordMatches = str.match(multiWordMatchesExp);

    if (multiWordMatches) {
        _rude = true;
        inputRudeWords = inputRudeWords.concat(multiWordMatches);
        listRudeWords  = listRudeWords.concat(multiWordMatches);
    }

    // if no full text matches check all words
    if(_rude === false) {
        const words = str.split(' '); // .trim().split(/ +/)
        words.forEach((word) => {
            // remove symbols

            // if it looks like an email address split it
            if(/\b[^ @]+@[^ @\.]+\.[^ ]{2,10}\b/i.test(word)) {
                const emailWords = word.split(/(@|\.)/);
                emailWords.forEach(w => {
                    if (w.length > 2) {
                        let r = rude(w, true);
                        if (r.rude) {
                            _rude = true;
                            inputRudeWords.push(w);
                            listRudeWords  = listRudeWords.concat(r.words.list);
                        }
                    }
                });
                return;
            }

            word = normalise(word);

            if (whitelist.indexOf(word) > -1) return;

            // ignore short words unless they're asian.
            if (word.length < 3 && asianChars.test(word) == false) {
                return
            }

            let isRude = false; // this I dont even know if i need ths

            // Look for exact matches or matches with suffix
            for(i=0; i < matchesLength; i++) {
                // this would be faster to look up as a key in an object literal
                // but it would negate the ability to check for suffix matches
                const rudeWord = matchWords[i];

                if (word === rudeWord || word.startsWith(rudeWord) && suffixes.indexOf(word.slice(rudeWord.length)) > -1) {
                    isRude = true;
                    _rude = true;
                    inputRudeWords.push(word)
                    listRudeWords.push(rudeWord)
                    break; // don't search the rest of the black list after a match is found
                }
            }

             // only check for contains match if we don't already have an exact match
            if (! isRude) {
                for(i=0; i < containsLength; i++) {
                    if (word.indexOf(normalise(containWords[i])) > -1 ) {
                        _rude = true;
                        inputRudeWords.push(word)
                        listRudeWords.push(containWords[i])
                        break; // don't search the rest of the black list
                    }
                }
            }
        });
    }

    // if no bad words found check the entire string for spaced out swears or seperated by non digit chars
    if(_rude === false) {
        const multipleSingleLetterWords = /(\b[\w\d][^\w\d]\b){2,}./g;
        const matches = str.match(multipleSingleLetterWords);
        if (matches !== null) {
            matches.forEach(match => {
                let r = rude(match.replace(/[^\w\d]/g, ''), true);
                if (r.rude) {
                    _rude = true;
                    inputRudeWords.push(match);
                    listRudeWords = listRudeWords.concat(r.words.list);
                }
            });
        }
    }

    let wordsObj = {
      list: listRudeWords.filter(unique),
      input: inputRudeWords.filter(unique)
    };

    return returnWords ? {rude: _rude, words: wordsObj } : _rude;
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function normalise(word) {
    return word.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "") // remove unicode
        .replace(/[^\w\d\s]/g, "") // remove punctuation
        .replace(/(.)\1{2,}/g, "$1$1")// replace three or more consecutive chars with 2
        .toLowerCase();
}

module.exports = rude;


/*
Add worst words from other languages
*/
