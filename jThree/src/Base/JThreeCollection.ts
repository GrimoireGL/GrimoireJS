import JThreeObjectWithID = require("./JThreeObjectWithID");
import Delegates = require("../Base/Delegates");
import AssociativeArray = require('./Collections/AssociativeArray');
/**
 * Collections for JThreeObjectWithID
 */
class JThreeCollection<T extends JThreeObjectWithID>
{
  /**
   * Managed collection
   * @type {{[key:string]:T} }
   */
  private _collection:AssociativeArray<T>=new AssociativeArray<T>();

  /**
   * Obtain object by object ID
   * @param  {string} id object ID
   * @return {T}        obtained object
   */
  public getById(id:string):T
  {
    return this._collection.get(id);
  }

  /**
   * Check whether specified item is included in this collection
   * @param  {T}       item the object to check for
   * @return {boolean}      Whether the item is included or not.
   */
  public isContained(item:T):boolean
  {
    return this._collection.has(item.ID);
  }

  /**
   * Insert specified object into this collection.
   * If specified object has same ID with an object already inserted, old object will be replaced with new object.
   * @param  {T}       item the object to insert into
   * @return {boolean}      Whether specified object was replaced(false) or,simply inserted(true)
   */
  public insert(item:T):boolean
  {
    if(this._collection.has(item.ID))
    {
      return false;
    }else{
      this._collection.set(item.ID,item);
      return true;
    }
  }

  /**
   * Delete specified object from this collection.
   * @param  {T}       item the object to delete
   * @return {boolean}      Whether specified object was already exist and deleted, or not.
   */
  public del(item:T):boolean
  {
    if(this._collection.has(item.ID))
    {
      this._collection.delete(item.ID);
      return true;
    }else
      return false;
  }

  /**
   * Execute passed function for each objects.
   * @param  {Delegates.Action3<T,string,JThreeCollection<T>>} act the function to exuecute for
   */
  public each(act:Delegates.Action3<T,string,JThreeCollection<T>>):void
  {
    this._collection.forEach((a,b)=>act(a,b,this));
  }

  /**
   * Basic array converted from this collection
   */
  public asArray():T[]
  {
    return this._collection.asArray;
  }

  /**
   * Count of this collection
   */
  public get length()
  {
    return this._collection.length;
  }
}

export=JThreeCollection;
