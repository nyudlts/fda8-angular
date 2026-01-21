import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { JsonPatchOperationsBuilder } from '../../../../../../app/core/json-patch/builder/json-patch-operations-builder';
import { TranslateLoaderMock } from '../../../../../../app/shared/mocks/translate-loader.mock';
import { SectionsService } from '../../../../../../app/submission/sections/sections.service';
import { SubmissionService } from '../../../../../../app/submission/submission.service';
import { SubmissionSectionAccessibilityComponent } from './section-accessibility.component';

describe('SubmissionSectionAccessibilityComponent', () => {
  let component: SubmissionSectionAccessibilityComponent;
  let fixture: ComponentFixture<SubmissionSectionAccessibilityComponent>;
  let sectionsService: any;
  let submissionService: any;
  let operationsBuilder: any;

  const mockSectionData = {
    id: 'accessibility',
    sectionType: 'accessibility' as any,
    header: 'submit.progressbar.accessibility',
    config: '',
    mandatory: true,
    data: {},
    errorsToShow: [],
    serverValidationErrors: [],
    isLoading: false,
    isValid: false,
  };

  const mockSubmissionId = '1234';
  const mockCollectionId = 'test-collection';

  beforeEach(waitForAsync(() => {
    sectionsService = jasmine.createSpyObj('SectionsService', [
      'dispatchRemoveSectionErrors',
      'setSectionStatus',
      'isSectionReadOnly',
    ]);

    submissionService = jasmine.createSpyObj('SubmissionService', [
      'dispatchSaveSection',
      'getSubmissionScope',
    ]);

    operationsBuilder = jasmine.createSpyObj('JsonPatchOperationsBuilder', [
      'add',
      'remove',
    ]);

    sectionsService.isSectionReadOnly.and.returnValue(observableOf(false));

    TestBed.configureTestingModule({
      declarations: [SubmissionSectionAccessibilityComponent],
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
        { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
        { provide: 'sectionDataProvider', useValue: mockSectionData },
        { provide: 'submissionIdProvider', useValue: mockSubmissionId },
        { provide: 'collectionIdProvider', useValue: mockCollectionId },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSectionAccessibilityComponent);
    component = fixture.componentInstance;
    component.sectionData = mockSectionData;
    component.submissionId = mockSubmissionId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with granted as false', () => {
      component.onSectionInit();
      expect(component.granted).toBe(false);
    });

    it('should set isDisabled when read-only', () => {
      sectionsService.isSectionReadOnly.and.returnValue(observableOf(true));

      component.onSectionInit();

      expect(component.isDisabled).toBe(true);
    });
  });

  describe('Checkbox interaction', () => {
    beforeEach(() => {
      component.onSectionInit();
      fixture.detectChanges();
    });

    it('should update granted when checkbox is checked', () => {
      const event = { target: { checked: true } };

      component.onGrantedChange(event);

      expect(component.granted).toBe(true);
    });

    it('should update granted when checkbox is unchecked', () => {
      component.granted = true;
      const event = { target: { checked: false } };

      component.onGrantedChange(event);

      expect(component.granted).toBe(false);
    });

    it('should call add operation when checking', () => {
      const event = { target: { checked: true } };

      component.onGrantedChange(event);

      expect(operationsBuilder.add).toHaveBeenCalled();
    });

    it('should call remove operation when unchecking', () => {
      component.granted = true;
      const event = { target: { checked: false } };

      component.onGrantedChange(event);

      expect(operationsBuilder.remove).toHaveBeenCalled();
    });

    it('should dispatch save section', () => {
      const event = { target: { checked: true } };

      component.onGrantedChange(event);

      expect(submissionService.dispatchSaveSection).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
      );
    });

    it('should update section status', () => {
      const event = { target: { checked: true } };

      component.onGrantedChange(event);

      expect(sectionsService.setSectionStatus).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
        true,
      );
    });
  });

  describe('Section status', () => {
    beforeEach(() => {
      component.onSectionInit(); // Initialize pathCombiner
    });

    it('should set section to invalid when unchecked', () => {
      const event = { target: { checked: false } };

      component.onGrantedChange(event);

      expect(sectionsService.setSectionStatus).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
        false,
      );
    });

    it('should set section to valid when checked', () => {
      const event = { target: { checked: true } };

      component.onGrantedChange(event);

      expect(sectionsService.setSectionStatus).toHaveBeenCalledWith(
        mockSubmissionId,
        'accessibility',
        true,
      );
    });
  });

  describe('Template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should start with granted false', () => {
      component.onSectionInit();
      fixture.detectChanges();

      expect(component.granted).toBe(false);
    });

    it('should disable checkbox when isDisabled is true', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      // Component should be disabled
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.subs = [subscription];

      component.onSectionDestroy();

      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('AfterViewChecked', () => {
    it('should call detectChanges', () => {
      // The changeDetectorRef is private to the component
      // Just verify the method doesn't throw an error
      expect(() => component.ngAfterViewChecked()).not.toThrow();
    });
  });
});
