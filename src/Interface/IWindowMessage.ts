/**
 * Interface for messages used in window.postMessage.
 */
export default interface IWindowMessage {
    $source: "grimoirejs";
    $messageType: string;
}
