React = require 'react'
Colors = require './colors/definition'
Agent = require 'superagent'
Cookie = require 'js-cookie'
JThree = require './jthree/jthree-preview-controller'
Q = require 'q'
class DebuggerContentSelector extends React.Component
  constructor:(props)->
    super props
    @state={inputs:[],selected:Cookie.get('debugTarget')}
    Q.all [@resolveConfig('./sample.json'),@resolveConfig('./debug.json')]
      .then (resObj)=>
        resObj = resObj.reverse()
        config =
          codes:{}
        for res in resObj
          for k,code of res.codes
            code.root = res.config.root
            config.codes[k] = code
        JThree.initJThree config,@state.selected
        inputs=[]
        for k,v of config.codes
          inputs.push k
        @setState
          inputs:inputs

  resolveConfig:(path)=>
    defer = Q.defer()
    Agent.get path
      .end (e,r) =>
        if e
          defer.reject(e)
        defer.resolve JSON.parse(r.text)
    defer.promise

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
