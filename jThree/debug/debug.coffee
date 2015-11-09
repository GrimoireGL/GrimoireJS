ReactDom = require 'react-dom'
React = require 'react'
radium = require 'radium'
DebuggerContainer = require './components/debugger-container'

ReactDom.render <DebuggerContainer/>,document.getElementById('root')
