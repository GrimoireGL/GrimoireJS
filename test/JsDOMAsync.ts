const jsdom = require("jsdom");
export default function(html: string, arr: any): Promise<any> {
  return new Promise((resolve, reject) => {
    jsdom.env(html, arr, (err, window) => {
      if (err) {
        reject(err);
      } else {
        resolve(window);
      }
    });
  });
};
