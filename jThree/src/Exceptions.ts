///<reference path="../_references.ts"/>
module jThree.Exceptions {
    import jThreeObject = Base.jThreeObject;
    /**
     * This class is root class perform as exception arguments in jThree.
     */
    export class jThreeException extends jThreeObject implements Error {
        constructor(name: string, message: string) {
            super();
            this.name = name;
            this.message = message;
        }

        name: string;
        message: string;

        toString(): string {
            return "Exception:{0}\nName:{1}\nMessage:{2}".format(super.toString(),this.name,this.message);
        }
    }

    export class IrregularElementAccessException extends jThreeException {
        constructor(accessIndex:number) {
            super("Irregular vector element was accessed.", "You attempted to access {0} element. But,this vector have enough dimension.".format(accessIndex));
        }
    }

    export class InvalidArgumentException extends jThreeException {
        constructor(message: string) {
            super("Invalid argument was passed.", message);
        }
    }

    export class SingularMatrixException extends jThreeException {
        constructor(m: jThree.Matrix.Matrix) {
            super("Passed matrix is singular matrix", "passed matrix:{0}".format(m.toString()));
        }
    }
 }
