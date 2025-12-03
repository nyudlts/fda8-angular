import {
  AsyncPipe,
  CommonModule,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { Item } from '../../../../../../../app/core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../app/core/shared/operators';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { CollectionsComponent } from '../../../../../../../app/item-page/field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../../../../../app/item-page/mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageCcLicenseFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { ItemPageDateFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';
import { UntypedItemComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { ThemedMetadataRepresentationListComponent } from '../../../../../../../app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../../../../app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import {
  CollectionConfig,
  DEFAULT_CONFIG,
  FieldConfig,
  getConfigForCollection,
} from '../../../field-config/item-field-config';

/**
* Component that represents an untyped Item page
*/
@listableObjectComponent(Item, ViewMode.StandalonePage, undefined,'fda')
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl:'./untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    RouterModule,
    ThemedResultsBackButtonComponent,
    MiradorViewerComponent,
    ThemedItemPageTitleFieldComponent,
    DsoEditMenuComponent,
    MetadataFieldWrapperComponent,
    ThemedThumbnailComponent,
    ThemedMediaViewerComponent,
    ThemedFileSectionComponent,
    ItemPageDateFieldComponent,
    ThemedMetadataRepresentationListComponent,
    GenericItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageUriFieldComponent,
    CollectionsComponent,
    RouterLink,
    AsyncPipe,
    TranslateModule,
    ItemPageCcLicenseFieldComponent,
  ],
})
export class UntypedItemComponent extends BaseComponent implements OnInit {

  collectionConfig: CollectionConfig = DEFAULT_CONFIG;
  collectionHandle = '';

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCollectionConfig();
  }

  private loadCollectionConfig(): void {
    if (this.object?.owningCollection) {
      this.object.owningCollection.pipe(
        getFirstSucceededRemoteDataPayload(),
        filter(collection => !!collection),
      ).subscribe(collection => {
        if (collection?.handle) {
        // Extract handle from URL (e.g., "http://localhost:4000/handle/2451/48010" → "2451/48010")
          this.collectionHandle = this.extractHandle(collection.handle);
          this.collectionConfig = getConfigForCollection(this.collectionHandle);

          console.log('Extracted handle:', this.collectionHandle);
          console.log('Config loaded:', this.collectionConfig.i18nPrefix);

        //this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Get metadata values for a field config
   */
  getFieldValues(fieldConfig: FieldConfig): string[] {
    const fields = fieldConfig.field.split(',');
    return this.object.allMetadataValues(fields);
  }

  /**
   * Get first metadata value for a field config
   */
  getFirstFieldValue(fieldConfig: FieldConfig): string {
    const fields = fieldConfig.field.split(',');
    return this.object.firstMetadataValue(fields);
  }

  /**
   * Check if field has values
   */
  hasFieldValue(fieldConfig: FieldConfig): boolean {
    return this.getFieldValues(fieldConfig).length > 0;
  }

  /**
 * Get i18n key with collection prefix fallback
 * First tries collection-specific key, then falls back to default
 */
  getI18nKey(baseKey: string): string {
    if (this.collectionConfig.i18nPrefix) {
    // Return prefixed key - Angular translate pipe will handle fallback
      return `${this.collectionConfig.i18nPrefix}.${baseKey}`;
    }
    return baseKey;
  }

  /**
 * Extract handle from URL or return as-is if already in correct format
 * "http://localhost:4000/handle/2451/48010" → "2451/48010"
 */
  private extractHandle(handleOrUrl: string): string {
    if (!handleOrUrl) {
      return '';
    }

    // If it's a URL containing "/handle/", extract the last two segments
    if (handleOrUrl.includes('/handle/')) {
      const parts = handleOrUrl.split('/handle/');
      return parts[parts.length - 1];  // Returns "2451/48010"
    }

    // If it contains "://", it's a URL - get last two path segments
    if (handleOrUrl.includes('://')) {
      const parts = handleOrUrl.split('/');
      if (parts.length >= 2) {
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      }
    }

    // Already in correct format
    return handleOrUrl;
  }
}
