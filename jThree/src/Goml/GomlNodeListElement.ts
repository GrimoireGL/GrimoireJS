import JThreeObject = require("../Base/JThreeObject");

/**
 * GomlNodeをグループとしてまとめて管理します
 */
class GomlNodeListElement extends JThreeObject {
  private group: string;

  private nodeTypes: { [key: string]: any };

  /**
   * constructor
   *
   * @param {string} group    グループ識別用の文字列。すべて大文字で管理されています。
   * @param {any}}  nodeTypes グループ内のGomlNodeのconstructorをまとめるObject。Tag名がKeyとなっています。
   */
  constructor(group: string, nodeTypes: { [key: string]: any }) {
    super();
    this.group = group;
    this.nodeTypes = nodeTypes;
  }

  public get Group(): string {
    return this.group;
  }

  public get NodeTypes(): { [key: string]: any } {
    return this.nodeTypes;
  }
}

export =GomlNodeListElement;
