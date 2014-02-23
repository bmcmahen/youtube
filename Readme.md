
# Youtube

  a better youtube api for embedding videos & fetching metadata. It basically automates all of the script fetching, provides a consistent timeupdate event, and applies a duration & currentTime attribute to the object to make it more consistent with html5 vids.

## Installation

  Install with [component(1)](http://component.io):

    $ component install bmcmahen/youtube

  Or use `dist/youtube.js` under the global `youtube`.

## Example

```html
<div id='target'></div>
<script src='script.js'></script>
<script>
var YouTube = require('youtube');
var options = {
  height: 500,
  width: 600
};

var url = 'http://www.youtube.com/watch?v=BV-FUvhldZ8';
var target = document.getElementById('target');
var vid = new YouTube(url, target, options);
vid.play();
</script>
```

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.