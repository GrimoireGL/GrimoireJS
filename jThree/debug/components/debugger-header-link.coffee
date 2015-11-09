React = require 'React'
Radium = require 'Radium'
colors = require './colors/definition'
class DebuggerHeaderLink extends React.Component
  constructor:(props)->
    super props

  render:->
    <li style={styles.li}>
      <a href={@props.href} style={styles.a}>{@props.text}</a>
    </li>

styles =
  li:
    listStyle:'none'
    float:'left'
    paddingLeft:20
    paddingRight:20
  a:
    textDecoration: 'none'
    color:colors.main.r.default
module.exports = DebuggerHeaderLink;
