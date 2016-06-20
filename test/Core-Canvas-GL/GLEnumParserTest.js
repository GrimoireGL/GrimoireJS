import test from 'ava';
import util from 'util';
import GLInitializer from '../InitTest';

import GLEnumParser from '../../lib-es5/Core/Canvas/GL/GLEnumParser';

test('BlendConstantParser ZERO should be WebGLRenderingContext.ZERO',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ZERO") === WebGLRenderingContext.ZERO);
  t.ok(GLEnumParser.parseBlendFunc("0") === WebGLRenderingContext.ZERO);
});

test('BlendConstantParser ONE should be WebGLRenderingContext.ONE',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ONE") === WebGLRenderingContext.ONE);
  t.ok(GLEnumParser.parseBlendFunc("1") === WebGLRenderingContext.ONE);
});

test('BlendConstantParser SRC_COLOR should be WebGLRenderingContext.SRC_COLOR',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("SRC_COLOR") === WebGLRenderingContext.SRC_COLOR);
});

test('BlendConstantParser SRC_ALPHA should be WebGLRenderingContext.SRC_ALPHA',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("SRC_ALPHA") === WebGLRenderingContext.SRC_ALPHA);
});

test('BlendConstantParser ONE_MINUS_SRC_COLOR should be WebGLRenderingContext.ONE_MINUS_SRC_COLOR',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ONE_MINUS_SRC_COLOR") === WebGLRenderingContext.ONE_MINUS_SRC_COLOR);
});

test('BlendConstantParser ONE_MINUS_SRC_ALPHA should be WebGLRenderingContext.ONE_MINUS_SRC_ALPHA',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ONE_MINUS_SRC_ALPHA") === WebGLRenderingContext.ONE_MINUS_SRC_ALPHA);
});

test('BlendConstantParser DST_ALPHA should be WebGLRenderingContext.DST_ALPHA',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("DST_ALPHA") === WebGLRenderingContext.DST_ALPHA);
});

test('BlendConstantParser ONE_MINUS_DST_ALPHA should be WebGLRenderingContext.ONE_MINUS_DST_ALPHA',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ONE_MINUS_DST_ALPHA") === WebGLRenderingContext.ONE_MINUS_DST_ALPHA);
});

test('BlendConstantParser DST_COLOR should be WebGLRenderingContext.DST_COLOR',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("DST_COLOR") === WebGLRenderingContext.DST_COLOR);
});

test('BlendConstantParser ONE_MINUS_DST_COLOR should be WebGLRenderingContext.ONE_MINUS_DST_COLOR',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ONE_MINUS_DST_COLOR") === WebGLRenderingContext.ONE_MINUS_DST_COLOR);
});

test('BlendConstantParser SRC_ALPHA_SATURATE should be WebGLRenderingContext.SRC_ALPHA_SATURATE',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("SRC_ALPHA_SATURATE") === WebGLRenderingContext.SRC_ALPHA_SATURATE);
});

test('BlendConstantParser should throw an error when unknown constant name was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseBlendFunc("UNKNOWN_SOMETHING"));
});

test('BlendConstantParser should ignore mixing of capital case or lower case',(t)=>{
  t.ok(GLEnumParser.parseBlendFunc("ZERO") === WebGLRenderingContext.ZERO);
  t.ok(GLEnumParser.parseBlendFunc("zero") === WebGLRenderingContext.ZERO);
  t.ok(GLEnumParser.parseBlendFunc("ZeRo") === WebGLRenderingContext.ZERO);
});

test('DepthFuncParser, NEVER should be WebGLRenderingContext.NEVER',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("NEVER") === WebGLRenderingContext.NEVER);
});

test('DepthFuncParser, LESS should be WebGLRenderingContext.LESS',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("LESS") === WebGLRenderingContext.LESS);
});

test('DepthFuncParser, LEQUAL should be WebGLRenderingContext.LEQUAL',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("LEQUAL") === WebGLRenderingContext.LEQUAL);
});

test('DepthFuncParser, GREATER should be WebGLRenderingContext.GREATER',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("GREATER") === WebGLRenderingContext.GREATER);
});

test('DepthFuncParser, NOTEQUAL should be WebGLRenderingContext.NOTEQUAL',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("NOTEQUAL") === WebGLRenderingContext.NOTEQUAL);
});

test('DepthFuncParser, GEQUAL should be WebGLRenderingContext.GEQUAL',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("GEQUAL") === WebGLRenderingContext.GEQUAL);
});

test('DepthFuncParser, ALWAYS should be WebGLRenderingContext.ALWAYS',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("ALWAYS") === WebGLRenderingContext.ALWAYS);
});

test('DepthFuncParser should ignore mixing of capital case or lower case',(t)=>{
  t.ok(GLEnumParser.parseDepthFunc("ALWAYS") === WebGLRenderingContext.ALWAYS);
  t.ok(GLEnumParser.parseDepthFunc("always") === WebGLRenderingContext.ALWAYS);
  t.ok(GLEnumParser.parseDepthFunc("AlwAYS") === WebGLRenderingContext.ALWAYS);
});

test('DepthFuncParser should throw error when unknown depth function constant was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseDepthFunc("UNKNOWN_SOMETHING"));
});

test('CullModeParser, BACK should be WebGLRenderingContext.BACK',(t)=>{
  t.ok(GLEnumParser.parseCullMode("BACK") === WebGLRenderingContext.BACK);
});

test('CullModeParser, FRONT should be WebGLRenderingContext.FRONT',(t)=>{
  t.ok(GLEnumParser.parseCullMode("FRONT") === WebGLRenderingContext.FRONT);
});

test('CullModeParser, FRONT_AND_BACK should be WebGLRenderingContext.FRONT_AND_BACK',(t)=>{
  t.ok(GLEnumParser.parseCullMode("FRONT_AND_BACK") === WebGLRenderingContext.FRONT_AND_BACK);
});

test('CullModeParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseCullMode("BACK") === WebGLRenderingContext.BACK);
  t.ok(GLEnumParser.parseCullMode("Back") === WebGLRenderingContext.BACK);
  t.ok(GLEnumParser.parseCullMode("back") === WebGLRenderingContext.BACK);
});

test('CullModeParser shuld throw error when unknown cull mode was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseCullMode("UNKNOWN_SOMETHING"));
});

test('TextureWrappingModeParser, REPEAT should be WebGLRenderingContext.REPEAT',(t)=>{
  t.ok(GLEnumParser.parseTextureWrapMode("REPEAT") === WebGLRenderingContext.REPEAT);
});

test('TextureWrappingModeParser, CLAMP_TO_EDGE should be WebGLRenderingContext.CLAMP_TO_EDGE',(t)=>{
  t.ok(GLEnumParser.parseTextureWrapMode("CLAMP_TO_EDGE") === WebGLRenderingContext.CLAMP_TO_EDGE);
});

test('TextureWrappingModeParser, MIRRORED_REPEAT should be WebGLRenderingContext.MIRRORED_REPEAT',(t)=>{
  t.ok(GLEnumParser.parseTextureWrapMode("MIRRORED_REPEAT") === WebGLRenderingContext.MIRRORED_REPEAT);
});

test('TextureWrappingModeParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseTextureWrapMode("REPEAT") === WebGLRenderingContext.REPEAT);
  t.ok(GLEnumParser.parseTextureWrapMode("Repeat") === WebGLRenderingContext.REPEAT);
  t.ok(GLEnumParser.parseTextureWrapMode("repeat") === WebGLRenderingContext.REPEAT);
});

test('TextureWrappingModeParser should throw an error when unknown texture wrapping mode was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseTextureWrapMode("UNKNOWN_SOMETHING"));
});

test('TextureMagFilterParser,NEAREST should be WebGLRenderingContext.NEAREST',(t)=>{
  t.ok(GLEnumParser.parseTextureMagFilter("NEAREST") === WebGLRenderingContext.NEAREST);
});

test('TextureMagFilterParser,LINEAR should be WebGLRenderingContext.LINEAR',(t)=>{
  t.ok(GLEnumParser.parseTextureMagFilter("LINEAR") === WebGLRenderingContext.LINEAR);
});

test('TextureMagFilterParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseTextureMagFilter("NEAREST") === WebGLRenderingContext.NEAREST);
  t.ok(GLEnumParser.parseTextureMagFilter("Nearest") === WebGLRenderingContext.NEAREST);
  t.ok(GLEnumParser.parseTextureMagFilter("nearest") === WebGLRenderingContext.NEAREST);
});

test('TextureMagFilterParser should throw an error when unknown texture mag filter mode was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseTextureMagFilter("UNKNOWN_SOMETHING"));
});

test('TextureMinFilterParser,NEAREST should be WebGLRenderingContext.NEAREST',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("NEAREST") === WebGLRenderingContext.NEAREST);
});

test('TextureMinFilterParser,LINEAR should be WebGLRenderingContext.LINEAR',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("LINEAR") === WebGLRenderingContext.LINEAR);
});

test('TextureMinFilterParser,LINEAR_MIPMAP_NEAREST should be WebGLRenderingContext.LINEAR_MIPMAP_NEAREST',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("LINEAR_MIPMAP_NEAREST") === WebGLRenderingContext.LINEAR_MIPMAP_NEAREST);
});

test('TextureMinFilterParser,LINEAR_MIPMAP_LINEAR should be WebGLRenderingContext.LINEAR_MIPMAP_LINEAR',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("LINEAR_MIPMAP_LINEAR") === WebGLRenderingContext.LINEAR_MIPMAP_LINEAR);
});

test('TextureMinFilterParser,NEAREST_MIPMAP_LINEAR should be WebGLRenderingContext.NEAREST_MIPMAP_LINEAR',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("NEAREST_MIPMAP_LINEAR") === WebGLRenderingContext.NEAREST_MIPMAP_LINEAR);
});

test('TextureMinFilterParser,NEAREST_MIPMAP_NEAREST should be WebGLRenderingContext.NEAREST_MIPMAP_NEAREST',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("NEAREST_MIPMAP_NEAREST") === WebGLRenderingContext.NEAREST_MIPMAP_NEAREST);
});

test('TextureMinFilterParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseTextureMinFilter("NEAREST") === WebGLRenderingContext.NEAREST);
  t.ok(GLEnumParser.parseTextureMinFilter("Nearest") === WebGLRenderingContext.NEAREST);
  t.ok(GLEnumParser.parseTextureMinFilter("nearest") === WebGLRenderingContext.NEAREST);
});

test('TextureMinFilterParser should throw an error when unknown texture min filter mode was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseTextureMinFilter("UNKNOWN_SOMETHING"));
});

test('TextureLayoutParser,RGBA should be WebGLRenderingContext.RGBA',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("RGBA") === WebGLRenderingContext.RGBA);
});

test('TextureLayoutParser,RGB should be WebGLRenderingContext.RGB',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("RGB") === WebGLRenderingContext.RGB);
});

test('TextureLayoutParser,DEPTH should be WebGLRenderingContext.DEPTH',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("DEPTH") === WebGLRenderingContext.DEPTH_COMPONENT);
});

test('TextureLayoutParser,DEPTH_COMPONENT should be WebGLRenderingContext.DEPTH_COMPONENT',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("DEPTH_COMPONENT") === WebGLRenderingContext.DEPTH_COMPONENT);
});

test('TextureLayoutParser,ALPHA should be WebGLRenderingContext.ALPHA',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("ALPHA") === WebGLRenderingContext.ALPHA);
});

test('TextureLayoutParser,LUMINANCE should be WebGLRenderingContext.LUMINANCE',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("LUMINANCE") === WebGLRenderingContext.LUMINANCE);
});

test('TextureLayoutParser,LUMINANCE_ALPHA should be WebGLRenderingContext.LUMINANCE_ALPHA',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("LUMINANCE_ALPHA") === WebGLRenderingContext.LUMINANCE_ALPHA);
});

test('TextureLayoutParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseTextureLayout("ALPHA") === WebGLRenderingContext.ALPHA);
  t.ok(GLEnumParser.parseTextureLayout("Alpha") === WebGLRenderingContext.ALPHA);
  t.ok(GLEnumParser.parseTextureLayout("alpha") === WebGLRenderingContext.ALPHA);
});

test('TextureLayoutParser should throw an error when unknown texture layout was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseTextureLayout("UNKNOWN_SOMETHING"));
});

test('TextureFormatParser,UBYTE should be WebGLRenderingContext.UBYTE',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UBYTE") === WebGLRenderingContext.UNSIGNED_BYTE);
});

test('TextureFormatParser,UNSIGNED_BYTE should be WebGLRenderingContext.UNSIGNED_BYTE',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_BYTE") === WebGLRenderingContext.UNSIGNED_BYTE);
});

test('TextureFormatParser,FLOAT should be WebGLRenderingContext.FLOAT',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("FLOAT") === WebGLRenderingContext.FLOAT);
});

test('TextureFormatParser,UNSIGNED_SHORT should be WebGLRenderingContext.UNSIGNED_SHORT',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_SHORT") === WebGLRenderingContext.UNSIGNED_SHORT);
});

test('TextureFormatParser,USHORT should be WebGLRenderingContext.USHORT',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("USHORT") === WebGLRenderingContext.UNSIGNED_SHORT);
});

test('TextureFormatParser,UNSIGNED_INT should be WebGLRenderingContext.UNSIGNED_INT',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_INT") === WebGLRenderingContext.UNSIGNED_INT);
});

test('TextureFormatParser,UINT should be WebGLRenderingContext.UINT',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UINT") === WebGLRenderingContext.UNSIGNED_INT);
});

test('TextureFormatParser,USHORT565 should be WebGLRenderingContext.USHORT565',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("USHORT565") === WebGLRenderingContext.UNSIGNED_SHORT_5_6_5);
});

test('TextureFormatParser,UNSIGNED_SHORT_5_6_5 should be WebGLRenderingContext.UNSIGNED_SHORT_5_6_5',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_SHORT_5_6_5") === WebGLRenderingContext.UNSIGNED_SHORT_5_6_5);
});

test('TextureFormatParser,USHORT4444 should be WebGLRenderingContext.USHORT4444',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("USHORT4444") === WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4);
});

test('TextureFormatParser,UNSIGNED_SHORT_4_4_4_4 should be WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_SHORT_4_4_4_4") === WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4);
});

test('TextureFormatParser,UNSIGNED_SHORT_5_5_5_1 should be WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_SHORT_5_5_5_1") === WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1);
});

test('TextureFormatParser,USHORT5551 should be WebGLRenderingContext.USHORT5551',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("USHORT5551") === WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1);
});

test('TextureFormatParser should ignore mixing of capital or lower case',(t)=>{
  t.ok(GLEnumParser.parseTextureFormat("UNSIGNED_INT") === WebGLRenderingContext.UNSIGNED_INT);
  t.ok(GLEnumParser.parseTextureFormat("unsigned_int") === WebGLRenderingContext.UNSIGNED_INT);
  t.ok(GLEnumParser.parseTextureFormat("Unsigned_Int") === WebGLRenderingContext.UNSIGNED_INT);
});

test('TextureFormatParser should throw an error when unknown texture format was specified',(t)=>{
  t.throws(()=>GLEnumParser.parseTextureFormat("UNKNOWN_SOMETHING"));
});
