/**
* E2E tests for Accessibility Acknowledgment Step in submission workflow
*/

describe('Accessibility Step', () => {
  const TEST_COLLECTION = 'Test Collection';
  const TEST_COMMUNITY = 'Test Community';

  before(() => {
    cy.fixture('accessibility-metadata').then((data) => {
      data.metadataFields.forEach((field) => {
        cy.request({
          method: 'POST',
          url: '/server/api/core/metadatafields',
          body: field,
          failOnStatusCode: false
        });
      });
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  afterEach(() => {
    cy.logout();
  });

  it('should display the accessibility step in submission workflow', () => {
    // Start a new submission
    cy.visit('/submit');

    // Select collection
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();

    // Navigate through steps until accessibility
    cy.get('[data-test="next-button"]').click(); // Past describe step

    // Should see accessibility step
    cy.get('[data-test="submission-section-accessibility"]').should('be.visible');
    cy.contains('Accessibility Guidelines').should('be.visible');
  });

  it('should display accessibility guidelines text', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();

    // Navigate to accessibility step
    cy.get('[data-test="next-button"]').click();

    // Check for guidelines content
    cy.get('[data-test="accessibility-guidelines"]').should('be.visible');
    cy.contains('Digital Accessibility').should('exist');
  });

  it('should display acknowledgment checkbox', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check for checkbox
    cy.get('[data-test="accessibility-checkbox"]').should('be.visible');
    cy.get('[data-test="accessibility-checkbox"]').should('not.be.checked');
  });

  it('should block progression when checkbox is not checked', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Try to proceed without checking - button should be disabled
    cy.get('[data-test="next-button"]').then(($btn) => {
      // Check if disabled via attribute or class
      const isDisabled = $btn.is(':disabled') ||
                        $btn.hasClass('disabled') ||
                        $btn.attr('disabled') !== undefined;
      cy.wrap(isDisabled).should('be.true');
    });
  });

  it('should allow progression when checkbox is checked', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check the acknowledgment box
    cy.get('[data-test="accessibility-checkbox"]').check();

    // Next button should be enabled
    cy.get('[data-test="next-button"]').should('not.be.disabled');
  });

  it('should persist acknowledgment when navigating back and forth', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check the box
    cy.get('[data-test="accessibility-checkbox"]').check();
    cy.get('[data-test="accessibility-checkbox"]').should('be.checked');

    // Go to next step
    cy.get('[data-test="next-button"]').click();

    // Go back
    cy.get('[data-test="previous-button"]').click();

    // Checkbox should still be checked
    cy.get('[data-test="accessibility-checkbox"]').should('be.checked');
  });

  it('should show validation error when trying to complete without acknowledgment', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Try to save and exit or complete
    cy.get('[data-test="save-button"]').click();

    // Should show error message - check for either alert type
    cy.get('body').then(($body) => {
      const hasWarning = $body.find('.alert-warning').length > 0;
      const hasError = $body.find('.alert-danger').length > 0;
      const hasText = $body.text().includes('must acknowledge');

      cy.wrap(hasWarning || hasError || hasText).should('be.true');
    });
  });

  it('should make API call when checkbox is checked', () => {
    // Intercept PATCH request
    cy.intercept('PATCH', '**/api/submission/workspaceitems/**').as('patchAccessibility');

    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check the box
    cy.get('[data-test="accessibility-checkbox"]').check();

    // Wait for API call
    cy.wait('@patchAccessibility').then((interception) => {
      // Verify request body contains accessibility operation
      cy.wrap(interception.request.body).should('have.length.greaterThan', 0);
      const operation = interception.request.body.find(op =>
        op.path && op.path.includes('accessibility'),
      );
      cy.wrap(operation).should('exist');
      cy.wrap(operation.op).should('equal', 'add');
      cy.wrap(operation.value).should('be.true');
    });
  });

  it('should display acknowledgment status after page reload', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check and save
    cy.get('[data-test="accessibility-checkbox"]').check();
    cy.get('[data-test="save-button"]').click();
    cy.contains('saved successfully', { timeout: 10000 });

    // Get submission ID from URL
    cy.url().then((url) => {
      const match = url.match(/workspaceitems\/(\d+)/);
      if (match) {
        const submissionId = match[1];

        // Reload the page
        cy.visit(`/submit/${submissionId}`);

        // Navigate to accessibility step
        cy.get('[data-test="submission-section-accessibility"]').click();

        // Should show as acknowledged
        cy.get('[data-test="accessibility-checkbox"]').should('be.checked');
      }
    });
  });

  it('should be accessible - keyboard navigation', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Focus on checkbox using keyboard
    cy.get('[data-test="accessibility-checkbox"]').focus();
    cy.focused().should('have.attr', 'data-test', 'accessibility-checkbox');

    // Press space to check
    cy.focused().type(' ');
    cy.get('[data-test="accessibility-checkbox"]').should('be.checked');
  });

  it('should have proper ARIA labels', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check for ARIA labels
    cy.get('[data-test="accessibility-checkbox"]')
      .should('have.attr', 'aria-label');

    cy.get('[data-test="accessibility-checkbox"]')
      .invoke('attr', 'aria-label')
      .should('include', 'acknowledge');

    // Guidelines section should have proper heading
    cy.get('h2, h3').contains('Accessibility').should('exist');
  });

  it('should show error inline when validation fails', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Try to proceed without checking
    cy.get('[data-test="next-button"]').click({ force: true });

    // Should show inline error
    cy.get('body').then(($body) => {
      // Check for error by data-test attribute or class
      const hasError = $body.find('[data-test="accessibility-error"]').length > 0 ||
                      $body.find('.error-message').length > 0 ||
                      $body.text().includes('required') ||
                      $body.text().includes('must acknowledge');

      cy.wrap(hasError).should('be.true');
    });
  });

  it('should support unchecking (if allowed by business rules)', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check
    cy.get('[data-test="accessibility-checkbox"]').check();
    cy.get('[data-test="accessibility-checkbox"]').should('be.checked');

    // Uncheck
    cy.get('[data-test="accessibility-checkbox"]').uncheck();

    // Should either:
    // - Allow unchecking and disable next button
    cy.get('[data-test="accessibility-checkbox"]').should('not.be.checked');
    cy.get('[data-test="next-button"]').should('be.disabled');
    // OR
    // - Prevent unchecking (checkbox stays checked)
    // cy.get('[data-test="accessibility-checkbox"]').should('be.checked');
  });

  it('should handle API errors gracefully', () => {
    // Intercept and force error
    cy.intercept('PATCH', '**/api/submission/workspaceitems/**', {
      statusCode: 500,
      body: { message: 'Server error' },
    }).as('patchError');

    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();
    cy.get('[data-test="next-button"]').click();

    // Check the box
    cy.get('[data-test="accessibility-checkbox"]').check();

    // Wait for error
    cy.wait('@patchError');

    // Should show error message
    cy.get('.alert-danger, .notification-error').should('be.visible');
    cy.contains('error', { matchCase: false }).should('be.visible');
  });

  it('should complete full submission with accessibility acknowledgment', () => {
    cy.visit('/submit');
    cy.get('[data-test="submission-collection-select"]').click();
    cy.contains(TEST_COLLECTION).click();

    // Fill out basic metadata
    cy.get('[data-test="dc-title"]').type('Test Item with Accessibility');
    cy.get('[data-test="dc-date-issued"]').type('2025-01-15');
    cy.get('[data-test="next-button"]').click();

    // Acknowledge accessibility
    cy.get('[data-test="accessibility-checkbox"]').check();
    cy.get('[data-test="next-button"]').click();

    // Continue through remaining steps
    // (Upload, license, etc.)

    // Final deposit should succeed
    cy.get('[data-test="deposit-button"]').click();
    cy.contains('successfully', { timeout: 10000 }).should('be.visible');
  });
});
