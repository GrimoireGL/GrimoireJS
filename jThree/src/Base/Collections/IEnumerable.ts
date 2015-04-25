import IEnumrator = require("./IEnumrator");
interface IEnumerable<T> {
    getEnumrator(): IEnumrator<T>;
}
export=IEnumerable;
