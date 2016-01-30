import Vector2 from "../Math/Vector2";
import CanvasRegion from "./Canvas/CanvasRegion";
/**
 * The event args object interface to be used in mouse related event in CanvasRegion
 *
 * CanvasRegionクラスでのマウス関連イベントで使われるイベント引数のインターフェース
 */
interface IMouseEventArgs {
  /**
   * Whether the mouse pointer was entered the region by this event calling.
   *
   * このイベント呼び出しにより指定領域にマウスポインタが侵入したかどうか。
   * @type {boolean}
   */
  enter: boolean;

  /**
   * Whether the mouse pointer was leave the region by this event calling.
   *
   * このイベント呼び出しにより指定領域からマウスポインタが出たかどうか。
   * @type {boolean}
   */
  leave: boolean;

  /**
   * Whether the mouse pointer is on the region
   *
   * マウスポインタが指定領域内にあるかどうか
   * @type {boolean}
   */
  mouseOver: boolean;

  /**
   * Mouse position normalized in [0,1]
   *
   * 　閉区間[0,1]に正規化されているマウス座標
   * @type {Vector2}
   */
  mousePosition: Vector2;

  /**
   * The region this event rised
   *
   * このイベントを発火させたCanvasRegion
   * @type {CanvasRegion}
   */
  region: CanvasRegion;
}
export default IMouseEventArgs;
