import IHandlableError from "./IHandlableError";
class ErrorHandler {
    public static handle(notifier: NodeJS.EventEmitter, eventName: string, error: IHandlableError): void {
        error.handled = false;
        const listeners = notifier.listeners(eventName);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](error);
            if (error.handled) {
             return;
            }
        }
        throw error;
    }
}

export default ErrorHandler;
