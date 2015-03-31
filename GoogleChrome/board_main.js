
//TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
//TODO: make drag&drop compatible with safari
function allowDrop(ev, chessGame)
{
   try
   {
      ev.preventDefault();
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
      ev.dataTransfer.setData("Text", ev.target.id); //let's keep in source/target communication style, however not really required
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
      ev.preventDefault(); //TODO: check if need to prevent default
      var data = ev.dataTransfer.getData("Text");  //let's keep in source/target communication style
      chessGame.BoardClick (data,         true); //move from.id, d&d source
      chessGame.BoardClick (ev.target.id, true); //move to.id, d&d target
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
      chessGame.BoardClick.call(chessGame, ev.target.id, true); //"this" reffers to cellClick owner, = the img element
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
      document.body.addEventListener ('keydown', function (ev) {bodyKeyPress(ev, currentGame);}, false);

      document.getElementById ( 'btnFlipBoard'   ).addEventListener      ( 'click', function() {currentGame.btnFlipBoardListener.call(currentGame);},    false  );
      document.getElementById ( 'btnInit'        ).addEventListener      ( 'click', function() {currentGame.btnInitListener.call(currentGame);},         false  );
      document.getElementById ( 'btnMoveBack'    ).addEventListener      ( 'click', function() {currentGame.btnMoveBackListener.call(currentGame);},     false  );
      document.getElementById ( 'btnMoveForward' ).addEventListener      ( 'click', function() {currentGame.btnMoveForwardListener.call(currentGame);},  false  );
      document.getElementById ( 'btnMoveLast'    ).addEventListener      ( 'click', function() {currentGame.btnMoveLastListener.call(currentGame);},     false  );
      document.getElementById ( 'btnGetFEN'      ).addEventListener      ( 'click', function() {currentGame.btnGetFENListener.call(currentGame);},       false  );
      document.getElementById ( 'btnShowFENList' ).addEventListener      ( 'click', function() {currentGame.btnShowFENListListener.call(currentGame);},  false  );
      document.getElementById ( 'btnPlay'        ).addEventListener      ( 'click', function() {currentGame.btnPlayListener.call(currentGame);},         false  );

      var celId = "";
      for (ii = 0; ii < 64; ii++)
      {
         cellId = "" + ii;
         cell = document.getElementById(cellId);
         cell.addEventListener    ('click',     function (ev) {cellClick(ev, currentGame);}, false);

         //TODO: one more d&d handler may be needed here, as required by IE and maybe by Safari
         cell.addEventListener    ('dragstart', function(ev){drag      (ev, currentGame);}, false);
         cell.addEventListener    ('dragover',  function(ev){allowDrop (ev, currentGame);}, false);
         cell.addEventListener    ('drop',      function(ev){drop      (ev, currentGame);}, false);
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