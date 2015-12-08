import GomlTreeNodeBase = require('../../GomlTreeNodeBase');
import Canvas = require('../../../Core/Canvas');
class CanvasNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      'width': {
        value: 128,
        converter: 'number',
      },
      'height': {
        value: 128,
        converter: 'number',
      },
      'clearColor': {
        value: '#0FF',
        converter: 'color4',
      },
      'loader':
      {
        value: undefined,
        converter: 'string',
      }
    });
    this.attributes.getAttribute('width').on('changed', ((attr) => {
      this.sizeChanged(attr.Value, this.attributes.getValue('height'));
    }).bind(this));
    this.attributes.getAttribute('height').on('changed', ((attr) => {
      this.sizeChanged(this.attributes.getValue('width'), attr.Value);
    }).bind(this));
    this.attributes.getAttribute('clearColor').on('changed', ((attr) => {
      this.canvas.ClearColor = attr.Value;
    }).bind(this));
  }

  public beforeLoad() {
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
