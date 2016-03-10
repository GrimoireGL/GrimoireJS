class JThreeLogger {
    static sectionLog(sectionName, log) {
        console.log.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionWarn(sectionName, log) {
        console.warn.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionError(sectionName, log) {
        console.error.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionInfo(sectionName, log) {
        console.info.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionLongLog(sectionName, log) {
        // var params = JThreeLogger.sectionLogParams(sectionName,"");
        // var logLines = log.split('\n');
        // var entireLog="\n";
        // for (let i = 0; i < logLines.length; i++) {
        //     var line = `%c ${i+1} %c▶%c ${logLines[i]}\n`;
        //     params.push("background-color:#344F66;color:white;","color:#344F66;","");
        //     entireLog+=line;
        // }
        // params[0]+=entireLog;
        // console.log.apply(console,params);
    }
    static _sectionLogParams(sectionName, log) {
        return ["%c jThree v3 %c▶ " + sectionName + " %c▶%c " + log, "background-color:#344F66;color:white;", "color:#344F66;background-color:#D1D4D7;", "color:#D1D4D7;", ""];
    }
}
export default JThreeLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSlRocmVlTG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0UsT0FBYyxVQUFVLENBQUMsV0FBbUIsRUFBRSxHQUFXO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELE9BQWMsV0FBVyxDQUFDLFdBQW1CLEVBQUUsR0FBVztRQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxPQUFjLFlBQVksQ0FBQyxXQUFtQixFQUFFLEdBQVc7UUFDekQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsT0FBYyxXQUFXLENBQUMsV0FBbUIsRUFBRSxHQUFXO1FBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELE9BQWMsY0FBYyxDQUFDLFdBQW1CLEVBQUUsR0FBVztRQUMzRCw4REFBOEQ7UUFDOUQsa0NBQWtDO1FBQ2xDLHNCQUFzQjtRQUN0Qiw4Q0FBOEM7UUFDOUMscURBQXFEO1FBQ3JELGdGQUFnRjtRQUNoRix1QkFBdUI7UUFDdkIsSUFBSTtRQUNKLHdCQUF3QjtRQUN4QixxQ0FBcUM7SUFDdkMsQ0FBQztJQUVELE9BQWUsaUJBQWlCLENBQUMsV0FBbUIsRUFBRSxHQUFXO1FBQy9ELE1BQU0sQ0FBQyxDQUFDLG1CQUFtQixHQUFHLFdBQVcsR0FBRyxTQUFTLEdBQUcsR0FBRyxFQUFFLHVDQUF1QyxFQUFFLHlDQUF5QyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pLLENBQUM7QUFDSCxDQUFDO0FBQ0QsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiQmFzZS9KVGhyZWVMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBKVGhyZWVMb2dnZXIge1xuICBwdWJsaWMgc3RhdGljIHNlY3Rpb25Mb2coc2VjdGlvbk5hbWU6IHN0cmluZywgbG9nOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBKVGhyZWVMb2dnZXIuX3NlY3Rpb25Mb2dQYXJhbXMoc2VjdGlvbk5hbWUsIGxvZykpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzZWN0aW9uV2FybihzZWN0aW9uTmFtZTogc3RyaW5nLCBsb2c6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBKVGhyZWVMb2dnZXIuX3NlY3Rpb25Mb2dQYXJhbXMoc2VjdGlvbk5hbWUsIGxvZykpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzZWN0aW9uRXJyb3Ioc2VjdGlvbk5hbWU6IHN0cmluZywgbG9nOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIEpUaHJlZUxvZ2dlci5fc2VjdGlvbkxvZ1BhcmFtcyhzZWN0aW9uTmFtZSwgbG9nKSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNlY3Rpb25JbmZvKHNlY3Rpb25OYW1lOiBzdHJpbmcsIGxvZzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIEpUaHJlZUxvZ2dlci5fc2VjdGlvbkxvZ1BhcmFtcyhzZWN0aW9uTmFtZSwgbG9nKSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNlY3Rpb25Mb25nTG9nKHNlY3Rpb25OYW1lOiBzdHJpbmcsIGxvZzogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gdmFyIHBhcmFtcyA9IEpUaHJlZUxvZ2dlci5zZWN0aW9uTG9nUGFyYW1zKHNlY3Rpb25OYW1lLFwiXCIpO1xuICAgIC8vIHZhciBsb2dMaW5lcyA9IGxvZy5zcGxpdCgnXFxuJyk7XG4gICAgLy8gdmFyIGVudGlyZUxvZz1cIlxcblwiO1xuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgbG9nTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICAgdmFyIGxpbmUgPSBgJWMgJHtpKzF9ICVj4pa2JWMgJHtsb2dMaW5lc1tpXX1cXG5gO1xuICAgIC8vICAgICBwYXJhbXMucHVzaChcImJhY2tncm91bmQtY29sb3I6IzM0NEY2Njtjb2xvcjp3aGl0ZTtcIixcImNvbG9yOiMzNDRGNjY7XCIsXCJcIik7XG4gICAgLy8gICAgIGVudGlyZUxvZys9bGluZTtcbiAgICAvLyB9XG4gICAgLy8gcGFyYW1zWzBdKz1lbnRpcmVMb2c7XG4gICAgLy8gY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSxwYXJhbXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3NlY3Rpb25Mb2dQYXJhbXMoc2VjdGlvbk5hbWU6IHN0cmluZywgbG9nOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtcIiVjIGpUaHJlZSB2MyAlY+KWtiBcIiArIHNlY3Rpb25OYW1lICsgXCIgJWPilrYlYyBcIiArIGxvZywgXCJiYWNrZ3JvdW5kLWNvbG9yOiMzNDRGNjY7Y29sb3I6d2hpdGU7XCIsIFwiY29sb3I6IzM0NEY2NjtiYWNrZ3JvdW5kLWNvbG9yOiNEMUQ0RDc7XCIsIFwiY29sb3I6I0QxRDRENztcIiwgXCJcIl07XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEpUaHJlZUxvZ2dlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
