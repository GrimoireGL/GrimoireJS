///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Collections;
    (function (Collections) {
        /**
         * The class for wrap basic javascript arrays as collection type implementing IEnumerator.
         */
        var ArrayEnumratorFactory = (function () {
            function ArrayEnumratorFactory(targetArray) {
                this.targetArray = targetArray;
            }
            ArrayEnumratorFactory.prototype.getEnumrator = function () {
                return new ArrayEnumerable(this.targetArray);
            };
            return ArrayEnumratorFactory;
        })();
        Collections.ArrayEnumratorFactory = ArrayEnumratorFactory;
        var ArrayEnumerable = (function () {
            function ArrayEnumerable(targetArrary) {
                this.currentIndex = -1;
                this.targetArrary = targetArrary;
            }
            ArrayEnumerable.prototype.getCurrent = function () {
                if (this.targetArrary.length > this.currentIndex && this.currentIndex >= 0) {
                    return this.targetArrary[this.currentIndex];
                }
            };
            ArrayEnumerable.prototype.next = function () {
                this.currentIndex++;
                if (this.currentIndex >= this.targetArrary.length)
                    return false;
                return true;
            };
            return ArrayEnumerable;
        })();
        /**
         * Containing some of methods use for IEnumerable generic interfaces.
         */
        var Collection = (function () {
            function Collection() {
            }
            /**
             * provides simple collection iteration like C# foreach syntax.
             */
            Collection.foreach = function (collection, act) {
                var enumerator = collection.getEnumrator();
                var index = 0;
                while (enumerator.next()) {
                    act(enumerator.getCurrent(), index);
                    index++;
                }
            };
            /**
             * provide the iteration that iterate 2 collections same time.
             * if the length of passed collection is different with the other collection, this method will stop when run out all elements in short collection.
             */
            Collection.foreachPair = function (col1, col2, act) {
                var en1 = col1.getEnumrator();
                var en2 = col2.getEnumrator();
                var index = 0;
                while (en1.next() && en2.next()) {
                    act(en1.getCurrent(), en2.getCurrent(), index);
                    index++;
                }
            };
            Collection.CopyArray = function (source) {
                var dest = new Array(source.length);
                for (var i = 0; i < source.length; i++) {
                    dest[i] = source[i];
                }
                return dest;
            };
            /**
             * 関数による評価値が等しいものを除外します
             */
            Collection.DistinctArray = function (source, ident) {
                var hashSet = new Set();
                var resultArray = [];
                source.forEach(function (v, n, a) {
                    if (!hashSet.has(ident(v))) {
                        resultArray.push(v);
                    }
                });
                return resultArray;
            };
            return Collection;
        })();
        Collections.Collection = Collection;
    })(Collections = jThree.Collections || (jThree.Collections = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Collections.js.map