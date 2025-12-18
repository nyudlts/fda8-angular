import { testA11y } from 'cypress/support/utils';

describe('Browse By Subject - Removed from FDA Theme', () => {
  it('should only show allowed browse types (title, author, dateissued)', () => {
    // Navigate to community list
    cy.visit('/community-list');

    // Click on first community
    cy.get('ds-community-list a').first().click();

    // Check that only allowed browse tabs exist
    cy.get('a[href*="/browse/title"]').should('exist');
    cy.get('a[href*="/browse/author"]').should('exist');
    cy.get('a[href*="/browse/dateissued"]').should('exist');

    // Verify subject browse tab doesn't exist
    cy.get('a[href*="/browse/subject"]').should('not.exist');
  });
});
