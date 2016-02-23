import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "public or protected method must have doc comment";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoPublicMemberWithoutCommentWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoPublicMemberWithoutCommentWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (this._isPublic(node) || this._isProtected(node)) {
      const modifiers = this.sourceFile.text.substring(node.pos, node.modifiers.end);
      if (!/\/\*\*/m.test(modifiers)) {
       this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  private _isPublic(node: ts.MethodDeclaration) {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword);
  }

  private _isProtected(node: ts.MethodDeclaration) {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword);
  }
}
