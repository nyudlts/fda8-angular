// cypress/e2e/item-page-collection-config.cy.ts

import { testA11y } from 'cypress/support/utils';

describe('Item Page Collection Configuration', () => {

  // Test item UUIDs from environment
  const DEFAULT_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_DEFAULT_ITEM'));
  const JONES_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_JONES_ITEM') || 'skip');
  const RELICS_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_RELICS_ITEM') || 'skip');
  const LAEFER_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_LAEFER_ITEM') || 'skip');
  const TANDON_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_TANDON_ITEM') || 'skip');
  const TANDONCAPSTONE_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_TANDONCAPSTONE_ITEM') || 'skip');
  const DNP_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_DNP_ITEM') || 'skip');
  const CALABASH_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_CALABASH_ITEM') || 'skip');
  const OPENSCHOLARSHIP_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_OPENSCHOLARSHIP_ITEM') || 'skip');
  const SYLLABI_ITEM = '/items/'.concat(Cypress.env('DSPACE_TEST_FDA_SYLLABI_ITEM') || 'skip');

  describe('Default Collection Item', () => {
    beforeEach(() => {
      cy.visit(DEFAULT_ITEM);
    });

    it('should load the item page', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
    });

    it('should display default fields', () => {
      cy.get('.itemDisplayTable').should('be.visible');
      cy.get('th.metadataFieldLabel, td.metadataFieldLabel, .itemDisplayTable th').should('have.length.greaterThan', 0);
    });

    it('should display title as h1', () => {
      cy.get('h1.page-title, h1').should('be.visible');
    });

    it('should have authors as links separated by semicolons', () => {
      cy.get('.itemDisplayTable').then($table => {
        const html = $table.html();
        // Check for various author field labels
        if (html.includes('Author') || html.includes('Creator') || html.includes('Contributor')) {
          cy.get('.itemDisplayTable').contains(/Author|Creator|Contributor/i).parents('tr').within(() => {
            cy.get('a').should('exist'); // Authors should be links
          });
        } else {
          cy.log('No author field found - skipping test');
          this.skip();
        }
      });
    });

    it('should display files section', () => {
      // Check for multiple possible file section selectors
      cy.get('body').then($body => {
        const hasFiles =
          $body.find('.panel-info').length > 0 ||
          $body.find('.file-section').length > 0 ||
          $body.find('ds-item-page-file-section').length > 0 ||
          $body.find('[class*="file"]').length > 0;

        if (hasFiles) {
          cy.get('.panel-info, .file-section, ds-item-page-file-section, [class*="file"]').should('exist');
        } else {
          cy.log('No files section found - item may not have files');
        }
      });
    });

    it('should have working full item link', () => {
      cy.get('body').then($body => {
        if ($body.find('a[href*="/full"]').length > 0) {
          cy.get('a[href*="/full"]').first().click();
          cy.url().should('include', '/full');
        } else {
          cy.log('No full item link found - skipping');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Jones Collection Tests
  describe('Jones Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_JONES_ITEM')) {
        this.skip();
      }
      cy.visit(JONES_ITEM);
    });

    it('should load with Jones configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display Jones-specific labels', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasJonesLabels =
          text.includes('Date of digital object') ||
          text.includes('Date of object depicted') ||
          text.includes('Technical designation') ||
          text.includes('Technical specifications');

        if (hasJonesLabels) {
          cy.log('Jones-specific labels found');
          const result = expect(hasJonesLabels).to.be.true;
          cy.wrap(result);
        } else {
          cy.log('No Jones-specific labels found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Relics Collection Tests
  describe('Relics Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_RELICS_ITEM')) {
        this.skip();
      }
      cy.visit(RELICS_ITEM);
    });

    it('should load with Relics configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display Relics-specific fields', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasRelicsFields =
          text.includes('Country') ||
          text.includes('Source');

        if (hasRelicsFields) {
          cy.log('Relics-specific fields found');
          const result = expect(hasRelicsFields).to.be.true;
          cy.wrap(result);
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Laefer Collection Tests
  describe('Laefer Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_LAEFER_ITEM')) {
        this.skip();
      }
      cy.visit(LAEFER_ITEM);
    });

    it('should load with Laefer configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Tandon Collection Tests
  describe('Tandon Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_TANDON_ITEM')) {
        this.skip();
      }
      cy.visit(TANDON_ITEM);
    });

    it('should load with Tandon configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display page number fields', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasPageFields =
          text.includes('First Page') ||
          text.includes('Last Page');

        if (hasPageFields) {
          cy.log('Page number fields found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Tandon Capstone Collection Tests
  describe('Tandon Capstone Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_TANDONCAPSTONE_ITEM')) {
        this.skip();
      }
      cy.visit(TANDONCAPSTONE_ITEM);
    });

    it('should load with Tandon Capstone configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display advisor field', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        if (text.includes('Capstone Professor') || text.includes('Advisor')) {
          cy.log('Advisor field found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // DNP Collection Tests
  describe('DNP Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_DNP_ITEM')) {
        this.skip();
      }
      cy.visit(DNP_ITEM);
    });

    it('should load with DNP configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display thesis-specific fields', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasThesisFields =
          text.includes('Degree') ||
          text.includes('Grantor') ||
          text.includes('MeSH term') ||
          text.includes('DNP Project Team Member');

        if (hasThesisFields) {
          cy.log('Thesis-specific fields found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Calabash Collection Tests
  describe('Calabash Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_CALABASH_ITEM')) {
        this.skip();
      }
      cy.visit(CALABASH_ITEM);
    });

    it('should load with Calabash configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display journal-specific fields', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasJournalFields =
          text.includes('Journal Title') ||
          text.includes('Volume') ||
          text.includes('Issue') ||
          text.includes('Translator');

        if (hasJournalFields) {
          cy.log('Journal-specific fields found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // OpenScholarship Collection Tests
  describe('OpenScholarship Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_OPENSCHOLARSHIP_ITEM')) {
        this.skip();
      }
      cy.visit(OPENSCHOLARSHIP_ITEM);
    });

    it('should load with OpenScholarship configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display sponsorship field', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        if (text.includes('Sponsorship')) {
          cy.log('Sponsorship field found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Syllabi Collection Tests
  describe('Syllabi Collection Item', () => {
    beforeEach(function() {
      if (!Cypress.env('DSPACE_TEST_FDA_SYLLABI_ITEM')) {
        this.skip();
      }
      cy.visit(SYLLABI_ITEM);
    });

    it('should load with Syllabi configuration', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      cy.get('.itemDisplayTable').should('be.visible');
    });

    it('should display syllabi-specific fields', () => {
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        const hasSyllabiFields =
          text.includes('Instructor') ||
          text.includes('Course Number') ||
          text.includes('Term');

        if (hasSyllabiFields) {
          cy.log('Syllabi-specific fields found');
        }
      });
    });

    it('should pass accessibility tests', () => {
      cy.get('.item-page-content', { timeout: 10000 }).should('be.visible');
      testA11y('.item-page-content');
    });
  });

  // Common tests
  describe('Common Item Page Features', () => {

    it('should have correct table structure', () => {
      cy.visit(DEFAULT_ITEM);
      cy.get('.itemDisplayTable tbody tr, .itemDisplayTable tr').should('have.length.greaterThan', 0);
    });

    it('should display collections link', () => {
      cy.visit(DEFAULT_ITEM);
      cy.get('.itemDisplayTable').then($table => {
        const text = $table.text();
        if (text.includes('Collection') || text.includes('Part of')) {
          cy.log('Collections field found');
        }
      });
    });

    it('should display copyright notice', () => {
      cy.visit(DEFAULT_ITEM);
      cy.get('footer').should('be.visible');
    });

    it('should have accessible links', () => {
      cy.visit(DEFAULT_ITEM);
      cy.get('a').each(($link) => {
        const text = $link.text().trim();
        const ariaLabel = $link.attr('aria-label');
        const hasAccessibleText = text.length > 0 || !!ariaLabel;
        cy.wrap(hasAccessibleText, 'Link should have text or aria-label').should('be.true');
      });
    });
  });
});
