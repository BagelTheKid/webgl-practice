///<reference path="../../node_modules/@types/webgl2/index.d.ts" />

import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DocumentService} from '../document.service';

@Component({
    moduleId: module.id,
    templateUrl: 'translation.component.html'
})
export class TranslationComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private document: any;
    private squareVerticiesBuffer: WebGLBuffer;
    shaderProgram: WebGLProgram;
    positionAttribute: number;
    resolutionLocation: WebGLUniformLocation;
    translationLocation: WebGLUniformLocation;
    colorLocation: WebGLUniformLocation;
    positionBuffer: WebGLBuffer;
    translation: [number, number];
    width: number;
    height: number;
    color: [number, number, number, number];
    xRange = 0;
    yRange = 0;
    fDrawn = false;
    @ViewChild('glcanvas') glCanvas: ElementRef;

    constructor(private documentService: DocumentService) {}

    ngAfterViewInit() {
        this.canvas = this.glCanvas.nativeElement;
        this.document = this.documentService.nativeDocument;
        this.gl = this.initWebGL();
        this.initRect();
    }

    private initWebGL(): any {
        let gl = null;
        gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!gl) {
            alert('WebGL might not be supported! Oh no!!');
        }

        return gl;
    }

    private initShaders(): void {
        let fragmentShader: WebGLShader = this.getShader(this.gl, '2d-fragment-shader');
        let vertexShader: WebGLShader = undefined;
        if (!this.fDrawn) {
            vertexShader = this.getShader(this.gl, '2d-vertex-shader');
        } else {
            vertexShader = this.getShader(this.gl, '2d-vertex-shader-t');
        }

        // Create the shaders
        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.shaderProgram);

        // If failed to create shader program, alert us
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            alert(`Unable to initialize shader program: ${this.gl.getProgramInfoLog(this.shaderProgram)}`);
        }
    }

    private getShader(gl: any, id: string, type: number = null): any {
        let shaderScript;
        let source;
        let currentChild;
        let shader: WebGLShader;

        shaderScript = this.document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        source = shaderScript.text;

        if (!type) {
            if (shaderScript.type === 'x-shader/x-fragment') {
                type = this.gl.FRAGMENT_SHADER;
            } else if (shaderScript.type === 'x-shader/x-vertex') {
                type = this.gl.VERTEX_SHADER;
            } else {
                // unknown shader type
                return null;
            }
        }

        shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);

        // compile the shader
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log(`An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private initRect(): void {
        this.initShaders();
        this.positionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');
        this.colorLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_color');
        if (this.fDrawn) {
            this.translationLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_translation');
        }

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        if (this.fDrawn) {
            this.setGeometry();
        }

        this.translation = [0, 0];
        this.width = 100;
        this.height = 30;
        this.color = [Math.random(), Math.random(), Math.random(), 1];

        this.draw();
    }

    private draw(): void {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.shaderProgram);
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        if (!this.fDrawn) {
            this.setRectangle();
        }

        let size = 2;
        let type: number = this.gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        this.gl.vertexAttribPointer(this.positionAttribute, size, type, normalize, stride, offset);
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform4fv(this.colorLocation, this.color);
        if (this.fDrawn) {
            this.gl.uniform2fv(this.translationLocation, this.translation);
        }

        let primitiveType: number = this.gl.TRIANGLES;
        if (!this.fDrawn) {
            this.gl.drawArrays(primitiveType, 0, 6);
        } else {
            this.gl.drawArrays(primitiveType, 0, 18);
        }
    }

    private setRectangle(): void {
        let x1 = this.translation[0];
        let x2 = this.translation[0] + this.width;
        let y1 = this.translation[1];
        let y2 = this.translation[1] + this.height;
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2
            ]),
            this.gl.STATIC_DRAW
        );
    }

    private setGeometry(): void {
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0,
                30, 0,
                0, 150,
                0, 150,
                30, 0,
                30, 150,

                // top rung
                30, 0,
                100, 0,
                30, 30,
                30, 30,
                100, 0,
                100, 30,

                // middle rung
                30, 60,
                67, 60,
                30, 90,
                30, 90,
                67, 60,
                67, 90,
            ]),
            this.gl.STATIC_DRAW);
    }

    setGeometryF(): void {
        this.fDrawn = true;
        this.xRange = 0;
        this.yRange = 0;
        this.translation = [0, 0];
        this.gl.deleteProgram(this.shaderProgram);
        this.initShaders();
        this.initRect();
    }

    updateXDraw(): void {
        this.translation[0] = this.xRange;
        this.draw();
    }

    updateYDraw(): void {
        this.translation[1] = this.yRange;
        this.draw();
    }
}
