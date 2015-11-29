//Header should be inserted above like below
//precision mediump float
//#define SHADOW_MAP_LENGTH <<Max count of shadow map>>
//uniform variables
uniform highp   sampler2D primary;
uniform lowp sampler2D secoundary;
uniform lowp sampler2D third;
uniform highp   sampler2D lightParam;

uniform vec2 lightParamSize;

uniform mat4 matIP;
uniform mat4 matV;
uniform mat4 matIV;

uniform highp sampler2D shadowParam;
uniform lowp sampler2D shadowMap;
uniform float shadowMapMax; //sqrt(maximum shadow map count)<- because this is count of edge for shadow matrix texture

//varying variables
varying vec2 vUV;

//Get depth from texture
float getDepth()
{
	return texture2D(primary,vUV).z;
}
//Get normal from texture
vec3 getNormal()
{
	highp vec2 compressed = texture2D(primary,vUV).xy * 4. - vec2(2.,2.);
	highp vec3 result;
	float f = dot(compressed,compressed);
	float g = sqrt(1. - f/4.);
	result.z = 1. - f/2.;
	result.xy = compressed * g;
	return normalize(result);
}
//Reconstruct position
vec3 getPosition(float depth)
{
	vec4 reconstructed = matIP*vec4(vUV * 2. - vec2(1.,1.),depth,1.);
	return reconstructed.xyz / reconstructed.w;
}
//Get light parameter from uv
vec2 getLightParameterUV(int lightIndex,int parameterIndex)
{
	float xStep = 1./lightParamSize.x;
	float yStep = 1./lightParamSize.y;
	return vec2(xStep / 2. + float(parameterIndex) * xStep,1.-( yStep / 2. + float(lightIndex) * yStep));
}
//Get light parameter from light index and prameter index
vec4 getLightParameter(int lightIndex,int parameterIndex)
{
   return texture2D(lightParam,getLightParameterUV(lightIndex,parameterIndex));
}
//Get light type
float getLightType(int lightIndex)
{
	return getLightParameter(lightIndex,0).r;
}

vec4 getDiffuseAlbedo()
{
	return texture2D(secoundary,vUV);
}

vec3 getSpecularAlbedo()
{
	return texture2D(third,vUV).rgb;
}

float getSpecularCoefficient()
{
	return texture2D(primary,vUV).a;
}

highp float unpackFloat(vec3 rgb){
       const vec3 bit_shift = vec3( 1.0/(256.0*256.0), 1.0/256.0, 1.0);
       highp float res = dot(rgb, bit_shift);
       return res;
}

mat4 getShadowMatrix(float shadowIndex,float paramIndex)
{
	const float matrixCount = 2.;
	const float textureWidth = matrixCount * 8.;
	float y = 1./(2.*shadowMapMax) + 1./shadowMapMax*shadowIndex;
	return mat4(
	texture2D(shadowParam,vec2(1./textureWidth+1./matrixCount*paramIndex,y)),
	texture2D(shadowParam,vec2(3./textureWidth+1./matrixCount*paramIndex,y)),
	texture2D(shadowParam,vec2(5./textureWidth+1./matrixCount*paramIndex,y)),
	texture2D(shadowParam,vec2(7./textureWidth+1./matrixCount*paramIndex,y)));
}

bool isInTextureUVRange(vec2 uv)
{
	return uv.x >= 0. && uv.x <= 1. && uv.y >= 0. && uv.y <=1.;
}

///<<< LIGHT FUNCTION DEFINITIONS

void main(void)
{
	float depth = getDepth();
	if(depth== -1.)discard;
	vec3 position = getPosition(depth);
	vec3 normal = getNormal();
	vec4 diffuse = getDiffuseAlbedo();
	gl_FragColor.rgb = vec3(0,0,0);
	for(float i = 0.;i>-1.; i++)
	{
		if(lightParamSize.y == i)break;
		///<<< LIGHT FUNCTION CALLS
	}
}
