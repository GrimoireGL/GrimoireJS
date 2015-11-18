precision mediump float;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vSphereUV;

uniform vec4 diffuse;
uniform sampler2D texture;
uniform sampler2D sphere;
uniform mat4 matV;
uniform int textureUsed;
uniform int sphereMode;
uniform vec4 addTextureCoefficient;
uniform vec4 mulTextureCoefficient;
uniform vec4 addSphereCoefficient;
uniform vec4 mulSphereCoefficient;


vec4 blendPMXTexture(sampler2D source,vec2 uv,vec4 addCoeff,vec4 mulCoeff)
{
    vec4 result=texture2D(source,abs(fract(vUV)));
    result.rgb=mix(mix(result.rgb,vec3(0,0,0),addCoeff.a),vec3(1,1,1),1.-mulCoeff.a);
    result.rgb=result.rgb*mulCoeff.rgb+addCoeff.rgb;
    return result;
}

void main(void){
  vec2 adjuv=vUV;
  gl_FragColor.rgba=diffuse;
    if(textureUsed>0) gl_FragColor.rgba*=blendPMXTexture(texture,adjuv,addTextureCoefficient,mulTextureCoefficient);
    if(sphereMode==1)
    {
      gl_FragColor.rgb*=blendPMXTexture(sphere,vSphereUV,addSphereCoefficient,mulSphereCoefficient).rgb;
    }else if(sphereMode==2)
    {
      gl_FragColor.rgb+=blendPMXTexture(sphere,vSphereUV,addSphereCoefficient,mulSphereCoefficient).rgb;
    }
}
