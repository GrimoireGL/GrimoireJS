///<reference path="../../_references.ts"/>
///<reference path="../../def-test/qunit.d.ts"/>
        var testArray1: number[] = [1, 2, 3, 4, 5];
        var testArray2: number[]=[6, 7, 8, 9, 10,11,23];
        QUnit.module("Collection test");
        QUnit.test("foreach test", () => {
            var result: number = 0;
            var enArray1: jThree.Collections.IEnumerable<number> = new jThree.Collections.ArrayEnumratorFactory(testArray1);
            jThree.Collections.Collection.foreach(enArray1, (t) => { result += t });
            QUnit.equal(result, 15);
        });

        QUnit.test("foreach pair test", () => {
            var result: number = 0;
            var enArray1: jThree.Collections.IEnumerable<number> = new jThree.Collections.ArrayEnumratorFactory(testArray1);
            var enArray2: jThree.Collections.IEnumerable<number> = new jThree.Collections.ArrayEnumratorFactory(testArray2);
            jThree.Collections.Collection.foreachPair(enArray1, enArray2, (a, b) => { result += a * b });
            QUnit.equal(result, 130);
        });
    
