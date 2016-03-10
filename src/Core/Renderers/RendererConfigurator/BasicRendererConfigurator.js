import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
    get TextureBuffers() {
        return [
            {
                name: "depth",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "gbuffer.primary",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "light.diffuse",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "light.specular",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "hitarea",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "main",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "output",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            }
        ];
    }
    getStageChain(target) {
        return [
            {
                buffers: {
                    OUT: "hitarea"
                },
                stage: "jthree.hitarea"
            },
            {
                buffers: {
                    DEPTH: "depth",
                    PRIMARY: "gbuffer.primary"
                },
                stage: "jthree.basic.gbuffer"
            },
            {
                buffers: {
                    DEPTH: "depth",
                    PRIMARY: "gbuffer.primary",
                    DIFFUSE: "light.diffuse",
                    SPECULAR: "light.specular"
                },
                stage: "jthree.basic.light"
            },
            {
                buffers: {
                    GBUFFER: "gbuffer.primary",
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "output"
                },
                stage: "jthree.basic.foward"
            },
            {
                buffers: {
                    INPUT: "output",
                    OUT: "default"
                },
                stage: "jthree.basic.fxaa",
                variables: {
                    reduceMin: 0.05,
                    reduceMul: 0.1,
                    spanMax: 3
                }
            }];
    }
}
export default BasicRendererConfigurator;
//# sourceMappingURL=BasicRendererConfigurator.js.map