var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("tslint/lib/lint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PrivateMethodNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "private method name must begin with a _ and lowercase";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var PrivateMethodNameWalker = (function (_super) {
    __extends(PrivateMethodNameWalker, _super);
    function PrivateMethodNameWalker() {
        _super.apply(this, arguments);
    }
    PrivateMethodNameWalker.prototype.visitMethodDeclaration = function (node) {
        if (this._isPrivate(node)) {
            var methodName = node.name.text;
            if (!/^_[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    PrivateMethodNameWalker.prototype.visitPropertyDeclaration = function (node) {
        if (this._isPrivate(node)) {
            var methodName = node.name.text;
            if (!/^_[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    PrivateMethodNameWalker.prototype._isPrivate = function (node) {
        return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword);
    };
    return PrivateMethodNameWalker;
})(Lint.RuleWalker);
