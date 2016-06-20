/**
 * Unique ID generator for jThree objects.
 * @type {[type]}
 */
class JThreeID {
    /**
     * Generate random string
     * @param  {number} length length of random string
     * @return {string}        generated string
     */
    public static getUniqueRandom(length: number): string {
        return Math.random().toString(36).slice(-length);
    }
}

export default JThreeID;
