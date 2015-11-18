React = require 'react'

class RendererChainResourceEntity extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <p style={styles.container}>
        <span>{@props.texKey}</span>
        <span> → </span>
        <span>{@props.texVal}</span>
      </p>
    </div>

styles =
  container:
    color:"white"

module.exports = RendererChainResourceEntity;
