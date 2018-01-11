import MessageException from "../Tool/MessageException";
import GomlNode from "./GomlNode";

type GomlNodeAddEventArgs = {
  ownerScriptTag: HTMLScriptElement,
  rootNode: GomlNode,
};

/**
 * default namespace in core module
 */
export const DEFAULT_NAMESPACE = "grimoirejs";

/**
 * identify key for node.
 */
export const X_GR_ID = "x-gr-id";

export const X_ROOT_NODE_ID = "x-rootNodeId";

/**
 * base node name.
 */
export const BASE_NODE_NAME = DEFAULT_NAMESPACE + ".grimoire-node-base";

/**
 * constant for emitting event.
 * added goml in ducument.
 */
export const EVENT_SOURCE = "grimoirejs";
export const EVENT_NOTIFY_LIBRARY_LOADING = "library-loading";
export const EVENT_GOML_WILL_ADD = "gomlWillAdd" as EventID<Element>;
export const EVENT_GOML_DID_ADDED = "gomlDidAdded" as EventID<Element>;
export const EVENT_GOML_WILL_REMOVE = "gomlWillRemove" as EventID<Element>;
export const EVENT_GOML_DID_REMOVE = "gomlDidRemove" as EventID<Element>;
export const EVENT_MESSAGE_ERROR = "messageerror" as EventID<MessageException>;
export const EVENT_TREE_WILL_ADD = "treeWillAdd" as EventID<GomlNodeAddEventArgs>;
export const EVENT_TREE_DID_ADDED = "root-node-added" as EventID<GomlNodeAddEventArgs>;

export default {
  DEFAULT_NAMESPACE,
  X_GR_ID,
  BASE_NODE_NAME,
  EVENT_GOML_WILL_ADD,
};

/**
 * Interface for EventEmitter
 */
export interface IEvent<T> { }

export type EventID<T> = string & IEvent<T>;
