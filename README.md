Simple, syncronous bad language identifier for profanity invalidation.

`> npm install rudeboy`

``` javascript

var rude = require('rudeboy');
rude('f**k') // true


// If you want to know what was matched you can have that info returned.
var returnObject = true
rude('f**k', returnObject) // {rude: true, words: { input: ['f**k'], list: ['f**k']}

```
See test.js for more examples


TODO:
- Add non english match words
- improve tests for each specific use cases and matches
- allow consumer to add their own word lists
