import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
    get TextureBuffers() {
        return [
            {
                name: "depth",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "gbuffer.primary",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "light.diffuse",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "light.specular",
                generater: "rendererfit",
                layout: "RGB",
                format: "UBYTE"
            },
            {
                name: "hitarea",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "main",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            },
            {
                name: "output",
                generater: "rendererfit",
                layout: "RGBA",
                format: "UBYTE"
            }
        ];
    }
    getStageChain(target) {
        return [
            {
                buffers: {
                    OUT: "hitarea"
                },
                stage: "jthree.hitarea"
            },
            {
                buffers: {
                    DEPTH: "depth",
                    PRIMARY: "gbuffer.primary"
                },
                stage: "jthree.basic.gbuffer"
            },
            {
                buffers: {
                    DEPTH: "depth",
                    PRIMARY: "gbuffer.primary",
                    DIFFUSE: "light.diffuse",
                    SPECULAR: "light.specular"
                },
                stage: "jthree.basic.light"
            },
            {
                buffers: {
                    GBUFFER: "gbuffer.primary",
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "output"
                },
                stage: "jthree.basic.foward"
            },
            {
                buffers: {
                    INPUT: "output",
                    OUT: "default"
                },
                stage: "jthree.basic.fxaa",
                variables: {
                    reduceMin: 0.05,
                    reduceMul: 0.1,
                    spanMax: 3
                }
            }];
        // },
        // {
        //   buffers: {
        //     MAIN: "main",
        //     PRIMARY: "gbuffer.primary",
        //     OUT: "output"
        //   },
        //   stage: "jthree.basic.fogExp2",
        //   variables: {
        //     density: 2.0,
        //   }
        // },
        // {
        //   buffers: {
        //     INPUT: "output",
        //     OUT: "default"
        //   },
        //   stage: "jthree.basic.fxaa",
        //   variables: {
        //     reduceMin: 0.05,
        //     reduceMul: 0.1,
        //     spanMax: 3
        //   }
        // }];
    }
}
export default BasicRendererConfigurator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVuZGVyZXJzL1JlbmRlcmVyQ29uZmlndXJhdG9yL0Jhc2ljUmVuZGVyZXJDb25maWd1cmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BR08sZ0JBQWdCLE1BQU0sNEJBQTRCO0FBQ3pELHdDQUF3QyxnQkFBZ0I7SUFDdEQsSUFBVyxjQUFjO1FBQ3ZCLE1BQU0sQ0FBQztZQUNMO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsT0FBTzthQUNoQjtZQUNEO2dCQUNFLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsT0FBTzthQUNoQjtZQUNEO2dCQUNFLElBQUksRUFBRSxlQUFlO2dCQUNyQixTQUFTLEVBQUUsYUFBYTtnQkFDeEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixTQUFTLEVBQUUsYUFBYTtnQkFDeEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsU0FBUztnQkFDZixTQUFTLEVBQUUsYUFBYTtnQkFDeEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixTQUFTLEVBQUUsYUFBYTtnQkFDeEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxTQUFTLEVBQUUsYUFBYTtnQkFDeEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE9BQU87YUFDaEI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVNLGFBQWEsQ0FBQyxNQUFxQjtRQUN4QyxNQUFNLENBQUM7WUFDTDtnQkFDRSxPQUFPLEVBQ1A7b0JBQ0UsR0FBRyxFQUFFLFNBQVM7aUJBQ2Y7Z0JBQ0QsS0FBSyxFQUFFLGdCQUFnQjthQUN4QjtZQUNEO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxLQUFLLEVBQUUsT0FBTztvQkFDZCxPQUFPLEVBQUUsaUJBQWlCO2lCQUMzQjtnQkFDRCxLQUFLLEVBQUUsc0JBQXNCO2FBQzlCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLEtBQUssRUFBRSxPQUFPO29CQUNkLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLE9BQU8sRUFBRSxlQUFlO29CQUN4QixRQUFRLEVBQUUsZ0JBQWdCO2lCQUMzQjtnQkFDRCxLQUFLLEVBQUUsb0JBQW9CO2FBQzVCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLE1BQU0sRUFBRSxlQUFlO29CQUN2QixNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixHQUFHLEVBQUUsUUFBUTtpQkFDZDtnQkFDRCxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLEtBQUssRUFBRSxRQUFRO29CQUNmLEdBQUcsRUFBRSxTQUFTO2lCQUNmO2dCQUNELEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLFNBQVMsRUFBRTtvQkFDVCxTQUFTLEVBQUUsSUFBSTtvQkFDZixTQUFTLEVBQUUsR0FBRztvQkFDZCxPQUFPLEVBQUUsQ0FBQztpQkFDWDthQUNGLENBQUMsQ0FBQztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osZUFBZTtRQUNmLG9CQUFvQjtRQUNwQixrQ0FBa0M7UUFDbEMsb0JBQW9CO1FBQ3BCLE9BQU87UUFDUCxtQ0FBbUM7UUFDbkMsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQixNQUFNO1FBQ04sS0FBSztRQUNMLElBQUk7UUFDSixlQUFlO1FBQ2YsdUJBQXVCO1FBQ3ZCLHFCQUFxQjtRQUNyQixPQUFPO1FBQ1AsZ0NBQWdDO1FBQ2hDLGlCQUFpQjtRQUNqQix1QkFBdUI7UUFDdkIsc0JBQXNCO1FBQ3RCLGlCQUFpQjtRQUNqQixNQUFNO1FBQ04sTUFBTTtJQUNSLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSx5QkFBeUIsQ0FBQyIsImZpbGUiOiJDb3JlL1JlbmRlcmVycy9SZW5kZXJlckNvbmZpZ3VyYXRvci9CYXNpY1JlbmRlcmVyQ29uZmlndXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlQ2hhaW5UZW1wbGF0ZSBmcm9tIFwiLi4vU3RhZ2VDaGFpblRlbXBsYXRlXCI7XG7vu79pbXBvcnQgR2VuZXJhdGVySW5mbyBmcm9tIFwiLi4vVGV4dHVyZUdlbmVyYXRlcnMvR2VuZXJhdGVySW5mb0NodW5rXCI7XG5pbXBvcnQgQmFzaWNSZW5kZXJlciBmcm9tIFwiLi4vQmFzaWNSZW5kZXJlclwiO1xuaW1wb3J0IENvbmZpZ3VyYXRvckJhc2UgZnJvbSBcIi4vUmVuZGVyZXJDb25maWd1cmF0b3JCYXNlXCI7XG5jbGFzcyBCYXNpY1JlbmRlcmVyQ29uZmlndXJhdG9yIGV4dGVuZHMgQ29uZmlndXJhdG9yQmFzZSB7XG4gIHB1YmxpYyBnZXQgVGV4dHVyZUJ1ZmZlcnMoKTogR2VuZXJhdGVySW5mb1tdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBuYW1lOiBcImRlcHRoXCIsXG4gICAgICAgIGdlbmVyYXRlcjogXCJyZW5kZXJlcmZpdFwiLFxuICAgICAgICBsYXlvdXQ6IFwiUkdCXCIsXG4gICAgICAgIGZvcm1hdDogXCJVQllURVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcImdidWZmZXIucHJpbWFyeVwiLFxuICAgICAgICBnZW5lcmF0ZXI6IFwicmVuZGVyZXJmaXRcIixcbiAgICAgICAgbGF5b3V0OiBcIlJHQkFcIixcbiAgICAgICAgZm9ybWF0OiBcIlVCWVRFXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwibGlnaHQuZGlmZnVzZVwiLFxuICAgICAgICBnZW5lcmF0ZXI6IFwicmVuZGVyZXJmaXRcIixcbiAgICAgICAgbGF5b3V0OiBcIlJHQlwiLFxuICAgICAgICBmb3JtYXQ6IFwiVUJZVEVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJsaWdodC5zcGVjdWxhclwiLFxuICAgICAgICBnZW5lcmF0ZXI6IFwicmVuZGVyZXJmaXRcIixcbiAgICAgICAgbGF5b3V0OiBcIlJHQlwiLFxuICAgICAgICBmb3JtYXQ6IFwiVUJZVEVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJoaXRhcmVhXCIsXG4gICAgICAgIGdlbmVyYXRlcjogXCJyZW5kZXJlcmZpdFwiLFxuICAgICAgICBsYXlvdXQ6IFwiUkdCQVwiLFxuICAgICAgICBmb3JtYXQ6IFwiVUJZVEVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJtYWluXCIsXG4gICAgICAgIGdlbmVyYXRlcjogXCJyZW5kZXJlcmZpdFwiLFxuICAgICAgICBsYXlvdXQ6IFwiUkdCQVwiLFxuICAgICAgICBmb3JtYXQ6IFwiVUJZVEVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJvdXRwdXRcIixcbiAgICAgICAgZ2VuZXJhdGVyOiBcInJlbmRlcmVyZml0XCIsXG4gICAgICAgIGxheW91dDogXCJSR0JBXCIsXG4gICAgICAgIGZvcm1hdDogXCJVQllURVwiXG4gICAgICB9XG4gICAgXTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGFnZUNoYWluKHRhcmdldDogQmFzaWNSZW5kZXJlcik6IFN0YWdlQ2hhaW5UZW1wbGF0ZVtdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBidWZmZXJzOlxuICAgICAgICB7XG4gICAgICAgICAgT1VUOiBcImhpdGFyZWFcIlxuICAgICAgICB9LFxuICAgICAgICBzdGFnZTogXCJqdGhyZWUuaGl0YXJlYVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBidWZmZXJzOiB7XG4gICAgICAgICAgREVQVEg6IFwiZGVwdGhcIixcbiAgICAgICAgICBQUklNQVJZOiBcImdidWZmZXIucHJpbWFyeVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0YWdlOiBcImp0aHJlZS5iYXNpYy5nYnVmZmVyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJ1ZmZlcnM6IHtcbiAgICAgICAgICBERVBUSDogXCJkZXB0aFwiLFxuICAgICAgICAgIFBSSU1BUlk6IFwiZ2J1ZmZlci5wcmltYXJ5XCIsXG4gICAgICAgICAgRElGRlVTRTogXCJsaWdodC5kaWZmdXNlXCIsXG4gICAgICAgICAgU1BFQ1VMQVI6IFwibGlnaHQuc3BlY3VsYXJcIlxuICAgICAgICB9LFxuICAgICAgICBzdGFnZTogXCJqdGhyZWUuYmFzaWMubGlnaHRcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYnVmZmVyczoge1xuICAgICAgICAgIEdCVUZGRVI6IFwiZ2J1ZmZlci5wcmltYXJ5XCIsXG4gICAgICAgICAgRExJR0hUOiBcImxpZ2h0LmRpZmZ1c2VcIixcbiAgICAgICAgICBTTElHSFQ6IFwibGlnaHQuc3BlY3VsYXJcIixcbiAgICAgICAgICBPVVQ6IFwib3V0cHV0XCJcbiAgICAgICAgfSxcbiAgICAgICAgc3RhZ2U6IFwianRocmVlLmJhc2ljLmZvd2FyZFwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBidWZmZXJzOiB7XG4gICAgICAgICAgSU5QVVQ6IFwib3V0cHV0XCIsXG4gICAgICAgICAgT1VUOiBcImRlZmF1bHRcIlxuICAgICAgICB9LFxuICAgICAgICBzdGFnZTogXCJqdGhyZWUuYmFzaWMuZnhhYVwiLFxuICAgICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgICByZWR1Y2VNaW46IDAuMDUsXG4gICAgICAgICAgcmVkdWNlTXVsOiAwLjEsXG4gICAgICAgICAgc3Bhbk1heDogM1xuICAgICAgICB9XG4gICAgICB9XTtcbiAgICAvLyB9LFxuICAgIC8vIHtcbiAgICAvLyAgIGJ1ZmZlcnM6IHtcbiAgICAvLyAgICAgTUFJTjogXCJtYWluXCIsXG4gICAgLy8gICAgIFBSSU1BUlk6IFwiZ2J1ZmZlci5wcmltYXJ5XCIsXG4gICAgLy8gICAgIE9VVDogXCJvdXRwdXRcIlxuICAgIC8vICAgfSxcbiAgICAvLyAgIHN0YWdlOiBcImp0aHJlZS5iYXNpYy5mb2dFeHAyXCIsXG4gICAgLy8gICB2YXJpYWJsZXM6IHtcbiAgICAvLyAgICAgZGVuc2l0eTogMi4wLFxuICAgIC8vICAgfVxuICAgIC8vIH0sXG4gICAgLy8ge1xuICAgIC8vICAgYnVmZmVyczoge1xuICAgIC8vICAgICBJTlBVVDogXCJvdXRwdXRcIixcbiAgICAvLyAgICAgT1VUOiBcImRlZmF1bHRcIlxuICAgIC8vICAgfSxcbiAgICAvLyAgIHN0YWdlOiBcImp0aHJlZS5iYXNpYy5meGFhXCIsXG4gICAgLy8gICB2YXJpYWJsZXM6IHtcbiAgICAvLyAgICAgcmVkdWNlTWluOiAwLjA1LFxuICAgIC8vICAgICByZWR1Y2VNdWw6IDAuMSxcbiAgICAvLyAgICAgc3Bhbk1heDogM1xuICAgIC8vICAgfVxuICAgIC8vIH1dO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2ljUmVuZGVyZXJDb25maWd1cmF0b3I7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
