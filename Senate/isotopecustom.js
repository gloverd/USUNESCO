$(document).ready(function() {
    // Initialize Isotope
    var $gallery = $('.gallery').isotope({
        itemSelector: '.card',
        percentPosition: true,
        masonry: {
            columnWidth: '.card',
            gutter: 16
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
