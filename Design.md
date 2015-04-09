# jThreeの設計

## リソース管理全般の設計

### バッファ管理に関する設計

**Requirements**

* キャンバスを跨いだバッファの管理が容易であること。
(操作時にはコンテキストを意識する必要はない、描画時には必要)
* 遅延ロードを前提とすること
* 将来的にThread safeであること

|クラス名|目的|
|:-:|:-:|
|BufferWrapper|各コンテキストごとのバッファ管理(最もシンプルなWebGLBufferのラップ)|
|BufferProxy|バッファの操作単位(更新処理などをよりシンプルに行うための構造)
|Buffer|バッファ全体に対する処理(コンテキストを問わない操作、初期値に関する処理など)|
|ResourceManager|jThree全体のコンテキストが保持するバッファに関する操作|

設計としては、BufferWrapperは単一の対象に対してのBufferProxyである。
Bufferはすべての対象に対してのBufferProxyである。

IBufferProxy
* loadAll():void;
* isAllInitialized():boolean;
* update(offset,length,array):void
* dispose():void;
* managedProxies():IBufferProxy[]
* appendProxy(proxy:IBufferProxy):IBufferProxy;
* removeProxy(proxy:IBufferProxy):IBufferProxy;

NOTICE: IBufferProxyは管理するプロキシに対してImmutableであることに注意する。

IBufferWrapper (implements IBufferProxy)

* bindBuffer():void;
* unbindBuffer():void;
* initialize():void;
* isInitialized():boolean;
* getNativeHandle():number;

Buffer
