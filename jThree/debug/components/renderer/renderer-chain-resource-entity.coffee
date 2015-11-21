React = require 'react'
ReactDOM = require 'react-dom'
class RendererChainResourceEntity extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <a style={styles.container} onClick={@onResourceSelected}>
        <span>{@props.texKey}</span>
        <span> → </span>
        <span>{@props.texVal} </span>
      </a>
      <a onClick={@onResourceSelectedWithoutAlpha}>255 multiplied no alpha</a>
      <div ref="container">
      </div>
    </div>

  onResourceSelected:()=>
    @props.rdrDebugger.getTextureHtmlImage(@props.stage.stage.ID,@props.texKey).then (image)=>
      container = ReactDOM.findDOMNode(this.refs.container)
      container.innerHTML = '';
      container.appendChild image

  onResourceSelectedWithoutAlpha:()=>
    @props.rdrDebugger.getTextureHtmlImage(@props.stage.stage.ID,@props.texKey,@alphaRemove).then (image)=>
      container = ReactDOM.findDOMNode(this.refs.container)
      container.innerHTML = '';
      container.appendChild image

  alphaRemove:(width,height,arr)=>
    result = new Uint8Array width * height * 4
    for x in [0..width]
      for y in [0..height]
        result[4*(y * width + x) + 0] = arr[4 * ((height - y) * width + x) + 0]*255
        result[4*(y * width + x) + 1] = arr[4 * ((height - y) * width + x) + 1]*255
        result[4*(y * width + x) + 2] = arr[4 * ((height - y) * width + x) + 2]*255
        result[4*(y * width + x) + 3] = 255
    result


styles =
  container:
    background:"gray"
    cursor:"pointer"

module.exports = RendererChainResourceEntity;
