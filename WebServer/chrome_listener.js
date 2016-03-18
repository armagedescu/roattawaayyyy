//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

//The only global variable,
//in FF should be placed in HTML inline javascript
//because in FF script is evaluated twice,
//and initialized variable is reset back to null
//keep comment for diffs

// chrome bridge to board_doc_main
chrome.extension.onRequest.addListener
(     
   function(request, sender, sendResponse)
   {
      console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
      if (request.chessObject.gametype == "PGN_OR_FEN_board")
      {
		 board_doc_main(request.chessObject);	
      }
      else
      {
         sendResponse({});
         return;
      }
   }
)
//browser specific timer implementation
//FF requires nsITimer
//all other browsers will use standard mechanism,
//with Stub aliases, for portability

var clearTimeoutStub = clearTimeout;
var setTimeoutStub   = setTimeout;

//Event Wrapper for event interface, firefox only
//Stub, for compatibility with Firefox
function timerWrapper () {}
