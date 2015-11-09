React = require 'react'
Radium = require 'radium'
Tabs = require 'react-simpletabs'
InformationList = require './debugger-infomation-list'

class DebuggerTools extends React.Component
  constructor:(props)->
    super props
  render:->
    <Tabs tabActive={1}>
      <Tabs.Panel title="Infomation">
        <InformationList/>
      </Tabs.Panel>
      <Tabs.Panel title="Resources">
        <h2>Content 2 here</h2>
      </Tabs.Panel>
    </Tabs>

module.exports = DebuggerTools;
