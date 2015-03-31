
//TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
//TODO: make drag&drop compatible with safari
function allowDrop(ev, chessGame)
{
   try
   {
      ev.returnValue = false; // same as event.preventDefault();
   }
   catch (err)
   {
      chessGame.insertLog.call(chessGame, err);
   }
}

function drag(ev, chessGame)
{
   try
   {
      ev.dataTransfer.setData("Text", ev.srcElement.id); //same as ev.target.id for mozilla kind
   }
   catch (err)
   {
      chessGame.insertLog.call (chessGame, err)
   };
}

function drop(ev, chessGame)
{
   try
   {

      var data = ev.dataTransfer.getData("Text");  //let's keep in source/target communication style
      chessGame.BoardClick (data,         true); //move from.id, d&d source
      chessGame.BoardClick (ev.srcElement.id, true); //move to.id, d&d target
   }
   catch (err)
   {
      chessGame.insertLog("drop error: " + err);
   }
}

function cellClick(ev, chessGame)
{
   try
   {
      chessGame.BoardClick.call(chessGame, ev.srcElement.id, true); //"this" reffers to cellClick owner, = the img element
   }
   catch (err)
   {
      chessGame.insertLog.call(chessGame, "err: cellClick(): " + err);
   }
}

function bodyKeyPress (ev, chessGame)
{
   try
   {
      switch (ev.keyCode)
      {
      case 27:
        window.close();
        break;
      }
   }
   catch (err)
   {
      alert (err);
      chessGame.insertLog.call(chessGame, "err: cellClick(): " + err);
   }
}
//TODO: check for compatibility with IE
//TODO: move browser specific message handlers and listeners to browser_listener.js
function updateListeners(chessGame)
{
   var currentGame = chessGame;
   try
   {
      //TODO: buttons to be added dynamically
      document.body.attachEvent ('onkeydown', function (ev) {bodyKeyPress(ev, currentGame);});

      document.getElementById ( 'btnFlipBoard'   ).attachEvent      ( 'onclick', function() {currentGame.btnFlipBoardListener.call(currentGame);}      );
      document.getElementById ( 'btnInit'        ).attachEvent      ( 'onclick', function() {currentGame.btnInitListener.call(currentGame);}           );
      document.getElementById ( 'btnMoveBack'    ).attachEvent      ( 'onclick', function() {currentGame.btnMoveBackListener.call(currentGame);}       );
      document.getElementById ( 'btnMoveForward' ).attachEvent      ( 'onclick', function() {currentGame.btnMoveForwardListener.call(currentGame);}    );
      document.getElementById ( 'btnMoveLast'    ).attachEvent      ( 'onclick', function() {currentGame.btnMoveLastListener.call(currentGame);}       );
      document.getElementById ( 'btnGetFEN'      ).attachEvent      ( 'onclick', function() {currentGame.btnGetFENListener.call(currentGame);}         );
      document.getElementById ( 'btnShowFENList' ).attachEvent      ( 'onclick', function() {currentGame.btnShowFENListListener.call(currentGame);}    );
      document.getElementById ( 'btnPlay'        ).attachEvent      ( 'onclick', function() {currentGame.btnPlayListener.call(currentGame);}           );

      var celId = "";
      for (ii = 0; ii < 64; ii++)
      {
         cellId = "" + ii;
         cell = document.getElementById(cellId);
		 //TODO: IE drag&drop, piece move effect probably needed there
         cell.attachEvent    ('onclick',       function (ev) {cellClick(ev, currentGame);});
         cell.attachEvent    ('ondragstart',   function (ev) {drag      (ev, currentGame);}     );
         cell.attachEvent    ('ondrop',        function (ev) {drop      (ev, currentGame);}     );
         //according to MSDN both required to prevent default, in order to allow drop event
         cell.attachEvent    ('ondragover',    function (ev) {allowDrop (ev, currentGame);});
         cell.attachEvent    ('ondragenter',   function (ev) {allowDrop (ev, currentGame);});
      }
   }
   catch (err)
   {
      alert(err.description);
      //don't rethrow "updateListeners(isFlipped=" + isFlipped + ")\n" + err ? err : "[NULLERROR]";
   }
}

function board_doc_main (chessObject)
{
   var chessGame = null;
   try
   {
      chessGame = new IVFChessGame (chessObject.imgPath + "/", chessObject.content, updateListeners);
      chessGame.variable_reset.call(chessGame);  //TODO: try less ctoring
   }
   catch (err)
   {
      alert("main thread start error>>" + err);
      chessGame.insertLog.call (chessGame, "err norethrow, main thread start: " + err);
   }
}