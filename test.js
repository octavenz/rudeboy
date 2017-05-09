const chai = require('chai');
const expect = chai.expect;

const rude = require('./index');

const naughtyExamples = [
  "you a egg f-u-c-k",
  "bitchaleedoodle",
  "fück you you fucking fucker",
  "something something blow job butt plug",
  "Donald is a master of bumology",
  "a big f u c k y o u. i hate you. s h i t"
];


const goodExamples = [
  "i am so happy",
  "Everything is wonderful",
  "The assinine assassin is ok",
];

console.log(rude("you a egg f-u-c-k"));


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

})

