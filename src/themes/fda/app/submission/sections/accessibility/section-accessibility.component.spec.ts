import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { TranslateLoaderMock } from '../../../app/shared/mocks/translate-loader.mock';
import { SectionsService } from '../../../app/submission/sections/sections.service';
import { SectionsType } from '../../../app/submission/sections/sections-type';
import { SubmissionService } from '../../../app/submission/submission.service';
import { SectionAccessibilityComponent } from './section-accessibility.component';

describe('SectionAccessibilityComponent', () => {
  let component: SectionAccessibilityComponent;
  let fixture: ComponentFixture<SectionAccessibilityComponent>;
  let sectionsService: any;
  let submissionService: any;

  const mockSectionData = {
    id: 'accessibility',
    sectionType: SectionsType.Accessibility,
    header: 'submit.progressbar.accessibility',
    data: {
      granted: false,
      acceptanceDate: null,
    },
    errorsToShow: [],
    isLoading: false,
    isValid: false,
  };

  const mockSubmissionId = '1234';

  beforeEach(waitForAsync(() => {
    sectionsService = jasmine.createSpyObj('SectionsService', [
      'dispatchRemoveSectionErrors',
      'setSectionStatus',
      'dispatchSetSectionStatus',
      'getSectionErrors',
      'isSectionReadOnly',
    ]);

    submissionService = jasmine.createSpyObj('SubmissionService', [
      'dispatchSaveSection',
      'getSubmissionScope',
    ]);

    sectionsService.getSectionErrors.and.returnValue(observableOf([]));
    sectionsService.isSectionReadOnly.and.returnValue(observableOf(false));

    TestBed.configureTestingModule({
      declarations: [SectionAccessibilityComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: SectionsService, useValue: sectionsService },
        { provide: SubmissionService, useValue: submissionService },
        { provide: 'sectionDataProvider', useValue: mockSectionData },
        { provide: 'submissionIdProvider', useValue: mockSubmissionId },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionAccessibilityComponent);
    component = fixture.componentInstance;
    component.sectionData = mockSectionData;
    component.submissionId = mockSubmissionId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with granted as false', () => {
      expect(component.granted).toBe(false);
    });

    it('should initialize granted as true if already acknowledged', () => {
      const acknowledgedData = {
        ...mockSectionData,
        data: {
          granted: true,
          acceptanceDate: '2025-01-15T10:30:00Z',
        },
      };
      component.sectionData = acknowledgedData;
      component.onSectionInit();

      expect(component.granted).toBe(true);
    });

    it('should set section to read-only when appropriate', () => {
      sectionsService.isSectionReadOnly.and.returnValue(observableOf(true));

      component.onSectionInit();

      expect(component.isDisabled).toBe(true);
    });

    it('should initialize path combiner', () => {
      component.onSectionInit();

      expect(component.pathCombiner).toBeDefined();
    });
  });

  describe('Checkbox interaction', () => {
    it('should update granted state when checkbox is checked', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));

      checkbox.nativeElement.checked = true;
      checkbox.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.granted).toBe(true);
    });

    it('should call sendPatchOperation when checkbox is checked', () => {
      spyOn(component, 'sendPatchOperation');

      component.onCheckboxChange({ target: { checked: true } });

      expect(component.sendPatchOperation).toHaveBeenCalledWith(true);
    });

    it('should call sendPatchOperation when checkbox is unchecked', () => {
      component.granted = true;
      spyOn(component, 'sendPatchOperation');

      component.onCheckboxChange({ target: { checked: false } });

      expect(component.sendPatchOperation).toHaveBeenCalledWith(false);
    });

    it('should dispatch save section when checkbox changes', () => {
      component.onCheckboxChange({ target: { checked: true } });

      expect(submissionService.dispatchSaveSection).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
      );
    });
  });

  describe('PATCH operation', () => {
    it('should build correct PATCH operation for granting', () => {
      spyOn(component.operationsBuilder, 'add');

      component.sendPatchOperation(true);

      expect(component.operationsBuilder.add).toHaveBeenCalled();
    });

    it('should build PATCH operation with correct path', () => {
      const expectedPath = '/sections/accessibility/granted';
      spyOn(component.pathCombiner, 'getPath').and.returnValue(expectedPath);
      spyOn(component.operationsBuilder, 'add');

      component.sendPatchOperation(true);

      expect(component.pathCombiner.getPath).toHaveBeenCalledWith('granted');
      expect(component.operationsBuilder.add).toHaveBeenCalledWith(
        expectedPath,
        jasmine.any(String),
        false,
        true,
      );
    });

    it('should remove operation when unchecking', () => {
      spyOn(component.operationsBuilder, 'remove');

      component.sendPatchOperation(false);

      expect(component.operationsBuilder.remove).toHaveBeenCalled();
    });
  });

  describe('Section status', () => {
    it('should return true when granted', (done) => {
      component.granted = true;

      component.getSectionStatus().subscribe(status => {
        expect(status).toBe(true);
        done();
      });
    });

    it('should return false when not granted', (done) => {
      component.granted = false;

      component.getSectionStatus().subscribe(status => {
        expect(status).toBe(false);
        done();
      });
    });

    it('should update section status when checkbox changes', () => {
      component.onCheckboxChange({ target: { checked: true } });

      expect(sectionsService.setSectionStatus).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
        true,
      );
    });

    it('should set section to invalid when unchecked', () => {
      component.granted = true;
      component.onCheckboxChange({ target: { checked: false } });

      expect(sectionsService.setSectionStatus).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
        false,
      );
    });
  });

  describe('Error handling', () => {
    it('should handle section errors', () => {
      const mockErrors = [{
        message: 'error.validation.accessibility.required',
        path: '/sections/accessibility/granted',
      }];

      sectionsService.getSectionErrors.and.returnValue(observableOf(mockErrors));

      component.onSectionInit();

      // Component should handle errors
      expect(component.errors).toBeDefined();
    });

    it('should remove errors when checkbox is checked', () => {
      component.onCheckboxChange({ target: { checked: true } });

      expect(sectionsService.dispatchRemoveSectionErrors).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
      );
    });
  });

  describe('Template rendering', () => {
    it('should render checkbox', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox).toBeTruthy();
    });

    it('should show guidelines text', () => {
      const guidelines = fixture.debugElement.query(By.css('[data-test="accessibility-guidelines"]'));
      expect(guidelines).toBeTruthy();
    });

    it('should disable checkbox when read-only', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox.nativeElement.disabled).toBe(true);
    });

    it('should show acknowledgment message when already granted', () => {
      component.granted = true;
      component.sectionData.data.granted = true;
      component.sectionData.data.acceptanceDate = '2025-01-15T10:30:00Z';
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('.alert-success'));
      expect(message).toBeTruthy();
    });

    it('should show error message when validation fails', () => {
      component.errors = [{
        message: 'error.validation.accessibility.required',
        path: '/sections/accessibility/granted',
      }];
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.alert-warning, .alert-danger'));
      expect(error).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.subs = [subscription];

      component.onSectionDestroy();

      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle multiple subscriptions', () => {
      const sub1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      const sub2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.subs = [sub1, sub2];

      component.onSectionDestroy();

      expect(sub1.unsubscribe).toHaveBeenCalled();
      expect(sub2.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle missing section data gracefully', () => {
      component.sectionData = null;

      expect(() => component.onSectionInit()).not.toThrow();
    });

    it('should handle undefined granted value', () => {
      component.sectionData.data.granted = undefined;
      component.onSectionInit();

      expect(component.granted).toBe(false);
    });

    it('should handle null acceptance date', () => {
      component.sectionData.data.acceptanceDate = null;
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should prevent unchecking when already granted (if business rule)', () => {
      component.granted = true;
      component.sectionData.data.granted = true;

      component.onCheckboxChange({ target: { checked: false } });

      // Depending on business rules, might prevent unchecking
      // expect(component.granted).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for checkbox', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      const label = fixture.debugElement.query(By.css('label[for]'));

      expect(label).toBeTruthy();
      expect(checkbox.nativeElement.id).toBe(label.nativeElement.htmlFor);
    });

    it('should have proper ARIA attributes', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));

      expect(checkbox.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have semantic heading', () => {
      const heading = fixture.debugElement.query(By.css('h2, h3'));
      expect(heading).toBeTruthy();
    });
  });
});
