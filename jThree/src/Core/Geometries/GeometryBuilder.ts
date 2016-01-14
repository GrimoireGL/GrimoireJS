import Vector3 = require("../../Math/Vector3");
class GeometryBuilder
{
  public static addQuad(pos: number[], normal: number[], uv: number[], index: number[], points: Vector3[]): void {
      var startIndex = pos.length / 3;
      var v0 = points[0], v1 = points[1], v3 = points[2];
      var v02v1 = v1.subtractWith(v0);
      var v02v3 = v3.subtractWith(v0);
      var v2 = v0.addWith(v02v1).addWith(v02v3);
      var nV = v02v1.crossWith(v02v3).normalizeThis();
      normal.push(nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z);
      uv.push(0, 1, 0, 0, 1, 0, 1, 1);
      pos.push(v0.X, v0.Y, v0.Z, v1.X, v1.Y, v1.Z, v2.X, v2.Y, v2.Z, v3.X, v3.Y, v3.Z);
      index.push(startIndex, startIndex + 1, startIndex + 3, startIndex + 3, startIndex + 1, startIndex + 2);
  }

  public static addCircle(pos: number[], normal: number[], uv: number[], index: number[], divide: number, center: Vector3, normalVector: Vector3, tangentVector: Vector3):void {
      var tan2 = Vector3.cross(tangentVector, normalVector);
      var vecCount = 2 + divide;
      var baseIndex = uv.length / 2;
      for (var i = 0; i < vecCount; i++) {
          var v: Vector3 = GeometryBuilder.calcNextPointInCircle(i, divide, center, tangentVector, tan2);
          var u = GeometryBuilder.calcUVInCircle(i, divide);
          pos.push(v.X, v.Y, v.Z);
          normal.push(normalVector.X, normalVector.Y, normalVector.Z);
          uv.push(u[0], u[1]);
      }
      for (var i = 0; i < divide; i++) {
          index.push(baseIndex);
          index.push(baseIndex + i + 2);
          index.push(baseIndex + i + 1);
      }
  }

  private static calcUVInCircle(index: number, divCount: number): number[] {
      if (index == 0) return [0, 0];
      var angle = (index - 1) * 2 * Math.PI / divCount;
      return [Math.cos(angle), Math.sin(angle)];
  }

  private static calcNextPointInCircle(index: number, divCount: number, center: Vector3, tan: Vector3, tan2: Vector3): Vector3 {
      var angle = (index - 1) * 2 * Math.PI / divCount;
      return index === 0 ? center :
          Vector3.add(center, Vector3.add(tan.multiplyWith(Math.sin(angle)), tan2.multiplyWith(Math.cos(angle))));
  }

  public static addCylinder(pos: number[], normal: number[], uv: number[], index: number[], divide: number, start: Vector3, end: Vector3, tangent: Vector3, radius: number):void {
      var dest: Vector3 = Vector3.subtract(end, start);
      var tangentNormalized: Vector3 = tangent.normalizeThis();
      var tan2: Vector3 = Vector3.cross(dest.normalizeThis(), tangentNormalized);
      tangentNormalized = tangentNormalized.multiplyWith(radius);
      tan2 = tan2.multiplyWith(radius);
      for (var i = 0; i < divide; i++) {
          var angle = (i - 1) * 2 * Math.PI / divide;
          var angleTo = i * 2 * Math.PI / divide;
          var currentNormal = Vector3.add(tan2.multiplyWith(Math.cos(angle)), tangentNormalized.multiplyWith(Math.sin(angle)));
          var nextNormal = Vector3.add(tan2.multiplyWith(Math.cos(angleTo)), tangentNormalized.multiplyWith(Math.sin(angleTo)));
          var v0 = Vector3.add(start, currentNormal);
          var v1 = Vector3.add(start, nextNormal);
          var v2 = Vector3.add(v0, dest);
          var v3 = v1.addWith(dest);
          var startIndex = pos.length / 3;
          normal.push(currentNormal.X, currentNormal.Y, currentNormal.Z,
              nextNormal.X, nextNormal.Y, nextNormal.Z,
              nextNormal.X, nextNormal.Y, nextNormal.Z,
              currentNormal.X, currentNormal.Y, currentNormal.Z);
          uv.push(0, 1, 1, 0, 1, 0, 0, 0);
          pos.push(v0.X, v0.Y, v0.Z, v1.X, v1.Y, v1.Z, v3.X, v3.Y, v3.Z, v2.X, v2.Y, v2.Z);
          index.push(startIndex+2, startIndex + 1, startIndex, startIndex+3, startIndex + 2, startIndex);
      }
  }
  public static addSphere(pos: number[], normal: number[], uv: number[], index: number[], divide1: number, divide2: number, center: Vector3, r: number):void {
      var vt=Vector3.add(center,new Vector3(0,r,0));
      var vb=Vector3.add(center,new Vector3(0,-r,0));
      pos.push(vt.X,vt.Y,vt.Z);
      normal.push(0,1,0);
      uv.push(0, 1);
      for(var i=0;i<divide1-1;i++){
        var angle_y = (i + 1) * Math.PI / divide1;
        var d=r*Math.sin(angle_y);
        var h=r*Math.cos(angle_y);
        for(var j=0;j<divide2;j++){
          var angle_x = j * 2 * Math.PI / divide2;
          var currentNormal=new Vector3(d*Math.sin(angle_x),0,d*Math.cos(angle_x));

          var v0 = Vector3.add(new Vector3(0,h,0), currentNormal);
          var v0_n=v0.normalizeThis();
          var startIndex = pos.length / 3;

          pos.push(v0.X, v0.Y, v0.Z);
          normal.push(v0_n.X, v0_n.Y, v0_n.Z);
          uv.push(0, 1);

          if(i==0){
            if(j==0){
            }else if(j==divide2-1){
              index.push(0, startIndex-1, startIndex);
              index.push(0,startIndex,1)
            }else{
              index.push(0, startIndex-1, startIndex);
            }
          }else {
            if(j==0){
              //index.push(startIndex-divide2, startIndex-1, startIndex);
              index.push(startIndex-divide2, startIndex, startIndex-divide2+1);
            }else if(j==divide2-1){
              index.push(startIndex-divide2,startIndex-1,startIndex);
              index.push(startIndex-divide2+1,startIndex-divide2-divide2+1,startIndex);
              index.push(startIndex-divide2-divide2+1,startIndex-divide2,startIndex);
            }else{
              index.push(startIndex-divide2,startIndex-1,startIndex);
              index.push(startIndex-divide2+1,startIndex-divide2,startIndex);
            }
          }
        }
          var startIndex = pos.length / 3;
          index.push(0,startIndex-1,divide2*i);
      }

      var startIndex = pos.length / 3;
      pos.push(vb.X,vb.Y,vb.Z);
      normal.push(0,-1,0);
      uv.push(0, 1);
      for(var j=0;j<divide2-1;j++){
        index.push(startIndex,startIndex-1-j,startIndex-2-j);
      }
      index.push(startIndex,startIndex-divide2,startIndex-1);
  }
  public static addCone(pos: number[], normal: number[], uv: number[], index: number[], divide: number):void {
      var top=new Vector3(0,1,0);
      pos.push(0,-1,0);
      normal.push(0,-1,0);
      uv.push(0, 1);
      var angle = 2*Math.PI / divide;
      var y=Math.sqrt(5)/5.0;
      var k=y*2;

      for(var i=0;i<divide;i++){
        var d1=Math.sin(angle*i);
        var d2=Math.cos(angle*i);

        var v=new Vector3(d1,-1,d2);
        var vn=new Vector3(d1*k,y,d2*k);

        var startIndex = pos.length / 3;
        pos.push(v.X,v.Y,v.Z,v.X,v.Y,v.Z,0,1,0);
        uv.push(0, 1,0,1,0,1);
        normal.push(vn.X,vn.Y,vn.Z,0,-1,0,vn.X,vn.Y,vn.Z);

        if(i!=0){
          index.push(startIndex-1,startIndex-3,startIndex);
          index.push(0,startIndex-2,startIndex+1)
        }
      }
      startIndex=pos.length/3-1;
      index.push(startIndex,startIndex-2,1);
      index.push(0,startIndex-1,2);

  }
}

export = GeometryBuilder;
