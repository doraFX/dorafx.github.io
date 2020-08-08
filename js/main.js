$(document).ready(function () {
    "use strict";

    $('#openNavbar').on("click", function () {
        $(this).addClass('active');
        $('main').addClass('darkened');
        $('.main-menu').addClass('active');
    });

    $('#closeNavbar').on("click", function () {
        $(this).removeClass('active');
        $('main').removeClass('darkened');
        $('.main-menu').removeClass('active');
    });

    var mySwiper = new Swiper('#Home_page .swiper-container', {
        speed: 800,
        parallax: true,
        mousewheel: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        }
    });



    var mySwiper = new Swiper('body:not(#Home_page) .swiper-container', {
        direction: 'horizontal',
        speed: 200,
        parallax: true,
        mousewheel: true,
        freeMode: true,
        slidesPerView: 'auto',
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        },
        breakpoints: {
            500: {
                direction: 'vertical',
                freeModeMomentum: true,
            }
        }
    });



    $('.image-links').magnificPopup({type: 'image'});
	//原来是$('.image-link').magnificPopup({type: 'image'});
	
});