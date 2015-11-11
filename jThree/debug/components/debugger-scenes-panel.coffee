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
     <Tab.Panel title={k} key={k}>
       <SceneContent sceneName={k} rootAPI={v.rootAPI}/>
     </Tab.Panel>

class DebuggerScenesAPI
  #reference for DebuggerScenesPanel
  @scenesPanel

  @scenes={
    "NoScene":{
      isNoScene:true
    }
  }

  @setScene:(sceneName)->
    #if there was NoScene, delete this
    if DebuggerScenesAPI.scenes["NoScene"]?
      delete DebuggerScenesAPI.scenes["NoScene"];
    #Initialize root api
    scenes = DebuggerScenesAPI.scenes;
    api = new DebuggerSceneContentAPI(sceneName);
    api.onUpdate (api)->
      DebuggerScenesAPI.scenesPanel.setState({scenes:DebuggerScenesAPI.scenes})
    scenes[sceneName] = {rootAPI:api}
    api.notifyUpdate()

class DebuggerSceneContentAPI
  constructor:(name)->
    @children = []
    @name = name
    @handlers = []

  setChild:(childName)->
    childApi = new DebuggerSceneContentAPI(childName);
    @children.push(childApi)
    @notifyUpdate()
    childApi

  getChild:(childName)->
    for v in @children
      if v.name == childName
        return v
    null;

  onUpdate:(handler)->
    @handlers.push handler

  notifyUpdate:->
    for v in @handlers
      v(this)

styles =
  noSceneText:
    textAlign:"center"
    fontSize:"xx-large"

window.j3d.scenes = DebuggerScenesAPI;
module.exports = DebuggerScenesPanel;
