class GLEnumParser {
    public static parseBlendFunc(gl: WebGLRenderingContext, val: string): number {
        val = val.toUpperCase();
        switch (val) {
            case "ZERO":
            case "0":
                return gl.ZERO;
            case "ONE":
            case "1":
                return gl.ONE;
            case "SRC_COLOR":
                return gl.SRC_COLOR;
            case "ONE_MINUS_SRC_COLOR":
                return gl.ONE_MINUS_SRC_COLOR;
            case "SRC_ALPHA":
                return gl.SRC_ALPHA;
            case "ONE_MINUS_SRC_ALPHA":
                return gl.ONE_MINUS_SRC_ALPHA;
            case "DST_ALPHA":
                return gl.DST_ALPHA;
            case "ONE_MINUS_DST_ALPHA":
                return gl.ONE_MINUS_DST_ALPHA;
            case "DST_COLOR":
                return gl.DST_COLOR;
            case "ONE_MINUS_DST_COLOR":
                return gl.ONE_MINUS_DST_COLOR;
            case "SRC_ALPHA_SATURATE":
                return gl.SRC_ALPHA_SATURATE;
            default:
                console.error("Unknown blend func constant!");
                return gl.ONE;
        }
    }

    public static parseDepthFunc(gl: WebGLRenderingContext, val: string): number {
        val = val.toUpperCase();
        switch (val) {
            case "NEVER":
                return gl.NEVER;
            case "LESS":
                return gl.LESS;
            case "LEQUAL":
                return gl.LEQUAL;
            case "GREATER":
                return gl.GREATER;
            case "NOTEQUAL":
                return gl.NOTEQUAL;
            case "GEQUAL":
                return gl.GEQUAL;
            case "ALWAYS":
                return gl.ALWAYS;
            default:
                console.error("Unknown depth func constant!");
                return gl.LESS;
        }
    }

    public static parseCullMode(gl: WebGLRenderingContext, val: string): number {
        val = val.toUpperCase();
        switch (val) {
            case "BACK":
                return gl.BACK;
            case "FRONT":
                return gl.FRONT;
            case "FRONT_AND_BACK":
                return gl.FRONT_AND_BACK;
            default:
                console.error("Unknown cull mode constant!");
                return gl.BACK;
        }
    }
}
export = GLEnumParser;
