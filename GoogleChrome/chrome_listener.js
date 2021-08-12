//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

//The only global variable,
//in FF should be placed in HTML inline javascript
//because in FF script is evaluated twice,
//and initialized variable is reset back to null
//keep comment for diffs


console.log("document.addEventListener");
document.addEventListener('DOMContentLoaded',
   (event) =>
   {
     chrome.extension.sendRequest
        (
           {
              chessObject:
              {
                 gametype : "PGN_OR_FEN_board"
              }
           },
           (request) =>
           {
              console.log("response received: " + JSON.stringify(request));
              if (request.chessObject.gametype == "PGN_OR_FEN_board")
              {
                 board_doc_main(request.chessObject);    
              }
           }
        );
      console.log("Popup DOMContentLoaded send message end");

   }
);
console.log("document.addEventListener end");

var clearTimeoutStub = clearTimeout;
var setTimeoutStub   = setTimeout;

//Event Wrapper for event interface, firefox only
//Stub, for compatibility with Firefox
function timerWrapper () {}
