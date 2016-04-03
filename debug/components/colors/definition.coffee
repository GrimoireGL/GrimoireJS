###*
 * Color definition for components styles
 * root[category][situation][grade]
 * category: name of category
 * situation: (n|r) n is normal(background), r is reverse(font)
 * grade: (emphasis|default|moderate|light)
 * @type {Object}
###
module.exports =
  main:
    n:
      default: '#344F6F'
      moderate: '#4D6B98'
      light: '#D5DDE9'
    r:
      emphasis: 'rgba(255, 255, 255, 0.8)'
      default: 'rgba(255, 255, 255, 0.5)'
      moderate: 'rgba(255, 255, 255, 0.3)'
  general:
    n:
      light: 'rgb(242, 242, 242)'
    r:
      emphasis: '#000'
      default: '#333'
      moderate: '#666'
      light: '#aaa'

  inverse:
    n:
      emphasis: '#000'
      default: '#333'
      moderate: '#666'
    r:
      emphasis: 'rgba(255, 255, 255, 0.95)'
      default: 'rgba(255, 255, 255, 0.7)'
      moderate: 'rgba(255, 255, 255, 0.5)'
