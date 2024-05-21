$(document).ready(function() {

        
    
    $("body").append("<div id='index'></div>");

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
            state: '.statechip'
        }
    });


    // Bind sort button click
    $('#sorts .button-group').on('click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        console.log(" Triggered Sort by:", sortByValue);
        $gallery.isotope({ sortBy: sortByValue });

        // Remove existing ids from .card elements
        $('.card').removeAttr('id');

        // Get the sorted items
        var sortedItems = $gallery.isotope('getFilteredItemElements');
        //console.log("Sorted items:", sortedItems);

        // Check the sortByValue to add the corresponding ID
        if (sortByValue) {
            var firstLetterAssigned = false;
            $(sortedItems).each(function() {
                var sortValue = $(this).find('.' + sortByValue).text().trim();
                //console.log("Sort value:", sortValue);
                if (sortValue && !firstLetterAssigned) {
                    var firstLetter = sortValue.charAt(0).toUpperCase();
                    //console.log("First letter:", firstLetter);
                    $(this).attr('id', firstLetter);
                    firstLetterAssigned = true; // Set flag to true after assigning the first letter
                    //console.log("Added id:", $(this).attr('id'));
                }
            });
        }
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

            $gallery.isotope('getFilteredItemElements').forEach(function(item) {
                var $item = $(item);
                var lnameText = $item.find('.lname').text().trim();
                var firstLetter = lnameText.charAt(0).toUpperCase();

                if (firstLetter && firstLetter !== previous) { 
                    $item.attr("data-alpha", "first_letter_" + firstLetter);
                    previous = firstLetter;
                    $("#index").append("<a href='#first_letter_" + firstLetter + "'>" + firstLetter + "</a><br/>");
                }
            });
        }
    
});
