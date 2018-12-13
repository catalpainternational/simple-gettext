'use strict';

(function (global) {
    var catalog = { 'en': {} };

    global.gettext = function (messageId, variables, useMarkdown) {
        var replaceRegex = void 0;
        var translation = catalog[global.languageCode][messageId];
        translation = typeof translation === 'undefined' ? messageId : translation;

        variables = variables || {};

        Object.keys(variables).forEach(function (variableName) {
            var value = variables[variableName];
            replaceRegex = new RegExp('%{' + variableName + '}', 'g');
            translation = translation.replace(replaceRegex, value);
        });

        return useMarkdown ? global.markdownText(translation) : translation;
    };

    /** Convert any markdown in the sourceText, stripping off any bracketing HTML tags */
    global.markdownText = function (sourceText) {
        var conversion = mdConverter.makeHtml(sourceText).trim();

        // Get the HTML tag (the last one)
        var tagRegex = /<\/([a-z]*)>$/;
        var tagMatch = conversion.match(tagRegex);
        var tag;
        var tagStrip;
        var deTagged;

        if (tagMatch.length === 0 || tagMatch[1].length === 0) {
            // this should never occur, but just in case
            return conversion;
        }

        // Construct the tag stripping regex
        // Note: this does not support '>' within the opening tag's attributes
        tag = tagMatch[1];
        tagStrip = new RegExp('^<' + tag + '.*?>((?:\n|.)*)</' + tag + '>$');
        deTagged = conversion.match(tagStrip);
        if (deTagged.length === 0 || deTagged[1].length === 0) {
            // again, this should never occur, but just in case
            return conversion;
        }

        return deTagged[1];
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

extendGettextCatalog('tet', {
    'Title': 'Titulu',
    'title': 'titulu',
    'Description': 'Informasaun detallu',
    'Delete': 'Hamoos',
    'Back': 'Fila',
    'Cancel': 'Kansela',
    'Save': 'Rai',
    'Edit': 'Hadia',
    'Please confirm': 'Favor konfirma'
});
