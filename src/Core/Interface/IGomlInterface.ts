import IGomlInterfaceBase from "./IGomlInterfaceBase";
interface IGomlInterface extends IGomlInterfaceBase {
    (query: string): any; // TODO return value should not be any
}

export default IGomlInterface;
