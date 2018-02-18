import test from "ava";
import { spy } from "sinon";
import TemplateComponent from "../../src/Component/TemplateComponent";
import {StandardAttribute} from "../../src/Core/Attribute";
import Component from "../../src/Core/Component";
import Constants from "../../src/Core/Constants";
import Environment from "../../src/Core/Environment";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";
import TestUtil from "../TestUtil";

TestEnvManager.init();
TestEnvManager.mockSetup();
TestEnvManager.mock("template.goml", "<scene/>");

test.beforeEach(async() => {
    GrimoireInterface.debug = false;
    GrimoireInterface.clear();
    TestEnvManager.loadPage("<html></html>");
    GrimoireInterface.registerNode("goml");
    GrimoireInterface.registerNode("scenes");
    GrimoireInterface.registerNode("scene");
    GrimoireInterface.registerComponent({
        componentName: "Test",
        attributes: {},
        valueTest: "Test",
    });
    GrimoireInterface.registerComponent({
        componentName: "Test2",
        attributes: {},
        valueTest: "Test2",
    });
    await GrimoireInterface.resolvePlugins();
});

test("template component inflate correctly in awake", t => {
    const root = GomlLoader.loadFromGOML('<template goml="<goml/>"/>');
    t.truthy(root.children.length === 1);
    t.truthy(root.children[0].declaration.name.fqn === "grimoirejs.goml");
});

test("template component inflate correctly in awake", async t => {
    const templateNodeDec = GrimoireInterface.nodeDeclarations.get("template");
    const node = new GomlNode(templateNodeDec);
    const template = node.getComponent(TemplateComponent);
    template.setAttribute(TemplateComponent.attributes.src, "template.goml");
    await template.inflate();
    t.truthy(node.children.length === 1);
    t.truthy(node.children[0].declaration.name.fqn === "grimoirejs.scene");
});
