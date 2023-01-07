
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
	  console.log("board_doc_main:allowDrop> " + err);
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
	  console.log("board_doc_main:drag> " + err);
   };
}

function drop(ev, chessGame)
{
   try
   {
      ev.preventDefault(); //TODO: check if need to prevent default
      var data = ev.dataTransfer.getData("Text");  //let's keep in source/target communication style
      chessGame.BoardClick.call (chessGame, data,         true); //move from.id, d&d source
      chessGame.BoardClick.call (chessGame, ev.target.id, true); //move to.id, d&d target
   }
   catch (err)
   {
	  console.log("board_doc_main:drop> " + err);
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
	  console.log("board_doc_main:cellClick> " + err);
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
      console.log("board_doc_main:bodyKeyPress> " + err);
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
      console.log("board_doc_main:updateListeners> " + err);
   }
}

function board_doc_main (chessObject)
{
   var chessGame = null;
   try
   {
      var errDiv = document.getElementById("error_div");  
      var chessBoard = document.getElementById('chess_board');
      chessGame = new IVFChessGame (chessObject.imgPath + "/", chessObject.content, updateListeners, errDiv, chessBoard);
	  chessGame.variable_reset.call(chessGame);  //TODO: try less ctoring
   }
   catch (err)
   {
      console.log("board_doc_main:error> " + err);
   }
}