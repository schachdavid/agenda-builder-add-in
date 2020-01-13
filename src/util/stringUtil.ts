/**
 * Collection of utility functions to work with JS string.
 *
 * @file This files exports functions which can be reused in 
 * the Agenda Builders react components to work with JS strings.
 * @license MIT
 */


/**
 * Replaces the last occurrence of the given string
 * 
 * @param find 
 * @param replace 
 * @param sourceString 
 */
export const replaceLast = (find: string, replace: string, sourceString: string) => {
    var lastIndex = sourceString.lastIndexOf(find);

    if (lastIndex === -1) {
        return sourceString;
    }

    var beginString = sourceString.substring(0, lastIndex);
    var endString = sourceString.substring(lastIndex + find.length);

    return beginString + replace + endString;
}

/**
 * Returns the word for a number, e.g. for 0 it returns "First".
 * Only works for numbers smaller than 4 and bigger or equal 0.
 * 
 * @param number 
 */
export const numberToWord = (number: number) => {
    switch (number) {
        case 0:
           return "First"
        case 1:
            return "Second"
        case 2:
            return "Third"
        case 3:
            return "Fourth"
        default:
            return "unknown"
    }
}