//Google chrome specific script

console.log("enter global>");
const contexts = ["selection", "page"];
const roattaMenuInfo     =  {
                               id: "Roatta Waaayyyy!!!",        title: "Roatta waayyy!!!",
                               subMenus:
                               [
                                  {
                                     id:"Roatta Waaayyyy!!! small",  title: "Play Small",
                                     game: {imgPath: "mini18",   windowAttributes: {url: "board.html", type:"popup", height : 350, width : 350}}
                                  },
                                  {
                                     id:"Roatta Waaayyyy!!! medium", title: "Play Medium",
                                     game: {imgPath: "medium35", windowAttributes: {url: "board.html", type:"popup", height: 450,  width: 450}}
                                  }
                               ]
                            };

chrome.runtime.onInstalled.addListener(

   (details)=>
   {
      console.log("on installing");

      chrome.contextMenus.create({"id":roattaMenuInfo.id, "title": roattaMenuInfo.title, "contexts": contexts});

      for (let menu of roattaMenuInfo.subMenus)
          chrome.contextMenus.create({id:menu.id, "title":menu.title, "contexts":contexts, "parentId": roattaMenuInfo.id})

      console.log("on installed");
   }
);
chrome.contextMenus.onClicked.addListener(
   (clickData, tab) =>
   {
      console.log("menu item click id" + clickData.menuItemId);
      for (let menu of roattaMenuInfo.subMenus)
      {
         if (clickData.menuItemId === menu.id)
         {
            playBoard (clickData, menu.game);
            return;
         }
      }
   }
);

function playBoard (clickData, game)
{
   console.log("worker play board with: " + clickData.selectionText);
   try
   {
      let gameObject = {
                     chessObject:
                     {
                        gametype : "PGN_OR_FEN_board",
                        content : clickData.selectionText,
                        imgPath : game.imgPath
                     }
                  };

      let windowPromise = chrome.windows.create(game.windowAttributes);
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
