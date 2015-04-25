/**
 * This interface indicate the class implementing this interface can be transformed into string style.
 * (NOTE:This interface sometimes wouldn't make sense.Entire javascript object has 'Object.prototype.toString'.
 * But,this interface was created to intend to ensure all objects implementing this interface have methods transforming into strings  and it is intended.)
 */
interface IStringConvertable {
    toString(): string;
}
export=IStringConvertable;
