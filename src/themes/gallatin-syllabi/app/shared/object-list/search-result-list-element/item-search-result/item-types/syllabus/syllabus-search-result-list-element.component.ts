import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item } from '../../../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../../../app/core/shared/view-mode.model';

import { getItemPageRoute } from '../../../../../../../../../app/item-page/item-page-routing-paths';
import { ThemedThumbnailComponent } from '../../../../../../../../../app/thumbnail/themed-thumbnail.component';
import { ThemedBadgesComponent } from '../../../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemSearchResult } from '../../../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';

import { TruncatableComponent } from '../../../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

import { ItemSearchResultListElementComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { SearchResultListElementComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component';

@listableObjectComponent('SyllabusSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)

@Component({
  selector: 'ds-syllabus-search-result-list-element',
  styleUrls: ['./syllabus-search-result-list-element.component.scss'],
  templateUrl: './syllabus-search-result-list-element.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, ThemedThumbnailComponent, NgClass, ThemedBadgesComponent, TruncatableComponent, TruncatablePartComponent, NgFor, AsyncPipe],
})
/**
 * The component for displaying a list element for an item search result of the type Syllabus
 */

export class SyllabusSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;
  //console.log('Themed SyllabusSearchResultListElementComponent.ngOnInit ' + Item.id);
  ngOnInit(): void {
    //console.log('Themed SyllabusSearchResultListElementComponent.ngOnInit ' + this.dso?.id);
    super.ngOnInit();
    this.showThumbnails = false;
    this.itemPageRoute = getItemPageRoute(this.dso);
    console.log('Themed SyllabusSearchResultListElementComponent.ngOnInit itemPageRoute' + this.itemPageRoute);

  }
}
