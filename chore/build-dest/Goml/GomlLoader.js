import jThreeObject from "../Base/JThreeObject";
import { InvalidArgumentException } from "../Exceptions";
import JThreeLogger from "../Base/JThreeLogger";
import GomlParser from "./GomlParser";
import JThreeContext from "../JThreeContext";
import ContextComponent from "../ContextComponents";
/**
 * The class for loading goml.
 */
class GomlLoader extends jThreeObject {
    // public update() {
    //   if (!this.ready) return;
    //   if(this.gomlRoot)this.gomlRoot.callRecursive(v=>v.update());
    //   this.componentRunner.executeForAllBehaviors("updateBehavior");
    // }
    /**
     * Constructor. User no need to call this constructor by yourself.
     */
    constructor(nodeManager, selfTag) {
        super();
        // obtain the script tag that is refering this source code.
        this._selfTag = selfTag;
        this._nodeManager = nodeManager;
        const resourceLoader = JThreeContext.getContextComponent(ContextComponent.ResourceLoader);
        this._gomlLoadingDeferred = resourceLoader.getResourceLoadingDeffered();
        resourceLoader.promise.then(() => {
            console.log("load finished!!");
        }, undefined, (v) => {
            // console.log(`loading resource...${v.completedResource / v.resourceCount * 100}%`);
        });
    }
    /**
     * Attempt to load GOMLs that placed in HTML file.
     */
    initForPage() {
        JThreeLogger.sectionLog("Goml loader", "Goml initialization was started.");
        // to load <script src="j3.js" x-goml="HERE"/>
        this._attemptToLoadGomlInScriptAttr();
        // to load the script that is type of text/goml
        const gomls = document.querySelectorAll("script[type=\'text/goml\']");
        for (let i = 0; i < gomls.length; i++) {
            this._loadScriptTag(gomls[i]);
        }
    }
    /**
     * Load goml script for current jthree v3 syntax.
     *
     * Attempt to load x-goml attribute from script tag refering this source.
     * <script x-goml='path/to/goml'></script>
     */
    _attemptToLoadGomlInScriptAttr() {
        const url = this._selfTag.getAttribute("x-goml");
        if (!url) {
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            this._scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
        });
        xhr.open("GET", url);
        xhr.responseType = "text";
        xhr.send();
    }
    /**
     * Load goml script for legacy jthree v2 syntax.
     *
     * Attempt to load src or innerText from script tag refering this source.
     * <script type='text/goml' src='path/to/goml'></script>
     * or
     * <script type='text/goml'>{{goml}}</script>
     *
     * @param {HTMLElement} scriptTag HTMLElement object of script tag
     */
    _loadScriptTag(scriptTag) {
        const srcSource = scriptTag.getAttribute("src"), xhr = new XMLHttpRequest();
        if (srcSource) {
            // use xhr to get script of src
            xhr.addEventListener("load", () => {
                this._scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
            });
            xhr.open("GET", srcSource);
            xhr.responseType = "text";
            xhr.send();
        }
        else {
            for (let i = 0; i + 1 <= scriptTag.childNodes.length; i++) {
                const gomlElement = scriptTag.childNodes[i];
                if (gomlElement.nodeType === 1) {
                    this._scriptLoaded(gomlElement);
                }
            }
        }
    }
    /**
     * parse goml source to node tree and load each node
     *
     * @param {HTMLElement} source goml source
     */
    _scriptLoaded(source) {
        this._nodeManager.htmlRoot = source;
        // if ((<Element>catched.childNodes[0]).tagName.toUpperCase() === "PARSERERROR") {
        //   JThreeLogger.sectionError("Goml loader", `Invalid Goml was passed. Parsing goml was aborted. Error code will be appear below`);
        //   JThreeLogger.sectionLongLog("Goml loader", catched.innerHTML);
        // }
        if (source === undefined || source.tagName.toUpperCase() !== "GOML") {
            throw new InvalidArgumentException("Root should be goml");
        }
        const parsedNode = GomlParser.parse(source, this._nodeManager.configurator);
        parsedNode.Mounted = true;
        this._nodeManager.gomlRoot = parsedNode;
        JThreeLogger.sectionLog("Goml loader", `Goml loading was completed`);
        this._nodeManager.ready = true;
        this._nodeManager.attributePromiseRegistry.async(() => {
            // onfullfilled
            console.log("all attribute initialized");
            this._gomlLoadingDeferred.resolve(null);
        });
    }
}
export default GomlLoader;

//# sourceMappingURL=data:application/json;base64,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QztRQUNELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUUsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDO1lBQy9DLGVBQWU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxVQUFVLENBQUMiLCJmaWxlIjoiR29tbC9Hb21sTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpUaHJlZU9iamVjdCBmcm9tIFwiLi4vQmFzZS9KVGhyZWVPYmplY3RcIjtcbmltcG9ydCB7SW52YWxpZEFyZ3VtZW50RXhjZXB0aW9ufSBmcm9tIFwiLi4vRXhjZXB0aW9uc1wiO1xuaW1wb3J0IEpUaHJlZUxvZ2dlciBmcm9tIFwiLi4vQmFzZS9KVGhyZWVMb2dnZXJcIjtcbmltcG9ydCBHb21sUGFyc2VyIGZyb20gXCIuL0dvbWxQYXJzZXJcIjtcbmltcG9ydCBOb2RlTWFuYWdlciBmcm9tIFwiLi9Ob2RlTWFuYWdlclwiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBSZXNvdXJjZUxvYWRlciBmcm9tIFwiLi4vQ29yZS9SZXNvdXJjZUxvYWRlclwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnQgZnJvbSBcIi4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgUSBmcm9tIFwicVwiO1xuXG4vKipcbiAqIFRoZSBjbGFzcyBmb3IgbG9hZGluZyBnb21sLlxuICovXG5jbGFzcyBHb21sTG9hZGVyIGV4dGVuZHMgalRocmVlT2JqZWN0IHtcbiAgLy8gcHVibGljIHVwZGF0ZSgpIHtcbiAgLy8gICBpZiAoIXRoaXMucmVhZHkpIHJldHVybjtcbiAgLy8gICBpZih0aGlzLmdvbWxSb290KXRoaXMuZ29tbFJvb3QuY2FsbFJlY3Vyc2l2ZSh2PT52LnVwZGF0ZSgpKTtcbiAgLy8gICB0aGlzLmNvbXBvbmVudFJ1bm5lci5leGVjdXRlRm9yQWxsQmVoYXZpb3JzKFwidXBkYXRlQmVoYXZpb3JcIik7XG4gIC8vIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0b3IuIFVzZXIgbm8gbmVlZCB0byBjYWxsIHRoaXMgY29uc3RydWN0b3IgYnkgeW91cnNlbGYuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihub2RlTWFuYWdlcjogTm9kZU1hbmFnZXIsIHNlbGZUYWc6IEhUTUxTY3JpcHRFbGVtZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICAvLyBvYnRhaW4gdGhlIHNjcmlwdCB0YWcgdGhhdCBpcyByZWZlcmluZyB0aGlzIHNvdXJjZSBjb2RlLlxuICAgIHRoaXMuX3NlbGZUYWcgPSBzZWxmVGFnO1xuICAgIHRoaXMuX25vZGVNYW5hZ2VyID0gbm9kZU1hbmFnZXI7XG4gICAgY29uc3QgcmVzb3VyY2VMb2FkZXIgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8UmVzb3VyY2VMb2FkZXI+KENvbnRleHRDb21wb25lbnQuUmVzb3VyY2VMb2FkZXIpO1xuICAgIHRoaXMuX2dvbWxMb2FkaW5nRGVmZXJyZWQgPSByZXNvdXJjZUxvYWRlci5nZXRSZXNvdXJjZUxvYWRpbmdEZWZmZXJlZDx2b2lkPigpO1xuICAgIHJlc291cmNlTG9hZGVyLnByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImxvYWQgZmluaXNoZWQhIVwiKTtcbiAgICB9LCB1bmRlZmluZWQsXG4gICAgICAodikgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgbG9hZGluZyByZXNvdXJjZS4uLiR7di5jb21wbGV0ZWRSZXNvdXJjZSAvIHYucmVzb3VyY2VDb3VudCAqIDEwMH0lYCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb2RlTWFuYWdlciBpbnN0YW5jZVxuICAgKiBAdHlwZSB7Tm9kZU1hbmFnZXJ9XG4gICAqL1xuICBwcml2YXRlIF9ub2RlTWFuYWdlcjogTm9kZU1hbmFnZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzY3JpcHQgdGFnIHRoYXQgaXMgcmVmZXJpbmcgdGhpcyBzb3VyY2UgY29kZS5cbiAgICovXG4gIHByaXZhdGUgX3NlbGZUYWc6IEhUTUxTY3JpcHRFbGVtZW50O1xuXG4gIHByaXZhdGUgX2dvbWxMb2FkaW5nRGVmZXJyZWQ6IFEuRGVmZXJyZWQ8dm9pZD47XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gbG9hZCBHT01McyB0aGF0IHBsYWNlZCBpbiBIVE1MIGZpbGUuXG4gICAqL1xuICBwdWJsaWMgaW5pdEZvclBhZ2UoKTogdm9pZCB7XG4gICAgSlRocmVlTG9nZ2VyLnNlY3Rpb25Mb2coXCJHb21sIGxvYWRlclwiLCBcIkdvbWwgaW5pdGlhbGl6YXRpb24gd2FzIHN0YXJ0ZWQuXCIpO1xuICAgIC8vIHRvIGxvYWQgPHNjcmlwdCBzcmM9XCJqMy5qc1wiIHgtZ29tbD1cIkhFUkVcIi8+XG4gICAgdGhpcy5fYXR0ZW1wdFRvTG9hZEdvbWxJblNjcmlwdEF0dHIoKTtcbiAgICAvLyB0byBsb2FkIHRoZSBzY3JpcHQgdGhhdCBpcyB0eXBlIG9mIHRleHQvZ29tbFxuICAgIGNvbnN0IGdvbWxzOiBOb2RlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzY3JpcHRbdHlwZT1cXCd0ZXh0L2dvbWxcXCddXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ29tbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2xvYWRTY3JpcHRUYWcoPEhUTUxFbGVtZW50PmdvbWxzW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBnb21sIHNjcmlwdCBmb3IgY3VycmVudCBqdGhyZWUgdjMgc3ludGF4LlxuICAgKlxuICAgKiBBdHRlbXB0IHRvIGxvYWQgeC1nb21sIGF0dHJpYnV0ZSBmcm9tIHNjcmlwdCB0YWcgcmVmZXJpbmcgdGhpcyBzb3VyY2UuXG4gICAqIDxzY3JpcHQgeC1nb21sPSdwYXRoL3RvL2dvbWwnPjwvc2NyaXB0PlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0ZW1wdFRvTG9hZEdvbWxJblNjcmlwdEF0dHIoKTogdm9pZCB7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLl9zZWxmVGFnLmdldEF0dHJpYnV0ZShcIngtZ29tbFwiKTtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5fc2NyaXB0TG9hZGVkKChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyh4aHIucmVzcG9uc2UsIFwidGV4dC94bWxcIikuZG9jdW1lbnRFbGVtZW50KTtcbiAgICB9KTtcbiAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBcInRleHRcIjtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZ29tbCBzY3JpcHQgZm9yIGxlZ2FjeSBqdGhyZWUgdjIgc3ludGF4LlxuICAgKlxuICAgKiBBdHRlbXB0IHRvIGxvYWQgc3JjIG9yIGlubmVyVGV4dCBmcm9tIHNjcmlwdCB0YWcgcmVmZXJpbmcgdGhpcyBzb3VyY2UuXG4gICAqIDxzY3JpcHQgdHlwZT0ndGV4dC9nb21sJyBzcmM9J3BhdGgvdG8vZ29tbCc+PC9zY3JpcHQ+XG4gICAqIG9yXG4gICAqIDxzY3JpcHQgdHlwZT0ndGV4dC9nb21sJz57e2dvbWx9fTwvc2NyaXB0PlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzY3JpcHRUYWcgSFRNTEVsZW1lbnQgb2JqZWN0IG9mIHNjcmlwdCB0YWdcbiAgICovXG4gIHByaXZhdGUgX2xvYWRTY3JpcHRUYWcoc2NyaXB0VGFnOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHNyY1NvdXJjZTogc3RyaW5nID0gc2NyaXB0VGFnLmdldEF0dHJpYnV0ZShcInNyY1wiKSxcbiAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGlmIChzcmNTb3VyY2UpIHsgLy8gd2hlbiBzcmMgaXMgc3BlY2lmaWVkXG4gICAgICAvLyB1c2UgeGhyIHRvIGdldCBzY3JpcHQgb2Ygc3JjXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9zY3JpcHRMb2FkZWQoKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKHhoci5yZXNwb25zZSwgXCJ0ZXh0L3htbFwiKS5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgICB4aHIub3BlbihcIkdFVFwiLCBzcmNTb3VyY2UpO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwidGV4dFwiO1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9IGVsc2UgeyAvLyB3aGVuIHNyYyBpcyBub3Qgc3BlY2lmaWVkXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSArIDEgPD0gc2NyaXB0VGFnLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ29tbEVsZW1lbnQgPSBzY3JpcHRUYWcuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKGdvbWxFbGVtZW50Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5fc2NyaXB0TG9hZGVkKDxIVE1MRWxlbWVudD5nb21sRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcGFyc2UgZ29tbCBzb3VyY2UgdG8gbm9kZSB0cmVlIGFuZCBsb2FkIGVhY2ggbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzb3VyY2UgZ29tbCBzb3VyY2VcbiAgICovXG4gIHByaXZhdGUgX3NjcmlwdExvYWRlZChzb3VyY2U6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgdGhpcy5fbm9kZU1hbmFnZXIuaHRtbFJvb3QgPSBzb3VyY2U7XG4gICAgLy8gaWYgKCg8RWxlbWVudD5jYXRjaGVkLmNoaWxkTm9kZXNbMF0pLnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJQQVJTRVJFUlJPUlwiKSB7XG4gICAgLy8gICBKVGhyZWVMb2dnZXIuc2VjdGlvbkVycm9yKFwiR29tbCBsb2FkZXJcIiwgYEludmFsaWQgR29tbCB3YXMgcGFzc2VkLiBQYXJzaW5nIGdvbWwgd2FzIGFib3J0ZWQuIEVycm9yIGNvZGUgd2lsbCBiZSBhcHBlYXIgYmVsb3dgKTtcbiAgICAvLyAgIEpUaHJlZUxvZ2dlci5zZWN0aW9uTG9uZ0xvZyhcIkdvbWwgbG9hZGVyXCIsIGNhdGNoZWQuaW5uZXJIVE1MKTtcbiAgICAvLyB9XG4gICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IHNvdXJjZS50YWdOYW1lLnRvVXBwZXJDYXNlKCkgIT09IFwiR09NTFwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEFyZ3VtZW50RXhjZXB0aW9uKFwiUm9vdCBzaG91bGQgYmUgZ29tbFwiKTtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VkTm9kZSA9IEdvbWxQYXJzZXIucGFyc2Uoc291cmNlLCB0aGlzLl9ub2RlTWFuYWdlci5jb25maWd1cmF0b3IpO1xuICAgIHBhcnNlZE5vZGUuTW91bnRlZCA9IHRydWU7XG4gICAgdGhpcy5fbm9kZU1hbmFnZXIuZ29tbFJvb3QgPSBwYXJzZWROb2RlO1xuICAgIEpUaHJlZUxvZ2dlci5zZWN0aW9uTG9nKFwiR29tbCBsb2FkZXJcIiwgYEdvbWwgbG9hZGluZyB3YXMgY29tcGxldGVkYCk7XG4gICAgdGhpcy5fbm9kZU1hbmFnZXIucmVhZHkgPSB0cnVlO1xuICAgIHRoaXMuX25vZGVNYW5hZ2VyLmF0dHJpYnV0ZVByb21pc2VSZWdpc3RyeS5hc3luYygoKSA9PiB7XG4gICAgICAvLyBvbmZ1bGxmaWxsZWRcbiAgICAgIGNvbnNvbGUubG9nKFwiYWxsIGF0dHJpYnV0ZSBpbml0aWFsaXplZFwiKTtcbiAgICAgIHRoaXMuX2dvbWxMb2FkaW5nRGVmZXJyZWQucmVzb2x2ZShudWxsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHb21sTG9hZGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
