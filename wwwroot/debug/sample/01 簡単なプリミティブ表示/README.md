# 01:簡単なプリミティブ表示
## 概要

基本的なプリミティブを表示するためだけのサンプル。

このサンプルでは立体感のあるマテリアルを用いてないので、決まった一色で描画される。

## コード説明

### マテリアル、ジオメトリ

**メッシュ = ジオメトリ + マテリアル**

jThreeで描画されるすべてのオブジェクトはジオメトリとマテリアルを持つ。
ジオメトリは形状を意味し、その形をなす頂点のリストや法線のリストにより成り立つ。

一方、マテリアルは材質であり、どのように描画されるかを示す。
例えば、このサンプル中での
```xml
<material name="sampleMaterial1" type="builtin.solid" color="yellow"/>
```
は、`sampleMaterial1`という名前の`builtin.solid`という型のマテリアルを宣言している。また、このマテリアルにcolorとして`yellow`を渡している。

**builtin.solid** は光源の影響を一切受けない。

一方、幾つかのジオメトリはデフォルトで使用可能である。
* cube 立方体
* cone 円錐
* cylinder 円柱
* sphere 球体
* quad 平面

注意点として、どれも裏側は描画されないようになっている。

メッシュを描画するには、
sceneタグ内に
```xml
<mesh mat="sampleMaterial1" geo="cube" position="2,0,0"/>
```
のようにmatとgeo属性をそれぞれ指定する。

### レンダラー
jThreeはcanvasを自動で生成、管理する。
あらかじめ**canvasをHTMLに置く必要はない**
```xml
<canvas clearColor="#11022A" frame=".canvasContainer">
  <viewport cam="CAM1" id="main" width="640" height="480"/>
</canvas>
```

canvasにはframe要素にセレクタとしてcanvasを設置したい親オブジェクトを指定する。
canvas内には1つ以上のviewportをとる必要がある。
viewportを複数指定すると、複数のシーンを同一のcanvas内に描画することが可能である。

viewportタグはcam属性を持つ必要がある。cam属性にはいずれかのシーン内のcameraタグのnameを指定する。
cameraタグのnameは常にuniqueでなければならない。
