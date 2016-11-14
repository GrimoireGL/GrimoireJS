const xmldom = require("xmldom");
global.DOMParser = xmldom.DOMParser;

exports.default=xmldom;
