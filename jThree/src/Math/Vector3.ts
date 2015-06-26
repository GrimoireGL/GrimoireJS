import JThreeObject=require('Base/JThreeObject');
import VectorEnumeratorBase = require("./VectorEnumeratorBase");
import Exceptions = require("../Exceptions");
import VectorBase = require("./VectorBase");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import ILinearObjectFactory = require("./ILinearObjectFactory");
import IEnumrator = require("../Base/Collections/IEnumrator");
import glm=require('glm');
class Vector3Factory implements ILinearObjectFactory<Vector3> {
    static instance: Vector3Factory;

    static getInstance(): Vector3Factory {
        this.instance = this.instance || new Vector3Factory();
        return this.instance;
    }

    fromArray(array: Float32Array): Vector3 {
        return new Vector3(array[0], array[1], array[2]);
    }
}

class Vector3Enumerator extends VectorEnumeratorBase<Vector3>{

    constructor(vec: Vector3) {
        super(vec);
    }

    getCurrent(): number {
        switch (this.currentIndex) {
            case 0:
                return this.vector.X;
            case 1:
                return this.vector.Y;
            case 2:
                return this.vector.Z;
            default:
                throw new Exceptions.IrregularElementAccessException(this.currentIndex);
        }
    }
}
class Vector3 extends VectorBase implements ILinearObjectGenerator<Vector3> {
    public static get XUnit(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    public static get YUnit(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    public static get ZUnit(): Vector3 {
        return new Vector3(0, 0, 1);
    }

    public static get Zero():Vector3
    {
      return new Vector3(0,0,0);
    }

    constructor(x: number|glm.GLM.IArray, y?: number, z?: number) {
        super();
        if(typeof y ==='undefined')
        {
            this.targetVector=<glm.GLM.IArray>x;
            return;
        }
        this.targetVector=[<number>x,y,z];
    }

    public targetVector:glm.GLM.IArray;

    get X(): number {
        return this.targetVector[0];
    }

    get Y(): number {
        return this.targetVector[1];
    }

    get Z(): number {
        return this.targetVector[2];
    }

    static dot(v1: Vector3, v2: Vector3): number {
        return glm.vec2.dot(v1.targetVector,v2.targetVector);
    }

    static add(v1: Vector3, v2: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        return new Vector3(glm.vec3.add(newVec,v1.targetVector,v2.targetVector));
    }

    static subtract(v1: Vector3, v2: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        return new Vector3(glm.vec3.sub(newVec,v1.targetVector,v2.targetVector));
    }

    static multiply(s: number, v: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        return new Vector3(glm.vec3.scale(newVec,v.targetVector,s));
    }

    static negate(v1: Vector3): Vector3 {
        return Vector3.multiply(-1,v1);
    }

    static equal(v1: Vector3, v2: Vector3): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    static normalize(v1: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        return new Vector3(glm.vec3.normalize(newVec,v1.targetVector));
    }

    static cross(v1: Vector3, v2: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        return new Vector3(glm.vec3.cross(newVec,v1.targetVector,v2.targetVector));
    }

    normalizeThis(): Vector3 {
        return Vector3.normalize(this);
    }

    dotWith(v: Vector3): number {
        return Vector3.dot(this, v);
    }

    addWith(v: Vector3): Vector3 {
        return Vector3.add(this, v);
    }

    subtractWith(v: Vector3): Vector3 {
        return Vector3.subtract(this,v);
    }

    multiplyWith(s: number): Vector3 {
        return Vector3.multiply(s, this);
    }

    negateThis(): Vector3 {
        return Vector3.negate(this);
    }

    equalWith(v: Vector3): boolean {
        return Vector3.equal(this, v);
    }

    crossWith(v: Vector3): Vector3 {
        return Vector3.cross(this, v);
    }

    toString(): string {
        return `Vector3(${this.X}, ${this.Y}, ${this.Z})`;
    }

    getEnumrator(): IEnumrator<number> {
        return new Vector3Enumerator(this);
    }

    get ElementCount(): number { return 3; }

    getFactory(): ILinearObjectFactory<Vector3> { return Vector3Factory.getInstance(); }

    static parse(str:string):Vector3
    {
      var resultVec:Vector3;
      //1,0,2.0,3.0
      //-(1.0,2.0,3.0)
      //n(1.0,2.0,3.0) normalized
      //1.0
      //check attributes
      var negativeMatch=str.match(/^-n?(\(.+\))$/);
      var needNegate=false;
      if(negativeMatch)
      {
        needNegate=true;
        str=negativeMatch[1];
      }
      var normalizeMatch=str.match(/^n(\(.+\))$/);
      var needNormalize=false;
      if(normalizeMatch)
      {
        needNormalize=true;
        str=normalizeMatch[1];
      }
      //check body
      str=str.match(/^n?\(?([^\)]+)\)?$/)[1];
      var strNums=str.split(/,/g);
      if(strNums.length==1)
      {
        var elemNum:number=parseFloat(strNums[0]);
        resultVec=new Vector3(elemNum,elemNum,elemNum);
      }else if(strNums.length==3)
      {
        resultVec=new Vector3(parseFloat(strNums[0]),parseFloat(strNums[1]),parseFloat(strNums[2]));
      }else{
        throw Error("passed argument was invalid");
      }
      if(needNormalize)resultVec=resultVec.normalizeThis();
      if(needNegate)resultVec=resultVec.negateThis();
      return resultVec;
     }
}

export=Vector3;
