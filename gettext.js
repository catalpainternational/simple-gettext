'use strict';

(function (global) {
    var catalog = { 'en': {} };

    global.gettext = function (messageId, variables) {
        var replaceRegex = void 0;
        var translation = catalog[global.languageCode][messageId];
        translation = typeof translation === 'undefined' ? messageId : translation;

        variables = variables || {};

        Object.keys(variables).forEach(function (variableName) {
            var value = variables[variableName];
            replaceRegex = new RegExp('%{' + variableName + '}', 'g');
            translation = translation.replace(replaceRegex, value);
        });

        return translation;
    };

    global.setLanguage = function (newLanguageCode) {
        global.languageCode = newLanguageCode;
        moment.locale(newLanguageCode);
    };
    global.setLanguage('en');

    global.extendGettextCatalog = function (language, translations) {
        if (catalog[language] === undefined) catalog[language] = {};
        Object.assign(catalog[language], translations);
    };
})(window);
