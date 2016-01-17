import RSMLRenderStage = require("./RSML/RSMLRenderStage");
import IndexedGeometry = require("../../Geometries/IndexedGeometry");
import BasicGeometry = require("../../Geometries/BasicGeometry");
﻿import BasicRenderer = require('../BasicRenderer');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import Program = require("../../Resources/Program/Program");
import Matrix = require("../../../Math/Matrix");
import CubeTexture = require("../../Resources/Texture/CubeTexture");
class SkyBoxStage extends RSMLRenderStage
{
    constructor(renderer: BasicRenderer)
    {
        super(renderer,require("./BuiltIn/Skybox.html"));
    }
}
export = SkyBoxStage;
