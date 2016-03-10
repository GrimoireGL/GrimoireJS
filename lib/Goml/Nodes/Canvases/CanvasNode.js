import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import CanvasElementBuilder from "../../../Core/Canvas/CanvasElementBuilder";
import Canvas from "../../../Core/Canvas/Canvas";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
class CanvasNode extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "frame": {
                value: undefined,
                converter: "string",
                constant: true,
            },
            "width": {
                value: 640,
                converter: "float",
                onchanged: (v) => {
                    this.emit("resize");
                    this.__sizeChanged(v.Value, this.attributes.getValue("height"));
                    v.done();
                },
            },
            "height": {
                value: 480,
                converter: "float",
                onchanged: (v) => {
                    this.emit("resize");
                    this.__sizeChanged(this.attributes.getValue("width"), v.Value);
                    v.done();
                },
            },
            "loader": {
                value: undefined,
                converter: "string",
                constant: true,
            },
            "clearColor": {
                value: "#0000",
                converter: "color4",
                onchanged: (v) => {
                    this.target.clearColor = v.Value;
                    v.done();
                }
            }
        });
    }
    get Frame() {
        return this.attributes.getValue("frame") || "body";
    }
    __onMount() {
        super.__onMount();
        // generate canvas
        const canvas = document.querySelector(this.Frame);
        this.canvasFrames = CanvasElementBuilder.generate(canvas, this.attributes.getValue("width"), this.attributes.getValue("height"));
        // initialize contexts
        this.target = new Canvas(this.canvasFrames.canvas);
        JThreeContext.getContextComponent(ContextComponents.CanvasManager).addCanvas(this.target);
        // construct loader
        let defaultLoader;
        // TODO: pnly
        // if (this.attributes.getValue("loader") !== "undefined" && this.nodeManager.nodeRegister.hasGroup("jthree.loader")) {
        //   var loaderNode = (this.nodeManager.nodeRegister.getObject("jthree.loader", this.attributes.getValue("loader")) as any);
        //   if (loaderNode) defaultLoader = loaderNode.loaderHTML;
        // }
        if (!defaultLoader) {
            defaultLoader = require("../../../static/defaultLoader.html");
        }
        this.canvasFrames.loaderContainer.innerHTML = defaultLoader;
        const progressLoaders = this.canvasFrames.loaderContainer.querySelectorAll(".x-j3-loader-progress");
        JThreeContext.getContextComponent(ContextComponents.ResourceLoader).promise.then(() => {
            const loaders = this.canvasFrames.resizeDetecter.querySelectorAll(".x-j3-loader-container");
            for (let i = 0; i < loaders.length; i++) {
                const loader = loaders.item(i);
                loader.remove();
            }
        }, () => { return; }, (p) => {
            for (let i = 0; i < progressLoaders.length; i++) {
                const progress = progressLoaders.item(i);
                progress.style.width = p.completedResource / p.resourceCount * 100 + "%";
            }
        });
    }
    get DefaultWidth() {
        return this.canvasFrames.container.clientWidth;
    }
    get DefaultHeight() {
        return this.canvasFrames.container.clientHeight;
    }
    __sizeChanged(width, height) {
        this.canvasFrames.canvas.width = width;
        this.canvasFrames.canvas.height = height;
    }
}
export default CanvasNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvQ2FudmFzZXMvQ2FudmFzTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxtQkFBbUIsTUFBTSwyQkFBMkI7T0FHcEQsb0JBQW9CLE1BQU0sMkNBQTJDO09BQ3JFLE1BQU0sTUFBTSw2QkFBNkI7T0FDekMsYUFBYSxNQUFNLHdCQUF3QjtPQUMzQyxpQkFBaUIsTUFBTSw0QkFBNEI7QUFHMUQseUJBQXlCLG1CQUFtQjtJQUcxQztRQUNFLE9BQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzlCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFFBQVEsRUFBRSxJQUFJO2FBRWY7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWCxDQUFDO2FBQ0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQy9ELENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWCxDQUFD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RyxDQUFDLENBQUMsYUFBYSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDM0UsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQWMsWUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFjLGFBQWE7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztJQUNsRCxDQUFDO0lBRVMsYUFBYSxDQUFDLEtBQWEsRUFBRSxNQUFjO1FBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUMzQyxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsVUFBVSxDQUFDIiwiZmlsZSI6IkdvbWwvTm9kZXMvQ2FudmFzZXMvQ2FudmFzTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3JlUmVsYXRlZE5vZGVCYXNlIGZyb20gXCIuLi8uLi9Db3JlUmVsYXRlZE5vZGVCYXNlXCI7XG5pbXBvcnQgQ2FudmFzTWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9DYW52YXMvQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IElDYW52YXNFbGVtZW50U3RydWN0dXJlIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NhbnZhcy9JQ2FudmFzRWxlbWVudFN0cnVjdHVyZVwiO1xuaW1wb3J0IENhbnZhc0VsZW1lbnRCdWlsZGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NhbnZhcy9DYW52YXNFbGVtZW50QnVpbGRlclwiO1xuaW1wb3J0IENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQ29yZS9DYW52YXMvQ2FudmFzXCI7XG5pbXBvcnQgSlRocmVlQ29udGV4dCBmcm9tIFwiLi4vLi4vLi4vSlRocmVlQ29udGV4dFwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi8uLi8uLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IFJlc291cmNlTG9hZGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL1Jlc291cmNlTG9hZGVyXCI7XG5cbmNsYXNzIENhbnZhc05vZGUgZXh0ZW5kcyBDb3JlUmVsYXRlZE5vZGVCYXNlPENhbnZhcz4ge1xuICBwdWJsaWMgY2FudmFzRnJhbWVzOiBJQ2FudmFzRWxlbWVudFN0cnVjdHVyZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYXR0cmlidXRlcy5kZWZpbmVBdHRyaWJ1dGUoe1xuICAgICAgXCJmcmFtZVwiOiB7XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbnZlcnRlcjogXCJzdHJpbmdcIixcbiAgICAgICAgY29uc3RhbnQ6IHRydWUsXG4gICAgICAgIC8vIFRPRE8gcG5seTogZnJhbWUgb25jaGFuZ2UgaGFuZGxlclxuICAgICAgfSxcbiAgICAgIFwid2lkdGhcIjoge1xuICAgICAgICB2YWx1ZTogNjQwLFxuICAgICAgICBjb252ZXJ0ZXI6IFwiZmxvYXRcIixcbiAgICAgICAgb25jaGFuZ2VkOiAodikgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdChcInJlc2l6ZVwiKTtcbiAgICAgICAgICB0aGlzLl9fc2l6ZUNoYW5nZWQodi5WYWx1ZSwgdGhpcy5hdHRyaWJ1dGVzLmdldFZhbHVlKFwiaGVpZ2h0XCIpKTtcbiAgICAgICAgICB2LmRvbmUoKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBcImhlaWdodFwiOiB7XG4gICAgICAgIHZhbHVlOiA0ODAsXG4gICAgICAgIGNvbnZlcnRlcjogXCJmbG9hdFwiLFxuICAgICAgICBvbmNoYW5nZWQ6ICh2KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwicmVzaXplXCIpO1xuICAgICAgICAgIHRoaXMuX19zaXplQ2hhbmdlZCh0aGlzLmF0dHJpYnV0ZXMuZ2V0VmFsdWUoXCJ3aWR0aFwiKSwgdi5WYWx1ZSk7XG4gICAgICAgICAgdi5kb25lKCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXCJsb2FkZXJcIjoge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBjb252ZXJ0ZXI6IFwic3RyaW5nXCIsXG4gICAgICAgIGNvbnN0YW50OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIFwiY2xlYXJDb2xvclwiOiB7XG4gICAgICAgIHZhbHVlOiBcIiMwMDAwXCIsXG4gICAgICAgIGNvbnZlcnRlcjogXCJjb2xvcjRcIixcbiAgICAgICAgb25jaGFuZ2VkOiAodikgPT4ge1xuICAgICAgICAgIHRoaXMudGFyZ2V0LmNsZWFyQ29sb3IgPSB2LlZhbHVlO1xuICAgICAgICAgIHYuZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIHB1YmxpYyBnZXQgRnJhbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmdldFZhbHVlKFwiZnJhbWVcIikgfHwgXCJib2R5XCI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19vbk1vdW50KCk6IHZvaWQge1xuICAgIHN1cGVyLl9fb25Nb3VudCgpO1xuICAgIC8vIGdlbmVyYXRlIGNhbnZhc1xuICAgIGNvbnN0IGNhbnZhcyA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuRnJhbWUpO1xuICAgIHRoaXMuY2FudmFzRnJhbWVzID0gQ2FudmFzRWxlbWVudEJ1aWxkZXIuZ2VuZXJhdGUoY2FudmFzLCB0aGlzLmF0dHJpYnV0ZXMuZ2V0VmFsdWUoXCJ3aWR0aFwiKSwgdGhpcy5hdHRyaWJ1dGVzLmdldFZhbHVlKFwiaGVpZ2h0XCIpKTtcblxuICAgIC8vIGluaXRpYWxpemUgY29udGV4dHNcbiAgICB0aGlzLnRhcmdldCA9IG5ldyBDYW52YXModGhpcy5jYW52YXNGcmFtZXMuY2FudmFzKTtcbiAgICBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8Q2FudmFzTWFuYWdlcj4oQ29udGV4dENvbXBvbmVudHMuQ2FudmFzTWFuYWdlcikuYWRkQ2FudmFzKHRoaXMudGFyZ2V0KTtcblxuICAgIC8vIGNvbnN0cnVjdCBsb2FkZXJcbiAgICBsZXQgZGVmYXVsdExvYWRlcjtcbiAgICAvLyBUT0RPOiBwbmx5XG4gICAgLy8gaWYgKHRoaXMuYXR0cmlidXRlcy5nZXRWYWx1ZShcImxvYWRlclwiKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLm5vZGVNYW5hZ2VyLm5vZGVSZWdpc3Rlci5oYXNHcm91cChcImp0aHJlZS5sb2FkZXJcIikpIHtcbiAgICAvLyAgIHZhciBsb2FkZXJOb2RlID0gKHRoaXMubm9kZU1hbmFnZXIubm9kZVJlZ2lzdGVyLmdldE9iamVjdChcImp0aHJlZS5sb2FkZXJcIiwgdGhpcy5hdHRyaWJ1dGVzLmdldFZhbHVlKFwibG9hZGVyXCIpKSBhcyBhbnkpO1xuICAgIC8vICAgaWYgKGxvYWRlck5vZGUpIGRlZmF1bHRMb2FkZXIgPSBsb2FkZXJOb2RlLmxvYWRlckhUTUw7XG4gICAgLy8gfVxuICAgIGlmICghZGVmYXVsdExvYWRlcikge1xuICAgICAgZGVmYXVsdExvYWRlciA9IHJlcXVpcmUoXCIuLi8uLi8uLi9zdGF0aWMvZGVmYXVsdExvYWRlci5odG1sXCIpO1xuICAgIH1cbiAgICB0aGlzLmNhbnZhc0ZyYW1lcy5sb2FkZXJDb250YWluZXIuaW5uZXJIVE1MID0gZGVmYXVsdExvYWRlcjtcblxuICAgIGNvbnN0IHByb2dyZXNzTG9hZGVycyA9IHRoaXMuY2FudmFzRnJhbWVzLmxvYWRlckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLngtajMtbG9hZGVyLXByb2dyZXNzXCIpO1xuICAgIEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxSZXNvdXJjZUxvYWRlcj4oQ29udGV4dENvbXBvbmVudHMuUmVzb3VyY2VMb2FkZXIpLnByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXJzID0gdGhpcy5jYW52YXNGcmFtZXMucmVzaXplRGV0ZWN0ZXIucXVlcnlTZWxlY3RvckFsbChcIi54LWozLWxvYWRlci1jb250YWluZXJcIik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbG9hZGVycy5pdGVtKGkpO1xuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSwgKCkgPT4geyByZXR1cm47IH0sIChwKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZ3Jlc3NMb2FkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSA8SFRNTERpdkVsZW1lbnQ+cHJvZ3Jlc3NMb2FkZXJzLml0ZW0oaSk7XG4gICAgICAgICAgcHJvZ3Jlc3Muc3R5bGUud2lkdGggPSBwLmNvbXBsZXRlZFJlc291cmNlIC8gcC5yZXNvdXJjZUNvdW50ICogMTAwICsgXCIlXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBEZWZhdWx0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jYW52YXNGcmFtZXMuY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBEZWZhdWx0SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzRnJhbWVzLmNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19zaXplQ2hhbmdlZCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzRnJhbWVzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuY2FudmFzRnJhbWVzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmFzTm9kZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
