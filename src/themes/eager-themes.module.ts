import { NgModule } from '@angular/core';

import { EagerThemeModule as CalabashEagerThemeModule } from './calabash/eager-theme.module';
import { EagerThemeModule as DSpaceEagerThemeModule } from './dspace/eager-theme.module';
// import { EagerThemeModule as CustomEagerThemeModule } from './custom/eager-theme.module';
import { EagerThemeModule as FDAEagerThemeModule } from './fda/eager-theme.module';
import { EagerThemeModule as GallatinSyllabiEagerThemeModule } from './gallatin-syllabi/eager-theme.module';
import { EagerThemeModule as CalabashEagerThemeModule } from './calabash/eager-theme.module';

/**
 * This module bundles the eager theme modules for all available themes.
 * Eager modules contain components that are present on every page (to speed up initial loading)
 * and entry components (to ensure their decorators get picked up).
 *
 * Themes that aren't in use should not be imported here so they don't take up unnecessary space in the main bundle.
 */
@NgModule({
  imports: [
    DSpaceEagerThemeModule,
    FDAEagerThemeModule,
    CalabashEagerThemeModule,
    GallatinSyllabiEagerThemeModule ],
})
export class EagerThemesModule { }
