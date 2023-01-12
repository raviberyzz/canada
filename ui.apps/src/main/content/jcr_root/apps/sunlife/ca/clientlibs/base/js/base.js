/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/webpack/prerequisite/base/index_module.js":
/*!************************************************************!*\
  !*** ./src/main/webpack/prerequisite/base/index_module.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_base_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/base.scss */ \"./src/main/webpack/prerequisite/base/styles/base.scss\");\n/* harmony import */ var _styles_druglist_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/druglist.scss */ \"./src/main/webpack/prerequisite/base/styles/druglist.scss\");\n/* harmony import */ var _scripts_language_toggle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/language-toggle.js */ \"./src/main/webpack/prerequisite/base/scripts/language-toggle.js\");\n/* harmony import */ var _scripts_language_toggle_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_scripts_language_toggle_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n//# sourceURL=webpack://aem-maven-archetype/./src/main/webpack/prerequisite/base/index_module.js?");

/***/ }),

/***/ "./src/main/webpack/prerequisite/base/scripts/language-toggle.js":
/*!***********************************************************************!*\
  !*** ./src/main/webpack/prerequisite/base/scripts/language-toggle.js ***!
  \***********************************************************************/
/***/ (function() {

eval("$(document).ready(function () {\n  //Code for Language toggle starts //\n  var langIndex = 0;\n  var langIndexMobile = 0;\n  var linkRow = [];\n  //var linkAltRef = 0;\n  var linkCanRef = null;\n  var pageSubcategory = utag_data.page_subcategory;\n  var pageAdvisoryType = utag_data.page_advisor_type;\n  var pageErrorType = \"\";\n  if (typeof pageType != 'undefined') {\n    pageErrorType = pageType;\n  }\n  $.each($('link'), function (index, value) {\n    if (value.rel == \"alternate\") {\n      //linkAltRef = linkAltRef + 1;\n      linkRow.push(value.href);\n    } else if (value.rel == \"canonical\") {\n      linkCanRef = value.href;\n    }\n  });\n  var newsUrl = linkCanRef.split(\"/\");\n  var lastPart = newsUrl[newsUrl.length - 2];\n  if (pageSubcategory == \"newsroom\" && !isNaN(lastPart) && lastPart.length > 4) {\n    $('.desktop-region-language-menu-wrapper .content-language li a').each(function () {\n      if (langIndex < linkRow.length) {\n        var url = linkRow[langIndex].split('/');\n        $(this).attr('href', linkRow[langIndex].substr(0, linkRow[langIndex].lastIndexOf('/', linkRow[langIndex].lastIndexOf('/') - 1) + 1));\n        langIndex = langIndex + 1;\n      }\n    });\n    $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').each(function () {\n      if (langIndexMobile < linkRow.length) {\n        var url = linkRow[langIndexMobile].split('/');\n        $(this).attr('href', linkRow[langIndexMobile].substr(0, linkRow[langIndexMobile].lastIndexOf('/', linkRow[langIndexMobile].lastIndexOf('/') - 1) + 1));\n        langIndexMobile = langIndexMobile + 1;\n      }\n    });\n  } else if (pageAdvisoryType == \"ADVISOR\" || pageAdvisoryType == \"CORP\") {\n    if (utag_data.page_language == 'en') {\n      $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef);\n      $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef);\n      $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef.replace(\"/E/\", \"/F/\"));\n      $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef.replace(\"/E/\", \"/F/\"));\n    }\n    if (utag_data.page_language == 'fr') {\n      $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef.replace(\"/F/\", \"/E/\"));\n      $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef.replace(\"/F/\", \"/E/\"));\n      $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef);\n      $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef);\n    }\n  } else {\n    if (pageErrorType === \"error-page\") {\n      if (utag_data.page_language == 'en') {\n        $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', \"/content/sunlife/external/ca/en/error/language-error\");\n        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', \"/content/sunlife/external/ca/en/error/language-error\");\n        $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', document.referrer);\n        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', document.referrer);\n      }\n      if (utag_data.page_language == 'fr') {\n        $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', document.referrer);\n        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', document.referrer);\n        $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', \"/content/sunlife/external/ca/fr/error/language-error\");\n        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', \"/content/sunlife/external/ca/fr/error/language-error\");\n      }\n    } else {\n      if (linkRow.length > 0) {\n        $('.desktop-region-language-menu-wrapper .content-language li a').each(function () {\n          if (langIndex < linkRow.length) {\n            $(this).attr('href', linkRow[langIndex]);\n            langIndex = langIndex + 1;\n          }\n        });\n        $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').each(function () {\n          if (langIndexMobile < linkRow.length) {\n            $(this).attr('href', linkRow[langIndexMobile]);\n            langIndexMobile = langIndexMobile + 1;\n          }\n        });\n      }\n      if (linkRow.length == 0 && linkCanRef != null) {\n        if (utag_data.page_language == 'en') {\n          $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', linkCanRef);\n          $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', linkCanRef);\n          $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', \"/content/sunlife/external/ca/fr/error/language-error\");\n          $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', \"/content/sunlife/external/ca/fr/error/language-error\");\n        }\n        if (utag_data.page_language == 'fr') {\n          $('.desktop-region-language-menu-wrapper .content-language li a').first().attr('href', \"/content/sunlife/external/ca/en/error/language-error\");\n          $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li a').first().attr('href', \"/content/sunlife/external/ca/en/error/language-error\");\n          $('.desktop-region-language-menu-wrapper .content-language li:nth-child(2)').children('a').attr('href', linkCanRef);\n          $('.mobile-header .mobile-region-language-menu-wrapper .language-tab li:nth-child(2)').children('a').attr('href', linkCanRef);\n        }\n      }\n    }\n  }\n  //Code for Language toggle ends //  \n});\n\n//# sourceURL=webpack://aem-maven-archetype/./src/main/webpack/prerequisite/base/scripts/language-toggle.js?");

/***/ }),

/***/ "./src/main/webpack/prerequisite/base/styles/base.scss":
/*!*************************************************************!*\
  !*** ./src/main/webpack/prerequisite/base/styles/base.scss ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://aem-maven-archetype/./src/main/webpack/prerequisite/base/styles/base.scss?");

/***/ }),

/***/ "./src/main/webpack/prerequisite/base/styles/druglist.scss":
/*!*****************************************************************!*\
  !*** ./src/main/webpack/prerequisite/base/styles/druglist.scss ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://aem-maven-archetype/./src/main/webpack/prerequisite/base/styles/druglist.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/webpack/prerequisite/base/index_module.js");
/******/ 	
/******/ })()
;