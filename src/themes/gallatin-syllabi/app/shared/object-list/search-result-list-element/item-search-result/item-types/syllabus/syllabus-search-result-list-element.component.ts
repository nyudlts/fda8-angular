import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewMode } from '../../../../../../../../../app/core/shared/view-mode.model';

import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';

import { ItemSearchResultListElementComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';

@listableObjectComponent('SyllabusSearchResult', ViewMode.ListElement)

@Component({
  selector: 'ds-syllabus-search-result-list-element',
  styleUrls: ['./syllabus-search-result-list-element.component.scss'],
  templateUrl: './syllabus-search-result-list-element.component.html',
  standalone: true,
})
/**
 * The component for displaying a list element for an item search result of the type Syllabus
 */
export class SyllabusSearchResultListElementComponent extends ItemSearchResultListElementComponent {
}

