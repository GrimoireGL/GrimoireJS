React = require 'react'
Colors = require './colors/definition'
SceneTree = require './debugger-scene-tree'
class DebuggerSceneContent extends React.Component
  constructor:(props)->
    super props
    debugger;
    @state={};
    @state.api = new DebuggerSceneContentAPI(this,'(Root)');
    @state.api.updateHandler = @updateStructure;
    window.j3d.scenes.scenes[props.sceneName].api = @state.api;

  render:->
    <div>
      <div style={styles.treeContainer}>
        <SceneTree api={@state.api}/>
      </div>
      <div style={styles.infoContainer}>
      </div>
    </div>

  updateStructure:=>
    @setState({api:@state.api})

styles =
  treeContainer:
    width:250;
    float:'left';
    height:300;
  infoContainer:
    background:Colors.main.n.default;
    height:300;
    marginLeft:300;

class DebuggerSceneContentAPI
  constructor:(panel,name)->
    @sceneContentPanel = panel;
    @children =[]
    @name = name

  setChild:(childName)->
    @children.push(new DebuggerSceneContentAPI(@sceneContentPanel,childName))
    if updateHandler?
      updateHandler();


module.exports = DebuggerSceneContent;
