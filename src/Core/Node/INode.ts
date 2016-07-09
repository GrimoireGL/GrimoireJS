interface INode {
    children: INode[];
    parent: INode;

    sendMessage(name: string, ...args: any[]): void;
    broadcastMessage(name: string, ...args: any[]): void;
}
