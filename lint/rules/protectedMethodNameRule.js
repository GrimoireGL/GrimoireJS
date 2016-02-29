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
        return this.applyWithWalker(new ProtectedMethodNameRule(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "protected method name must begin lowercase and two _";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var ProtectedMethodNameRule = (function (_super) {
    __extends(ProtectedMethodNameRule, _super);
    function ProtectedMethodNameRule() {
        _super.apply(this, arguments);
    }
    ProtectedMethodNameRule.prototype.visitMethodDeclaration = function (node) {
        if (this._isProtected(node)) {
            var methodName = node.name.text;
            if (!/^__+[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    ProtectedMethodNameRule.prototype.visitPropertyDeclaration = function (node) {
        if (this._isProtected(node)) {
            var methodName = node.name.text;
            if (!/^__+[a-z].+/m.test(methodName)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    ProtectedMethodNameRule.prototype._isProtected = function (node) {
        return Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword);
    };
    return ProtectedMethodNameRule;
})(Lint.RuleWalker);
