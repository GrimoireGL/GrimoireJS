import JThreeObject=require('Base/JThreeObject');
import LinearBase = require("./LinearBase");
import ILinearObjectFactory = require("./ILinearObjectFactory");
interface ILinearObjectGenerator<T extends LinearBase> {
    getFactory(): ILinearObjectFactory<T>;
}
export=ILinearObjectGenerator;
