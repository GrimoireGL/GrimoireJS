cnt = 10
j3 ->
  for x in [0..cnt]
    for y in [0..cnt]
      for z in [0..cnt]
        j3('#container').append "<mesh geo='cube' scale='0.2' position='#{x},#{y},#{z}' mat='mat2' />"
  j3('#container').attr {position: "#{-cnt / 2}, #{-cnt / 2}, #{-cnt / 2}"}
  j3('#wrapper').animate {rotation: 'euler(180, 150, 120)'}, 10000
