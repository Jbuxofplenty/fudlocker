import * as $ from 'jquery';

export default function Utilities() {
  // ------------------------------------------------------
  // @Window Resize
  // ------------------------------------------------------

  /**
   * NOTE: Register resize event for Masonry layout
   */
  const EVENT = document.createEvent('UIEvents');
  window.EVENT = EVENT;
  EVENT.initUIEvent('resize', true, false, window, 0);


  window.addEventListener('load', () => {
    /**
     * Trigger window resize event after page load
     * for recalculation of masonry layout.
     */
    window.dispatchEvent(EVENT);
  });

  // ------------------------------------------------------
  // @External Links
  // ------------------------------------------------------

  // Open external links in new window
  $('a')
    .filter('[href^="http"], [href^="//"]')
    .not(`[href*="${window.location.host}"]`)
    .attr('rel', 'noopener noreferrer')
    .attr('target', '_blank');

  // ------------------------------------------------------
  // @Resize Trigger
  // ------------------------------------------------------

  // Trigger resize on any element click
  document.addEventListener('click', () => {
    window.dispatchEvent(window.EVENT);
  });
};

$('#inputCall1').change(function () {
    if ($(this).is(":checked")) {
        $('#order1').hide('slow', function () { $('#order1').remove(); });
    } else {
        $('#order1').show();
    }
});
$('#inputCall2').change(function () {
    if ($(this).is(":checked")) {
        $('#order2').hide('slow', function () { $('#order2').remove(); });
    } else {
        $('#order2').show();
    }
});

$('#inputCall3').change(function () {
    if ($(this).is(":checked")) {
        $('#order3').hide('slow', function () { $('#order3').remove(); });
    } else {
        $('#order3').show();
    }
});

$('#inputCall4').change(function () {
    if ($(this).is(":checked")) {
        $('#order4').hide('slow', function () { $('#order4').remove(); });
    } else {
        $('#order4').show();
    }
});

$('#inputCall5').change(function () {
    if ($(this).is(":checked")) {
        $('#order5').hide('slow', function () { $('#order5').remove(); });
    } else {
        $('#order5').show();
    }
});
$('#inputCall6').change(function () {
    if ($(this).is(":checked")) {
        $('#order6').hide('slow', function () { $('#order6').remove(); });
    } else {
        $('#order6').show();
    }
});


