/**
 * Collection of helper functions to use the JS Office API.
 *
 * @file This files exports function which are simplifying the
 * interaction between the Agenda Builder and the JS Office Mailbox API.
 * @license MIT
 */



/**
 *  Calls Office.context.mailbox.item.body.getAsync to get the result and returns
 *  it using promise to enable async/await pattern.
 * 
 *  @return {Promise<Office.AsyncResult<string>>} the result as a Promise
 */
export const getAsyncMailBody = async (): Promise<Office.AsyncResult<string>> => {
    return new Promise(resolve => {
        Office.context.mailbox.item.body.getAsync(
            "html",
            function callback(result) {
                resolve(result);
            }
        );
    });
}