import GomlTreeNodeBase = require('../../GomlTreeNodeBase');
import Canvas = require('../../../Core/Canvas');
class CanvasNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      'width': {
        value: 128,
        converter: 'number',
        onchanged: (attr) => {
          this.sizeChanged(attr.Value, this.attributes.getValue('height'));
        },
      },
      'height': {
        value: 128,
        converter: 'number',
        onchanged: (attr) => {
          this.sizeChanged(this.attributes.getValue('width'), attr.Value);
        },
      },
      'clearColor': {
        value: '#0FF',
        converter: 'color4',
        onchanged: (attr) => {
          this.canvas.ClearColor = attr.Value;
        },
      },
      'loader': {
        value: undefined,
        converter: 'string',
      }
    });
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
    this.attributes.setValue('width', this.DefaultWidth);
    this.attributes.setValue('height', this.DefaultHeight);
  }

  private canvas: Canvas;

  protected setCanvas(canvas: Canvas) {
    this.canvas = canvas;
    this.sizeChanged(this.DefaultWidth, this.DefaultHeight);
  }

  public get Canvas(): Canvas {
    return this.canvas;
  }

  protected sizeChanged(width: number, height: number) {

  }

  protected get DefaultWidth(): number {
    return 0;
  }

  protected get DefaultHeight(): number {
    return 0;
  }
}

export = CanvasNodeBase;
