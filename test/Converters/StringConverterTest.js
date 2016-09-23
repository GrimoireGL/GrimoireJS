import StringConveter from "../../lib-es5/Converters/StringConverter";

test('StringConverter should convert collectly',(t)=>{
  t.truthy(StringConverter("HELLO") === "HELLO" );
});