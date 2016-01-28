React = require 'react'
Vector3 = require './vector3'
class DebuggerSceneDescriptionTransform extends React.Component
  constructor:(props)->
    super props
    @lastObject = @props.object;
    @state=
      position:@lastObject.transformer.position
      rotation:@obtainEular(@lastObject.transformer.rotation)
      scale:@lastObject.transformer.scale
  render:->
    <div>
      <Vector3 title="position" value={@state.position} onValueChanged={@onPositionChange}/>
      <Vector3 title="rotation" value={@state.rotation} onValueChanged={@onRotationChange}/>
      <Vector3 title="scale" value={@state.scale} onValueChanged={@onScaleChange}/>
    </div>

  onPositionChange:(n,v)=>
    @props.object.transformer.position[n] = v
    @props.object.transformer.updateTransform()
    @updateObjectState @props.object

  onRotationChange:(n,v)=>
    eul = @obtainEular @props.object.transformer.rotation
    eul[n] = v
    @state.rotation[n] = v
    @setState @state
    eul.X = @fromDegree eul.X
    eul.Y = @fromDegree eul.Y
    eul.Z = @fromDegree eul.Z
    @props.object.transformer.rotation.eularAngles = eul
    @isRotationChange = true
    @props.object.transformer.updateTransform()


  onScaleChange:(n,v)=>
    @props.object.transformer.scale[n] = v
    @props.object.transformer.updateTransform()
    @updateObjectState @props.object

  onTransformUpdate:()=>
    @updateObjectState @props.object

  componentWillReceiveProps:(prop)=>
    if @lastObject && @lastObject!=@props.object
      @lastObject.transformer.onUpdateTransformHandler.removeListener @onTransformUpdate
      @lastObject = @props.object
      @lastObject.transformer.onUpdateTransformHandler.addListener @onTransformUpdate
    @updateObjectState prop.object

  updateObjectState:(obj)=>
    @setState
      position:obj.transformer.position
      rotation:@obtainEular obj.transformer.rotation
      scale:obj.transformer.scale

  obtainEular:(quat)=>
    eul = quat.FactoringQuaternionZXY()
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
