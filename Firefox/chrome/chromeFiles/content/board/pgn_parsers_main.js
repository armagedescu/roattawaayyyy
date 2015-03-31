// LT-PGN-VIEWER 3.48 (c) Lutz Tautenhahn (2001-2008)

//TODO: correct document.BoardForm.FEN to xdocument.BoardForm.FEN
//TODO: make xdocument_gen a variable
function xdocument_gen()
{

   this.BoardForm =
      {
         PgnMoveText  : { value         : new String("") } ,
         Position     : { value         : new String("1")} ,
         AutoPlay     : new String()                       ,
         Url          : { value         : new String()}    ,
         OpenParsePgn : { selectedIndex : new String()}    ,

         FEN : {
               value       : new String(),
               PgnMoveText :
               {
                  value : new String()
               }
            }
      };

   this.layers = new String();

   this.game = 
      {
         prop : new Array(),
         move : new Array()
      };

   var imagesCount = 128; //private
   this.images = new Array(imagesCount);   
   for(var i = 0; i < imagesCount; i++)
   {
      this.images[i] =
         {
            style:
            {
               borderColor: "#000000"
            }
         };
   }
   
}

function IVFChessGame(imgPath, chessContent, listenerUpdater)
{
//{events
this.btnFlipBoardListener   = function () {try { this.flipBoard();              } catch (err)  { alert(err); }    } //TODO: move Move* functions to class member
this.btnInitListener        = function () {try { this.Init('');                 } catch (err)  { alert(err); }    } 
this.btnMoveBackListener    = function () {try { this.MoveBack(1);              } catch (err)  { alert(err); }    }
this.btnMoveForwardListener = function () {try { this.MoveForward(1);           } catch (err)  { alert(err); }    }
this.btnMoveLastListener    = function () {try { this.MoveForward(1000);        } catch (err)  { alert(err); }    }
this.btnGetFENListener      = function () {try { this.GetFEN();                 } catch (err)  { alert(err); }    }
this.btnShowFENListListener = function () {try { this.ShowFENList();            } catch (err)  { alert(err); }    }
this.btnPlayListener        = function () {try { this.SwitchAutoPlay();         } catch (err)  { alert(err); }    }
//}end events
    var errordiv = null;
    var xdocument = null;  //document stub/simulator TODO: to remove

    //public:
    this.inverse = 0; //public
    this.board = //public
	   {
              gameTBodyElement:null,
              IMGNumersElement:null,
              IMGLettersElement:null,
              IMGFlipElement:null
	   };
    this.PGNViewImagePath = imgPath;
    this.chess_board = null; //TODO: not used

    //private:
	var contentSelectedText = chessContent; //readonly
    var ScriptPath       = "http://www.lutanho.net/pgn/";
    var MaxMove          = 500;
    var isInit           = false;
    var isCalculating    = false;
    var StartMove        = null;
    var MoveCount        = null;
    var MoveType         = null;
    var CanPass          = null;
    var EnPass           = null;
    var CurVar           = 0;
    var activeAnchor     = -1;
    var startAnchor      = -1;
    var activeAnchorBG   = "#CCCCCC";
    var TargetDocument   = null;
    var isSetupBoard     = false;
    var BoardSetupMode   = 'copy';
    var dragX            = null;
    var dragY            = null;
    var dragObj          = null;
    var dragBorder       = null;
    var dragImgBorder    = null;
    var dragImg   = null;
    var dragPiece = null;
    var isDragDrop       = false;
    var isAnimating      = false;
    var isExecCommand    = true;
    var BoardPic         = null;
    var ParseType        = 1;
    var AnnotationFile   = "";
    var ImagePathOld     = "-";
    var ImageOffset      = 0;
    var IsLabelVisible   = true;
    var Border           = 1;
    var BorderColor      = "#404040";
    var ScoreSheet       = 0;
    var BGColor          = "";
    //var isRotated        = false;
    this.isRecording      = false;
    this.isNullMove       = true;
    this.RecordCount      = 0;
    this.RecordedMoves    = "";
    this.SkipRefresh      = 0;
    this.AutoPlayInterval = null; //TODO: to remove this
    this.isAutoPlay       = false;
    this.Delay            = 1000;
    var BoardClicked     = -1;
    this.isCapturedPieces = false;
    this.CandidateStyle   = "";

    var PieceName        = "KQRBNP";
    var ShowPieceName    = "KQRBNP";
    var StandardFen      = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    var FenString        = StandardFen;
///////////////////////////////////////////////
    var OldCommands = null;
    var NewCommands = null;

    var ShortPgnMoveText = null;

    var Piece = null;
    var PieceCode  = null;
    var PiecePic   = null;

    var ColorName = null;
    var Castling  = null;
    this.Board     = null;

    var HalfMove = null;

    var HistMove = null;
    var HistCommand = null;
    var HistPiece = null;
    var HistType  = null;
    var HistPosX  = null;
    var HistPosY  = null;

    var MoveArray = null;

    var LabelPic   = null;
    var Annotation = null;
    var DocImg     = null;


    IVFChessGame.ChessPiece = //static
       {
          Pos:
          {
             X:
             {
                _A:0, _B:1, _C:2, _D:3, _E:4, _F:5, _G:6, _H:7
             },
             Y:
             {
                _1:0, _2:1, _3:2, _4:3, _5:4, _6:5, _7:6, _8:7
             }
          },
          Type:
          {
             None     : -1,
             King     :  0,
             Queen    :  1,
             Rock     :  2,
             Bishop   :  3,
             Knight   :  4,
             Pawn     :  5
          },
          Color:
          {
             White : 0, Black : 1
          }
       };
///////////////////////////////////////////////
    this.timeProcessor = new timerWrapper(this);
///////////////////////////////////////////////
    //TODO: split very long function variable_reset
    this.variable_reset = function()
    {
       var chessGame = this;
       errordiv    = document.getElementById("error_div");           //from static HTML content
       this.chess_board = document.getElementById('chess_board');    //from static HTML content
       ScriptPath = "http://www.lutanho.net/pgn/";
       xdocument = new xdocument_gen();


       this.isRecording=false;


       //chessdiv    = document.getElementById("chess_div");           //from static HTML content
       MaxMove = 500;      isInit = false;        isCalculating = false;
       CurVar = 0;         activeAnchor = -1;     startAnchor = -1;     activeAnchorBG = "#CCCCCC"; isSetupBoard = false; BoardSetupMode = 'copy';
       isDragDrop = false; isAnimating = false;   isExecCommand = true; ParseType = 1; AnnotationFile = ""; BoardClicked = -1;
       ImagePathOld = "-"; mageOffset = 0; IsLabelVisible = true; Border = 1; BorderColor = "#404040"; ScoreSheet = 0; BGColor = "";
       //isRotated = false;
       //this.PGNViewImagePath = "";
	   this.isNullMove=true; this.RecordCount=0; this.RecordedMoves=""; this.SkipRefresh=0;
       this.isAutoPlay = false; this.Delay = 1000; this.isCapturedPieces=false; this.CandidateStyle = "";
       PieceName = "KQRBNP"; ShowPieceName = "KQRBNP";  //TODO: to remove
       //StandardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
       FenString = StandardFen;

       ////////////////////////////////////
       OldCommands = new Array();
       NewCommands = new Array();
       dragImg   = new Array(2); //TODO: to json
       dragPiece = new Array(8); //TODO: to json
       dragPiece[0] = -1;
       dragPiece[4] = -1;

       ShortPgnMoveText = [new Array(), new Array(), new Array()]; //TODO: to json
       var i = 0;
       var j = 0;

       ShortPgnMoveText[0][CurVar] = "";

       Piece   = [new Array(16), new Array(16)];
       for ( i = 0; i < 2; i++)
          for ( j = 0; j < 16; j++)
             Piece[i][j] = {Type:null,Pos:{X:null,Y:null},Moves:null};

       ColorName   = ["w", "b", "t"];
       Castling    = [new Array(2), new Array(2)];

       this.Board       = [new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8)];

       HalfMove    = new Array(MaxMove + 1);
       HistMove    = new Array(MaxMove);
       HistCommand = new Array(MaxMove+1);

       HistPiece = [new Array(MaxMove), new Array(MaxMove)];
       HistType  = [new Array(MaxMove), new Array(MaxMove)];
       HistPosX  = [new Array(MaxMove), new Array(MaxMove)];
       HistPosY  = [new Array(MaxMove), new Array(MaxMove)];

       MoveArray = new Array();

       PieceCode  = [PieceName.charCodeAt(0), PieceName.charCodeAt(1), PieceName.charCodeAt(2),
                          PieceName.charCodeAt(3), PieceName.charCodeAt(4), PieceName.charCodeAt(5)];
       PiecePic   = [new Array(6), new Array(6)];
       LabelPic   = new Array(5);
       Annotation = new Array();
       DocImg     = new Array();

	    chessGame.boardWriter.call (chessGame, function (){listenerUpdater(chessGame);});
        chessGame.startParsingDetect_FEN_PGN.call (chessGame); //TODO: too many initialization functions

    }

    //TODO: log probably better to separate
    function appendLog(logStr)
    {
       try
       {
          if(logStr)
          {
             errordiv.appendChild(document.createElement("br"));
             errordiv.appendChild(document.createTextNode(logStr));
          }
       }
       catch(err)
       {
          alert("error on appendLog.call (this, " + logStr + ")" + err); //report but don't rethrow
       }
    }
    this.insertLog = function (logStr)
    {
       try
       {
          errordiv.innerText += "";
          errordiv.insertBefore(document.createElement("br"),    errordiv.firstChild);
          errordiv.insertBefore(document.createTextNode(logStr), errordiv.firstChild);
       }catch(err)
       {
          alert("error on this.insertLog(" + logStr + ")" + err); //report but don't rethrow
       }
    }
    function clearLog (logStr)
    {
       try
       {
          errordiv.innerHTML = ""; //clear here
          if (logStr)
          {
             appendLog.call (this,logStr); //log replacement if any
          }
       }
       catch (err)
       {
          alert("error on this.insertLog(" + logStr + ")" + err); //report but don't rethrow
       }
    }

    this.SetImagePath  = function (imgPath) //public
    {
       try
       {
          this.PGNViewImagePath = imgPath;
          this.insertLog("SetImagePath(imgPath = " + imgPath + ")() this.PGNViewImagePath{" + this.PGNViewImagePath + "}*****************");
       }catch(err)
       {}
    }

    function InitImages ()
    {
       try
       {
          if (ImagePathOld == this.PGNViewImagePath) return;
          var ii, jj;

          BoardPic = {src : this.PGNViewImagePath + "t.gif"};
          for (ii = 0; ii < 2; ii++)
          {
             PiecePic[ii]  =  [{ src : this.PGNViewImagePath + ColorName[ii] + "k.gif"},
                                    { src : this.PGNViewImagePath + ColorName[ii] + "q.gif"},
                                    { src : this.PGNViewImagePath + ColorName[ii] + "r.gif"},
                                    { src : this.PGNViewImagePath + ColorName[ii] + "b.gif"},
                                    { src : this.PGNViewImagePath + ColorName[ii] + "n.gif"},
                                    { src : this.PGNViewImagePath + ColorName[ii] + "p.gif"}];
          }                                                                                      

          //TODO: is this used?
          LabelPic = [{src : this.PGNViewImagePath + "8_1.gif"},
                           {src : this.PGNViewImagePath + "a_h.gif"},
                           {src : this.PGNViewImagePath + "1_8.gif"},
                           {src : this.PGNViewImagePath + "h_a.gif"},
                           {src : this.PGNViewImagePath + "1x1.gif"}];

          ImagePathOld = this.PGNViewImagePath;                                 
    
          for (ii = 0; ii < xdocument.images.length; ii++)
          {
             if (xdocument.images[ii] == xdocument.images["RightLabels"])
             {
                if (ii > 64) ImageOffset = ii - 64;
             }
          }
          DocImg.length = 0;
       }catch(e)
       {
         throw 'this.InitImages()>> rethrow error: ' +  e + "\n";
       }
    }

    //TODO: this function is never used in current version
    //this.SkipRefreshBoard = function (skipRefresh){ this.SkipRefresh = skipRefresh; }

    this.ApplyFEN = function (ss)
    {
       try
       {
          if (ss.length == 0)
          {
             FenString = StandardFen;
          }
          else
          {
             FenString = ss;
          }
          
          if ((xdocument.BoardForm) && (xdocument.BoardForm.FEN))
                xdocument.BoardForm.FEN.value = FenString;
       }catch(err)
       {
          throw 'ApplyFEN(\'' + ss + '\') error' + '\n' + err;
       }
    }


    //currentIVFChessGame.PieceName standard "KQRBNP"
    //currentIVFChessGame.PieceName standard "012345"
    //PiecePosX: ABCDEFGH
    //           01234567
    //PiecePosY: 01234567
    //ii = 0: white; ii = 1: black;
    //King:0 //Queen:1
    //Rock:2
    //3:Knigh //Bishop:4
    //5:Pawn
    
    //Pieces, positions and moves
    
    this.Init = function (rr)
    {
       try
       {
          var cc, ii, jj, kk, ll, nn, mm, pieceColor;
          isInit = true;
          if (this.isAutoPlay) this.SetAutoPlay(false);
          if (rr != '')
          {
             FenString = rr;
             //TODO:
             //FenString = FenString.replace(/\|/gm, "/");
             while (FenString.indexOf("|") > 0) FenString = FenString.replace("|","/");
             //FenString = FenString(/\|/, "/");
          }
          if (FenString == 'standard') FenString = StandardFen;
          if (   (xdocument.BoardForm) && (xdocument.BoardForm.FEN)   ) xdocument.BoardForm.FEN.value = FenString;
          
 
          {
             // init for standard and nonstandard FEN (ie initial position different from the standard startup one)
             var fullProgressDone = 0;
             var HALF_MOVE_PARSED = 1;
             var FULL_MOVE_PARSED = 2;
			 //all the pieces on A1?
             for (pieceColor = IVFChessGame.ChessPiece.Color.White; pieceColor <= IVFChessGame.ChessPiece.Color.Black; pieceColor++)
             {
                for (jj = 0; jj < 16; jj++)
                {
                   Piece[pieceColor][jj].Type =  IVFChessGame.ChessPiece.Type.None;
                   Piece[pieceColor][jj].Pos.X =  IVFChessGame.ChessPiece.Pos.X.A;
                   Piece[pieceColor][jj].Pos.Y =  IVFChessGame.ChessPiece.Pos.X._1;
                   Piece[pieceColor][jj].Moves =  0;
                }
             }
             ii = 0; jj = 7; ll = 0; nn = 1; mm = 1; cc = FenString.charAt(ll++);
             //var fenString = FenString;
             //fenString = fenString.replace(/\s+/gi, " "); //multispace to single space
             //fenString = fenString.replace(/(^\s*|\s*$)/gi, ""); //trim
             //fenString = fenString.replace(/^[\"\s]*/gi, "");
             //fenString = fenString.replace(/^[\s\"\']*FEN?\s*:?[\s\"\']*/gi, "");
             //fenString = fenString.replace(/[\"\s]$/gi, "");
             //ii = 0; jj = 7; ll = 0; nn = 1; mm = 1; cc = fenString.charAt(ll++);
             while (cc != " ")
             {
                //todo: is there any slashes?
                if (cc == "/")
                {
                   if (ii != 8) //ii = A..F, 8=reset, must be when encounter the slash character
                      throw "Invalid FEN [1]: char " + ll + " in " + FenString;
                   ii = 0;
                   jj--;
                }
                if (ii == 8)
                   throw "Invalid FEN [2]: char " + ll + " in " + FenString;

                if (! isNaN(cc)) //is number of empty squares
                {
                   ii += parseInt(cc);
                   if (  (ii < 0) || (ii > 8)  )
                      throw "Invalid FEN [3]: char " + ll + " in " + FenString;
                }

                //is white piece?
                //PieceName standard "KQRBNP"
                if (cc.charCodeAt(0) == "KQRBNP".charCodeAt(0))//PieceName.toUpperCase().charCodeAt(0))
                {
                   if (Piece[0][0].Type != -1)
                      throw "Invalid FEN [4]: char " + ll + " in " + FenString;
                   Piece[0][0].Type = 0;
                   Piece[0][0].Pos.X = ii;
                   Piece[0][0].Pos.Y = jj;
                   ii++;
                }
                //is black piece?
                if (cc.charCodeAt(0) == "kqrbnp".charCodeAt(0)) //PieceName.toLowerCase().charCodeAt(0))
                {
                   if (Piece[1][0].Type != -1)
                      throw "Invalid FEN [5]: char " + ll + " in " + FenString;
                   Piece[1][0].Type = 0;
                   Piece[1][0].Pos.X = ii;
                   Piece[1][0].Pos.Y = jj;
                   ii++;
                }
                for (kk = 1; kk < 6; kk++)
                {
                   //white piece?
                   if (cc.charCodeAt(0) == "KQRBNP".charCodeAt(kk))//PieceName.toUpperCase().charCodeAt(kk))
                   {
                      if (nn == 16)
                         throw "Invalid FEN [6]: char " + ll + " in " + FenString;
                      Piece[0][nn].Type = kk;
                      Piece[0][nn].Pos.X = ii;
                      Piece[0][nn].Pos.Y = jj;
                      nn++;
                      ii++;
                   }
                   //white piece?
                   if (cc.charCodeAt(0) == PieceName.toLowerCase().charCodeAt(kk))
                   {
                      if (mm == 16)
                         throw "Invalid FEN [7]: char " + ll + " in " + FenString;
                      Piece[1][mm].Type = kk;
                      Piece[1][mm].Pos.X = ii;
                      Piece[1][mm].Pos.Y = jj;
                      mm++;
                      ii++;
                   }
                }
                if (ll < FenString.length)
                   cc = FenString.charAt(ll++);
                else cc = " ";
             }
             if ((ii != 8) || (jj != 0))
                throw "Invalid FEN [8]: char " + ll + " in " + FenString;
             if ((Piece[0][0].Type == -1) || (Piece[1][0].Type == -1))
                throw "Invalid FEN [9]: char " + ll + " missing king";
             if (ll == FenString.length)
             {
                FenString += " w ";
                FenString += PieceName.toUpperCase().charAt(0);
                FenString += PieceName.toUpperCase().charAt(1);
                FenString += PieceName.toLowerCase().charAt(0);
                FenString += PieceName.toLowerCase().charAt(1);      
                FenString += " - 0 1";
                ll++;
             }
             cc = FenString.charAt(ll++);
             if ((cc == "w") || (cc == "b"))
             {
                if (cc == "w") StartMove = 0;
                else StartMove = 1;
             }
             else
             {
                throw "Invalid FEN [11]: char " + ll + " invalid active color";
                //Init('standard');
                //return;
             }
             ll++;
             if (ll >= FenString.length)
             {
                throw "Invalid FEN [12]: char " + ll + " missing castling availability";
                //Init('standard');
                //return;
             }
             Castling[0][0] = 0; Castling[0][1] = 0; Castling[1][0] = 0; Castling[1][1] = 0;
             cc = FenString.charAt(ll++);
             while (cc != " ")
             {
                if (cc.charCodeAt(0) == PieceName.toUpperCase().charCodeAt(0)) Castling[0][0] = 1;
                if (cc.charCodeAt(0) == PieceName.toUpperCase().charCodeAt(1)) Castling[0][1] = 1;
                if (cc.charCodeAt(0) == PieceName.toLowerCase().charCodeAt(0)) Castling[1][0] = 1;
                if (cc.charCodeAt(0) == PieceName.toLowerCase().charCodeAt(1)) Castling[1][1] = 1;

                if (ll < FenString.length) cc = FenString.charAt(ll++);
                else cc = " ";
             }
             if (ll == FenString.length)
             {
                throw "Invalid FEN [13]: char " + ll + " missing en passant target square";
                //Init('standard');
                //return;
             }
             EnPass = -1;
             cc = FenString.charAt(ll++);
             while (cc != " ")
             {
                if ((cc.charCodeAt(0) - 97 >= 0) && (cc.charCodeAt(0) - 97 <= 7)) EnPass = cc.charCodeAt(0) - 97; 

                if (ll < FenString.length) cc = FenString.charAt(ll++);
                else cc = " ";
             }
             this.insertLog("FEN EnPass: " + EnPass);
    
             if (ll == FenString.length)
             {
                throw "Invalid FEN [14]: char " + ll + " missing HalfMove clock";
                //Init('standard');
                //return;
             }
             HalfMove[0] = 0;
             cc = FenString.charAt(ll++);
             while (cc != " ")
             {
                if (isNaN(cc))
                {
                   throw "Invalid FEN [15]: char " + ll + " invalid HalfMove clock";
                   //Init('standard');
                   //return;
                }
                HalfMove[0] = HalfMove[0] * 10 + parseInt(cc);
                if (ll < FenString.length)
                    cc = FenString.charAt(ll++);
                else cc = " ";
                fullProgressDone |= HALF_MOVE_PARSED;
             }
             this.insertLog("FEN half move No: " + HalfMove[0]);
             if (ll == FenString.length)
             {
                throw "Invalid FEN [16]: char " + ll + " missing fullmove number";
                //Init('standard');
                //return;
             }
             cc = FenString.substring(ll++);
             //cc = cc.replace(/^\s*|\s*$)/gi, "");
             cc = cc.match(/^\s*(\d+)[^\d]*/)[1];
             this.insertLog ("FEN cc is: {" + cc + "}");
             if (isNaN(cc))
             {
                throw "Invalid FEN [17]: char " + ll + " invalid fullmove number;" + FenString.substring(0, ll);
                //Init('standard');
                //return;
             }
             if (cc <= 0)
             {
                throw "Invalid FEN [18]: char " + ll + " invalid fullmove number";
                //Init('standard');
                //return;
             }
             StartMove += 2 * (parseInt(cc) - 1); //TODO: check halfmoves
             this.insertLog("FEN start move No: " + StartMove);
             for (ii = 0; ii < 8; ii++)
             {
                for (jj = 0; jj < 8; jj++) this.Board[ii][jj] = 0;
             }
             for (ii = 0; ii < 2; ii++)
             {
                for (jj = 0; jj < 16; jj++)
                {
                   if (Piece[ii][jj].Type != -1) 
                      this.Board[Piece[ii][jj].Pos.X][Piece[ii][jj].Pos.Y] = (Piece[ii][jj].Type + 1) * (1 - 2 * ii);
                }
             }
             if (xdocument.BoardForm)
             {
                this.RefreshBoard(); //TODO: what is this for?
                if (xdocument.BoardForm.Position)
                {
                   if (StartMove % 2 == 0) xdocument.BoardForm.Position.value = "white to move";
                   else xdocument.BoardForm.Position.value = "black to move";
                }
                NewCommands.length = 0;
                ExecCommands();
             }
             MoveCount = StartMove;
             MoveType  = StartMove % 2;
             this.SetBoardClicked(-1);
             this.RecordCount = 0;
             CurVar = 0;
             MoveArray.length = 0;
             if (TargetDocument) HighlightMove("m" + MoveCount + "v" + CurVar);
             this.UpdateAnnotation(true);
             //if(MoveType == 1)
             //{
             //   xdocument.game.move[0].black_move = xdocument.game.move[0].white_move;
            //    xdocument.game.move[0].white_move = 0;
                //this.insertLog("StartMove black");
             //}
             //end
          }
          this.insertLog("StartMove=" + StartMove + ";MoveType=" + MoveType);
          this.UpdateBoardAndPieceImages();
       }
       catch (err)
       {
          //this.insertLog ('init>>error: ' + err);
          throw 'rethrow init() >>error: ' + err;
       }
    }

    function ParseAllPgn (pgn)
    {
       try
       {
          var i;
          i = 0;
          i++;
          var pgnText;
          if(pgn) pgnText = pgn;
    
          var  prop, mov;
          pgnText = xdocument.BoardForm.PgnMoveText.value;//"[salut la toti] \r\n[norok la toti] salutari\r\n\r\n   ";

          appendLog.call (this,"ParseAllPgn: before Clean");
          pgnText = pgnText.replace(/[\n\t\r]/gm,     " ");  //replace tabs, newlines and carriage returns
          pgnText = pgnText.replace(/(\{[^\}]*\})/gm, " ");  //remove comments
          pgnText = pgnText.replace(/(^\s*|\s*$)/gm,  "");    //trim
          pgnText = pgnText.replace(/(^[,\.\"\'\s]*|[,\.\"\'\s]*$)/gm,  "");    //trim
          //FenString = StandardFen
          var xfen;
          var i;
          appendLog.call (this, "ParseAllPgn: after Clean");
          for(i = 0; i < 2000 && pgnText.match(/.*\[.*/gm);  i++)
          {
             appendLog.call (this, "ParseAllPgn: parsing tags");
             prop = pgnText.match(/^[^\[]*\[[^\]]*?\]/gm)[0];
             this.insertLog("prop: {" + prop + "}");
             prop = prop.replace(/(^\s*|\s*$)/gm, "");
             xdocument.game.prop[i] = prop;
             var reFEN = new RegExp("[^\\[]*" + "\\[FEN\\s+[\"']*\\s*" + "([^\"']*)" + "\\s*[\"']*\\s*]\\s*", "ig");
             var arr = reFEN.exec(prop);
             if(arr != null && arr.length == 2)
             {
                FenString = arr[1];
             }
             reFEN = null;
    
             pgnText = pgnText.replace(/^[^\[]*\[[^\]]*?\]/gm, "");//"$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm,        "");
          }
          appendLog.call (this, "ParseAllPgn: before Init");
          try
          {
             this.Init('');
          }catch(err)
          {
             //appendLog.call (this, "err: ParseAllPgn() on Init(''):" + err);
             throw "rethrow: ParseAllPgn() from Init(''):" + "\n" + err;
          }
          
          //appendLog.call (this, "ParseAllPgn: before loop");
          for (i = 0; i < 6000 && pgnText.match(/^\d+\s*\./gm);  i++)
          {
             //appendLog.call (this, "ParseAllPgn: inside loop");
             var movNoCurrent, movNoNext;
             
             mov = pgnText.match(/^\d+\s*\.+[^\.]+\.?/gm)[0];
             movNoCurrent = mov.match(/^\d*/gm)[0];
             if (mov.match(/\d*\s*\.$/)) mov = mov.replace(/\s*\d*\.$/gm, "");
             pgnText = pgnText.substr(mov.length);
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm, "");
             
             movNoNext = pgnText.match(/^\d*/gm)[0];
    
             mov = mov.replace(/^\s*/gm, "");
             mov = mov.replace(/^\d*[^\.]*\.\s*/gm, "");
    
             if ( movNoCurrent == movNoNext )
             {
                //var movTemp = pgnText.match(/^\d*\s*\.[^\.]*\.?/gm)[0];
                var movTemp = "";
                var pgnTemp = pgnText;
                //movTemp += movNoCurrent;
                if (pgnTemp.match(/^\d+\s*\.\.\.\s*/gm))
                {
                    movTemp = pgnTemp.match(/^\d+\s*\.\.\.\s*/gm)[0];
                    pgnTemp = pgnTemp.substr(movTemp.length);
                }
                movTemp += pgnTemp.match(/^[^\.]*\.?/gm)[0];
                if(movTemp.match(/\d*\s*\.$/))movTemp = movTemp.replace(/\s*\d*\.$/gm, "");
                pgnText = pgnText.substr(movTemp.length);
    
                movTemp = movTemp.replace(/^\s*/gm, "");
                movTemp = movTemp.replace(/^\d*[^\.]*\.\s*/gm, "");
    
                movTemp = " " + movTemp;
                mov += movTemp;
                
                
             }
    
             //mov = mov.replace(/(^\s*|\s*$)/gm, "");
             xdocument.game.move[i] = new String();
             xdocument.game.move[i].moveNumber = movNoCurrent;
             mov = mov.replace(/(^\s*|\s*$)/gm, "");
             xdocument.game.move[i].fullText = mov;
    
             if (i > 0)
             {
                xdocument.game.move[i].white_move = this.GetMove(mov, 0);
                xdocument.game.move[i].black_move = this.GetMove(mov, 1);
             }else
             {
                if(MoveType == 1)
                {
                   xdocument.game.move[i].white_move = "";
                   xdocument.game.move[i].black_move = this.GetMove(mov, 0);
                }else
                {
                   xdocument.game.move[i].white_move = this.GetMove(mov, 0);
                   xdocument.game.move[i].black_move = this.GetMove(mov, 1);
                }
             }
    
             //pgnText = pgnText.replace(/^\d+\s*\.[^\d]*/gm, "$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm, "");
             appendLog.call (this, "mov: " + mov + "; white: " + xdocument.game.move[i].white_move + "; black: " + xdocument.game.move[i].black_move);
          } 
          
       }
       catch (err)
       {
          throw "rethrow ParseAllPgn() >> error: \n" + err;
       }
       return;
    }

    this.AllowRecording = function(bb)
    {
       if ((document.BoardForm) && (document.BoardForm.Recording))
          document.BoardForm.Recording.checked = bb;
       this.isRecording = bb;
       this.SetBoardClicked (-1);
    }

    this.startParsingDetect_FEN_PGN = function()
    {
        this.insertLog("startParsingDetect_FEN_PGN()");
        var isFen = false;
        try
        {
           this.AllowRecording(true);
           this.ApplyFEN(contentSelectedText);
           this.Init('');
           isFen = true;
        }
        catch (err)
        {
           isFen = false;
           this.insertLog("startParsingDetect_FEN_PGN(): catch is not fen");
        }
        try
        {
           if (!isFen)
           {

              this.insertLog("startParsingDetect_FEN_PGN(): try PGN");
              this.ApplyFEN('');
              xdocument.BoardForm.PgnMoveText.value = contentSelectedText;
              this.insertLog("startParsingDetect_FEN_PGN() start ParseAllPgn('" + contentSelectedText + "')");
              ParseAllPgn.call(this, contentSelectedText); //TODO: check passing a copy of contentSelectedText
           }
           this.insertLog("after init image path{" + this.PGNViewImagePath + "}");
        }
        catch (err)
        {
           throw "rethrow doStartGameGoogleChrome(" + contentSelectedText + "): \n" + err;
        }
    }

    //member
    this.UpdateBoardAndPieceImages = function() //TODO: to review usefullness of this function
    {
       this.insertLog("UpdateBoardAndPieceImages:");
       try
       {
          //TODO: remove this trash
          var img = null;
          for(var i = 0; i < 64; i++)
          {
             img = document.getElementById("" + i);
             //img actually is a reference to real <img> element
             img.style.bordercolor = xdocument.images[i].style.borderColor;
             img.src = xdocument.images[i].src;
          }
          document.getElementById("Position").value = xdocument.BoardForm.Position.value;//TODO: by ID?
		  
          var numbers_image = this.PGNViewImagePath + "8_1.gif";
          var letters_image = this.PGNViewImagePath + "a_h.gif";
          var flip_image    = this.PGNViewImagePath + "flw.gif"; //TODO: to make black/white side flip image
          
          if ( this.inverse )
          {
             numbers_image = this.PGNViewImagePath   + "1_8.gif";
             letters_image = this.PGNViewImagePath   + "h_a.gif";
             flip_image    = this.PGNViewImagePath   + "flb.gif"; //TODO: to make black/white side flip image
          }
          
          this.board.IMGLettersElement.src = letters_image;
          this.board.IMGNumersElement.src  = numbers_image;
          this.board.IMGFlipElement.src    =    flip_image;
       }catch(e)
       {
           //this.insertLog("catch: UpdateBoardAndPieceImages()\n" + e);
           throw "\nrethrow: UpdateBoardAndPieceImages()" + e;
       }
    }
    
    //member
    this.SetDelay      = function(vv)  { this.Delay      = vv; }	//TODO: change play speed. What is it from?
    this.AllowNullMove = function(bb)  { this.isNullMove = bb; }

    this.SwitchAutoPlay = function() { if (this.isAutoPlay) this.SetAutoPlay(false); else this.SetAutoPlay(true); }

    this.SetAutoPlay = function(bb) //try private
    {
       this.isAutoPlay = bb;
       if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
       if (this.isAutoPlay)
       {
          if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
             document.BoardForm.AutoPlay.value="stop";
          this.MoveForward(1);
       }
       else
       {
          if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
             document.BoardForm.AutoPlay.value="play";
       }
    }

    this.SetImg = function (ii, oo)
    {
       if (DocImg[ii] == oo.src) return;
       DocImg[ii] = oo.src;
       //if (ii<64)
       if (isNaN(ii)) xdocument.images[ii].src = oo.src;
       else xdocument.images[ii + ImageOffset].src = oo.src;
    }
	
	
    //TODO: to review this function
    // missusing of functionality meant to be event handler
    // BoardClicked < 0 means no first cell to move from
    this.BoardClick = function  (nn, bb)
    {//style
     //nn = 0..63
    
       try
       {
          var ii0, jj0, ii1, jj1, mm, nnn, vv, ffull, ssearch, llst, ffst, ttmp, mmove0;
          var pp, ffst = 0, ssearch, ssub;
    
          if (isSetupBoard) { this.SetupBoardClick(nn); return; }
    
          if (! this.isRecording) return;
          //if (this.isAutoPlay)
    	  this.SetAutoPlay(false);//TODO: to remove if, let just SetAutoPlay
          if (MoveCount == MaxMove) return;
          if (BoardClickMove.call (this, nn)) return;
          if (isDragDrop && (!bb)) return; //TODO: don't allow first click while drag & drop?
    
          //TODO: no need to check, there are only IDs now, no more indexes
          /*if (isRotated) nnn = 63 - nn;
          else */ nnn = nn;
          
          if (BoardClicked == nnn) { this.SetBoardClicked(-1); return; } //same pozition, reset and do nothing
          
          if (BoardClicked < 0) //click from
          {
             ii0 = nnn % 8;
             jj0 = 7 - (nnn - ii0) / 8;
             if (sign(this.Board[ii0][jj0]) == 0) return;
             if (sign(this.Board[ii0][jj0]) != ((MoveCount + 1) % 2) * 2 - 1) 
             {
                mm="---";
                if ((xdocument.BoardForm)&&(xdocument.BoardForm.PgnMoveText))
                   ShortPgnMoveText[0][CurVar]=Uncomment(xdocument.BoardForm.PgnMoveText.value);
                ssearch=Math.floor(MoveCount/2+1)+".";
                ffst=ShortPgnMoveText[0][CurVar].indexOf(ssearch);
                if (ffst>=0)
                   ssub=ShortPgnMoveText[0][CurVar].substring(0, ffst);
                else
                   ssub=ShortPgnMoveText[0][CurVar]; 
                if (this.ParseMove(mm, false)==0) { this.SetBoardClicked(-1); return; } //TODO: throws error
                if (!this.isNullMove) return;
                if (MoveCount%2==0) { if (!confirm("White nullmove?")) return; }
                else { if (!confirm("Black nullmove?")) return; }
                for (vv=CurVar; vv<ShortPgnMoveText[0].length; vv++)
                {
                   if ((vv==CurVar)||((ShortPgnMoveText[1][vv]==CurVar)&&(ShortPgnMoveText[2][vv]==MoveCount)))
                   {
                      ffull=Uncomment(ShortPgnMoveText[0][vv]);
                      ssearch=Math.floor(MoveCount/2+2)+".";
                      llst=ffull.indexOf(ssearch);
                      ssearch=Math.floor(MoveCount/2+1)+".";
                      ffst=ffull.indexOf(ssearch);
                      if (ffst>=0)
                      {
                         ffst+=ssearch.length;
                         if (llst<0) ttmp=ffull.substring(ffst);
                         else ttmp=ffull.substring(ffst, llst);
                         mmove0=this.GetMove(ttmp,MoveType);
                         if ((mmove0.indexOf(mm)<0)&&(MoveType==1))
                         {
                            ttmp=Math.floor(MoveCount/2+1);
                            ssearch=ttmp+"....";
                            ffst=ffull.indexOf(ssearch);
                            if (ffst  < 0) { ssearch = ttmp + ". ..."; ffst = ffull.indexOf (ssearch); }//TODO: isn't regex much better here?
                            if (ffst  < 0) { ssearch = ttmp +  ". .."; ffst = ffull.indexOf (ssearch); }
                            if (ffst  < 0) { ssearch = ttmp +  " ..."; ffst = ffull.indexOf (ssearch); }
                            if (ffst  < 0) { ssearch = ttmp +  "..." ; ffst = ffull.indexOf (ssearch); }            
                            if (ffst  < 0) { ssearch = ttmp +  " .." ; ffst = ffull.indexOf (ssearch); }
                            if (ffst >= 0) 
                            {
                               ffst+=ssearch.length;
                               if (llst<0) ttmp=ffull.substring(ffst);
                               else ttmp=ffull.substring(ffst, llst);
                               mmove0=this.GetMove(ttmp,0);
                            }
                         }
                         if (mmove0.indexOf(mm)==0)
                         {
                            this.SetMove(MoveCount+1, vv);
                            vv=ShortPgnMoveText[0].length+1;
                            if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",this.Delay/2, this);
                         }  
                      }  
                   }  
                }
                if (vv<ShortPgnMoveText[0].length+1)
                {
                   if ((this.RecordCount==0)&&(!((xdocument.BoardForm)&&(xdocument.BoardForm.PgnMoveText))))
                   {
                      vv=ShortPgnMoveText[0].length;
                      ShortPgnMoveText[0][vv]="";
                      ShortPgnMoveText[1][vv]=CurVar;
                      ShortPgnMoveText[2][vv]=MoveCount;
                      CurVar=vv;
                   }  
                   this.ParseMove(mm,true);
                   if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",this.Delay/2, this);
                   if (MoveType==0)
                   {
                      HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mm;
                      ssub+=Math.floor((MoveCount+2)/2)+".";
                   }  
                   else
                   {
                      HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mm;
                      if (MoveCount==StartMove) ssub+=Math.floor((MoveCount+2)/2)+". ... ";
                      else ssub+=HistMove[MoveCount-StartMove-1]+" ";
                   }
                   if (this.RecordCount==0) this.RecordedMoves=HistMove[MoveCount-StartMove];
                   else
                   {
                      ttmp=this.RecordedMoves.split(" ");
                      ttmp.length=this.RecordCount+((MoveCount-this.RecordCount)%2)*2;
                      this.RecordedMoves=ttmp.join(" ");
                      if (MoveType==0) this.RecordedMoves+=" "+HistMove[MoveCount-StartMove];
                      else this.RecordedMoves+=" "+mm;
                   }
                   this.RecordCount++;
                   MoveCount++;
                   MoveType=1-MoveType;
                   if (xdocument.BoardForm)
                   {
                      if (xdocument.BoardForm.PgnMoveText) xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
                      if (xdocument.BoardForm.Position)
                         xdocument.BoardForm.Position.value=this.TransformSAN(HistMove[MoveCount-StartMove-1]);
                      NewCommands.length=0;
                      ExecCommands();
                      this.RefreshBoard(); //TODO: what this does?
                   }
                }
             }
             this.SetBoardClicked(nnn);
             return; 
          } // BoardClicked < 0 => click from
          ii0=BoardClicked%8;
          jj0=7-(BoardClicked-ii0)/8;
          ii1=nnn%8;
          jj1=7-(nnn-ii1)/8;
          if (Math.abs(this.Board[ii0][jj0])==6)
          {
             if (ii0!=ii1) mm=String.fromCharCode(ii0+97)+"x";
             else mm="";
          }
          else
          {
             mm=PieceName.charAt(Math.abs(this.Board[ii0][jj0])-1);
             if (this.Board[ii1][jj1]!=0) mm+="x";
          }
          this.SetBoardClicked(-1);
          mm+=String.fromCharCode(ii1+97)+(jj1+1);
          if (Math.abs(this.Board[ii0][jj0])==1)
          {
             if (Piece[MoveType][0].Pos.Y==jj1)
             {
                if (Piece[MoveType][0].Pos.X+2==ii1) mm="O-O";
                if (Piece[MoveType][0].Pos.X-2==ii1) mm="O-O-O";
                if (this.Board[ii1][jj1]==(1-2*MoveType)*3) //for Chess960
                {
                   if (ii1>ii0) mm="O-O";
                   if (ii1<ii0) mm="O-O-O";
                }
             }  
          } 
          if ((xdocument.BoardForm)&&(xdocument.BoardForm.PgnMoveText))
             ShortPgnMoveText[0][CurVar]=Uncomment(xdocument.BoardForm.PgnMoveText.value);
          ssearch=Math.floor(MoveCount/2+1)+".";
          ffst=ShortPgnMoveText[0][CurVar].indexOf(ssearch);
          if (ffst>=0)
             ssub=ShortPgnMoveText[0][CurVar].substring(0, ffst);
          else
             ssub=ShortPgnMoveText[0][CurVar]; 
          if ((jj1==(1-MoveType)*7)&&(Math.abs(this.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
          {
             pp=0;
             while(pp==0)
             {
                if (pp==0) { if (confirm("Queen "+PieceName.charAt(1)+" ?")) pp=1; }
                if (pp==0) { if (confirm("Rook "+PieceName.charAt(2)+" ?")) pp=2; }
                if (pp==0) { if (confirm("Bishop "+PieceName.charAt(3)+" ?")) pp=3; }
                if (pp==0) { if (confirm("Knight "+PieceName.charAt(4)+" ?")) pp=4; }            
             }
             mm=mm+"="+PieceName.charAt(pp);
          }
          pp=this.ParseMove(mm, false);
          if (pp==0) return;
          if (Math.abs(this.Board[ii0][jj0])!=1)
          {
             var mmm;
             if (Math.abs(this.Board[ii0][jj0])==6)
             {
                if (mm.charAt(1)=="x") mmm=mm.substr(0,1)+(jj0+1)+mm.substr(1,11);
                else mmm=String.fromCharCode(ii0+97)+(jj0+1)+mm;
             }
             else mmm=mm.substr(0,1)+String.fromCharCode(ii0+97)+(jj0+1)+mm.substr(1,11);
             if (this.ParseMove(mmm, false)==0) return;
          }
          if (pp > 1)
          {
             mm = mm.substr(0, 1) + String.fromCharCode (ii0 + 97) + mm.substr(1, 11);
             if (this.ParseMove(mm, false) != 1)
             {
                mm=mm.substr(0,1)+(jj0+1)+mm.substr(2,11);
                if (this.ParseMove(mm, false)!=1)
                mm=mm.substr(0,1)+String.fromCharCode(ii0+97)+(jj0+1)+mm.substr(2,11);
             }  
          }
          for (vv = CurVar; vv<ShortPgnMoveText[0].length; vv++)
          {
             if ((vv==CurVar)||((ShortPgnMoveText[1][vv]==CurVar)&&(ShortPgnMoveText[2][vv]==MoveCount)))
             {
                ffull=Uncomment(ShortPgnMoveText[0][vv]);
                ssearch=Math.floor(MoveCount/2+2)+".";
                llst=ffull.indexOf(ssearch);
                ssearch=Math.floor(MoveCount/2+1)+".";
                ffst=ffull.indexOf(ssearch);
                if (ffst>=0)
                {
                   ffst += ssearch.length;
                   if (llst<0)
                      ttmp=ffull.substring(ffst);
                   else
                      ttmp=ffull.substring(ffst, llst);  
                   mmove0=this.GetMove(ttmp,MoveType);
                   if ((mmove0.indexOf(mm)<0)&&(MoveType==1))
                   {
                      ttmp=Math.floor(MoveCount/2+1);
                      ssearch = ttmp + "....";
                      ffst=ffull.indexOf(ssearch);
                      if (ffst  < 0 ) { ssearch = ttmp + ". ..."; ffst=ffull.indexOf(ssearch); }
                      if (ffst  < 0 ) { ssearch = ttmp + ". ..";  ffst=ffull.indexOf(ssearch); }
                      if (ffst  < 0 ) { ssearch = ttmp + " ...";  ffst=ffull.indexOf(ssearch); }
                      if (ffst  < 0 ) { ssearch = ttmp + "...";   ffst=ffull.indexOf(ssearch); }            
                      if (ffst  < 0 ) { ssearch = ttmp + " ..";   ffst=ffull.indexOf(ssearch); }
                      if (ffst >= 0 ) 
                      {
                         ffst+=ssearch.length;
                         if (llst<0) ttmp=ffull.substring(ffst);
                         else ttmp=ffull.substring(ffst, llst);
                         mmove0=this.GetMove(ttmp,0);
                      }
                   }
                   if ((mmove0.indexOf(mm)==0)&&(mmove0.indexOf(mm+mm.substr(1))!=0))
                   {
                      this.SetMove(MoveCount+1, vv);
                      if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",this.Delay/2, this);
                      return;
                   }  
                }  
             }  
          }
          if ((this.RecordCount==0)&&(!((xdocument.BoardForm)&&(xdocument.BoardForm.PgnMoveText))))
          {
             vv=ShortPgnMoveText[0].length;
             ShortPgnMoveText[0][vv] = "";
             ShortPgnMoveText[1][vv] = CurVar;
             ShortPgnMoveText[2][vv] = MoveCount;
             CurVar = vv;
          }   
          this.ParseMove(mm, true);
          if (this.IsCheck(Piece[1-MoveType][0].Pos.X, Piece[1-MoveType][0].Pos.Y, 1-MoveType)) mm+="+";
          if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",this.Delay/2, this);
          if (MoveType==0)
          {
             HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mm;
             ssub+=Math.floor((MoveCount+2)/2)+".";
          }  
          else
          {
             HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mm;
             if (MoveCount==StartMove) ssub+=Math.floor((MoveCount+2)/2)+". ... ";
             else ssub+=HistMove[MoveCount-StartMove-1]+" ";
          }
          if (this.RecordCount==0) this.RecordedMoves=HistMove[MoveCount-StartMove];
          else
          {
             ttmp=this.RecordedMoves.split(" ");
             ttmp.length=this.RecordCount+((MoveCount-this.RecordCount)%2)*2;
             this.RecordedMoves=ttmp.join(" ");
             if (MoveType==0) this.RecordedMoves+=" "+HistMove[MoveCount-StartMove];
             else this.RecordedMoves+=" "+mm;
          }
          this.RecordCount++;
          MoveCount++;
          MoveType=1-MoveType;
          if (xdocument.BoardForm)
          {
             if (xdocument.BoardForm.PgnMoveText) xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
             if (xdocument.BoardForm.Position)
                xdocument.BoardForm.Position.value=this.TransformSAN(HistMove[MoveCount-StartMove-1]);
             NewCommands.length=0;
             ExecCommands();
             this.RefreshBoard(); //TODO: what this does?
          }
       }catch(e)
       {
          //alert("currentIVFChessGame.BoardClick>>error" + e)
          throw("currentIVFChessGame.BoardClick>>rethrow error: \n" + e);
       }
    }
	
	//TODO: is RefreshBoard used anymore?
    this.RefreshBoard = function (rr)
    {
       //alert("try to refresh board");
       if (this.SkipRefresh>0) return;
       InitImages.call (this);
       if (rr) DocImg.length = 0;
       var ii, jj, kk, kk0, ll, mm = 1;
       try
       {
          if (xdocument.images["RightLabels"])
          {
             if (IsLabelVisible)
             {
                /*if (isRotated) this.SetImg("RightLabels",LabelPic[2]);
                else*/ this.SetImg("RightLabels",LabelPic[0]);
             }
             else this.SetImg("RightLabels",LabelPic[4]);
          }
          if (xdocument.images["BottomLabels"])
          {
             if (IsLabelVisible)
             {
                /*if (isRotated) this.SetImg("BottomLabels",LabelPic[3]);
                else*/ this.SetImg("BottomLabels",LabelPic[1]);
             }
             else this.SetImg("BottomLabels",LabelPic[4]); 
          }
       }catch(e)
       {
           alert("RefreshBoard: " + e);
       }
       if (isSetupBoard)
       {
          //if (isRotated)
          //{
          //   for (ii=0; ii<8; ii++)
          //   {
          //      for (jj=0; jj<8; jj++)
          //      {
          //         if (this.Board[ii][jj]==0)
          //            this.SetImg(63-ii-(7-jj)*8,BoardPic);
          //         else
          //            this.SetImg(63-ii-(7-jj)*8,PiecePic[(1-sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
          //      }
          //   }
          //}
          //else
          {
             for (ii=0; ii<8; ii++)
             {
                for (jj=0; jj<8; jj++)
                {
                   if (this.Board[ii][jj]==0)
                      this.SetImg(ii+(7-jj)*8,BoardPic);
                   else
                      this.SetImg(ii+(7-jj)*8,PiecePic[(1-sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
                }
             }
          }
       }
       else
       {
          for (ii=0; ii<8; ii++)
          {
             for (jj=0; jj<8; jj++)
             {
                if (this.Board[ii][jj]==0)
                {
                   //if (isRotated)
                   //   this.SetImg(63-ii-(7-jj)*8,BoardPic);
                   //else
                      this.SetImg(ii+(7-jj)*8,BoardPic);
                }
             }
          }
          for (ii=0; ii<2; ii++)
          {
             for (jj=0; jj<16; jj++)
             {
                if (Piece[ii][jj].Type>=0)
                {
                   kk=Piece[ii][jj].Pos.X+8*(7-Piece[ii][jj].Pos.Y);
                   //if (isRotated)
                   //   this.SetImg(63-kk,PiecePic[ii][Piece[ii][jj].Type]);  
                   //else
                      this.SetImg(kk,PiecePic[ii][Piece[ii][jj].Type]);
                }
             }
          }
          if (this.isCapturedPieces)
          {
             var pp0=new Array(0,1,1,2,2,2,8);
             kk0=0;
             if (xdocument.images["RightLabels"]) kk0++;
             kk=0;
             ii=0;
             //if (isRotated) ii=1;
             for (jj=0; jj<16; jj++) pp0[Piece[ii][jj].Type+1]--;
             for (jj=1; jj<5; jj++)
             {
                for (ll=0; ll<pp0[jj+1]; ll++)
                {
                   this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,PiecePic[ii][jj]);
                   kk++;
                   pp0[0]++;
                }
             }
             for (ll=0; ll>pp0[0]; ll--)
             {
                this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,PiecePic[ii][5]);
                kk++;
             }
             if (mm<kk) mm=kk;
             while (kk<4) { this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,BoardPic); kk++; }
             while (kk<16){ this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,LabelPic[4]); kk++; }
             var pp1=new Array(0,1,1,2,2,2,8);
             kk=0;
             ii=1-ii;
             for (jj=0; jj<16; jj++) pp1[Piece[ii][jj].Type+1]--;
             for (jj=1; jj<5; jj++)
             {
                for (ll=0; ll<pp1[jj+1]; ll++)
                {
                   this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,PiecePic[ii][jj]);
                   kk++;
                   pp1[0]++;
                }
             }
             for (ll=0; ll>pp1[0]; ll--)
             {
                this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,PiecePic[ii][5]);
                kk++;
             }
             if (mm<kk) mm=kk;
             while (kk<4) { this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,BoardPic); kk++; }
             while (kk<16){ this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,LabelPic[4]); kk++; }
             mm=Math.ceil(mm/4);
             if ((parent)&&(parent.ChangeColWidth)) parent.ChangeColWidth(mm);
          }
       }
       this.UpdateBoardAndPieceImages();  
    }

	//rarely used function, not reviewed, replace document with xdocument
    this.MakeGamelink = function ()
    {
      appendLog.call (this, "MakeGamelink()");
      var nn=0, ff, mm="", tt="", pp="", oo, aa="";
      if (!document.BoardForm) return;
      if (document.BoardForm.FEN) ff=document.BoardForm.FEN.value;
      if (ff==StandardFen) ff="";
      if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
      if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
      if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
      var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
      ww.document.open();
      ww.document.writeln('<HTML><HEAD></HEAD><BODY>');
      ww.document.writeln(tt);
      ww.document.writeln(mm);
      ww.document.writeln('<BR><BR>');
      while (ff.indexOf("/")>0) ff=ff.replace("/","|");
      while (tt.indexOf("/")>0) tt=tt.replace("/","|");
      nn=pp+"ltpgnboard.html?Init="+ff+"&ApplyPgnMoveText="+mm;
      oo=document.BoardForm.ImagePath;
      if (oo)
      { aa=oo.options[oo.options.selectedIndex].value;
        if (aa) aa="&SetImagePath="+aa;
        else aa="";
      }
      oo=document.BoardForm.BGColor;
      if (oo)
      { for (ii=0; ii<oo.length; ii++)
        { if (oo[ii].checked) aa="&SetBGColor="+oo[ii].value+aa;
        }
      }
      oo=document.BoardForm.Border;
      if (oo)
      { if (oo.options.selectedIndex>0) aa=aa+"&SetBorder=1";
      }  
      if (isDragDrop) aa+='&SetDragDrop=1';
      //if (isRotated) aa+='&RotateBoard=1';
      mm="&eval=AddText(unescape(%22"+escape("<|td><td>"+tt)+"%22)+GetHTMLMoveText(0,0,1))";
      ww.document.writeln('<a href="'+nn+aa+mm+'"');
      mm="&eval=AddText(%22<|td><td>"+tt+"%22+GetHTMLMoveText(0,0,1))";
      while (mm.indexOf("<")>0) mm=mm.replace("<","&lt;");
      while (mm.indexOf(">")>0) mm=mm.replace(">","&gt;");
      ww.document.writeln('>'+nn+aa+mm+'</a>');
      ww.document.writeln('</BODY></HTML>');
      ww.document.close();
    }

    this.MakePuzzle = function ()
    { //get rid of global document
    
      appendLog.call (this, "MakePuzzle()");
      var ii, nn=0, ff, ff_old="", mm="", tt="", pp="", oo, aa="";
      if (!document.BoardForm) return;
      isCalculating=true;
      if (document.BoardForm.FEN) ff_old=document.BoardForm.FEN.value;
      ff=this.GetFEN();
      if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
      if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
      if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
      ii=Math.floor(MoveCount/2+1)+".";
      nn=mm.indexOf(ii);
      if (nn>=0)
      { mm=mm.substr(nn);
        if (MoveCount%2!=0) 
        { mm.substr(ii.length);
          while ((mm!="")&&(mm.charAt(0)==" ")) mm=mm.substr(1);
          nn=mm.indexOf(" ");
          if (nn>0) mm=ii+" ..."+mm.substr(nn);
        }
      }
      if (document.BoardForm.FEN) document.BoardForm.FEN.value=ff_old;  
      isCalculating=false;
      var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
      ww.document.open();
      ww.document.writeln('<HTML><HEAD></HEAD><BODY>');
      ww.document.writeln(tt+"<BR><BR>");
      ww.document.writeln('[FEN "'+ff+'"]<BR><BR>'+mm+'<BR><BR>');
      ff_old=ff.split(" ");
      while (ff.indexOf("/")>0) ff=ff.replace("/","|");
      while (tt.indexOf("/")>0) tt=tt.replace("/","|");
      nn=pp+'problemboard.html?Init='+ff+'&ApplyPgnMoveText='+mm;
      oo=document.BoardForm.ImagePath;
      if (oo)
      { aa=oo.options[oo.options.selectedIndex].value;
        if (aa) aa="&SetImagePath="+aa;
        else aa="";
      }
      oo=document.BoardForm.BGColor;
      if (oo)
      { for (ii=0; ii<oo.length; ii++)
        { if (oo[ii].checked) aa="&SetBGColor="+oo[ii].value+aa;
        }
      }
      oo=document.BoardForm.Border;
      if (oo)
      { if (oo.options.selectedIndex>0) aa=aa+"&SetBorder=1";
      }  
      if (isDragDrop) aa+='&SetDragDrop=1';
      //if (isRotated) aa+='&RotateBoard=1';
      if (tt!="") tt='&AddText='+tt;
      ww.document.writeln('<a href="'+nn+aa+tt+'"');
      while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
      while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
      ww.document.writeln('>'+nn+aa+tt+'</a>');
      if (MoveCount>2)
      { ff=ff_old[0]+" "+ff_old[1]+" "+ff_old[2]+" "+ff_old[3]+" 0 1";
        ii=Math.floor(MoveCount/2+1);
        nn=ii+1;
        while (mm.indexOf(nn+".")>=0) nn++;
        while (nn>ii)
        { nn--;
          while (mm.indexOf(nn+".")>=0) mm=mm.replace(nn+".",(nn-ii+1)+".");
        }
        ww.document.writeln('<BR><BR><HR><BR>');
        ww.document.writeln('[FEN "'+ff+'"]<BR><BR>'+mm+'<BR><BR>');
        while (ff.indexOf("/")>0) ff=ff.replace("/","|");
        nn=pp+'problemboard.html?Init='+ff+'&ApplyPgnMoveText='+mm;
        if (tt!="") tt='&AddText='+tt;
        ww.document.writeln('<a href="'+nn+aa+tt+'"');
        while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
        while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
        ww.document.writeln('>'+nn+aa+tt+'</a>');
      }
      ww.document.writeln('</BODY></HTML>');
      ww.document.close();
    }

    //TODO: this function is not actually being used
    this.ParsePgn = function (nn,gg,ffile)
    {
      appendLog.call (this, "ParsePgn()");
      if ((nn>0)&&(nn<5)) ParseType = parseInt(nn);
      var ii, jj, ll=0, ss, tt, uu=""; 
      if (ffile) ss=" "+ffile;
      else
      { if (! parent.frames[1].document.documentElement) 
        { if (nn>-50) setTimeoutStub("ParsePgn("+(nn-5)+",'"+gg+"')",400, this); 
          return; 
        }
        ss=parent.frames[1].document.documentElement.innerHTML;
        if (ss!="") ll=ss.length;
        if (ll!=nn)
        { setTimeoutStub("ParsePgn("+ll+",'"+gg+"')",400, this);
          return;
        }
        if (ll==0) return;
        ss=ss.replace(/\<html\>/i,'');  
        ss=ss.replace(/\<\/html\>/i,'');
        ss=ss.replace(/\<head\>/i,'');  
        ss=ss.replace(/\<\/head\>/i,'');  
        ss=ss.replace(/\<body\>/i,'');  
        ss=ss.replace(/\<\/body\>/i,'');
        ss=ss.replace(/\<pre\>/i,'');  
        ss=ss.replace(/\<\/pre\>/i,'');  
        ss=ss.replace(/\<xmp\>/i,'');  
        ss=ss.replace(/\<\/xmp\>/i,'');    
        ss=ss.replace(/&quot;/g,'"');
    //  while (ss.indexOf('&quot;')>0) ss=ss.replace('&quot;','"');
        ss=ss.replace(/&lt;/g,'<');
        ss=ss.replace(/&gt;/g,'>');
        ss=" "+ss;
      }
      ss = ss.split("[");
      if (ss.length<2) return;
      tt=new Array(ss.length-1);
      for (ii=1; ii<ss.length; ii++)
        tt[ii-1]=ss[ii].split("]");
      var bblack=new Array();
      var wwhite=new Array();
      var rresult=new Array();
      var ppgnText=new Array();
      var ggameText=new Array();
      var ffenText=new Array();
      var ssanText=new Array();
      var kk, ff, sstype=new Array();
      jj=0;
      ffenText[jj]="";
      ssanText[jj]="";
      ggameText[jj]="";
      for (ii=0; ii<tt.length; ii++)
      { kk=tt[ii][0].split(" ")[0];
        sstype[kk]=kk;
        if (tt[ii][0].substr(0,6)=="Black ")
          bblack[jj]=tt[ii][0].substr(6,tt[ii][0].length);      
        if (tt[ii][0].substr(0,6)=="White ")
          wwhite[jj]=tt[ii][0].substr(6,tt[ii][0].length);
        if (tt[ii][0].substr(0,7)=="Result ")
          rresult[jj]=tt[ii][0].substr(7,tt[ii][0].length);
        if (tt[ii][0].substr(0,4)=="FEN ")
          ffenText[jj]=tt[ii][0].substr(4,tt[ii][0].length);
        if (tt[ii][0].substr(0,4)=="SAN ")
          ssanText[jj]=tt[ii][0].substr(4,tt[ii][0].length);      
        ggameText[jj]+="["+tt[ii][0]+"]<br />";
        kk=0;    
        while ((kk<tt[ii][1].length)&&(tt[ii][1].charCodeAt(kk)<49)) kk++; 
        if (kk<tt[ii][1].length)
        { ppgnText[jj]=tt[ii][1].substr(kk,tt[ii][1].length);
          kk=0; ff=String.fromCharCode(13);
          while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+""+ppgnText[jj].substr(kk+1);
          kk=0; ff=String.fromCharCode(10)+String.fromCharCode(10);
          while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" <br /><br /> "+ppgnText[jj].substr(kk+2);    
          kk=0; ff=String.fromCharCode(10);
          while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" "+ppgnText[jj].substr(kk+1);    
          while (ffenText[jj].indexOf('"')>=0) ffenText[jj]=ffenText[jj].replace('"','');
          while (ssanText[jj].indexOf('"')>=0) ssanText[jj]=ssanText[jj].replace('"','');
          if (ParseType%2==1)
          { ppgnText[jj]=escape(ppgnText[jj]);
            ffenText[jj]=escape(ffenText[jj]);
            ssanText[jj]=escape(ssanText[jj]);        
            ggameText[jj]=escape(ggameText[jj]);
          }
          else
          { ppgnText[jj]=ppgnText[jj].replace(/\'/g,"\\'");
            ggameText[jj]=ggameText[jj].replace(/\'/g,"\\'");
          }  
          jj++;
          ffenText[jj]="";
          ssanText[jj]="";
          ggameText[jj]="";
        }
      }
      if (ParseType%2==1) uu="unescape";
      var ssh=ScoreSheet;
      if ((document.BoardForm)&&(document.BoardForm.ScoreSheet))
        ssh=parseInt(document.BoardForm.ScoreSheet.options[document.BoardForm.ScoreSheet.options.selectedIndex].value);
      if ((parent.frames["annotation"])&&(ssh==0)) ssh=1;
      var bb=BGColor;
      if (bb=="") bb="#E0C8A0";
      var dd=parent.frames[1].document;
      dd.open();
      dd.writeln("<html><head>");
      dd.writeln("<style type='text/css'>");
      dd.writeln("body { background-color:"+bb+";color:#000000;font-size:10pt;line-height:12pt;font-family:Verdana; }");
      if ((ssh)||(ParseType>2))
      { dd.writeln("table { border-left:1px solid #808080; border-top:1px solid #808080; }");
        dd.writeln("td, th { border-right:1px solid #808080; border-bottom:1px solid #808080; font-size:10pt;line-height:12pt;font-family:Verdana; vertical-align:top}");
      }
      dd.writeln("a {color:#000000; text-decoration: none}");
      dd.writeln("a:hover {color:#FFFFFF; background-color:#808080}");
      dd.writeln("</style>");
      dd.writeln("<"+"script language='JavaScript'>");
      ii=this.PGNViewImagePath.replace("/","|");
      if ((document.BoardForm)&&(document.BoardForm.ImagePath))
        ii=document.BoardForm.ImagePath.options[document.BoardForm.ImagePath.options.selectedIndex].value;
      if (ii!="") ii="&SetImagePath="+ii;
      if (BGColor!="") ii=ii+"&SetBGColor="+BGColor.substr(1,6);
      if ((document.BoardForm)&&(document.BoardForm.Border)&&(document.BoardForm.Border.options.selectedIndex>0))
        ii=ii+"&SetBorder=1";
      if (parent.frames["annotation"])
        dd.writeln("if (! parent.frames[0]) location.href='pgnannotator.html?'+location.href+'&SetAnnotation="+AnnotationFile+ii+"';");
      else
        dd.writeln("if (! parent.frames[0]) location.href='ltpgnviewer.html?'+location.href+'"+ii+"';");
      dd.writeln("var PgnMoveText=new Array();");
      dd.writeln("var GameText=new Array();");    
      dd.writeln("var FenText=new Array();");
      dd.writeln("var SanText=new Array();");  
      for (ii=0; ii<jj; ii++)
      { dd.writeln("PgnMoveText["+ii+"]='"+ppgnText[ii]+"';");
        dd.writeln("GameText["+ii+"]='"+ggameText[ii]+"';");
        if (ffenText[ii]!="") dd.writeln("FenText["+ii+"]='"+ffenText[ii]+"';");
        if (ssanText[ii]!="") dd.writeln("SanText["+ii+"]='"+ssanText[ii]+"';");
      }
      dd.writeln("function OpenGame(nn)");
      dd.writeln("{ if (parent.frames[0].IsComplete)");
      dd.writeln("  { if (parent.frames[0].IsComplete())");
      dd.writeln("    { if (nn>=0)");
      dd.writeln("      { if (FenText[nn]) parent.frames[0].Init("+uu+"(FenText[nn]));");
      dd.writeln("        else parent.frames[0].Init('standard');");
      dd.writeln("        if (SanText[nn]) parent.frames[0].ApplySAN("+uu+"(SanText[nn]));");  
      dd.writeln("        //parent.frames[0].SetPgnMoveText("+uu+"(PgnMoveText[nn])); //variants not possible");
      dd.writeln("        parent.frames[0].ApplyPgnMoveText("+uu+"(PgnMoveText[nn]),'#CCCCCC',window.document); //variants possible");
      dd.writeln("        //document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+PgnMoveText[nn]; //pgn without html links");
      if (ssh)
      { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML=parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter(); //pgn with html links");
        dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write(parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter()); document.close(); }}//pgn with html links");
        if (parent.frames["annotation"])
          dd.writeln("        parent.frames[0].UpdateAnnotation(true);");  
      }
      else
      { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true); //pgn with html links");  
        dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write("+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true)); document.close(); }}//pgn with html links");  
        dd.writeln("        if ((document.forms[0])&&(document.forms[0].GameList)) document.forms[0].GameList.options.selectedIndex=parseInt(nn)+1;");
      }
      dd.writeln("      }");
      if (isDragDrop) dd.writeln("      if (parent.frames[0].SetDragDrop) parent.frames[0].SetDragDrop(1);");    
      dd.writeln("      return;");
      dd.writeln("    }");
      dd.writeln("  }");
      dd.writeln("  setTimeoutStub('OpenGame('+nn+')',400);", this);
      dd.writeln("}");
      dd.writeln("function SetMove(mm,vv){ if (parent.frames[0].SetMove) parent.frames[0].SetMove(mm,vv); }");   
      if (jj>1)
      { dd.writeln("function SearchGame()");
        dd.writeln("{ var tt=document.forms[0].SearchText.value;");
        dd.writeln("  var oo=document.forms[0].SearchType;");
        dd.writeln("  oo=oo.options[oo.options.selectedIndex].text;");
        dd.writeln("  if (tt=='') return(false);");
        dd.writeln("  var ll=document.forms[0].GameList;");
        dd.writeln("  var ii, jj=ll.selectedIndex-1, kk=ll.options.length-1;");
        dd.writeln("  if (oo=='Moves')");
        dd.writeln("  { for (ii=1; ii<kk; ii++)");
        dd.writeln("    { if (PgnMoveText[(ii+jj)%kk].indexOf(tt)>=0)");
        dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
        dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
        dd.writeln("        return(false);");
        dd.writeln("      }");
        dd.writeln("    }");
        dd.writeln("    return(false);");
        dd.writeln("  }");
        dd.writeln("  tt=tt.toLowerCase();");
        dd.writeln("  if (oo=='Player')");
        dd.writeln("  { for (ii=1; ii<kk; ii++)");
        dd.writeln("    { if (ll.options[(ii+jj)%kk+1].text.toLowerCase().indexOf(tt)>=0)");
        dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
        dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
        dd.writeln("        return(false);");
        dd.writeln("      }");
        dd.writeln("    }");
        dd.writeln("    return(false);");
        dd.writeln("  }");
        dd.writeln("  for (ii=1; ii<kk; ii++)");
        dd.writeln("  { var nn, mm=oo.length+3, ss=GameText[(ii+jj)%kk].split('<br />');");
        dd.writeln("    for (nn=0; nn<ss.length; nn++)");
        dd.writeln("    { if ((ss[nn].indexOf(oo)>0)&&(ss[nn].toLowerCase().indexOf(tt)>=mm))");
        dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
        dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
        dd.writeln("        return(false);");
        dd.writeln("      }");
        dd.writeln("    }");
        dd.writeln("  }");
        dd.writeln("  return(false);");
        dd.writeln("}");
        dd.writeln("if (window.event) document.captureEvents(Event.KEYDOWN);");
        dd.writeln("document.onkeydown = KeyDown;");
        dd.writeln("function KeyDown(e)");
        dd.writeln("{ var kk=0;");
        dd.writeln("  if (e) kk=e.which;");
        dd.writeln("  else if (window.event) kk=event.keyCode;");
        dd.writeln("  if ((kk==37)||(kk==52)||(kk==65460)) { if (parent.frames[0].MoveBack) parent.frames[0].MoveBack(1); }");
        dd.writeln("  if ((kk==39)||(kk==54)||(kk==65462)) { if (parent.frames[0].MoveForward) parent.frames[0].MoveForward(1); }");
        dd.writeln("}");
      }
      dd.writeln("</"+"script>");
      if (jj==1) dd.writeln("</head><body onLoad=\"setTimeoutStub('OpenGame(0)',400)\">");
      else 
      { if (ParseType<3)
        { if (parseInt(gg)<jj) dd.writeln("</head><body onLoad=\"setTimeoutStub('OpenGame("+gg+")',400)\">");
          else dd.writeln("</head><body>");
          dd.writeln("<FORM onSubmit='return SearchGame()'><NOBR><SELECT name='GameList' onChange='OpenGame(this.options[selectedIndex].value)' SIZE=1>");
          dd.writeln("<OPTION VALUE=-1>Select a game !");
          for (ii=0; ii<jj; ii++)
          { if (ii==gg) dd.writeln("<OPTION VALUE="+ii+" selected>"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
            else dd.writeln("<OPTION VALUE="+ii+">"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
          }
          dd.writeln("</SELECT>");
          if (jj<24) dd.writeln("<!--");
          dd.writeln("<INPUT name='SearchText' size=12><select name='SearchType'><option>Player</option>");
          for (kk in sstype) dd.writeln("<option>"+kk+"</option>");
          dd.writeln("<option>Moves</option></select><INPUT type='submit' value='search'>");
          if (jj<24) dd.writeln("//-->");  
          dd.writeln("</NOBR></FORM>");
        }
        else
        { dd.writeln("</head><body>");
          for (ii=0; ii<jj; ii++)
          { wwhite[ii]=wwhite[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
            bblack[ii]=bblack[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
          }
          var ccT, ccL=1, ccN=new Array(), ccI=new Array(), ccC=new Array(), ccS=new Array(), ccO=new Array();
          ccI[wwhite[0]]=0;
          ccN[0]=wwhite[0];
          for (ii=1; ii<jj; ii++)
          { for (kk=0; kk<ccL; kk++)
            { if (wwhite[ii]==ccN[kk]) kk=ccL+1;
            }
            if (kk==ccL)
            { ccI[wwhite[ii]]=ccL;
              ccN[ccL++]=wwhite[ii];
            }
          }
          for (ii=0; ii<jj; ii++)
          { for (kk=0; kk<ccL; kk++)
            { if (bblack[ii]==ccN[kk]) kk=ccL+1;
            }
            if (kk==ccL)
            { ccI[bblack[ii]]=ccL;
              ccN[ccL++]=bblack[ii];
            }
          }
          var ccCT=new Array(ccL); 
          for (kk=0; kk<ccL; kk++) 
          { ccC[kk]=0; ccS[kk]=0; ccO[kk]=kk;
            ccCT[kk]=new Array(ccL);
            for (ii=0; ii<ccL; ii++) ccCT[kk][ii]="&nbsp;";
            ccCT[kk][kk]="&nbsp;*";
          }
          for (ii=0; ii<jj; ii++)
          { ccT=rresult[ii].replace(/"/g,'');
            if ((ccT.length==3)&&(ccT.indexOf("-")==1))
            { ccS[ccI[wwhite[ii]]]+=1.00001*parseInt(ccT.substr(0,1));
              ccS[ccI[bblack[ii]]]+=1.00001*parseInt(ccT.substr(2,1));
              ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(0,1)+"</a>&nbsp;";
              ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(2,1)+"</a>&nbsp;";
            }
            else
            { ccS[ccI[wwhite[ii]]]+=0.5;
              ccS[ccI[bblack[ii]]]+=0.5;
              ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
              ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
            }
            ccC[ccI[wwhite[ii]]]+=1;
            ccC[ccI[bblack[ii]]]+=1;
          }
          for (ii=0; ii<ccL-1; ii++)
          { for (kk=ii; kk<ccL; kk++)
            { if (ccS[ccO[ii]]<ccS[ccO[kk]])
              { ccT=ccO[ii];
                ccO[ii]=ccO[kk];
                ccO[kk]=ccT;
              }
            }
          }
          dd.writeln("<table border=1 celpadding=0 cellspacing=0 width='100%'><tr><th>Rank</th><th>Name</th>");
          for (kk=0; kk<ccL; kk++) dd.writeln("<th>"+(kk+1)+"</th>");
          dd.writeln("<th>Score</th></tr>");
          for (kk=0; kk<ccL; kk++)
          { dd.writeln("<tr><th nowrap>"+(kk+1)+"</th><th nowrap>"+ccN[ccO[kk]]+"</th>");
            for (ii=0; ii<ccL; ii++) dd.writeln("<th nowrap>"+ccCT[ccO[kk]][ccO[ii]]+"&nbsp;</th>"); 
            dd.writeln("<th nowrap>"+Math.round(10*ccS[ccO[kk]])/10+"/"+ccC[ccO[kk]]+"</th></tr>");
          }
          dd.writeln("</table><br>");  
        }
      }
      dd.writeln("<div id='GameText'> </div>");
      dd.writeln("<layer id='GameTextLayer'> </layer>");  
      dd.writeln("<!--generated with LT-PGN-VIEWER 3.4--></body></html>");
      dd.close();
    }

    this.OpenUrl = function (ss) //TODO: unused
    {
       if (ss != "")
          parent.frames[1].location.href = ss;
       else
       {
          if (document.BoardForm.Url.value != "")  
          {
             var nn = document.BoardForm.OpenParsePgn.selectedIndex;
             if (      (   (nn) || (document.BoardForm.Url.value.indexOf(".htm") > 0)   ) && (!document.layers)       )
             {
                parent.frames[1].location.href = document.BoardForm.Url.value;
                if (nn) setTimeoutStub("ParsePgn(" + nn + ")", 400, this);
             }
             else parent.frames[1].location.href = "pgnframe.html?" + document.BoardForm.Url.value;
          }
          else parent.frames[1].location.href = "pgnframe.html";
       }
    }

    this.GetHTMLMoveText = function (vvariant, nnoscript, ccommenttype, sscoresheet)
    { var vv=0, tt, ii, uu="", uuu="", cc, bb=0, bbb=0;
      var ss="", sstart=0, nn=MaxMove, ffst=0,llst,ssearch,ssub,ffull,mmove0="",mmove1="", gg="";
      if (sscoresheet) Annotation.length=0;
      if (startAnchor!=-1) gg=",'"+startAnchor+"'";
      isCalculating=true;
      if (vvariant) 
      { vv=vvariant;
        if (! isNaN(ShortPgnMoveText[0][vv]))
        { this.SetMove(ShortPgnMoveText[0][vv], ShortPgnMoveText[1][vv]);
          if (MoveCount!=ShortPgnMoveText[0][vv]) return("("+ShortPgnMoveText[0][vv]+")");
          //CurVar=ShortPgnMoveText[1][vv];
          if (ShortPgnMoveText[0][vv].indexOf(".0")>0) return(this.GetDiagram(1));
          return(this.GetDiagram());
        }  
        if (ShortPgnMoveText[2][vv]<0) return(ShortPgnMoveText[0][vv]);
        this.SetMove(ShortPgnMoveText[2][vv], ShortPgnMoveText[1][vv]);
        if (MoveCount!=ShortPgnMoveText[2][vv]) return(ShortPgnMoveText[0][vv]);
        CurVar=vvariant;
      }  
      else this.MoveBack(MaxMove);
      tt=ShortPgnMoveText[0][vv];
      
      ffull=Uncomment(ShortPgnMoveText[0][CurVar]);
      for (ii=0; (ii<nn)&&(ffst>=0)&&(MoveCount<MaxMove); ii++)
      { ssearch=Math.floor(MoveCount/2+2)+".";
        llst=ffull.indexOf(ssearch);
        ssearch=Math.floor(MoveCount/2+1)+".";
        ffst=ffull.indexOf(ssearch);
        mmove1=""
        if (ffst>=0)
        { ffst+=ssearch.length;
          if (llst<0)
            ssub=ffull.substring(ffst);
          else
            ssub=ffull.substring(ffst, llst);
          mmove0=this.GetMove(ssub,MoveType);
          if (mmove0!="")
          { if (this.ParseMove(mmove0, true)>0)
            { mmove1=mmove0;
              if (MoveType==0)
                HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mmove1;
              else
                HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
              HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
              MoveCount++;
              MoveType=1-MoveType;
            }  
            else
            { if (MoveType==1)
              { ssub=Math.floor(MoveCount/2+1);
                ssearch=ssub+"....";
                ffst=ffull.indexOf(ssearch);
                if (ffst<0) { ssearch=ssub+". ..."; ffst=ffull.indexOf(ssearch); }
                if (ffst<0) { ssearch=ssub+". .."; ffst=ffull.indexOf(ssearch); }
                if (ffst<0) { ssearch=ssub+" ..."; ffst=ffull.indexOf(ssearch); }
                if (ffst<0) { ssearch=ssub+"..."; ffst=ffull.indexOf(ssearch); }
                if (ffst<0)
                { ssearch=ssub+" ..";
                  ffst=ffull.indexOf(ssearch);
                }
                if (ffst>=0) 
                { ffst+=ssearch.length;
                  if (llst<0) ssub=ffull.substring(ffst);
                  else ssub=ffull.substring(ffst, llst);
                  mmove0=this.GetMove(ssub,0);
                  if (mmove0!="")
                  { if (this.ParseMove(mmove0, true)>0)
                    { mmove1=mmove0;
                      HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
                      HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
                      MoveCount++;
                      MoveType=1-MoveType;
                    }  
                    else
                    { ffst=-1;
                      //alert(mmove0+" is not a valid move.");
                    }
                  }
                }
              }
              else
              { ffst=-1;
                //alert(mmove0+" is not a valid move.");
              }
            }
          }
          else ffst=-1;
        }
        if (mmove1!="")
        { sstart=-1;
          do sstart=tt.indexOf(mmove1, sstart+1);
          while ((sstart>0)&&(this.IsInComment(tt, sstart)));
          if (sstart>=0)
          { if (sscoresheet)
            { Annotation[MoveCount-1]=GetComment.call (this, tt.substr (0, sstart));
              if (ss=="")
              { if (sscoresheet==2) ss+="<table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'>";
                if (MoveCount%2==1) ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+((MoveCount+1)/2)+".</th>";
                else ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+(MoveCount/2)+".</th><th>&nbsp;</th>";
              }
              else
              { if (MoveCount%2==1) ss+="<tr><th>"+((MoveCount+1)/2)+".</th>";
              }
              ss+="<th>";
            }
            else ss+=tt.substr(0,sstart);
            if (! nnoscript) ss+="<a href=\"javascript:SetMove{{"+MoveCount+","+vv+gg+"}}\" name=\"m"+MoveCount+"v"+vv+"\">";
            if (vv==0) ss+="<b>";
            ss+=this.TransformSAN(mmove1);
            if (vv==0) ss+="</b>";
            if (! nnoscript) ss+="</a>";
            tt=tt.substr(sstart+mmove1.length);
            if (sscoresheet)
            { ss+="</th>";
              if (MoveCount%2==0) ss+="</tr>";
              if (sscoresheet==2)
              { if (MoveCount%80==0) ss+="</table></td></tr></table><table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
                else
                { if (MoveCount%40==0) ss+="</table></td><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
                }
              }
            }
          }
          else ffst=-1;
        }
      }
      if (sscoresheet)
      { Annotation[MoveCount]=GetComment.call(this,tt);
        if (MoveCount%2==1) ss+="<th>&nbsp;</th>";
        ss+="</tr></table>";
        if (sscoresheet==2)
        { if (MoveCount%80<40) ss+="</td><td width='50%'>&nbsp;";
          ss+="</td></tr></table>";
        }
      }  
      else ss+=tt;
    
      var ll=ss.length;
      for (ii=0; ii<ll; ii++)  
      { cc=ss.substr(ii,1);
        if (cc=="{") bbb++;
        if (cc=="}") bbb--; 
        if (((cc==")")||(cc=="]"))&&(bbb==0)) 
        { bb--;
          if (bb==0)
          { if (bbb==0)
            { if (! isNaN(ShortPgnMoveText[0][uuu]))
              { cc=uu.length-1;
                uu=uu.substr(0,cc);
                cc="";
              }
              if (sscoresheet) uu+=this.GetHTMLMoveText(uuu, true);
              else uu+=this.GetHTMLMoveText(uuu, nnoscript);
              isCalculating=true;
            }
            else uu+=uuu;
            uuu="";
          }  
        }  
        if (bb==0) uu+=cc;
        else uuu+=cc;
        if (((cc=="(")||(cc=="["))&&(bbb==0)) bb++; 
      }  
       
      if (! vvariant) 
      { this.SetMove(0,0);
        tt=uu.split("{{");
        ll=tt.length;
        uu=tt[0];
        for (ii=1; ii<ll; ii++) uu+="("+tt[ii];
        tt=uu.split("}}");
        ll=tt.length;
        uu=tt[0];
        for (ii=1; ii<ll; ii++) uu+=")"+tt[ii];
        if ((ccommenttype==1)||(ccommenttype==true))
        { tt=uu.split("{");
          ll=tt.length;
          uu=tt[0];
          for (ii=1; ii<ll; ii++) uu+="<i>"+tt[ii];
          tt=uu.split("}");
          ll=tt.length;
          uu=tt[0];
          for (ii=1; ii<ll; ii++) uu+="</i>"+tt[ii];
        }
        if (ccommenttype>=1)
        { tt=uu.split("{");
          ll=tt.length;
          uu=tt[0];
          for (ii=1; ii<ll; ii++) uu+="<a href=\"javascript:SetMove()\"><span title=\""+tt[ii];
          tt=uu.split("}");
          ll=tt.length;
          uu=tt[0];
          for (ii=1; ii<ll; ii++) uu+="\" onMouseDown=\"if (this.innerHTML==\'{\'+this.title+\'}\') this.innerHTML=\'<I>{...}</I>\'; else this.innerHTML=\'{\'+this.title+\'}\';\"><I>{...}</I></span></a>"+tt[ii];
        }
      }
      isCalculating=false;
      return(uu);
    }
    this.MoveBack = function  (nn)
    {
       //alert("MoveBack");
       var ii, jj, cc;
       if (BoardClicked >= 0) this.SetBoardClicked(-1);
       for (jj = 0; (jj < nn) && (MoveCount > StartMove); jj++)
       {
          if (this.RecordCount > 0) this.RecordCount--;
          MoveCount--;
          MoveType = 1 - MoveType;
          cc = MoveCount - StartMove;
          ii = HistPiece[1][cc];
          if ((0 <= ii) && (ii < 16)) //we must do this here because of Chess960 castling
          {
             this.Board[Piece[MoveType][ii].Pos.X][Piece[MoveType][ii].Pos.Y] = 0; 
             this.Board[HistPosX[1][cc]][HistPosY[1][cc]] = (HistType[1][cc]+1)*(1-2*MoveType);
          }
          ii = HistPiece[0][cc];
          this.Board[Piece[MoveType][ii].Pos.X][Piece[MoveType][ii].Pos.Y] = 0;
          this.Board[HistPosX[0][cc]][HistPosY[0][cc]] = (HistType[0][cc] + 1) * (1 - 2 * MoveType);
          Piece[MoveType][ii].Type = HistType[0][cc];
          Piece[MoveType][ii].Pos.X = HistPosX[0][cc];
          Piece[MoveType][ii].Pos.Y = HistPosY[0][cc];
          Piece[MoveType][ii].Moves--;
          ii=HistPiece[1][cc];
          if ((0<=ii)&&(ii<16))
          {
             Piece[MoveType][ii].Type = HistType[1][cc];
             Piece[MoveType][ii].Pos.X = HistPosX[1][cc];
             Piece[MoveType][ii].Pos.Y = HistPosY[1][cc];
             Piece[MoveType][ii].Moves--;
          }
          ii -= 16;
          if (0 <= ii)
          {
             this.Board[HistPosX[1][cc]][HistPosY[1][cc]] = (HistType[1][cc] + 1) * (2 * MoveType - 1);
             Piece[1 - MoveType][ii].Type = HistType[1][cc];
             Piece[1 - MoveType][ii].Pos.X = HistPosX[1][cc];
             Piece[1 - MoveType][ii].Pos.Y = HistPosY[1][cc];
             Piece[1 - MoveType][ii].Moves--;
          }
          if (CurVar != 0)
          {
             if (MoveCount == ShortPgnMoveText[2][CurVar])
             {
                CurVar = ShortPgnMoveText[1][CurVar];
                if ((!isCalculating) && (xdocument.BoardForm) && (xdocument.BoardForm.PgnMoveText))
                   xdocument.BoardForm.PgnMoveText.value = ShortPgnMoveText[0][CurVar];
             }  
          }    
       }
       if (HistCommand[MoveCount - StartMove]) NewCommands = HistCommand[MoveCount - StartMove].split("|");
       if (isCalculating) return;
       if ((OldCommands.length > 0) || (NewCommands.length > 0)) ExecCommands();
       if (xdocument.BoardForm)
       {
          this.RefreshBoard();
          if (xdocument.BoardForm.Position)
          {
             if (MoveCount>StartMove)
                xdocument.BoardForm.Position.value=this.TransformSAN(HistMove[MoveCount-StartMove-1]);
             else
                xdocument.BoardForm.Position.value="";
          }    
       }
       if (TargetDocument) HighlightMove("m" + MoveCount + "v" + CurVar);
       this.UpdateAnnotation(false);
       if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
       if (this.isAutoPlay) this.AutoPlayInterval=setTimeoutStub("MoveBack("+nn+")", this.Delay, this);
       this.UpdateBoardAndPieceImages();
    }

    this.MoveForward = function (nMoveNumber, rr)
    {
       this.insertLog("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")");
       try
       {
          var ii, llst, ssub, mmove0 = "", mmove1 = "";//,ssearch,ffst=0,ffull;
          if (rr);
          else
          {
             if ((xdocument.BoardForm) && (xdocument.BoardForm.PgnMoveText))
                ShortPgnMoveText[0][CurVar] = xdocument.BoardForm.PgnMoveText.value;
             if (BoardClicked >= 0) this.SetBoardClicked(-1);
          }
          this.insertLog("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")MoveCount=" + MoveCount + ";len=" + xdocument.game.move.length);
          if(nMoveNumber > xdocument.game.move.length * 2 - (MoveCount - StartMove)) nMoveNumber  = xdocument.game.move.length * 2 - (MoveCount - StartMove);
          for (ii = 0; (ii < nMoveNumber) && ((MoveCount - StartMove) < xdocument.game.move.length * 2); ii++) 
          {
             //ssearch = Math.floor(MoveCount / 2 + 2) + ".";
             //var idx  = (MoveCount & 0xfffffffe) >> 1 ;
             var idx  = (MoveCount + (StartMove & 1) - StartMove) >> 1;
             this.insertLog("MoveForward(nMoveNumber, rr)MoveCount{"+MoveCount+"};StartMove{" + StartMove + "}ii={" + ii + "}idx={"+ idx +"}; nMoveNumber={" + nMoveNumber + "};len=" + xdocument.game.move.length);
             //ssearch = (2 + idx) + ".";
             //llst = ffull.indexOf(ssearch);
             //ssearch = Math.floor(MoveCount / 2 + 1) + ".";
             //ssearch = (1 + idx) + ".";
             //ffst = ffull.indexOf(ssearch);
             //if (ffst >= 0)
             {
                //ffst += ssearch.length;
                /*if (llst < 0)
                {
                   ssub = ffull.substring(ffst);
                }
                else
                {
                   ssub = ffull.substring(ffst, llst);
                }*/
                ssub = xdocument.game.move[idx].fullText;
                this.insertLog("GetMove(ssub={" + ssub + "}, MoveType = {" + MoveType + "})");
                //mmove0 = GetMove(ssub, MoveType);
                if(MoveType == 0)
                {
                   mmove0 = xdocument.game.move[idx].white_move;
                }
                else
                {
                   mmove0 = xdocument.game.move[idx].black_move;
                }
                //this.insertLog("mmove0 = {" + mmove0 + "}");
                if (mmove0 != "")
                {
                   if (this.ParseMove(mmove0, true) > 0)
                   {
                      mmove1 = mmove0;
                      if (MoveType == 0)
                         HistMove[MoveCount-StartMove] = Math.floor((MoveCount+2)/2) + "." + mmove1;
                      else
                         HistMove[MoveCount - StartMove] = Math.floor((MoveCount+2)/2) + ". ... " + mmove1;
                      HistCommand[MoveCount - StartMove + 1] = NewCommands.join("|");
                      MoveCount++;
                      MoveType = 1 - MoveType;
                   }
    
                   /**
                   else
                   {
                      if (MoveType == 1)
                      {
                         ssub = Math.floor(MoveCount / 2 + 1);
                         this.insertLog("else if MoveType == 1 (ssub={" + ssub + "}");
                         ssearch = ssub + "....";
                         ffst = ffull.indexOf(ssearch);
                         if (ffst < 0) { ssearch = ssub + ". ..."; ffst = ffull.indexOf(ssearch); }
                         if (ffst < 0) { ssearch = ssub + ". ..";  ffst = ffull.indexOf(ssearch); }
                         if (ffst < 0) { ssearch = ssub + " ...";  ffst = ffull.indexOf(ssearch); }
                         if (ffst < 0) { ssearch = ssub + "...";   ffst = ffull.indexOf(ssearch); }            
                         if (ffst < 0) { ssearch = ssub + " ..";   ffst = ffull.indexOf(ssearch); }
                         if (ffst>=0)                                    
                         {
                            ffst+=ssearch.length;
                            if (llst<0) {ssub=ffull.substring(ffst); this.insertLog("1 if llst lt 0 (ssub={" + ssub + "}");}
                            else {ssub=ffull.substring(ffst, llst); this.insertLog("1 if llst lt 0 : else (ssub={" + ssub + "}");}
                            
                            mmove0=GetMove(ssub,0);
                            if (mmove0!="")
                            {
                               if (this.ParseMove(mmove0, true)>0)
                               {
                                  mmove1=mmove0;
                                  HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
                                  HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
                                  MoveCount++;
                                  MoveType=1-MoveType;
                               }  
                               else
                               {
                                  ffst=-1;
                                  //alert(mmove0+" is not a valid move.");
                               }
                            }
                         }
                      }
                      else
                      {
                         ffst =- 1;
                         //alert(mmove0+" is not a valid move.");
                      }
                   } //*/
                }
                //else ffst =- 1;
             }
          }
          if (isCalculating) return;
          if ((OldCommands.length > 0) || (NewCommands.length > 0)) ExecCommands();
          if (xdocument.BoardForm)
          {
             if ((xdocument.BoardForm.Position) && (mmove1 != ""))
                xdocument.BoardForm.Position.value = this.TransformSAN(HistMove[MoveCount - StartMove - 1]);
             if ((mmove1 != "") && (isDragDrop) && (nMoveNumber == 1) && (!dragObj) && (dragPiece[0] >= 0) && (!rr) && (!isAnimating)) this.AnimateBoard(1);
             else this.RefreshBoard();
          }
          if (TargetDocument) HighlightMove("m" + MoveCount + "v" + CurVar);
          this.UpdateAnnotation(false);
          if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
		  var this_ref = this; //save, because this will change in context of lambda function
          if (this.isAutoPlay) this.AutoPlayInterval = setTimeoutStub(function(){this_ref.MoveForward(nMoveNumber);}, this.Delay, this);
          this.UpdateBoardAndPieceImages();
       }catch(e)
       {
          throw 'rethrow error MoveForward (' + nMoveNumber+ ', ' + rr+ '): ' + e + "\n";
    
       }
    }
    //private //static
    function Uncomment(ss)
    {
       if (! ss) return(ss);
       var ii, jj, llist = ss.split("{"), ll = llist.length, uu = llist[0], tt, kk;
       for (ii = 1; ii < ll; ii++)
       {
          tt = llist[ii];
          jj = tt.indexOf("}") + 1;
          if (jj > 0) uu += tt.substring(jj);
       }
       llist = uu.split("$");
       ll = llist.length;
       uu = llist[0];
       for (ii = 1; ii < ll; ii++)
       {
          tt = llist[ii];
          kk = tt.length;
          for (jj=0; jj<kk; jj++)
          {
             if (isNaN(parseInt(tt.charAt(jj))))
             //if (tt.charAt(jj)==" ")
             {
                uu+=tt.substring(jj+1);
                jj=kk;
             }
          }    
       }
       return(uu);
    }
    function BoardClickMove (nn)
    {
       try
       {
          var ii0, jj0, ii1, jj1, iiv, jjv, nnn=nn, mm, pp=0;
          if (BoardClicked>=0) return(false);
          //if (isRotated) nnn=63-nn; 
          ii1=nnn%8;
          jj1=7-(nnn-ii1)/8;
          if (sign(this.Board[ii1][jj1])==((MoveCount+1)%2)*2-1) return(false);
          for (ii0 = 0; ii0 < 8; ii0++)
          {
             for (jj0 = 0; jj0 < 8; jj0++)
             {
                if (sign(this.Board[ii0][jj0])==((MoveCount+1)%2)*2-1) 
                {
                   if (Math.abs(this.Board[ii0][jj0])==6)
                   {
                      mm = String.fromCharCode(ii0 + 97) + (jj0 + 1);
                      if (ii0 != ii1) mm += "x";
                   }
                   else
                   {
                      mm = PieceName.charAt(Math.abs(this.Board[ii0][jj0])-1)+String.fromCharCode(ii0+97)+(jj0+1);
                      if (this.Board[ii1][jj1]!=0) mm+="x";
                   }
                   mm+=String.fromCharCode(ii1+97)+(jj1+1);
                   if ((jj1==(1-MoveType)*7)&&(Math.abs(this.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
                   {
                      mm=mm+"="+PieceName.charAt(1);
                   }
                   if (this.ParseMove(mm, false))
                   {
                      pp++;
                      iiv=ii0;
                      jjv=jj0;
                   }
                }
             }
          }
          if (pp==1)
          {
             this.SetBoardClicked(iiv+8*(7-jjv));
             BoardClick(nn);
             return(true);
          }
       }
       catch(e)
       {
          throw("BoardClickMove>>error: " + e + "\n");
       }
       return(false);
    }

    // private static
    function GetComment(ss)
    {
       if (! ss) return(ss);
       var ii, jj, llist = ss.split("}"), ll = llist.length, uu = "", tt, kk;
       for (ii=0; ii<ll; ii++)
       {
          tt=llist[ii];
          jj=tt.indexOf("{")+1;
          if (jj>0) uu+=tt.substring(jj);
       }
       return(uu);
    }

    function GetFENList(sshort) //member
    { var mmove=MoveCount, vvariant=CurVar, nn=0;
      var ff, ff_new, ff_old;
      isCalculating=true;
      ff=this.GetFEN(sshort);
      ff_new=ff;
      do
      { ff_old=ff_new;
        this.MoveBack(1);
        ff_new=this.GetFEN(sshort);
        if (ff_old!=ff_new) { ff=ff_new+"\n"+ff; nn++ }
      }
      while (ff_old!=ff_new);
      isCalculating=false;
      if (vvariant==0)
      { if (nn>0) this.MoveForward(nn); }
      else this.SetMove(mmove, vvariant);
      return(ff);
    } // member

    function Is3FoldRepetition() // private member
    { if (MoveCount<8) return(false);
      var ss = GetFENList.call (this);
      ss = ss.split("\n");
      var ii, jj, kk=0, ll=ss.length-1;
      var tt=new Array(ll+1);
      for (ii=0; ii<=ll; ii++) tt[ii]=ss[ii].split(" ");    
      for (ii=ll-2; ii>=0; ii-=2)
      { if ((tt[ii][0]==tt[ll][0])&&(tt[ii][2]==tt[ll][2])) 
        { kk++;
          jj=ii;
        }
      }
      if (kk<2) return(false);
      if (kk>3) return(true);
      ii=tt[jj][3];
      if (ii=="-") return(true);
      ss=tt[jj][0].split("/");
      if (ii.indexOf("3")>0)
      { jj=ii.charCodeAt(0)-97;
        kk=0;
        for (ii=0; ii<ss[4].length; ii++)
        { if (ss[4].charAt(ii)=="p")
          { if (Math.abs(kk-jj)==1) return(false);
            kk++;
          }
          else
          { if (isNaN(ss[4].charAt(ii))) kk++;
            else kk+=parseInt(ss[4].charAt(ii));
          }
        }
      }
      if (ii.indexOf("6")>0)
      { jj=ii.charCodeAt(0)-97;
        kk=0;
        for (ii=0; ii<ss[3].length; ii++)
        { if (ss[3].charAt(ii)=="P")
          { if (Math.abs(kk-jj)==1) return(false);
            kk++;
          }
          else
          { if (isNaN(ss[3].charAt(ii))) kk++;
            else kk+=parseInt(ss[3].charAt(ii));
          }
        }
      }  
      return(true);
    }

    this.GetFEN = function (sshort) //public
    {
       var ii, jj, ee, ss = "";
       for (jj=7; jj>=0; jj--)
       {
          ee=0;
          for (ii=0; ii<8; ii++)
          {
             if (this.Board[ii][jj] == 0) ee++;
             else
             {
                if (ee > 0)
                {
                   ss = ss + "" + ee;
                   ee = 0;
                }
                if (this.Board[ii][jj]>0) 
                   ss = ss + PieceName.toUpperCase().charAt (  this.Board[ii][jj] - 1);
                else
                   ss = ss + PieceName.toLowerCase().charAt ( -this.Board[ii][jj] - 1);
             }
          }
          if (ee > 0) ss = ss + "" + ee;
          if (jj > 0) ss = ss + "/";
       }
       if (sshort) return(ss);
       if (MoveType==0) ss = ss + " w";
       else ss = ss + " b";
       ee = "";
       if ((Castling[0][0] > 0) && (Piece[0][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((Piece[0][ii].Type == 2) && (Piece[0][ii].Pos.X == 7) && (Piece[0][ii].Pos.Y == 0))
               ee = ee + PieceName.toUpperCase().charAt(0);
          }
       }
       if ((Castling[0][1] > 0) && (Piece[0][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((Piece[0][ii].Type == 2) && (Piece[0][ii].Pos.X == 0) && (Piece[0][ii].Pos.Y == 0))
                ee = ee + PieceName.toUpperCase().charAt(1);
          }
       }
       if ((Castling[1][0] > 0) && (Piece[1][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((Piece[1][ii].Type == 2) && (Piece[1][ii].Pos.X == 7) && (Piece[1][ii].Pos.Y == 7))
                ee = ee + PieceName.toLowerCase().charAt(0);
          }
       }
       if ((Castling[1][1]>0)&&(Piece[1][0].Moves==0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((Piece[1][ii].Type == 2) && (Piece[1][ii].Pos.X == 0) && (Piece[1][ii].Pos.Y == 7))
                ee = ee + PieceName.toLowerCase().charAt(1);
          }
       }
       if (ee == "") ss = ss + " -";
       else ss = ss + " " + ee;
       if (MoveCount > StartMove)
       {
          CanPass = -1;
          ii = HistPiece[0][MoveCount-StartMove - 1];
          if ((HistType[0][MoveCount-StartMove - 1] == 5) && (Math.abs(HistPosY[0][MoveCount - StartMove - 1] - Piece[1 - MoveType][ii].Pos.Y) == 2))
             CanPass = Piece[1 - MoveType][ii].Pos.X;
       }
       else
         CanPass = EnPass;
       if (CanPass >= 0)
       {
          ss = ss + " " + String.fromCharCode(97 + CanPass);
          if (MoveType == 0) ss = ss + "6";
          else ss = ss + "3";
       }
       else ss = ss + " -";
       ss = ss + " " + HalfMove[MoveCount - StartMove];
       ss = ss + " " + Math.floor((MoveCount + 2) / 2);
       if ((xdocument.BoardForm) && (xdocument.BoardForm.FEN))
         xdocument.BoardForm.FEN.value = ss;
       try
       {//TODO: don't surpress this call
          document.getElementById("FEN").value = xdocument.BoardForm.FEN.value;//TODO: to centralize
       }catch(err)
       {
          this.insertLog("norethrow/surpress failed to write FEN: " + err); //surpressed
       }
       return(ss);
    }
    function IsInsufficientMaterial() //private
    {
      var ss=this.GetFEN(true);
      if (ss.indexOf("Q")>=0) return(false);
      if (ss.indexOf("q")>=0) return(false);
      if (ss.indexOf("R")>=0) return(false);
      if (ss.indexOf("r")>=0) return(false);
      if (ss.indexOf("P")>=0) return(false);
      if (ss.indexOf("p")>=0) return(false);  
      var ii_B=false, ii_b=false, ii_N=false, ii_n=false;
      if (ss.indexOf("B")>=0) ii_B=true;
      if (ss.indexOf("b")>=0) ii_b=true;
      if (ss.indexOf("N")>=0) ii_N=true;
      if (ss.indexOf("n")>=0) ii_n=true;
      if ((!ii_B)&&(!ii_B)&&(!ii_N)&&(!ii_n)) return(true);
      if ((ii_N)&&(ii_B)&&(!ii_n)&&(!ii_b)) return(false); 
      if ((ii_n)&&(ii_b)&&(!ii_N)&&(!ii_B)) return(false);   
      if (ii_N)
      { if ((ii_n)||(ii_b)) return(false);
        else return(true);
      }
      if (ii_n)
      { if ((ii_N)||(ii_B)) return(false);
        else return(true);
      }  
      var ii, jj, ww=0, bb=0;
      for (ii=0; ii<8; ii++)
      { for (jj=0; jj<8; jj++)
        { if (Math.abs(this.Board[ii][jj])==4)
          { if ((ii+jj)%2==0) ww++;
            else bb++;
          }
        }
      }
      if ((ww>0)&&(bb>0)) return(false);
      return(true);
    }

    function IsDraw() //private
    { var ff=this.GetFEN().split(" ");
      if (parseInt(ff[4])>=100) return("Draw by 50 move rule.");
      if (Is3FoldRepetition.call (this)) return("Draw by 3-fold repetition.");
      if (IsInsufficientMaterial.call (this)) return("Draw by insufficient material.");
      return(false);
    }

    this.ShowFENList = function () //public
    {
      var ww = window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
      ww.document.open();
      ww.document.writeln("<html><head></head><body><pre>" + GetFENList.call(this) + "</pre></body></html>");
      ww.document.close();
    }

    //while(tmp.match(/^(\w+)/g))
    //{
    //idx = (/^(\w+)\.?/g.exec(tmp))[0];
    //  idx = tmp.match(/^(\w+)\.?/)[0];
    this.GetMove = function (strMoveText, isBlackMove)
    {
       var ii=0, jj=0, /*mm="",*/ ll=-1, cc, strTheMove = strMoveText;
       var retMove = "";
       //while (strTheMove.indexOf("<br />")>0) strTheMove = strTheMove.replace("<br />","");
       strTheMove = strTheMove.replace(/(^\s*|\s*<br\s*\/>\s*|\s*$)/gmi, "");
       var moveLen = strTheMove.length;
       while (ii < moveLen)
       {
          cc = strTheMove.charCodeAt(ii);
          if ((cc <= 32))//||(cc==46)) //||(cc>=127))
          {
             if (ll + 1 != ii) jj++;
             ll = ii;
          }
          else
          {
             if (jj == isBlackMove) 
             {
                if ((cc == 46) && (!isNaN(retMove))) { retMove = ""; ll = ii; }
                else retMove += strTheMove.charAt(ii);
             }
          }    
          ii++;
       }
       if ((isBlackMove == 1) && (retMove == "") && (strTheMove.charAt(0) == "."))
       {
          ii = 0;
          while (ii < moveLen)
          {
             cc = strTheMove.charAt(ii);
             if ((cc != ".") && (cc != " ")) retMove += cc;
             ii++;
          }
       }
       //retMove = retMove.replace(/(<[^>]*>)/gmi, "");//try this
       if (retMove != "") //remove tags?
       {
          ii = retMove.indexOf("<");
          jj = retMove.indexOf(">");
          ll = 0; NewCommands.length = 0; // there is a problem, this is replaced with window
          while ((ii >= 0) && (jj >= 0) && (ii < jj))
          {
             NewCommands[ll++] = retMove.substr(ii + 1, jj - ii - 1);
             retMove = retMove.substr(0, ii) + retMove.substr(jj + 1);
             ii = retMove.indexOf("<");
             jj = retMove.indexOf(">");
          }
       } //*/
       return(retMove);
    }

    this.ParseMove = function (mm, sstore)
    {
       var ii, ffrom = "", ccapt = 0, ll, yy1i = -1;
       var ttype0 = -1, xx0 = -1, yy0 = -1, ttype1 = -1, xx1 = -1, yy1 = -1;
       if (MoveCount > StartMove)
       {
          CanPass = -1;
          ii = HistPiece[0][MoveCount - StartMove - 1];
          if (   (HistType[0][MoveCount - StartMove - 1] == 5) && (Math.abs(HistPosY[0][MoveCount - StartMove - 1] - Piece[1 - MoveType][ii].Pos.Y) == 2)   )
             CanPass = Piece[1 - MoveType][ii].Pos.X;
       }
       else
          CanPass = EnPass;
       ii = 1;
       while (ii < mm.length)  
       {
          if (   !isNaN(mm.charAt(ii) )    )
          {
             xx1   = mm.charCodeAt(ii - 1) - 97;
             yy1   = mm.charAt(ii) - 1;
             yy1i  = ii;
             ffrom = mm.substring(0, ii - 1);
          }
          ii++;
       }
       if ((xx1 < 0) || (xx1 > 7) || (yy1 < 0) || (yy1 > 7))
       {
          if ((mm.indexOf("O") >= 0) || (mm.indexOf("0") >= 0))
          {
             if ((mm.indexOf("O-O-O") >= 0) || (mm.indexOf("0-0-0") >= 0) || (mm.indexOf("O朞朞") >= 0) || (mm.indexOf("0𢠢") >= 0)) 
             {
                if (this.EvalMove(ttype0, 6, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
                   return(1);
                return(0);
             }
             if ((mm.indexOf("O-O") >= 0) || (mm.indexOf("0-0") >= 0) || (mm.indexOf("O朞") >= 0) || (mm.indexOf("0�0") >= 0))
             {
                if (this.EvalMove(ttype0, 7, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
                   return(1);
                return(0);
             }
             return(0);
          }
          if ((mm.indexOf("---") >= 0) || (mm.indexOf("枛�") >= 0))
          //if (mm.indexOf("...")>=0) //is buggy
          {
             if (this.EvalMove(ttype0, 8, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
                return(1);
             return(0);
          }
          return(0);
       }
       ll=ffrom.length;
       ttype0=5;
      if (ll>0)
      { for (ii=0; ii<5; ii++)
        { if (ffrom.charCodeAt(0)==PieceCode[ii]) 
            ttype0=ii;
        }
        if (ffrom.charAt(ll-1)=="x") ccapt=1;
        else
        { if ((ffrom.charAt(ll-1)=="-")||(ffrom.charAt(ll-1)=="�")) ll--; //Smith Notation
        }
        if (isNaN(mm.charAt(ll-1-ccapt)))
        { xx0=ffrom.charCodeAt(ll-1-ccapt)-97;
          if ((xx0<0)||(xx0>7)) xx0=-1;
        }
        else
        { yy0=ffrom.charAt(ll-1-ccapt)-1;
          if ((yy0<0)||(yy0>7)) yy0=-1;
        }
        if ((yy0>=0)&&(isNaN(mm.charAt(ll-2-ccapt)))) //Smith Notation
        { xx0=ffrom.charCodeAt(ll-2-ccapt)-97;
          if ((xx0<0)||(xx0>7)) xx0=-1;
          else
          { ttype0=Math.abs(this.Board[xx0][yy0])-1;
            if ((ttype0==0)&&(xx0-xx1>1)&&(yy0==yy1))
            { if (this.EvalMove(ttype0, 6, xx0, yy0, -1, -1, -1, 0, sstore))
                return(1);
              return(0);
            }  
            if ((ttype0==0)&&(xx1-xx0>1)&&(yy0==yy1))
            { if (this.EvalMove(ttype0, 7, xx0, yy0, -1, -1, -1, 0, sstore))
                return(1);
              return(0);
            }
          }
        }
      }
      if (this.Board[xx1][yy1]!=0) ccapt=1;
      else
      { if ((ttype0==5)&&(xx1==CanPass)&&(yy1==5-3*MoveType)) ccapt=1;
      }
      ttype1=ttype0;
      ii=mm.indexOf("=");
      if (ii<0) ii=yy1i;
      if ((ii>0)&&(ii<mm.length-1))
      { if (ttype0==5)
        { ii=mm.charCodeAt(ii+1);
          if (ii==PieceCode[1]) ttype1=1;
          if (ii==PieceCode[2]) ttype1=2;
          if (ii==PieceCode[3]) ttype1=3;
          if (ii==PieceCode[4]) ttype1=4;
        }  
      }
      if (sstore)
      { for (ii=0; ii<16; ii++)
        { if (Piece[MoveType][ii].Type==ttype0)
          { if (this.EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, true))
              return(1);
          }
        }
      }
      else
      { ll=0;
        for (ii=0; ii<16; ii++)
        { if (Piece[MoveType][ii].Type==ttype0)
          { if (this.EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, false))
              ll++;
          }
        }
        return(ll);
      }    
      return(0);
    }
    this.EvalMove = function (ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore)
    { var ddx, ddy, xx, yy, jj=-1, ttype2=-1, xx2=xx1, yy2=xx1, ttype3=-1, xx3=-1, yy3=-1, ff;
       if (ttype0==6) //O-O-O with Chess960 rules
       { jj=this.CanCastleLong();
         if (jj<0) return(false);
         if (this.StoreMove(0, 0, 2, MoveType*7, jj, 2, 3, MoveType*7, sstore))
           return(true);
         else return(false);
       }
       if (ttype0==7) //O-O with Chess960 rules
       { jj=this.CanCastleShort();
         if (jj<0) return(false);
         if (this.StoreMove(0, 0, 6, MoveType*7, jj, 2, 5, MoveType*7, sstore))
           return(true);
         return(false);
       }
       if (ttype0==8) // --- NullMove
       { if (this.StoreMove(0, 0, Piece[MoveType][0].Pos.X, Piece[MoveType][0].Pos.Y, -1, -1, -1, -1, sstore))
           return(true);
         return(false);
       }  
       if ((Piece[MoveType][ii].Pos.X==xx1)&&(Piece[MoveType][ii].Pos.Y==yy1))
         return(false);
       if ((ccapt==0)&&(this.Board[xx1][yy1]!=0))
         return(false);
       if ((ccapt>0)&&(sign(this.Board[xx1][yy1])!=(2*MoveType-1)))
       { if ((ttype0!=5)||(CanPass!=xx1)||(yy1!=5-3*MoveType))
           return(false);
       }
       if ((xx0>=0)&&(xx0!=Piece[MoveType][ii].Pos.X)) return(false);
       if ((yy0>=0)&&(yy0!=Piece[MoveType][ii].Pos.Y)) return(false);
       if (ttype0==0)
       { //if ((xx0>=0)||(yy0>=0)) return(false); //because of Smith Notation
         if (Math.abs(Piece[MoveType][ii].Pos.X-xx1)>1) return(false);
         if (Math.abs(Piece[MoveType][ii].Pos.Y-yy1)>1) return(false);
       }
       if (ttype0==1)
       { if ((Math.abs(Piece[MoveType][ii].Pos.X-xx1)!=Math.abs(Piece[MoveType][ii].Pos.Y-yy1))&&
             ((Piece[MoveType][ii].Pos.X-xx1)*(Piece[MoveType][ii].Pos.Y-yy1)!=0))
           return(false);
       }
       if (ttype0==2)
       { if ((Piece[MoveType][ii].Pos.X-xx1)*(Piece[MoveType][ii].Pos.Y-yy1)!=0)
           return(false);
       }
       if (ttype0==3)
       { if (Math.abs(Piece[MoveType][ii].Pos.X-xx1)!=Math.abs(Piece[MoveType][ii].Pos.Y-yy1))
           return(false);
       }
       if (ttype0==4)
       { if (Math.abs(Piece[MoveType][ii].Pos.X-xx1)*Math.abs(Piece[MoveType][ii].Pos.Y-yy1)!=2)
           return(false);
       }
       if ((ttype0==1)||(ttype0==2)||(ttype0==3))
       { ddx=sign(xx1-Piece[MoveType][ii].Pos.X);
         ddy=sign(yy1-Piece[MoveType][ii].Pos.Y);
         xx=Piece[MoveType][ii].Pos.X+ddx;
         yy=Piece[MoveType][ii].Pos.Y+ddy;
         while ((xx!=xx1)||(yy!=yy1))
         { if (this.Board[xx][yy]!=0) return(false);
           xx+=ddx;
           yy+=ddy;
         }
       }
       if (ttype0==5)
       {
          if (Math.abs(Piece[MoveType][ii].Pos.X-xx1)!=ccapt) return(false);
          if ((yy1==7*(1-MoveType))&&(ttype0==ttype1)) return(false);
          if (ccapt==0)
          {
             if (Piece[MoveType][ii].Pos.Y-yy1==4*MoveType-2)
             {
                if (Piece[MoveType][ii].Pos.Y!=1+5*MoveType) return(false);
                if (this.Board[xx1][yy1+2*MoveType-1]!=0) return(false);
             }
             else
             {
                if (Piece[MoveType][ii].Pos.Y-yy1!=2*MoveType-1) return(false);
             }
          }
          else
          {
             if (Piece[MoveType][ii].Pos.Y-yy1!=2*MoveType-1) return(false);
          }
       }
       if (ttype1!=ttype0)
       {
          if (ttype0 != 5) return(false);
          if (ttype1 >= 5) return(false);
          if (yy1 != 7 - 7 * MoveType) return(false);
       }
       if ((ttype0<=5)&&(ccapt>0))
       {
          jj=15;
          while ((jj>=0)&&(ttype3<0))
          {
             if ((Piece[1-MoveType][jj].Type>0)&&
                   (Piece[1-MoveType][jj].Pos.X==xx1)&&
                   (Piece[1-MoveType][jj].Pos.Y==yy1))
                ttype3=Piece[1-MoveType][jj].Type;
             else
               jj--;
          }
          if ((ttype3==-1)&&(ttype0==5)&&(CanPass>=0))
          { jj=15;
             while ((jj>=0)&&(ttype3<0))
             {
                if ((Piece[1-MoveType][jj].Type==5)&&
                      (Piece[1-MoveType][jj].Pos.X==xx1)&&
                      (Piece[1-MoveType][jj].Pos.Y==yy1-1+2*MoveType))
                   ttype3=Piece[1-MoveType][jj].Type;
                else
                  jj--;
             }
          }
          ttype3=-1;
       }  
       if (this.StoreMove(ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore))
          return(true);
       return(false);
    }
    this.CanCastleLong = function()
    { if (Castling[MoveType][1]==0) return(-1);
      if (Piece[MoveType][0].Moves>0) return(-1);
      var jj=0;
      while (jj<16)
      { if ((Piece[MoveType][jj].Pos.X<Piece[MoveType][0].Pos.X)&&
            (Piece[MoveType][jj].Pos.Y==MoveType*7)&&
            (Piece[MoveType][jj].Type==2)&&
            (Piece[MoveType][jj].Moves==0))
          jj+=100;
        else jj++;
      }
      if (jj==16) return(-1);
      jj-=100;
      this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=0;
      this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=0;
      var ff=Piece[MoveType][jj].Pos.X;
      if (ff>2) ff=2;
      while ((ff<Piece[MoveType][0].Pos.X)||(ff<=3))
      { if (this.Board[ff][MoveType*7]!=0)
        { this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=1-2*MoveType;
          this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=(1-2*MoveType)*3;
          return(-1);
        }
        ff++;
      }
      this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=1-2*MoveType;
      this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=(1-2*MoveType)*3;  
      return(jj);
    }

    this.CanCastleShort = function ()
    { if (Castling[MoveType][0]==0) return(-1);
      if (Piece[MoveType][0].Moves>0) return(-1);
      var jj=0;
      while (jj<16)
      { if ((Piece[MoveType][jj].Pos.X>Piece[MoveType][0].Pos.X)&&
            (Piece[MoveType][jj].Pos.Y==MoveType*7)&&
            (Piece[MoveType][jj].Type==2)&&
            (Piece[MoveType][jj].Moves==0))
          jj+=100;
        else jj++;
      }
      if (jj==16) return(-1);
      jj-=100;
      this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=0;
      this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=0;
      var ff=Piece[MoveType][jj].Pos.X;
      if (ff<6) ff=6;
      while ((ff>Piece[MoveType][0].Pos.X)||(ff>=5))
      { if (this.Board[ff][MoveType*7]!=0)
        { this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=1-2*MoveType;
          this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=(1-2*MoveType)*3;
          return(-1);
        }
        ff--;
      }
      this.Board[Piece[MoveType][0].Pos.X][MoveType*7]=1-2*MoveType;
      this.Board[Piece[MoveType][jj].Pos.X][MoveType*7]=(1-2*MoveType)*3;
      return(jj);     
    }

    this.StoreMove = function (ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore)
    { var iis_check=0, ll, cc=MoveCount-StartMove, ff=Piece[MoveType][0].Pos.X, dd=0;
      if ((ttype1==5)||((jj>=0)&&(ttype3<0)))
        HalfMove[cc+1]=0;
      else
        HalfMove[cc+1]=HalfMove[cc]+1;
      HistPiece[0][cc] = ii;
      HistType[0][cc] = Piece[MoveType][ii].Type;
      HistPosX[0][cc] = Piece[MoveType][ii].Pos.X;
      HistPosY[0][cc] = Piece[MoveType][ii].Pos.Y;
      if (!isAnimating)
      { dragPiece[0]=Piece[MoveType][ii].Pos.X;
        dragPiece[1]=Piece[MoveType][ii].Pos.Y;
        dragPiece[2]=xx1;
        dragPiece[3]=yy1;
        dragPiece[4]=-1;
      }
      if (jj<0) 
        HistPiece[1][cc] = -1;
      else
      { if (ttype3>=0)
        { HistPiece[1][cc] = jj;
          HistType[1][cc] = Piece[MoveType][jj].Type;
          HistPosX[1][cc] = Piece[MoveType][jj].Pos.X;
          HistPosY[1][cc] = Piece[MoveType][jj].Pos.Y;
          if (!isAnimating)
          { dragPiece[4]=Piece[MoveType][jj].Pos.X;
            dragPiece[5]=Piece[MoveType][jj].Pos.Y;
            dragPiece[6]=xx3;
            dragPiece[7]=yy3;
          }
        }
        else
        { HistPiece[1][cc] = 16+jj;
          HistType[1][cc] = Piece[1-MoveType][jj].Type;
          HistPosX[1][cc] = Piece[1-MoveType][jj].Pos.X;
          HistPosY[1][cc] = Piece[1-MoveType][jj].Pos.Y;
        }
      }
      
      this.Board[Piece[MoveType][ii].Pos.X][Piece[MoveType][ii].Pos.Y]=0;
      if (jj>=0)
      { if (ttype3<0)
          this.Board[Piece[1-MoveType][jj].Pos.X][Piece[1-MoveType][jj].Pos.Y]=0;
        else
          this.Board[Piece[MoveType][jj].Pos.X][Piece[MoveType][jj].Pos.Y]=0;
      }
      Piece[MoveType][ii].Type=ttype1;
      if ((Piece[MoveType][ii].Pos.X!=xx1)||(Piece[MoveType][ii].Pos.Y!=yy1)||(jj>=0))
      { Piece[MoveType][ii].Moves++; dd++; } //not a nullmove
      Piece[MoveType][ii].Pos.X=xx1;
      Piece[MoveType][ii].Pos.Y=yy1;
      if (jj>=0)
      { if (ttype3<0)
        { Piece[1-MoveType][jj].Type=ttype3;
          Piece[1-MoveType][jj].Moves++;
        }
        else
        { Piece[MoveType][jj].Pos.X=xx3;
          Piece[MoveType][jj].Pos.Y=yy3;
          Piece[MoveType][jj].Moves++;
        }
      }
      if (jj>=0)
      { if (ttype3<0)
          this.Board[Piece[1-MoveType][jj].Pos.X][Piece[1-MoveType][jj].Pos.Y]=0;    
        else
          this.Board[Piece[MoveType][jj].Pos.X][Piece[MoveType][jj].Pos.Y]=(Piece[MoveType][jj].Type+1)*(1-2*MoveType);
      }
      this.Board[Piece[MoveType][ii].Pos.X][Piece[MoveType][ii].Pos.Y]=(Piece[MoveType][ii].Type+1)*(1-2*MoveType);
    
      if ((ttype1==0)&&(ttype3==2)) //O-O-O, O-O
      { while (ff>xx1) 
        { iis_check+=this.IsCheck(ff, MoveType*7, MoveType);
          ff--;      
        }
        while (ff<xx1) 
        { iis_check+=this.IsCheck(ff, MoveType*7, MoveType);
          ff++;      
        } 
      }
      iis_check+=this.IsCheck(Piece[MoveType][0].Pos.X, Piece[MoveType][0].Pos.Y, MoveType);
    
      if ((iis_check==0)&&(sstore))
      { MoveArray[cc]=String.fromCharCode(97+HistPosX[0][cc])+(HistPosY[0][cc]+1)+String.fromCharCode(97+Piece[MoveType][ii].Pos.X)+(Piece[MoveType][ii].Pos.Y+1);
        if (HistType[0][cc] != Piece[MoveType][ii].Type)
        { if (MoveType==0) MoveArray[cc]+=PieceName.charAt(Piece[MoveType][ii].Type);
          else MoveArray[cc]+=PieceName.charAt(Piece[MoveType][ii].Type).toLowerCase();
        }
        MoveArray.length=cc+1;
        return(true);
      }
    
      this.Board[Piece[MoveType][ii].Pos.X][Piece[MoveType][ii].Pos.Y]=0;
      this.Board[HistPosX[0][cc]][HistPosY[0][cc]]=(HistType[0][cc]+1)*(1-2*MoveType);
      Piece[MoveType][ii].Type=HistType[0][cc];
      Piece[MoveType][ii].Pos.X=HistPosX[0][cc];
      Piece[MoveType][ii].Pos.Y=HistPosY[0][cc];
      Piece[MoveType][ii].Moves-=dd;
      if (jj>=0)   
      { if (ttype3>=0)
        { this.Board[Piece[MoveType][jj].Pos.X][Piece[MoveType][jj].Pos.Y]=0;
          this.Board[HistPosX[0][cc]][HistPosY[0][cc]]=(HistType[0][cc]+1)*(1-2*MoveType);
          this.Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(1-2*MoveType);
          Piece[MoveType][jj].Type=HistType[1][cc];
          Piece[MoveType][jj].Pos.X=HistPosX[1][cc];
          Piece[MoveType][jj].Pos.Y=HistPosY[1][cc];
          Piece[MoveType][jj].Moves--;
        }
        else
        { this.Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(2*MoveType-1);
          Piece[1-MoveType][jj].Type=HistType[1][cc];
          Piece[1-MoveType][jj].Pos.X=HistPosX[1][cc];
          Piece[1-MoveType][jj].Pos.Y=HistPosY[1][cc];
          Piece[1-MoveType][jj].Moves--;
        }
      }
      if (iis_check==0) return(true);
      return(false);
    }
	
	this.ExecCommand = function (bb) { isExecCommand = bb;}

    this.flipBoard = function() //to move into chessgame
    {
      //never anymore write the board from scratch
      //by using board*Writer functions
      //don't generate anymore HTML text
      try
      {
         this.inverse ^= 1;
      
         var chessBoard = this.board.gameTBodyElement;
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
         this.UpdateBoardAndPieceImages();
      
      }catch(err)
      {
         alert(err);
      }
    }
	this.boardGameWriter = function (tableBoardBorderTd)
    {
        try
        {
          var pp = this.PGNViewImagePath;
        
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
          this.board.gameTBodyElement = document.createElement("tbody");
        
          var tableTBodyTrElement;
          var tableTBodyTrTdElement;
          var tableTBodyTrTdImgElement;
        
          var ii  = 0;
          var tri = 0;
          var tdi = 0;
          
          var bImagePath = pp + "b.gif";
          var wImagePath = pp + "w.gif";
        
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
                if(this.inverse) imgIdx = 64 - (ii + 1);
                cellId = "" + imgIdx;
                
                // Chess Piece ream images from the game here. First update, setup with no game started
                tableTBodyTrTdImgElement = document.createElement("img"); //TODO: is it the right place to do that?
                tableTBodyTrTdImgElement.id = cellId;
                tableTBodyTrTdImgElement.src =  ll[imgIdx];
                tableTBodyTrTdElement.appendChild(tableTBodyTrTdImgElement);
             
             }
             this.board.gameTBodyElement.appendChild(tableTBodyTrElement);
          }
        
          tableElement.appendChild(this.board.gameTBodyElement);
        
          tableBoardBorderTd.appendChild(tableElement);//add to the outer board table now
        }catch(err)
        {
           alert('error: boardGameWriter() ' + err);
        }
    }
	
    this.boardWriter = function (updateBrowserListeners)
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
        
           this.board.IMGNumersElement = document.createElement("img");
           tableTBodyTrTdElement.appendChild(this.board.IMGNumersElement);
           tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
           tableTBodyElement.appendChild(tableTBodyTrElement);
        
           tableTBodyTrTdElement = document.createElement("td");
        
           this.boardGameWriter(tableTBodyTrTdElement); //game goes here
           tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
           
           tableTBodyTrElement = document.createElement("tr");
           
           tableTBodyTrTdElement = document.createElement("td"); //flip
           tableTBodyTrTdElement.id = 'btnFlipBoard';
           this.board.IMGFlipElement = document.createElement("img"); 
        
           tableTBodyTrTdElement.appendChild(this.board.IMGFlipElement);
           tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
           tableTBodyTrTdElement = document.createElement("td");      //A-H image here
           this.board.IMGLettersElement = document.createElement("img");
           tableTBodyTrTdElement.appendChild(this.board.IMGLettersElement);
        
           tableTBodyTrElement.appendChild(tableTBodyTrTdElement);
           tableTBodyElement.appendChild(tableTBodyTrElement);
        
           tableElement.appendChild(tableTBodyElement);
        
           this.chess_board.appendChild(tableElement);
           
           this.UpdateBoardAndPieceImages();
        
    	   //once listeners are set, no need for reattach/update listeners anymore
           //TODO: probably board_main better place
           updateBrowserListeners ();
        
        }catch(err)
        {
           alert('error: boardGameWriter() ' + err);
        }
    
    }	
    //TODO: notused: RotateBoard is not used anymore, using flipBoard instead
    //var RotateBoard = function(bb)
    //{ this.SetBoardClicked(-1);
    //  var ii, cc=new Array();
    //  for (ii=0; ii<OldCommands.length; ii++) cc[ii]=OldCommands[ii];
    //  NewCommands.length=0;
    //  ExecCommands();
    //  isRotated=bb;
    //  if ((document.BoardForm)&&(document.BoardForm.Rotated))
    //    document.BoardForm.Rotated.checked=bb;
    //  this.RefreshBoard();
    //  for (ii=0; ii<cc.length; ii++) NewCommands[ii]=cc[ii];
    //  ExecCommands();
    //}
    //TODO: this function is not used
    var SwitchSetupBoard = function()
    { this.SetBoardClicked(-1);
      if (!isSetupBoard)
      { Init('standard');
        isSetupBoard=true;
        if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
          document.BoardForm.SetupBoard.value=" Ready ";
        return;
      }
      isSetupBoard=false;
      if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
        document.BoardForm.SetupBoard.value="Setup this.Board";
      var ii, jj, ee, ss="";
      for (jj=7; jj>=0; jj--)
      { ee=0;
        for (ii=0; ii<8; ii++)
        { if (this.Board[ii][jj]==0) ee++;
          else
          { if (ee>0)
            { ss=ss+""+ee;
              ee=0;
            }
            if (this.Board[ii][jj]>0) 
              ss=ss+PieceName.toUpperCase().charAt(this.Board[ii][jj]-1);
            else
              ss=ss+PieceName.toLowerCase().charAt(-this.Board[ii][jj]-1);
          }
        }
        if (ee>0) ss=ss+""+ee;
        if (jj>0) ss=ss+"/";
      }
      MoveType=-1;
      while (MoveType<0)
      { if (MoveType<0)
        { if (confirm("White to move?")) MoveType=0;
        }
        if (MoveType<0)
        { if (confirm("Black to move?")) MoveType=1;
        }
      }
      if (MoveType==0) ss=ss+" w";
      else ss=ss+" b";
      ss=ss+" KQkq";
      ss=ss+" -";
      ss=ss+" "+HalfMove[MoveCount-StartMove];
      ss=ss+" "+Math.floor((MoveCount+2)/2);
      if ((document.BoardForm)&&(document.BoardForm.FEN))
        document.BoardForm.FEN.value=ss;    
      Init(ss);
    }

    var ApplyPgnMoveText = function (ss, rroot, ddocument, ggame)
    { var vv=0;
      if (! isNaN(rroot)) 
      { vv=ShortPgnMoveText[0].length; 
        ShortPgnMoveText[0][vv]=""; 
      }
      else 
      { ShortPgnMoveText[0].length=1;
        if (ddocument) TargetDocument=ddocument;
        else TargetDocument=window.document;
        if (rroot) activeAnchorBG=rroot;
        if (ggame) startAnchor=ggame;
        else startAnchor=-1;
      }  
      var ii, uu="", uuu="", cc, bb=0, bbb=0, ll=ss.length;
      for (ii=0; ii<ll; ii++)  
      { cc=ss.substr(ii,1);
        if (cc=="{") bbb++;
        if (cc=="}") bbb--; 
        if (((cc==")")||(cc=="]"))&&(bbb==0)) 
        { bb--;
          if (bb==0)
          { if (bbb==0) uu+=ApplyPgnMoveText(uuu, vv);
            else uu+=uuu;
            uuu="";
          }  
        }  
        if (bb==0) uu+=cc;
        else uuu+=cc;
        if (((cc=="(")||(cc=="["))&&(bbb==0)) bb++; 
      }
      if (! isNaN(rroot))
      { ii=0, jj=0, bb=0;
        var uuc=Uncomment(uu);
        while ((ii<uuc.length-1)&&(((ii>0)&&(uuc.charAt(ii-1)!=" "))||(isNaN(parseInt(uuc.charAt(ii)))))) ii++;
        while ((ii<uuc.length-1)&&(! isNaN(parseInt(uuc.charAt(ii))))) { bb=10*bb+parseInt(uuc.charAt(ii)); ii++; }
        if (ii<uuc.length-1)
        { uuu=uuc.substr(ii, 3);
          switch (uuu)
          { case "...": jj=1; break;
            case " ..": jj=1; break;
          }
          if (jj==0)  
          { uuu=uuc.substr(ii, 4);
            switch (uuu)
            { case "....": jj=1; break;
              case ". ..": jj=1; break;
              case " ...": jj=1; break;
            }
          }
          if (jj==0)  
          { uuu=uuc.substr(ii, 5);
            if (uuu==". ...") jj=1;
          }
        }  
        bb=2*(bb-1)+jj;
        //if (bb<0) bb=MoveCount;
        SetPgnMoveText(uu, vv, rroot, bb);
      }
      else SetPgnMoveText(uu);
      return(vv);
    }

    //TODO: make it private
    this.HighlightCandidates = function (nn, ccs)
    { if (nn<0) { ExecCommands('',1); return; }
      var ii0=nn%8;
      var jj0=7-(nn-ii0)/8;
      var pp=this.Board[ii0][jj0];
      var cc=sign(pp);
      var tt=(1-cc)/2;
      var dd, ddi, ddj, bb, jj, aa=new Array();
      var nna=0, ddA=0;
      if (ccs.charAt(0)=="A") ddA=1;
    
      if (Math.abs(pp)==6)
      { this.Board[ii0][jj0]=0;
        if (this.IsOnBoard(ii0, jj0+cc))
        { bb=this.Board[ii0][jj0+cc];
          if (bb==0)
          { this.Board[ii0][jj0+cc]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
              aa[nna++]=String.fromCharCode(ii0+97)+(jj0+cc+1);
            this.Board[ii0][jj0+cc]=bb;
            if (2*jj0+5*cc==7)
            { bb=this.Board[ii0][jj0+2*cc];
              if (bb==0)
              { this.Board[ii0][jj0+2*cc]=pp;
                if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
                { nna-=ddA;
                  aa[nna++]=String.fromCharCode(ii0+97)+(jj0+2*cc+1);
                }
                this.Board[ii0][jj0+2*cc]=bb;
              }    
            }
          }
        }
        for (ddi=-1; ddi<=1; ddi+=2)
        { if (this.IsOnBoard(ii0+ddi, jj0+cc))  
          { bb=this.Board[ii0+ddi][jj0+cc];
            if (bb*cc<0)
            { this.Board[ii0+ddi][jj0+cc]=pp;
              if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
                aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
              this.Board[ii0+ddi][jj0+cc]=bb;
            }
          }
          if (2*jj0-cc==7)
          { if (this.IsOnBoard(ii0+ddi, jj0))
            { if (this.Board[ii0+ddi][jj0]==-cc*6) 
                { bb=this.Board[ii0+ddi][jj0+cc];
                if (bb==0)
                { if (MoveCount>StartMove)
                  { CanPass=-1;
                    dd=HistPiece[0][MoveCount-StartMove-1];
                    if ((HistType[0][MoveCount-StartMove-1]==5)&&(Math.abs(HistPosY[0][MoveCount-StartMove-1]-Piece[1-MoveType][dd].Pos.Y)==2))
                      CanPass=Piece[1-MoveType][dd].Pos.X;
                  }
                  else 
                    CanPass=EnPass;
                  if (CanPass==ii0+ddi)
                  { this.Board[ii0+ddi][jj0+cc]=pp;
                    if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
                      aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
                    this.Board[ii0+ddi][jj0+cc]=bb;
                  }
                }
              }
            }
          }
        }
        this.Board[ii0][jj0]=pp;
      }
      
      if (Math.abs(pp)==5)
      { this.Board[ii0][jj0]=0;
        for (ddi=-2; ddi<=2; ddi+=4)
        { for (ddj=-1; ddj<=1; ddj+=2)
          { if (this.IsOnBoard(ii0+ddi, jj0+ddj))  
            { bb=this.Board[ii0+ddi][jj0+ddj];
              if (bb*cc<=0)
              { this.Board[ii0+ddi][jj0+ddj]=pp;
                if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
                  aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
                this.Board[ii0+ddi][jj0+ddj]=bb;
              }
            }
          }
        }
        for (ddi=-1; ddi<=1; ddi+=2)
        { for (ddj=-2; ddj<=2; ddj+=4)
          { if (this.IsOnBoard(ii0+ddi, jj0+ddj))  
            { bb=this.Board[ii0+ddi][jj0+ddj];
              if (bb*cc<=0)
              { this.Board[ii0+ddi][jj0+ddj]=pp;
                if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
                  aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
                this.Board[ii0+ddi][jj0+ddj]=bb;
              }
            }
          }
        }
        this.Board[ii0][jj0]=pp;
      }
      
      if ((Math.abs(pp)==2)||(Math.abs(pp)==4))
      { this.Board[ii0][jj0]=0;
        dd=1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0+dd];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0+dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0+dd]=bb;
          }
          dd++;
        }
        if (dd>1) nna+=ddA;
        dd=-1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0+dd];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0+dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0+dd]=bb;
          }
          dd--;
        }
        if (dd<-1) nna+=ddA;
        dd=1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0-dd];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0-dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0-dd]=bb;
          }
          dd++;
        }
        if (dd>1) nna+=ddA;
        dd=-1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0-dd];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0-dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0-dd]=bb;
          }
          dd--;
        }
        if (dd<-1) nna+=ddA;
        this.Board[ii0][jj0]=pp;
      }
      
        
      if ((Math.abs(pp)==2)||(Math.abs(pp)==3))
      { this.Board[ii0][jj0]=0;
        dd=1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0]=bb;
          }
          dd++;
        }
        if (dd>1) nna+=ddA;
        dd=-1;
        bb=0;
        while ((this.IsOnBoard(ii0+dd,jj0))&&(bb==0))  
        { bb=this.Board[ii0+dd][jj0];
          if (bb*cc<=0)
          { this.Board[ii0+dd][jj0]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
              nna-=ddA;
            }
            this.Board[ii0+dd][jj0]=bb;
          }
          dd--;
        }
        if (dd<-1) nna+=ddA;
        dd=1;
        bb=0;
        while ((this.IsOnBoard(ii0,jj0+dd))&&(bb==0))  
        { bb=this.Board[ii0][jj0+dd];
          if (bb*cc<=0)
          { this.Board[ii0][jj0+dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
              nna-=ddA;
            }
            this.Board[ii0][jj0+dd]=bb;
          }
          dd++;
        }
        if (dd>1) nna+=ddA;
        dd=-1;
        bb=0;
        while ((this.IsOnBoard(ii0,jj0+dd))&&(bb==0))  
        { bb=this.Board[ii0][jj0+dd];
          if (bb*cc<=0)
          { this.Board[ii0][jj0+dd]=pp;
            if (!this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, tt))
            { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
              nna-=ddA;
            }
            this.Board[ii0][jj0+dd]=bb;
          }
          dd--;
        }
        if (dd<-1) nna+=ddA;
        this.Board[ii0][jj0]=pp;
      }
      
      if (Math.abs(pp)==1)
      { this.Board[ii0][jj0]=0;
        for (ddi=-1; ddi<=1; ddi++)
        { for (ddj=-1; ddj<=1; ddj++)
          { if (((ddi!=0)||(ddj!=0))&&(this.IsOnBoard(ii0+ddi, jj0+ddj)))  
            { bb=this.Board[ii0+ddi][jj0+ddj];
              if (bb*cc<=0)
              { this.Board[ii0+ddi][jj0+ddj]=pp;
                if (!this.IsCheck(ii0+ddi, jj0+ddj, tt))
                  aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
                this.Board[ii0+ddi][jj0+ddj]=bb;
              }
            }
          }
        }
        this.Board[ii0][jj0]=pp;
        jj=this.CanCastleLong();//O-O-O with Chess960 rules
        if (jj>=0)
        { this.Board[ii0][jj0]=0;
          this.Board[Piece[MoveType][jj].Pos.X][Piece[MoveType][jj].Pos.Y]=0;
          this.Board[2][tt*7]=1-2*tt;
          this.Board[3][tt*7]=3*(1-2*tt);
          ddi=ii0;
          bb=0;
          { while (ddi>2) 
            { bb+=this.IsCheck(ddi, tt*7, tt);
              ddi--;      
            }
            while (ddi<2) 
            { bb+=this.IsCheck(ddi, tt*7, tt);
              ddi++;
            }
          }
          bb+=this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, MoveType);
          if (bb==0) aa[nna++]=String.fromCharCode(2+97)+(tt*7+1);
          this.Board[2][tt*7]=0;
          this.Board[3][tt*7]=0;
          this.Board[ii0][jj0]=pp;
          this.Board[Piece[tt][jj].Pos.X][Piece[tt][jj].Pos.Y]=cc*3;
        }
        jj=this.CanCastleShort();//O-O with Chess960 rules
        if (jj>=0)
        { this.Board[ii0][jj0]=0;
          this.Board[Piece[MoveType][jj].Pos.X][Piece[MoveType][jj].Pos.Y]=0;
          this.Board[6][tt*7]=1-2*tt;
          this.Board[5][tt*7]=3*(1-2*tt);
          ddi=ii0;
          bb=0;
          { while (ddi>2) 
            { bb+=this.IsCheck(ddi, tt*7, tt);
              ddi--;      
            }
            while (ddi<2) 
            { bb+=this.IsCheck(ddi, tt*7, tt);
              ddi++;
            }
          }
          bb+=this.IsCheck(Piece[tt][0].Pos.X, Piece[tt][0].Pos.Y, MoveType);
          if (bb==0) aa[nna++]=String.fromCharCode(6+97)+(tt*7+1);
          this.Board[6][tt*7]=0;
          this.Board[5][tt*7]=0;
          this.Board[ii0][jj0]=pp;
          this.Board[Piece[tt][jj].Pos.X][Piece[tt][jj].Pos.Y]=cc*3;
        }
      }
    
      if ((nna>0)&&(ccs!=" "))
      { tt=ccs.charAt(0);
        cc=ccs.substr(1,6);
        if (tt=="A")
        { bb=tt+String.fromCharCode(ii0+97)+(jj0+1)+aa[0]+cc;
          for (jj=1; jj<nna; jj++) bb+=","+tt+String.fromCharCode(ii0+97)+(jj0+1)+aa[jj]+cc;
        }
        else
        { bb=tt+aa[0]+cc;
          for (jj=1; jj<nna; jj++) bb+=","+tt+aa[jj]+cc;
        }
        ExecCommands(bb,1);
      }  
      else return(aa);
    }

    this.ApplySAN = function(ss)
    {
       if (ss.length<6)
       {
          PieceName = "KQRBNP";
          if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=PieceName;
       }
       else
       {
          PieceName = ss;
          if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=ss;
       }
       for (var ii=0; ii<6; ii++) PieceCode[ii]=PieceName.charCodeAt(ii);
    }
    
    this.ShowSAN = function(ss)
    {
       ShowPieceName = ss;
       if (ss.length != 6) ShowPieceName = "";
       if (   (ShowPieceName == "") || (ShowPieceName == PieceName)   ) return;
       if (   (document.BoardForm) && (document.BoardForm.PgnMoveText)   )
       {
          var tt = document.BoardForm.PgnMoveText.value;
          if (tt == "") return;
          var ww = window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
          ww.document.open();
          ww.document.writeln("<HTML><HEAD></HEAD><BODY>" + this.TransformSAN(tt) + "</BODY></HTML>");
          ww.document.close();
       }
    }
    
    this.TransformSAN = function(ss)
    {
       if (ss == "") return("");
       if ((ShowPieceName == "") || (ShowPieceName == PieceName)) return(ss);
       var jj, rr, tt = "";
       for (jj = 0; jj < ss.length; jj++)
       {
          rr = PieceName.indexOf(ss.charAt(jj));
          if (rr >= 0) tt += ShowPieceName.charAt(rr);
          else tt += ss.charAt(jj);
       }
       return(tt);
    }
    //TODO: miss using of function implemented in event handler manner
    this.SetBoardClicked = function(nn) //TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
    {
       try
       {
          if (! xdocument.BoardForm) return;
          if (! xdocument.images[ImageOffset].style) { BoardClicked = nn; return; }
          if (this.CandidateStyle != "") this.HighlightCandidates(nn, this.CandidateStyle);
          if (isDragDrop) { BoardClicked = nn; return; }
          //if (BoardClicked >= 0) //really needed styles processing?
          //{
          //   if (BoardClicked < 64)
          //   {
          //      if (isRotated)
          //         xdocument.images[ImageOffset + 63 - BoardClicked].style.borderColor = BorderColor;
          //      else
          //         xdocument.images[ImageOffset + BoardClicked].style.borderColor = BorderColor;
          //   }
          //   else xdocument.images[ImageOffset + BoardClicked + 3].style.borderColor = BorderColor;
          //}  
          BoardClicked = nn;
          //if (BoardClicked >= 0) 
          //{
          //   if (BoardClicked < 64)
          //   {
          //      if (isRotated)
          //         xdocument.images[ImageOffset + 63 - BoardClicked].style.borderColor="#FF0000";
          //      else
          //         xdocument.images[ImageOffset + BoardClicked].style.borderColor = "#FF0000";
          //   }
          //   else xdocument.images[ImageOffset + BoardClicked + 3].style.borderColor = "#FF0000";
          //}
          
       }catch(e)
       {
          throw "SetBoardClicked (" + nn + ")>>rethrow  error: " + e + "\n";
       }
    }

    //TODO: enable this function
    this.ShowCapturedPieces = function (bb)
    {
      this.isCapturedPieces = bb;
      if (this.isCapturedPieces) this.RefreshBoard();
      else
      {
         var kk, kk0 = 0;
         if (xdocument.images["RightLabels"]) kk0++;
         for (kk = 0; kk < 32; kk++) this.SetImg(64 + kk0 + kk,LabelPic[4]);
         if ((parent) && (parent.ChangeColWidth)) parent.ChangeColWidth(0);
      }
    }

	//private
    var ExecCommands = function(nnc, hh)
    {
       var ii, jj, kk, nn, mm, cc, tt, bb0, bb1, xx0, yy0, xx1, yy1, aa = "";
	   var this_var = this;
       if (!isExecCommand)  return;
       if (document.layers) return;
       if (!document.getElementById("this.Board")) return;
       if (nnc)
       {
          NewCommands.length = 0;
    
          if (nnc.indexOf(",") > 0) NewCommands = nnc.replace(/ /g, '').split(",");
          else NewCommands[0] = nnc.replace(/ /g, '');
    
          if (hh);
          else HistCommand[MoveCount - StartMove] = NewCommands.join("|");
          setTimeoutStub(function(){this_var.ExecCommands()}, 100, this);
    
          return;
       }
    
       var dd = parseInt(document.getElementById("this.Board").offsetHeight);
       var dd32 = Math.round(dd / 32);
       for (ii = 0; ii < OldCommands.length; ii++)
       {
          tt = OldCommands[ii].charAt(0);
          if ((tt == "B") || (tt == "C"))
          {
             nn = OldCommands[ii].charCodeAt(1) - 97 + (8 - parseInt(OldCommands[ii].charAt(2))) * 8;
             //if (isRotated) nn = 63 - nn;
             if ((nn >= 0) && (nn <= 63))
             {
                if (tt == "B") xdocument.images[ImageOffset + nn].style.borderColor = BorderColor;
                else xdocument.images[ImageOffset + nn].style.backgroundColor = "transparent";
             }
          }
          if (tt == "A") document.getElementById("Canvas").innerHTML = "<div style='position:absolute;top:0px;left:0px;width:0px;height:0px;'></div>";
       }
       if (NewCommands.length > 0) this.SetAutoPlay(false);
       for (ii = 0; ii < NewCommands.length; ii++)
       {
          tt = NewCommands[ii].substr(1, 4);
          if ((tt == "this") || (tt == "last"))
          {
             if (tt == "this") { kk = MoveCount - StartMove - 1; ll = 0; }
             else  { kk = MoveCount - StartMove - 2; ll = 1; }
             if (kk >= 0)
             {
                tt = NewCommands[ii].charAt(0);
                cc = NewCommands[ii].substr(5, 6);
                nn = NewCommands.length;   
                if ((tt == "B") || (tt == "C"))
                {
                   NewCommands[nn]     = tt + String.fromCharCode(97 + HistPosX[0][kk]) + (1 + HistPosY[0][kk]) + cc;
                   NewCommands[nn + 1] = tt + String.fromCharCode(97 + Piece[(MoveType + ll + 1) % 2][HistPiece[0].Pos.X[kk]]) + (1 + Piece[(MoveType + ll + 1) % 2][HistPiece[0].Pos.Y[kk]]) + cc;
                }
                if (tt=="A")
                {
                   NewCommands[nn]=tt+String.fromCharCode(97+HistPosX[0][kk])+(1+HistPosY[0][kk]);
                   NewCommands[nn]+=String.fromCharCode(97+Piece[(MoveType+ll+1)%2][HistPiece[0].Pos.X[kk]])+(1+Piece[(MoveType+ll+1)%2][HistPiece[0].Pos.Y[kk]])+cc;
                }
                NewCommands[ii]="X";
             }
          }
          else
          {
             tt=NewCommands[ii].charAt(0);
             if ((tt=="B")||(tt=="C"))
             { nn=NewCommands[ii].charCodeAt(1)-97+(8-parseInt(NewCommands[ii].charAt(2)))*8;
               if ((nn>=0)&&(nn<=63))
               { //if (isRotated) nn=63-nn;
                 cc=NewCommands[ii].substr(3,6);
                 if (cc=="R") cc="FF0000";
                 if (cc=="G") cc="00FF00";
                 if (cc=="B") cc="0000FF";
                 if (cc.length!=6) cc="#FFFFFF";
                 else cc="#"+cc;
                 if (tt=="B") xdocument.images[ImageOffset+nn].style.borderColor=cc;
                 else xdocument.images[ImageOffset+nn].style.backgroundColor=cc;   
               }
             }
             if ((tt=="A")&&(dd>0))
             {
                kk = NewCommands[ii].charCodeAt(1) - 97;
                jj = parseInt(NewCommands[ii].charAt(2));
                nn = kk + (8 - jj) * 8;
                if ((nn >= 0) && (nn <= 63)) bb0 = this.Board[kk][jj - 1];
                kk = NewCommands[ii].charCodeAt(3) - 97;
                jj = parseInt(NewCommands[ii].charAt(4));
                mm = kk + (8 - jj) * 8;
                if ((mm >= 0) && (mm <= 63)) bb1 = this.Board[kk][jj - 1];
                if ((nn >= 0) && (nn <= 63) && (mm >= 0) && (mm <= 63) && (nn != mm))
                {
                   //if (isRotated) { nn = 63 - nn; mm = 63 - mm; }
                   xx0 = nn % 8; yy0 = (nn - xx0) / 8;
                   xx1 = mm % 8; yy1 = (mm - xx1) / 8;
                   nn = 0; mm = 0;        
                   if (xx0 < xx1) nn =  1;
                   if (xx0 > xx1) nn = -1;
                   if (yy0 < yy1) mm =  1;
                   if (yy0 > yy1) mm = -1;
                   xx0 = Math.round((2 * xx0 + 1) * dd / 16);
                   yy0 = Math.round((2 * yy0 + 1) * dd / 16);
                   if (bb0 != 0)
                   {
                      xx0 += nn * dd32;
                      yy0 += mm * dd32;
                   }
                   xx1 = Math.round((2 * xx1 + 1) * dd / 16);
                   yy1 = Math.round((2 * yy1 + 1) * dd / 16);
                   if (bb1 != 0)
                   {
                      xx1 -= nn * dd32;
                      yy1 -= mm * dd32;
                   }
                   cc = NewCommands[ii].substr(5, 6);
                   if (cc == "R") cc = "FF0000";
                   if (cc == "G") cc = "00FF00";
                   if (cc == "B") cc = "0000FF";
                   if (cc.length!=6) cc = "#FFFFFF";
                   else cc = "#" + cc;
                   aa += IVFChessGame.GetArrow(xx0, yy0, xx1, yy1, cc);
                }
             }
          }
       }
       if (aa != "") 
       {
          document.getElementById("Canvas").style.top = -dd + "px";
          document.getElementById("Canvas").innerHTML = aa;
       }
       OldCommands.length = 0;
       for (ii = 0; ii < NewCommands.length; ii++) OldCommands[ii] = NewCommands[ii];
       NewCommands.length=0;
    }

	//TODO: wtf
    this.EvalUrlString = function(ss)
    { var ii, jj, aa, uurl = window.location.search;
      if (uurl != "")
      { uurl = uurl.substring(1, uurl.length);
        while (uurl.indexOf("|")>0) uurl=uurl.replace("|","/");
        while (uurl.indexOf("%7C")>0) uurl=uurl.replace("%7C","/");
        var llist = uurl.split("&");
        for (ii=0; ii<llist.length; ii++)
        { tt = llist[ii].split("=");
          aa=tt[1];
          for (jj=2; jj<tt.length; jj++) aa+="="+tt[jj];
          if (ss)
          { if (ss == tt[0])           try{tt[0](unescape(aa));}catch(err){};
          }
          else 
          { //if(ev_al("window." + tt[0])) try{tt[0](unescape(aa))}catch(err){};
          }
        }
      }
    }
    var HighlightMove = function (nn)
    { var ii, cc, bb, jj=0, ll=TargetDocument.anchors.length;
      if (ll==0) return;
      if (! TargetDocument.anchors[0].style) return;
      if ((activeAnchor>=0)&&(ll>activeAnchor))
      { TargetDocument.anchors[activeAnchor].style.backgroundColor="";
        activeAnchor=-1;
      }
      if (isNaN(startAnchor))
      { while ((jj<ll)&&(TargetDocument.anchors[jj].name!=startAnchor)) jj++;
      }
      for (ii=jj; ((ii<ll)&&(activeAnchor<0)); ii++)
      { if (TargetDocument.anchors[ii].name==nn)
        { activeAnchor=ii;
          TargetDocument.anchors[activeAnchor].style.backgroundColor=activeAnchorBG;
          if ((document!=TargetDocument)&&(parent.document!=TargetDocument)&&(TargetDocument.anchors[activeAnchor].scrollIntoView)) 
            TargetDocument.anchors[activeAnchor].scrollIntoView(false);
          return;
        }
      }
    }
    var IsMate = function()
    { var aa, ii0, jj0, nn=0, ii=this.IsCheck(Piece[MoveType][0].Pos.X, Piece[MoveType][0].Pos.Y, MoveType);
      for (ii0=0; (nn==0)&&(ii0<8); ii0++)
      { for (jj0=0; (nn==0)&&(jj0<8); jj0++)
        { if (sign(this.Board[ii0][jj0])==((MoveCount+1)%2)*2-1)
          { nn=(7-jj0)*8+ii0;
              aa=this.HighlightCandidates(nn," ");
              if (aa.length>0) nn=aa[0];
              else nn=0;
          }
        }
      }
      if (nn==0)
      { if(ii) return("Checkmate.");
        else return("Stalemate.");
      }
      return(false);
    }

    var SetPgnMoveText = function (ss, vvariant, rroot, sstart)
    { if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
        document.BoardForm.PgnMoveText.value=ss;
      if (vvariant)
      { ShortPgnMoveText[0][vvariant]=ss;
        ShortPgnMoveText[1][vvariant]=rroot;
        ShortPgnMoveText[2][vvariant]=sstart;
      }
      else ShortPgnMoveText[0][0]=ss;
    }

    
    var PrintPosition = function()
    { var pp="", tt="", ww;
      if (document.BoardForm)
      { if (document.BoardForm.Pawns) pp=document.BoardForm.Pawns.checked;
        if (pp) tt="Pawn structure after ";
        else tt="Position after ";  
        if (parseInt(document.BoardForm.Position.value)>0) tt+=document.BoardForm.Position.value;
        else tt=document.BoardForm.Position.value;   
      }
      ww=window.open("");
      with(ww.document)
      { open();
        writeln("<html><head><title>"+tt+"</title></head><body><div align='center'>");
        writeln(this.GetDiagram(pp,tt));
        if(Annotation[MoveCount]) writeln(Annotation[MoveCount]);
        writeln("</div></body></html>");    
        close();
      }
      ww.print();
    }
	
    this.IsCheck = function (xx, yy, tt)
    { var ii0=xx, jj0=yy, ddi, ddj, bb;
      for (ddi=-2; ddi<=2; ddi+=4)
      { for (ddj=-1; ddj<=1; ddj+=2)
        { if (this.IsOnBoard(ii0+ddi, jj0+ddj))  
          { if (this.Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
          }
        }
      }
      for (ddi=-1; ddi<=1; ddi+=2)
      { for (ddj=-2; ddj<=2; ddj+=4)
        { if (this.IsOnBoard(ii0+ddi, jj0+ddj)) 
          { if (this.Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
          }
        }
      }
      for (ddi=-1; ddi<=1; ddi+=2)
      { ddj=1-2*tt;
        { if (this.IsOnBoard(ii0+ddi, jj0+ddj)) 
          { if (this.Board[ii0+ddi][jj0+ddj]==12*tt-6) return(1);
          }
        }
      }
      if ((Math.abs(Piece[1-tt][0].Pos.X-xx)<2)&&(Math.abs(Piece[1-tt][0].Pos.Y-yy)<2)) 
        return(1);
      for (ddi=-1; ddi<=1; ddi+=1)
      { for (ddj=-1; ddj<=1; ddj+=1)
        { if ((ddi!=0)||(ddj!=0))
          { ii0=xx+ddi; 
            jj0=yy+ddj;
            bb=0;
            while ((this.IsOnBoard(ii0, jj0))&&(bb==0))
            { bb=this.Board[ii0][jj0];
              if (bb==0)
              { ii0+=ddi;
                jj0+=ddj;
              }
              else
              { if (bb==4*tt-2) return(1); 
                if ((bb==6*tt-3)&&((ddi==0)||(ddj==0))) return(1); 
                if ((bb==8*tt-4)&&(ddi!=0)&&(ddj!=0)) return(1); 
              }  
            }
          }
        }
      }
      return(0);
    }

    this.SetMove = function(mmove, vvariant)
    { if (isNaN(mmove)) return;
      var ii=isCalculating;
      isCalculating=true;
      if (this.RecordCount>0) this.MoveBack(MaxMove);
      if (vvariant)
      { if (vvariant>=ShortPgnMoveText[0].length) { isCalculating=ii; return; }
        if (CurVar!=vvariant) 
        { this.SetMove(ShortPgnMoveText[2][vvariant], ShortPgnMoveText[1][vvariant]);
          CurVar=vvariant;
        }  
      }
      else
      { while (CurVar!=0)
        { if (MoveCount==ShortPgnMoveText[2][CurVar])
          { CurVar=ShortPgnMoveText[1][CurVar];
            if ((!isCalculating)&&(document.BoardForm)&&(document.BoardForm.PgnMoveText))
              document.BoardForm.PgnMoveText.value=ShortPgnMoveText[0][CurVar];
          }  
          else this.MoveBack(1);
        }
      }  
      isCalculating=ii;
      var dd=mmove-MoveCount;
      if (dd<=0) this.MoveBack(-dd);
      else this.MoveForward(dd, 1);
      if (isCalculating) return;
      if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
        document.BoardForm.PgnMoveText.value=ShortPgnMoveText[0][CurVar];
      if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
      if (this.isAutoPlay) this.AutoPlayInterval=setTimeoutStub(function(){this.MoveForward(1);}, this.Delay, this);
    }

    this.UpdateAnnotation = function(bb)
    {
       if (! parent.frames["annotation"]) return;
       if(bb)
       {
          with (parent.frames["annotation"].document)
          {
             open();
             writeln("<html><head></head><body><form>"); 
             writeln("<input type='hidden' name='MoveCount' value='"+MoveCount+"'>");
             write("<textarea rows=8 style='width:100%' name='Annotation'>");
             if (Annotation[MoveCount]) write(Annotation[MoveCount]);
             writeln("</textarea>");
             if (AnnotationFile) writeln("<input type='button' value='Save Annotation' onclick='parent.frames[\"board\"].SaveAnnotation(this.form)'>");
             writeln("</form></body></html>");
             close();
          }  
       }
       else
       {
          parent.frames["annotation"].document.forms[0].MoveCount.value=MoveCount;
          if (Annotation[MoveCount])
             parent.frames["annotation"].document.forms[0].Annotation.value=Annotation[MoveCount];
          else
             parent.frames["annotation"].document.forms[0].Annotation.value="";
       }  
    }

    this.SaveAnnotation = function(ff)
    { var mm=parseInt(ff.MoveCount.value);
      Annotation[mm]=ff.Annotation.value;
      if ((AnnotationFile)&&(parent.frames['annotation']))
        parent.frames['annotation'].location.replace(AnnotationFile+"?MoveCount="+mm+"&Annotation="+escape(Annotation[mm]));
    }

    this.GetDiagram = function(pp, ssp)
    { var ii, jj, cc, tt, nn, mm, ss=String.fromCharCode(13)+"<P align=center>", oo, aa=new Array(64);
      var bb=Border;
      var iip=this.PGNViewImagePath;
      if (document.BoardForm)
      { if (oo=document.BoardForm.ImagePath)
        { iip=oo.options[oo.options.selectedIndex].value;
          if (iip!="") { iip=iip.replace("|","/"); bb=0; }
        }
        if (oo=document.BoardForm.Border) bb=oo.options.selectedIndex;
      }
      for (ii=0; ii<64; ii++) aa[ii]="";
      if (isCalculating) oo=NewCommands;
      else oo=OldCommands;
      if (oo.length>0)
      { for (ii=0; ii<oo.length; ii++)
        { tt=oo[ii].charAt(0);
          if ((tt=="B")||(tt=="C"))
          { nn=oo[ii].charCodeAt(1)-97+(8-parseInt(oo[ii].charAt(2)))*8;
            if ((nn>=0)&&(nn<=63))
            { //if (isRotated) nn=63-nn;
              cc=oo[ii].substr(3,6);
              if (cc=="R") cc="FF0000"; 
              if (cc=="G") cc="00FF00";
              if (cc=="B") cc="0000FF";
              if (tt=="B") aa[nn]+="border-color:"+cc+";";
              else aa[nn]+="background-color:"+cc+";";   
            }
          }
        }
      } 
      ss+="<table border=0 cellpadding=1 cellspacing=0>";
      if (ssp) ss+="<tr><th>"+ssp+"</th></tr>";
      ss+="<tr><th bgcolor=#808080 style='vertical-align:top'>";
      ss+="<TABLE border="+(bb+2)+" cellpadding=0 cellspacing=0><TR><TD>";
      ss+="<div><TABLE border=0 cellpadding=0 cellspacing=0>";
      var tt=new Array("k","q","r","b","n","p");
      //if (isRotated)
      //{ for (jj=0; jj<8; jj++)
      //  { ss+="<TR>";
      //    for (ii=7; ii>=0; ii--)
      //    { if ((this.Board[ii][jj]==0)||((pp)&&((this.Board[ii][jj]+6)%6!=0)))
      //        ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
      //      else
      //        ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+ColorName[(1-sign(this.Board[ii][jj]))/2]+tt[Math.abs(this.Board[ii][jj])-1]+".gif'";
      //      if (document.layers) ss+=" border="+bb+"></TD>";
      //      else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+BorderColor+";"+aa[jj*8+(7-ii)]+"'></TD>";
      //    }
      //    ss+="</TR>";
      //  }
      //}
      //else
      { for (jj=7; jj>=0; jj--)
        { ss+="<TR>";
          for (ii=0; ii<8; ii++)
          { if ((this.Board[ii][jj]==0)||((pp)&&((this.Board[ii][jj]+6)%6!=0)))
              ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
            else
              ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+ColorName[(1-sign(this.Board[ii][jj]))/2]+tt[Math.abs(this.Board[ii][jj])-1]+".gif'";
            if (document.layers) ss+=" border="+bb+"></TD>";
            else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+BorderColor+";"+aa[(7-jj)*8+ii]+"'></TD>";
          }
          ss+="</TR>";
        }
      }
      ss+="</TABLE></div>";
      if (!document.layers) 
      { var xx0, xx1, bb0, bb1, kk, dd=parseInt(document.getElementById("this.Board").offsetHeight);
        if (iip!=0)
        { dd=0;
          for (ii=0; ii<iip.length; ii++)
          { if (!isNaN(iip.charAt(ii))) { dd*=10; dd+=parseInt(iip.charAt(ii)); }
          }
          if (dd>0) dd+=2*bb;
          dd*=8;
        }
        var dd32=Math.round(dd/32);
        if (oo.length>0)
        { ss+="<div style='position:relative;top:-"+dd+"px'>";  
          for (ii=0; ii<oo.length; ii++)
          { tt=oo[ii].charAt(0);
            if ((tt=="A")&&(dd>0))
            { kk=oo[ii].charCodeAt(1)-97;
              jj=parseInt(oo[ii].charAt(2));
              nn=kk+(8-jj)*8;
              if ((nn>=0)&&(nn<=63)) bb0=this.Board[kk][jj-1];
              kk=oo[ii].charCodeAt(3)-97;
              jj=parseInt(oo[ii].charAt(4));
              mm=kk+(8-jj)*8;
              if ((mm>=0)&&(mm<=63)) bb1=this.Board[kk][jj-1];
              if ((nn>=0)&&(nn<=63)&&(mm>=0)&&(mm<=63)&&(nn!=mm))
              { //if (isRotated) { nn=63-nn; mm=63-mm; }
                xx0=nn%8; yy0=(nn-xx0)/8;
                xx1=mm%8; yy1=(mm-xx1)/8;
                nn=0; mm=0;        
                if (xx0<xx1) nn=1;
                if (xx0>xx1) nn=-1;
                if (yy0<yy1) mm=1;
                if (yy0>yy1) mm=-1;
                xx0=Math.round((2*xx0+1)*dd/16);
                yy0=Math.round((2*yy0+1)*dd/16);
                if (bb0!=0)
                { xx0+=nn*dd32;
                  yy0+=mm*dd32;
                }
                xx1=Math.round((2*xx1+1)*dd/16);
                yy1=Math.round((2*yy1+1)*dd/16);
                if (bb1!=0)
                { xx1-=nn*dd32;
                  yy1-=mm*dd32;
                }
                cc=oo[ii].substr(5,6);
                if (cc=="R") cc="FF0000";
                if (cc=="G") cc="00FF00";
                if (cc=="B") cc="0000FF";
                if (cc.length!=6) cc="#FFFFFF";
                else cc="#"+cc;
                ss+=IVFChessGame.GetArrow(xx0,yy0,xx1,yy1,cc);
              }
            }
          }
          ss+="</div>";  
        }
      }
      ss+="</TD></TR></TABLE>";
      if (IsLabelVisible)
      { //if (isRotated)
        //{ ss+="</th><th><img src='"+iip+"1_8.gif'></th>";
        //  if (this.isCapturedPieces) ss+="<th>"+this.GetCapturedPieces(iip,bb)+"</th>";
        //  ss+="</tr><tr><th><img src='"+iip+"h_a.gif'></th><th><img src='"+iip+"1x1.gif'>";
        //  if (this.isCapturedPieces) ss+="</th><th>";
        //}
        //else
        { ss+="</th><th><img src='"+iip+"8_1.gif'></th>";
          if (this.isCapturedPieces) ss+="<th>"+this.GetCapturedPieces(iip,bb)+"</th>";
          ss+="</tr><tr><th><img src='"+iip+"a_h.gif'></th><th><img src='"+iip+"1x1.gif'>";
          if (this.isCapturedPieces) ss+="</th><th>";
        }  
      }
      else
      { if (this.isCapturedPieces) ss+="</th><th>"+this.GetCapturedPieces(iip,bb);
      }
      ss+="</th></tr></table></P>"+String.fromCharCode(13);
      return (ss);
    }
	
    this.GetCapturedPieces = function (iip,bb)
    { var ii, jj, kk, ll, ss, rr=new Array(8);
      for (ii=0; ii<8; ii++) rr[ii]="";
      var tt=new Array("k","q","r","b","n","p");
      var pp0=new Array(0,1,1,2,2,2,8);
      kk=0;
      ii=0;
      //if (isRotated) ii=1;
      for (jj=0; jj<16; jj++) pp0[Piece[ii][jj].Type+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp0[jj+1]; ll++)
        { rr[kk%4]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[jj]+".gif'></td>";
          kk++;
          pp0[0]++;
        }
      }
      for (ll=0; ll>pp0[0]; ll--)
      { rr[kk%4]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[5]+".gif'></td>";
        kk++;
      }
      while (kk<4) { rr[kk%4]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
      while (kk<16){ rr[kk%4]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; }
      var pp1=new Array(0,1,1,2,2,2,8);
      kk=0;
      ii=1-ii;
      for (jj=0; jj<16; jj++) pp1[Piece[ii][jj].Type+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp1[jj+1]; ll++)
        { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[jj]+".gif'></td>";
          kk++;
          pp1[0]++;
        }
      }
      for (ll=0; ll>pp1[0]; ll--)
      { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[5]+".gif'></td>";
        kk++;
      }
      while (kk<4) { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
      while (kk<16){ rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; } 
      ss="<table border=0 cellpadding="+bb+" cellspacing=0>";
      for (ii=0; ii<8; ii++) ss+="<tr>"+rr[ii]+"</tr>";
      ss+="</table>";
      return(ss);
    }

	//TODO:global function?
    IVFChessGame.GetArrow = function (theX0, theY0, theX1, theY1, theColor)
    { var ll, rr, tt, bb, ww, hh, ccl, ccr, cct, ccb, dd, tmpX0, tmpY0;
      var ddir=(((theY1>theY0)&&(theX1>theX0))||((theY1<theY0)&&(theX1<theX0))) ? true : false;
      if (theX0<=theX1) { ll=theX0; rr=theX1; }
      else { ll=theX1; rr=theX0; }
      if (theY0<=theY1) { tt=theY0; bb=theY1; }
      else { tt=theY1; bb=theY0; }
      ww=rr-ll; hh=bb-tt;
      dd="<div style='position:absolute;left:"+(ll-1-16)+"px;top:"+(tt-1-16)+"px;width:"+(ww+2+2*16)+"px;height:"+(hh+2+2*16)+"px;z-index:100'>"
      if ((ww==0)||(hh==0)) dd+="<div style='position:absolute;left:16px;top:16px;width:"+(ww+2)+"px;height:"+(hh+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
      else
      { if (ww>hh)
        { ccr=0; cct=0;
          while (ccr<ww)
          { ccl=ccr;
            while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16)+"px;top:"+(cct+16)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccr+16)+"px;top:"+(cct+16)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            cct++;
          }
        }
        else
        { ccb=0; ccl=0;
          while (ccb<hh)
          { cct=ccb;
            while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16)+"px;top:"+(cct+16)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccl+16)+"px;top:"+(cct+16)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            ccl++;
          }
        }
      }
      var LL=1, ll0=ll, tt0=tt;
      var ccL=12, ccB=4;
      var DDX=theX1-theX0, DDY=theY1-theY0;
      if ((DDX!=0)||(DDY!=0)) LL=Math.sqrt(0+(DDX*DDX)+(DDY*DDY));
      tmpX0=theX1-Math.round(1/LL*(ccL*DDX-ccB*DDY));
      tmpY0=theY1-Math.round(1/LL*(ccL*DDY+ccB*DDX));
      ddir=(((theY1>tmpY0)&&(theX1>tmpX0))||((theY1<tmpY0)&&(theX1<tmpX0))) ? true : false;
      if (tmpX0<=theX1) { ll=tmpX0; rr=theX1; }
      else { ll=theX1; rr=tmpX0; }
      if (tmpY0<=theY1) { tt=tmpY0; bb=theY1; }
      else { tt=theY1; bb=tmpY0; }
      ww=rr-ll; hh=bb-tt;
      if ((ww==0)||(hh==0)) dd+="<div style='position:absolute;left:"+(16+ll-ll0)+"px;top:"+(16+tt-tt0)+"px;width:"+(ww+2)+"px;height:"+(hh+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
      else
      { if (ww>hh)
        { ccr=0; cct=0;
          while (ccr<ww)
          { ccl=ccr;
            while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccr+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            cct++;
          }
        }
        else
        { ccb=0; ccl=0;
          while (ccb<hh)
          { cct=ccb;
            while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            ccl++;
          }
        }
      }
      tmpX0=theX1-Math.round(1/LL*(ccL*DDX+ccB*DDY));
      tmpY0=theY1-Math.round(1/LL*(ccL*DDY-ccB*DDX));
      ddir=(((theY1>tmpY0)&&(theX1>tmpX0))||((theY1<tmpY0)&&(theX1<tmpX0))) ? true : false;
      if (tmpX0<=theX1) { ll=tmpX0; rr=theX1; }
      else { ll=theX1; rr=tmpX0; }
      if (tmpY0<=theY1) { tt=tmpY0; bb=theY1; }
      else { tt=theY1; bb=tmpY0; }
      ww=rr-ll; hh=bb-tt;
      if ((ww==0)||(hh==0)) dd+="<div style='position:absolute;left:"+(16+ll-ll0)+"px;top:"+(16+tt-tt0)+"px;width:"+(ww+2)+"px;height:"+(hh+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
      else
      { if (ww>hh)
        { ccr=0; cct=0;
          while (ccr<ww)
          { ccl=ccr;
            while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccr+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:"+(ccr-ccl+2)+"px;height:2px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            cct++;
          }
        }
        else
        { ccb=0; ccl=0;
          while (ccb<hh)
          { cct=ccb;
            while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
            if (ddir) dd+="<div style='position:absolute;left:"+(ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            else dd+="<div style='position:absolute;left:"+(ww-ccl+16+ll-ll0)+"px;top:"+(cct+16+tt-tt0)+"px;width:2px;height:"+(ccb-cct+2)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
            ccl++;
          }
        }
      }
      dd+="</div>";
      return(dd);
    }
    this.SetBoardSetupMode = function(mm)
    { BoardSetupMode=mm;
      this.SetBoardClicked(-1);
    }	
    this.SetupPieceClick = function(ii,bb)
    {
       try
       {
          if (isDragDrop&&(!bb)) return;
          var nn=BoardClicked;
          if (ii>11)
          {
             if (nn>=0)
             {
                this.SetBoardSetupMode('delete');
                /*if (isRotated) BoardClick(63-nn,true);
                else*/ BoardClick(nn,true);
                this.SetBoardSetupMode('move');
             }
             return;
          }
          this.SetBoardClicked(-1);
          BoardClick(ii+64,true);
       }catch(e)
       {
          alert("SetupPieceClick>>error: " + e);
       }
    }
    this.SetupBoardClick = function(nn)
    { var ii, jj, ii0, jj0, ii1, jj1, mm, nnn;
      /*if (isRotated) nnn=63-nn;
      else*/ nnn=nn;
      if ((BoardClicked<0)&&(BoardSetupMode!='delete'))
      { if (nn>=64) { this.SetBoardClicked(nn); return; }
        ii0=nnn%8;
        jj0=7-(nnn-ii0)/8;
        if (this.Board[ii0][jj0]!=0) this.SetBoardClicked(nnn); 
        return; 
      }
      if (BoardClicked>=0)
      { ii0=BoardClicked%8;
        jj0=7-(BoardClicked-ii0)/8;
      }
      ii1=nnn%8;
      jj1=7-(nnn-ii1)/8;
      if (((this.Board[ii1][jj1]!=0))&&(BoardSetupMode!='delete')) 
      { this.SetBoardClicked(nnn); 
        return;
      }
      if (BoardSetupMode=='copy')
      { this.Board[ii1][jj1]=this.Board[ii0][jj0];
        this.SetBoardClicked(nnn);
      }
      if (BoardSetupMode=='move')
      { if (BoardClicked>=64)
        { ii0=BoardClicked%2;
          jj0=(BoardClicked-64-ii0)/2;
          if (ii0==0) this.Board[ii1][jj1]=jj0+1;
          else this.Board[ii1][jj1]=-jj0-1;
        }
        else
        { this.Board[ii1][jj1]=this.Board[ii0][jj0];
          this.Board[ii0][jj0]=0;
          this.SetBoardClicked(nnn);
        }  
      }
      if (BoardSetupMode=='delete')
      { this.Board[ii1][jj1]=0;
        this.SetBoardClicked(-1);
      }
      //if (isRotated)
      //{ for (ii=0; ii<8; ii++)
      //  { for (jj=0; jj<8; jj++)
      //    { if (this.Board[ii][jj]==0)
      //        this.SetImg(63-ii-(7-jj)*8,BoardPic);
      //      else
      //        this.SetImg(63-ii-(7-jj)*8,PiecePic[(1-sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
      //    }
      //  }
      //}
      //else
      { for (ii=0; ii<8; ii++)
        { for (jj=0; jj<8; jj++)
          { if (this.Board[ii][jj]==0)
              this.SetImg(ii+(7-jj)*8,BoardPic);
            else
              this.SetImg(ii+(7-jj)*8,PiecePic[(1-sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
          }
        }
      }
    }
	//TODO: make HTML5
    ScoreSheetHeader = function(tt)
    { var pp=new Array("Event","Site","Date","Round", "Result","White","Black","ECO","WhiteElo","BlackElo","FEN");
      var vv=new Array("?","?","?","?","?","?","?","?","?","?","");
      var ii, jj, ss, ee;
      for (ii=0; ii<pp.length; ii++)
      { jj=tt.indexOf("["+pp[ii]);
        if (jj>=0)
        { ss=tt.indexOf('"', jj+1);
          if (ss>=0)
          { ee=tt.indexOf('"', ss+1);
            if (ee>ss+1)
            { vv[ii]=tt.substring(ss+1,ee);
            }
          }
        }
      }
      ss="<div align='center'><table width=50% cellpadding=0 cellspacing=0><tr><td><table width=100% cellpadding=2 cellspacing=0>";
      ss+="<tr><td colspan=9><small>event</small><br /><nobr>"+vv[0]+"</nobr></td><td colspan=5><small>date</small><br /><nobr>"+vv[2]+"</nobr></td></tr>";
      ss+="<tr><td colspan=9><small>site</small><br /><nobr>"+vv[1]+"</nobr></td><td width='8%'><small>rnd</small><br /><nobr>"+vv[3]+"</nobr></td><td width='16%' colspan=2><small>score</small><br /><nobr>"+vv[4]+"</nobr></td><td width='16%' colspan=2><small>eco</small><br /><nobr>"+vv[7]+"</nobr></td></tr>";
      ss+="<tr><td colspan=11><small>white</small><br /><nobr>"+vv[5]+"</nobr></td><td colspan=3><small>rating</small><br /><nobr>"+vv[8]+"</nobr></td></tr>";
      ss+="<tr><td colspan=11><small>black</small><br /><nobr>"+vv[6]+"</nobr></td><td colspan=3><small>rating</small><br /><nobr>"+vv[9]+"</nobr></td></tr>";
      if (vv[10])  ss+="<tr><td colspan=14><small>fen</small><br /><nobr>"+vv[10]+"</nobr></td></tr>";
      ss+="</table>";
      return(ss);
    }
    
	//TODO: make HTML5
    ScoreSheetFooter=  function()
    { return("</td></tr></table></div>");
    }
    //TODO: notused; to review and remove completely SetDragDrop
    //      drag&drop have better HTML5 implemetations, no need for simulations anymore
    this.SetDragDrop = function(bb) 
    {
      //  document.BoardForm.DragDrop.checked=bb; //??
      //isDragDrop=bb; //TODO: no impacts anymore
    
    }
    //TODO: notused; to review and remove completely MouseDown
    //      drag&drop have better HTML5 implemetations, no need for simulations anymore
    this.MouseDown = function(e)
    { var ii="";
      if (dragObj) this.MouseUp(e);
      if (e)
      { dragObj=e.target;
        ii=dragObj.id;
        dragX=e.clientX;
        dragY=e.clientY;
      }
      else if (window.event)
      { dragObj=event.srcElement;
        ii=dragObj.id;
        dragX=event.clientX;
        dragY=event.clientY;
      }
      else return;
      if (isNaN(parseInt(ii))) { dragObj=null; return; }
      if (ii<64) BoardClick(ii,true);
      else this.SetupPieceClick(ii-64,true);
      if (!isDragDrop) return;
      if ((BoardClicked<0)||(this.isAutoPlay)) dragObj=null;
      else 
      { dragObj.style.zIndex=200;
        dragBorder=dragObj.style.borderWidth;
        if (dragBorder) dragObj.style.borderWidth="0px";
      }
      return false;
    }
    //TODO: notused; to review and remove completely MouseMove
    //      drag&drop have better HTML5 implemetations, no need for simulations anymore
    this.MouseMove = function(e)
    {
       if (!isDragDrop      ) return;
       if ( BoardClicked < 0) return; //not a drag&drop from board 
       if ( dragObj) //simulate piece drag
       {
          if (e)
          {
             dragObj.style.left = (e.clientX-dragX) + "px";
             dragObj.style.top  = (e.clientY-dragY) + "px";
          }
          else if (window.event) //probably IE
          {
             dragObj.style.left = (event.clientX-dragX) + "px";
             dragObj.style.top  = (event.clientY-dragY) + "px";
          }
       }
       return false;
    }

    //TODO: used in notused; to review and remove completely MouseUp(e)
    //      drag&drop have better HTML5 implemetations, no need for simulations anymore
    //compute coords and call BoardClick or SetupPieceClick
    //cell number: BoardClicked is not updated here
    this.MouseUp = function(e)
    {
       var ii, jj, ddx = 0, ddy = 0, ww = 32;
       if (!isDragDrop)        return;
       if (BoardClicked < 0)   return;
       if (dragObj)
       {
          ww=dragObj.width;
          if (dragBorder) ww += 2 * parseInt(dragBorder);
       }
       if ((isNaN(ww)) || (ww==0)) ww = 32;
       if (e)
       {
          ddx = e.clientX - dragX;
          ddy = e.clientY - dragY;
       }
       else if (window.event)
       {
         ddx = event.clientX - dragX;
         ddy = event.clientY - dragY;
       }  
       else return;
       if (BoardClicked < 64)
       {
          //if (isRotated)
          //{
          //   ii =     ( 63 - BoardClicked )      % 8;
          //   jj = 7 - ( 63 - BoardClicked - ii ) / 8;
          //}
          //else
          {
             ii =       BoardClicked       % 8;
             jj = 7 - ( BoardClicked - ii) / 8;
          }
       }
       else 
       {
          ii = 9 +             BoardClicked       % 2 ;
          jj = 7 - Math.floor((BoardClicked - 64) / 2);
       }
       //Target i, j squares calculating
       ii += Math.round (ddx / ww); 
       jj -= Math.round (ddy / ww);
       if       ( ( ii >= 0) && (ii < 8) && (jj >= 0) && (jj  < 8) )     BoardClick ( 8 * ( 7 - jj ) + ii, true);
       else if  ( (isSetupBoard) && (ii == 9) && (jj == 0)    )     this.SetupPieceClick(12, true);
       else                                                              BoardClick(BoardClicked, true);
    
       // drag icon simulator
       if (dragObj)
       {
          dragObj.style.left = "0px";
          dragObj.style.top  = "0px";
          dragObj.style.zIndex = 1;
          if (dragBorder) dragObj.style.borderWidth = dragBorder;
          dragObj = null;
       } 
    }

    //TODO: what is this for?
    this.AnimateBoard = function (nn)
    { var pp=0, mm=parseInt(this.Delay)/100;
      isAnimating=true;
      if (dragPiece[4]>=0) mm*=0.75;
      mm=Math.floor(mm);
      if (mm>10) mm=10;
      if (nn>mm) pp=4;
      if (nn%mm==1)
      { /*if (isRotated) dragImg[pp%3]=xdocument.images[63-dragPiece[pp+2]-(7-dragPiece[pp+3])*8+ImageOffset];
        else*/ dragImg[pp%3]=xdocument.images[dragPiece[pp+2]+(7-dragPiece[pp+3])*8+ImageOffset];
        dragPiece[pp+2]=dragImg[pp%3].offsetLeft;
        dragPiece[pp+3]=dragImg[pp%3].offsetTop;
        /*if (isRotated) dragImg[pp%3]=xdocument.images[63-dragPiece[pp+0]-(7-dragPiece[pp+1])*8+ImageOffset];
        else*/ dragImg[pp%3]=xdocument.images[dragPiece[pp+0]+(7-dragPiece[pp+1])*8+ImageOffset];
        dragPiece[pp+0]=dragImg[pp%3].offsetLeft;
        dragPiece[pp+1]=dragImg[pp%3].offsetTop;
      }
      if (nn%mm!=0)
      { if (nn%mm==1)
        { dragImg[pp%3].style.zIndex=200+pp;
          dragImgBorder=parseInt(dragImg[pp%3].style.borderWidth);
          if (dragImgBorder) dragImg[pp%3].style.borderWidth="0px";
          else dragImgBorder=0;
        }
        dragImg[pp%3].style.left=(Math.round((nn%mm)*(dragPiece[pp+2]-dragPiece[pp+0])/(mm-1))+dragImgBorder)+"px";
        dragImg[pp%3].style.top=(Math.round((nn%mm)*(dragPiece[pp+3]-dragPiece[pp+1])/(mm-1))+dragImgBorder)+"px";
        if ((dragPiece[4]>=0)&&(mm-1==nn)) setTimeoutStub("AnimateBoard("+(mm+1)+")",50, this);
        else setTimeoutStub("AnimateBoard("+(nn+1)+")",50, this);
        return;
      }
      this.RefreshBoard();
      for (mm=0; mm<=pp; mm+=4)
      { dragImg[mm%3].style.left = 0;
        dragImg[mm%3].style.top  = 0;
        dragImg[mm%3].style.zIndex=1;
        if (dragImgBorder) dragImg[mm%3].style.borderWidth=dragImgBorder+"px";
        dragImg[mm%3]=null;
        dragPiece[mm+0]=-1;
      }
      isAnimating=false;
    }

    //TODO: it is actually static
    this.IsOnBoard = function(ii, jj)
    { if (ii<0) return(false);
      if (ii>7) return(false);
      if (jj<0) return(false);
      if (jj>7) return(false);
      return(true);
    }

	//TODO: make deep review
    this.OpenGame = function(nn)
    { if (parent.frames[1])
      { if ((parent.frames[1].OpenGame)&&
            (parent.frames[1].document.forms[0])&&
            (parent.frames[1].document.forms[0].GameList))
        { parent.frames[1].OpenGame(nn);
          return;
        }
      }
      setTimeoutStub('OpenGame('+nn+')', 400, this);
    }
	
	//TODO: make it regexp
    this.IsInComment = function(ss, nn)
    { var ii=-1, bb=0;
      do { ii=ss.indexOf("{",ii+1); bb++; }  
      while ((ii>=0)&&(ii<nn));
      ii=-1;
      do { ii=ss.indexOf("}",ii+1); bb--; }  
      while ((ii>=0)&&(ii<nn));  
      return(bb);
    }


    //TODO: what is this for?
    var IsComplete = function(){return(isInit);}
    //TODO: unused
    //var SetCandidateStyle = function (ss){this.CandidateStyle=ss;}
	//TODO: what is it for?
	this.SetAnnotation = function(ff) { AnnotationFile=ff;}

    this.SetBorder      = function (nn) { Border = parseInt(nn); }
    this.SetBorderColor = function (cc) { if (cc.length == 6) BorderColor = "#" + cc; else BorderColor = cc; } //TODO: make regexp
    this.SetScoreSheet  = function (nn) { ScoreSheet = parseInt(nn); }
	this.SetBGColor     = function (cc) { if (cc.charAt(0) == "#") BGColor = cc; else BGColor = "#" + cc; } //TODO: make regexp
    this.ShowLabels     = function (bb) { IsLabelVisible = bb; this.RefreshBoard(); }
    this.SwitchLabels   = function ()   { IsLabelVisible = !IsLabelVisible; this.RefreshBoard(); }
	this.GetValue       = function (oo) { var vv = ""; if(!(oo == null)){vv = + oo;} return(vv); } //TODO: not used
	var sign            = function (nn) { if (nn > 0) return(1); if (nn < 0) return(-1); return(0); } //TODO: try to remove
	
    //TODO: to find out more suitable DOM solution
    //this.SetTitle = function (tt) {}  //top.document.title=tt; //TODO: to review this code
    this.AddText  = function (tt) {}  //document.writeln(tt);  //TODO: to review this code





} //EDN class
