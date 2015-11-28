import TagFactory = require("./TagFactory");


class ChildrenParseSkipFactory extends TagFactory
{
  public get NoNeedParseChildren()
  {
    return true;
  }
}

export=ChildrenParseSkipFactory;
