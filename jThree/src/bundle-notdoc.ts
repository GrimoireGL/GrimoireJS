interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value: V): Map<K, V>;
    size: number;
}
declare var Map: {
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
}
interface Set<T> {
    add(value: T): Set<T>;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, index: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    size: number;
}
declare var Set: {
    new <T>(): Set<T>;
    prototype: Set<any>;
}

interface WebGLRenderingContext
{
    texImage2D(target:number,level:number,internalFormat:number,width:number,height:number,border:number,format:number,type:number,pixels?:ArrayBufferView)
}

declare var jDataView:{
    new (buffer: string): jDataView;
}

interface jDataView
{
    getString(offset:number,length: Number);
    getInt8(offset:number,littleEndian:boolean);
    getUInt8(offset:number,littleEndian:boolean);
    getInt16(offset:number,);
    getUInt16(offset:number,littleEndian:boolean);
    getInt32(offset:number,littleEndian:boolean);
    getUInt32(offset:number,littleEndian:boolean);
    getUInt32(offset:number,littleEndian:boolean);
    getFloat(offset:number,littleEndian:boolean);
    getDouble(offset:number,littleEndian:boolean);
}