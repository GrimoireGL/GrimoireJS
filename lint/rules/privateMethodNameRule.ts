import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "private method name must begin with a _ and lowercase";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new PrivateMethodNameWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class PrivateMethodNameWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (this._isPrivate(node)) {
      const methodName = node.name.text;
      if (!/^_[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  public visitPropertyDeclaration(node: ts.MethodDeclaration) {
    if (this._isPrivate(node)) {
      const methodName = node.name.text;
      if (!/^_[a-z].+/m.test(methodName)) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + methodName));
      }
    }
    // call the base version of this visitor to actually parse this node
    super.visitPropertyDeclaration(node);
  }


  private _isPrivate(node: ts.MethodDeclaration) {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword);
  }
}
