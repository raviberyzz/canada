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
     const LANGUAGE_TOGGLE_FIRST_OPTION = $('#sl-dropdown-language-utility .dropdown-menu li a');
     const LANGUAGE_TOGGLE_SECOND_OPTION = $('#sl-dropdown-language-utility .dropdown-menu li:nth-child(2)').children('a');
     const ERROR_PAGE_PATH_EN = "/content/sunlife/external/ca/en/error/language-error";
     const ERROR_PAGE_PATH_FR = "/content/sunlife/external/ca/fr/error/language-error";

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
        LANGUAGE_TOGGLE_FIRST_OPTION.each(function () {
            if (langIndex < linkRow.length) {
                var url = linkRow[langIndex].split('/');
                $(this).attr('href', linkRow[langIndex].substr(0, linkRow[langIndex].lastIndexOf('/', linkRow[langIndex].lastIndexOf('/') - 1) + 1));
                langIndex = langIndex + 1;
            }
        });
        LANGUAGE_TOGGLE_FIRST_OPTION.each(function () {
            if (langIndexMobile < linkRow.length) {
                var url = linkRow[langIndexMobile].split('/');
                $(this).attr('href', linkRow[langIndexMobile].substr(0, linkRow[langIndexMobile].lastIndexOf('/', linkRow[langIndexMobile].lastIndexOf('/') - 1) + 1));
                langIndexMobile = langIndexMobile + 1;
            }
        });
    } else if (pageAdvisoryType == "ADVISOR" || pageAdvisoryType == "CORP") {
        if (utag_data.page_language == 'en') {
            LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', linkCanRef);
            LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', linkCanRef.replace("/E/", "/F/"));
        }
        if (utag_data.page_language == 'fr') {
            LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', linkCanRef.replace("/F/", "/E/"));
            LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', linkCanRef);
        }

    } else {

        if (pageErrorType === "error-page") {

            if (utag_data.page_language == 'en') {
                LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', ERROR_PAGE_PATH_EN);
                LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', document.referrer);
            }
            if (utag_data.page_language == 'fr') {
                LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', document.referrer);
                LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', ERROR_PAGE_PATH_FR);
            }
        } else {
            if (linkRow.length > 0) {
                LANGUAGE_TOGGLE_FIRST_OPTION.each(function () {
                    if (langIndex < linkRow.length) {
                        $(this).attr('href', linkRow[langIndex]);
                        langIndex = langIndex + 1;
                    }
                });
                LANGUAGE_TOGGLE_FIRST_OPTION.each(function () {
                    if (langIndexMobile < linkRow.length) {
                        $(this).attr('href', linkRow[langIndexMobile]);
                        langIndexMobile = langIndexMobile + 1;
                    }
                });
            }

            if (linkRow.length == 0 && linkCanRef !== null) {
                if (utag_data.page_language == 'en') {
                    LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', linkCanRef);
                    LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', ERROR_PAGE_PATH_FR);
                }
                if (utag_data.page_language == 'fr') {
                    LANGUAGE_TOGGLE_FIRST_OPTION.first().attr('href', ERROR_PAGE_PATH_EN);
                    LANGUAGE_TOGGLE_SECOND_OPTION.attr('href', linkCanRef);
                }
            }
        }
    }
    //Code for Language toggle ends //  

});