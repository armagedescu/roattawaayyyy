    
document.addEventListener('DOMContentLoaded',
   function (event)
   {
      browser.runtime.sendMessage (  { chessObject: { gametype : "PGN_OR_FEN_board" } }  )
	            .then
                (
                   (request) =>
                   {
                       console.log("on DOMContentLoaded message: " + request.chessObject.gametype);
                       console.log("on DOMContentLoaded message: " + request.chessObject.content);
                       console.log("on DOMContentLoaded message: " + request.chessObject.imgPath);
					   board_doc_main(request.chessObject);
                   }
				);
      console.log("Popup DOMContentLoaded send message end");

   }
);

//browser specific timer implementation
//FF requires nsITimer
//all other browsers will use standard mechanism,
//with Stub aliases, for portability

var clearTimeoutStub = clearTimeout;
var setTimeoutStub   = setTimeout;

//Event Wrapper for event interface, firefox only
//Stub, for compatibility with Firefox
function timerWrapper () {}


