# SmartGet — Self-Healing Cypress Selector

> A custom Cypress command that **automatically recovers from broken selectors** using AI-powered fallback logic — no more flaky tests due to outdated XPath or CSS selectors.

---

## What is SmartAI?

**SmartAI** is a custom Cypress command (`cy.smartAI`) that makes your end-to-end tests resilient to UI changes.

When a selector (XPath or CSS) **fails to find an element**, SmartAI doesn't just throw an error — it **intelligently scans the DOM**, uses a clue (text, id, or class hint) to find the best matching element, and **automatically recovers** — keeping your tests running without manual intervention.

---

## The Problem It Solves

In traditional Cypress tests, if a selector breaks due to a UI change, the test **immediately fails**:

```js
//  Breaks when the label text or DOM structure changes
cy.xpath("//label[normalize-space()='Username']").should("have.text", "Username");
cy.get("input#username").type("varshini");
```

With SmartAI, the test **heals itself**:

```js
//  Even with a wrong/partial selector, SmartAI finds the right element
cy.smartAI("//label[text()='U']", "Username").should("have.text", "Username");
cy.smartAI("input#us", "name").type("varshini");
```

---

## Features

| Feature | Description |
|---|---|
|  **XPath Recovery** | Falls back to tag + clue matching when XPath fails |
|  **CSS Recovery** | Falls back to tag + clue matching when CSS selector fails |
|  **Smart Scoring** | Ranks DOM elements by text, ID, and class similarity |
|  **Detailed Logging** | Logs matched selector strategy in Cypress test runner |
|  **Zero Config** | Just provide a clue string — SmartAI handles the rest |

---

## 📁 Project Structure

```
cypress/
├── e2e/
│   └── AITestRecovery.cy.js       # Test file using cy.smartAI
└── support/
    └── commands.js                # SmartAI custom command definition
```

---

##  Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/smartai-cypress.git
cd smartai-cypress
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install cypress-xpath (required for XPath support)
```bash
npm install cypress-xpath
```

### 4. Import in `cypress/support/e2e.js`
```js
require('cypress-xpath');
```

### 5. Run the tests
```bash
npx cypress open
```

---

##  Usage

```js
cy.smartAI(selector, clueText)
```

| Parameter | Type | Description |
|---|---|---|
| `selector` | `string` | XPath or CSS selector (can be partial/broken) |
| `clueText` | `string` | A hint to help SmartAI identify the correct element |

---

##  Example Test

```js
describe("AI Selector Recovery", () => {
  it("SmartAI Test", () => {
    cy.visit('/practice-test-login/');

    //  Even with wrong XPath, SmartAI finds the h2 heading
    cy.smartAI("//h2[text()='Test']", "Test login")
      .should("have.text", "Test login");

    //  Partial label selector — SmartAI recovers using "Username" clue
    cy.smartAI("//label[text()='U']", "Username")
      .should("have.text", "Username")
      .and("be.visible");

    //  Broken CSS input selector — recovered using "name" clue
    cy.smartAI("input#us", "name")
      .type("varshini");

    //  Broken button XPath — recovered using "submit" clue
    cy.smartAI("//button[@name='login']", "submit")
      .should("be.visible").click({ force: true });
  });
});
```

---

##  How It Works

```
cy.smartAI(selector, clueText)
        │
        ▼
Is it XPath or CSS?
        │
   ┌────┴────┐
   ▼         ▼
XPath       CSS
Try it      Try it
   │           │
Fails?      Fails?
   │           │
   └────┬──────┘
        ▼
  Extract HTML tag
  (e.g. label, input, button)
        │
        ▼
  Scan all matching tags in DOM
        │
        ▼
  Score each element:
  +3 textContent match
  +2 id match
  +1 class match
        │
        ▼
  Pick highest score element
        │
        ▼
  Build new selector (id / class / xpath)
        │
        ▼
  Return cy.get() or cy.xpath() 
```

---

##  Fallback Strategy

SmartAI uses a **scoring system** to identify the best DOM element when the original selector fails:

| Match Type | Score |
|---|---|
| Text content contains clue | +3 |
| Element ID contains clue | +2 |
| Element class contains clue | +1 |

The element with the **highest score** is selected and a new valid selector is auto-generated.

---

##  Demo

> Test passes even with intentionally broken/partial selectors:

- `"//h2[text()='Test']"` → recovers to actual `<h2>Test login</h2>`
- `"input#us"` → recovers to `input#username`
- `"//button[@name='login']"` → recovers to `<button id="submit">`

---

##  Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the fallback logic, add fuzzy matching, or support more selector types.

---

##  Author

**Varshini UmaShankar**
> Built with passion for making Cypress tests smarter and more resilient.<br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/u-varshini)<br>
[![Demo](https://img.shields.io/badge/Demo-View%20Site-green?style=for-the-badge&logo=google)](https://sites.google.com/view/smartelementdetect-varshini/self-healing-selectors/)

---

##  License

MIT License — free to use, modify, and distribute.

---

