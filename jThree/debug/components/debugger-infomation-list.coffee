React = require 'react'
Radium = require 'radium'
InfomationListItem = require './debugger-infomation-list-item'
class DebuggerInfomationList extends React.Component
  constructor:(props)->
    super props

  render:->
      elements =[];
      for k of global.j3d.info.infomation
        elements.push(<InfomationListItem　key={k} title={k} text={global.j3d.info.infomation[k].text}/>)
      <div>
        {elements}
      </div>

class DebuggerInformationListAPI
  @infomation = {
      "test":{text:"hello world</br>Hello2"},
      "test2":{text:"helloworld2"}
    };
window.j3d.info = DebuggerInformationListAPI;
module.exports = DebuggerInfomationList;
