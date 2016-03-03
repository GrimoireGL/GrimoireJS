import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "No implicit return value type is forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoImplicitReturnTypeWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoImplicitReturnTypeWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (!node.type) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
    }
    //if(node.type)console.log(this.sourceFile.text.substring(node.type.pos,node.type.end));
    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
   if (!node.type) {
     this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
   }
   // call the base version of this visitor to actually parse this node
   super.visitPropertyDeclaration(node);
  }

  public visitAccessorDeclaration(node: ts.AccessorDeclaration) {
   if (!node.type) {
     this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + " at: " + node.name.text));
   }
   // call the base version of this visitor to actually parse this node
   super.visitAccessorDeclaration(node);
  }

}
