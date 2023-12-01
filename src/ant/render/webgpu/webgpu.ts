import moduleCode from "./module.wgsl?raw";
import Game from "../../game";

export default class WebGPURenderer {
    static width = 400
    static height = 400
    context: GPUCanvasContext
    adapter: GPUAdapter
    device: GPUDevice

    tiles: Uint8ClampedArray
    screen: GPUTexture
    colours: GPUTexture // TODO: Does it have to be a texture?
    renderPassDescriptor: GPURenderPassDescriptor

    module: GPUShaderModule
    pipeline: GPURenderPipeline
    bindGroup: GPUBindGroup

    // vBuffer: GPUBuffer

    constructor(context: GPUCanvasContext, adapter: GPUAdapter, device: GPUDevice) {
        this.context = context
        this.adapter = adapter
        this.device = device
        this.tiles = new Uint8ClampedArray(WebGPURenderer.width * WebGPURenderer.height)
        this.screen = this.device.createTexture({
            label: "screen",
            size: [WebGPURenderer.width, WebGPURenderer.height],
            format: "r8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        })
        this.colours = this.device.createTexture({
            label: "colours",
            dimension: "1d",
            size: [256], // support 256 colours
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        })
        this.renderPassDescriptor = {
            // @ts-ignore
            colorAttachments: [{
                // view: <- to be filled out when we render
                // view: this.context.getCurrentTexture().createView(),
                clearValue: [1.0, 1.0, 1.0, 1.0],
                loadOp: "clear",
                storeOp: "store",
            }]
        }

        const format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({device: this.device, format})

        this.module = this.device.createShaderModule({
            code: moduleCode
        })

        this.pipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.module,
                entryPoint: "vertexMain"
            },
            fragment: {
                module: this.module,
                entryPoint: "fragmentMain",
                targets: [{format}]
            }
        })

        const sampler = this.device.createSampler();

        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sampler},
                {binding: 1, resource: this.screen.createView()},
                {binding: 2, resource: this.colours.createView()},
            ]
        });

        window.addEventListener("updateTileEvent", this.updateColours)
        requestAnimationFrame(() => this.render())
        console.log("WebGPU renderer initialised")
    }

    createColourTexture() {
        return new Uint8ClampedArray(4 * 256)
    }

    updateColours() {
        // clear array and re-add colours
        const coloursBuffer = this.createColourTexture()
        coloursBuffer.set(Game.colours.flat(), 0)

        this.device.queue.writeTexture(
            {texture: this.colours},
            coloursBuffer,
            {bytesPerRow: 4 * 256},
            [256]
        )
    }

    render() {
        //@ts-ignore
        this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

        this.device.queue.writeTexture(
            {texture: this.screen},
            this.tiles,
            {bytesPerRow: WebGPURenderer.width},
            [WebGPURenderer.width, WebGPURenderer.height]
        )

        const encoder = this.device.createCommandEncoder();
        const pass = encoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);

        pass.draw(3);
        pass.end();

        const commandBuffer = encoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
}