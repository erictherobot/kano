$(document).ready(function() {

  // Make Bootstrap Alert's Disappear after 5 seconds
  window.setTimeout(function() {
      $(".alert").fadeTo(500, 0).slideUp(500, function() {
          $(this).remove();
      });
  }, 5000);

  // Get Bootstrap Radio Button Toggles To Activate
  $(':input:checked').parent('.btn').addClass('active');

  // Search Table
  $( '#table' ).searchable({
      striped: true,
      oddRow: { 'background-color': '#f5f5f5' },
      evenRow: { 'background-color': '#fff' },
      searchType: 'fuzzy'
  });

  $( '#searchable-container' ).searchable({
      searchField: '#container-search',
      selector: '.row',
      childSelector: '.col-xs-4',
      show: function( elem ) {
          elem.slideDown(100);
      },
      hide: function( elem ) {
          elem.slideUp( 100 );
      }
  })

  // Place additional JavaScript code here...

});
