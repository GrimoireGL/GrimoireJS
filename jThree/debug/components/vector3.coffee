React = require 'react'

class Vector3 extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <span>X</span>
      <input styles={[styles.input]}></input>
      <span>Y</span>
      <input styles={[styles.input]}></input>
      <span>Z</span>
      <input styles={[styles.input]}></input>
    </div>

styles =
  input:
    width:150
module.exports = Vector3;
