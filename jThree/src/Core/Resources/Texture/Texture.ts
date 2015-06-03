import ContextSafeResourceContainer = require('../ContextSafeResourceContainer');
import TextureWrapper = require('./TextureWrapper');
class Texture extends ContextSafeResourceContainer<TextureWrapper>
{
  private static powerOf2:number[]=[1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192];
  private height:number;
  private heightInPowerOf2:number;
  public get Height():number
  {
    return this.height;
  }

  public set Height(val:number)
  {
    this.height = val;
    this.heightInPowerOf2=this.getPower2Size(val);
  }

  public get HeightInPowerOf2()
  {
    return this.heightInPowerOf2;
  }

  private width:number;
  private widthInPowerOf2:number;

  public get Width():number
  {
    return this.width;
  }

  public set Width(val:number)
  {
    this.width=val;
    this.widthInPowerOf2=this.getPower2Size(val);
  }

  public get WidthInPowerOf2():number
  {
    return this.widthInPowerOf2;
  }

  private getPower2Size(val:number):number
  {
    for (var i = 0; i < Texture.powerOf2.length; i++) {
      var num = Texture.powerOf2[i];
        if(val <= num)
          return num;
    }
    return Texture.powerOf2[Texture.powerOf2.length-1];
  }
}
