import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');
interface AttributeDeclation
{
	name:string;
	
	converter:string;
	
	handler?:Delegates.Action1<GomlAttribute>;
}
