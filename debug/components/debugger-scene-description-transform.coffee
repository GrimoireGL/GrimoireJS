React = require 'react'
Vector3 = require './vector3'
class DebuggerSceneDescriptionTransform extends React.Component
  constructor:(props)->
    super props
    @lastObject = @props.object;
    @state=
      position:@lastObject.__transformer._position
      rotation:@obtainEular(@lastObject.__transformer._rotation)
      scale:@lastObject.__transformer._scale
  render:->
    <div>
      <Vector3 title="position" value={@state.position} onValueChanged={@onPositionChange}/>
      <Vector3 title="rotation" value={@state.rotation} onValueChanged={@onRotationChange}/>
      <Vector3 title="scale" value={@state.scale} onValueChanged={@onScaleChange}/>
    </div>

  onPositionChange:(n,v)=>
    @props.object.__transformer._position[n] = v
    @props.object.__transformer.updateTransform()
    @updateObjectState @props.object

  onRotationChange:(n,v)=>
    eul = @obtainEular @props.object.__transformer._rotation
    eul[n] = v
    @state.rotation[n] = v
    @setState @state
    eul.X = @fromDegree eul.X
    eul.Y = @fromDegree eul.Y
    eul.Z = @fromDegree eul.Z
    @props.object.__transformer._rotation.eularAngles = eul
    @isRotationChange = true
    @props.object.__transformer.updateTransform()


  onScaleChange:(n,v)=>
    @props.object.__transformer._scale[n] = v
    @props.object.__transformer.updateTransform()
    @updateObjectState @props.object

  onTransformUpdate:()=>
    @updateObjectState @props.object

  componentWillReceiveProps:(prop)=>
    if @lastObject && @lastObject!=@props.object
      @lastObject.__transformer.onUpdateTransformHandler.removeListener @onTransformUpdate
      @lastObject = @props.object
      @lastObject.__transformer.onUpdateTransformHandler.addListener @onTransformUpdate
    @updateObjectState prop.object

  updateObjectState:(obj)=>
    @setState
      position:obj.__transformer._position
      rotation:@obtainEular obj.__transformer._rotation
      scale:obj.__transformer._scale

  obtainEular:(quat)=>
    eul = quat.factoringQuaternionZXY()
    {X:@toDegree(eul.x),Y:@toDegree(eul.y),Z:@toDegree(eul.z)}

  copyXYZ:(s)=>
    X:s.X
    Y:s.Y
    Z:s.Z

  toDegree:(n)=>
    360 * n / (2 * Math.PI)

  fromDegree:(n)=>
    n / 360 * (2 * Math.PI)

module.exports = DebuggerSceneDescriptionTransform;
