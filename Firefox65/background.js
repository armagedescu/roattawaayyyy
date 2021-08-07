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
      playBoard   (info, tab, {height : 350, width : 350}, "mini18");
   }
   catch (err)
   {
   }
}

function menuCommandPlayMediumBoard (info, tab)
{
   try
   {
       playBoard   (info, tab, {height : 450, width : 450}, "medium35");
   }
   catch (err)
   {
   }
}

function playBoard (info, tab, windowAttributes, imagePath)
{
   //let selection = info.selectionText;
   var createData =
   {
      type  : "detached_panel",
      url   : "board.html",
      width : windowAttributes.width,
      height: windowAttributes.height

   };

   let requestData =
      {
         chessObject:
         {
            gametype : "PGN_OR_FEN_board",
            content :  info.selectionText,
            imgPath : imagePath
         }
      };
   try
   {
      console.log ("Play Board: " + imagePath);
      console.log ("Selection: " + info.selectionText);

      let creating = browser.windows.create(createData);
      
      function onGameDataExchange(request)
      {
          browser.runtime.onMessage.removeListener(onGameDataExchange);
          return Promise.resolve(requestData);
      }

      browser.runtime.onMessage.addListener (onGameDataExchange);

      console.log ("opened board.html");

   }
   catch (err)
   {
      console.log ("error, not opened");
      console.log ("main background playBoard()> " + err);
      throw "main background playBoard()> " + err;
   }
}
