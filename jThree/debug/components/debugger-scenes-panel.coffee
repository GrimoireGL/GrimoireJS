React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
Tab = require 'react-simpletabs'
SceneContent = require './debugger-scene-content'
class DebuggerScenesPanel extends React.Component
  constructor:(props)->
    super props

  render:->
    tabs = [];
    for k,v of DebuggerScenesAPI.scenes
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
     <Tab.Panel title={k} key={k}>
       <SceneContent/>
     </Tab.Panel>

class DebuggerScenesAPI
  @scenes={
    "NoScene":{
      isNoScene:false
    }
  }

styles =
  noSceneText:
    textAlign:"center"
    fontSize:"xx-large"

window.j3d.scenes = DebuggerScenesAPI;
module.exports = DebuggerScenesPanel;
