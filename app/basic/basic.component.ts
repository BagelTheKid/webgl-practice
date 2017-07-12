///<reference path="../../node_modules/@types/webgl2/index.d.ts" />

import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DocumentService} from '../document.service';

@Component({
    moduleId: module.id,
    templateUrl: 'basic.component.html'
})
export class BasicComponent implements AfterViewInit {
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

    private initShaders(): void {
        let fragmentShader: WebGLShader = this.getShader(this.gl, 'shader-fs');
        let vertexShader: WebGLShader = this.getShader(this.gl, 'shader-vs');

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

    private initBuffers(): void {
        this.squareVerticiesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticiesBuffer);

        let verticies = [
            10, 20,
            80, 20,
            10, 30,
            10, 30,
            80, 20,
            80, 30
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verticies), this.gl.STATIC_DRAW);
    }

    generateMoreWebgl(): void {
        this.initShaders();
        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'uResolution');
        this.initBuffers();

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.shaderProgram);
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticiesBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform2f(this.resolutionUniformLocation, this.canvas.width, this.canvas.height);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
