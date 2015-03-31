function flipBoard ()
{
   //never anymore write the board from scratch
   //by using board*Writer functions
   //don't generate anymore HTML text
   try
   {
      current_IVFChessGame.inverse ^= 1;

	  var chessBoard = current_IVFChessGame.board.gameTBodyElement;
	  var firstChild = chessBoard.firstChild;
	  for (var i = 0; i < 7; i++)
	  {
	     var lastChild  = chessBoard.lastChild;
	     chessBoard.insertBefore (lastChild, firstChild);
	  }

	  for (var i = 0; i < 8; i++)
	  {
	     var chessTRow = chessBoard.childNodes[i];
		 var firstChild = chessTRow.firstChild;
		 for (var j = 0; j < 7; j++)
		 {
	        var lastChild  = chessTRow.lastChild;
			chessTRow.insertBefore (lastChild, firstChild);
		 }
	  }
      current_IVFChessGame.UpdateBoardAndPieceImages();

   }catch(err)
   {
      alert(err);
   }
}

function boardGameWriter (tableBoardBorderTd)
{
   try
   {
      var pp = current_IVFChessGame.PGNViewImagePath;

	  //standard start game setup
      var ll = [ pp + "br.gif", pp + "bn.gif", pp + "bb.gif", pp + "bq.gif", pp + "bk.gif", pp + "bb.gif", pp + "bn.gif", pp + "br.gif",
                 pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif",
                 pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                 pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                 pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                 pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                 pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif",
                 pp + "wr.gif", pp + "wn.gif", pp + "wb.gif", pp + "wq.gif", pp + "wk.gif", pp + "wb.gif", pp + "wn.gif", pp + "wr.gif"  ];

      var cellId = "";
      var imgIdx = 0;

      var tableElement = document.createElement("table");
      tableElement.border      = 0;
      tableElement.cellPadding = 0;
      tableElement.cellSpacing = 0;
      current_IVFChessGame.board.gameTBodyElement = document.createElement("tbody");

      var tableTBodyTrElement;
      var tableTBodyTrTdElement;
      var tableTBodyTrTdImgElement;

      var ii  = 0;
      var tri = 0;
      var tdi = 0;
      
      var bImagePath = current_IVFChessGame.PGNViewImagePath + "b.gif";
      var wImagePath = current_IVFChessGame.PGNViewImagePath + "w.gif";

      for (tri = 0; tri < 8; tri++)
      {
         tableTBodyTrElement = document.createElement("tr");
         for (tdi = 0; tdi < 8; tdi++, ii++) //tdi = 0..7; ii = 0..63 <=> tri * 8 + tdi
         {
            tableTBodyTrTdElement = document.createElement("td");

            if ((tri + tdi) & 1) tableTBodyTrTdElement.setAttribute('background', bImagePath);
            else                 tableTBodyTrTdElement.setAttribute('background', wImagePath);
         
            tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
         
            imgIdx = ii;
            if(current_IVFChessGame.inverse) imgIdx = 64 - (ii + 1);
            cellId = "" + imgIdx;
            
            // Chess Piece ream images from the game here. First update, setup with no game started
            tableTBodyTrTdImgElement = document.createElement("img"); //TODO: is it the right place to do that?
            tableTBodyTrTdImgElement.id = cellId;
            tableTBodyTrTdImgElement.src =  ll[imgIdx];
            tableTBodyTrTdElement.appendChild(tableTBodyTrTdImgElement);
         
         }
         current_IVFChessGame.board.gameTBodyElement.appendChild(tableTBodyTrElement);
      }

      tableElement.appendChild(current_IVFChessGame.board.gameTBodyElement);

      tableBoardBorderTd.appendChild(tableElement);//add to the outer board table now
    }catch(err)
    {
       alert('error: boardGameWriter() ' + err);
    }
}

function boardWriter()
{
   try
   {

       var tableElement = document.createElement("table");
       tableElement.border      = 0;
       tableElement.cellPadding = 0;
       tableElement.cellSpacing = 0;

       var tableTBodyElement = document.createElement("tbody");
       var tableTBodyTrElement = document.createElement("tr");
       var tableTBodyTrTdElement = document.createElement("td");  //1-8 image here

       current_IVFChessGame.board.IMGNumersElement = document.createElement("img");
       tableTBodyTrTdElement.appendChild(current_IVFChessGame.board.IMGNumersElement);
       tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
       tableTBodyElement.appendChild(tableTBodyTrElement);
    
       tableTBodyTrTdElement = document.createElement("td");

       boardGameWriter(tableTBodyTrTdElement); //game goes here
       tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
       
       tableTBodyTrElement = document.createElement("tr");
       
       tableTBodyTrTdElement = document.createElement("td"); //flip
       tableTBodyTrTdElement.id = 'btnFlipBoard';
       current_IVFChessGame.board.IMGFlipElement = document.createElement("img"); 

       tableTBodyTrTdElement.appendChild(current_IVFChessGame.board.IMGFlipElement);
       tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
       tableTBodyTrTdElement = document.createElement("td");      //A-H image here
       current_IVFChessGame.board.IMGLettersElement = document.createElement("img");
       tableTBodyTrTdElement.appendChild(current_IVFChessGame.board.IMGLettersElement);
    
       tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
       tableTBodyElement.appendChild(tableTBodyTrElement);
    
       tableElement.appendChild(tableTBodyElement);
    
       current_IVFChessGame.chess_board.appendChild(tableElement);
       
       current_IVFChessGame.UpdateBoardAndPieceImages();

	   //once listeners are set, no need for reattach/update listeners anymore
       //TODO: probably board_main better place
       updateListeners ();

    }catch(err)
    {
       alert('error: boardGameWriter() ' + err);
    }

}

function btnFlipBoardListener   () {try { flipBoard();                                   } catch (err)  { alert(err); }    } //TODO: move Move* functions to class member
function btnInitListener        () {try { current_IVFChessGame.Init('');                 } catch (err)  { alert(err); }    } 
function btnMoveBackListener    () {try { MoveBack(1);                                   } catch (err)  { alert(err); }    }
function btnMoveForwardListener () {try { MoveForward(1);                                } catch (err)  { alert(err); }    }
function btnMoveLastListener    () {try { MoveForward(1000);                             } catch (err)  { alert(err); }    }
function btnGetFENListener      () {try { GetFEN();                                      } catch (err)  { alert(err); }    }
function btnShowFENListListener () {try { ShowFENList();                                 } catch (err)  { alert(err); }    }
function btnPlayListener        () {try { current_IVFChessGame.SwitchAutoPlay();         } catch (err)  { alert(err); }    }

//TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
//TODO: make drag&drop compatible with safari
function allowDrop(ev)
{
   try
   {
      ev.preventDefault();
   }
   catch (err)
   {
      current_IVFChessGame.insertLog(err);
   }
}

function drag(ev)
{
   try
   {
      ev.dataTransfer.setData("Text", ev.target.id); //let's keep in source/target communication style, however not really required
   }
   catch (err)
   {
      current_IVFChessGame.insertLog(err)
   };
}

function drop(ev)
{
   try
   {
      ev.preventDefault(); //TODO: check if need to prevent default
      var data = ev.dataTransfer.getData("Text");  //let's keep in source/target communication style
	  BoardClick (data,         true); //move from.id, d&d source
      BoardClick (ev.target.id, true); //move to.id, d&d target
   }
   catch (err)
   {
      current_IVFChessGame.insertLog("drop error: " + err);
   }
}

//COMPATIBILITY: workaround for Drag&Drop in Safari
//Unlike any web browser Safari fails to fire drop event.
var dragEnterElementId = -1;
function dragEnter (ev)
{
   try
   {
      ev.preventDefault();
	  dragEnterElementId = ev.target.id;
   }
   catch (err)
   {
      current_IVFChessGame.insertLog(err);
   }
}
//COMPATIBILITY: workaround for Drag&Drop in Safari
function handleDragEnd(ev)
{
   try
   {
      ev.preventDefault(); //TODO: check if need to prevent default
	  current_IVFChessGame.insertLog("handleDragEnd: from " + ev.target.id + " handleDragEnd to " + dragEnterElementId);
	  BoardClick (ev.target.id,       true); //move from.id, d&d source
      BoardClick (dragEnterElementId, true); //move to.id, d&d target
	  return true;
   }
   catch (err)
   {
      current_IVFChessGame.insertLog("err: handleDragEnd(): " + err);
   }
}

function cellClick()
{
   try
   {
      BoardClick (this.id, true); //"this" reffers to cellClick owner, = the img element
   }
   catch (err)
   {
      current_IVFChessGame.insertLog("err: cellClick(): " + err);
   }
}

function bodyKeyPress (ev)
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
      current_IVFChessGame.insertLog("err: cellClick(): " + err);
   }
}
//TODO: no need of reusing, check for compatibility with IE
function updateListeners()
{
   try
   {
      document.body.addEventListener ('keydown', bodyKeyPress, false);

      document.getElementById ( 'btnFlipBoard'   ).addEventListener      ( 'click', btnFlipBoardListener,    false  );
      document.getElementById ( 'btnInit'        ).addEventListener      ( 'click', btnInitListener,         false  );
      document.getElementById ( 'btnMoveBack'    ).addEventListener      ( 'click', btnMoveBackListener,     false  );
      document.getElementById ( 'btnMoveForward' ).addEventListener      ( 'click', btnMoveForwardListener,  false  );
      document.getElementById ( 'btnMoveLast'    ).addEventListener      ( 'click', btnMoveLastListener,     false  );
      document.getElementById ( 'btnGetFEN'      ).addEventListener      ( 'click', btnGetFENListener,       false  );
      document.getElementById ( 'btnShowFENList' ).addEventListener      ( 'click', btnShowFENListListener,  false  );
      document.getElementById ( 'btnPlay'        ).addEventListener      ( 'click', btnPlayListener,         false  );

      var celId = "";
      for (ii = 0; ii < 64; ii++)
      {
         cellId = "" + ii;
         cell = document.getElementById(cellId);
         cell.addEventListener    ('click',     cellClick, false);

         //TODO: one more d&d handler may be needed here, as required by IE and maybe by Safari
         cell.addEventListener    ('dragstart', drag,                                  false);
         cell.addEventListener    ('dragover',  allowDrop,                             false);

		 //COMPATIBILITY: does not occur in Safari
         cell.addEventListener    ('drop',      drop,                                  false);
		 
		 //COMPATIBILITY: required to workaround Safari
		 cell.addEventListener    ('dragenter', dragEnter,                             false);
		 cell.addEventListener    ('dragend',   handleDragEnd,                         false); 
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
   try
   {
      parser_reset_main (chessObject.imgPath + "/"); //TODO: wrap document object into the class
      boardWriter ();
      current_IVFChessGame.startParsingDetect_FEN_PGN (chessObject.content); //TODO: too many initialization functions
   }
   catch (err)
   {
      alert("main thread start error>>" + err);
      current_IVFChessGame.insertLog ("err norethrow, main thread start: " + err);
   }
}