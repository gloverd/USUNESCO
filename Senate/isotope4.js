$(document).ready(function() {

    // Declare global Variables
    var global_filter = '';
    var global_sort_value = 'lname';
    var global_sort_class = '.lname'; // basically the value with a class '.' before it :)

    
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
            statechip: '.statechip'
        }
    });
    

        
    // Bind sort button click
    $('#sorts .button-group').on('click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        console.log("Triggered Sort by:", sortByValue);
        
        global_sort_class = '.' + $(this).attr('data-sort-by'); // Correctly retrieve the attribute
        global_sort_value =sortByValue;
        console.log("Storing:", global_sort_class); // Print the stored value
        
        $gallery.isotope({ sortBy: sortByValue });
        
        // // add #IDs to the .cards
        // var sortedItems = $gallery.isotope('getFilteredItemElements');
        // $('.card').removeAttr('id');
        // addFirstLetterIds(sortedItems, global_sort_value);

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
        $gallery.isotope({ sortBy: global_sort_class });

        // // add #IDs to the .cards
        // var sortedItems = $gallery.isotope('getFilteredItemElements');
        // $('.card').removeAttr('id');
        // addFirstLetterIds(sortedItems, global_sort_value);

    });
        
    // Flatten object by concatenating values
    function concatValues(obj) {
        var value = '';
        for (var prop in obj) {
            value += obj[prop];
        }
        return value;
    }

    // Function to add IDs to the first instance of each letter
    function addFirstLetterIds(sortedItems, sortByValue) {
        $('.card').removeAttr('id');
        var firstLettersAssigned = {};
        $(sortedItems).each(function() {
            var sortValue = $(this).find('.' + sortByValue).text().trim();
            if (sortValue) {
                var firstLetter = sortValue.charAt(0).toUpperCase();
                if (!firstLettersAssigned[firstLetter]) {
                    $(this).attr('id', firstLetter);
                    firstLettersAssigned[firstLetter] = true;
                }
            }
        });
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
        addFirstLetterIds($items, global_sort_value);
    });
    
            
    // Function to add attributes and rebuild the index
    function addAttributes() {
        console.log("adding attributes for: ", global_sort_class);
        var previous = "";
        $(".abc-index").find('button[data-alpha]').attr('disabled', 'disabled');
        $gallery.isotope('getFilteredItemElements').forEach(function(item) {
            var $item = $(item);
            //console.log("adding attributes for: ", global_sort_class);
            var lnameText = $item.find(global_sort_class).text().trim();
            var firstLetter = lnameText.charAt(0).toUpperCase();
    
            if (firstLetter && firstLetter !== previous) { 
                previous = firstLetter;
                var $button = $(".abc-index").find('button[data-alpha="' + firstLetter.toLowerCase() + '"]');
                $button.removeAttr('disabled');

                // Add an anchor link to the button
                if (!$button.data('linked')) {
                    $button.data('linked', true); // Mark as linked to prevent multiple bindings
                    $button.on('click', function() {
                        $('html, body').animate({
                            scrollTop: $('#' + firstLetter).offset().top
                        }, 500);
                    });
                }
                }
        });
    }
    
    
    // Added code to sort by default after everything loads
    $gallery.isotope({ sortBy: global_sort_class });

    
    // Toggle modal on card image click
    $('.gallery').on('click', '.card-image', function() {
        var $modal = $('#myModal');
        var $modalContent = $modal.find('.modal-body');
        var $popupContent = $(this).siblings('.popup-content').html();
        $modalContent.html($popupContent);
        $modal.show();
    });

    // Close modal when the user clicks anywhere inside or outside the modal
    $('#myModal').on('click', function(event) {
        if ($(event.target).is('#myModal') || $(event.target).is('.modal-content') || $(event.target).is('.close')) {
            $(this).hide();
        }
    });

});
    
