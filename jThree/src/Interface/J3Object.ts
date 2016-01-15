import GomlTreeNodeBase = require('../Goml/GomlTreeNodeBase');

/**
 * Provides jQuery like API for jThree.
 */
class J3Object {
  constructor(nodes: GomlTreeNodeBase[]);
  constructor(query: string);
  constructor(nodes_query: GomlTreeNodeBase[] | string) {
    if (this instanceof arguments.callee) {
      // call with new operator
      const nodes = nodes_query;

    } else {
      // call with no new, this keyword will be window
      const query = nodes_query;

    }
  }
}

export = J3Object;
