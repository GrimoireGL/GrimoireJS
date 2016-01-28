enum TextureType {
  UnsignedByte = 5121,
  Float = 5126,
  UnsignedShort565 = 33635,
  UnsignedShort4444 = 32819,
  UnsignedShort5551 = 32820,
  // when WEBGL_depth_texture was enabled(https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
  UnsignedShort = 5123,
  UnsignedInt = 5125,
  UnsignedInt24_8WebGL = 0x84FA
}

export = TextureType;
