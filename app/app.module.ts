import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

/* App Components */
import {BaseComponent} from './base/base.component';
import {BlankComponent} from './blank/blank.component';
import {BasicComponent} from './basic/basic.component';
import {RandomRectsComponent} from './random-rects/random-rects.component';
import {TranslationComponent} from './translation/translation.component';

/* App Services */
import {DocumentService} from './document.service';

/* App Routing */
import {AppRoutingModule} from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [DocumentService],
    declarations: [
        BaseComponent,
        BlankComponent,
        BasicComponent,
        RandomRectsComponent,
        TranslationComponent
    ],
    bootstrap: [BaseComponent]
})
export class AppModule {}
