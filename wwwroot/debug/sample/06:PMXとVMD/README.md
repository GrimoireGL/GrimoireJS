# 06:PMXとVMD
## 概要
PMXモデルとVMDファイルも使える

## コード説明
### PMX及びVMD

```xml
<pmx src="/resource/model/Tune/Tune.pmx">
  <vmd src="/resource/motion/melt2.vmd" autoSpeed="1.0" enabled="true"/>
</pmx>
```

vmdは例外的にであるが、pmxの小要素として作用する。 モデルなどのリソースは、複数個同じものを読み込む際は、複数個タグを書くとパフォーマンスに響くように思えるが、自動的に一回のみの解決を行うため問題はない。
