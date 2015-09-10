import RenderStageChain = require("./RenderStageChain");
class RenderStageChainManager
{
  public stageChains:RenderStageChain[] = [];

  public pushStage(stage:RenderStageChain)
  {
    this.stageChains.push(stage);
  }

  public insertWithIndex(index:number,stage:RenderStageChain)
  {
    var newStageChain = new Array(this.stageChains.length+1);
    for (let i = 0; i < index; i++) {
        newStageChain[i]=this.stageChains[i];
    }
    newStageChain[index]=stage;
    for(let i =index+1; i < newStageChain.length;i++)
    {
      newStageChain[i] = this.stageChains[i-1];
    }
    this.stageChains = newStageChain;
  }

  public insertAfter(targetStage:RenderStageChain,stage:RenderStageChain)
  {
    for (let i = 0; i < this.stageChains.length; i++) {
        if(this.stageChains[i] === stage){
          this.insertWithIndex(i+1,stage);
        }
    }
  }

  public insertBefore(targetStage:RenderStageChain,stage:RenderStageChain)
  {
    for (let i = 0; i < this.stageChains.length; i++) {
        if(this.stageChains[i] === stage){
          this.insertWithIndex(i,stage);
        }
    }
  }
}

export = RenderStageChainManager;
