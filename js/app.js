(function ($) {

    'use strict';

    // Active Menu
    $(".navbar-nav a").each(function () {
        if (this.href == window.location.href) {
            $(this).parent().addClass("active-item"); // add active to li of the current link
            $(this).parent().parent().parent().addClass("active-item"); // add active class to an anchor
        }
    });

})(jQuery);
