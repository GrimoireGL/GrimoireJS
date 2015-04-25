import JThreeObject=require('Base/JThreeObject');
import JThreeID = require("./JThreeID");

class JThreeObjectWithID extends JThreeObject
{
  constructor() {
      super();
      this.id = JThreeID.getUniqueRandom(10);
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
