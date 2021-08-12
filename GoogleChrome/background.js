//Google chrome specific script

console.log("salut");
var id      = chrome.contextMenus.create({"title": "Roatta waayyy!!!", "contexts":["selection", "page"]});
var childId = chrome.contextMenus.create({"title": "Play Small",       "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlaySmallBoard});
var childId = chrome.contextMenus.create({"title": "Play Medium",      "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlayMediumBoard});
console.log("add context menus");

function menuCommandPlaySmallBoard (info, tab)
{
   console.log("play small board");
   try
   {
      playBoard   (info, tab, {url:"board.html", type: "popup", height: 350, width: 350}, "mini18");
   }
   catch (err)
   {
      console.log("error: background - " + err);
   }
}
function menuCommandPlayMediumBoard (info, tab)
{
   try
   {
      playBoard   (info, tab, {url:"board.html", type: "popup", height: 450, width: 450}, "medium35");
   }
   catch (err)
   {
      console.log("error: background - " + err);
   }
}

function playBoard (info, tab, windowAttributes, imagePath)
{
   try
   {
       let request = {
                        chessObject:
                        {
                           gametype : "PGN_OR_FEN_board",
                           content : info.selectionText,
                           imgPath : imagePath
                        }
                     };

      chrome.windows.create(windowAttributes);
      
      function onGameDataExchange(boardrequest, sender, sendResponse)
      {
         chrome.extension.onRequest.removeListener(onGameDataExchange);
         console.log("OnDataExchange");
         sendResponse (request);
         return Promise.resolve('onGameDataExchange response');
      }

      console.log("background adding listener");
      chrome.extension.onRequest.addListener (onGameDataExchange);
      console.log("background adding listener end");
   }
   catch (err)
   {
      console.log( "Error: main background playBoard()> " + err);
   }
}

