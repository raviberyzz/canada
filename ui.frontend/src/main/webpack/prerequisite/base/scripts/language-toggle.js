$(document).ready(function () {
    //Code for Language toggle starts //
    var langIndex = 0;
	var langIndexMobile = 0;
    var linkRow = [];
    //var linkAltRef = 0;
    var linkCanRef = null;
    var pageSubcategory = utag_data.page_subcategory;
    var pageAdvisoryType = utag_data.page_advisor_type;
    var pageErrorType = "";
    if (typeof pageType != 'undefined') {
        pageErrorType = pageType;
    }

    $.each($('link'), function (index, value) {
        if (value.rel == "alternate") {
            //linkAltRef = linkAltRef + 1;
            linkRow.push(value.href);
        } else if (value.rel == "canonical") {
            linkCanRef = value.href;
        }
    });

    var newsUrl = linkCanRef.split("/");
    var lastPart = newsUrl[newsUrl.length - 2];

    if (pageSubcategory == "newsroom" && !isNaN(lastPart) && lastPart.length > 4) {
        $('.desktop-region-language-menu-wrapper .content-language li a').each(function () {
            if (langIndex < linkRow.length) {
                var url = linkRow[langIndex].split('/');
                $(this).attr('href', linkRow[langIndex].substr(0, linkRow[langIndex].lastIndexOf('/', linkRow[langIndex].lastIndexOf('/') - 1) + 1));
                langIndex = langIndex + 1;
            }
        });
        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').each(function () {
            if (langIndexMobile < linkRow.length) {
                var url = linkRow[langIndexMobile].split('/');
                $(this).attr('href', linkRow[langIndexMobile].substr(0, linkRow[langIndexMobile].lastIndexOf('/', linkRow[langIndexMobile].lastIndexOf('/') - 1) + 1));
                langIndexMobile = langIndexMobile + 1;
            }
        });
    } else if (pageAdvisoryType == "ADVISOR" || pageAdvisoryType == "CORP") {
        if (utag_data.page_language == 'en') {
            $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef);
            $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef);
            $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef.replace("/E/", "/F/"));
            $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef.replace("/E/", "/F/"));
        }
        if (utag_data.page_language == 'fr') {
            $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef.replace("/F/", "/E/"));
            $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef.replace("/F/", "/E/"));
            $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef);
            $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef);
        }

    } else {

        if (pageErrorType === "error-page") {
            if (utag_data.page_language == 'en') {
                $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', "/content/sunlife/external/ca/en/error/language-error");
                $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', "/content/sunlife/external/ca/en/error/language-error");
                $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', document.referrer);
                $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', document.referrer);
            }
            if (utag_data.page_language == 'fr') {
                $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', document.referrer);
                $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', document.referrer);
                $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', "/content/sunlife/external/ca/fr/error/language-error");
                $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', "/content/sunlife/external/ca/fr/error/language-error");
            }
        } else {
            if (linkRow.length > 0) {
                $('.desktop-region-language-menu-wrapper .content-language li a').each(function () {
                    if (langIndex < linkRow.length) {
                        $(this).attr('href', linkRow[langIndex]);
                        langIndex = langIndex + 1;
                    }
                });
                $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').each(function () {
                    if (langIndexMobile < linkRow.length) {
                        $(this).attr('href', linkRow[langIndexMobile]);
                        langIndexMobile = langIndexMobile + 1;
                    }
                });
            }

            if (linkRow.length == 0 && linkCanRef != null) {
                if (utag_data.page_language == 'en') {
                    $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef);
                    $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef);
                    $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', "/content/sunlife/external/ca/fr/error/language-error");
                    $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', "/content/sunlife/external/ca/fr/error/language-error");
                }
                if (utag_data.page_language == 'fr') {
                    $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', "/content/sunlife/external/ca/en/error/language-error");
                    $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', "/content/sunlife/external/ca/en/error/language-error");
                    $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef);
                    $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef);
                }
            }
        }
    }
    //Code for Language toggle ends //  

});