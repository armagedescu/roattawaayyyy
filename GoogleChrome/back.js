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

function onGameDataExchange(request, sender, sendResponse)
{
  //browser.runtime.onMessage.removeListener(onGameDataExchange);
   //return Promise.resolve('salut response');
   return 'salut response';
}
function playBoard (info, tab, windowAttributes, imagePath)
{
   try
   {
      open("pop.html", "myWindow", windowAttributes);

	  console.log("background adding listener");
	  //browser.runtime.onMessage.addListener (onGameDataExchange);
	  if ( ! chrome.extension.onRequest.hasListener (onGameDataExchange))
		chrome.extension.onRequest.addListener (onGameDataExchange);
	  console.log("background adding listener end");
      //setTimeout(function()
	  //     {
      //        try
      //        {
	  //           var selection = "";
	  //           if (info.selectionText) selection = info.selectionText;
      //           chrome.extension.sendRequest
      //              (
      //                 {
      //                    chessObject:
      //                    {
      //                       gametype : "PGN_OR_FEN_board",
      //                       content : selection,
      //                       imgPath : imagePath
      //                    }
      //                 },
      //                 function(response)
      //                 {
      //                    console.log(response.info);
      //                 }
      //              );
      //        }catch(err){}
      //     }, 100);
   }
   catch (err)
   {
      console.log( "Error: main background playBoard()> " + err);
   }
}
