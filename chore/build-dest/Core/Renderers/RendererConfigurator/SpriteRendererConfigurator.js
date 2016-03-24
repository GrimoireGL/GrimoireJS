import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
    get TextureBuffers() {
        return [];
    }
    getStageChain(target) {
        return [
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "default"
                },
                stage: "jthree.basic.foward"
            }];
    }
}
export default BasicRendererConfigurator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVuZGVyZXJzL1JlbmRlcmVyQ29uZmlndXJhdG9yL1Nwcml0ZVJlbmRlcmVyQ29uZmlndXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUdPLGdCQUFnQixNQUFNLDRCQUE0QjtBQUN6RCx3Q0FBd0MsZ0JBQWdCO0lBQ3RELElBQVcsY0FBYztRQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVNLGFBQWEsQ0FBQyxNQUFxQjtRQUN4QyxNQUFNLENBQUM7WUFDTDtnQkFDRSxPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFLGVBQWU7b0JBQ3ZCLE1BQU0sRUFBRSxnQkFBZ0I7b0JBQ3hCLEdBQUcsRUFBRSxTQUFTO2lCQUNmO2dCQUNELEtBQUssRUFBRSxxQkFBcUI7YUFDN0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLHlCQUF5QixDQUFDIiwiZmlsZSI6IkNvcmUvUmVuZGVyZXJzL1JlbmRlcmVyQ29uZmlndXJhdG9yL1Nwcml0ZVJlbmRlcmVyQ29uZmlndXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlQ2hhaW5UZW1wbGF0ZSBmcm9tIFwiLi4vU3RhZ2VDaGFpblRlbXBsYXRlXCI7XG5pbXBvcnQgR2VuZXJhdGVySW5mbyBmcm9tIFwiLi4vVGV4dHVyZUdlbmVyYXRlcnMvR2VuZXJhdGVySW5mb0NodW5rXCI7XG5pbXBvcnQgQmFzaWNSZW5kZXJlciBmcm9tIFwiLi4vQmFzaWNSZW5kZXJlclwiO1xuaW1wb3J0IENvbmZpZ3VyYXRvckJhc2UgZnJvbSBcIi4vUmVuZGVyZXJDb25maWd1cmF0b3JCYXNlXCI7XG5jbGFzcyBCYXNpY1JlbmRlcmVyQ29uZmlndXJhdG9yIGV4dGVuZHMgQ29uZmlndXJhdG9yQmFzZSB7XG4gIHB1YmxpYyBnZXQgVGV4dHVyZUJ1ZmZlcnMoKTogR2VuZXJhdGVySW5mb1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhZ2VDaGFpbih0YXJnZXQ6IEJhc2ljUmVuZGVyZXIpOiBTdGFnZUNoYWluVGVtcGxhdGVbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgYnVmZmVyczoge1xuICAgICAgICAgIERMSUdIVDogXCJsaWdodC5kaWZmdXNlXCIsXG4gICAgICAgICAgU0xJR0hUOiBcImxpZ2h0LnNwZWN1bGFyXCIsXG4gICAgICAgICAgT1VUOiBcImRlZmF1bHRcIlxuICAgICAgICB9LFxuICAgICAgICBzdGFnZTogXCJqdGhyZWUuYmFzaWMuZm93YXJkXCJcbiAgICAgIH1dO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2ljUmVuZGVyZXJDb25maWd1cmF0b3I7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
