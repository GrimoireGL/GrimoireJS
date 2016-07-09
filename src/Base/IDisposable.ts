/**
 * Provides a mechanism for releasing resources like GL resources.
 *
 * When this interface is implemented in a class, `dispose` method in the class is intended to be called when the class is released.
 */
interface IDisposable {
 /**
  * Release resources
  */
  dispose();
}

export default IDisposable;
