//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

//The only global variable,
//in FF should be placed in HTML inline javascript
//because in FF script is evaluated twice,
//and initialized variable is reset back to null
//keep comment for diffs
var current_IVFChessGame = null;
// safari bridge to board_doc_main
function playBoard()
{
   try
   {
      var boardType =  window.location.search.match("[\?&]boardType=([^&]+)")[1];
	  var PGN = decodeURIComponent(window.location.search.match("[\?&]PGN=([^&]+)")[1]);

      board_doc_main
         (
            {
                gametype : "PGN_OR_FEN_board",
                content : PGN,
                imgPath : boardType
            }
         );
   }catch(err)
   {
      alert("playBoard()\n" + err ? err : "[NULL ERROR]");
   }
}
//browser specific timer implementation
//FF requires nsITimer
//all other browsers will use standard mechanism,
//with Stub aliases, for portability

var clearTimeoutStub = clearTimeout;
var setTimeoutStub   = setTimeout;

//Event Wrapper for event interface, firefox only
//Stub, for compatibility with Firefox
function timerWrapper() {}

playBoard();