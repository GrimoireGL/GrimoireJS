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
        return this.applyWithWalker(new PublicMethodNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "public method name must begin lowercase a-z";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var PublicMethodNameWalker = (function (_super) {
    __extends(PublicMethodNameWalker, _super);
    function PublicMethodNameWalker() {
        _super.apply(this, arguments);
    }
    PublicMethodNameWalker.prototype.visitMethodDeclaration = function (node) {
        if (this._isPublic(node)) {
            var methodName = node.name.text;
            if (!/^[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    PublicMethodNameWalker.prototype.visitPropertyDeclaration = function (node) {
        if (this._isPublic(node)) {
            var methodName = node.name.text;
            if (!/^[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    PublicMethodNameWalker.prototype._isPublic = function (node) {
        return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword);
    };
    return PublicMethodNameWalker;
})(Lint.RuleWalker);
