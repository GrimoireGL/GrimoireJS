class GrimoireInitializer {
    public static async initialize(): Promise<void> {
        GrimoireInitializer._copyGLConstants();
        await GrimoireInitializer._waitForDOMLoading();
    }

    private static _copyGLConstants(): void {
        if (WebGLRenderingContext.ONE) {
            return;
        }
        for (let propName in WebGLRenderingContext.prototype) {
            if (/^[A-Z]/.test(propName)) {
                const property = WebGLRenderingContext.prototype[propName];
                WebGLRenderingContext[propName] = property;
            }
        }
    }

    private static async _waitForDOMLoading(): Promise<void> {
        return new Promise<void>((resolve) => {
            window.addEventListener("DOMContentLoaded", () => {
                resolve();
            });
        });
    }
}

GrimoireInitializer.initialize();
