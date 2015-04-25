import LinearBase = require("./LinearBase");
interface ILinearObjectFactory<T extends LinearBase> {
    fromArray(array: Float32Array): T;
}

export=ILinearObjectFactory;
