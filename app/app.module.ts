import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

import {BaseComponent} from './base.component';
import {DocumentService} from './document.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [DocumentService],
    declarations: [BaseComponent],
    bootstrap: [BaseComponent]
})
export class AppModule {}