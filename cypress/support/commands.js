// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('smartAI', (originalSelector, clueText = '', options = {}) => {
  const isXPath = originalSelector.startsWith('//') || originalSelector.startsWith('(');
  const isCSS = !isXPath && (
    originalSelector.startsWith('.') ||
    originalSelector.startsWith('#') ||
    originalSelector.startsWith('[') ||
    /^[a-zA-Z]+/.test(originalSelector)
  );

  const findBestMatch = (tag) => {
    return cy.document().then((doc) => {
      const candidates = Array.from(doc.querySelectorAll(tag));
      if (candidates.length === 0) {
        throw new Error(`No <${tag}> elements found`);
      }

      const matches = candidates.map(el => {
        let score = 0;
        if (clueText && el.textContent?.toLowerCase().includes(clueText.toLowerCase())) score += 3;
        if (clueText && el.id?.toLowerCase().includes(clueText.toLowerCase())) score += 2;
        if (clueText && el.className?.toLowerCase().includes(clueText.toLowerCase())) score += 1;
        return { el, score };
      });

      const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
      if (!bestMatch || bestMatch.score === 0) {
        throw new Error(`No matching <${tag}> found for clue: "${clueText}"`);
      }

      const el = bestMatch.el;
      if (el.id) {
        const idSelector = `#${el.id}`;
        cy.log(`Fallback matched by ID: ${idSelector}`);
        return cy.get(idSelector, options).should('exist');
      } else if (el.className) {
        const classSelector = `.${el.className.trim().split(/\s+/)[0]}`;
        cy.log(`Fallback matched by class: ${tag}${classSelector}`);
        return cy.get(`${tag}${classSelector}`, options).should('exist');
      } else if (el.textContent) {
        const text = el.textContent.trim();
        const xpath = `//${tag}[text()="${text}"]`;
        cy.log(`Fallback matched by text XPath: ${xpath}`);
        return cy.xpath(xpath, options).should('exist');
      }

      throw new Error(`Unable to form selector from best-matching <${tag}>`);
    });
  };

  if (isXPath) {
    return cy.document().then(doc => {
      const result = doc.evaluate(originalSelector, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const el = result.singleNodeValue;

      if (el) {
        cy.log(`XPath matched: ${el.outerHTML}`);
        return cy.xpath(originalSelector, options).should('exist');
      } else {
        const tagMatch = originalSelector.match(/^\/\/(\w+)/);
        const fallbackTag = tagMatch ? tagMatch[1] : 'div';
        cy.log(`XPath failed. Falling back to tag <${fallbackTag}> with clue "${clueText}"`);
        return findBestMatch(fallbackTag);
      }
    });
  }

  if (isCSS) {
    return cy.document().then(doc => {
      let el;
      try {
        el = doc.querySelector(originalSelector);
      } catch (e) {
        cy.log(`Invalid CSS selector: ${originalSelector}`);
        throw new Error(`Invalid CSS selector: ${originalSelector}`);
      }

      if (el) {
        cy.log(`CSS matched: ${el.outerHTML}`);
        return cy.get(originalSelector, options).should('exist');
      } else {
        const tagMatch = originalSelector.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
        const tagName = tagMatch ? tagMatch[1] : 'div';
        cy.log(`CSS failed. Falling back to tag <${tagName}> with clue "${clueText}"`);
        return findBestMatch(tagName);
      }
    });
  }

  return cy.get(originalSelector, options).should('exist');
});
