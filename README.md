jquery.sliders.js
=================

A jQuery slideshow/carousel plugin... Check out the demo here: [http://citrus.github.com/jquery.sliders](http://citrus.github.com/jquery.sliders)

Enjoy!

------------------------------------------------------------------------------
Usage
------------------------------------------------------------------------------

Initialize a slider like so:

```js
$('#slideshow').sliders();
```    
    
Or with options:
    
```js
$('#slideshow').sliders({  
  transition:     'slide', // slide or fade
  queue:          false,   // allow multiple transitions to be queued
  delay:          5000,    // time each slide is shown (milliseconds)
  speed:          450,     // time of transition (milliseconds)
  first:          0,       // initial slide to start on
  ease:           'swing', // transition ease
  play:           true,    // auto-play the slideshow
  keyboardEvents: true     // allow keyboard to control (next/prev/play/pause)
});
```    


Control your slider by passing options into the `sliders` method:

```js
$('#slideshow').sliders('play');            // plays the slider
$('#slideshow').sliders('pause');           // pauses the slider
$('#slideshow').sliders('toggle');          // plays if paused, pauses if playing
$('#slideshow').sliders('goto', 4);         // goes to the fourth slide (zero index)
$('#slideshow').sliders('goto', 'next');    // goes to the next slide
$('#slideshow').sliders('goto', 'prev');    // goes to the previous slide
$('#slideshow').sliders('goto', 'last');    // goes to the last slide
$('#slideshow').sliders('advance', 2);      // skips ahead two slides
$('#slideshow').sliders('enableKeyboard');  // enables keyboard control (arrow keys for next/prev and spacebar for play/pause)
$('#slideshow').sliders('disableKeyboard'); // disables keyboard control
$('#slideshow').sliders('toggleKeyboard');  // toggles keyboard control
$('#slideshow').sliders('hide');            // pauses, disables keyboard events then hides the slider
$('#slideshow').sliders('show');            // shows the slider and resumes playing if play option is true
```


------------------------------------------------------------------------------
License
------------------------------------------------------------------------------

Copyright (c) 2011 - 2012 Spencer Steffen & Citrus, released under the New BSD License All rights reserved.
