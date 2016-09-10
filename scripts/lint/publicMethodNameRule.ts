import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "public method name must begin lowercase a-z";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new PublicMethodNameWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class PublicMethodNameWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (this._isPublic(node)) {
      const methodName = node.name.text;
      if (!/^[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  public visitPropertyDeclaration(node: ts.MethodDeclaration) {
    if (this._isPublic(node)) {
      const methodName = node.name.text;
      if (!/^[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  private _isPublic(node: ts.MethodDeclaration) {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword);
  }
}
