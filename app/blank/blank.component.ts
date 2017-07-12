///<reference path="../../node_modules/@types/webgl2/index.d.ts" />

import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DocumentService} from '../document.service';

@Component({
    moduleId: module.id,
    templateUrl: 'blank.component.html'
})
export class BlankComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private document: any;
    private squareVerticiesBuffer: WebGLBuffer;
    shaderProgram: WebGLProgram;
    vertexPositionAttribute: number;
    resolutionUniformLocation: WebGLUniformLocation;
    colorUniformLocation: WebGLUniformLocation;
    @ViewChild('glcanvas') glCanvas: ElementRef;

    constructor(private documentService: DocumentService) {}

    ngAfterViewInit() {
        this.canvas = this.glCanvas.nativeElement;
        this.document = this.documentService.nativeDocument;
        this.gl = this.initWebGL();
    }

    private initWebGL(): any {
        let gl = null;
        gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!gl) {
            alert('WebGL might not be supported! Oh no!!');
        }

        return gl;
    }

    generateWebgl(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}
