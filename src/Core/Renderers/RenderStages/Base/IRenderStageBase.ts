import Scene from "../../../Scene";
interface IRenderStageBase {
  /**
   * Obtain the geometry name related to technique index;
   * @param  {number} techniqueIndex [the index of technique]
   * @return {string}                [geometry name]
   */
  getTarget(techniqueIndex: number): string;

  /**
   * Get the count of technique related to specified scene.
   * @param  {Scene}  scene [the scene going to be rendered]
   * @return {number}       [the count of technique]
   */
  getTechniqueCount(scene: Scene): number;
}

export default IRenderStageBase;
