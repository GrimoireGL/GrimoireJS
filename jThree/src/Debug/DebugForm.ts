class DebugForm
{
    public static get X():number
    {
      return +DebugForm.getInput("x").value;
    }

    public static get Y():number
    {
      return +DebugForm.getInput("y").value;
    }
    
    public static get Z():number
    {
      return +DebugForm.getInput("z").value;
    }

    private static getInput(id:string):HTMLInputElement
    {
      return <HTMLInputElement>document.getElementById(id);
    }
}

export = DebugForm;
