React = require 'react'
Colors = require './colors/definition'
SceneTree = require './debugger-scene-tree'
class DebuggerSceneContent extends React.Component
  constructor:(props)->
    super props
    @state={};
    if props.api?
      @state.api = props.api;
      @state.api.sceneContentPanel = this;
      @state.api.updateHandler = @updateStructure;

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


module.exports = DebuggerSceneContent;
