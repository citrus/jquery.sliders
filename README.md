jquery.sliders.js
=================

A jquery slideshow/carousel plugin... Check out the demo here: [http://citrus.github.com/jquery.sliders](http://citrus.github.com/jquery.sliders)

Enjoy!


Usage
=====

Initialize a slider like so:

    $('#slideshow').sliders();
    
    
Or with options:
    
    $('#slideshow').sliders({  
      transition:     'slide',
      allowCue:       false,
      delay:          5000, 
      speed:          450,
      first:          0,
      ease:           'swing',
      play:           true,
      keyboardEvents: true
    });
    

Control your slider by passing options into the `sliders` method:

    $('#slideshow').sliders('play');            // plays the slider
    $('#slideshow').sliders('pause');           // pauses the slider
    $('#slideshow').sliders('toggle');          // plays if paused, pauses if playing
    $('#slideshow').sliders('goto', 4);         // goes to the fourth slide (zero index)
    $('#slideshow').sliders('advance', 2);      // skips ahead two slides
    $('#slideshow').sliders('enableKeyboard');  // enables keyboard control (arrow keys for next/prev and spacebar for play/pause)
    $('#slideshow').sliders('disableKeyboard'); // disables keyboard control
    $('#slideshow').sliders('toggleKeyboard');  // toggles keyboard control
    $('#slideshow').sliders('hide');            // pauses hides the slider
    $('#slideshow').sliders('show');            // shows the slider
    

License
=======

Copyright (c) 2011 Spencer Steffen & Citrus, released under the New BSD License All rights reserved.
