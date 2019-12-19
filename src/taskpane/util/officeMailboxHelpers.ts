
/**
 *  calls Office.context.mailbox.item.body.getAsync
 *  returns a promise with the result to allow to use await
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