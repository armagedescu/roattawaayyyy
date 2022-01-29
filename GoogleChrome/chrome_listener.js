//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

// chrome bridge to board_doc_main
document.addEventListener('DOMContentLoaded',
   (event) =>
   {
      chrome.runtime.sendMessage({ chessObject: { gametype : "PGN_OR_FEN_board" } },
          (request) => //in fact is response, but is requested response
          {
             console.log("response> " + JSON.stringify(request));
             board_doc_main(request.chessObject);
          });
      console.log("Popup DOMContentLoaded send message end");
      
   }
);

//FF requires nsITimer
//all other browsers will use standard mechanism,
//with Stub aliases, for portability

var clearTimeoutStub = clearTimeout;
var setTimeoutStub   = setTimeout;

//Event Wrapper for event interface, firefox only
//Stub, for compatibility with Firefox
function timerWrapper () {}
