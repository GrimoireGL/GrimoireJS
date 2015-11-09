React = require 'react'
Radium = require 'radium'
InfomationListItem = require './debugger-infomation-list-item'
class DebuggerInfomationList extends React.Component
  constructor:(props)->
    super props

  render:->
      elements =[];
      for k,v of global.j3d.info.infomation
        elements.push(<InfomationListItem key={k} text={v.text}/>)
      <div>
        {elements}
      </div>

class DebuggerInformationListAPI
  @infomation = {
      "test":{text:"hello world"},
      "test2":{text:"helloworld2"}
    };
window.j3d.info = DebuggerInformationListAPI;
module.exports = DebuggerInfomationList;
