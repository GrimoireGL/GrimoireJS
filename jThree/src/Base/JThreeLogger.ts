class JThreeLogger
{
    public static sectionLog(sectionName:string,log:string)
    {
      console.log.apply(console,JThreeLogger.sectionLogParams(sectionName,log));
    }

    public static sectionWarn(sectionName:string,log:string)
    {
      console.warn.apply(console,JThreeLogger.sectionLogParams(sectionName,log));
    }

    public static sectionError(sectionName:string,log:string)
    {
      console.error.apply(console,JThreeLogger.sectionLogParams(sectionName,log));
    }

    public static sectionInfo(sectionName:string,log:string)
    {
      console.info.apply(console,JThreeLogger.sectionLogParams(sectionName,log));
    }

    private static sectionLogParams(sectionName:string,log:string)
    {
      return ["%c jThree v3 %c▶ "+sectionName+" %c▶%c "+log,"background-color:#344F66;color:white;","color:#344F66;background-color:#D1D4D7;","color:#D1D4D7;",""];
    }
}
export = JThreeLogger;
