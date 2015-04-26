import GomlTreeNodeBase = require("./GomlTreeNodeBase");

import jThreeObject = require("../Base/JThreeObject");
import JThreeContext = require("../Core/JThreeContext");

class GomlTagBase extends jThreeObject {
    get TagName(): string {
        return "";
    }


    CreateNodeForThis(elem: Element): GomlTreeNodeBase {
        return null;
    }

    protected getTag(name:string): GomlTagBase {
        return JThreeContext.getInstance().GomlLoader.gomlTags.get(name);
    }
}

export=GomlTagBase;
