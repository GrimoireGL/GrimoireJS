import JThreeObject from "./JThreeObject";
/**
 * Unique ID generator for jThree objects.
 * @type {[type]}
 */
class JThreeID extends JThreeObject {
    /**
     * Random characters being used for generating unique id.
     * @type {string}
     */
    private static _randomChars: string = "abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";

    /**
     * Generate random string
     * @param  {number} length length of random string
     * @return {string}        generated string
     */
    public static getUniqueRandom(length: number): string {
        let random = "";
        for (let i = 0; i < length; i++) {
            random += JThreeID._randomChars.charAt(Math.random() * JThreeID._randomChars.length);
        }
        return random;
    }
}

export default JThreeID;
