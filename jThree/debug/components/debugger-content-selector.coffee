React = require 'react'
Colors = require './colors/definition'
Agent = require 'superagent'
Cookie = require 'js-cookie'
JThree = require './jthree/jthree-preview-controller'
class DebuggerContentSelector extends React.Component
  constructor:(props)->
    super props
    @state={inputs:[],selected:Cookie.get('debugTarget')}
    Agent.get './debug.json'
      .end (e,r) =>
        if e
          throw new Error e
        resObj = JSON.parse(r.text)
        JThree.initJThree resObj,@state.selected
        inputs=[]
        for k,v of resObj.codes
          inputs.push k
        @setState
          inputs:inputs

  render:()->
    inputs = [];
    for k in @state.inputs
      inputs.push(<option key={k} value={k}>{k}</option>)
    <span>
      <select id="debugTargetSelector" style={styles.selectStyle} onChange={@selectChanged} value={@state.selected}>
        {inputs}
      </select>
    </span>

  selectChanged:()->
    Cookie.set 'debugTarget',document.getElementById('debugTargetSelector').value
    location.reload()

styles =
  selectStyle:
    marginLeft:20

module.exports = DebuggerContentSelector;
