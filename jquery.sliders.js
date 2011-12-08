// jQuery Sliders
// by Spencer Steffen

// Citrus Media Group
// spencer@citrusme.com

;(function($) {

  var version = '0.3.1';
      
  $.fn.sliders = function() {
    var args = arguments;
    
    if (!$.isReady) return $.fn.sliders.errors.dom();
    
    return this.each(function() {
      
      // =================================  
      // get vars or set defaults
      
      var slider, index;
      var $id         = this.$id || $.fn.sliders.generateId();
      var container   = $(this);
      var slider      = this.slider || getSlider();
      var slides      = getSlides();
      var lastIndex   = this.lastIndex || 0;
      var index       = slider.data('index') || 0;
      var options     = this.options = $.extend(false, this.options || $.fn.sliders.defaults, (args[0] && args[0].constructor == Object ? args[0] : {}));
      var delay       = this.delay || null;
      var keyEnabled  = this.keyEnabled || false;
      var locked      = $(slider).data('locked') || false;
      var animating   = $(slider).data('animating') || false;
      var transitions = setupTransitions();
      
      // Setup
      if (!this.hasInit) {
  
        align();
        
        if (slides.length < $.fn.sliders.minimum.slides) $.fn.sliders.errors.minimum(slides.length);
        if (options.delay < $.fn.sliders.minimum.delay) options.delay = $.fn.sliders.errors.delay(options.delay);
        if (options.speed < $.fn.sliders.minimum.speed) options.speed = $.fn.sliders.errors.speed(options.speed);
        
        advance(Number(options.first));
        
        if (!args[0] || args[0].constructor != String) {
          if (options.play) play();
          if (options.keyboardEvents) enableKeyboard();
        }
        
        this.hasInit = true;
      }
      
      if (args[0] && args[0].constructor == String) control(args[0], args[1]);
      
      
      // save for later
      this.$id        = $id;
      this.slider     = slider;
      this.options    = options;
      this.lastIndex  = lastIndex;
      this.delay      = delay;
      this.keyEnabled = keyEnabled;
      this.locked     = locked;
      
      return this;
      
      
      
          
      // =================================  
      // Setup slides and slider
      
      function getSlider() {
        if (slider) return slider;
        var w = container.width();    
        var h = container.height();
        var pos = container.css('position');
        if (!pos || !pos.match(/relative|absolute/)) container.css('position', 'relative');
        
        container.css({ display: 'block', overflow: 'hidden' }).wrapInner('<div class="slider"></div>');
        
        return $('div.slider', container).css({ display: 'block', position: 'absolute', left: 0, top: 0 });
      }
      
      function getSlides() {
        return slider ? slider.children().get() : container.children().get();
      }
      
      function getStatus() {
        return delay ? 'playing' : 'paused';
      }
      
      function align() {
        var w = container.width();    
        var h = container.height();
        $(slides).css({ display: 'block', position: 'absolute', left: 0, top: 0, width: w });
        switch(options.transition) {
          case 'slide':
            slider.css({ width: w * slides.length, height: h, left: -w * index });           
            $(slides).each(function(i,el) {
              $(el).css({ opacity: 1, left: w * i, zIndex: slides.length - i });
            });
            break;
          //case 'fade':
          default:
            slider.css({ width: w, height: h });
            $(slides).css({ opacity: 0, zIndex: 0 });
            $(slides[0]).css({ opacity: 1, zIndex: slides.length });
        }
        return $(slides);        
      }
      
      function trigger(evt) {
        $(slider).trigger(evt, [ index, getStatus() ]);
      }
      
      // =================================  
      // Controls 
      
      function control(control, option) {
        switch(control) {
          case 'play':
    		    play();
    		    break;
          case 'stop':
          case 'pause':
            pause();
            break;
          case 'toggle':
            toggle();
            break;
          case 'prev':
          case 'previous':
            pause();
            prev();
            break;
          case 'next':
            pause();
            next();
            break;
          case 'goto':
          case 'go to':
            pause();            
            var idx = 0;
            if (option != null && option.constructor === String) {
              switch(option) {
                case 'next':
                  idx = advance(1);
                  break;
                case 'prev':
                  idx = advance(-1);
                  break;
                case 'last':
                case 'end':
                case 'finish':
                  idx = slides.length - 1;
                  break;
                case 'first':
                case 'start':
                default:
                  idx = Number(option.replace(/[^0-9]/g, ''));
                  break;
              }
            } else idx = Number(option);
            go_to(idx);
            break;
          case 'advance':
            pause();
            advance(option || 1);
            transition();
            break;
          case 'enableKeyboard':
            enableKeyboard();
            break;
          case 'disableKeyboard':
            disableKeyboard();
            break;
          case 'toggleKeyboard':
            toggleKeyboard();
            break;
          case 'show':
            if (option === false) container.css('display', 'block');
            else container.fadeIn();            
            if (options.play) play();
            if (options.keyboardEvents) enableKeyboard();
            break;
          case 'hide':
            pause();
            disableKeyboard();
            if (option === false) container.css('display', 'none');
            else container.fadeOut();
            break;
        }
      };
      
      
      function play() {
        if (delay) return;
        delay  = setInterval(next, options.delay);
        trigger('play');
      };
      function pause() {
        if (delay) delay = clearTimeout(delay);
        trigger('pause');
      };
      function toggle() {
        if (delay) pause();
        else play();
      };
      function next() {
        if (locked || slides.length < $.fn.sliders.minimum.slides) return;
        lastIndex = index;
        advance(1);
        transition();
      };      
      function prev() {
        if (locked || slides.length < $.fn.sliders.minimum.slides) return;
        lastIndex = index;
        advance(-1);
        transition();
      };
      function go_to(n) {
        if (slides.length < $.fn.sliders.minimum.slides) return;
        lastIndex = index;
        index = withinLimits(n);
        slider.data('index', index);
        transition();
      };
            
      
      
      // =================================  
      // Keyboard 
      
      function enableKeyboard() {
        if (keyEnabled) return false;
        $(window).bind('keyup.' + $id, container, $.fn.sliders.handleKeyboard);
        keyEnabled = true;
      };
      function disableKeyboard() {
        if (!keyEnabled) return false;
        $(window).unbind('keyup.' + $id, $.fn.sliders.handleKeyboard);
        keyEnabled = false;
      };
      function toggleKeyboard() {
        if (keyEnabled) disableKeyboard();
        else enableKeyboard();
      }  
      
      
      
      // =================================  
      // Transitions 
      
      function transition() {
        
        if (animating) transitions.cancel();
        else if (locked) return;
        
        switch(options.transition) {
          case 'slide':
            transitions.slide();
            break;
          case 'fade':
            transitions.fade();
            break;
          default:
            transitions.none();
            break;
        }
        
        transitions.update(true);
        trigger('change');
        if (!options.allowCue) transitions.lock(true);
        
      };
            
      function setupTransitions() {
        return {      
          none: function() {
            var last = $(slides[lastIndex]);
            var next = $(slides[index]);
            last.css({ opacity: 0, zIndex: 0, display: 'none' });
            next.css({ opacity: 1, zIndex: slides.length, display: 'block' });
          },
          slide: function() {
            slider.animate({ left: -container.width() * index }, options.speed, options.ease);
          },
          fade: function() {
            var last = $(slides[lastIndex]);
            var next = $(slides[index]);
            
            last.css({ zIndex: slides.length - 1 });
            next.css({ opacity: 0, zIndex: slides.length })
            
            last.animate({ opacity: 0 }, options.speed, options.ease);
            next.animate({ opacity: 1 }, options.speed, options.ease);
          },
          cancel: function() {
            switch(options.transition) {
              case 'slide':        
                slider.stop(true);   
                break;
              case 'fade':          
                var last = $(slides[lastIndex]);
                var next = $(slides[index]);
                last.stop(true).css({ 'opacity': 0, 'z-index': 0 });
                next.stop(true);
                break;
              default:
            }
          },
          lock: function(unlock) {
            if (slider.data('locked')) return;
            slider.data('locked', true);
            if (unlock) setTimeout(transitions.unlock, options.speed);
          },
          unlock: function() {
            slider.data('locked', false);
          },
          update: function(anim) {
            slider.data('animating', anim);
            if (anim) setTimeout(transitions.update, options.speed, !anim);
          }
        };
      }
            
       
  
      // =================================  
      // Random Logic 
    
      function advance(count) {
        if (locked) return index;
        var l = slides.length; 
        var i = count < l ? count : l - (count % l);
        index = withinLimits(index + i);
        slider.data('index', index);
        return index;
      };
      function withinLimits(n) {
        var l = slides.length;
        var i = n < l ? n : l - (n % l);
        return i < 0 ? l + i : l <= i ? i - l : i;
      };
      
      
    }); // this.each()
  }; // $.fn.sliders()
  
  
  
  // =================================  
  // Keyboard Event Handler
  
  $.fn.sliders.handleKeyboard = function(evt) {
    switch(evt.keyCode) {
      case 39:
      case 40:
        $(evt.data).sliders('next');
        break;
      case 37:
      case 38:
        $(evt.data).sliders('prev');
        break;
      case 32:
        $(evt.data).sliders('toggle');
        break;
    }
  };
  
  
  
  // =================================  
  // Errors  

  $.fn.sliders.errors = {
    dom: function() {
      $.fn.sliders.errors.show('Sliders::DOM not ready, quiting slideshow');
    },
    minimum: function(count) {
      $.fn.sliders.errors.show('Sliders::Not enough slides. ' + count + '/' + $.fn.sliders.minimum.slides);
    },
    delay: function(delay) {
      $.fn.sliders.errors.show('Sliders::Delay to slow. (' + speed + 'ms) minimum ' + $.fn.sliders.minimum.delay);
      return $.fn.sliders.minimum.delay;
    },
    speed: function(speed) {
      $.fn.sliders.errors.show('Sliders::Speed to slow. (' + speed + 'ms) minimum ' + $.fn.sliders.minimum.speed);
      return $.fn.sliders.minimum.speed;
    },
    show: function(err) {
      if (window.console && window.console.log) window.console.log(err);
      return this;
    } 
  }
  
  
  
  // =================================  
  // Random ID  

  $.fn.sliders.generateId = function() {
    return Math.round(new Date().getTime() * Math.random());
  }
  
  
  
  // =================================  
  // Defaults 
  
  $.fn.sliders.minimum = {
    slides: 2,
    delay:  500,
    speed:  200  
  };
        
  $.fn.sliders.defaults = {
    transition:     'slide',
    allowCue:       false,
    delay:          5000, 
    speed:          450,
    first:          0,
    ease:           'swing',
    play:           true,
    keyboardEvents: true
  };
  
})(jQuery);
