(function($, window, document, undefined) {

  var supportTouch = (function() {
    var test = 'ontouchstart' in window;
    if (!test && 'DocumentTouch' in window) {
      test = document instanceof window['DocumentTouch'];
    };
    return test ||
      navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0;    
  })();

  var touchEvents = {
    start: supportTouch ? 'touchstart' : 'mousedown',
    move: supportTouch ? 'touchmove' : 'mousemove',
    end: supportTouch ? 'touchend' : 'mouseup'
  };
  
  var pluginName = 'abcScroll';
  
  function getTarget(e) {
    var target;
    
    if (supportTouch) {
      if (e.targetTouches.length) {
        target = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
    } else {
      target = e.target;
    }

    return target;
  }

  function AbcScroll(container) {
    var self = this;

    this.$container = $(container);
    
    this.$el = this.$container.find('.js-abcscroll--nav');
    this.$content = this.$container.find('.js-abcscroll--content');

    this.posList = [];

    this.$el.on(touchEvents.start + '.abcScroll', this.handleStart.bind(this));
    this.$el.on(touchEvents.move + '.abcScroll', this.handleMove.bind(this)); 
    this.$el.on(touchEvents.end + '.abcScroll', this.handleEnd.bind(this));
    
    // Add click events
    this.$el.on('click' + '.abcScroll', this.handleClick.bind(this));
    
    // Add scroll event
    this.$content.on('scroll' + '.abcScroll', this.handleScroll.bind(this));

    $(this.$content).find('[data-alpha]').each(function() {
      var $this = $(this), 
          _data = $this.data(), 
          elOffset = $this.offset(), 
          containerOffset = self.$content.offset();

      var scrollPosition = elOffset.top - containerOffset.top;
      self.posList.push({ alpha: _data.alpha, pos: scrollPosition });
      
      $(self.$el).find('button[data-alpha="' + _data.alpha + '"]').removeAttr('disabled');
    });

    // Sort positions list by scroll position
    this.posList.sort(function(a, b) {
      return a.pos - b.pos;
    });
  }

  AbcScroll.prototype.handleStart = function(e) { 
    e.preventDefault();  
    this.setScroll(getTarget(e.originalEvent));
  }

  AbcScroll.prototype.handleMove = function(e) { 
    e.preventDefault();  
    this.setScroll(getTarget(e.originalEvent));
  }

  AbcScroll.prototype.handleEnd = function(e) { 
    e.preventDefault();  
    this.setScroll(getTarget(e.originalEvent));
    $(this.$el).find('button').removeClass('current');
  }

  AbcScroll.prototype.handleClick = function(e) {
    e.preventDefault();
    this.setScroll(e.target);
  }

  AbcScroll.prototype.handleScroll = function() {
    var self = this;
    var scrollTop = this.$content.scrollTop();

    $.each(this.posList, function(index, posObj) {
      if (scrollTop >= posObj.pos && (index + 1 === self.posList.length || scrollTop < self.posList[index + 1].pos)) {
        $(self.$el).find('button').removeClass('current');
        $(self.$el).find('button[data-alpha="' + posObj.alpha + '"]').addClass('current');
      }
    });
  }

  AbcScroll.prototype.setScroll = function(target) {
    if (!target) {
      return;
    }
    
    var $target = $(target), 
        _data = $target.data(), 
        posObj = this.posList.find(function(item) { return item.alpha === _data.alpha; });
    
    if (posObj && posObj.pos !== this._oldPos) {
      $(this.$el).find('button').removeClass('current');
      $target.addClass('current');
     
      this.$content.scrollTop(posObj.pos);
      this._oldPos = posObj.pos; 
    }   
  }
  
  $.fn[pluginName] = function(options) {
     return this.each(function () {
       if (!$.data(this, pluginName)) {
         $.data(this, pluginName, new AbcScroll(this, options));
       }
     });
  }

})(jQuery, window, document);

$(document).on('ready', function() {
  $('.js-abcscroll').abcScroll();
});
