import JThreeObject from "./JThreeObject";
/**
 * Unique ID generator for jThree objects.
 * @type {[type]}
 */
class JThreeID extends JThreeObject {
    /**
     * Generate random string
     * @param  {number} length length of random string
     * @return {string}        generated string
     */
    static getUniqueRandom(length) {
        let random = "";
        for (let i = 0; i < length; i++) {
            random += JThreeID._randomChars.charAt(Math.random() * JThreeID._randomChars.length);
        }
        return random;
    }
}
/**
 * Random characters being used for generating unique id.
 * @type {string}
 */
JThreeID._randomChars = "abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";
export default JThreeID;
