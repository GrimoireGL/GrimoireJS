  import BaseConstants from "./Base/Constants";
  import BaseEEObject from "./Base/EEObject";
  import BaseEnsure from "./Base/Ensure";
  import BaseIDObject from "./Base/IDObject";
  import BaseNSDictionary from "./Base/NSDictionary";
  import BaseNSIdentity from "./Base/NSIdentity";
  import BaseNSSet from "./Base/NSSet";
  import BaseXMLHttpRequestAsync from "./Base/XMLHttpRequestAsync";
  import BaseXMLReader from "./Base/XMLReader";
  import ComponentsGrimoireComponent from "./Components/GrimoireComponent";
  import ConvertersBooleanConverter from "./Converters/BooleanConverter";
  import ConvertersStringArrayConverter from "./Converters/StringArrayConverter";
  import ConvertersStringConverter from "./Converters/StringConverter";
  import GrimoireInterface from "./GrimoireInterface";
  import InterfaceComponentInterface from "./Interface/ComponentInterface";
  import InterfaceGomlInterface from "./Interface/GomlInterface";
  import InterfaceGomlInterfaceGenerator from "./Interface/GomlInterfaceGenerator";
  import InterfaceNodeInterface from "./Interface/NodeInterface";
  import NodeAttribute from "./Node/Attribute";
  import NodeComponent from "./Node/Component";
  import NodeComponentDeclaration from "./Node/ComponentDeclaration";
  import NodeGomlLoader from "./Node/GomlLoader";
  import NodeGomlNode from "./Node/GomlNode";
  import NodeGomlParser from "./Node/GomlParser";
  import NodeNodeDeclaration from "./Node/NodeDeclaration";
  import NodeNodeUtility from "./Node/NodeUtility";
  import __INTERFACE__1 from "./Base/IHandlableError";
  import __INTERFACE__2 from "./IGrimoireInterface";
  import __INTERFACE__3 from "./IGrimoireInterfaceBase";
  import __INTERFACE__4 from "./Interface/IComponentInterface";
  import __INTERFACE__5 from "./Interface/IGomlInterface";
  import __INTERFACE__6 from "./Interface/IGomlInterfaceBase";
  import __INTERFACE__7 from "./Interface/INodeInterface";
  import __INTERFACE__8 from "./Interface/INodeInterfaceBase";
  import __INTERFACE__9 from "./Node/AttributeConverter";
  import __INTERFACE__10 from "./Node/IAttributeDeclaration";
  import __INTERFACE__11 from "./Node/ITreeInitializedInfo";

import __MAIN__ from "./main"

var __EXPOSE__ = {
  "Base": {
    "Constants": BaseConstants,
    "EEObject": BaseEEObject,
    "Ensure": BaseEnsure,
    "IDObject": BaseIDObject,
    "NSDictionary": BaseNSDictionary,
    "NSIdentity": BaseNSIdentity,
    "NSSet": BaseNSSet,
    "XMLHttpRequestAsync": BaseXMLHttpRequestAsync,
    "XMLReader": BaseXMLReader
  },
  "Components": {
    "GrimoireComponent": ComponentsGrimoireComponent
  },
  "Converters": {
    "BooleanConverter": ConvertersBooleanConverter,
    "StringArrayConverter": ConvertersStringArrayConverter,
    "StringConverter": ConvertersStringConverter
  },
  "GrimoireInterface": GrimoireInterface,
  "Interface": {
    "ComponentInterface": InterfaceComponentInterface,
    "GomlInterface": InterfaceGomlInterface,
    "GomlInterfaceGenerator": InterfaceGomlInterfaceGenerator,
    "NodeInterface": InterfaceNodeInterface
  },
  "Node": {
    "Attribute": NodeAttribute,
    "Component": NodeComponent,
    "ComponentDeclaration": NodeComponentDeclaration,
    "GomlLoader": NodeGomlLoader,
    "GomlNode": NodeGomlNode,
    "GomlParser": NodeGomlParser,
    "NodeDeclaration": NodeNodeDeclaration,
    "NodeUtility": NodeNodeUtility
  }
};

let __BASE__ = __MAIN__();

Object.assign(__BASE__|| {},__EXPOSE__);

export default __BASE__ as (typeof __BASE__ & typeof __EXPOSE__);