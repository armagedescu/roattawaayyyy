//Opera specific script


////being handled Ok
//document.addEventListener("contextmenu", handleContextMenu, false);
//function handleContextMenu(event)
//{
//    //safari.self.tab.setContextMenuEventUserInfo(event, event.target.nodeName);
//    alert('inject.js handle context menu');
//}
//document.addEventListener
//(
//    'contextmenu',
//    function ()
//    {
//	    alert("document.addEventListener handling 'contextmenu': " + event);
//	    safari.self.tab.setContextMenuEventUserInfo(event, window.getSelection());
//	},
//    false
//);

//if (window.top === window)
    safari.self.addEventListener("message", selfHandleMessage, false);
function selfHandleMessage(msgEvent)
{
    var messageName = msgEvent.name;
    var messageData = msgEvent.message;
	var selectionStr;
	try
	{
	    selectionStr = document.getSelection().toString();
	}catch(err)
	{
		selectionStr  = null;
	}
	if(!selectionStr) selectionStr = "";
	selectionStr = selectionStr.replace(/(^\s*|\s*$)/gi, ""); //trim
	if(selectionStr === "" || selectionStr == "") selectionStr  = null;
	
	if (selectionStr)
	{
	    selectionStr = encodeURIComponent(selectionStr);
        if (messageName === "messagePlayRoattaBoard")
	    {
	        try
	    	{
               if (messageData === "mini18")
	    	   {
	    	      open(safari.extension.baseURI + "board.html?boardType=mini18&PGN=" + selectionStr, "myWindow", "status = 1, height = 210px, width = 210px, resizable = 0, scrollbars=0");
               }else if (messageData === "medium35")
	    	   {
	    	      open(safari.extension.baseURI + "board.html?boardType=medium35&PGN=" + selectionStr, "myWindow", "status = 1, height = 350px, width = 380px, resizable = 0, scrollbars=0");
               }
	    	}
	    	catch(err)
	    	{
	    	   alert("error inject.js\nhandling message with selfHandleMessage: '" + messageName + "';\n" + err);
	    	}
        }
	}
}

//alert('self add event listener');
//safari.self.addEventListener("message", handleMessage, false);

//function playBoard   (info, tab, windowAttributes, imagePath)
//{
//   try
//   {
//      open("board.html", "myWindow", windowAttributes);
//      setTimeout(function()
//	       {
//              try
//              {
//               chrome.extension.sendRequest
//                   (
//                      {
//                         chessObject:
//                         {
//                            gametype : "PGN_OR_FEN_board",
//                            content : info.selectionText,
//                            imgPath : imagePath
//                         }
//                      },
//                      function(response)
//                      {
//                         console.log(response.info);
//                      }
//                   );
//              }catch(err){}
//           }, 100);
//   }catch(err)
//   {
//      throw "main background playBoard()> " + err;
//   }
//}
