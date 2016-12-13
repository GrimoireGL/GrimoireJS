import xmlReaderInitializer from './_TestUtility/XMLReaderInitializer';
import test from 'ava';
import xmldom from 'xmldom';

import XMLReader from '../../lib-es5/Base/XMLReader';

test('parseXML behaves correctly', (t) => {
    const parsedDocument = XMLReader.parseXML(require("./_TestResource/XMLReader_Case1.xml"),"Goml");
    t.truthy(parsedDocument[0].localName === "goml");
    t.throws(() => XMLReader.parseXML(">","Goml"));
});
