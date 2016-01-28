﻿# CoffeeScript
Transformer = require '../../../src/Core/Transform/Transformer'
SceneObject = require '../../../src/Core/SceneObject'
Quaternion = require '../../../src/Math/Quaternion'
Matrix = require '../../../src/Math/Matrix'
Vector3 = require '../../../src/Math/Vector3'

assertChildTransform = (o1,o2) ->
    assert Matrix.equal o2.Transformer.LocalToGlobal,Matrix.multiply o2.Transformer.LocalTransform,o1.Transformer.LocalToGlobal
    undefined
    

describe 'Transformer',->
    obj1 = new SceneObject();
    obj2 = new SceneObject();
    obj3 = new SceneObject();
    
    beforeEach -> 
        obj1.addChild obj2
        obj2.addChild obj3
    
    describe 'Rotation',->
        it 'rotation should work for children', ->
            obj1.Rotation = Quaternion.Euler(10,20,30);
            assertChildTransform obj1,obj2
            assertChildTransform obj2,obj3
            undefined
    describe 'Position',->
        it 'position should work for children',->
            obj1.Position = new Vector3(10,30,50);
            assertChildTransform obj1,obj2
            assertChildTransform obj2,obj3
            undefined
    describe 'Scale',->
        it 'scale should work for children',->
            obj1.Scale = new Vector3(1,2,3);
            assertChildTransform obj1,obj2
            assertChildTransform obj2,obj3
            undefined
            