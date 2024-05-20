$(document).ready(function() {
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
            var firstLetter;
            $(sortedItems).each(function() {
                var sortValue = $(this).find('.' + sortByValue).text().trim();
                console.log("Sort value:", sortValue);
                if (sortValue) {
                    firstLetter = sortValue.charAt(0).toUpperCase();
                    console.log("First letter:", firstLetter);
                    if (firstLetter) {
                        $(this).attr('id', firstLetter);
                        console.log("Added id:", $(this));
                        // Break the loop after setting the id for the first instance
                        return false;
                    }
                }
            });
        }
    });

    // Flatten object by concatenating values
    function concatValues(obj) {
        var value = '';
        for (var prop in obj) {
            value += obj[prop];
        }
        return value;
    }

    // Store filter for each group
    var filters = {};
    $('#filters').on('click', '.button', function(event) {
        var $button = $(event.currentTarget);
        // Get group key
        var $buttonGroup = $button.parents('.button-group');
        var filterGroup = $buttonGroup.attr('data-filter-group');
        // Set filter for group
        filters[filterGroup] = $button.attr('data-filter');
        // Combine filters
        var filterValue = concatValues(filters);
        // Set filter for Isotope
        $gallery.isotope({ filter: filterValue });
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
});
