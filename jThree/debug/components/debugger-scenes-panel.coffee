React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
Tab = require 'react-simpletabs'
SceneContent = require './debugger-scene-content'
class DebuggerScenesPanel extends React.Component
  constructor:(props)->
    super props
    @state ={}
    @state.scenes = DebuggerScenesAPI.scenes;
    DebuggerScenesAPI.scenesPanel = this;

  render:->
    debugger;
    tabs = [];
    for k,v of @state.scenes
      tabs.push(@generateTab(k,v))
    <Tab>
      {tabs}
    </Tab>

  generateTab:(k,v)->
    if v.isNoScene
     <Tab.Panel title={k} key={k}>
       <div style={styles.noSceneText}>
         There is no scene here.
       </div>
     </Tab.Panel>
    else
      console.log(k);
     <Tab.Panel title={k} key={k}>
       <SceneContent sceneName={k}/>
     </Tab.Panel>

class DebuggerScenesAPI
  #reference for DebuggerScenesPanel
  @scenesPanel

  @scenes={
    "NoScene":{
      isNoScene:false
    }
  }

  @setScene:(sceneName)->
    if DebuggerScenesAPI.scenes["NoScene"]?
      delete DebuggerScenesAPI.scenes["NoScene"];
    DebuggerScenesAPI.scenes[sceneName] = {};
    DebuggerScenesAPI.scenesPanel.setState({scenes:DebuggerScenesAPI.scenes})


styles =
  noSceneText:
    textAlign:"center"
    fontSize:"xx-large"

window.j3d.scenes = DebuggerScenesAPI;
module.exports = DebuggerScenesPanel;
