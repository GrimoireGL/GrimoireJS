React = require 'react'
Colors = require './colors/definition'
Agent = require 'superagent'
class DebuggerContentSelector extends React.Component
  constructor:(props)->
    super props
    @state={inputs:[]}
    Agent.get './debug.json'
      .end (e,r) =>
        inputs=[]
        for k,v of r.body.codes
          inputs.push k
        @setState
          inputs:inputs

  render:()->
    inputs = [];
    for k in @state.inputs
      inputs.push(<option value={k}>{k}</option>)
    <span>
      <select style={styles.selectStyle}>
        {inputs}
      </select>
    </span>

styles =
  selectStyle:
    marginLeft:20

module.exports = DebuggerContentSelector;
