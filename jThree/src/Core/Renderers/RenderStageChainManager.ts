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
    if(index >= 0 && index <= this.stageChains.length)
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
  }else{
    console.error(`Invalid render stage index : ${index}, Current length of stage chain is $${this.stageChains.length}`);
  }
  }

  public deleteWithIndex(index:number)
  {
    if(index >= 0 && index < this.stageChains.length&& this.stageChains.length >0)
    {
      var newStageChain = new Array(this.stageChains.length -1);
      for (let i = 0; i < index; i++) {
          newStageChain[i]=this.stageChains[i];
      }
      for (let i = index; i < newStageChain.length; i++)
      {
          newStageChain[i]=this.stageChains[i+1];
      }
      this.stageChains = newStageChain;
    }else{
      console.error(`Invalid render stage index:${index}, Current length of stage chain is ${this.stageChains.length}`);
    }
  }

  public deleteStage(stage:RenderStageChain)
  {
    for (let i = 0; i < this.stageChains.length; i++) {
        if(this.stageChains[i] === stage){
          this.deleteWithIndex(i);
          return;
        }
    }
    console.warn("Couldn't find specified RenderStage, any render stage was not deleted");
  }

  public insertAfter(targetStage:RenderStageChain,stage:RenderStageChain)
  {
    for (let i = 0; i < this.stageChains.length; i++) {
        if(this.stageChains[i] === stage){
          this.insertWithIndex(i+1,stage);
          return;
        }
    }
    console.error("Invalid render stage chain.Specified targetsStage was not found.");
  }

  public insertBefore(targetStage:RenderStageChain,stage:RenderStageChain)
  {
    for (let i = 0; i < this.stageChains.length; i++) {
        if(this.stageChains[i] === stage){
          this.insertWithIndex(i,stage);
          return;
        }
    }
    console.error("Invalid render stage chain. Specified targetStage was not found");
  }
}

export = RenderStageChainManager;
