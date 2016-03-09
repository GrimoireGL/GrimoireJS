import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
    get TextureBuffers() {
        return [];
    }
    getStageChain(target) {
        return [
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "default"
                },
                stage: "jthree.basic.foward"
            }];
    }
}
export default BasicRendererConfigurator;
