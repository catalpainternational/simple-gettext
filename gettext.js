'use strict';

// polyfill for Object.assign, only available in Chrome >= 45
if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) { // .length of function is 2

            'use strict';

            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            // eslint-disable-next-line no-plusplus
            for (let index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    // eslint-disable-next-line no-restricted-syntax
                    for (let nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

(function(global) {
    var catalog = { 'en': {} };

    global.gettext = function(messageId, variables, useMarkdown) {
        let replaceRegex;
        let translation = messageId;
        if (global.languageCode && catalog[global.languageCode] && catalog[global.languageCode][messageId]) {
            translation = catalog[global.languageCode][messageId];
        }

        variables = variables || {};

        Object.keys(variables).forEach(function(variableName) {
            var value = variables[variableName];
            replaceRegex = new RegExp('%{' + variableName + '}', 'g');
            translation = translation.replace(replaceRegex, value);
        });

        return useMarkdown ? global.markdownText(translation) : translation;
    };

    /** Convert any markdown in the sourceText, stripping off any bracketing HTML tags */
    global.markdownText = function(sourceText) {
        // eslint-disable-next-line no-undef
        global.mdConverter = global.mdConverter || new showdown.Converter();
        const conversion = global.mdConverter.makeHtml(sourceText).trim();

        // Get the HTML tag (the last one)
        const tagRegex = /<\/([a-z]*)>$/;
        const tagMatch = conversion.match(tagRegex);
        let tag;
        let tagStrip;
        let deTagged;

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

    global.setLanguage = function(newLanguageCode) {
        global.languageCode = newLanguageCode;
    };
    global.setLanguage('en');

    global.extendGettextCatalog = function(language, translations) {
        if (catalog[language] === undefined) catalog[language] = {};
        Object.assign(catalog[language], translations);
    };
}(window));

// eslint-disable-next-line no-undef
extendGettextCatalog('tet', {
    'Loading ...': 'Karregando hela ...',

    'Ok': 'OK',
    'Welcome': 'Benvindu',
    'settings': 'settings',
    'Language': 'Lian',
    'About': 'Kona ba',
    'Questions': 'Pergunta',
    'done': 'loos ona',

    'Title': 'Titulu',
    'title': 'titulu',
    'Description': 'Informasaun detallu',

    'Next': 'Tuir mai',
    'Delete': 'Hamoos',
    'Back': 'Fila',
    'Cancel': 'Kansela',
    'Save': 'Rai',
    'Edit': 'Hadia',
    'Close': 'Taka',

    'no': 'lae',
    'yes': 'sim',
    'No': 'Lae',
    'Yes': 'Sim',

    'Welcome **%{name}**!': 'Benvindu **%{name}**!',
    'Please confirm': 'Favor konfirma',
    'Thank you!': 'Obrigadu!',

    '': '',

    'first': 'primeiru',
    'second': 'segundu',
    'third': 'terseiru',
    'fourth': 'kuartu',
    'fifth': 'kintu',
    'sixth': 'sextu',
    'seventh': 'setimu'
});
