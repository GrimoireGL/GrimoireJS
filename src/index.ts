  import BaseAttributeManager from "./Base/AttributeManager";
  import BaseConstants from "./Base/Constants";
  import BaseEEObject from "./Base/EEObject";
  import BaseEnsure from "./Base/Ensure";
  import BaseIDObject from "./Base/IDObject";
  import BaseNSDictionary from "./Base/NSDictionary";
  import BaseNSIdentity from "./Base/NSIdentity";
  import BaseNSSet from "./Base/NSSet";
  import BaseUtility from "./Base/Utility";
  import BaseXMLHttpRequestAsync from "./Base/XMLHttpRequestAsync";
  import BaseXMLReader from "./Base/XMLReader";
  import ComponentsGrimoireComponent from "./Components/GrimoireComponent";
  import ConvertersBooleanConverter from "./Converters/BooleanConverter";
  import ConvertersStringArrayConverter from "./Converters/StringArrayConverter";
  import ConvertersStringConverter from "./Converters/StringConverter";
  import GrimoireInterface from "./GrimoireInterface";
  import InterfaceGomlInterface from "./Interface/GomlInterface";
  import InterfaceNodeInterface from "./Interface/NodeInterface";
  import NodeAttribute from "./Node/Attribute";
  import NodeComponent from "./Node/Component";
  import NodeComponentDeclaration from "./Node/ComponentDeclaration";
  import NodeGomlLoader from "./Node/GomlLoader";
  import NodeGomlNode from "./Node/GomlNode";
  import NodeGomlParser from "./Node/GomlParser";
  import NodeNodeDeclaration from "./Node/NodeDeclaration";
  import NodeNodeUtility from "./Node/NodeUtility";
  import __INTERFACE__1 from "./IGrimoireInterface";
  import __INTERFACE__2 from "./IGrimoireInterfaceBase";
  import __INTERFACE__3 from "./Interface/IGomlInterface";
  import __INTERFACE__4 from "./Node/AttributeConverter";
  import __INTERFACE__5 from "./Node/IAttributeDeclaration";
  import __INTERFACE__6 from "./Node/ITreeInitializedInfo";

var __VERSION__ = "0.14.0beta0";
var __NAME__ = "grimoirejs";

import __MAIN__ from "./main"

var __EXPOSE__ = {
  "Base": {
    "AttributeManager": BaseAttributeManager,
    "Constants": BaseConstants,
    "EEObject": BaseEEObject,
    "Ensure": BaseEnsure,
    "IDObject": BaseIDObject,
    "NSDictionary": BaseNSDictionary,
    "NSIdentity": BaseNSIdentity,
    "NSSet": BaseNSSet,
    "Utility": BaseUtility,
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
    "GomlInterface": InterfaceGomlInterface,
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

Object.assign(__EXPOSE__,{
    __VERSION__:__VERSION__,
    __NAME__:__NAME__
});
Object.assign(__BASE__|| {},__EXPOSE__);

window["GrimoireJS"]["__VERSION__"]=__VERSION__;


export default __BASE__;
