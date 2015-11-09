React = require 'react'
Radium = require 'radium'
Tabs = require 'react-simpletabs'
InformationList = require './debugger-infomation-list'
Scenes = require './debugger-scenes-panel'
class DebuggerTools extends React.Component
  constructor:(props)->
    super props
  render:->
    <Tabs tabActive={2}>
      <Tabs.Panel title="Infomation">
        <InformationList/>
      </Tabs.Panel>
      <Tabs.Panel title="Scene">
        <Scenes/>
      </Tabs.Panel>
    </Tabs>

module.exports = DebuggerTools;
