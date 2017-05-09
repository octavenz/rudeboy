Simple, syncronous bad language identifier for profanity invalidation.

`> npm install rudeboy`

``` javascript

var rude = require('rudeboy');
rude('f**k') // true

```
See test.js for more examples


TODO:
- Add non english match words
- improve tests for each specific use cases and matches
- replace multiple spaces with one space.
- allow consumer to add their own word lists
