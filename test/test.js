const chai = require('chai');
const expect = chai.expect;

// const rude = require('../src/index');
const rude = require('../dist/index');

const naughtyExamples = [
  "you a egg f-u-c-k",
  "bitchaleedoodle",
  "Donald is a master of bumology"
];

const goodExamples = [
  "i am so happy",
  "Everything is wonderful",
  "The assinine assassin is ok",
];

describe('rude', () => {

    it('finds bad words', () => {
        naughtyExamples.forEach(word => {
            expect(rude(word), word).to.be.true;
        })
    });

    it('returns false when no bad words found', () => {
        goodExamples.forEach(word => {
            expect(rude(word)).to.be.false;
        })
    })

    it('returns a detailed object when parameter 2 is true', () => {
        naughtyExamples.forEach(word => {
            expect(rude(word, true)).to.be.have.keys(['rude', 'words']);
        })
    })

    it('finds spaced out words', () => {
        naughtyExamples.forEach(word => {
            expect(rude("a big f u c k y o u. i hate you. s h i t")).to.be.true;
        })
    })

    it('breaks email addresses into component parts', () => {
        naughtyExamples.forEach(word => {
            expect(rude("fuck@yourfuckershitbitch.com", true).words.list).to.contain('fuck', 'shit', 'bitch');
        })
    })

    it('Picks up accented chars without having to add them to the blacklist', () => {
        naughtyExamples.forEach(word => {
            expect(rude("fück")).to.be.true;
        })
    })

    it('Picks up common word endings for match words without adding them to the blacklist', () => {
        naughtyExamples.forEach(word => {
            expect(rude("Dicky dicker dicked", true).words.input).to.contain('dicky', 'dicker', 'dicked')
        })
    })

    it('Words passed to the extra whitelist are ignored', () => {
        naughtyExamples.forEach(word => {
            expect(rude("Dong Wang is a great guy!"), 'words in default rude list').to.be.true;
            expect(rude("Dong Wang is a great guy!", false, ['dong', 'wang']), 'words added to function whitelist').to.be.false;
        })
    })

    it('Multi word matches are found', () => {
        naughtyExamples.forEach(word => {
            expect(rude("something something blow job butt plug")).to.be.true;
        })
    })
})


