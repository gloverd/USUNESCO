$(document).ready(function() {
    // Initialize Isotope
    var $gallery = $('.gallery').isotope({
        itemSelector: '.card',
              layoutMode: 'cellsByRow',
              // options for cellsByRow layout mode
              cellsByRow: {
                columnWidth: 250,
                rowHeight: 400
              },
        getSortData: {
            name: '[data-name]',
            title: '[data-title]'
        }
    });

    // Bind sort button click
    $('.button-group').on('click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        $gallery.isotope({ sortBy: sortByValue });
    });
});
