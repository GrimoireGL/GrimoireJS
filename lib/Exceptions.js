import JThreeObject from "./Base/JThreeObject";
/**
* This class is root class perform as exception arguments in jThree.
*/
export class JThreeException extends JThreeObject {
    constructor(name, message) {
        super();
        this.name = name;
        this.message = message;
    }
    toString() {
        return `Exception:${super.toString()}\nName:${this.name}\nMessage:${this.message}`;
    }
}
export class InvalidArgumentException extends JThreeException {
    constructor(message) {
        super("Invalid argument was passed.", message);
    }
}
export class InvalidStringException extends JThreeException {
    constructor(message) {
        super("Invalid string was passed.", message);
    }
}
export class SingularMatrixException extends JThreeException {
    constructor(m) {
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
