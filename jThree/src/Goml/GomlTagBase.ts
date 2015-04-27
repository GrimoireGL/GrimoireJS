import GomlTreeNodeBase = require("./GomlTreeNodeBase");

import jThreeObject = require("../Base/JThreeObject");
import JThreeContext = require("../Core/JThreeContext");
import JThreeContextProxy = require("../Core/JThreeContextProxy");
import GomlLoader = require("./GomlLoader");
class GomlTagBase extends jThreeObject {
    get TagName(): string {
        return "";
    }


    CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
        return null;
    }

    protected getTag(name:string): GomlTagBase {
        return JThreeContextProxy.getJThreeContext().GomlLoader.gomlTags.get(name);
    }
}

export=GomlTagBase;
