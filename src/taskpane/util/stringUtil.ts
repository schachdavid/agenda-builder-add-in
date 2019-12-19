
/**
 * Replaces the last occurrence of the given string
 * 
 * @param find 
 * @param replace 
 * @param sourceString 
 */
export function replaceLast(find: string, replace:string, sourceString: string) {
    var lastIndex = sourceString.lastIndexOf(find);
    
    if (lastIndex === -1) {
        return sourceString;
    }
    
    var beginString = sourceString.substring(0, lastIndex);
    var endString = sourceString.substring(lastIndex + find.length);
    
    return beginString + replace + endString;
}
