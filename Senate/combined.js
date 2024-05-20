(function($, window, document, undefined) {

  // Support touch events detection
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
    this.$el.on('click' + '.abcScroll', this.handleClick.bind(this));
    this.$content.on('scroll' + '.abcScroll', this.handleScroll.bind(this));

    this.updatePositions();
  }

  AbcScroll.prototype.updatePositions = function() {
    var self = this;
    self.posList = [];
    $(this.$content).find('[data-alpha]').each(function() {
      if ($(this).css('display') !== 'none') {
        var $this = $(this),
            _data = $this.data(),
            elOffset = $this.offset(),
            containerOffset = self.$content.offset();

        var scrollPosition = elOffset.top - containerOffset.top;
        self.posList.push({ alpha: _data.alpha, pos: scrollPosition });

        $(self.$el).find('button[data-alpha="' + _data.alpha + '"]').removeAttr('disabled');
      }
    });

    this.posList.sort(function(a, b) {
      return a.pos - b.pos;
    });
  };

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

  $(document).ready(function() {
    $('.js-abcscroll').abcScroll();

    // Initialize Isotope
    var $gallery = $('.gallery').isotope({
      itemSelector: '.card',
      layoutMode: 'fitRows',
      fitRows: {
        gutter: 16
      },
      getSortData: {
        pname: '.pname',
        fname: '.fname',
        lname: '.lname',
        state: '.statechip'
      }
    });

    // Bind sort button click
    $('.button-group').on('click', 'button', function() {
      var sortByValue = $(this).attr('data-sort-by');
      console.log("Sort by:", sortByValue);
      $gallery.isotope({ sortBy: sortByValue });

      // Remove existing ids from .card elements
      $('.card').removeAttr('id');

      // Get the sorted items
      var sortedItems = $gallery.isotope('getFilteredItemElements');
      console.log("Sorted items:", sortedItems);

      // Check the sortByValue to add the corresponding ID
      if (sortByValue) {
        var firstLetterAssigned = false;
        $(sortedItems).each(function() {
          var sortValue = $(this).find('.' + sortByValue).text().trim();
          console.log("Sort value:", sortValue);
          if (sortValue && !firstLetterAssigned) {
            var firstLetter = sortValue.charAt(0).toUpperCase();
            console.log("First letter:", firstLetter);
            $(this).attr('id', firstLetter);
            firstLetterAssigned = true;
            console.log("Added id:", $(this).attr('id'));
          }
        });
      }

      // Refresh abcScroll
      $('.js-abcscroll').each(function() {
        var abcScrollInstance = $(this).data(pluginName);
        if (abcScrollInstance) {
          abcScrollInstance.updatePositions();
        }
      });
    });

    // Store filter for each group
    var filters = {};
    $('#filters').on('click', '.button', function(event) {
      var $button = $(event.currentTarget);
      var $buttonGroup = $button.parents('.button-group');
      var filterGroup = $buttonGroup.attr('data-filter-group');
      filters[filterGroup] = $button.attr('data-filter');
      var filterValue = concatValues(filters);
      $gallery.isotope({ filter: filterValue });

      // Refresh abcScroll
      $('.js-abcscroll').each(function() {
        var abcScrollInstance = $(this).data(pluginName);
        if (abcScrollInstance) {
          abcScrollInstance.updatePositions();
        }
      });
    });

    // Change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'button', function(event) {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        var $button = $(event.currentTarget);
        $button.addClass('is-checked');
      });
    });

    // Helper function to concatenate values
    function concatValues(obj) {
      var value = '';
      for (var prop in obj) {
        value += obj[prop];
      }
      return value;
    }
  });

})(jQuery, window, document);
