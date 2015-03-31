//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

//The only global variable,
//in FF should be placed in HTML inline javascript
//because in FF script is evaluated twice,
//and initialized variable is reset back to null
//keep comment for diffs
var current_IVFChessGame = null;

// IE bridge to board_doc_main
function playBoard()
{
   try
   {
      var boardType =  window.location.search.match("[\?&]boardType=([^&]+)")[1];
      switch(boardType)
      {
      case "mini18":
         window.dialogHeight = "210px";
         window.dialogWidth  = "200px";
         break;
      case "medium35":
         window.dialogHeight = "350px";
         window.dialogWidth  = "380px";
         break;
      }

      board_doc_main
         (
            {
                gametype : "PGN_OR_FEN_board",
                content : external.menuArguments.document.selection.createRange().text,
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

function timerWrapper(){}

playBoard();