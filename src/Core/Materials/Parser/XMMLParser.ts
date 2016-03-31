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
import JThreeContext from "../../../JThreeContext";
import IXMMLDescription from "./IXMMLDescription";
import BasicCacheResolver from "../../Resources/BasicCacheResolver";
/**
 * The static class to parse XMML.
 */
class XMMLParser {

  private static _resolver: BasicCacheResolver<IXMMLDescription> = new BasicCacheResolver<IXMMLDescription>();

  private static _domParser: DOMParser = new DOMParser();
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
      const dom = XMMLParser._domParser.parseFromString(source, "text/xml");
      const result: IXMMLDescription = <IXMMLDescription>{
        name: name
      };
      // Parse material element
      const materialElem = XMMLParser._getSingleElement("material", dom);
      result.group = materialElem.getAttribute("group");
      result.order = parseFloat(materialElem.getAttribute("order"));
      // Parse registers
      const registersElem = XMMLParser._getSingleElement("registers", materialElem);
      result.registerers = XMMLParser._initializeUniformRegisters(registersElem);
      // Parse passes
      const passesElem = XMMLParser._getSingleElement("passes", materialElem);
      XMMLParser._instanciatePasses(passesElem, name, result.registerers).then(p => {
        result.pass = p;
        resolve(result);
      });
    });
  }

  private static _initializeUniformRegisters(elem: Element): RegistererBase[] {
    const mm = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    const registerElems = XMMLParser._getElements("register", elem);
    return registerElems.map(r => new (mm.getUniformRegister(r.getAttribute("name")))());
  }

  private static _instanciatePasses(passes: Element, materialName: string, registerers: RegistererBase[]): Promise<IXMMLPassDescription[]> {
    const pass = XMMLParser._getElements("pass", passes);
    return Promise.all(pass.map((p, i) => {
      return new Promise<IXMMLPassDescription>((resolve, reject) => {
        const renderconfig = XMLRenderConfigUtility.parseRenderConfig(p);
        const glsl = XMMLParser._getSingleElement("glsl", p);
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
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const fs = rm.createShader(idPrefix + "-fs", desc.fragment, WebGLRenderingContext.FRAGMENT_SHADER);
    const vs = rm.createShader(idPrefix + "-vs", desc.vertex, WebGLRenderingContext.VERTEX_SHADER);
    fs.loadAll();
    vs.loadAll();
    return rm.createProgram(idPrefix + "-program", [vs, fs]);
  }

  private static _getElements(name: string, elem: Element|Document): Element[] {
    const result: Element[] = [];
    const elems = elem.getElementsByTagName(name);
    for (let i = 0; i < elems.length; i++) {
      result.push(elems.item(i));
    }
    return result;
  }

  private static _getSingleElement(name: string, elem: Element|Document): Element {
    const result = XMMLParser._getElements(name, elem);
    if (result.length === 1) {
      return result[0];
    } else if (result.length === 0) {
      throw new Error(`The mandatory element ${name} was required, but not found`);
    } else {
      throw new Error(`The element ${name} requires to exist in single. But there is ${result.length} count of elements`);
    }
  }
}
export default XMMLParser;
