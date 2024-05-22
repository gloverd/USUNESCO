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
                containerOffset = self.$content.offset().top,
                scrollPosition = $this.offset().top - containerOffset + self.$content.scrollTop();
                
                self.posList.push({ alpha: _data.alpha, pos: scrollPosition });
                $(self.$el).find('button[data-alpha="' + _data.alpha + '"]').removeAttr('disabled');
            } else {
                $(self.$el).find('button[data-alpha="' + $(this).data('alpha') + '"]').attr('disabled', 'disabled');
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
        var sort_type_class = ''; // Define sort_type_class in a higher scope
        
        // Initialize Isotope
        var $gallery = $('.gallery').isotope({
            itemSelector: '.card',
            layoutMode: 'fitRows', // Use fitRows layout mode for consistent row heights
            fitRows: {
                gutter: 16 // Ensure the gutter spacing is maintained
            },
            getSortData: {
                pname: '.pname',
                fname: '.fname',
                lname: '.lname',
                statechip: '.statechip'
            }
        });
                
        // Bind sort button click
        $('#sorts .button-group').on('click', 'button', function() {
            var sortByValue = $(this).attr('data-sort-by');
            console.log("Triggered Sort by:", sortByValue);
            
            sort_type_class = '.'+$(this).attr('data-sort-by'); // Correctly retrieve the attribute
            console.log("Storing:", sort_type_class); // Print the stored value
            
            $gallery.isotope({ sortBy: sortByValue });
            
            // Remove existing ids from .card elements
            $('.card').removeAttr('id');
            
            // Get the sorted items
            var sortedItems = $gallery.isotope('getFilteredItemElements');
            //console.log("Sorted items:", sortedItems);
            
            // Check the sortByValue to add the corresponding ID
            //if (sortByValue) {
            //   var firstLetterAssigned = false;
            //   $(sortedItems).each(function() {
            //       var sortValue = $(this).find('.' + sortByValue).text().trim();
            //       //console.log("Sort value:", sortValue);
            //       if (sortValue && !firstLetterAssigned) {
            //           var firstLetter = sortValue.charAt(0).toUpperCase();
            //           //console.log("First letter:", firstLetter);
            //           $(this).attr('id', firstLetter);
            //          firstLetterAssigned = true; // Set flag to true after assigning the first letter
            //           //console.log("Added id:", $(this).attr('id'));
            //       }
            //    });
            //}
        });
        
        // Store filter for each group
        var filters = {};
        $('#filters').on('click', '.button', function(event) {
            var $button = $(event.currentTarget);
            // Get group key
            var $buttonGroup = $button.parents('.button-group');
            var filterGroup = $buttonGroup.attr('data-filter-group');
            console.log("Triggered Filter by:", $buttonGroup.attr('data-filter-group'), $button.attr('data-filter'));
            // Set filter for group
            filters[filterGroup] = $button.attr('data-filter');
            // Combine filters
            var filterValue = concatValues(filters);
            // Set filter for Isotope
            $gallery.isotope({ filter: filterValue });
        });
        
        // Flatten object by concatenating values
        function concatValues(obj) {
            var value = '';
            for (var prop in obj) {
                value += obj[prop];
            }
            return value;
        }
        
        // Change is-checked class on buttons
        $('.button-group').each(function(i, buttonGroup) {
            var $buttonGroup = $(buttonGroup);
            $buttonGroup.on('click', 'button', function(event) {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                var $button = $(event.currentTarget);
                $button.addClass('is-checked');
            });
        });
        
        // Bind a callback to the arrangeComplete event
        $gallery.on('arrangeComplete', function() {
            console.log('arrangeComplete callback triggered');
            var $items = $gallery.isotope('getFilteredItemElements');
            $gallery.append($items); // Re-order the DOM elements
            console.log('reordered');
            addAttributes();
        });
        
        
        // Function to add attributes and rebuild the index
        function addAttributes() {
            var previous = "";
            $("#index").empty(); // Clear the index before rebuilding
            $(".abc-index").find('button[data-alpha]').attr('disabled', 'disabled');
            
            $gallery.isotope('getFilteredItemElements').forEach(function(item) {
                
                var $item = $(item);
                console.log("adding attributes for: ", sort_type_class);
                console.log(sort_type_class);
                var lnameText = $item.find(sort_type_class).text().trim();
                console.log(lnameText);
                var firstLetter = lnameText.charAt(0).toUpperCase();
                console.log(firstLetter);
                
                if (firstLetter && firstLetter !== previous) { 
                    $item.attr("data-alpha", "first_letter_" + firstLetter);
                    $item.attr("id", "first_letter_" + firstLetter);
                    previous = firstLetter;
                    //$("#index").append("<a href='#first_letter_" + firstLetter + "'>" + firstLetter + "</a><br/>");
                    $(".abc-index").find('button[data-alpha="' + firstLetter.toLowerCase() + '"]').removeAttr('disabled');
                }
                //else {
                //    $(".abc-index").find('button[data-alpha="' + firstLetter.toLowerCase() + '"]').attr('disabled', 'disabled');
                //}
            });
        }
        
        
    });
})(jQuery, window, document);
