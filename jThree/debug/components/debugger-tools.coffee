React = require 'react'
Radium = require 'radium'
Tabs = require 'react-simpletabs'

class DebuggerTools extends React.Component
  constructor:(props)->
    super props
  render:->
    <Tabs tabActive={1}>
      <Tabs.Panel title="Infomation">
        <h2>Content 1 here</h2>
      </Tabs.Panel>
      <Tabs.Panel title="Resources">
        <h2>Content 2 here</h2>
      </Tabs.Panel>
    </Tabs>

module.exports = DebuggerTools;
