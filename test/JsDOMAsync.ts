const jsdom = require("jsdom");
const {JSDOM} = jsdom;
export default function(html: string, arr: any): Promise<any> {
  return Promise.resolve((new JSDOM(html)).window);
}
