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
