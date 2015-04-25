import IEnumrator = require("./IEnumrator");
import IEnumerable = require("./IEnumerable");
import Delegates=require('Delegates');

/**
 * Containing some of methods use for IEnumerable generic interfaces.
 */
class Collection {
    /**
     * provides simple collection iteration like C# foreach syntax.
     */
    public static foreach<T>(collection: IEnumerable<T>, act: Delegates.Action2<T,number>): void {
        var enumerator: IEnumrator<T> = collection.getEnumrator();
        var index: number = 0;
        while (enumerator.next()) {
            act(enumerator.getCurrent(), index);
            index++;
        }
    }
    /**
     * provide the iteration that iterate 2 collections same time.
     * if the length of passed collection is different with the other collection, this method will stop when run out all elements in short collection.
     */

    public static foreachPair<T>(col1: IEnumerable<T>, col2: IEnumerable<T>, act: Delegates.Action3<T, T,number>) {
        var en1: IEnumrator<T> = col1.getEnumrator();
        var en2: IEnumrator<T> = col2.getEnumrator();
        var index: number = 0;
        while (en1.next() && en2.next()) {
            act(en1.getCurrent(), en2.getCurrent(), index);
            index++;
        }
    }

    public static CopyArray<T>(source: T[]): T[] {
        var dest: T[] = new Array(source.length);
        for (var i = 0; i < source.length; i++) {
            dest[i] = source[i];
        }
        return dest;
    }
    /**
     * 関数による評価値が等しいものを除外します
     */
    public static DistinctArray<T,H>(source: T[], ident: Delegates.Func1<T,H>):T[] {
        var hashSet: Set<H> = new Set();
        var resultArray: T[] = [];
        source.forEach((v, n, a) => {
            if (!hashSet.has(ident(v))) {
                resultArray.push(v);
            }
        });
        return resultArray;
    }
}
export=Collection;
