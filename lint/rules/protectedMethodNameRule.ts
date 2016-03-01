import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "protected method name must begin lowercase and two _";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ProtectedMethodNameRule(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class ProtectedMethodNameRule extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (this._isProtected(node)) {
      const methodName = node.name.text;
      if (!/^__+[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  public visitPropertyDeclaration(node: ts.MethodDeclaration) {
    if (this._isProtected(node)) {
      const methodName = node.name.text;
      if (!/^__+[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitPropertyDeclaration(node);
  }

  private _isProtected(node: ts.MethodDeclaration) {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword);
  }
}
