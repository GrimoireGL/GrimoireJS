interface IFunctionLikeInterface {
    (...args: any[]): any;
}

class InterfaceMerger {
    public static merge<T extends IFunctionLikeInterface>(interfaces: T[], exposedMethods: string[]): T {
        const fBase = (...args) => {
            interfaces.forEach(t => t(...args));
        };
        const oBase = {};
        exposedMethods.forEach(m => {
            oBase[m] = (...args) => {
                interfaces.forEach(t => t[m](...args));
            };
        });
        return <T>Object.assign(fBase, oBase);
    }
}

export default InterfaceMerger;
