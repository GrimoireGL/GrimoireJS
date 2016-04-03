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
        return this.applyWithWalker(new NoPublicMemberWithoutCommentWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "public or protected method must have doc comment";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var NoPublicMemberWithoutCommentWalker = (function (_super) {
    __extends(NoPublicMemberWithoutCommentWalker, _super);
    function NoPublicMemberWithoutCommentWalker() {
        _super.apply(this, arguments);
    }
    NoPublicMemberWithoutCommentWalker.prototype.visitMethodDeclaration = function (node) {
        if (this._isPublic(node) || this._isProtected(node)) {
            var modifiers = this.sourceFile.text.substring(node.pos, node.modifiers.end);
            if (!/\/\*\*/m.test(modifiers)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    NoPublicMemberWithoutCommentWalker.prototype._isPublic = function (node) {
        return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword);
    };
    NoPublicMemberWithoutCommentWalker.prototype._isProtected = function (node) {
        return Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword);
    };
    return NoPublicMemberWithoutCommentWalker;
})(Lint.RuleWalker);
