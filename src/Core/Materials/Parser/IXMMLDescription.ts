import IXMMLPassDescription from "./IXMMLPassDescription";
import RegistererBase from "../../Pass/Registerer/RegistererBase";
interface IXMMLDescription {
  order: number;
  name: string;
  group: string;
  registerers: RegistererBase[];
  pass: IXMMLPassDescription[];
}
export default IXMMLDescription;
