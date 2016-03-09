import JSON5 from "json5";
class ConditionBlock {
    constructor(condition, children, isPlain, content) {
        this._children = children;
        this._condition = condition;
        if (condition != null) {
            this._type = condition["type"];
        }
        this._isPlain = isPlain;
        this._content = content;
    }
    static parseCondition(source) {
        let ret = new ConditionBlock(null, ConditionBlock._parseCondition(source), false, null);
        ret._isRoot = true;
        return ret;
    }
    static _parseCondition(source) {
        let ret = [];
        const found = source.indexOf("@Condition(", 0);
        if (found < 0) {
            ret.push(ConditionBlock._createPlain(source));
            return ret; // When there was no more found
        }
        let beginConditionPoint = found + 10;
        const endConditionPoint = ConditionBlock._getEndBracketIndex(source, beginConditionPoint, "(", ")");
        if (endConditionPoint < 1) {
            // error no bracket matching
            console.error("Invalid bracket matching!");
            return null;
        }
        let beginContentPoint = source.indexOf("{", endConditionPoint);
        if (beginContentPoint < 0) {
            // error no bracket matching
            console.error("Invalid bracket matching!");
            return null;
        }
        const endContentPoint = ConditionBlock._getEndBracketIndex(source, beginContentPoint, "{", "}");
        if (endContentPoint < 0) {
            // error no bracket matching
            console.error("Invalid bracket matching!");
            return null;
        }
        let before = source.substring(0, found);
        let condition = source.substring(beginConditionPoint + 1, endConditionPoint);
        let jsonCondition = JSON5.parse(condition);
        let content = source.substring(beginContentPoint + 1, endContentPoint);
        let after = source.substring(endContentPoint + 1, source.length);
        ret.push(ConditionBlock._createPlain(before));
        ret.push(new ConditionBlock(jsonCondition, ConditionBlock._parseCondition(content), false, null));
        ret = ret.concat(ConditionBlock._parseCondition(after));
        return ret;
    }
    static _createPlain(content) {
        return new ConditionBlock(null, [], true, content);
    }
    static _getEndBracketIndex(source, startIndex, beginBracket, endBracket) {
        // get index of matching endBracket
        let index = startIndex;
        let bracketCount = 1;
        while (true) {
            if (bracketCount === 0) {
                break;
            }
            index++;
            const nextEndBlacket = source.indexOf(endBracket, index);
            const nextBeginBlacket = source.indexOf(beginBracket, index);
            if (nextEndBlacket < 0) {
                // error no bracket matching
                console.error("Invalid bracket matching!");
                return -1;
            }
            if (nextBeginBlacket < 0) {
                index = nextEndBlacket;
                bracketCount--;
                continue;
            }
            if (nextEndBlacket < nextBeginBlacket) {
                index = nextEndBlacket;
                bracketCount--;
                continue;
            }
            else {
                index = nextBeginBlacket;
                bracketCount++;
                continue;
            }
        }
        return index;
    }
    resolve(conditionRegister) {
        if (!this._isRoot) {
            if (this._isPlain) {
                return this._content;
            }
            let cc = conditionRegister.getConditionChecker(this._type);
            if (cc == null) {
                return "";
            }
            if (!cc.checkCondition(this._condition)) {
                return "";
            }
        }
        let ret = "";
        for (let i = 0; i < this._children.length; i++) {
            ret = ret + this._children[i].resolve(conditionRegister);
        }
        return ret;
    }
}
export default ConditionBlock;
