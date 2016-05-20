class NamespaceUtil {
    public static generateFQN(ns: string, name: string): string {
     return `{${ns}}${name}`;
    }
}

export default NamespaceUtil;
