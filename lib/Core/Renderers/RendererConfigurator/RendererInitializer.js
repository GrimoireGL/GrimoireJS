/**
 * Provides initialization for renderer from xml configuration file.
 */
class RenderPathInitializer {
    static initializeRenderer(renderer, configure) {
        const xmlDocument = (new DOMParser()).parseFromString(configure, "text/xml");
        const rootElement = xmlDocument.getElementsByName("renderer-path");
        if (rootElement.length !== 1) {
            throw new Error("Invalid count of renderer-path elements. The count of renderer-path element are allowed only 1.");
        }
        RenderPathInitializer._parseRoot(renderer, rootElement.item(0));
    }
    static _parseRoot(renderer, rootElement) {
        const texturesElement = rootElement.getElementsByTagName("textures");
        RenderPathInitializer._parseTextures(renderer, texturesElement.item(0));
    }
    static _parseTextures(renderer, texturesNode) {
        const textureNodes = texturesNode.childNodes;
        for (let i = 0; i < textureNodes.length; i++) {
            const textureNode = textureNodes.item(i);
            const generaterName = textureNode.nodeName;
            const textureName = textureNode.attributes.getNamedItem("name");
            if (!textureName) {
                throw new Error("Render buffer name must be specified");
            }
            const bufferGenerationInfo = {
                generater: generaterName,
                name: textureName.value
            };
            for (let j = 0; j < textureNode.attributes.length; j++) {
                const attribute = textureNode.attributes.item(j);
                if (attribute.name === "name" || attribute.name === "generater") {
                    continue;
                }
                bufferGenerationInfo[attribute.name] = attribute.value;
            }
            renderer.bufferSet.appendBuffer(bufferGenerationInfo);
        }
    }
}
export default RenderPathInitializer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVuZGVyZXJzL1JlbmRlcmVyQ29uZmlndXJhdG9yL1JlbmRlcmVySW5pdGlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7O0dBRUc7QUFDSDtJQUVFLE9BQWMsa0JBQWtCLENBQUMsUUFBdUIsRUFBRSxTQUFpQjtRQUN6RSxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpR0FBaUcsQ0FBQyxDQUFDO1FBQ3JILENBQUM7UUFDRCxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsT0FBZSxVQUFVLENBQUMsUUFBdUIsRUFBRSxXQUFvQjtRQUNyRSxNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckUscUJBQXFCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELE9BQWUsY0FBYyxDQUFDLFFBQXVCLEVBQUUsWUFBcUI7UUFDMUUsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDM0MsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELE1BQU0sb0JBQW9CLEdBQUc7Z0JBQzNCLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixJQUFJLEVBQUUsV0FBVyxDQUFDLEtBQUs7YUFDeEIsQ0FBQztZQUNGLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkQsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsUUFBUSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0Qsb0JBQW9CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDekQsQ0FBQztZQUNELFFBQVEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDeEQsQ0FBQztJQUNILENBQUM7QUFFSCxDQUFDO0FBRUQsZUFBZSxxQkFBcUIsQ0FBQyIsImZpbGUiOiJDb3JlL1JlbmRlcmVycy9SZW5kZXJlckNvbmZpZ3VyYXRvci9SZW5kZXJlckluaXRpYWxpemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2ljUmVuZGVyZXIgZnJvbSBcIi4uL0Jhc2ljUmVuZGVyZXJcIjtcbi8qKlxuICogUHJvdmlkZXMgaW5pdGlhbGl6YXRpb24gZm9yIHJlbmRlcmVyIGZyb20geG1sIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAqL1xuY2xhc3MgUmVuZGVyUGF0aEluaXRpYWxpemVyIHtcblxuICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemVSZW5kZXJlcihyZW5kZXJlcjogQmFzaWNSZW5kZXJlciwgY29uZmlndXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB4bWxEb2N1bWVudCA9IChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyhjb25maWd1cmUsIFwidGV4dC94bWxcIik7XG4gICAgY29uc3Qgcm9vdEVsZW1lbnQgPSB4bWxEb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcInJlbmRlcmVyLXBhdGhcIik7XG4gICAgaWYgKHJvb3RFbGVtZW50Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb3VudCBvZiByZW5kZXJlci1wYXRoIGVsZW1lbnRzLiBUaGUgY291bnQgb2YgcmVuZGVyZXItcGF0aCBlbGVtZW50IGFyZSBhbGxvd2VkIG9ubHkgMS5cIik7XG4gICAgfVxuICAgIFJlbmRlclBhdGhJbml0aWFsaXplci5fcGFyc2VSb290KHJlbmRlcmVyLCByb290RWxlbWVudC5pdGVtKDApKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9wYXJzZVJvb3QocmVuZGVyZXI6IEJhc2ljUmVuZGVyZXIsIHJvb3RFbGVtZW50OiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dHVyZXNFbGVtZW50ID0gcm9vdEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0dXJlc1wiKTtcbiAgICBSZW5kZXJQYXRoSW5pdGlhbGl6ZXIuX3BhcnNlVGV4dHVyZXMocmVuZGVyZXIsIHRleHR1cmVzRWxlbWVudC5pdGVtKDApKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9wYXJzZVRleHR1cmVzKHJlbmRlcmVyOiBCYXNpY1JlbmRlcmVyLCB0ZXh0dXJlc05vZGU6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0dXJlTm9kZXMgPSB0ZXh0dXJlc05vZGUuY2hpbGROb2RlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGV4dHVyZU5vZGUgPSB0ZXh0dXJlTm9kZXMuaXRlbShpKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlck5hbWUgPSB0ZXh0dXJlTm9kZS5ub2RlTmFtZTtcbiAgICAgIGNvbnN0IHRleHR1cmVOYW1lID0gdGV4dHVyZU5vZGUuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJuYW1lXCIpO1xuICAgICAgaWYgKCF0ZXh0dXJlTmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZW5kZXIgYnVmZmVyIG5hbWUgbXVzdCBiZSBzcGVjaWZpZWRcIik7XG4gICAgICB9XG4gICAgICBjb25zdCBidWZmZXJHZW5lcmF0aW9uSW5mbyA9IHtcbiAgICAgICAgZ2VuZXJhdGVyOiBnZW5lcmF0ZXJOYW1lLFxuICAgICAgICBuYW1lOiB0ZXh0dXJlTmFtZS52YWx1ZVxuICAgICAgfTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGV4dHVyZU5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSB0ZXh0dXJlTm9kZS5hdHRyaWJ1dGVzLml0ZW0oaik7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUubmFtZSA9PT0gXCJuYW1lXCIgfHwgYXR0cmlidXRlLm5hbWUgPT09IFwiZ2VuZXJhdGVyXCIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBidWZmZXJHZW5lcmF0aW9uSW5mb1thdHRyaWJ1dGUubmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICB9XG4gICAgICByZW5kZXJlci5idWZmZXJTZXQuYXBwZW5kQnVmZmVyKGJ1ZmZlckdlbmVyYXRpb25JbmZvKTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJQYXRoSW5pdGlhbGl6ZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=