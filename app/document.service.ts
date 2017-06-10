import { Injectable } from '@angular/core';

function document(): any {
    return window.document;
}

@Injectable()
export class DocumentService {
    get nativeDocument(): any {
        return document();
    }
}