/**
* Function to get the language toggle links and update the href based on the current page alternative or canonical page value.
* If the page is error page then it will update the href based on the error page value i.e /content/sunlife/external/ca/en/error/language-error.
* Otherwise, retrieve the canonical or alternate page value and update the href based on the language.
*/
$(document).ready(function () {
    var langIndex = 0;
	var langIndexMobile = 0;
    var linkRow = [];
    var linkCanRef = null;
    var pageSubcategory = utag_data.page_subcategory;
    var pageAdvisoryType = utag_data.page_advisor_type;
    var pageErrorType = "";
    if (typeof pageType != 'undefined') {
        pageErrorType = pageType;
    }
     const $languageLinks = $('#sl-dropdown-language-utility .dropdown-menu li a');
     const $secondItemLanguageLinks = $('#sl-dropdown-language-utility .dropdown-menu li:nth-child(2)').children('a');
     const $enErrorPagePath = "/content/sunlife/external/ca/en/error/language-error";
     const $frErrorPagePath = "/content/sunlife/external/ca/fr/error/language-error";

    $.each($('link'), function (index, value) {
        if (value.rel == "alternate") {
            linkRow.push(value.href);
        } else if (value.rel == "canonical") {
            linkCanRef = value.href;
        }
    });

    var newsUrl = linkCanRef.split("/");
    var lastPart = newsUrl[newsUrl.length - 2];

    if (pageSubcategory == "newsroom" && !isNaN(lastPart) && lastPart.length > 4) {
        $languageLinks.each(function () {
            if (langIndex < linkRow.length) {
                var url = linkRow[langIndex].split('/');
                $(this).attr('href', linkRow[langIndex].substr(0, linkRow[langIndex].lastIndexOf('/', linkRow[langIndex].lastIndexOf('/') - 1) + 1));
                langIndex = langIndex + 1;
            }
        });
        $languageLinks.each(function () {
            if (langIndexMobile < linkRow.length) {
                var url = linkRow[langIndexMobile].split('/');
                $(this).attr('href', linkRow[langIndexMobile].substr(0, linkRow[langIndexMobile].lastIndexOf('/', linkRow[langIndexMobile].lastIndexOf('/') - 1) + 1));
                langIndexMobile = langIndexMobile + 1;
            }
        });
    } else if (pageAdvisoryType == "ADVISOR" || pageAdvisoryType == "CORP") {
        if (utag_data.page_language == 'en') {
            $languageLinks.first().attr('href', linkCanRef);
            $secondItemLanguageLinks.attr('href', linkCanRef.replace("/E/", "/F/"));
        }
        if (utag_data.page_language == 'fr') {
            $languageLinks.first().attr('href', linkCanRef.replace("/F/", "/E/"));
            $secondItemLanguageLinks.attr('href', linkCanRef);
        }

    } else {

        if (pageErrorType === "error-page") {

            if (utag_data.page_language == 'en') {
                $languageLinks.first().attr('href', $enErrorPagePath);
                $secondItemLanguageLinks.attr('href', document.referrer);
            }
            if (utag_data.page_language == 'fr') {
                $languageLinks.first().attr('href', document.referrer);
                $secondItemLanguageLinks.attr('href', $frErrorPagePath);
            }
        } else {
            if (linkRow.length > 0) {
                $languageLinks.each(function () {
                    if (langIndex < linkRow.length) {
                        $(this).attr('href', linkRow[langIndex]);
                        langIndex = langIndex + 1;
                    }
                });
                $languageLinks.each(function () {
                    if (langIndexMobile < linkRow.length) {
                        $(this).attr('href', linkRow[langIndexMobile]);
                        langIndexMobile = langIndexMobile + 1;
                    }
                });
            }

            if (linkRow.length == 0 && linkCanRef !== null) {
                if (utag_data.page_language == 'en') {
                    $languageLinks.first().attr('href', linkCanRef);
                    $secondItemLanguageLinks.attr('href', $frErrorPagePath);
                }
                if (utag_data.page_language == 'fr') {
                    $languageLinks.first().attr('href', $enErrorPagePath);
                    $secondItemLanguageLinks.attr('href', linkCanRef);
                }
            }
        }
    }
});