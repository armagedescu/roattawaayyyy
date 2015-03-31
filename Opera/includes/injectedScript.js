//Opera specific injected script
//runs in the context of the page
//from there is possible to call any standard HTML/JavaScript specific

opera.extension.onmessage = function(event)
    {
       try
       {
          var message = event.data;
          var chessObject;
          if (message.chessObject)
             chessObject = message.chessObject;
          else
             return;
          if (chessObject.gametype == 'PGN_OR_FEN_board')
          {
             opera.postError("post back");
			 var selectionStr = encodeURIComponent(document.getSelection ().toString());
             event.source.postMessage({
                           chessObject:
                           {
                              gametype : chessObject.gametype,
                              content  : selectionStr,
                              imgPath  : chessObject.imgPath,
                              height   : chessObject.height,
                              width    : chessObject.width
                           }
                        });          
          }
       }
       catch (err)
       {
          opera.postError("caught error in injected: " + err);
       }
    };