
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
      let data = ev.dataTransfer.getData("Text");  //let's keep in source/target communication style
      chessGame.BoardClick (data,         true); //move from.id, d&d source
      chessGame.BoardClick (ev.target.id, true); //move to.id, d&d target
   }
   catch (err)
   {
      console.log ("board_doc_main:drop> " + err);
   }
}

function cellClick(ev, chessGame)
{
   try
   {
      chessGame.BoardClick (ev.target.id, true);
   }
   catch (err)
   {
      console.log ("board_doc_main:cellClick> " + err);
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
   let currentGame = chessGame;
   try
   {
      //TODO: buttons to be added dynamically
      document.body.addEventListener ('keydown', (ev) => {bodyKeyPress(ev, currentGame);}, false);

      document.getElementById ( 'btnFlipBoard'   ).addEventListener      ( 'click', () => {currentGame.btnFlipBoardListener();  },  false  );
      document.getElementById ( 'btnInit'        ).addEventListener      ( 'click', () => {currentGame.btnInitListener();       },  false  );
      document.getElementById ( 'btnMoveBack'    ).addEventListener      ( 'click', () => {currentGame.btnMoveBackListener();   },  false  );
      document.getElementById ( 'btnMoveForward' ).addEventListener      ( 'click', () => {currentGame.btnMoveForwardListener();},  false  );
      document.getElementById ( 'btnMoveLast'    ).addEventListener      ( 'click', () => {currentGame.btnMoveLastListener();   },  false  );
      document.getElementById ( 'btnGetFEN'      ).addEventListener      ( 'click', () => {currentGame.btnGetFENListener();     },  false  );
      document.getElementById ( 'btnShowFENList' ).addEventListener      ( 'click', () => {currentGame.btnShowFENListListener();},  false  );
      document.getElementById ( 'btnPlay'        ).addEventListener      ( 'click', () => {currentGame.btnPlayListener();       },  false  );

      let celId = "";
      for (ii = 0; ii < 64; ii++)
      {
         cellId = "" + ii;

         let cell = document.getElementById(cellId);
         cell.addEventListener    ('click',     (ev) => {cellClick (ev, currentGame);}, false);

         //TODO: one more d&d handler may be needed here, as required by IE and maybe by Safari
         cell.addEventListener    ('dragstart', (ev) => {drag      (ev, currentGame);}, false);
         cell.addEventListener    ('dragover',  (ev) => {allowDrop (ev, currentGame);}, false);
         cell.addEventListener    ('drop',      (ev) => {drop      (ev, currentGame);}, false);
      }
   }
   catch (err)
   {
      console.log("board_doc_main:updateListeners> " + err);
   }
}

function board_doc_main (chessObject)
{
   let chessGame = null;
   try
   {
      let chessBoard = document.getElementById('chess_board');
      chessGame = new IVFChessGame (chessObject.imgPath + "/", chessObject.content, updateListeners, chessBoard);
   }
   catch (err)
   {
      console.log("board_doc_main:error> " + err);
   }
}