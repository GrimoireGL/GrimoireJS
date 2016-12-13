export default class XMLHttpRequestAsync {
  public static send(xhr: XMLHttpRequest, data?: Document | string): Promise<Event> {
    return new Promise((resolve, reject) => {
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
