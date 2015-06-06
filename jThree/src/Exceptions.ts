import JThreeObject = require("./Base/JThreeObject");
import Matrix = require("./Math/Matrix");

     /**
     * This class is root class perform as exception arguments in jThree.
     */
    export class jThreeException extends JThreeObject implements Error {
        constructor(name: string, message: string) {
            super();
            this.name = name;
            this.message = message;
        }

        name: string;
        message: string;

        toString(): string {
            return `Exception:${super.toString()}\nName:${this.name}\nMessage:${this.message}`;
        }
    }

    export class IrregularElementAccessException extends jThreeException {
        constructor(accessIndex:number) {
            super("Irregular vector element was accessed.", `You attempted to access ${accessIndex} element. But,this vector have enough dimension.`);
         }
    }

    export class InvalidArgumentException extends jThreeException {
        constructor(message: string) {
            super("Invalid argument was passed.", message);
        }
    }

    export class SingularMatrixException extends jThreeException {
        constructor(m: Matrix) {
            super("Passed matrix is singular matrix", `passed matrix:${m.toString()}`);
        }
    }

    export class AbstractClassMethodCalledException extends jThreeException {
        constructor() {
            super("Invalid method was called.","This method is abstract method, cant call by this instance");
        }
    }

    export class WebGLErrorException extends jThreeException {
        constructor(text:string) {
            super("WebGL reported error.", text);
        }
    }
