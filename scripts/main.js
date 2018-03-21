$(document).ready(function () {


    $('.policy-link').on('click', function (e) {
        e.preventDefault();
        $('.policy-modal').fadeIn(500);
    });


    $('.icon-close').on('click', function (e) {
        e.preventDefault();
        $('.policy-modal').fadeOut(300);
    });


    $(document).mouseup(function (e){
        var feedbackPopUpForm = $('.policy-modal');
        if (!feedbackPopUpForm.is(e.target) && feedbackPopUpForm.has(e.target).length === 0) {
            $(feedbackPopUpForm).fadeOut(300);
        }
    });


    $(document).on('keyup',function(e){
        if(e.which == 27){
            $('.wrapper').fadeOut(300);
            $('.policy-modal').fadeOut(300);
        }
    });


    $('.close-button').on('click', function (e) {
        e.preventDefault();
        $('.wrapper').fadeOut(300);
    });


    $(document).mouseup(function (e){
        var feedbackPopUpForm = $('.wrapper .feedback-pop-up');
        if (!feedbackPopUpForm.is(e.target) && feedbackPopUpForm.has(e.target).length === 0) {
            $('.wrapper').fadeOut(300);
        }
    });


    var lastScrollTop = 0;

    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            $('.header-top').removeClass('fixed');
        } else {
            $('.header-top').addClass('fixed');
        }
        lastScrollTop = st;
    });

    $('.expand-button').on('click', function (event) {
        event.preventDefault();
        $('.more').slideDown(500);
        $(this).delay(200).fadeOut(200);
    });

    if($(window).width() <= 1024){

        var inputs =  $('.pop-up-inner-form input');

       inputs.focus(function () {
           $('.feedback-pop-up').addClass('to-top');
       });

        inputs.focusout(function () {
            $('.feedback-pop-up').removeClass('to-top');
        });
    }


    var productName = $('.product-name');

    $('.button').on('click', function (e) {
        var feedbackParent = $('.wrapper');

        var closestHeading = $(this).closest('li').find('h3');

        e.preventDefault();

        if(closestHeading){
            productName.text(closestHeading.text());
        } else {
            productName.text('');
        }

        productName.css('color', closestHeading.css('color'));

        feedbackParent.find('.feedback-done').hide();
        feedbackParent.find('.feedback').fadeIn();
        feedbackParent.fadeIn(300);

        return false;
    });


    $('.submit-button').on( 'click', function(e) {

        var feedback = $(this).closest('.feedback');
        var feedbackDone = $(this).closest('.feedback').siblings('.feedback-done');
        var name = feedback.find('input[name=name]').val();
        var phone = feedback.find('input[name=phone]').val();

        $('.feedback-pop-up').removeClass('to-top');
        e.preventDefault();

        if (name!== '' && phone !== ''){
            $('.submit-button').prop('disabled', true);

            var trackerReferrer = "";

            if( document.referrer.indexOf( "nonames.by" ) != -1 ){
                trackerReferrer = document.referrer;
            }

            _rc('send', 'order', {
                'name': name,
                'phone': phone,
                'customTransactionId': url('?transaction_id'),
                'customReferrer': trackerReferrer,
                'orderMethod': 'feedback',
                'callback': function(success, response) {

                    // уведомляем пользователя о результате отправки формы
                    // вместо alert() можно вывести более юзер-френдли сообщение
                    if (success) {

                        $.post("http://nonames.by/set_products_to_order.php", {
                                site: "kyliekiss-time2-by",
                                order_id: response.id,
                                products: [ {id: productId, quantity: 1}, {id: 212, quantity: 1} ]
                            },

                            function( result ){
                                console.log(result);
                                $('.submit-button').prop('disabled', false);

                                feedback.fadeOut(100);
                                feedbackDone.fadeIn(300);

                                setTimeout(function () {
                                    $('.wrapper').fadeOut(300);
                                }, 2000);
                            });
                    }else{
                        alert('К сожалению, не удалось отправить заявку.');
                    }
                }
            });
        } else {
            $('input[name=name]').css('border-bottom', '1px solid red');
            $('input[name=phone]').css('border-bottom', '1px solid red');
        }

        return false;
    });


    $('input[name=phone]').inputmask("+375-999999999");
});