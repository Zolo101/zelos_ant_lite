import * as twgl from "twgl.js";
import "webgl-lint";
import Game from "../../game";
import vertexShader from "./vertex.glsl?raw";
import fragmentShader from "./fragment.glsl?raw";

export default class Renderer {
    gl: WebGL2RenderingContext
    programInfo: twgl.ProgramInfo
    objects: any[]
    tileTexture: WebGLTexture
    colours: WebGLTexture
    tiles: Uint8ClampedArray
    bufferInfo: twgl.BufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl
        const program = twgl.createProgram(gl, [vertexShader, fragmentShader])
        this.programInfo = twgl.createProgramInfoFromProgram(gl, program)
        this.objects = [];
        this.tiles = new Uint8ClampedArray(Game.width * Game.height)
        this.bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

        this.tileTexture = twgl.createTexture(gl, {
            mag: gl.NEAREST,
            min: gl.NEAREST,
            internalFormat: gl.R8,
            src: this.tiles,
        })

        this.colours = twgl.createTexture(gl, {
            mag: gl.NEAREST,
            min: gl.NEAREST,
            format: gl.RGBA,
            // TODO: Set limit for colours (1024)
            // src: new Uint8ClampedArray(3 * 1024), // support 1024 colours
            src: this.createColourTexture(), // support 256 colours
            // width: 1024,
            width: 256,
            height: 1,
        })

        window.addEventListener("updateTileEvent", this.updateColours)
        requestAnimationFrame(() => this.render())
        console.log("WebGL2 renderer initialised")
    }

    updateColours() {
        // let texture = new Uint8ClampedArray(3 * 1024)
        let texture = this.createColourTexture()
        texture.set(Game.colours.flat(), 0)
        // twgl.setTextureFromArray(this.gl, this.colours, texture, {format: this.gl.RGB, width: 1024, height: 1})
        twgl.setTextureFromArray(this.gl, this.colours, texture, {format: this.gl.RGBA, width: 256, height: 1})
    }

    createColourTexture() {
        // return new Uint8ClampedArray(3 * Game.width * Game.height)
        // return new Uint8ClampedArray(3 * 1024) // support 1024 colours
        return new Uint8ClampedArray(4 * 256) // support 256 colours
    }

    render() {
        const [matrix, textureMatrix] = [twgl.m4.identity(), twgl.m4.identity()]

        twgl.setTextureFromArray(this.gl, this.tileTexture, this.tiles, {internalFormat: this.gl.R8})
        const uniforms = {
            matrix,
            textureMatrix,
            tiles: this.tileTexture,
            colours: this.colours,
        }

        // these convert from pixels to clip space
        twgl.m4.ortho(0, Game.width, Game.height, 0, -1, 1, matrix)

        // these move and scale the unit quad into the size we want
        // in the target as pixels
        twgl.m4.translate(matrix, [0, 0, 0], matrix);
        twgl.m4.scale(matrix, [Game.width, Game.height, 1], matrix);

        this.gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
    }

}