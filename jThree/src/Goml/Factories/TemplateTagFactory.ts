import TagFactory = require("./TagFactory"); /**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class TemplateTagFactory extends TagFactory
{
  public get NoNeedParseChildren()
  {
    return true;
  }
}

export=TemplateTagFactory;
