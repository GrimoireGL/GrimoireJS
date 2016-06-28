import JThreeObject from "./Base/JThreeObject";
import Matrix from "./Math/Matrix";

/**
* This class is root class perform as exception arguments in jThree.
*/
export class JThreeException extends JThreeObject implements Error {

    public name: string;
    public message: string;

    constructor(name: string, message: string) {
        super();
        this.name = name;
        this.message = message;
    }

    public toString(): string {
        return `Exception:${super.toString()}\nName:${this.name}\nMessage:${this.message}`;
    }
}

export class InvalidArgumentException extends JThreeException {
    constructor(message: string) {
        super("Invalid argument was passed.", message);
    }
}

export class InvalidStringException extends JThreeException {
    constructor(message: string) {
        super("Invalid string was passed.", message);
    }
}

export class SingularMatrixException extends JThreeException {
    constructor(m: Matrix) {
        super("Passed matrix is singular matrix", `passed matrix:${m.toString()}`);
    }
}

export class AbstractClassMethodCalledException extends JThreeException {
    constructor() {
        super("Invalid method was called.", "This method is abstract method, cant call by this instance");
    }
}

export class WebGLNotSupportedException extends JThreeException {
    constructor() {
        super("WebGL is not supported", "This browser is not supporting WebGL. Context generation for WebGL was failed.");
    }
}
