//Google chrome specific script

console.log("global> add context menus");
var id      = chrome.contextMenus.create({"id":"Roatta Waaayyyy!!!",        "title": "Roatta waayyy!!!", "contexts":["selection", "page"]});
var childId = chrome.contextMenus.create({"id":"Roatta Waaayyyy!!! small",  "title": "Play Small",       "contexts":["selection", "page"], "parentId": id}); //, "onClicked": menuCommandPlaySmallBoard});
var childId = chrome.contextMenus.create({"id":"Roatta Waaayyyy!!! medium", "title": "Play Medium",      "contexts":["selection", "page"], "parentId": id}); //, "onClicked": menuCommandPlayMediumBoard});
console.log("back.js:global> added context menus");

function menuCommandPlaySmallBoard (info)
{
   try
   {
      playBoard   (info, "mini18", {url: "board.html", type:"popup", height : 350, width : 350});
   }
   catch (err)
   {
      console.log( "Error: menuCommandPlaySmallBoard()> " + err);
   }
}
function menuCommandPlayMediumBoard (info)
{
   try
   {
      playBoard   (info, "medium35", {url: "board.html", type:"popup", height: 450, width: 450});
   }
   catch (err)
   {
      console.log( "Error: menuCommandPlayMediumBoard()> " + err);
   }
}

function onGameDataExchange(request, sender, sendResponse)
{
   return 'salut response';
}

chrome.contextMenus.onClicked.addListener((info, tab) =>
{
    console.log("menus.onClicked:menuId> "     + info.menuItemId);
    console.log("menus.onClicked:selection> " + info.selectionText);
    let imgPath = "", windowCreation = {};
    if (info.menuItemId === "Roatta Waaayyyy!!! small")
        menuCommandPlaySmallBoard (info);
    else if (info.menuItemId === "Roatta Waaayyyy!!! medium")
        menuCommandPlayMediumBoard (info);
	console.log("menus.onClicked:menuId> end");
});

function playBoard (info, imgPath, windowAttributes)
{
   try
   {
      let gameObject = {
                     chessObject:
                     {
                        gametype : "PGN_OR_FEN_board",
                        content : info.selectionText,
                        imgPath : imgPath
                     }
                  };
      let windowPromise = chrome.windows.create(windowAttributes);
      windowPromise.then((value) => {
        console.log("menus.Clicked.Listener:window.then> " + JSON.stringify(value));
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) =>
            {
              console.log("onMessage> " + gameObject.chessObject.content);
              sendResponse(gameObject);
            }
          );
      });

   }
   catch (err)
   {
      console.log( "Error: playBoard()> " + err);
   }
}
