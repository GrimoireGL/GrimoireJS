React = require 'react'
Vector3 = require './vector3'
class DebuggerSceneDescriptionTransform extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <Vector3/>
    </div>
module.exports = DebuggerSceneDescriptionTransform;
