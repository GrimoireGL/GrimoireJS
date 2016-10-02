import GomlNode from "../Node/GomlNode";
interface IGomlInterfaceBase {
  getNodeById(id: string): GomlNode[];
}

export default IGomlInterfaceBase;
