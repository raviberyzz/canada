$(document).ready(function () {
    if(typeof ContextHub == "undefined"){
        bindFullHeaderEvent();
    }
    else{
        checkHeaderAvailable();
    }

    function checkHeaderAvailable(){
        if($(".target .default.full-header").length!=0){
            setTimeout(checkHeaderAvailable, 500);
        }   
        else{
            bindFullHeaderEvent();
        }
    }

    function bindFullHeaderEvent(){
        $(".desktop-header-wrapper #sun-search").removeClass('in');
        $(".signIn-button").attr('maxlength', '30');
        function langTrue() {
            $('#language-btn').addClass('lang-true');
        }
        $('#language-btn-container').click(function () {
            if ($('#sun-search').hasClass('in')) {
                searchClose();
            }
        });
        $('#search-btn').click(function () {
            if ($('#sun-language').hasClass('in')) {
                $("#language-btn").attr('aria-expanded', 'false');
                $("#sun-language").removeClass('in');
                setTimeout(langOff, 150);
            }
        });
        function langOff() {
            $('#language-btn').removeClass('lang-true');
        }
        $('#language-btn-container').click(function () {
            if ($('#language-btn').attr('aria-expanded') == 'true') {
                $("#language-btn").attr('aria-expanded', 'false');
                setTimeout(langOff, 150);
            }
            else {
                $("#language-btn").attr('aria-expanded', 'true');
                setTimeout(langTrue, 230);
            }
        });
        $('.sunLanguageCrossBtn').click(function () {
            $("#language-btn").attr('aria-expanded', 'false');
        });

        $(document).mouseup(function (e) {
            var searchBar = $("#sun-search");
            if ($('#sun-search').hasClass('in')) {
                if (e.which === 1) {
                    if (!searchBar.is(e.target) && searchBar.has(e.target).length === 0) {
                        searchClose();
                        setTimeout(searchClose, 500);
                        event.stopImmediatePropagation();
                    }
                }
            }
        });
        function searchClose() {
            $("#search-btn").attr('aria-expanded', 'false');
            $('#sun-search').removeClass('in');
        }
        $('.desktop-region-language-menu-wrapper .sunLanguageCrossBtn').click(function () {
            $('#language-btn').removeClass('lang-true');
        });

        //function to keep sticky header at the top of the page when scrolling and site level notif is present
        function mobileHeader() {
            var $win = $(window);
            //when page is reloaded in the middle
            var height = 0;
            //If site-level-notification exits and mobile header, then stick the site-level-notification to the top and have the mobile header stick following it.
            if ($('.site-level-notification').length > 0 ) {

                $('.site-level-notification').css({ 'position': 'fixed' });
                $('.site-level-notification').css({ 'z-index': '2' });
                /*$('.site-level-notification').css({ 'top': '0' });*/
                var notificationHeight = 0;
                var notificationTop = 0;
                $('.notification').each(function(index,value){
                $(this).css('top', notificationTop);
                notificationTop += $(this).outerHeight();
                notificationHeight += $(this).outerHeight();
                    if(index>0){
                    $(this).css('border-top', '4px solid #fff');
                    }
                });
                height = notificationHeight;
                $('.slf-header-wrapper .slf-mobile-header-wrapper').css('top', height);

                if ($win.width() <= 1024) {
                    $('.root > .aem-Grid > *:not(:first-child)').css({
                        "position": "relative",
                        "top": height
                    });

                    $('.slf-header-wrapper .slf-mobile-header-wrapper').css('top', height);
                } else if ($win.width() > 1024) {
                    $('.root > .aem-Grid > *:not(:first-child)').css("top", "0");
                    $('.site-level-notification').css({
                        "position": "relative",
                        "top": "auto",
                        "border-top": "none"
                    });
                    $('.notification').last().css("margin-bottom", "0");
                }
            }

            //on scroll
            /*$win.scroll(function () {
                if ($('.site-level-notification').length == 0 || $('.site-level-notification').css('display') == "none") { height = 0; }
                $('.slf-header-wrapper .slf-mobile-header-wrapper').css('top', height);
            });*/
        };
        if ($(window).width() <= 1024) {
            mobileHeader();
        }
        $(window).resize(function () {
            mobileHeader();
        });

        if ($('.full-header').parents('.experiencefragment').length > 0 && $('#main-content').length < 1) {
            if ($('#left-navigation').closest('.layout-container').prev().hasClass('titlebar') && ($('#left-navigation').closest('.layout-container').parents('.layout-container')).length>0) {
                $('#left-navigation').closest('.layout-container').parents('.layout-container').attr('id', 'main-content');
                $('#left-navigation').closest('.layout-container').parents('.layout-container').attr('role', 'main');
            }
            else if ($('#left-navigation-case-2').closest('.layout-container').prev().hasClass('titlebar') && ($('#left-navigation-case-2').closest('.layout-container').parents('.layout-container')).length>0) {
                $('#left-navigation-case-2').closest('.layout-container').parents('.layout-container').attr('id', 'main-content');
                $('#left-navigation-case-2').closest('.layout-container').parents('.layout-container').attr('role', 'main');
            }
            else if ($('#left-navigation').parents('.col-md-3').next().hasClass('left-nav-with-content-section')) {
                $('#left-navigation').parents('.col-md-3').next().attr('id', 'main-content');
                $('#left-navigation').parents('.col-md-3').next().attr('role', 'main');
            }
            else if ($('#left-navigation-case-2').prev().hasClass('left-nav-with-content-section')) {
                $('#left-navigation-case-2').prev().attr('id', 'main-content');
                $('#left-navigation-case-2').prev().attr('role', 'main');
            }
            else if ($('#left-navigation').parents('.col-sm-4').next().hasClass('col-sm-8')) {
                $('#left-navigation').parents('.col-sm-4').next().attr('id', 'main-content');
                $('#left-navigation').parents('.col-sm-4').next().attr('role', 'main');
            }
            else if ($('.full-header').parents('.experiencefragment').next().hasClass('breadcrumb')) {
                $('.full-header').parents('.experiencefragment').next().next().attr('id', 'main-content');
                $('.full-header').parents('.experiencefragment').next().next().attr('role', 'main');
            } else {
                $('.full-header').parents('.experiencefragment').next().attr('id', 'main-content');
                $('.full-header').parents('.experiencefragment').next().attr('role', 'main');
            }
            if ($('.link-list').hasClass('editorial-nav-desktop-wrapper')) {
                $('.link-list.editorial-nav-desktop-wrapper').attr('aria-label', 'Filter');
                $('.link-list.editorial-nav-desktop-wrapper').attr('role', 'navigation');
            }
        }
        // signIn desktop header
        if ($('.slf-header-wrapper').find('.header-signIn')) {
            if($('.desktop-sunlife-logo').children().length === 1) {
                $('.desktop-header-wrapper .header-signIn .desktop-sunlife-navigation .desktop-navigation').attr("style", "margin-left: 188px;");
            }
            else if($('.desktop-sunlife-logo').children().length === 2) {
                $('.desktop-header-wrapper .header-signIn .desktop-sunlife-navigation .desktop-navigation').attr("style", "margin-left: 320px;");
            }
            else {
                $('.desktop-header-wrapper .header-signIn .desktop-sunlife-navigation .desktop-navigation').attr("style", "margin-left: 500px;");
            }
        }

        // signIn mobile header
        if ($('.slf-header-wrapper').find('.mobile-header-signIn')) {
            if($('.slf-header-mobile-logo').children().length > 1) {
                $('.slf-header-mobile-logo').children('a:not(:first-child)').wrapAll('<div class="col-xs-12 clearfix secondary-logo-wrapper">');
                var headerParent = $('.full-header').parents('.experiencefragment');
                $('.secondary-logo-wrapper').detach().insertAfter(headerParent);
            }
        }

        //474 FIX - RELATED TO ACCESSIBILITY

        //jaws fix (such that search is entered and properly exited)
        $('#sun-search').on('shown.bs.collapse', function (e) {
            $(this).find("#q-top").focus();
        });
        $('#sun-search').on('hidden.bs.collapse', function () {
            document.getElementById("search-btn").focus()
        });

        //Jaws fix (such that region language menu is entered)
        $('#sun-language').on('shown.bs.collapse', function (e) {
            $(this).find(".fa-remove").focus();
        });
        var liEle = $("#sun-language .content-language li").last()[0];
        var finalAnchorEle = $(liEle).find('a:first');
        $(finalAnchorEle).on('focusout', function (e) {
            // Close this sub menu
            $("#language-btn").trigger("click");
            $("#language-btn").focus();
            return false;
        });
    }

    // top margin for all pages in mobile & tablet view
        if ($('.full-header').parents('.experiencefragment').next().hasClass('breadcrumb')) {
            $('.breadcrumb').next().addClass('margin-top-fifty');
        } else {
            $('.full-header').parents('.experiencefragment').next().addClass('margin-top-fifty');
        }
        if(!$(".signin-content-page .full-header").parent().parent().hasClass("xf-content-height")){
            $(".signin-content-page .full-header").next(".layout-container").addClass('margin-top-fifty');
        }
});