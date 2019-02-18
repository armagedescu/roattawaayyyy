{//Firefox
   console.log("salut");
   var id      = chrome.contextMenus.create({"title": "Roattta waayyy!!!!", "contexts":["selection", "page"]});
   var childId = chrome.contextMenus.create({"title": "Play Small",         "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlaySmallBoard});
   var childId = chrome.contextMenus.create({"title": "Play Medium",        "contexts":["selection", "page"], "parentId": id, "onclick": menuCommandPlayMediumBoard});
   console.log("add context menus");
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

function onCreated(windowInfo) {
  console.log(`Created window: ${windowInfo.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}
function playBoard (info, tab, windowAttributes, imagePath)
{
   var createData = {
     type: "detached_panel",
     url: "pop.html?boardType=zzzzz&PGN=" + info.selectionText,
     //url: "pop.html",
     width: 250,
     height: 100
   };
   try
   {
      console.log ("Play Board: " + imagePath);
      console.log (info.selectionText);
      console.log ("Extension URL: " + browser.extension.getURL("pop.html?boardType=zzzzz&PGN=" + info.selectionText));
	  //var pop = window.open ("about:blank", "zzz");
	  //var pop = window.open (browser.extension.getURL("pop.html"), "zzz");
	  var creating = browser.windows.create(createData);
	  creating.then(onCreated, onError);
	  console.log (creating);
	  //var pop = window.open (browser.extension.getURL("pop.html"), "zzz", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
	  //console.log (pop);
	  //var pop = window.open ("pop.html", "zzz", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
	  //var pop = window.open ("https://www.newsru.com", "zzz", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
	  
	  console.log ("opened pop.html");
      //open("pop.html", "myWindow", windowAttributes);
      //open("board.html", "myWindow", windowAttributes);
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
      throw "main background playBoard()> " + err;
   }
}
