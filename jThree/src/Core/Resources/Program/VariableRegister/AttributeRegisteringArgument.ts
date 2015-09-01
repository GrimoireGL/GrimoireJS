import AttributeRegisteringConfigure = require("./AttributeRegisteringConfigure");
import Buffer = require("../../Buffer/Buffer");

interface
    AttributeRegisteringArgument
{
    [name:string]:Buffer;
}

export = AttributeRegisteringArgument;