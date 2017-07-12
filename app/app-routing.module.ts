import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router';

/* App Components */
import {BlankComponent} from './blank/blank.component';
import {BasicComponent} from './basic/basic.component';
import {RandomRectsComponent} from './random-rects/random-rects.component';
import {TranslationComponent} from './translation/translation.component';

/* Routes */
const routes: Routes = [
    {
        path: '',
        redirectTo: '/blank',
        pathMatch: 'full'
    }, {
        path: 'blank',
        component: BlankComponent
    }, {
        path: 'basic',
        component: BasicComponent
    }, {
        path: 'random-rects',
        component: RandomRectsComponent
    }, {
        path: 'translation',
        component: TranslationComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
