React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
class DebuggerInfomationListItem extends React.Component
  constructor:(props)->
    super props
    @state={}
    @state.text = props.text;
  #  global.j3d.info.infomation[props.key].handler = @updateText;

  render:->
    <div style={styles.itemContainer}>
      {@props.text}
    </div>

styles =
  itemContainer:
    border:'solid 1px ' + Colors.main.n.default
    backgroundColor:Colors.main.n.light


module.exports = DebuggerInfomationListItem;
