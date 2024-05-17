$(document).ready(function() {
    // Initialize Isotope
    var $gallery = $('.gallery').isotope({
        itemSelector: '.card',
        layoutMode: 'fitRows', // Use fitRows layout mode for consistent item widths
        getSortData: {
            name: '[data-name]',
            title: '[data-title]'
        },
        masonry: {
            columnWidth: '.card',
            isFitWidth: true
        }
    });

    // Bind sort button click
    $('.button-group').on('click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        $gallery.isotope({ sortBy: sortByValue });
    });

      // change is-checked class on buttons
    $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'button', function( event ) {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        var $button = $( event.currentTarget );
        $button.addClass('is-checked');
      });
    });
});
