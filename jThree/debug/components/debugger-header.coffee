React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
HeaderLink = require './debugger-header-link'

class DebuggerHeader extends React.Component
  constructor:(props)->
    super props

  render:->
    <div style={styles.base}>
      <div style={styles.head}>
        <span style={styles.title}>jThreeDebugger</span>
        <span style={styles.titleDivider}></span>
        <span style={styles.subtitle}>-with our all gratitude for your contribution-</span>
      </div>
      <nav style={styles.nav}>
        <HeaderLink text="Official Site" leftSeparator="false" href="http://jthree.io"/>
        <HeaderLink text="Github" leftSeparator="true" href="http://github.com/jThreeJS/jThree"/>
      </nav>
    </div>

styles =
  base:
    background:Colors.main.n.default
    height:40
    position:'relative'
  head:
    position: 'absolute'
    top: '50%'
    transform: 'translateY(-50%)'
    WebkitTransform: 'translateY(-50%)'
    left: 40
  title:
    color:Colors.main.r.default
  titleDivider:
    minWidth:15
    display:'inline-block'
  subtitle:
    color:Colors.main.r.default
    fontSize:'small'
  nav:
    position: 'absolute'
    top: '50%'
    transform: 'translateY(-50%)'
    WebkitTransform: 'translateY(-50%)'
    right: 40

module.exports = DebuggerHeader;
