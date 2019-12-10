/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function () {
  Office.initialize = function (reason) {
    // If you need to initialize something you can do so here.
  };
})();


Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

// /**
//  * Shows a notification when the add-in command is executed.
//  * @param event 
//  */
// function action(event: Office.AddinCommands.Event) {
//   const message: Office.NotificationMessageDetails = {
//     type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
//     message: "Performed action.",
//     icon: "Icon.80x80",
//     persistent: true
//   }

//   // Show a notification message
//   Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);

//   // Be sure to indicate when the add-in command function is complete
//   event.completed();
// }

function getGlobal() {
  return (typeof self !== "undefined") ? self :
    (typeof window !== "undefined") ? window :
      (typeof global !== "undefined") ? global :
        undefined;
}

const g = getGlobal() as any;

// the add-in command functions need to be available in global scope
// g.action = action;



// var config;
// var btnEvent;

// The initialize function must be run each time a new page is loaded.
// Office.initialize = function (reason) {
// };

// Add any ui-less function here.
// function showError(error) {
//   Office.context.mailbox.item.notificationMessages.replaceAsync('github-error', {
//     type: 'errorMessage',
//     message: error
//   }, function (result) {
//   });
// }

let btnEvent;
var config;

function insertDefaultGist(event) {
  // Office.context.document.setSelectedDataAsync("ExecuteFunction works. Button ID=" + event.source.id,
  //   function (asyncResult) {
  //     var error = asyncResult.error;
  //     if (asyncResult.status === Office.AsyncResultStatus.Failed) {
  //       // Show error message.
  //     }
  //     else {
  //       // Show success message.
  //     }
  //   });
  btnEvent = event;
  Office.onReady(() =>  Office.context.ui.displayDialogAsync('https://localhost:3000/dialog.html', {height: 90, width: 60, displayInIframe: true}, function(result) {
    let settingsDialog = result.value;
    // settingsDialog.close()
    // settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, receiveMessage);
    settingsDialog.addEventHandler(Office.EventType.DialogEventReceived, dialogClosed);
  }))
  // Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html', {height: 80, width: 80, displayInIframe: false});
  // event.completed();
}

// function receiveMessage(message) {
//   config = JSON.parse(message.message);
//   setConfig(config, function(result) {
//     settingsDialog.close();
//     settingsDialog = null;
//     btnEvent.completed();
//     btnEvent = null;
//   });
// }

function dialogClosed(message) {
  btnEvent.completed();
  btnEvent = null;
}


g.insertDefaultGist = insertDefaultGist;



// function insertDefaultGist(event) {
//   const item = Office.context.mailbox.item;

//   item.body.prependAsync(
//     '<b>Greetings!</b>',
//     { coercionType: Office.CoercionType.Html, 
//     asyncContext: { var3: 1, var4: 2 } },
//     function (asyncResult) {
//       event.completed();
//     });

//   // Implement your custom code here. The following code is a simple example.  
//   Office.context.document.setSelectedDataAsync("ExecuteFunction works. Button ID=" + event.source.id,
//     function (asyncResult) {
//       var error = asyncResult.error;
//       if (asyncResult.status === Office.AsyncResultStatus.Failed) {
//         // Show error message.
//       }
//       else {
//         // Show success message.
//       }
//     });

//   // Calling event.completed is required. event.completed lets the platform know that processing has completed. 
//   event.completed();
// }




