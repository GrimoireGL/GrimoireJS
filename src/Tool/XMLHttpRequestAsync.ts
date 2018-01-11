/**
 * async wrapper for XMLHttpRequest
 */
export default class XMLHttpRequestAsync {
  /**
   * send request async
   * @param xhr request
   * @param data data to send
   */
  public static async send(xhr: XMLHttpRequest, data?: Document | string): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
      xhr.onload = (e) => {
        resolve(e);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.send(data);
    });
  }
}
