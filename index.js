const profanity = require('./rude.json');

const matchWords = profanity.match.map(normalise);
const matchesLength = matchWords.length;

const containWords = profanity.contain.map(normalise);
const containsLength = containWords.length;

const whitelist = profanity.whitelist.map(normalise)

 // this will be a bad idea if multi word matches get too large. Try and use singular matches instead.
const multiWordMatchesExp = new RegExp(profanity.multi.join('|'), 'ig');
const asianChars = /[\u1100-\u11FF\u2E80-\u2EFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uFE30-\uFE4F]/;

const suffixes = ["s", "ing", "ed", "able", "er", "ers", "y", "ey", "eys", "ling", "lings", "ly", "ish",
                  "aholic", "aholics", "ful", "less", "oid", "ology", "ous", "uous" ]; // ies

function rude (str, returnWords=false) {

    let profane = false;
    let restrictedWords = [];

    const multiWordMatches = str.match(multiWordMatchesExp);

    if (multiWordMatches) {
        profane = true;
        restrictedWords = restrictedWords.concat(multiWordMatches);
    }

    // if no full text matches check all words
    if(profane === false) {
        const words = str.split(' ');
        words.forEach((word) => {
            // remove symbols
            word = normalise(word);

            if (whitelist.indexOf(word) > -1) return;

            // ignore short words unless they're asian.
            if (word.length < 3 && asianChars.test(word) == false) {
                return
            }

            let isRude = false;

            for(i=0; i < matchesLength; i++) {
                // this would be faster to look up as a key in an object literal
                // but it would negate the ability to check for suffix matches
                const cussWord = matchWords[i];

                if (word === cussWord || word.startsWith(cussWord) && suffixes.indexOf(word.slice(cussWord.length)) > -1) {
                    isRude = true;
                    profane = true;
                    restrictedWords.push(word)
                    break; // don't search the rest of the black list
                }
            }

             // only check for contains match if we don't already hae an exact match
            if (! isRude) {
                for(i=0; i < containsLength; i++) {
                    if (word.indexOf(normalise(containWords[i])) > -1 ) {
                        profane = true;
                        restrictedWords.push(word)
                        break; // don't search the rest of the black list
                    }
                }
            }
        });
    }

    // if no bad words found check the entire string for spaced out swears or seperated by non digit chars
    if(profane === false) {
        const multipleSingleLetterWords = /(\b[\w\d][^\w\d]\b){2,}./g;
        const matches = str.match(multipleSingleLetterWords);
        if (matches !== null) {
            matches.forEach(match => {
                if (rude(match.replace(/[^\w\d]/g, ''))) {
                    profane = true;
                    restrictedWords.push(match);
                }
            });
        }
    }

    return returnWords ? { profane: profane, words: restrictedWords.filter(unique) } : profane;
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
