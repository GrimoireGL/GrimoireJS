import JThreeObject=require('Base/JThreeObject');

class JThreeID extends JThreeObject
{
  private static randomChars:string="abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";

  public static getUniqueRandom(length: number): string {
      var random: string = "";
      for (var i = 0; i < length; i++) {
          random += JThreeID.randomChars.charAt(Math.random() * JThreeID.randomChars.length);
      }
      return random;
  }
}

export=JThreeID;
