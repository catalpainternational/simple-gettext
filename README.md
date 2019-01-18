# simple-gettext

### Installation instructions

1. Add this package as a dependency: `yarn add https://github.com/catalpainternational/simple-gettext/`

2. Include `gettext.js` and its showdown dependency to your JS:

    ```javascript
    <script type="text/javascript" src="showdown/dist/showdown.min.js"></script>
    <script type="text/javascript" src="simple-gettext/gettext.js"></script>

    ```

3. Add translations definitions. Example:

    ```javascript
    extendGettextCatalog('tet', {
        'Calendar': 'Kalendariu'
    });
    ```

4. Use gettext:

    ```javascript
    setLanguage('tet');
    gettext('Calendar') // returns 'Kalendariu'
    ```

    ```javascript
    setLanguage('tet');
    gettext('Welcome **%{name}**!', { name: 'Brian' }, true) // returns 'Benvindu <strong>Brian</strong>!'
    ```

Note: if `setLanguage` has never been called then `languageCode` will not be set, and gettext will return the supplied text untranslated.
Other options such as substitutions and markdown will still be performed according to their values.

5. Review gettext usage:

    Add a call to `gettext_extraction.js` in your build script.  `gettext_extraction.js` will look for all `.js` and `.html` files in your project and identify all the usages of `gettext` within them.  It will then examine any file it finds named `extendGettext.js` looking for any 'missing' definitions and it will add these to `extendGettext.js`.

    It is still up to the developer to review the 'missing' definitions that have been put into `extendGettext.js` and provide correct translations.

    For example, in a Cordova project's `config.xml` file the following hooks can be added:

    ```xml
    <hook src="node_modules/simple-gettext/scripts/gettext_extraction.js" type="before_build" />
    <hook src="node_modules/simple-gettext/scripts/gettext_extraction.js" type="before_run" />
    ```

    Or from a terminal shell (and assuming that you have node installed):
    ```
    node node_modules/simple-gettext/scripts/gettext_extraction.js
    ```