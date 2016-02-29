var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint/lib/lint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoImplicitReturnTypeWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "No implicit return value type is forbidden";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImplicitReturnTypeWalker = (function (_super) {
    __extends(NoImplicitReturnTypeWalker, _super);
    function NoImplicitReturnTypeWalker() {
        _super.apply(this, arguments);
    }
    NoImplicitReturnTypeWalker.prototype.visitMethodDeclaration = function (node) {
        if (!node.type) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
        }
        //if(node.type)console.log(this.sourceFile.text.substring(node.type.pos,node.type.end));
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    NoImplicitReturnTypeWalker.prototype.visitPropertyDeclaration = function (node) {
        if (!node.type) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    NoImplicitReturnTypeWalker.prototype.visitAccessorDeclaration = function (node) {
        if (!node.type) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitAccessorDeclaration.call(this, node);
    };
    return NoImplicitReturnTypeWalker;
})(Lint.RuleWalker);
