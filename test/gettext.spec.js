/* global beforeEach describe expect gettext it setLanguage */
/* eslint-env mocha node */

// gettext.js is included in the karma.conf.js

describe('gettext', () => {
    it('sets the language to english and then to tetun', () => {
        setLanguage('en');
        // eslint-disable-next-line no-undef
        expect(languageCode).to.equal('en');
        setLanguage('tet');
        // eslint-disable-next-line no-undef
        expect(languageCode).to.equal('tet');
    });

    describe('english to tetun', () => {
        beforeEach(() => { setLanguage('tet'); });

        it('translates a simple phrase', () => {
            const simpleTranslation = gettext('Please confirm');
            expect(simpleTranslation).to.equal('Favor konfirma');
        });

        it('translates text with substitution placeholders, when no substitutions provided', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!');
            expect(simpleTranslation).to.equal('Benvindu **%{name}**!');
        });

        it('translates text with substitution placeholders, when wrong substitutions provided', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { error: 'Brian' });
            expect(simpleTranslation).to.equal('Benvindu **%{name}**!');
        });

        it('translates text with substitutions', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { name: 'Brian' });
            expect(simpleTranslation).to.equal('Benvindu **Brian**!');
        });

        it('translates text with markdown, but useMarkdown not set', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!');
            expect(simpleTranslation).to.equal('Benvindu **%{name}**!');
        });

        it('translates text with markdown, and useMarkdown set to true', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { name: 'Brian' }, true);
            expect(simpleTranslation).to.equal('Benvindu <strong>Brian</strong>!');
        });

        it('accepts text, without any translation, and returns it as-is', () => {
            const simpleTranslation = gettext('This is some unknown english text.');
            expect(simpleTranslation).to.equal('This is some unknown english text.');
        });
    });

    describe('english to english', () => {
        beforeEach(() => { setLanguage('en'); });

        it('\'translates\' a simple phrase', () => {
            const simpleTranslation = gettext('Please confirm');
            expect(simpleTranslation).to.equal('Please confirm');
        });

        it('\'translate\' text with substitution placeholders, when no substitutions provided', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!');
            expect(simpleTranslation).to.equal('Welcome **%{name}**!');
        });

        it('\'translate\' text with substitutions, when wrong substitutions provided', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { error: 'Brian' });
            expect(simpleTranslation).to.equal('Welcome **%{name}**!');
        });

        it('\'translate\' text with substitutions', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { name: 'Brian' });
            expect(simpleTranslation).to.equal('Welcome **Brian**!');
        });

        it('\'translate\' text with markdown, but useMarkdown not set', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!');
            expect(simpleTranslation).to.equal('Welcome **%{name}**!');
        });

        it('\'translate\' text with markdown, and useMarkdown set to true', () => {
            const simpleTranslation = gettext('Welcome **%{name}**!', { name: 'Brian' }, true);
            expect(simpleTranslation).to.equal('Welcome <strong>Brian</strong>!');
        });

        it('accepts text, without any translation, and returns it as-is', () => {
            const simpleTranslation = gettext('This is some unknown english text.');
            expect(simpleTranslation).to.equal('This is some unknown english text.');
        });
    });
});
