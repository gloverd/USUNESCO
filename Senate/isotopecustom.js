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
    
    // Bind a callback to the arrangeComplete event
    $grid.on('arrangeComplete', function() {
        var previous = "";
        $("#index").empty(); // Clear the index before rebuilding
    
        $("div.card span.lname").each(function() {
            var current = $(this).text()[0];
            if (current != previous) { 
                $(this).attr("data-alpha", "first_letter_" + current);
                previous = current;
                $("#index").append("<a href='#first_letter_" + current + "'>" + current + "</a><br/>");
            }
        });
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
                    firstLetterAssigned = true; // Set flag to true after assigning the first letter
                    console.log("Added id:", $(this).attr('id'));
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

document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a sort button or some way to trigger the sorting
    var sortButton = document.querySelector('#sorts button'); // Replace with the actual selector for your sort button

    sortButton.addEventListener('click', function() {
        // Remove existing IDs
        document.querySelectorAll('div.card').forEach(function(card) {
            card.removeAttribute('id');
        });

        // Get all div.card elements after sorting (assuming you have a sorting function)
        var cards = document.querySelectorAll('div.gallery div.card');

        // To keep track of the first occurrence of each letter
        var firstLetters = {};

        cards.forEach(function(card) {
            var fnameElement = card.querySelector('.fname');
            if (fnameElement) {
                var firstLetter = fnameElement.textContent.trim().charAt(0).toUpperCase();
                if (!firstLetters[firstLetter]) {
                    firstLetters[firstLetter] = true;
                    card.setAttribute('id', firstLetter);
                }
            }
        });

        // Re-trigger alphascroll.js functionality
        if (typeof alphascroll !== 'undefined' && typeof alphascroll.init === 'function') {
            alphascroll.init(); // Adjust this line if your alphascroll.js has a different way to initialize or update
        }
    });
});

