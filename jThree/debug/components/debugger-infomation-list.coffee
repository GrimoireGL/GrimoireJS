React = require 'react'
Radium = require 'radium'
InfomationListItem = require './debugger-infomation-list-item'
class DebuggerInfomationList extends React.Component
  constructor:(props)->
    super props
    @state = {};
    window.j3d.info.onListChanged = @onListChanged;
    @state.infomation = window.j3d.info.infomation;

  render:->
      elements =[];
      for k of @state.infomation
        elements.push(<InfomationListItem　key={k} title={k} text={global.j3d.info.infomation[k].text}/>)
      <div>
        {elements}
      </div>
  onListChanged:=>
    @setState
     infomation:window.j3d.info.infomation

class DebuggerInformationListAPI
  @infomation = {
    };

  @setInfo:(key,info)->
    if window.j3d.info.infomation[key]?
      window.j3d.info.infomation[key].text = info
      if window.j3d.info.infomation[key].handler?
        window.j3d.info.infomation[key].handler.call(window.j3d.info.infomation[key].owner,info);
    else
      window.j3d.info.infomation[key] =
        text:info
      if window.j3d.info.onListChanged?
        window.j3d.info.onListChanged();

window.j3d.info = DebuggerInformationListAPI;
module.exports = DebuggerInfomationList;
