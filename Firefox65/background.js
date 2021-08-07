{//Firefox
   console.log("Creating context menus");
   var id      = chrome.contextMenus.create({"title": "Roattta waayyy!!!!", "contexts":["selection", "page"]});
   var childId = chrome.contextMenus.create({"title": "Play Small",         "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlaySmallBoard});
   var childId = chrome.contextMenus.create({"title": "Play Medium",        "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlayMediumBoard});
   console.log("Context menus created");
}

function menuCommandPlaySmallBoard (info, tab)
{
   try
   {
      playBoard   (info, tab, "status = 1, height = 350, width = 350, resizable = 0, scrollbars=0", "mini18");
   }
   catch (err)
   {
   }
}

function menuCommandPlayMediumBoard (info, tab)
{
   try
   {
       playBoard   (info, tab, "status = 1, height = 450, width = 450, resizable = 0, scrollbars=0", "medium35");
   }
   catch (err)
   {
   }
}

function handleResponse(message)
{
   console.log("background.handleResponse");
   console.log(`background script sent a response: ${message.response}`);
   console.log("background.handleResponse end");
}

function handleError(error)
{
   console.log("background.handleError");
   console.log(`Error: ${error}`);
   console.log("background.handleError end");
}

function onCreated(windowInfo, request)
{
   console.log("background.sending onCreated ");

   browser.windows.get(windowInfo.id).then
   (
      (wnd) =>
      {
		 console.log("background.onCreated Creation listener there is: "  + wnd.id);
         //chrome.runtime.sendMessage
         browser.runtime.sendMessage(request);
         //({
         //      chessObject:
         //      {
         //         gametype : "PGN_OR_FEN_board",
         //         //content : selection,
         //         //imgPath : imagePath
         //      }
         //});
		 console.log("background.onCreated sent message");
      }
   );

   console.log("background.sending onCreated end");
}

function onError(error) {
  console.log("background.sending onError");
  //console.log(`Error: ${error}`);
  console.log("background.sending onError end");
}

function playBoard (info, tab, windowAttributes, imagePath)
{
   let selection = info.selectionText;
   var createData = {
      type  : "detached_panel",
      url   : "pop.html?boardType=" + imagePath + "&PGN=" + encodeURIComponent(info.selectionText),
      width : 250,
      height: 100

   };

   let request =
      {
         chessObject:
         {
            gametype : "PGN_OR_FEN_board",
            content : selection,
            imgPath : imagePath
         }
      };
   try
   {
      console.log ("Play Board: " + imagePath);
      console.log (info.selectionText);
      console.log ("Extension URL: " + browser.runtime.getURL("pop.html?boardType=" + imagePath + "&PGN=" + encodeURIComponent(info.selectionText)));
      console.log ("Extension URL: " + browser.runtime.getURL("pop.html?boardType=" + imagePath + "&PGN=" + decodeURIComponent(encodeURIComponent(info.selectionText))));

      let creating = browser.windows.create(createData);
      creating.then((inf) => {onCreated (inf, request)}, onError);


      console.log ("opened pop.html");

   }
   catch (err)
   {
      console.log ("error, not opened");
      console.log ("main background playBoard()> " + err);
      throw "main background playBoard()> " + err;
   }
}
