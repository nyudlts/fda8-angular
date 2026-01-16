import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { JsonPatchOperationPathCombiner } from '../../../../../../app/core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../../../../app/core/json-patch/builder/json-patch-operations-builder';
import { hasValue } from '../../../../../../app/shared/empty.util';
import { SectionModelComponent } from '../../../../../../app/submission/sections/models/section.model';
import { SectionDataObject } from '../../../../../../app/submission/sections/models/section-data.model';
import { SectionsService } from '../../../../../../app/submission/sections/sections.service';
import { SubmissionService } from '../../../../../../app/submission/submission.service';

/**
* Accessibility acknowledgment section.
*
* Requires users to acknowledge the accessibility policy before proceeding.
* The acknowledgment is session-only - not saved to item metadata.
*
* Validation is enforced through getSectionStatus() which DSpace calls
* to determine if the user can proceed to the next step.
*/
@Component({
  selector: 'ds-submission-section-accessibility',
  styleUrls: ['./section-accessibility.component.scss'],
  templateUrl: './section-accessibility.component.html',
})
export class SubmissionSectionAccessibilityComponent extends SectionModelComponent implements AfterViewChecked {

  public granted = false;
  public isDisabled = false;
  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected subs: Subscription[] = [];

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected sectionService: SectionsService,
    protected submissionService: SubmissionService,
    protected translateService: TranslateService,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string,
  ) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  onSectionInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);

    // Always start unchecked - user must acknowledge during this session
    this.granted = false;

    console.log('=== Accessibility Section Initialized ===');
    console.log('Granted:', this.granted);
    console.log('User must check box to proceed');

    this.subs.push(
      this.sectionService.isSectionReadOnly(
        this.submissionId,
        this.sectionData.id,
        this.submissionService.getSubmissionScope(),
      ).pipe(
        take(1),
        filter((isReadOnly: boolean) => isReadOnly),
      ).subscribe(() => {
        this.isDisabled = true;
        console.log('Section is read-only');
      }),
    );
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * CRITICAL METHOD: DSpace calls this to check if the section is valid.
   *
   * @returns Observable<boolean>
   *   - true = section is valid, user CAN proceed to next step
   *   - false = section is invalid, user CANNOT proceed
   *
   * This is called when:
   * - User tries to navigate to next step
   * - DSpace checks overall submission validity
   * - Section status needs to be evaluated
   */
  protected getSectionStatus(): Observable<boolean> {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║ getSectionStatus() CALLED BY DSPACE               ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log('║ Current granted value:', this.granted.toString().padEnd(26), '║');
    console.log('║ Section is:', (this.granted ? 'VALID ✓' : 'INVALID ✗').padEnd(35), '║');
    console.log('║ User can proceed:', (this.granted ? 'YES ✓' : 'NO ✗').padEnd(32), '║');
    console.log('╚════════════════════════════════════════════════════╝');

    // Return granted status
    // If false, DSpace will block user from proceeding
    return observableOf(this.granted);
  }

  public onGrantedChange(event: any): void {
    const granted = event.target.checked;

    console.log('═══════════════════════════════════════');
    console.log('Checkbox Changed');
    console.log('───────────────────────────────────────');
    console.log('New value:', granted);
    console.log('═══════════════════════════════════════');

    // Update local state FIRST
    this.granted = granted;

    // Build PATCH path
    const path = this.pathCombiner.getPath('granted');

    console.log('Sending PATCH:', path, '=', granted);

    // Send PATCH to backend (for audit logging)
    if (granted) {
      this.operationsBuilder.add(path, granted.toString(), false, true);
    } else {
      this.operationsBuilder.remove(path);
    }

    console.log('Dispatching save for section:', this.sectionData.id);

    // Dispatch save
    this.submissionService.dispatchSaveSection(this.submissionId, this.sectionData.id);

    // CRITICAL: Force section status update in the sections service
    // This tells DSpace that the section validity has changed
    this.sectionService.setSectionStatus(
      this.submissionId,
      this.sectionData.id,
      this.granted,  // Pass the current granted status
    );

    console.log('Section status forcefully updated in sections service');
    console.log('Granted:', granted);
    console.log('User can now proceed:', granted ? 'YES' : 'NO');
    console.log('═══════════════════════════════════════');
  }

  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
