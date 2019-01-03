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
