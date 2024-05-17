<script type="text/javascript">
    // external js: isotope.pkgd.js

    // init Isotope
    var $grid = $('.gallery').isotope({
      itemSelector: '.card',
      layoutMode: 'fitRows',
      getSortData: {
        first: '.first',
        last: '.last',
        state: '[state]'
      }
    });

    // bind sort button click
    $('#sorts').on( 'click', 'button', function() {
      var sortValue = $(this).attr('data-sort-value');
      $grid.isotope({ sortBy: sortValue });
    });


    // store filter for each group
    var filters = {};

    $('#filters').on( 'click', '.button', function( event ) {
      var $button = $( event.currentTarget );
      // get group key
      var $buttonGroup = $button.parents('.button-group');
      var filterGroup = $buttonGroup.attr('data-filter-group');
      // set filter for group
      filters[ filterGroup ] = $button.attr('data-filter');
      // combine filters
      var filterValue = concatValues( filters );
      // set filter for Isotope
      $grid.isotope({ filter: filterValue });
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



    // flatten object by concatting values
    function concatValues( obj ) {
      var value = '';
      for ( var prop in obj ) {
        value += obj[ prop ];
      }
      return value;
    }

  </script>
