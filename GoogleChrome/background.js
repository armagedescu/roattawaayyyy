//Google chrome specific script

console.log("enter global>");
var idRoatta     = "Roatta Waaayyyy!!!";
var idMiniBoard  = "Roatta Waaayyyy!!! small";
var idMediuBoard = "Roatta Waaayyyy!!! medium";
chrome.runtime.onInstalled.addListener(

   (details)=>
   {
      console.log("on installing");
      idRoatta      = chrome.contextMenus.create({"id":idRoatta,     "title": "Roatta waayyy!!!", "contexts":["selection", "page"]});
      idMiniBoard   = chrome.contextMenus.create({"id":idMiniBoard,  "title": "Play Small",       "contexts":["selection", "page"], "parentId": idRoatta});
      idMediuBoard  = chrome.contextMenus.create({"id":idMediuBoard, "title": "Play Medium",      "contexts":["selection", "page"], "parentId": idRoatta});
      chrome.contextMenus.onClicked.addListener(menuItemClick);
      console.log("on installed");
   }
)
function menuItemClick(clickData, tab)
{
   console.log("menu item click id" + clickData.menuItemId);
   switch (clickData.menuItemId)
   {
   case idMiniBoard:
      menuCommandPlaySmallBoard  (clickData);
      return;
   case idMediuBoard:
      menuCommandPlayMediumBoard (clickData);
      return;
   }
   
}
function menuCommandPlaySmallBoard (clickData)
{
   try
   {
      playBoard   (clickData, "mini18", {url: "board.html", type:"popup", height : 350, width : 350});
   }
   catch (err)
   {
      console.log( "Error: menuCommandPlaySmallBoard()> " + err);
   }
}
function menuCommandPlayMediumBoard (clickData)
{
   try
   {
      playBoard   (clickData, "medium35", {url: "board.html", type:"popup", height: 450, width: 450});
   }
   catch (err)
   {
      console.log( "Error: menuCommandPlayMediumBoard()> " + err);
   }
}

function playBoard (clickData, imgPath, windowAttributes)
{
   console.log("worker play board with: " + clickData.selectionText);
   try
   {
      let gameObject = {
                     chessObject:
                     {
                        gametype : "PGN_OR_FEN_board",
                        content : clickData.selectionText,
                        imgPath : imgPath
                     }
                  };

      let windowPromise = chrome.windows.create(windowAttributes);
      windowPromise.then((wnd) => {
         chrome.runtime.onMessage.addListener (
               function __playBoardCallback__ (request, sender, sendResponse)
               {
                  if (sender.tab?.id === wnd.tabs[0].id)
                  {
                     console.log("worker onMessage: " + JSON.stringify(request));
                     chrome.runtime.onMessage.removeListener(__playBoardCallback__);
                     sendResponse(gameObject);
                  }
               }
            );
      });

   }
   catch (err)
   {
      console.log( "Error: playBoard()> " + err);
   }
}
