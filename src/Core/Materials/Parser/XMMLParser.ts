import DefaultValuePreProcessor from "../../Pass/DefaultValuePreProcessor";
import IProgramDescription from "../../ProgramTransformer/Base/IProgramDescription";
import Program from "../../Resources/Program/Program";
import ResourceManager from "../../ResourceManager";
import ProgramTranspiler from "../../ProgramTransformer/ProgramTranspiler";
import XMLRenderConfigUtility from "../../Pass/XMLRenderConfigUtility";
import IXMMLPassDescription from "./IXMMLPassDescription";
import RegistererBase from "../../Pass/Registerer/RegistererBase";
import ContextComponents from "../../../ContextComponents";
import MaterialManager from "../MaterialManager";
import Context from "../../../Context";
import IXMMLDescription from "./IXMMLDescription";
import BasicCacheResolver from "../../Resources/BasicCacheResolver";
import XMLReader from "../../../Base/XMLReader";
/**
 * The static class to parse XMML.
 */
class XMMLParser {

    private static _resolver: BasicCacheResolver<IXMMLDescription> = new BasicCacheResolver<IXMMLDescription>();

    /**
     * Parse the xmml document.
     * @return {IXMMLDescription} [description]
     */
    public static parse(name: string, source: string): Promise<IXMMLDescription> {
        return new Promise<IXMMLDescription>((resolve, reject) => {
            XMMLParser._resolver.fetch(name, (identity => {
                return XMMLParser._parseXMML(name, source);
            })).then((result) => {
                resolve(result);
            });
        });
    }

    private static _parseXMML(name: string, source: string): Promise<IXMMLDescription> {
        return new Promise<IXMMLDescription>((resolve, reject) => {
            const dom = XMLReader.parseXML(source);
            const result: IXMMLDescription = <IXMMLDescription>{
                name: name
            };
            // Parse material element
            const materialElem = XMLReader.getSingleElement(dom, "material");
            result.group = XMLReader.getAttribute(materialElem, "group", true);
            result.order = XMLReader.getAttributeFloat(materialElem, "order");
            // Parse registers
            const registersElem = XMLReader.getSingleElement(materialElem, "registers");
            result.registerers = XMMLParser._initializeUniformRegisters(registersElem);
            // Parse passes
            const passesElem = XMLReader.getSingleElement(materialElem, "passes");
            XMMLParser._instanciatePasses(passesElem, name, result.registerers).then(p => {
                result.pass = p;
                resolve(result);
            });
        });
    }

    private static _initializeUniformRegisters(elem: Element): RegistererBase[] {
        const mm = Context.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        const registerElems = XMLReader.getElements(elem, "register");
        return registerElems.map(r => new (mm.getUniformRegister(r.getAttribute("name")))());
    }

    private static _instanciatePasses(passes: Element, materialName: string, registerers: RegistererBase[]): Promise<IXMMLPassDescription[]> {
        const pass = XMLReader.getElements(passes, "pass");
        return Promise.all<IXMMLPassDescription>(pass.map((p, i) => {
            return new Promise<IXMMLPassDescription>((resolve, reject) => {
                const renderconfig = XMLRenderConfigUtility.parseRenderConfig(p);
                const glsl = XMLReader.getSingleElement(p, "glsl");
                const result: IXMMLPassDescription = <IXMMLPassDescription>{
                    renderConfig: renderconfig,
                    passIndex: i
                };
                ProgramTranspiler.parseCombined(glsl.textContent).then((desc) => {
                    result.programDescription = desc;
                    result.program = XMMLParser._constructProgram(materialName, i, desc);
                    return DefaultValuePreProcessor.preprocess(desc.uniforms);
                }).then(() => {
                    return Promise.all(registerers.map(r => r.preprocess(result, result.programDescription.uniforms)));
                }).then(() => {
                    resolve(result);
                });
            });
        }));
    }

    private static _constructProgram(name: string, index: number, desc: IProgramDescription): Program {
        const idPrefix = name + index;
        const rm = Context.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        const fs = rm.createShader(idPrefix + "-fs", desc.fragment, WebGLRenderingContext.FRAGMENT_SHADER);
        const vs = rm.createShader(idPrefix + "-vs", desc.vertex, WebGLRenderingContext.VERTEX_SHADER);
        fs.loadAll();
        vs.loadAll();
        return rm.createProgram(idPrefix + "-program", vs, fs);
    }
}
export default XMMLParser;
