import JThreeObject = require("./JThreeObject");
import JThreeID = require("./JThreeID");

class JThreeObjectWithID extends JThreeObject
{
  constructor(id?:string) {
      super();
      this.id =id|| JThreeID.getUniqueRandom(10);
  }
  private id: string;
  /**
   * このオブジェクトを識別するID
   */
  public get ID(): string
  {
      return this.id;
  }
}

export=JThreeObjectWithID;
