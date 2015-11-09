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
      <div style={styles.title}>
        <span>
        {@props.title}
        </span>
      </div>
      <div style={styles.textContainer} dangerouslySetInnerHTML={__html:@props.text}>
      </div>
    </div>

styles =
  itemContainer:
    border:'solid 1px ' + Colors.main.n.moderate
    backgroundColor:Colors.main.n.light
  title:
    backgroundColor:Colors.main.n.default
    float:"left"
    color:Colors.main.n.light
    display:'inline-block'
    paddingLeft:15
    paddingRight:15
  textContainer:
    display:'inline-block'
    marginLeft:15

module.exports = DebuggerInfomationListItem;
