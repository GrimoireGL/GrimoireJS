
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
export const EVENT_GOML_WILL_ADD = "gomlWillAdd";
export const EVENT_MESSAGE_ERROR = "messageerror";
export const EVENT_GOML_DID_ADDED = "gomlDidAdded";
export const EVENT_GOML_WILL_REMOVE = "gomlWillRemove";
export const EVENT_GOML_DID_REMOVE = "gomlDidRemove";
export const EVENT_ROOT_NODE_WILL_ADD = "root-node-added";
export const EVENT_ROOT_NODE_DID_ADDED = "root-node-added";

export const EVENT_ROOT_NODE_ADDED = "root-node-added"; // deprecated

export default {
  DEFAULT_NAMESPACE,
  X_GR_ID,
  BASE_NODE_NAME,
  EVENT_GOML_WILL_ADD,
};
