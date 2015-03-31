// LT-PGN-VIEWER 3.48 (c) Lutz Tautenhahn (2001-2008)

//var xdocument;

//TODO: correct document.BoardForm.FEN to xdocument.BoardForm.FEN
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

function IVFChessGame()
{
    this.errordiv = null;
    this.xdocument = null;//document stub/simulator

    this.inverse = 0;
    this.ScriptPath       = "http://www.lutanho.net/pgn/";
    this.MaxMove          = 500;
    this.isInit           = false;
    this.isCalculating    = false;
    //this.i                = null;
    //this.j                = null;
    //this.s                = null;
    this.StartMove        = null;
    this.g_MoveCount      = null;
    this.MoveType         = null;
    this.CanPass          = null;
    this.EnPass           = null;
    this.CurVar           = 0;
    this.activeAnchor     = -1;
    this.startAnchor      = -1;
    this.activeAnchorBG   = "#CCCCCC";
    this.TargetDocument   = null;
    this.isSetupBoard     = false;
    this.BoardSetupMode   = 'copy';
    this.dragX            = null;
    this.dragY            = null;
    this.dragObj          = null;
    this.dragBorder       = null;
    this.dragImgBorder    = null;
    this.isDragDrop       = false;
    this.isAnimating      = false;
    this.isExecCommand    = true,
    this.BoardPic         = null;
    this.ParseType        = 1;
    this.AnnotationFile   = "";
    this.ImagePathOld     = "-";
    this.PGNViewImagePath = "";
    this.ImageOffset      = 0;
    this.IsLabelVisible   = true;
    this.Border           = 1;
    this.BorderColor      = "#404040";
    this.ScoreSheet       = 0;
    this.BGColor          = "";
    this.isRotated        = false;
    this.isRecording      = false;
    this.isNullMove       = true;
    this.RecordCount      = 0;
    this.RecordedMoves    = "";
    this.SkipRefresh      = 0;
    this.AutoPlayInterval = null; //TODO: to remove this
    this.isAutoPlay       = false;
    this.Delay            = 1000;
    this.BoardClicked     = -1;
    this.isCapturedPieces = false;
    this.CandidateStyle   = "";

    this.PieceName        = "KQRBNP";
    this.ShowPieceName    = "KQRBNP";
    this.StandardFen      = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.FenString        = this.StandardFen;
///////////////////////////////////////////////
    this.OldCommands = null;
    this.NewCommands = null;
    this.dragImg   = null;
    this.dragPiece = null;

    this.ShortPgnMoveText = null;

    this.Piece = null;
    //this.PieceType  = null;
    //this.PiecePosX  = null;
    //this.PiecePosY  = null;
    //this.PieceMoves = null;

    this.PieceCode  = null;

    this.ColorName = null;
    this.Castling  = null;
    this.Board     = null;

    this.HalfMove = null;
    this.HistMove = null;
    this.HistCommand = null;

    this.HistPiece = null;
    this.HistType  = null;
    this.HistPosX  = null;
    this.HistPosY  = null;
    this.MoveArray = null;

    this.PiecePic   = null;
    this.LabelPic   = null;
    this.Annotation = null;
    this.DocImg     = null;
    this.board = 
	   {
	      gameTBodyElement:null,
	      IMGNumersElement:null,
	      IMGLettersElement:null,
          IMGFlipElement:null
	   };

    IVFChessGame.ChessPiece =
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
    this.timeProcessor = new timerWrapper();
    this.chessdiv = null;
    this.chess_board = null;
///////////////////////////////////////////////
    this.variable_reset = function()
    {
       this.errordiv = null;
       this.ScriptPath = "http://www.lutanho.net/pgn/";
       this.xdocument = new xdocument_gen();

       this.errordiv    = document.getElementById("error_div");      //from static HTML content
       this.chess_board = document.getElementById('chess_board');    //from static HTML content
       this.chessdiv    = document.getElementById("chess_div");      //from static HTML content

       //i, j, s, this.StartMove, this.g_MoveCount, this.MoveType, this.CanPass, this.EnPass, this.TargetDocument, this.BoardPic
       //this.dragX, this.dragY, this.dragObj, this.dragBorder, this.dragImgBorder, 
       //this.AutoPlayInterval, 
       this.MaxMove = 500;      this.isInit = false;        this.isCalculating = false;
       this.CurVar = 0;         this.activeAnchor = -1;     this.startAnchor = -1;     this.activeAnchorBG = "#CCCCCC"; this.isSetupBoard = false; this.BoardSetupMode = 'copy';
       this.isDragDrop = false; this.isAnimating = false;   this.isExecCommand = true; this.ParseType = 1; this.AnnotationFile = "";
       this.ImagePathOld = "-"; this.PGNViewImagePath = ""; this.ImageOffset=0; this.IsLabelVisible=true; this.Border=1; this.BorderColor="#404040"; this.ScoreSheet=0; this.BGColor="";
       this.isRotated=false; this.isRecording=false; this.isNullMove=true; this.RecordCount=0; this.RecordedMoves=""; this.SkipRefresh=0;
       this.isAutoPlay=false; this.Delay=1000; this.BoardClicked=-1; this.isCapturedPieces=false; this.CandidateStyle = "";
       this.PieceName = "KQRBNP"; this.ShowPieceName = "KQRBNP";
       this.StandardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
       this.FenString = this.StandardFen;

       ////////////////////////////////////
       this.OldCommands = new Array();
       this.NewCommands = new Array();
       this.dragImg   = new Array(2);
       this.dragPiece = new Array(8);
       this.dragPiece[0] = -1;
       this.dragPiece[4] = -1;

       this.ShortPgnMoveText = [new Array(), new Array(), new Array()];
       var i = 0;
       var j = 0;

       this.ShortPgnMoveText[0][this.CurVar] = "";

       this.Piece   = [new Array(16), new Array(16)];
       for ( i = 0; i < 2; i++)
          for ( j = 0; j < 16; j++)
             this.Piece[i][j] = {Type:null,Pos:{X:null,Y:null},Moves:null};

       this.ColorName   = ["w", "b", "t"];
       this.Castling    = [new Array(2), new Array(2)];

       this.Board       = [new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8)];

       this.HalfMove    = new Array(this.MaxMove + 1);
       this.HistMove    = new Array(this.MaxMove);
       this.HistCommand = new Array(this.MaxMove+1);

       this.HistPiece = [new Array(this.MaxMove), new Array(this.MaxMove)];
       this.HistType  = [new Array(this.MaxMove), new Array(this.MaxMove)];
       this.HistPosX  = [new Array(this.MaxMove), new Array(this.MaxMove)];
       this.HistPosY  = [new Array(this.MaxMove), new Array(this.MaxMove)];

       this.MoveArray = new Array();

       this.PieceCode  = [this.PieceName.charCodeAt(0), this.PieceName.charCodeAt(1), this.PieceName.charCodeAt(2),
                          this.PieceName.charCodeAt(3), this.PieceName.charCodeAt(4), this.PieceName.charCodeAt(5)];//new Array(6); for (i=0; i<6; i++) this.PieceCode[i] = this.PieceName.charCodeAt(i);
       this.PiecePic   = [new Array(6), new Array(6)];
       this.LabelPic   = new Array(5);
       this.Annotation = new Array();
       this.DocImg     = new Array();
    }
    //this.timer = null;

    //TODO: log probably better to separate
    this.appendLog = function (logStr)
    {
       try
       {
          if(logStr)
          {
             this.errordiv.appendChild(document.createElement("br"));
             this.errordiv.appendChild(document.createTextNode(logStr));
          }
       }
       catch(err)
       {
          alert("error on this.appendLog(" + logStr + ")" + err); //report but don't rethrow
       }
    }
    this.insertLog = function (logStr)
    {
       try
       {
          this.errordiv.innerText += "";
          this.errordiv.insertBefore(document.createElement("br"),    this.errordiv.firstChild);
          this.errordiv.insertBefore(document.createTextNode(logStr), this.errordiv.firstChild);
       }catch(err)
       {
          alert("error on this.insertLog(" + logStr + ")" + err); //report but don't rethrow
       }
    }
    this.clearLog = function (logStr)
    {
       try
       {
          this.errordiv.innerHTML = ""; //clear here
          if (logStr)
          {
             this.appendLog (logStr); //log replacement if any
          }
       }
       catch (err)
       {
          alert("error on this.insertLog(" + logStr + ")" + err); //report but don't rethrow
       }
    }

    this.SetImagePath  = function (imgPath) 
    {
       try
       {
          this.PGNViewImagePath = imgPath;
          this.insertLog("SetImagePath(imgPath = " + imgPath + ")() this.PGNViewImagePath{" + this.PGNViewImagePath + "}*****************");
       }catch(err)
       {}
    }

    this.InitImages = function()
    {
       try
       {
          if (this.ImagePathOld == this.PGNViewImagePath) return;
          var ii, jj;

          this.BoardPic = {src : this.PGNViewImagePath + "t.gif"};
          for (ii = 0; ii < 2; ii++)
          {
             this.PiecePic[ii]  =  [{ src : this.PGNViewImagePath + this.ColorName[ii] + "k.gif"},
                                    { src : this.PGNViewImagePath + this.ColorName[ii] + "q.gif"},
                                    { src : this.PGNViewImagePath + this.ColorName[ii] + "r.gif"},
                                    { src : this.PGNViewImagePath + this.ColorName[ii] + "b.gif"},
                                    { src : this.PGNViewImagePath + this.ColorName[ii] + "n.gif"},
                                    { src : this.PGNViewImagePath + this.ColorName[ii] + "p.gif"}];
          }                                                                                      

          //TODO: is this used?
          this.LabelPic = [{src : this.PGNViewImagePath + "8_1.gif"},
                           {src : this.PGNViewImagePath + "a_h.gif"},
                           {src : this.PGNViewImagePath + "1_8.gif"},
                           {src : this.PGNViewImagePath + "h_a.gif"},
                           {src : this.PGNViewImagePath + "1x1.gif"}];

          this.ImagePathOld = this.PGNViewImagePath;                                 
    
          for (ii = 0; ii < this.xdocument.images.length; ii++)
          {
             if (this.xdocument.images[ii] == this.xdocument.images["RightLabels"])
             {
                if (ii > 64) this.ImageOffset = ii - 64;
             }
          }
          this.DocImg.length = 0;
       }catch(e)
       {
         throw 'this.InitImages()>> rethrow error: ' +  e + "\n";
       }
    }

    //TODO: this function is never used in current version
    this.SkipRefreshBoard = function (skipRefresh){ this.SkipRefresh = skipRefresh; }

    //value="Apply" onClick="javascript:ApplyFEN(document.BoardForm.FEN.value); Init('');
    this.ApplyFEN = function (ss)
    {
       try
       {
          if (ss.length == 0)
          {
             this.FenString = this.StandardFen;
          }
          else
          {
             this.FenString = ss;
          }
          
          if ((this.xdocument.BoardForm) && (this.xdocument.BoardForm.FEN))
                this.xdocument.BoardForm.FEN.value = this.FenString;
       }catch(err)
       {
          throw 'ApplyFEN(\'' + ss + '\') error' + '\n' + err;
       }
    }


    //current_IVFChessGame.PieceName standard "KQRBNP"
    //current_IVFChessGame.PieceName standard "012345"
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
          this.isInit = true;
          if (this.isAutoPlay) this.SetAutoPlay(false);
          if (rr != '')
          {
             this.FenString = rr;
             //TODO:
             //this.FenString = this.FenString.replace(/\|/gm, "/");
             while (this.FenString.indexOf("|") > 0) this.FenString = this.FenString.replace("|","/");
             //this.FenString = this.FenString(/\|/, "/");
          }
          if (this.FenString == 'standard') this.FenString = this.StandardFen;
          if (   (this.xdocument.BoardForm) && (this.xdocument.BoardForm.FEN)   ) this.xdocument.BoardForm.FEN.value = this.FenString;
          
          //TODO: to get rid of StandardFen case
    //      if (0 && (this.FenString == this.StandardFen))
    //      {
    //         //Init for standard initial position
    //         for (pieceColor = IVFChessGame.ChessPiece.Color.White; pieceColor <= IVFChessGame.ChessPiece.Color.Black; pieceColor++)
    //         {
    //            this.Piece[pieceColor][0].Type = IVFChessGame.ChessPiece.Type.King;   this.Piece[pieceColor][0].Pos.X = IVFChessGame.ChessPiece.Pos.X._E; //4; //0: King   E
    //            this.Piece[pieceColor][1].Type = IVFChessGame.ChessPiece.Type.Queen;  this.Piece[pieceColor][1].Pos.X = IVFChessGame.ChessPiece.Pos.X._D; //3; //1: Queen  D
    //            this.Piece[pieceColor][2].Type = IVFChessGame.ChessPiece.Type.Rock;   this.Piece[pieceColor][2].Pos.X = IVFChessGame.ChessPiece.Pos.X._A; //0; //2: Rock   A
    //            this.Piece[pieceColor][3].Type = IVFChessGame.ChessPiece.Type.Rock;   this.Piece[pieceColor][3].Pos.X = IVFChessGame.ChessPiece.Pos.X._H; //7; //2: Rock   H
    //            this.Piece[pieceColor][4].Type = IVFChessGame.ChessPiece.Type.Bishop; this.Piece[pieceColor][4].Pos.X = IVFChessGame.ChessPiece.Pos.X._C; //2; //3: Bishop C
    //            this.Piece[pieceColor][5].Type = IVFChessGame.ChessPiece.Type.Bishop; this.Piece[pieceColor][5].Pos.X = IVFChessGame.ChessPiece.Pos.X._F; //5; //3: Bishop F
    //            this.Piece[pieceColor][6].Type = IVFChessGame.ChessPiece.Type.Knight; this.Piece[pieceColor][6].Pos.X = IVFChessGame.ChessPiece.Pos.X._B; //1; //7: Knight B
    //            this.Piece[pieceColor][7].Type = IVFChessGame.ChessPiece.Type.Knight; this.Piece[pieceColor][7].Pos.X = IVFChessGame.ChessPiece.Pos.X._G; //6; //8: Knight G
    //            for (jj = 8; jj < 16; jj++)
    //            {
    //               this.Piece[pieceColor][jj].Type = IVFChessGame.ChessPiece.Type.Pawn;
    //               this.Piece[pieceColor][jj].Pos.X = jj - 8;
    //            }
    //            var piecePosY =  pieceColor ==  IVFChessGame.ChessPiece.Color.Black ? IVFChessGame.ChessPiece.Pos.Y._8 : IVFChessGame.ChessPiece.Pos.Y._1; //For  Figures
    //            for (jj = 0; jj < 8; jj++)
    //            {
    //               this.Piece[pieceColor][jj].Moves = 0;
    //               this.Piece[pieceColor][jj].Pos.Y = piecePosY;
    //            }
    //            piecePosY =  pieceColor == IVFChessGame.ChessPiece.Color.Black ? IVFChessGame.ChessPiece.Pos.Y._7 : IVFChessGame.ChessPiece.Pos.Y._2; //For Pawns
    //            for (jj = 8; jj < 16; jj++)
    //            {
    //               this.Piece[pieceColor][jj].Moves = 0;
    //               this.Piece[pieceColor][jj].Pos.Y = piecePosY;
    //            }
    //         }
    //         //resed board
    //         for (ii = 0; ii < 8; ii++)
    //         {
    //            for (jj = 0; jj < 8; jj++) this.Board[ii][jj] = 0;
    //         }
    //         //for (ii = 0; ii < 2; ii++)
    //         for (pieceColor = IVFChessGame.ChessPiece.Color.White; pieceColor <= IVFChessGame.ChessPiece.Color.Black; pieceColor++)
    //         {
    //            for (jj = 0; jj < 16; jj++)
    //               this.Board[this.Piece[pieceColor][jj].Pos.X][this.Piece[pieceColor][jj].Pos.Y] = (this.Piece[pieceColor][jj].Type + 1) * (1 - 2 * pieceColor);
    //         }
    //         for (ii = 0; ii < 2; ii++)
    //         {
    //            for (jj = 0; jj < 2; jj++)
    //               this.Castling[ii][jj] = 1;
    //         }
    //         this.EnPass = -1;
    //         this.HalfMove[0] = 0;
    //         if (this.xdocument.BoardForm)
    //         {
    //            RefreshBoard();
    //            if (this.xdocument.BoardForm.Position)
    //               this.xdocument.BoardForm.Position.value = "";
    //            this.NewCommands.length = 0;
    //            ExecCommands();
    //         }
    //         this.StartMove = 0;
    //         this.g_MoveCount = this.StartMove;
    //         this.MoveType  = this.StartMove % 2;
    //         SetBoardClicked(-1);
    //         this.RecordCount      = 0;
    //         this.CurVar           = 0;
    //         this.MoveArray.length = 0;
    //         if (this.TargetDocument) HighlightMove("m" + this.g_MoveCount + "v" + this.CurVar);
    //         UpdateAnnotation(true);
    //         //end
    //      }
    //      else
          {
             // init for non standard FEN (ie initial position different from the standard startup one)
             var fullProgressDone = 0;
             var HALF_MOVE_PARSED = 1;
             var FULL_MOVE_PARSED = 2;
			 //all the pieces on A1?
             for (pieceColor = IVFChessGame.ChessPiece.Color.White; pieceColor <= IVFChessGame.ChessPiece.Color.Black; pieceColor++)
             {
                for (jj = 0; jj < 16; jj++)
                {
                   this.Piece[pieceColor][jj].Type =  IVFChessGame.ChessPiece.Type.None;
                   this.Piece[pieceColor][jj].Pos.X =  IVFChessGame.ChessPiece.Pos.X.A;
                   this.Piece[pieceColor][jj].Pos.Y =  IVFChessGame.ChessPiece.Pos.X._1;
                   this.Piece[pieceColor][jj].Moves =  0;
                }
             }
             ii = 0; jj = 7; ll = 0; nn = 1; mm = 1; cc = this.FenString.charAt(ll++);
             //var fenString = this.FenString;
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
                      throw "Invalid FEN [1]: char " + ll + " in " + this.FenString;
                   ii = 0;
                   jj--;
                }
                if (ii == 8)
                   throw "Invalid FEN [2]: char " + ll + " in " + this.FenString;

                if (! isNaN(cc)) //is number of empty squares
                {
                   ii += parseInt(cc);
                   if (  (ii < 0) || (ii > 8)  )
                      throw "Invalid FEN [3]: char " + ll + " in " + this.FenString;
                }

                //is white piece?
                //this.PieceName standard "KQRBNP"
                if (cc.charCodeAt(0) == "KQRBNP".charCodeAt(0))//this.PieceName.toUpperCase().charCodeAt(0))
                {
                   if (this.Piece[0][0].Type != -1)
                      throw "Invalid FEN [4]: char " + ll + " in " + this.FenString;
                   this.Piece[0][0].Type = 0;
                   this.Piece[0][0].Pos.X = ii;
                   this.Piece[0][0].Pos.Y = jj;
                   ii++;
                }
                //is black piece?
                if (cc.charCodeAt(0) == "kqrbnp".charCodeAt(0)) //this.PieceName.toLowerCase().charCodeAt(0))
                {
                   if (this.Piece[1][0].Type != -1)
                      throw "Invalid FEN [5]: char " + ll + " in " + this.FenString;
                   this.Piece[1][0].Type = 0;
                   this.Piece[1][0].Pos.X = ii;
                   this.Piece[1][0].Pos.Y = jj;
                   ii++;
                }
                for (kk = 1; kk < 6; kk++)
                {
                   //white piece?
                   if (cc.charCodeAt(0) == "KQRBNP".charCodeAt(kk))//this.PieceName.toUpperCase().charCodeAt(kk))
                   {
                      if (nn == 16)
                         throw "Invalid FEN [6]: char " + ll + " in " + this.FenString;
                      this.Piece[0][nn].Type = kk;
                      this.Piece[0][nn].Pos.X = ii;
                      this.Piece[0][nn].Pos.Y = jj;
                      nn++;
                      ii++;
                   }
                   //white piece?
                   if (cc.charCodeAt(0) == this.PieceName.toLowerCase().charCodeAt(kk))
                   {
                      if (mm == 16)
                         throw "Invalid FEN [7]: char " + ll + " in " + this.FenString;
                      this.Piece[1][mm].Type = kk;
                      this.Piece[1][mm].Pos.X = ii;
                      this.Piece[1][mm].Pos.Y = jj;
                      mm++;
                      ii++;
                   }
                }
                if (ll < this.FenString.length)
                   cc = this.FenString.charAt(ll++);
                else cc = " ";
             }
             if ((ii != 8) || (jj != 0))
                throw "Invalid FEN [8]: char " + ll + " in " + this.FenString;
             if ((this.Piece[0][0].Type == -1) || (this.Piece[1][0].Type == -1))
                throw "Invalid FEN [9]: char " + ll + " missing king";
             if (ll == this.FenString.length)
             {
                this.FenString += " w ";
                this.FenString += this.PieceName.toUpperCase().charAt(0);
                this.FenString += this.PieceName.toUpperCase().charAt(1);
                this.FenString += this.PieceName.toLowerCase().charAt(0);
                this.FenString += this.PieceName.toLowerCase().charAt(1);      
                this.FenString += " - 0 1";
                ll++;
             }
             cc = this.FenString.charAt(ll++);
             if ((cc == "w") || (cc == "b"))
             {
                if (cc == "w") this.StartMove = 0;
                else this.StartMove = 1;
             }
             else
             {
                throw "Invalid FEN [11]: char " + ll + " invalid active color";
                //Init('standard');
                //return;
             }
             ll++;
             if (ll >= this.FenString.length)
             {
                throw "Invalid FEN [12]: char " + ll + " missing castling availability";
                //Init('standard');
                //return;
             }
             this.Castling[0][0] = 0; this.Castling[0][1] = 0; this.Castling[1][0] = 0; this.Castling[1][1] = 0;
             cc = this.FenString.charAt(ll++);
             while (cc != " ")
             {
                if (cc.charCodeAt(0) == this.PieceName.toUpperCase().charCodeAt(0)) this.Castling[0][0] = 1;
                if (cc.charCodeAt(0) == this.PieceName.toUpperCase().charCodeAt(1)) this.Castling[0][1] = 1;
                if (cc.charCodeAt(0) == this.PieceName.toLowerCase().charCodeAt(0)) this.Castling[1][0] = 1;
                if (cc.charCodeAt(0) == this.PieceName.toLowerCase().charCodeAt(1)) this.Castling[1][1] = 1;

                if (ll < this.FenString.length) cc = this.FenString.charAt(ll++);
                else cc = " ";
             }
             if (ll == this.FenString.length)
             {
                throw "Invalid FEN [13]: char " + ll + " missing en passant target square";
                //Init('standard');
                //return;
             }
             this.EnPass = -1;
             cc = this.FenString.charAt(ll++);
             while (cc != " ")
             {
                if ((cc.charCodeAt(0) - 97 >= 0) && (cc.charCodeAt(0) - 97 <= 7)) this.EnPass = cc.charCodeAt(0) - 97; 

                if (ll < this.FenString.length) cc = this.FenString.charAt(ll++);
                else cc = " ";
             }
             this.insertLog("FEN EnPass: " + this.EnPass);
    
             if (ll == this.FenString.length)
             {
                throw "Invalid FEN [14]: char " + ll + " missing this.HalfMove clock";
                //Init('standard');
                //return;
             }
             this.HalfMove[0] = 0;
             cc = this.FenString.charAt(ll++);
             while (cc != " ")
             {
                if (isNaN(cc))
                {
                   throw "Invalid FEN [15]: char " + ll + " invalid this.HalfMove clock";
                   //Init('standard');
                   //return;
                }
                this.HalfMove[0] = this.HalfMove[0] * 10 + parseInt(cc);
                if (ll < this.FenString.length)
                    cc = this.FenString.charAt(ll++);
                else cc = " ";
                fullProgressDone |= HALF_MOVE_PARSED;
             }
             this.insertLog("FEN half move No: " + this.HalfMove[0]);
             if (ll == this.FenString.length)
             {
                throw "Invalid FEN [16]: char " + ll + " missing fullmove number";
                //Init('standard');
                //return;
             }
             cc = this.FenString.substring(ll++);
             //cc = cc.replace(/^\s*|\s*$)/gi, "");
             cc = cc.match(/^\s*(\d+)[^\d]*/)[1];
             this.insertLog ("FEN cc is: {" + cc + "}");
             if (isNaN(cc))
             {
                throw "Invalid FEN [17]: char " + ll + " invalid fullmove number;" + this.FenString.substring(0, ll);
                //Init('standard');
                //return;
             }
             if (cc <= 0)
             {
                throw "Invalid FEN [18]: char " + ll + " invalid fullmove number";
                //Init('standard');
                //return;
             }
             this.StartMove += 2 * (parseInt(cc) - 1); //TODO: check halfmoves
             this.insertLog("FEN start move No: " + this.StartMove);
             for (ii = 0; ii < 8; ii++)
             {
                for (jj = 0; jj < 8; jj++) this.Board[ii][jj] = 0;
             }
             for (ii = 0; ii < 2; ii++)
             {
                for (jj = 0; jj < 16; jj++)
                {
                   if (this.Piece[ii][jj].Type != -1) 
                      this.Board[this.Piece[ii][jj].Pos.X][this.Piece[ii][jj].Pos.Y] = (this.Piece[ii][jj].Type + 1) * (1 - 2 * ii);
                }
             }
             if (this.xdocument.BoardForm)
             {
                RefreshBoard(); //TODO: what is this for?
                if (this.xdocument.BoardForm.Position)
                {
                   if (this.StartMove % 2 == 0) this.xdocument.BoardForm.Position.value = "white to move";
                   else this.xdocument.BoardForm.Position.value = "black to move";
                }
                this.NewCommands.length = 0;
                ExecCommands();
             }
             this.g_MoveCount = this.StartMove;
             this.MoveType  = this.StartMove % 2;
             SetBoardClicked(-1);
             this.RecordCount = 0;
             this.CurVar = 0;
             this.MoveArray.length = 0;
             if (this.TargetDocument) HighlightMove("m" + this.g_MoveCount + "v" + this.CurVar);
             UpdateAnnotation(true);
             //if(this.MoveType == 1)
             //{
             //   this.xdocument.game.move[0].black_move = this.xdocument.game.move[0].white_move;
            //    this.xdocument.game.move[0].white_move = 0;
                //this.insertLog("this.StartMove black");
             //}
             //end
          }
          this.insertLog("this.StartMove=" + this.StartMove + ";this.MoveType=" + this.MoveType);
          this.UpdateBoardAndPieceImages();
       }
       catch (err)
       {
          //this.insertLog ('init>>error: ' + err);
          throw 'rethrow init() >>error: ' + err;
       }
    }

    this.ParseAllPgn = function(pgn)
    {
       try
       {
          var i;
          i = 0;
          i++;
          var pgnText;
          if(pgn) pgnText = pgn;
    
          var  prop, mov;
          pgnText = this.xdocument.BoardForm.PgnMoveText.value;//"[salut la toti] \r\n[norok la toti] salutari\r\n\r\n   ";

          this.appendLog("ParseAllPgn: before Clean");
          pgnText = pgnText.replace(/[\n\t\r]/gm,     " ");  //replace tabs, newlines and carriage returns
          pgnText = pgnText.replace(/(\{[^\}]*\})/gm, " ");  //remove comments
          pgnText = pgnText.replace(/(^\s*|\s*$)/gm,  "");    //trim
          pgnText = pgnText.replace(/(^[,\.\"\'\s]*|[,\.\"\'\s]*$)/gm,  "");    //trim
          //this.FenString = this.StandardFen
          var xfen;
          var i;
          this.appendLog("ParseAllPgn: after Clean");
          for(i = 0; i < 2000 && pgnText.match(/.*\[.*/gm);  i++)
          {
             this.appendLog("ParseAllPgn: parsing tags");
             prop = pgnText.match(/^[^\[]*\[[^\]]*?\]/gm)[0];
             this.insertLog("prop: {" + prop + "}");
             prop = prop.replace(/(^\s*|\s*$)/gm, "")
             this.xdocument.game.prop[i] = prop;
             var reFEN = new RegExp("[^\\[]*" + "\\[FEN\\s+[\"']*\\s*" + "([^\"']*)" + "\\s*[\"']*\\s*]\\s*", "ig");
             var arr = reFEN.exec(prop);
             if(arr != null && arr.length == 2)
             {
                this.FenString = arr[1];
             }
             reFEN = null;
    
             pgnText = pgnText.replace(/^[^\[]*\[[^\]]*?\]/gm, "");//"$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm,        "");
          }
          this.appendLog("ParseAllPgn: before Init");
          try
          {
             this.Init('');
          }catch(err)
          {
             //this.appendLog("err: ParseAllPgn() on Init(''):" + err);
             throw "rethrow: ParseAllPgn() from Init(''):" + "\n" + err;
          }
          
          //this.appendLog("ParseAllPgn: before loop");
          for (i = 0; i < 6000 && pgnText.match(/^\d+\s*\./gm);  i++)
          {
             //this.appendLog("ParseAllPgn: inside loop");
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
             this.xdocument.game.move[i] = new String();
             this.xdocument.game.move[i].moveNumber = movNoCurrent;
             mov = mov.replace(/(^\s*|\s*$)/gm, "");
             this.xdocument.game.move[i].fullText = mov;
    
             if (i > 0)
             {
                this.xdocument.game.move[i].white_move = GetMove(mov, 0);
                this.xdocument.game.move[i].black_move = GetMove(mov, 1);
             }else
             {
                if(this.MoveType == 1)
                {
                   this.xdocument.game.move[i].white_move = "";
                   this.xdocument.game.move[i].black_move = GetMove(mov, 0);
                }else
                {
                   this.xdocument.game.move[i].white_move = GetMove(mov, 0);
                   this.xdocument.game.move[i].black_move = GetMove(mov, 1);
                }
             }
    
             //pgnText = pgnText.replace(/^\d+\s*\.[^\d]*/gm, "$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm, "");
             this.appendLog("mov: " + mov + "; white: " + this.xdocument.game.move[i].white_move + "; black: " + this.xdocument.game.move[i].black_move);
          }
          //for(i = 0; i < this.xdocument.game.prop.length; i++)
          //{
          //   this.appendLog("comment N" + i + ": " + this.xdocument.game.prop[i]);
          //}
          //this.appendLog("moves: " + this.xdocument.game.move.length);
          //for(i = 0; i < this.xdocument.game.move.length; i++)
          //{
          //   this.insertLog("move N" + i + ": " + this.xdocument.game.move[i].fullText);
          //}
          
    
          
       }
       catch (err)
       {
          //alert("ParseAllPgn>>error: " + err);
          throw "rethrow ParseAllPgn() >> error: \n" + err;
       }
       return;
    }

    this.AllowRecording = function(bb)
    {
       if ((document.BoardForm) && (document.BoardForm.Recording))
          document.BoardForm.Recording.checked = bb;
       this.isRecording = bb;
       SetBoardClicked (-1);
    }

    this.startParsingDetect_FEN_PGN = function(contentSelectedText)
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
              this.xdocument.BoardForm.PgnMoveText.value = contentSelectedText;
              this.insertLog("startParsingDetect_FEN_PGN() start ParseAllPgn('" + contentSelectedText + "')");
              this.ParseAllPgn(contentSelectedText);
           }
           this.insertLog("after init image path{" + this.PGNViewImagePath + "}");
        }
        catch (err)
        {
           //alert("doStartGameGoogleChrome(" + contentSelectedText+ ")\n" + err);
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
             img.style.bordercolor = this.xdocument.images[i].style.borderColor;
             img.src = this.xdocument.images[i].src;
          }
          document.getElementById("Position").value = this.xdocument.BoardForm.Position.value;//TODO: by ID?
		  
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
       if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval);
       if (this.isAutoPlay)
       {
          if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
             document.BoardForm.AutoPlay.value="stop";
          MoveForward(1);
       }
       else
       {
          if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
             document.BoardForm.AutoPlay.value="play";
       }
    }
}

//TODO: to move this into the constructor, avoid redundancy
function parser_reset_main(imgPath)
{
   try
   {
      current_IVFChessGame = null;
      current_IVFChessGame = new IVFChessGame();
      current_IVFChessGame.variable_reset(); //TODO: should pe part of ctor
      //since here
      current_IVFChessGame.SetImagePath (imgPath); //TODO: move to ctor
   }
   catch(e)
   {
      throw 'parser_reset_main()>> error: ' + e + "\n";
   }

}


function SetBorder     (nn) { current_IVFChessGame.Border = parseInt(nn); }
function SetBorderColor(cc) { if (cc.length == 6) current_IVFChessGame.BorderColor = "#" + cc; else current_IVFChessGame.BorderColor = cc; }
function SetScoreSheet (nn) { current_IVFChessGame.ScoreSheet = parseInt(nn); }
function SetBGColor    (cc) { if (cc.charAt(0) == "#") current_IVFChessGame.BGColor = cc; else current_IVFChessGame.BGColor = "#" + cc; }
function ShowLabels    (bb) { current_IVFChessGame.IsLabelVisible = bb; RefreshBoard(); }
function SwitchLabels  ()   { current_IVFChessGame.IsLabelVisible = !current_IVFChessGame.IsLabelVisible; RefreshBoard(); }
function GetValue      (oo) { var vv = ""; if(!(oo == null)){vv = + oo;} return(vv); }
function sign          (nn) { if (nn > 0) return(1); if (nn < 0) return(-1); return(0); }

function SetImg(ii, oo)
{
   if (current_IVFChessGame.DocImg[ii] == oo.src) return;
   current_IVFChessGame.DocImg[ii] = oo.src;
   //if (ii<64)
   if (isNaN(ii)) current_IVFChessGame.xdocument.images[ii].src = oo.src;
   else current_IVFChessGame.xdocument.images[ii + current_IVFChessGame.ImageOffset].src = oo.src;
}




function OpenUrl(ss)
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
            if (nn) setTimeoutStub("ParsePgn(" + nn + ")", 400);
         }
         else parent.frames[1].location.href = "pgnframe.html?" + document.BoardForm.Url.value;
      }
      else parent.frames[1].location.href = "pgnframe.html";
   }
}


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

    //while(tmp.match(/^(\w+)/g))
    //{
      //idx = (/^(\w+)\.?/g.exec(tmp))[0];
    //  idx = tmp.match(/^(\w+)\.?/)[0];
function GetMove(strMoveText, isBlackMove)
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
      ll = 0; current_IVFChessGame.NewCommands.length = 0;
      while ((ii >= 0) && (jj >= 0) && (ii < jj))
      {
         current_IVFChessGame.NewCommands[ll++] = retMove.substr(ii + 1, jj - ii - 1);
         retMove = retMove.substr(0, ii) + retMove.substr(jj + 1);
         ii = retMove.indexOf("<");
         jj = retMove.indexOf(">");
      }
   } //*/
   return(retMove);
}    

function MoveBack (nn)
{
   //alert("MoveBack");
   var ii, jj, cc;
   if (current_IVFChessGame.BoardClicked >= 0) SetBoardClicked(-1);
   for (jj = 0; (jj < nn) && (current_IVFChessGame.g_MoveCount > current_IVFChessGame.StartMove); jj++)
   {
      if (current_IVFChessGame.RecordCount > 0) current_IVFChessGame.RecordCount--;
      current_IVFChessGame.g_MoveCount--;
      current_IVFChessGame.MoveType = 1 - current_IVFChessGame.MoveType;
      cc = current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove;
      ii = current_IVFChessGame.HistPiece[1][cc];
      if ((0 <= ii) && (ii < 16)) //we must do this here because of Chess960 castling
      {
         current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y] = 0; 
         current_IVFChessGame.Board[current_IVFChessGame.HistPosX[1][cc]][current_IVFChessGame.HistPosY[1][cc]] = (current_IVFChessGame.HistType[1][cc]+1)*(1-2*current_IVFChessGame.MoveType);
      }
      ii = current_IVFChessGame.HistPiece[0][cc];
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y] = 0;
      current_IVFChessGame.Board[current_IVFChessGame.HistPosX[0][cc]][current_IVFChessGame.HistPosY[0][cc]] = (current_IVFChessGame.HistType[0][cc] + 1) * (1 - 2 * current_IVFChessGame.MoveType);
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type = current_IVFChessGame.HistType[0][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X = current_IVFChessGame.HistPosX[0][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y = current_IVFChessGame.HistPosY[0][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Moves--;
      ii=current_IVFChessGame.HistPiece[1][cc];
      if ((0<=ii)&&(ii<16))
      {
         current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type = current_IVFChessGame.HistType[1][cc];
         current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X = current_IVFChessGame.HistPosX[1][cc];
         current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y = current_IVFChessGame.HistPosY[1][cc];
         current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Moves--;
      }
      ii -= 16;
      if (0 <= ii)
      {
         current_IVFChessGame.Board[current_IVFChessGame.HistPosX[1][cc]][current_IVFChessGame.HistPosY[1][cc]] = (current_IVFChessGame.HistType[1][cc] + 1) * (2 * current_IVFChessGame.MoveType - 1);
         current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Type = current_IVFChessGame.HistType[1][cc];
         current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.X = current_IVFChessGame.HistPosX[1][cc];
         current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.Y = current_IVFChessGame.HistPosY[1][cc];
         current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Moves--;
      }
      if (current_IVFChessGame.CurVar != 0)
      {
         if (current_IVFChessGame.g_MoveCount == current_IVFChessGame.ShortPgnMoveText[2][current_IVFChessGame.CurVar])
         {
            current_IVFChessGame.CurVar = current_IVFChessGame.ShortPgnMoveText[1][current_IVFChessGame.CurVar];
            if ((!current_IVFChessGame.isCalculating) && (current_IVFChessGame.xdocument.BoardForm) && (current_IVFChessGame.xdocument.BoardForm.PgnMoveText))
               current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value = current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar];
         }  
      }    
   }
   if (current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove]) current_IVFChessGame.NewCommands = current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove].split("|");
   if (current_IVFChessGame.isCalculating) return;
   if ((current_IVFChessGame.OldCommands.length > 0) || (current_IVFChessGame.NewCommands.length > 0)) ExecCommands();
   if (current_IVFChessGame.xdocument.BoardForm)
   {
      RefreshBoard();
      if (current_IVFChessGame.xdocument.BoardForm.Position)
      {
         if (current_IVFChessGame.g_MoveCount>current_IVFChessGame.StartMove)
            current_IVFChessGame.xdocument.BoardForm.Position.value=TransformSAN(current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]);
         else
            current_IVFChessGame.xdocument.BoardForm.Position.value="";
      }    
   }
   if (current_IVFChessGame.TargetDocument) HighlightMove("m" + current_IVFChessGame.g_MoveCount + "v" + current_IVFChessGame.CurVar);
   UpdateAnnotation(false);
   if (current_IVFChessGame.AutoPlayInterval) clearTimeoutStub(current_IVFChessGame.AutoPlayInterval);
   if (current_IVFChessGame.isAutoPlay) current_IVFChessGame.AutoPlayInterval=setTimeoutStub("MoveBack("+nn+")", current_IVFChessGame.Delay);
   current_IVFChessGame.UpdateBoardAndPieceImages();
}


function MoveForward(nMoveNumber, rr)
{
   current_IVFChessGame.insertLog("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")");
   try
   {
      var ii, llst, ssub, mmove0 = "", mmove1 = "";//,ssearch,ffst=0,ffull;
      if (rr);
      else
      {
         if ((current_IVFChessGame.xdocument.BoardForm) && (current_IVFChessGame.xdocument.BoardForm.PgnMoveText))
            current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar] = current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value;
         if (current_IVFChessGame.BoardClicked >= 0) SetBoardClicked(-1);
      }
      current_IVFChessGame.insertLog("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")current_IVFChessGame.g_MoveCount=" + current_IVFChessGame.g_MoveCount + ";len=" + current_IVFChessGame.xdocument.game.move.length);
      if(nMoveNumber > current_IVFChessGame.xdocument.game.move.length * 2 - (current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove)) nMoveNumber  = current_IVFChessGame.xdocument.game.move.length * 2 - (current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove);
      for (ii = 0; (ii < nMoveNumber) && ((current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove) < current_IVFChessGame.xdocument.game.move.length * 2); ii++) 
      {
         //ssearch = Math.floor(current_IVFChessGame.g_MoveCount / 2 + 2) + ".";
         //var idx  = (current_IVFChessGame.g_MoveCount & 0xfffffffe) >> 1 ;
         var idx  = (current_IVFChessGame.g_MoveCount + (current_IVFChessGame.StartMove & 1) - current_IVFChessGame.StartMove) >> 1;
         current_IVFChessGame.insertLog("MoveForward(nMoveNumber, rr)current_IVFChessGame.g_MoveCount{"+current_IVFChessGame.g_MoveCount+"};current_IVFChessGame.StartMove{" + current_IVFChessGame.StartMove + "}ii={" + ii + "}idx={"+ idx +"}; nMoveNumber={" + nMoveNumber + "};len=" + current_IVFChessGame.xdocument.game.move.length);
         //ssearch = (2 + idx) + ".";
         //llst = ffull.indexOf(ssearch);
         //ssearch = Math.floor(current_IVFChessGame.g_MoveCount / 2 + 1) + ".";
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
            ssub = current_IVFChessGame.xdocument.game.move[idx].fullText;
            current_IVFChessGame.insertLog("GetMove(ssub={" + ssub + "}, current_IVFChessGame.MoveType = {" + current_IVFChessGame.MoveType + "})");
            //mmove0 = GetMove(ssub, current_IVFChessGame.MoveType);
            if(current_IVFChessGame.MoveType == 0)
            {
               mmove0 = current_IVFChessGame.xdocument.game.move[idx].white_move;
            }
            else
            {
               mmove0 = current_IVFChessGame.xdocument.game.move[idx].black_move;
            }
            //current_IVFChessGame.insertLog("mmove0 = {" + mmove0 + "}");
            if (mmove0 != "")
            {
               if (ParseMove(mmove0, true) > 0)
               {
                  mmove1 = mmove0;
                  if (current_IVFChessGame.MoveType == 0)
                     current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove] = Math.floor((current_IVFChessGame.g_MoveCount+2)/2) + "." + mmove1;
                  else
                     current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove] = Math.floor((current_IVFChessGame.g_MoveCount+2)/2) + ". ... " + mmove1;
                  current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove + 1] = current_IVFChessGame.NewCommands.join("|");
                  current_IVFChessGame.g_MoveCount++;
                  current_IVFChessGame.MoveType = 1 - current_IVFChessGame.MoveType;
               }

               /**
               else
               {
                  if (current_IVFChessGame.MoveType == 1)
                  {
                     ssub = Math.floor(current_IVFChessGame.g_MoveCount / 2 + 1);
                     current_IVFChessGame.insertLog("else if current_IVFChessGame.MoveType == 1 (ssub={" + ssub + "}");
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
                        if (llst<0) {ssub=ffull.substring(ffst); current_IVFChessGame.insertLog("1 if llst lt 0 (ssub={" + ssub + "}");}
                        else {ssub=ffull.substring(ffst, llst); current_IVFChessGame.insertLog("1 if llst lt 0 : else (ssub={" + ssub + "}");}
                        
                        mmove0=GetMove(ssub,0);
                        if (mmove0!="")
                        {
                           if (ParseMove(mmove0, true)>0)
                           {
                              mmove1=mmove0;
                              current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... "+mmove1;
                              current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove+1]=current_IVFChessGame.NewCommands.join("|");
                              current_IVFChessGame.g_MoveCount++;
                              current_IVFChessGame.MoveType=1-current_IVFChessGame.MoveType;
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
      if (current_IVFChessGame.isCalculating) return;
      if ((current_IVFChessGame.OldCommands.length > 0) || (current_IVFChessGame.NewCommands.length > 0)) ExecCommands();
      if (current_IVFChessGame.xdocument.BoardForm)
      {
         if ((current_IVFChessGame.xdocument.BoardForm.Position) && (mmove1 != ""))
            current_IVFChessGame.xdocument.BoardForm.Position.value = TransformSAN(current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1]);
         if ((mmove1 != "") && (current_IVFChessGame.isDragDrop) && (nMoveNumber == 1) && (!current_IVFChessGame.dragObj) && (current_IVFChessGame.dragPiece[0] >= 0) && (!rr) && (!current_IVFChessGame.isAnimating)) AnimateBoard(1);
         else RefreshBoard();
      }
      if (current_IVFChessGame.TargetDocument) HighlightMove("m" + current_IVFChessGame.g_MoveCount + "v" + current_IVFChessGame.CurVar);
      UpdateAnnotation(false);
      if (current_IVFChessGame.AutoPlayInterval) clearTimeoutStub(current_IVFChessGame.AutoPlayInterval);
      if (current_IVFChessGame.isAutoPlay) current_IVFChessGame.AutoPlayInterval = setTimeoutStub(function(){MoveForward(nMoveNumber);}, current_IVFChessGame.Delay);
      current_IVFChessGame.UpdateBoardAndPieceImages();
   }catch(e)
   {
      throw 'rethrow error MoveForward (' + nMoveNumber+ ', ' + rr+ '): ' + e + "\n";

   }
}

function ParseMove(mm, sstore)
{
   var ii, ffrom = "", ccapt = 0, ll, yy1i = -1;
   var ttype0 = -1, xx0 = -1, yy0 = -1, ttype1 = -1, xx1 = -1, yy1 = -1;
   if (current_IVFChessGame.g_MoveCount > current_IVFChessGame.StartMove)
   {
      current_IVFChessGame.CanPass = -1;
      ii = current_IVFChessGame.HistPiece[0][current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1];
      if (   (current_IVFChessGame.HistType[0][current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1] == 5) && (Math.abs(current_IVFChessGame.HistPosY[0][current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1] - current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.Y) == 2)   )
         current_IVFChessGame.CanPass = current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.X;
   }
   else
      current_IVFChessGame.CanPass = current_IVFChessGame.EnPass;
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
            if (EvalMove(ttype0, 6, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
               return(1);
            return(0);
         }
         if ((mm.indexOf("O-O") >= 0) || (mm.indexOf("0-0") >= 0) || (mm.indexOf("O朞") >= 0) || (mm.indexOf("0�0") >= 0))
         {
            if (EvalMove(ttype0, 7, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
               return(1);
            return(0);
         }
         return(0);
      }
      if ((mm.indexOf("---") >= 0) || (mm.indexOf("枛�") >= 0))
      //if (mm.indexOf("...")>=0) //is buggy
      {
         if (EvalMove(ttype0, 8, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
            return(1);
         return(0);
      }
      return(0);
   }
   ll=ffrom.length;
   ttype0=5;
  if (ll>0)
  { for (ii=0; ii<5; ii++)
    { if (ffrom.charCodeAt(0)==current_IVFChessGame.PieceCode[ii]) 
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
      { ttype0=Math.abs(current_IVFChessGame.Board[xx0][yy0])-1;
        if ((ttype0==0)&&(xx0-xx1>1)&&(yy0==yy1))
        { if (EvalMove(ttype0, 6, xx0, yy0, -1, -1, -1, 0, sstore))
            return(1);
          return(0);
        }  
        if ((ttype0==0)&&(xx1-xx0>1)&&(yy0==yy1))
        { if (EvalMove(ttype0, 7, xx0, yy0, -1, -1, -1, 0, sstore))
            return(1);
          return(0);
        }
      }
    }
  }
  if (current_IVFChessGame.Board[xx1][yy1]!=0) ccapt=1;
  else
  { if ((ttype0==5)&&(xx1==current_IVFChessGame.CanPass)&&(yy1==5-3*current_IVFChessGame.MoveType)) ccapt=1;
  }
  ttype1=ttype0;
  ii=mm.indexOf("=");
  if (ii<0) ii=yy1i;
  if ((ii>0)&&(ii<mm.length-1))
  { if (ttype0==5)
    { ii=mm.charCodeAt(ii+1);
      if (ii==current_IVFChessGame.PieceCode[1]) ttype1=1;
      if (ii==current_IVFChessGame.PieceCode[2]) ttype1=2;
      if (ii==current_IVFChessGame.PieceCode[3]) ttype1=3;
      if (ii==current_IVFChessGame.PieceCode[4]) ttype1=4;
    }  
  }
  if (sstore)
  { for (ii=0; ii<16; ii++)
    { if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type==ttype0)
      { if (EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, true))
          return(1);
      }
    }
  }
  else
  { ll=0;
    for (ii=0; ii<16; ii++)
    { if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type==ttype0)
      { if (EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, false))
          ll++;
      }
    }
    return(ll);
  }    
  return(0);
}

function CanCastleLong()
{ if (current_IVFChessGame.Castling[current_IVFChessGame.MoveType][1]==0) return(-1);
  if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Moves>0) return(-1);
  var jj=0;
  while (jj<16)
  { if ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X<current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y==current_IVFChessGame.MoveType*7)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Type==2)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Moves==0))
      jj+=100;
    else jj++;
  }
  if (jj==16) return(-1);
  jj-=100;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=0;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=0;
  var ff=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X;
  if (ff>2) ff=2;
  while ((ff<current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X)||(ff<=3))
  { if (current_IVFChessGame.Board[ff][current_IVFChessGame.MoveType*7]!=0)
    { current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=1-2*current_IVFChessGame.MoveType;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=(1-2*current_IVFChessGame.MoveType)*3;
      return(-1);
    }
    ff++;
  }
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=1-2*current_IVFChessGame.MoveType;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=(1-2*current_IVFChessGame.MoveType)*3;  
  return(jj);
}

function CanCastleShort()
{ if (current_IVFChessGame.Castling[current_IVFChessGame.MoveType][0]==0) return(-1);
  if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Moves>0) return(-1);
  var jj=0;
  while (jj<16)
  { if ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X>current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y==current_IVFChessGame.MoveType*7)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Type==2)&&
        (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Moves==0))
      jj+=100;
    else jj++;
  }
  if (jj==16) return(-1);
  jj-=100;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=0;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=0;
  var ff=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X;
  if (ff<6) ff=6;
  while ((ff>current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X)||(ff>=5))
  { if (current_IVFChessGame.Board[ff][current_IVFChessGame.MoveType*7]!=0)
    { current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=1-2*current_IVFChessGame.MoveType;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=(1-2*current_IVFChessGame.MoveType)*3;
      return(-1);
    }
    ff--;
  }
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X][current_IVFChessGame.MoveType*7]=1-2*current_IVFChessGame.MoveType;
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.MoveType*7]=(1-2*current_IVFChessGame.MoveType)*3;
  return(jj);     
}
function EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore)
{ var ddx, ddy, xx, yy, jj=-1, ttype2=-1, xx2=xx1, yy2=xx1, ttype3=-1, xx3=-1, yy3=-1, ff;
   if (ttype0==6) //O-O-O with Chess960 rules
   { jj=CanCastleLong();
     if (jj<0) return(false);
     if (StoreMove(0, 0, 2, current_IVFChessGame.MoveType*7, jj, 2, 3, current_IVFChessGame.MoveType*7, sstore))
       return(true);
     else return(false);
   }
   if (ttype0==7) //O-O with Chess960 rules
   { jj=CanCastleShort();
     if (jj<0) return(false);
     if (StoreMove(0, 0, 6, current_IVFChessGame.MoveType*7, jj, 2, 5, current_IVFChessGame.MoveType*7, sstore))
       return(true);
     return(false);
   }
   if (ttype0==8) // --- NullMove
   { if (StoreMove(0, 0, current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X, current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.Y, -1, -1, -1, -1, sstore))
       return(true);
     return(false);
   }  
   if ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X==xx1)&&(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y==yy1))
     return(false);
   if ((ccapt==0)&&(current_IVFChessGame.Board[xx1][yy1]!=0))
     return(false);
   if ((ccapt>0)&&(sign(current_IVFChessGame.Board[xx1][yy1])!=(2*current_IVFChessGame.MoveType-1)))
   { if ((ttype0!=5)||(current_IVFChessGame.CanPass!=xx1)||(yy1!=5-3*current_IVFChessGame.MoveType))
       return(false);
   }
   if ((xx0>=0)&&(xx0!=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X)) return(false);
   if ((yy0>=0)&&(yy0!=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y)) return(false);
   if (ttype0==0)
   { //if ((xx0>=0)||(yy0>=0)) return(false); //because of Smith Notation
     if (Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)>1) return(false);
     if (Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1)>1) return(false);
   }
   if (ttype0==1)
   { if ((Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)!=Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1))&&
         ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)*(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1)!=0))
       return(false);
   }
   if (ttype0==2)
   { if ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)*(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1)!=0)
       return(false);
   }
   if (ttype0==3)
   { if (Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)!=Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1))
       return(false);
   }
   if (ttype0==4)
   { if (Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)*Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1)!=2)
       return(false);
   }
   if ((ttype0==1)||(ttype0==2)||(ttype0==3))
   { ddx=sign(xx1-current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X);
     ddy=sign(yy1-current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y);
     xx=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X+ddx;
     yy=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y+ddy;
     while ((xx!=xx1)||(yy!=yy1))
     { if (current_IVFChessGame.Board[xx][yy]!=0) return(false);
       xx+=ddx;
       yy+=ddy;
     }
   }
   if (ttype0==5)
   {
      if (Math.abs(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X-xx1)!=ccapt) return(false);
      if ((yy1==7*(1-current_IVFChessGame.MoveType))&&(ttype0==ttype1)) return(false);
      if (ccapt==0)
      {
         if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1==4*current_IVFChessGame.MoveType-2)
         {
            if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y!=1+5*current_IVFChessGame.MoveType) return(false);
            if (current_IVFChessGame.Board[xx1][yy1+2*current_IVFChessGame.MoveType-1]!=0) return(false);
         }
         else
         {
            if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1!=2*current_IVFChessGame.MoveType-1) return(false);
         }
      }
      else
      {
         if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y-yy1!=2*current_IVFChessGame.MoveType-1) return(false);
      }
   }
   if (ttype1!=ttype0)
   {
      if (ttype0 != 5) return(false);
      if (ttype1 >= 5) return(false);
      if (yy1 != 7 - 7 * current_IVFChessGame.MoveType) return(false);
   }
   if ((ttype0<=5)&&(ccapt>0))
   {
      jj=15;
      while ((jj>=0)&&(ttype3<0))
      {
         if ((current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type>0)&&
               (current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X==xx1)&&
               (current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y==yy1))
            ttype3=current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type;
         else
           jj--;
      }
      if ((ttype3==-1)&&(ttype0==5)&&(current_IVFChessGame.CanPass>=0))
      { jj=15;
         while ((jj>=0)&&(ttype3<0))
         {
            if ((current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type==5)&&
                  (current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X==xx1)&&
                  (current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y==yy1-1+2*current_IVFChessGame.MoveType))
               ttype3=current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type;
            else
              jj--;
         }
      }
      ttype3=-1;
   }  
   if (StoreMove(ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore))
      return(true);
   return(false);
}

function StoreMove(ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore)
{ var iis_check=0, ll, cc=current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove, ff=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X, dd=0;
  if ((ttype1==5)||((jj>=0)&&(ttype3<0)))
    current_IVFChessGame.HalfMove[cc+1]=0;
  else
    current_IVFChessGame.HalfMove[cc+1]=current_IVFChessGame.HalfMove[cc]+1;
  current_IVFChessGame.HistPiece[0][cc] = ii;
  current_IVFChessGame.HistType[0][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type;
  current_IVFChessGame.HistPosX[0][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X;
  current_IVFChessGame.HistPosY[0][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y;
  if (!current_IVFChessGame.isAnimating)
  { current_IVFChessGame.dragPiece[0]=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X;
    current_IVFChessGame.dragPiece[1]=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y;
    current_IVFChessGame.dragPiece[2]=xx1;
    current_IVFChessGame.dragPiece[3]=yy1;
    current_IVFChessGame.dragPiece[4]=-1;
  }
  if (jj<0) 
    current_IVFChessGame.HistPiece[1][cc] = -1;
  else
  { if (ttype3>=0)
    { current_IVFChessGame.HistPiece[1][cc] = jj;
      current_IVFChessGame.HistType[1][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Type;
      current_IVFChessGame.HistPosX[1][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X;
      current_IVFChessGame.HistPosY[1][cc] = current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y;
      if (!current_IVFChessGame.isAnimating)
      { current_IVFChessGame.dragPiece[4]=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X;
        current_IVFChessGame.dragPiece[5]=current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y;
        current_IVFChessGame.dragPiece[6]=xx3;
        current_IVFChessGame.dragPiece[7]=yy3;
      }
    }
    else
    { current_IVFChessGame.HistPiece[1][cc] = 16+jj;
      current_IVFChessGame.HistType[1][cc] = current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type;
      current_IVFChessGame.HistPosX[1][cc] = current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X;
      current_IVFChessGame.HistPosY[1][cc] = current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y;
    }
  }
  
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y]=0;
  if (jj>=0)
  { if (ttype3<0)
      current_IVFChessGame.Board[current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y]=0;
    else
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y]=0;
  }
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type=ttype1;
  if ((current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X!=xx1)||(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y!=yy1)||(jj>=0))
  { current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Moves++; dd++; } //not a nullmove
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X=xx1;
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y=yy1;
  if (jj>=0)
  { if (ttype3<0)
    { current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type=ttype3;
      current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Moves++;
    }
    else
    { current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X=xx3;
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y=yy3;
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Moves++;
    }
  }
  if (jj>=0)
  { if (ttype3<0)
      current_IVFChessGame.Board[current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y]=0;    
    else
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y]=(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Type+1)*(1-2*current_IVFChessGame.MoveType);
  }
  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y]=(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type+1)*(1-2*current_IVFChessGame.MoveType);

  if ((ttype1==0)&&(ttype3==2)) //O-O-O, O-O
  { while (ff>xx1) 
    { iis_check+=IsCheck(ff, current_IVFChessGame.MoveType*7, current_IVFChessGame.MoveType);
      ff--;      
    }
    while (ff<xx1) 
    { iis_check+=IsCheck(ff, current_IVFChessGame.MoveType*7, current_IVFChessGame.MoveType);
      ff++;      
    } 
  }
  iis_check+=IsCheck(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X, current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.Y, current_IVFChessGame.MoveType);

  if ((iis_check==0)&&(sstore))
  { current_IVFChessGame.MoveArray[cc]=String.fromCharCode(97+current_IVFChessGame.HistPosX[0][cc])+(current_IVFChessGame.HistPosY[0][cc]+1)+String.fromCharCode(97+current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X)+(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y+1);
    if (current_IVFChessGame.HistType[0][cc] != current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type)
    { if (current_IVFChessGame.MoveType==0) current_IVFChessGame.MoveArray[cc]+=current_IVFChessGame.PieceName.charAt(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type);
      else current_IVFChessGame.MoveArray[cc]+=current_IVFChessGame.PieceName.charAt(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type).toLowerCase();
    }
    current_IVFChessGame.MoveArray.length=cc+1;
    return(true);
  }

  current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y]=0;
  current_IVFChessGame.Board[current_IVFChessGame.HistPosX[0][cc]][current_IVFChessGame.HistPosY[0][cc]]=(current_IVFChessGame.HistType[0][cc]+1)*(1-2*current_IVFChessGame.MoveType);
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Type=current_IVFChessGame.HistType[0][cc];
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.X=current_IVFChessGame.HistPosX[0][cc];
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Pos.Y=current_IVFChessGame.HistPosY[0][cc];
  current_IVFChessGame.Piece[current_IVFChessGame.MoveType][ii].Moves-=dd;
  if (jj>=0)   
  { if (ttype3>=0)
    { current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y]=0;
      current_IVFChessGame.Board[current_IVFChessGame.HistPosX[0][cc]][current_IVFChessGame.HistPosY[0][cc]]=(current_IVFChessGame.HistType[0][cc]+1)*(1-2*current_IVFChessGame.MoveType);
      current_IVFChessGame.Board[current_IVFChessGame.HistPosX[1][cc]][current_IVFChessGame.HistPosY[1][cc]]=(current_IVFChessGame.HistType[1][cc]+1)*(1-2*current_IVFChessGame.MoveType);
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Type=current_IVFChessGame.HistType[1][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X=current_IVFChessGame.HistPosX[1][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y=current_IVFChessGame.HistPosY[1][cc];
      current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Moves--;
    }
    else
    { current_IVFChessGame.Board[current_IVFChessGame.HistPosX[1][cc]][current_IVFChessGame.HistPosY[1][cc]]=(current_IVFChessGame.HistType[1][cc]+1)*(2*current_IVFChessGame.MoveType-1);
      current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Type=current_IVFChessGame.HistType[1][cc];
      current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.X=current_IVFChessGame.HistPosX[1][cc];
      current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Pos.Y=current_IVFChessGame.HistPosY[1][cc];
      current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][jj].Moves--;
    }
  }
  if (iis_check==0) return(true);
  return(false);
}

function IsCheck(xx, yy, tt)
{ var ii0=xx, jj0=yy, ddi, ddj, bb;
  for (ddi=-2; ddi<=2; ddi+=4)
  { for (ddj=-1; ddj<=1; ddj+=2)
    { if (IsOnBoard(ii0+ddi, jj0+ddj))  
      { if (current_IVFChessGame.Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
      }
    }
  }
  for (ddi=-1; ddi<=1; ddi+=2)
  { for (ddj=-2; ddj<=2; ddj+=4)
    { if (IsOnBoard(ii0+ddi, jj0+ddj)) 
      { if (current_IVFChessGame.Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
      }
    }
  }
  for (ddi=-1; ddi<=1; ddi+=2)
  { ddj=1-2*tt;
    { if (IsOnBoard(ii0+ddi, jj0+ddj)) 
      { if (current_IVFChessGame.Board[ii0+ddi][jj0+ddj]==12*tt-6) return(1);
      }
    }
  }
  if ((Math.abs(current_IVFChessGame.Piece[1-tt][0].Pos.X-xx)<2)&&(Math.abs(current_IVFChessGame.Piece[1-tt][0].Pos.Y-yy)<2)) 
    return(1);
  for (ddi=-1; ddi<=1; ddi+=1)
  { for (ddj=-1; ddj<=1; ddj+=1)
    { if ((ddi!=0)||(ddj!=0))
      { ii0=xx+ddi; 
        jj0=yy+ddj;
        bb=0;
        while ((IsOnBoard(ii0, jj0))&&(bb==0))
        { bb=current_IVFChessGame.Board[ii0][jj0];
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

function IsOnBoard(ii, jj)
{ if (ii<0) return(false);
  if (ii>7) return(false);
  if (jj<0) return(false);
  if (jj>7) return(false);
  return(true);
}



function ExecCommand(bb) { current_IVFChessGame.isExecCommand = bb;}

function ExecCommands(nnc, hh)
{
   var ii, jj, kk, nn, mm, cc, tt, bb0, bb1, xx0, yy0, xx1, yy1, aa = "";
   if (!current_IVFChessGame.isExecCommand)  return;
   if (document.layers) return;
   if (!document.getElementById("Board")) return;
   if (nnc)
   {
      current_IVFChessGame.NewCommands.length = 0;

      if (nnc.indexOf(",") > 0) current_IVFChessGame.NewCommands = nnc.replace(/ /g, '').split(",");
      else current_IVFChessGame.NewCommands[0] = nnc.replace(/ /g, '');

      if (hh);
      else current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove] = current_IVFChessGame.NewCommands.join("|");
      setTimeoutStub("ExecCommands()", 100);

      return;
   }

   var dd = parseInt(document.getElementById("Board").offsetHeight);
   var dd32 = Math.round(dd / 32);
   for (ii = 0; ii < current_IVFChessGame.OldCommands.length; ii++)
   {
      tt = current_IVFChessGame.OldCommands[ii].charAt(0);
      if ((tt == "B") || (tt == "C"))
      {
         nn = current_IVFChessGame.OldCommands[ii].charCodeAt(1) - 97 + (8 - parseInt(current_IVFChessGame.OldCommands[ii].charAt(2))) * 8;
         if (current_IVFChessGame.isRotated) nn = 63 - nn;
         if ((nn >= 0) && (nn <= 63))
         {
            if (tt == "B") current_IVFChessGame.current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + nn].style.borderColor = current_IVFChessGame.BorderColor;
            else current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + nn].style.backgroundColor = "transparent";
         }
      }
      if (tt == "A") document.getElementById("Canvas").innerHTML = "<div style='position:absolute;top:0px;left:0px;width:0px;height:0px;'></div>";
   }
   if (current_IVFChessGame.NewCommands.length > 0) current_IVFChessGame.SetAutoPlay(false);
   for (ii = 0; ii < current_IVFChessGame.NewCommands.length; ii++)
   {
      tt = current_IVFChessGame.NewCommands[ii].substr(1, 4);
      if ((tt == "this") || (tt == "last"))
      {
         if (tt == "this") { kk = current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1; ll = 0; }
         else  { kk = current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 2; ll = 1; }
         if (kk >= 0)
         {
            tt = current_IVFChessGame.NewCommands[ii].charAt(0);
            cc = current_IVFChessGame.NewCommands[ii].substr(5, 6);
            nn = current_IVFChessGame.NewCommands.length;   
            if ((tt == "B") || (tt == "C"))
            {
               current_IVFChessGame.NewCommands[nn]     = tt + String.fromCharCode(97 + current_IVFChessGame.HistPosX[0][kk]) + (1 + current_IVFChessGame.HistPosY[0][kk]) + cc;
               current_IVFChessGame.NewCommands[nn + 1] = tt + String.fromCharCode(97 + current_IVFChessGame.Piece[(current_IVFChessGame.MoveType + ll + 1) % 2][current_IVFChessGame.HistPiece[0].Pos.X[kk]]) + (1 + current_IVFChessGame.Piece[(current_IVFChessGame.MoveType + ll + 1) % 2][current_IVFChessGame.HistPiece[0].Pos.Y[kk]]) + cc;
            }
            if (tt=="A")
            {
               current_IVFChessGame.NewCommands[nn]=tt+String.fromCharCode(97+current_IVFChessGame.HistPosX[0][kk])+(1+current_IVFChessGame.HistPosY[0][kk]);
               current_IVFChessGame.NewCommands[nn]+=String.fromCharCode(97+current_IVFChessGame.Piece[(current_IVFChessGame.MoveType+ll+1)%2][current_IVFChessGame.HistPiece[0].Pos.X[kk]])+(1+current_IVFChessGame.Piece[(current_IVFChessGame.MoveType+ll+1)%2][current_IVFChessGame.HistPiece[0].Pos.Y[kk]])+cc;
            }
            current_IVFChessGame.NewCommands[ii]="X";
         }
      }
      else
      {
         tt=current_IVFChessGame.NewCommands[ii].charAt(0);
         if ((tt=="B")||(tt=="C"))
         { nn=current_IVFChessGame.NewCommands[ii].charCodeAt(1)-97+(8-parseInt(current_IVFChessGame.NewCommands[ii].charAt(2)))*8;
           if ((nn>=0)&&(nn<=63))
           { if (current_IVFChessGame.isRotated) nn=63-nn;
             cc=current_IVFChessGame.NewCommands[ii].substr(3,6);
             if (cc=="R") cc="FF0000";
             if (cc=="G") cc="00FF00";
             if (cc=="B") cc="0000FF";
             if (cc.length!=6) cc="#FFFFFF";
             else cc="#"+cc;
             if (tt=="B") current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset+nn].style.borderColor=cc;
             else current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset+nn].style.backgroundColor=cc;   
           }
         }
         if ((tt=="A")&&(dd>0))
         {
            kk = current_IVFChessGame.NewCommands[ii].charCodeAt(1) - 97;
            jj = parseInt(current_IVFChessGame.NewCommands[ii].charAt(2));
            nn = kk + (8 - jj) * 8;
            if ((nn >= 0) && (nn <= 63)) bb0 = current_IVFChessGame.Board[kk][jj - 1];
            kk = current_IVFChessGame.NewCommands[ii].charCodeAt(3) - 97;
            jj = parseInt(current_IVFChessGame.NewCommands[ii].charAt(4));
            mm = kk + (8 - jj) * 8;
            if ((mm >= 0) && (mm <= 63)) bb1 = current_IVFChessGame.Board[kk][jj - 1];
            if ((nn >= 0) && (nn <= 63) && (mm >= 0) && (mm <= 63) && (nn != mm))
            {
               if (current_IVFChessGame.isRotated) { nn = 63 - nn; mm = 63 - mm; }
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
               cc = current_IVFChessGame.NewCommands[ii].substr(5, 6);
               if (cc == "R") cc = "FF0000";
               if (cc == "G") cc = "00FF00";
               if (cc == "B") cc = "0000FF";
               if (cc.length!=6) cc = "#FFFFFF";
               else cc = "#" + cc;
               aa += GetArrow(xx0, yy0, xx1, yy1, cc);
            }
         }
      }
   }
   if (aa != "") 
   {
      document.getElementById("Canvas").style.top = -dd + "px";
      document.getElementById("Canvas").innerHTML = aa;
   }
   current_IVFChessGame.OldCommands.length = 0;
   for (ii = 0; ii < current_IVFChessGame.NewCommands.length; ii++) current_IVFChessGame.OldCommands[ii] = current_IVFChessGame.NewCommands[ii];
   current_IVFChessGame.NewCommands.length=0;
}

//TODO: is RefreshBoard used anymore?
function RefreshBoard(rr)
{
   //alert("try to refresh board");
   if (current_IVFChessGame.SkipRefresh>0) return;
   current_IVFChessGame.InitImages();
   if (rr) current_IVFChessGame.DocImg.length=0;
   var ii, jj, kk, kk0, ll, mm=1;
   try
   {
      if (current_IVFChessGame.xdocument.images["RightLabels"])
      {
         if (current_IVFChessGame.IsLabelVisible)
         {
            if (current_IVFChessGame.isRotated) SetImg("RightLabels",current_IVFChessGame.LabelPic[2]);
            else SetImg("RightLabels",current_IVFChessGame.LabelPic[0]);
         }
         else SetImg("RightLabels",current_IVFChessGame.LabelPic[4]);
      }
      if (current_IVFChessGame.xdocument.images["BottomLabels"])
      {
         if (current_IVFChessGame.IsLabelVisible)
         {
            if (current_IVFChessGame.isRotated) SetImg("BottomLabels",current_IVFChessGame.LabelPic[3]);
            else SetImg("BottomLabels",current_IVFChessGame.LabelPic[1]);
         }
         else SetImg("BottomLabels",current_IVFChessGame.LabelPic[4]); 
      }
   }catch(e)
   {
       alert("RefreshBoard: " + e);
   }
   if (current_IVFChessGame.isSetupBoard)
   {
      if (current_IVFChessGame.isRotated)
      {
         for (ii=0; ii<8; ii++)
         {
            for (jj=0; jj<8; jj++)
            {
               if (current_IVFChessGame.Board[ii][jj]==0)
                  SetImg(63-ii-(7-jj)*8,current_IVFChessGame.BoardPic);
               else
                  SetImg(63-ii-(7-jj)*8,current_IVFChessGame.PiecePic[(1-sign(current_IVFChessGame.Board[ii][jj]))/2][Math.abs(current_IVFChessGame.Board[ii][jj])-1]);
            }
         }
      }
      else
      {
         for (ii=0; ii<8; ii++)
         {
            for (jj=0; jj<8; jj++)
            {
               if (current_IVFChessGame.Board[ii][jj]==0)
                  SetImg(ii+(7-jj)*8,current_IVFChessGame.BoardPic);
               else
                  SetImg(ii+(7-jj)*8,current_IVFChessGame.PiecePic[(1-sign(current_IVFChessGame.Board[ii][jj]))/2][Math.abs(current_IVFChessGame.Board[ii][jj])-1]);
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
            if (current_IVFChessGame.Board[ii][jj]==0)
            {
               if (current_IVFChessGame.isRotated)
                  SetImg(63-ii-(7-jj)*8,current_IVFChessGame.BoardPic);
               else
                  SetImg(ii+(7-jj)*8,current_IVFChessGame.BoardPic);
            }
         }
      }
      for (ii=0; ii<2; ii++)
      {
         for (jj=0; jj<16; jj++)
         {
            if (current_IVFChessGame.Piece[ii][jj].Type>=0)
            {
               kk=current_IVFChessGame.Piece[ii][jj].Pos.X+8*(7-current_IVFChessGame.Piece[ii][jj].Pos.Y);
               if (current_IVFChessGame.isRotated)
                  SetImg(63-kk,current_IVFChessGame.PiecePic[ii][current_IVFChessGame.Piece[ii][jj].Type]);  
               else
                  SetImg(kk,current_IVFChessGame.PiecePic[ii][current_IVFChessGame.Piece[ii][jj].Type]);
            }
         }
      }
      if (current_IVFChessGame.isCapturedPieces)
      {
         var pp0=new Array(0,1,1,2,2,2,8);
         kk0=0;
         if (current_IVFChessGame.xdocument.images["RightLabels"]) kk0++;
         kk=0;
         ii=0;
         if (current_IVFChessGame.isRotated) ii=1;
         for (jj=0; jj<16; jj++) pp0[current_IVFChessGame.Piece[ii][jj].Type+1]--;
         for (jj=1; jj<5; jj++)
         {
            for (ll=0; ll<pp0[jj+1]; ll++)
            {
               SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,current_IVFChessGame.PiecePic[ii][jj]);
               kk++;
               pp0[0]++;
            }
         }
         for (ll=0; ll>pp0[0]; ll--)
         {
            SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,current_IVFChessGame.PiecePic[ii][5]);
            kk++;
         }
         if (mm<kk) mm=kk;
         while (kk<4) { SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,current_IVFChessGame.BoardPic); kk++; }
         while (kk<16){ SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,current_IVFChessGame.LabelPic[4]); kk++; }
         var pp1=new Array(0,1,1,2,2,2,8);
         kk=0;
         ii=1-ii;
         for (jj=0; jj<16; jj++) pp1[current_IVFChessGame.Piece[ii][jj].Type+1]--;
         for (jj=1; jj<5; jj++)
         {
            for (ll=0; ll<pp1[jj+1]; ll++)
            {
               SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,current_IVFChessGame.PiecePic[ii][jj]);
               kk++;
               pp1[0]++;
            }
         }
         for (ll=0; ll>pp1[0]; ll--)
         {
            SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,current_IVFChessGame.PiecePic[ii][5]);
            kk++;
         }
         if (mm<kk) mm=kk;
         while (kk<4) { SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,current_IVFChessGame.BoardPic); kk++; }
         while (kk<16){ SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,current_IVFChessGame.LabelPic[4]); kk++; }
         mm=Math.ceil(mm/4);
         if ((parent)&&(parent.ChangeColWidth)) parent.ChangeColWidth(mm);
      }
   }
   current_IVFChessGame.UpdateBoardAndPieceImages();  
}

function SetCandidateStyle(ss)
{
   current_IVFChessGame.CandidateStyle=ss;
}

function HighlightCandidates(nn, ccs)
{ if (nn<0) { ExecCommands('',1); return; }
  var ii0=nn%8;
  var jj0=7-(nn-ii0)/8;
  var pp=current_IVFChessGame.Board[ii0][jj0];
  var cc=sign(pp);
  var tt=(1-cc)/2;
  var dd, ddi, ddj, bb, jj, aa=new Array();
  var nna=0, ddA=0;
  if (ccs.charAt(0)=="A") ddA=1;

  if (Math.abs(pp)==6)
  { current_IVFChessGame.Board[ii0][jj0]=0;
    if (IsOnBoard(ii0, jj0+cc))
    { bb=current_IVFChessGame.Board[ii0][jj0+cc];
      if (bb==0)
      { current_IVFChessGame.Board[ii0][jj0+cc]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
          aa[nna++]=String.fromCharCode(ii0+97)+(jj0+cc+1);
        current_IVFChessGame.Board[ii0][jj0+cc]=bb;
        if (2*jj0+5*cc==7)
        { bb=current_IVFChessGame.Board[ii0][jj0+2*cc];
          if (bb==0)
          { current_IVFChessGame.Board[ii0][jj0+2*cc]=pp;
            if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
            { nna-=ddA;
              aa[nna++]=String.fromCharCode(ii0+97)+(jj0+2*cc+1);
            }
            current_IVFChessGame.Board[ii0][jj0+2*cc]=bb;
          }    
        }
      }
    }
    for (ddi=-1; ddi<=1; ddi+=2)
    { if (IsOnBoard(ii0+ddi, jj0+cc))  
      { bb=current_IVFChessGame.Board[ii0+ddi][jj0+cc];
        if (bb*cc<0)
        { current_IVFChessGame.Board[ii0+ddi][jj0+cc]=pp;
          if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
            aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
          current_IVFChessGame.Board[ii0+ddi][jj0+cc]=bb;
        }
      }
      if (2*jj0-cc==7)
      { if (IsOnBoard(ii0+ddi, jj0))
        { if (current_IVFChessGame.Board[ii0+ddi][jj0]==-cc*6) 
            { bb=current_IVFChessGame.Board[ii0+ddi][jj0+cc];
            if (bb==0)
            { if (current_IVFChessGame.g_MoveCount>current_IVFChessGame.StartMove)
              { current_IVFChessGame.CanPass=-1;
                dd=current_IVFChessGame.HistPiece[0][current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1];
                if ((current_IVFChessGame.HistType[0][current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]==5)&&(Math.abs(current_IVFChessGame.HistPosY[0][current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]-current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][dd].Pos.Y)==2))
                  current_IVFChessGame.CanPass=current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][dd].Pos.X;
              }
              else 
                current_IVFChessGame.CanPass=current_IVFChessGame.EnPass;
              if (current_IVFChessGame.CanPass==ii0+ddi)
              { current_IVFChessGame.Board[ii0+ddi][jj0+cc]=pp;
                if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
                  aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
                current_IVFChessGame.Board[ii0+ddi][jj0+cc]=bb;
              }
            }
          }
        }
      }
    }
    current_IVFChessGame.Board[ii0][jj0]=pp;
  }
  
  if (Math.abs(pp)==5)
  { current_IVFChessGame.Board[ii0][jj0]=0;
    for (ddi=-2; ddi<=2; ddi+=4)
    { for (ddj=-1; ddj<=1; ddj+=2)
      { if (IsOnBoard(ii0+ddi, jj0+ddj))  
        { bb=current_IVFChessGame.Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    for (ddi=-1; ddi<=1; ddi+=2)
    { for (ddj=-2; ddj<=2; ddj+=4)
      { if (IsOnBoard(ii0+ddi, jj0+ddj))  
        { bb=current_IVFChessGame.Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    current_IVFChessGame.Board[ii0][jj0]=pp;
  }
  
  if ((Math.abs(pp)==2)||(Math.abs(pp)==4))
  { current_IVFChessGame.Board[ii0][jj0]=0;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0+dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0+dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0+dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0+dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0+dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0+dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0-dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0-dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0-dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0-dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0-dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0-dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    current_IVFChessGame.Board[ii0][jj0]=pp;
  }
  
    
  if ((Math.abs(pp)==2)||(Math.abs(pp)==3))
  { current_IVFChessGame.Board[ii0][jj0]=0;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0+dd][jj0];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0+dd][jj0]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0+dd][jj0]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0,jj0+dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0][jj0+dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0][jj0+dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0][jj0+dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0,jj0+dd))&&(bb==0))  
    { bb=current_IVFChessGame.Board[ii0][jj0+dd];
      if (bb*cc<=0)
      { current_IVFChessGame.Board[ii0][jj0+dd]=pp;
        if (!IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, tt))
        { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
          nna-=ddA;
        }
        current_IVFChessGame.Board[ii0][jj0+dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    current_IVFChessGame.Board[ii0][jj0]=pp;
  }
  
  if (Math.abs(pp)==1)
  { current_IVFChessGame.Board[ii0][jj0]=0;
    for (ddi=-1; ddi<=1; ddi++)
    { for (ddj=-1; ddj<=1; ddj++)
      { if (((ddi!=0)||(ddj!=0))&&(IsOnBoard(ii0+ddi, jj0+ddj)))  
        { bb=current_IVFChessGame.Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(ii0+ddi, jj0+ddj, tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            current_IVFChessGame.Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    current_IVFChessGame.Board[ii0][jj0]=pp;
    jj=CanCastleLong();//O-O-O with Chess960 rules
    if (jj>=0)
    { current_IVFChessGame.Board[ii0][jj0]=0;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y]=0;
      current_IVFChessGame.Board[2][tt*7]=1-2*tt;
      current_IVFChessGame.Board[3][tt*7]=3*(1-2*tt);
      ddi=ii0;
      bb=0;
      { while (ddi>2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi--;      
        }
        while (ddi<2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi++;
        }
      }
      bb+=IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, current_IVFChessGame.MoveType);
      if (bb==0) aa[nna++]=String.fromCharCode(2+97)+(tt*7+1);
      current_IVFChessGame.Board[2][tt*7]=0;
      current_IVFChessGame.Board[3][tt*7]=0;
      current_IVFChessGame.Board[ii0][jj0]=pp;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[tt][jj].Pos.X][current_IVFChessGame.Piece[tt][jj].Pos.Y]=cc*3;
    }
    jj=CanCastleShort();//O-O with Chess960 rules
    if (jj>=0)
    { current_IVFChessGame.Board[ii0][jj0]=0;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.X][current_IVFChessGame.Piece[current_IVFChessGame.MoveType][jj].Pos.Y]=0;
      current_IVFChessGame.Board[6][tt*7]=1-2*tt;
      current_IVFChessGame.Board[5][tt*7]=3*(1-2*tt);
      ddi=ii0;
      bb=0;
      { while (ddi>2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi--;      
        }
        while (ddi<2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi++;
        }
      }
      bb+=IsCheck(current_IVFChessGame.Piece[tt][0].Pos.X, current_IVFChessGame.Piece[tt][0].Pos.Y, current_IVFChessGame.MoveType);
      if (bb==0) aa[nna++]=String.fromCharCode(6+97)+(tt*7+1);
      current_IVFChessGame.Board[6][tt*7]=0;
      current_IVFChessGame.Board[5][tt*7]=0;
      current_IVFChessGame.Board[ii0][jj0]=pp;
      current_IVFChessGame.Board[current_IVFChessGame.Piece[tt][jj].Pos.X][current_IVFChessGame.Piece[tt][jj].Pos.Y]=cc*3;
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

//TODO: miss using of function implemented in event handler manner
function SetBoardClicked(nn) //TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
{
   try
   {
      if (! current_IVFChessGame.xdocument.BoardForm) return;
      if (! current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset].style) { current_IVFChessGame.BoardClicked = nn; return; }
      if (current_IVFChessGame.CandidateStyle != "") HighlightCandidates(nn, current_IVFChessGame.CandidateStyle);
      if (current_IVFChessGame.isDragDrop) { current_IVFChessGame.BoardClicked = nn; return; }
      //if (current_IVFChessGame.BoardClicked >= 0) //really needed styles processing?
      //{
      //   if (current_IVFChessGame.BoardClicked < 64)
      //   {
      //      if (current_IVFChessGame.isRotated)
      //         current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + 63 - current_IVFChessGame.BoardClicked].style.borderColor = current_IVFChessGame.BorderColor;
      //      else
      //         current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + current_IVFChessGame.BoardClicked].style.borderColor = current_IVFChessGame.BorderColor;
      //   }
      //   else current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + current_IVFChessGame.BoardClicked + 3].style.borderColor = current_IVFChessGame.BorderColor;
      //}  
      current_IVFChessGame.BoardClicked = nn;
      //if (current_IVFChessGame.BoardClicked >= 0) 
      //{
      //   if (current_IVFChessGame.BoardClicked < 64)
      //   {
      //      if (current_IVFChessGame.isRotated)
      //         current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + 63 - current_IVFChessGame.BoardClicked].style.borderColor="#FF0000";
      //      else
      //         current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + current_IVFChessGame.BoardClicked].style.borderColor = "#FF0000";
      //   }
      //   else current_IVFChessGame.xdocument.images[current_IVFChessGame.ImageOffset + current_IVFChessGame.BoardClicked + 3].style.borderColor = "#FF0000";
      //}
      
   }catch(e)
   {
      throw "SetBoardClicked (" + nn + ")>>rethrow  error: " + e + "\n";
   }
}

function BoardClickMove(nn)
{
   try
   {
      var ii0, jj0, ii1, jj1, iiv, jjv, nnn=nn, mm, pp=0;
      if (current_IVFChessGame.BoardClicked>=0) return(false);
      if (current_IVFChessGame.isRotated) nnn=63-nn; 
      ii1=nnn%8;
      jj1=7-(nnn-ii1)/8;
      if (sign(current_IVFChessGame.Board[ii1][jj1])==((current_IVFChessGame.g_MoveCount+1)%2)*2-1) return(false);
      for (ii0 = 0; ii0 < 8; ii0++)
      {
         for (jj0 = 0; jj0 < 8; jj0++)
         {
            if (sign(current_IVFChessGame.Board[ii0][jj0])==((current_IVFChessGame.g_MoveCount+1)%2)*2-1) 
            {
               if (Math.abs(current_IVFChessGame.Board[ii0][jj0])==6)
               {
                  mm = String.fromCharCode(ii0 + 97) + (jj0 + 1);
                  if (ii0 != ii1) mm += "x";
               }
               else
               {
                  mm = current_IVFChessGame.PieceName.charAt(Math.abs(current_IVFChessGame.Board[ii0][jj0])-1)+String.fromCharCode(ii0+97)+(jj0+1);
                  if (current_IVFChessGame.Board[ii1][jj1]!=0) mm+="x";
               }
               mm+=String.fromCharCode(ii1+97)+(jj1+1);
               if ((jj1==(1-current_IVFChessGame.MoveType)*7)&&(Math.abs(current_IVFChessGame.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
               {
                  mm=mm+"="+current_IVFChessGame.PieceName.charAt(1);
               }
               if (ParseMove(mm, false))
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
         SetBoardClicked(iiv+8*(7-jjv));
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

//TODO: to review this function
// missusing of functionality meat to be event handler
// BoardClicked < 0 means no first cell to move from
function BoardClick (nn, bb)
{//style
//nn = 0..63

   try
   {
      var ii0, jj0, ii1, jj1, mm, nnn, vv, ffull, ssearch, llst, ffst, ttmp, mmove0;
      var pp, ffst = 0, ssearch, ssub;

      if (current_IVFChessGame.isSetupBoard) { SetupBoardClick(nn); return; }

      if (! current_IVFChessGame.isRecording) return;
      //if (current_IVFChessGame.isAutoPlay)
	  current_IVFChessGame.SetAutoPlay(false);//TODO: to remove if, let just SetAutoPlay
      if (current_IVFChessGame.g_MoveCount == current_IVFChessGame.MaxMove) return;
      if (BoardClickMove(nn)) return;
      if (current_IVFChessGame.isDragDrop && (!bb)) return; //TODO: don't allow first click while drag & drop?

      //TODO: no need to check, there are only IDs now, no more indexes
      if (current_IVFChessGame.isRotated) nnn = 63 - nn;
      else nnn = nn;
      
      if (current_IVFChessGame.BoardClicked == nnn) { SetBoardClicked(-1); return; } //same pozition, reset and do nothing
      
      if (current_IVFChessGame.BoardClicked < 0) //click from
      {
         ii0 = nnn % 8;
         jj0 = 7 - (nnn - ii0) / 8;
         if (sign(current_IVFChessGame.Board[ii0][jj0]) == 0) return;
         if (sign(current_IVFChessGame.Board[ii0][jj0]) != ((current_IVFChessGame.g_MoveCount + 1) % 2) * 2 - 1) 
         {
            mm="---";
            if ((current_IVFChessGame.xdocument.BoardForm)&&(current_IVFChessGame.xdocument.BoardForm.PgnMoveText))
               current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar]=Uncomment(current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value);
            ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
            ffst=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar].indexOf(ssearch);
            if (ffst>=0)
               ssub=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar].substring(0, ffst);
            else
               ssub=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar]; 
            if (ParseMove(mm, false)==0) { SetBoardClicked(-1); return; } //TODO: throws error
            if (!current_IVFChessGame.isNullMove) return;
            if (current_IVFChessGame.g_MoveCount%2==0) { if (!confirm("White nullmove?")) return; }
            else { if (!confirm("Black nullmove?")) return; }
            for (vv=current_IVFChessGame.CurVar; vv<current_IVFChessGame.ShortPgnMoveText[0].length; vv++)
            {
               if ((vv==current_IVFChessGame.CurVar)||((current_IVFChessGame.ShortPgnMoveText[1][vv]==current_IVFChessGame.CurVar)&&(current_IVFChessGame.ShortPgnMoveText[2][vv]==current_IVFChessGame.g_MoveCount)))
               {
                  ffull=Uncomment(current_IVFChessGame.ShortPgnMoveText[0][vv]);
                  ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+2)+".";
                  llst=ffull.indexOf(ssearch);
                  ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
                  ffst=ffull.indexOf(ssearch);
                  if (ffst>=0)
                  {
                     ffst+=ssearch.length;
                     if (llst<0) ttmp=ffull.substring(ffst);
                     else ttmp=ffull.substring(ffst, llst);
                     mmove0=GetMove(ttmp,current_IVFChessGame.MoveType);
                     if ((mmove0.indexOf(mm)<0)&&(current_IVFChessGame.MoveType==1))
                     {
                        ttmp=Math.floor(current_IVFChessGame.g_MoveCount/2+1);
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
                           mmove0=GetMove(ttmp,0);
                        }
                     }
                     if (mmove0.indexOf(mm)==0)
                     {
                        SetMove(current_IVFChessGame.g_MoveCount+1, vv);
                        vv=current_IVFChessGame.ShortPgnMoveText[0].length+1;
                        if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",current_IVFChessGame.Delay/2);
                     }  
                  }  
               }  
            }
            if (vv<current_IVFChessGame.ShortPgnMoveText[0].length+1)
            {
               if ((current_IVFChessGame.RecordCount==0)&&(!((current_IVFChessGame.xdocument.BoardForm)&&(current_IVFChessGame.xdocument.BoardForm.PgnMoveText))))
               {
                  vv=current_IVFChessGame.ShortPgnMoveText[0].length;
                  current_IVFChessGame.ShortPgnMoveText[0][vv]="";
                  current_IVFChessGame.ShortPgnMoveText[1][vv]=current_IVFChessGame.CurVar;
                  current_IVFChessGame.ShortPgnMoveText[2][vv]=current_IVFChessGame.g_MoveCount;
                  current_IVFChessGame.CurVar=vv;
               }  
               ParseMove(mm,true);
               if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",current_IVFChessGame.Delay/2);
               if (current_IVFChessGame.MoveType==0)
               {
                  current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+"."+mm;
                  ssub+=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+".";
               }  
               else
               {
                  current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... "+mm;
                  if (current_IVFChessGame.g_MoveCount==current_IVFChessGame.StartMove) ssub+=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... ";
                  else ssub+=current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]+" ";
               }
               if (current_IVFChessGame.RecordCount==0) current_IVFChessGame.RecordedMoves=current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove];
               else
               {
                  ttmp=current_IVFChessGame.RecordedMoves.split(" ");
                  ttmp.length=current_IVFChessGame.RecordCount+((current_IVFChessGame.g_MoveCount-current_IVFChessGame.RecordCount)%2)*2;
                  current_IVFChessGame.RecordedMoves=ttmp.join(" ");
                  if (current_IVFChessGame.MoveType==0) current_IVFChessGame.RecordedMoves+=" "+current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove];
                  else current_IVFChessGame.RecordedMoves+=" "+mm;
               }
               current_IVFChessGame.RecordCount++;
               current_IVFChessGame.g_MoveCount++;
               current_IVFChessGame.MoveType=1-current_IVFChessGame.MoveType;
               if (current_IVFChessGame.xdocument.BoardForm)
               {
                  if (current_IVFChessGame.xdocument.BoardForm.PgnMoveText) current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
                  if (current_IVFChessGame.xdocument.BoardForm.Position)
                     current_IVFChessGame.xdocument.BoardForm.Position.value=TransformSAN(current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]);
                  current_IVFChessGame.NewCommands.length=0;
                  ExecCommands();
                  RefreshBoard(); //TODO: what this does?
               }
            }
         }
         SetBoardClicked(nnn);
         return; 
      } // BoardClicked < 0 => click from
      ii0=current_IVFChessGame.BoardClicked%8;
      jj0=7-(current_IVFChessGame.BoardClicked-ii0)/8;
      ii1=nnn%8;
      jj1=7-(nnn-ii1)/8;
      if (Math.abs(current_IVFChessGame.Board[ii0][jj0])==6)
      {
         if (ii0!=ii1) mm=String.fromCharCode(ii0+97)+"x";
         else mm="";
      }
      else
      {
         mm=current_IVFChessGame.PieceName.charAt(Math.abs(current_IVFChessGame.Board[ii0][jj0])-1);
         if (current_IVFChessGame.Board[ii1][jj1]!=0) mm+="x";
      }
      SetBoardClicked(-1);
      mm+=String.fromCharCode(ii1+97)+(jj1+1);
      if (Math.abs(current_IVFChessGame.Board[ii0][jj0])==1)
      {
         if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.Y==jj1)
         {
            if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X+2==ii1) mm="O-O";
            if (current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X-2==ii1) mm="O-O-O";
            if (current_IVFChessGame.Board[ii1][jj1]==(1-2*current_IVFChessGame.MoveType)*3) //for Chess960
            {
               if (ii1>ii0) mm="O-O";
               if (ii1<ii0) mm="O-O-O";
            }
         }  
      } 
      if ((current_IVFChessGame.xdocument.BoardForm)&&(current_IVFChessGame.xdocument.BoardForm.PgnMoveText))
         current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar]=Uncomment(current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value);
      ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
      ffst=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar].indexOf(ssearch);
      if (ffst>=0)
         ssub=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar].substring(0, ffst);
      else
         ssub=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar]; 
      if ((jj1==(1-current_IVFChessGame.MoveType)*7)&&(Math.abs(current_IVFChessGame.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
      {
         pp=0;
         while(pp==0)
         {
            if (pp==0) { if (confirm("Queen "+current_IVFChessGame.PieceName.charAt(1)+" ?")) pp=1; }
            if (pp==0) { if (confirm("Rook "+current_IVFChessGame.PieceName.charAt(2)+" ?")) pp=2; }
            if (pp==0) { if (confirm("Bishop "+current_IVFChessGame.PieceName.charAt(3)+" ?")) pp=3; }
            if (pp==0) { if (confirm("Knight "+current_IVFChessGame.PieceName.charAt(4)+" ?")) pp=4; }            
         }
         mm=mm+"="+current_IVFChessGame.PieceName.charAt(pp);
      }
      pp=ParseMove(mm, false);
      if (pp==0) return;
      if (Math.abs(current_IVFChessGame.Board[ii0][jj0])!=1)
      {
         var mmm;
         if (Math.abs(current_IVFChessGame.Board[ii0][jj0])==6)
         {
            if (mm.charAt(1)=="x") mmm=mm.substr(0,1)+(jj0+1)+mm.substr(1,11);
            else mmm=String.fromCharCode(ii0+97)+(jj0+1)+mm;
         }
         else mmm=mm.substr(0,1)+String.fromCharCode(ii0+97)+(jj0+1)+mm.substr(1,11);
         if (ParseMove(mmm, false)==0) return;
      }
      if (pp > 1)
      {
         mm = mm.substr(0, 1) + String.fromCharCode (ii0 + 97) + mm.substr(1, 11);
         if (ParseMove(mm, false) != 1)
         {
            mm=mm.substr(0,1)+(jj0+1)+mm.substr(2,11);
            if (ParseMove(mm, false)!=1)
            mm=mm.substr(0,1)+String.fromCharCode(ii0+97)+(jj0+1)+mm.substr(2,11);
         }  
      }
      for (vv = current_IVFChessGame.CurVar; vv<current_IVFChessGame.ShortPgnMoveText[0].length; vv++)
      {
         if ((vv==current_IVFChessGame.CurVar)||((current_IVFChessGame.ShortPgnMoveText[1][vv]==current_IVFChessGame.CurVar)&&(current_IVFChessGame.ShortPgnMoveText[2][vv]==current_IVFChessGame.g_MoveCount)))
         {
            ffull=Uncomment(current_IVFChessGame.ShortPgnMoveText[0][vv]);
            ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+2)+".";
            llst=ffull.indexOf(ssearch);
            ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
            ffst=ffull.indexOf(ssearch);
            if (ffst>=0)
            {
               ffst += ssearch.length;
               if (llst<0)
                  ttmp=ffull.substring(ffst);
               else
                  ttmp=ffull.substring(ffst, llst);  
               mmove0=GetMove(ttmp,current_IVFChessGame.MoveType);
               if ((mmove0.indexOf(mm)<0)&&(current_IVFChessGame.MoveType==1))
               {
                  ttmp=Math.floor(current_IVFChessGame.g_MoveCount/2+1);
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
                     mmove0=GetMove(ttmp,0);
                  }
               }
               if ((mmove0.indexOf(mm)==0)&&(mmove0.indexOf(mm+mm.substr(1))!=0))
               {
                  SetMove(current_IVFChessGame.g_MoveCount+1, vv);
                  if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",current_IVFChessGame.Delay/2);
                  return;
               }  
            }  
         }  
      }
      if ((current_IVFChessGame.RecordCount==0)&&(!((current_IVFChessGame.xdocument.BoardForm)&&(current_IVFChessGame.xdocument.BoardForm.PgnMoveText))))
      {
         vv=current_IVFChessGame.ShortPgnMoveText[0].length;
         current_IVFChessGame.ShortPgnMoveText[0][vv] = "";
         current_IVFChessGame.ShortPgnMoveText[1][vv] = current_IVFChessGame.CurVar;
         current_IVFChessGame.ShortPgnMoveText[2][vv] = current_IVFChessGame.g_MoveCount;
         current_IVFChessGame.CurVar = vv;
      }   
      ParseMove(mm, true);
      if (IsCheck(current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][0].Pos.X, current_IVFChessGame.Piece[1-current_IVFChessGame.MoveType][0].Pos.Y, 1-current_IVFChessGame.MoveType)) mm+="+";
      if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",current_IVFChessGame.Delay/2);
      if (current_IVFChessGame.MoveType==0)
      {
         current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+"."+mm;
         ssub+=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+".";
      }  
      else
      {
         current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... "+mm;
         if (current_IVFChessGame.g_MoveCount==current_IVFChessGame.StartMove) ssub+=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... ";
         else ssub+=current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]+" ";
      }
      if (current_IVFChessGame.RecordCount==0) current_IVFChessGame.RecordedMoves=current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove];
      else
      {
         ttmp=current_IVFChessGame.RecordedMoves.split(" ");
         ttmp.length=current_IVFChessGame.RecordCount+((current_IVFChessGame.g_MoveCount-current_IVFChessGame.RecordCount)%2)*2;
         current_IVFChessGame.RecordedMoves=ttmp.join(" ");
         if (current_IVFChessGame.MoveType==0) current_IVFChessGame.RecordedMoves+=" "+current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove];
         else current_IVFChessGame.RecordedMoves+=" "+mm;
      }
      current_IVFChessGame.RecordCount++;
      current_IVFChessGame.g_MoveCount++;
      current_IVFChessGame.MoveType=1-current_IVFChessGame.MoveType;
      if (current_IVFChessGame.xdocument.BoardForm)
      {
         if (current_IVFChessGame.xdocument.BoardForm.PgnMoveText) current_IVFChessGame.xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
         if (current_IVFChessGame.xdocument.BoardForm.Position)
            current_IVFChessGame.xdocument.BoardForm.Position.value=TransformSAN(current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove-1]);
         current_IVFChessGame.NewCommands.length=0;
         ExecCommands();
         RefreshBoard(); //TODO: what this does?
      }
   }catch(e)
   {
      //alert("BoardClick>>error" + e)
      throw("BoardClick>>rethrow error: \n" + e);
   }
}

//TODO: RotateBoard is not used anymore, using flipBoard instead
function RotateBoard(bb)
{ SetBoardClicked(-1);
  var ii, cc=new Array();
  for (ii=0; ii<current_IVFChessGame.OldCommands.length; ii++) cc[ii]=current_IVFChessGame.OldCommands[ii];
  current_IVFChessGame.NewCommands.length=0;
  ExecCommands();
  current_IVFChessGame.isRotated=bb;
  if ((document.BoardForm)&&(document.BoardForm.Rotated))
    document.BoardForm.Rotated.checked=bb;
  RefreshBoard();
  for (ii=0; ii<cc.length; ii++) current_IVFChessGame.NewCommands[ii]=cc[ii];
  ExecCommands();
}

//TODO: enable this function
function ShowCapturedPieces(bb)
{
  current_IVFChessGame.isCapturedPieces = bb;
  if (current_IVFChessGame.isCapturedPieces) RefreshBoard();
  else
  {
     var kk, kk0 = 0;
     if (current_IVFChessGame.xdocument.images["RightLabels"]) kk0++;
     for (kk = 0; kk < 32; kk++) SetImg(64 + kk0 + kk,current_IVFChessGame.LabelPic[4]);
     if ((parent) && (parent.ChangeColWidth)) parent.ChangeColWidth(0);
  }
}

function Is3FoldRepetition()
{ if (current_IVFChessGame.g_MoveCount<8) return(false);
  var ss=GetFENList();
  ss=ss.split("\n");
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

function IsInsufficientMaterial()
{
  var ss=GetFEN(true);
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
    { if (Math.abs(current_IVFChessGame.Board[ii][jj])==4)
      { if ((ii+jj)%2==0) ww++;
        else bb++;
      }
    }
  }
  if ((ww>0)&&(bb>0)) return(false);
  return(true);
}

function IsMate()
{ var aa, ii0, jj0, nn=0, ii=IsCheck(current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.X, current_IVFChessGame.Piece[current_IVFChessGame.MoveType][0].Pos.Y, current_IVFChessGame.MoveType);
  for (ii0=0; (nn==0)&&(ii0<8); ii0++)
  { for (jj0=0; (nn==0)&&(jj0<8); jj0++)
    { if (sign(current_IVFChessGame.Board[ii0][jj0])==((current_IVFChessGame.g_MoveCount+1)%2)*2-1)
      { nn=(7-jj0)*8+ii0;
          aa=HighlightCandidates(nn," ");
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

function IsDraw()
{ ff=GetFEN().split(" ");
  if (parseInt(ff[4])>=100) return("Draw by 50 move rule.");
  if (Is3FoldRepetition()) return("Draw by 3-fold repetition.");
  if (IsInsufficientMaterial()) return("Draw by insufficient material.");
  return(false);
}

function SetPgnMoveText(ss, vvariant, rroot, sstart)
{ if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
    document.BoardForm.PgnMoveText.value=ss;
  if (vvariant)
  { current_IVFChessGame.ShortPgnMoveText[0][vvariant]=ss;
    current_IVFChessGame.ShortPgnMoveText[1][vvariant]=rroot;
    current_IVFChessGame.ShortPgnMoveText[2][vvariant]=sstart;
  }
  else current_IVFChessGame.ShortPgnMoveText[0][0]=ss;
}

function ApplySAN(ss)
{
   if (ss.length<6)
   {
      current_IVFChessGame.PieceName = "KQRBNP";
      if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=current_IVFChessGame.PieceName;
   }
   else
   {
      current_IVFChessGame.PieceName = ss;
      if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=ss;
   }
   for (var ii=0; ii<6; ii++) current_IVFChessGame.PieceCode[ii]=current_IVFChessGame.PieceName.charCodeAt(ii);
}

function ShowSAN(ss)
{
   current_IVFChessGame.ShowPieceName = ss;
   if (ss.length != 6) current_IVFChessGame.ShowPieceName = "";
   if (   (current_IVFChessGame.ShowPieceName == "") || (current_IVFChessGame.ShowPieceName == current_IVFChessGame.PieceName)   ) return;
   if (   (document.BoardForm) && (document.BoardForm.PgnMoveText)   )
   {
      var tt = document.BoardForm.PgnMoveText.value;
      if (tt == "") return;
      var ww = window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
      ww.document.open();
      ww.document.writeln("<HTML><HEAD></HEAD><BODY>" + TransformSAN(tt) + "</BODY></HTML>");
      ww.document.close();
   }
}

function TransformSAN(ss)
{
   if (ss == "") return("");
   if ((current_IVFChessGame.ShowPieceName == "") || (current_IVFChessGame.ShowPieceName == current_IVFChessGame.PieceName)) return(ss);
   var jj, rr, tt = "";
   for (jj = 0; jj < ss.length; jj++)
   {
      rr = current_IVFChessGame.PieceName.indexOf(ss.charAt(jj));
      if (rr >= 0) tt += current_IVFChessGame.ShowPieceName.charAt(rr);
      else tt += ss.charAt(jj);
   }
   return(tt);
}

function GetFEN(sshort)
{
   var ii, jj, ee, ss = "";
   for (jj=7; jj>=0; jj--)
   {
      ee=0;
      for (ii=0; ii<8; ii++)
      {
         if (current_IVFChessGame.Board[ii][jj] == 0) ee++;
         else
         {
            if (ee > 0)
            {
               ss = ss + "" + ee;
               ee = 0;
            }
            if (current_IVFChessGame.Board[ii][jj]>0) 
               ss = ss + current_IVFChessGame.PieceName.toUpperCase().charAt (  current_IVFChessGame.Board[ii][jj] - 1);
            else
               ss = ss + current_IVFChessGame.PieceName.toLowerCase().charAt ( -current_IVFChessGame.Board[ii][jj] - 1);
         }
      }
      if (ee > 0) ss = ss + "" + ee;
      if (jj > 0) ss = ss + "/";
   }
   if (sshort) return(ss);
   if (current_IVFChessGame.MoveType==0) ss = ss + " w";
   else ss = ss + " b";
   ee = "";
   if ((current_IVFChessGame.Castling[0][0] > 0) && (current_IVFChessGame.Piece[0][0].Moves == 0))
   {
      for (ii = 0; ii < 16; ii++)
      {
         if ((current_IVFChessGame.Piece[0][ii].Type == 2) && (current_IVFChessGame.Piece[0][ii].Pos.X == 7) && (current_IVFChessGame.Piece[0][ii].Pos.Y == 0))
           ee = ee + current_IVFChessGame.PieceName.toUpperCase().charAt(0);
      }
   }
   if ((current_IVFChessGame.Castling[0][1] > 0) && (current_IVFChessGame.Piece[0][0].Moves == 0))
   {
      for (ii = 0; ii < 16; ii++)
      {
         if ((current_IVFChessGame.Piece[0][ii].Type == 2) && (current_IVFChessGame.Piece[0][ii].Pos.X == 0) && (current_IVFChessGame.Piece[0][ii].Pos.Y == 0))
            ee = ee + current_IVFChessGame.PieceName.toUpperCase().charAt(1);
      }
   }
   if ((current_IVFChessGame.Castling[1][0] > 0) && (current_IVFChessGame.Piece[1][0].Moves == 0))
   {
      for (ii = 0; ii < 16; ii++)
      {
         if ((current_IVFChessGame.Piece[1][ii].Type == 2) && (current_IVFChessGame.Piece[1][ii].Pos.X == 7) && (current_IVFChessGame.Piece[1][ii].Pos.Y == 7))
            ee = ee + current_IVFChessGame.PieceName.toLowerCase().charAt(0);
      }
   }
   if ((current_IVFChessGame.Castling[1][1]>0)&&(current_IVFChessGame.Piece[1][0].Moves==0))
   {
      for (ii = 0; ii < 16; ii++)
      {
         if ((current_IVFChessGame.Piece[1][ii].Type == 2) && (current_IVFChessGame.Piece[1][ii].Pos.X == 0) && (current_IVFChessGame.Piece[1][ii].Pos.Y == 7))
            ee = ee + current_IVFChessGame.PieceName.toLowerCase().charAt(1);
      }
   }
   if (ee == "") ss = ss + " -";
   else ss = ss + " " + ee;
   if (current_IVFChessGame.g_MoveCount > current_IVFChessGame.StartMove)
   {
      current_IVFChessGame.CanPass = -1;
      ii = current_IVFChessGame.HistPiece[0][current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove - 1];
      if ((current_IVFChessGame.HistType[0][current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove - 1] == 5) && (Math.abs(current_IVFChessGame.HistPosY[0][current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove - 1] - current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.Y) == 2))
         current_IVFChessGame.CanPass = current_IVFChessGame.Piece[1 - current_IVFChessGame.MoveType][ii].Pos.X;
   }
   else
     current_IVFChessGame.CanPass = current_IVFChessGame.EnPass;
   if (current_IVFChessGame.CanPass >= 0)
   {
      ss = ss + " " + String.fromCharCode(97 + current_IVFChessGame.CanPass);
      if (current_IVFChessGame.MoveType == 0) ss = ss + "6";
      else ss = ss + "3";
   }
   else ss = ss + " -";
   ss = ss + " " + current_IVFChessGame.HalfMove[current_IVFChessGame.g_MoveCount - current_IVFChessGame.StartMove];
   ss = ss + " " + Math.floor((current_IVFChessGame.g_MoveCount + 2) / 2);
   if ((current_IVFChessGame.xdocument.BoardForm) && (current_IVFChessGame.xdocument.BoardForm.FEN))
     current_IVFChessGame.xdocument.BoardForm.FEN.value = ss;
   try
   {//TODO: don't surpress this call
      document.getElementById("FEN").value = current_IVFChessGame.xdocument.BoardForm.FEN.value;//TODO: to centralize
   }catch(err)
   {
      current_IVFChessGame.insertLog("norethrow/surpress failed to write FEN: " + err); //surpressed
   }
   return(ss);
}

function GetFENList(sshort)
{ var mmove=current_IVFChessGame.g_MoveCount, vvariant=current_IVFChessGame.CurVar, nn=0;
  var ff, ff_new, ff_old;
  current_IVFChessGame.isCalculating=true;
  ff=GetFEN(sshort);
  ff_new=ff;
  do
  { ff_old=ff_new;
    MoveBack(1);
    ff_new=GetFEN(sshort);
    if (ff_old!=ff_new) { ff=ff_new+"\n"+ff; nn++ }
  }
  while (ff_old!=ff_new);
  current_IVFChessGame.isCalculating=false;
  if (vvariant==0)
  { if (nn>0) MoveForward(nn); }
  else SetMove(mmove, vvariant);
  return(ff);
}

function ShowFENList()
{ var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
  ww.document.open();
  ww.document.writeln("<HTML><HEAD></HEAD><BODY><PRE>"+GetFENList()+"</PRE></BODY></HTML>");
  ww.document.close();
}

function MakePuzzle()
{ //get rid of global document

  current_IVFChessGame.appendLog("MakePuzzle()");
  var ii, nn=0, ff, ff_old="", mm="", tt="", pp="", oo, aa="";
  if (!document.BoardForm) return;
  current_IVFChessGame.isCalculating=true;
  if (document.BoardForm.FEN) ff_old=document.BoardForm.FEN.value;
  ff=GetFEN();
  if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
  if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
  if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=current_IVFChessGame.ScriptPath; }
  ii=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
  nn=mm.indexOf(ii);
  if (nn>=0)
  { mm=mm.substr(nn);
    if (current_IVFChessGame.g_MoveCount%2!=0) 
    { mm.substr(ii.length);
      while ((mm!="")&&(mm.charAt(0)==" ")) mm=mm.substr(1);
      nn=mm.indexOf(" ");
      if (nn>0) mm=ii+" ..."+mm.substr(nn);
    }
  }
  if (document.BoardForm.FEN) document.BoardForm.FEN.value=ff_old;  
  current_IVFChessGame.isCalculating=false;
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
  if (current_IVFChessGame.isDragDrop) aa+='&SetDragDrop=1';
  if (current_IVFChessGame.isRotated) aa+='&RotateBoard=1';
  if (tt!="") tt='&AddText='+tt;
  ww.document.writeln('<a href="'+nn+aa+tt+'"');
  while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
  while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
  ww.document.writeln('>'+nn+aa+tt+'</a>');
  if (current_IVFChessGame.g_MoveCount>2)
  { ff=ff_old[0]+" "+ff_old[1]+" "+ff_old[2]+" "+ff_old[3]+" 0 1";
    ii=Math.floor(current_IVFChessGame.g_MoveCount/2+1);
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

function MakeGamelink()
{
  current_IVFChessGame.appendLog("MakeGamelink()");
  var nn=0, ff, mm="", tt="", pp="", oo, aa="";
  if (!document.BoardForm) return;
  if (document.BoardForm.FEN) ff=document.BoardForm.FEN.value;
  if (ff==current_IVFChessGame.StandardFen) ff="";
  if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
  if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
  if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=current_IVFChessGame.ScriptPath; }
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
  if (current_IVFChessGame.isDragDrop) aa+='&SetDragDrop=1';
  if (current_IVFChessGame.isRotated) aa+='&RotateBoard=1';
  mm="&eval=AddText(unescape(%22"+escape("<|td><td>"+tt)+"%22)+GetHTMLMoveText(0,0,1))";
  ww.document.writeln('<a href="'+nn+aa+mm+'"');
  mm="&eval=AddText(%22<|td><td>"+tt+"%22+GetHTMLMoveText(0,0,1))";
  while (mm.indexOf("<")>0) mm=mm.replace("<","&lt;");
  while (mm.indexOf(">")>0) mm=mm.replace(">","&gt;");
  ww.document.writeln('>'+nn+aa+mm+'</a>');
  ww.document.writeln('</BODY></HTML>');
  ww.document.close();
}

//TODO: to find out more suitable DOM solution
function SetTitle(tt)
{ //top.document.title=tt; //TODO: to review this code
}

function AddText(tt)
{ //document.writeln(tt); //TODO: to review this code
}

function EvalUrlString(ss)
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

function OpenGame(nn)
{ if (parent.frames[1])
  { if ((parent.frames[1].OpenGame)&&
        (parent.frames[1].document.forms[0])&&
        (parent.frames[1].document.forms[0].GameList))
    { parent.frames[1].OpenGame(nn);
      return;
    }
  }
  setTimeoutStub('OpenGame('+nn+')',400);    
}

function SetMove(mmove, vvariant)
{ if (isNaN(mmove)) return;
  var ii=current_IVFChessGame.isCalculating;
  current_IVFChessGame.isCalculating=true;
  if (current_IVFChessGame.RecordCount>0) MoveBack(current_IVFChessGame.MaxMove);
  if (vvariant)
  { if (vvariant>=current_IVFChessGame.ShortPgnMoveText[0].length) { current_IVFChessGame.isCalculating=ii; return; }
    if (current_IVFChessGame.CurVar!=vvariant) 
    { SetMove(current_IVFChessGame.ShortPgnMoveText[2][vvariant], current_IVFChessGame.ShortPgnMoveText[1][vvariant]);
      current_IVFChessGame.CurVar=vvariant;
    }  
  }
  else
  { while (current_IVFChessGame.CurVar!=0)
    { if (current_IVFChessGame.g_MoveCount==current_IVFChessGame.ShortPgnMoveText[2][current_IVFChessGame.CurVar])
      { current_IVFChessGame.CurVar=current_IVFChessGame.ShortPgnMoveText[1][current_IVFChessGame.CurVar];
        if ((!current_IVFChessGame.isCalculating)&&(document.BoardForm)&&(document.BoardForm.PgnMoveText))
          document.BoardForm.PgnMoveText.value=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar];
      }  
      else MoveBack(1);
    }
  }  
  current_IVFChessGame.isCalculating=ii;
  var dd=mmove-current_IVFChessGame.g_MoveCount;
  if (dd<=0) MoveBack(-dd);
  else MoveForward(dd, 1);
  if (current_IVFChessGame.isCalculating) return;
  if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
    document.BoardForm.PgnMoveText.value=current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar];
  if (current_IVFChessGame.AutoPlayInterval) clearTimeoutStub(current_IVFChessGame.AutoPlayInterval);
  if (current_IVFChessGame.isAutoPlay) current_IVFChessGame.AutoPlayInterval=setTimeoutStub(function(){MoveForward(1);}, current_IVFChessGame.Delay);
}

function ApplyPgnMoveText(ss, rroot, ddocument, ggame)
{ var vv=0;
  if (! isNaN(rroot)) 
  { vv=current_IVFChessGame.ShortPgnMoveText[0].length; 
    current_IVFChessGame.ShortPgnMoveText[0][vv]=""; 
  }
  else 
  { current_IVFChessGame.ShortPgnMoveText[0].length=1;
    if (ddocument) current_IVFChessGame.TargetDocument=ddocument;
    else current_IVFChessGame.TargetDocument=window.document;
    if (rroot) current_IVFChessGame.activeAnchorBG=rroot;
    if (ggame) current_IVFChessGame.startAnchor=ggame;
    else current_IVFChessGame.startAnchor=-1;
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
    //if (bb<0) bb=current_IVFChessGame.g_MoveCount;
    SetPgnMoveText(uu, vv, rroot, bb);
  }
  else SetPgnMoveText(uu);
  return(vv);
}

function GetHTMLMoveText(vvariant, nnoscript, ccommenttype, sscoresheet)
{ var vv=0, tt, ii, uu="", uuu="", cc, bb=0, bbb=0;
  var ss="", sstart=0, nn=current_IVFChessGame.MaxMove, ffst=0,llst,ssearch,ssub,ffull,mmove0="",mmove1="", gg="";
  if (sscoresheet) current_IVFChessGame.Annotation.length=0;
  if (current_IVFChessGame.startAnchor!=-1) gg=",'"+current_IVFChessGame.startAnchor+"'";
  current_IVFChessGame.isCalculating=true;
  if (vvariant) 
  { vv=vvariant;
    if (! isNaN(current_IVFChessGame.ShortPgnMoveText[0][vv]))
    { SetMove(current_IVFChessGame.ShortPgnMoveText[0][vv], current_IVFChessGame.ShortPgnMoveText[1][vv]);
      if (current_IVFChessGame.g_MoveCount!=current_IVFChessGame.ShortPgnMoveText[0][vv]) return("("+current_IVFChessGame.ShortPgnMoveText[0][vv]+")");
      //current_IVFChessGame.CurVar=current_IVFChessGame.ShortPgnMoveText[1][vv];
      if (current_IVFChessGame.ShortPgnMoveText[0][vv].indexOf(".0")>0) return(GetDiagram(1));
      return(GetDiagram());
    }  
    if (current_IVFChessGame.ShortPgnMoveText[2][vv]<0) return(current_IVFChessGame.ShortPgnMoveText[0][vv]);
    SetMove(current_IVFChessGame.ShortPgnMoveText[2][vv], current_IVFChessGame.ShortPgnMoveText[1][vv]);
    if (current_IVFChessGame.g_MoveCount!=current_IVFChessGame.ShortPgnMoveText[2][vv]) return(current_IVFChessGame.ShortPgnMoveText[0][vv]);
    current_IVFChessGame.CurVar=vvariant;
  }  
  else MoveBack(current_IVFChessGame.MaxMove);
  tt=current_IVFChessGame.ShortPgnMoveText[0][vv];
  
  ffull=Uncomment(current_IVFChessGame.ShortPgnMoveText[0][current_IVFChessGame.CurVar]);
  for (ii=0; (ii<nn)&&(ffst>=0)&&(current_IVFChessGame.g_MoveCount<current_IVFChessGame.MaxMove); ii++)
  { ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+2)+".";
    llst=ffull.indexOf(ssearch);
    ssearch=Math.floor(current_IVFChessGame.g_MoveCount/2+1)+".";
    ffst=ffull.indexOf(ssearch);
    mmove1=""
    if (ffst>=0)
    { ffst+=ssearch.length;
      if (llst<0)
        ssub=ffull.substring(ffst);
      else
        ssub=ffull.substring(ffst, llst);
      mmove0=GetMove(ssub,current_IVFChessGame.MoveType);
      if (mmove0!="")
      { if (ParseMove(mmove0, true)>0)
        { mmove1=mmove0;
          if (current_IVFChessGame.MoveType==0)
            current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+"."+mmove1;
          else
            current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... "+mmove1;
          current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove+1]=current_IVFChessGame.NewCommands.join("|");
          current_IVFChessGame.g_MoveCount++;
          current_IVFChessGame.MoveType=1-current_IVFChessGame.MoveType;
        }  
        else
        { if (current_IVFChessGame.MoveType==1)
          { ssub=Math.floor(current_IVFChessGame.g_MoveCount/2+1);
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
              mmove0=GetMove(ssub,0);
              if (mmove0!="")
              { if (ParseMove(mmove0, true)>0)
                { mmove1=mmove0;
                  current_IVFChessGame.HistMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove]=Math.floor((current_IVFChessGame.g_MoveCount+2)/2)+". ... "+mmove1;
                  current_IVFChessGame.HistCommand[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove+1]=current_IVFChessGame.NewCommands.join("|");
                  current_IVFChessGame.g_MoveCount++;
                  current_IVFChessGame.MoveType=1-current_IVFChessGame.MoveType;
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
      while ((sstart>0)&&(IsInComment(tt, sstart)));
      if (sstart>=0)
      { if (sscoresheet)
        { current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount-1]=GetComment(tt.substr(0,sstart));
          if (ss=="")
          { if (sscoresheet==2) ss+="<table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'>";
            if (current_IVFChessGame.g_MoveCount%2==1) ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+((current_IVFChessGame.g_MoveCount+1)/2)+".</th>";
            else ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+(current_IVFChessGame.g_MoveCount/2)+".</th><th>&nbsp;</th>";
          }
          else
          { if (current_IVFChessGame.g_MoveCount%2==1) ss+="<tr><th>"+((current_IVFChessGame.g_MoveCount+1)/2)+".</th>";
          }
          ss+="<th>";
        }
        else ss+=tt.substr(0,sstart);
        if (! nnoscript) ss+="<a href=\"javascript:SetMove{{"+current_IVFChessGame.g_MoveCount+","+vv+gg+"}}\" name=\"m"+current_IVFChessGame.g_MoveCount+"v"+vv+"\">";
        if (vv==0) ss+="<b>";
        ss+=TransformSAN(mmove1);
        if (vv==0) ss+="</b>";
        if (! nnoscript) ss+="</a>";
        tt=tt.substr(sstart+mmove1.length);
        if (sscoresheet)
        { ss+="</th>";
          if (current_IVFChessGame.g_MoveCount%2==0) ss+="</tr>";
          if (sscoresheet==2)
          { if (current_IVFChessGame.g_MoveCount%80==0) ss+="</table></td></tr></table><table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
            else
            { if (current_IVFChessGame.g_MoveCount%40==0) ss+="</table></td><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
            }
          }
        }
      }
      else ffst=-1;
    }
  }
  if (sscoresheet)
  { current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount]=GetComment(tt);
    if (current_IVFChessGame.g_MoveCount%2==1) ss+="<th>&nbsp;</th>";
    ss+="</tr></table>";
    if (sscoresheet==2)
    { if (current_IVFChessGame.g_MoveCount%80<40) ss+="</td><td width='50%'>&nbsp;";
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
        { if (! isNaN(current_IVFChessGame.ShortPgnMoveText[0][uuu]))
          { cc=uu.length-1;
            uu=uu.substr(0,cc);
            cc="";
          }
          if (sscoresheet) uu+=GetHTMLMoveText(uuu, true);
          else uu+=GetHTMLMoveText(uuu, nnoscript);
          current_IVFChessGame.isCalculating=true;
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
  { SetMove(0,0);
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
  current_IVFChessGame.isCalculating=false;
  return(uu);
}

function IsInComment(ss, nn)
{ var ii=-1, bb=0;
  do { ii=ss.indexOf("{",ii+1); bb++; }  
  while ((ii>=0)&&(ii<nn));
  ii=-1;
  do { ii=ss.indexOf("}",ii+1); bb--; }  
  while ((ii>=0)&&(ii<nn));  
  return(bb);
}

function HighlightMove(nn)
{ var ii, cc, bb, jj=0, ll=current_IVFChessGame.TargetDocument.anchors.length;
  if (ll==0) return;
  if (! current_IVFChessGame.TargetDocument.anchors[0].style) return;
  if ((current_IVFChessGame.activeAnchor>=0)&&(ll>current_IVFChessGame.activeAnchor))
  { current_IVFChessGame.TargetDocument.anchors[current_IVFChessGame.activeAnchor].style.backgroundColor="";
    current_IVFChessGame.activeAnchor=-1;
  }
  if (isNaN(current_IVFChessGame.startAnchor))
  { while ((jj<ll)&&(current_IVFChessGame.TargetDocument.anchors[jj].name!=current_IVFChessGame.startAnchor)) jj++;
  }
  for (ii=jj; ((ii<ll)&&(current_IVFChessGame.activeAnchor<0)); ii++)
  { if (current_IVFChessGame.TargetDocument.anchors[ii].name==nn)
    { current_IVFChessGame.activeAnchor=ii;
      current_IVFChessGame.TargetDocument.anchors[current_IVFChessGame.activeAnchor].style.backgroundColor=current_IVFChessGame.activeAnchorBG;
      if ((document!=current_IVFChessGame.TargetDocument)&&(parent.document!=current_IVFChessGame.TargetDocument)&&(current_IVFChessGame.TargetDocument.anchors[current_IVFChessGame.activeAnchor].scrollIntoView)) 
        current_IVFChessGame.TargetDocument.anchors[current_IVFChessGame.activeAnchor].scrollIntoView(false);
      return;
    }
  }
}

function SetAnnotation(ff) { current_IVFChessGame.AnnotationFile=ff;}

function UpdateAnnotation(bb)
{
   if (! parent.frames["annotation"]) return;
   if(bb)
   {
      with (parent.frames["annotation"].document)
      {
         open();
         writeln("<html><head></head><body><form>"); 
         writeln("<input type='hidden' name='MoveCount' value='"+current_IVFChessGame.g_MoveCount+"'>");
         write("<textarea rows=8 style='width:100%' name='Annotation'>");
         if (current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount]) write(current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount]);
         writeln("</textarea>");
         if (current_IVFChessGame.AnnotationFile) writeln("<input type='button' value='Save Annotation' onclick='parent.frames[\"board\"].SaveAnnotation(this.form)'>");
         writeln("</form></body></html>");
         close();
      }  
   }
   else
   {
      parent.frames["annotation"].document.forms[0].MoveCount.value=current_IVFChessGame.g_MoveCount;
      if (current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount])
         parent.frames["annotation"].document.forms[0].Annotation.value=current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount];
      else
         parent.frames["annotation"].document.forms[0].Annotation.value="";
   }  
}

function SaveAnnotation(ff)
{ var mm=parseInt(ff.MoveCount.value);
  current_IVFChessGame.Annotation[mm]=ff.Annotation.value;
  if ((current_IVFChessGame.AnnotationFile)&&(parent.frames['annotation']))
    parent.frames['annotation'].location.replace(current_IVFChessGame.AnnotationFile+"?MoveCount="+mm+"&Annotation="+escape(current_IVFChessGame.Annotation[mm]));
}

function GetDiagram(pp, ssp)
{ var ii, jj, cc, tt, nn, mm, ss=String.fromCharCode(13)+"<P align=center>", oo, aa=new Array(64);
  var bb=current_IVFChessGame.Border;
  var iip=current_IVFChessGame.PGNViewImagePath;
  if (document.BoardForm)
  { if (oo=document.BoardForm.ImagePath)
    { iip=oo.options[oo.options.selectedIndex].value;
      if (iip!="") { iip=iip.replace("|","/"); bb=0; }
    }
    if (oo=document.BoardForm.Border) bb=oo.options.selectedIndex;
  }
  for (ii=0; ii<64; ii++) aa[ii]="";
  if (current_IVFChessGame.isCalculating) oo=current_IVFChessGame.NewCommands;
  else oo=current_IVFChessGame.OldCommands;
  if (oo.length>0)
  { for (ii=0; ii<oo.length; ii++)
    { tt=oo[ii].charAt(0);
      if ((tt=="B")||(tt=="C"))
      { nn=oo[ii].charCodeAt(1)-97+(8-parseInt(oo[ii].charAt(2)))*8;
        if ((nn>=0)&&(nn<=63))
        { if (current_IVFChessGame.isRotated) nn=63-nn;
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
  if (current_IVFChessGame.isRotated)
  { for (jj=0; jj<8; jj++)
    { ss+="<TR>";
      for (ii=7; ii>=0; ii--)
      { if ((current_IVFChessGame.Board[ii][jj]==0)||((pp)&&((current_IVFChessGame.Board[ii][jj]+6)%6!=0)))
          ss+="<TD background='"+iip+current_IVFChessGame.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
        else
          ss+="<TD background='"+iip+current_IVFChessGame.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+current_IVFChessGame.ColorName[(1-sign(current_IVFChessGame.Board[ii][jj]))/2]+tt[Math.abs(current_IVFChessGame.Board[ii][jj])-1]+".gif'";
        if (document.layers) ss+=" border="+bb+"></TD>";
        else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+current_IVFChessGame.BorderColor+";"+aa[jj*8+(7-ii)]+"'></TD>";
      }
      ss+="</TR>";
    }
  }
  else
  { for (jj=7; jj>=0; jj--)
    { ss+="<TR>";
      for (ii=0; ii<8; ii++)
      { if ((current_IVFChessGame.Board[ii][jj]==0)||((pp)&&((current_IVFChessGame.Board[ii][jj]+6)%6!=0)))
          ss+="<TD background='"+iip+current_IVFChessGame.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
        else
          ss+="<TD background='"+iip+current_IVFChessGame.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+current_IVFChessGame.ColorName[(1-sign(current_IVFChessGame.Board[ii][jj]))/2]+tt[Math.abs(current_IVFChessGame.Board[ii][jj])-1]+".gif'";
        if (document.layers) ss+=" border="+bb+"></TD>";
        else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+current_IVFChessGame.BorderColor+";"+aa[(7-jj)*8+ii]+"'></TD>";
      }
      ss+="</TR>";
    }
  }
  ss+="</TABLE></div>";
  if (!document.layers) 
  { var xx0, xx1, bb0, bb1, kk, dd=parseInt(document.getElementById("Board").offsetHeight);
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
          if ((nn>=0)&&(nn<=63)) bb0=current_IVFChessGame.Board[kk][jj-1];
          kk=oo[ii].charCodeAt(3)-97;
          jj=parseInt(oo[ii].charAt(4));
          mm=kk+(8-jj)*8;
          if ((mm>=0)&&(mm<=63)) bb1=current_IVFChessGame.Board[kk][jj-1];
          if ((nn>=0)&&(nn<=63)&&(mm>=0)&&(mm<=63)&&(nn!=mm))
          { if (current_IVFChessGame.isRotated) { nn=63-nn; mm=63-mm; }
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
            ss+=GetArrow(xx0,yy0,xx1,yy1,cc);
          }
        }
      }
      ss+="</div>";  
    }
  }
  ss+="</TD></TR></TABLE>";
  if (current_IVFChessGame.IsLabelVisible)
  { if (current_IVFChessGame.isRotated)
    { ss+="</th><th><img src='"+iip+"1_8.gif'></th>";
      if (current_IVFChessGame.isCapturedPieces) ss+="<th>"+GetCapturedPieces(iip,bb)+"</th>";
      ss+="</tr><tr><th><img src='"+iip+"h_a.gif'></th><th><img src='"+iip+"1x1.gif'>";
      if (current_IVFChessGame.isCapturedPieces) ss+="</th><th>";
    }
    else
    { ss+="</th><th><img src='"+iip+"8_1.gif'></th>";
      if (current_IVFChessGame.isCapturedPieces) ss+="<th>"+GetCapturedPieces(iip,bb)+"</th>";
      ss+="</tr><tr><th><img src='"+iip+"a_h.gif'></th><th><img src='"+iip+"1x1.gif'>";
      if (current_IVFChessGame.isCapturedPieces) ss+="</th><th>";
    }  
  }
  else
  { if (current_IVFChessGame.isCapturedPieces) ss+="</th><th>"+GetCapturedPieces(iip,bb);
  }
  ss+="</th></tr></table></P>"+String.fromCharCode(13);
  return (ss);
}

function GetCapturedPieces(iip,bb)
{ var ii, jj, kk, ll, ss, rr=new Array(8);
  for (ii=0; ii<8; ii++) rr[ii]="";
  var tt=new Array("k","q","r","b","n","p");
  var pp0=new Array(0,1,1,2,2,2,8);
  kk=0;
  ii=0;
  if (current_IVFChessGame.isRotated) ii=1;
  for (jj=0; jj<16; jj++) pp0[current_IVFChessGame.Piece[ii][jj].Type+1]--;
  for (jj=1; jj<5; jj++)
  { for (ll=0; ll<pp0[jj+1]; ll++)
    { rr[kk%4]+="<td><IMG SRC='"+iip+current_IVFChessGame.ColorName[ii]+tt[jj]+".gif'></td>";
      kk++;
      pp0[0]++;
    }
  }
  for (ll=0; ll>pp0[0]; ll--)
  { rr[kk%4]+="<td><IMG SRC='"+iip+current_IVFChessGame.ColorName[ii]+tt[5]+".gif'></td>";
    kk++;
  }
  while (kk<4) { rr[kk%4]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
  while (kk<16){ rr[kk%4]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; }
  var pp1=new Array(0,1,1,2,2,2,8);
  kk=0;
  ii=1-ii;
  for (jj=0; jj<16; jj++) pp1[current_IVFChessGame.Piece[ii][jj].Type+1]--;
  for (jj=1; jj<5; jj++)
  { for (ll=0; ll<pp1[jj+1]; ll++)
    { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+current_IVFChessGame.ColorName[ii]+tt[jj]+".gif'></td>";
      kk++;
      pp1[0]++;
    }
  }
  for (ll=0; ll>pp1[0]; ll--)
  { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+current_IVFChessGame.ColorName[ii]+tt[5]+".gif'></td>";
    kk++;
  }
  while (kk<4) { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
  while (kk<16){ rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; } 
  ss="<table border=0 cellpadding="+bb+" cellspacing=0>";
  for (ii=0; ii<8; ii++) ss+="<tr>"+rr[ii]+"</tr>";
  ss+="</table>";
  return(ss);
}

function GetArrow(theX0, theY0, theX1, theY1, theColor)
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

function SwitchSetupBoard()
{ SetBoardClicked(-1);
  if (!current_IVFChessGame.isSetupBoard)
  { Init('standard');
    current_IVFChessGame.isSetupBoard=true;
    if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
      document.BoardForm.SetupBoard.value=" Ready ";
    return;
  }
  current_IVFChessGame.isSetupBoard=false;
  if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
    document.BoardForm.SetupBoard.value="Setup Board";
  var ii, jj, ee, ss="";
  for (jj=7; jj>=0; jj--)
  { ee=0;
    for (ii=0; ii<8; ii++)
    { if (current_IVFChessGame.Board[ii][jj]==0) ee++;
      else
      { if (ee>0)
        { ss=ss+""+ee;
          ee=0;
        }
        if (current_IVFChessGame.Board[ii][jj]>0) 
          ss=ss+current_IVFChessGame.PieceName.toUpperCase().charAt(current_IVFChessGame.Board[ii][jj]-1);
        else
          ss=ss+current_IVFChessGame.PieceName.toLowerCase().charAt(-current_IVFChessGame.Board[ii][jj]-1);
      }
    }
    if (ee>0) ss=ss+""+ee;
    if (jj>0) ss=ss+"/";
  }
  current_IVFChessGame.MoveType=-1;
  while (current_IVFChessGame.MoveType<0)
  { if (current_IVFChessGame.MoveType<0)
    { if (confirm("White to move?")) current_IVFChessGame.MoveType=0;
    }
    if (current_IVFChessGame.MoveType<0)
    { if (confirm("Black to move?")) current_IVFChessGame.MoveType=1;
    }
  }
  if (current_IVFChessGame.MoveType==0) ss=ss+" w";
  else ss=ss+" b";
  ss=ss+" KQkq";
  ss=ss+" -";
  ss=ss+" "+current_IVFChessGame.HalfMove[current_IVFChessGame.g_MoveCount-current_IVFChessGame.StartMove];
  ss=ss+" "+Math.floor((current_IVFChessGame.g_MoveCount+2)/2);
  if ((document.BoardForm)&&(document.BoardForm.FEN))
    document.BoardForm.FEN.value=ss;    
  Init(ss);
}

function SetBoardSetupMode(mm)
{ current_IVFChessGame.BoardSetupMode=mm;
  SetBoardClicked(-1);
}

function SetupBoardClick(nn)
{ var ii, jj, ii0, jj0, ii1, jj1, mm, nnn;
  if (current_IVFChessGame.isRotated) nnn=63-nn;
  else nnn=nn;
  if ((current_IVFChessGame.BoardClicked<0)&&(current_IVFChessGame.BoardSetupMode!='delete'))
  { if (nn>=64) { SetBoardClicked(nn); return; }
    ii0=nnn%8;
    jj0=7-(nnn-ii0)/8;
    if (current_IVFChessGame.Board[ii0][jj0]!=0) SetBoardClicked(nnn); 
    return; 
  }
  if (current_IVFChessGame.BoardClicked>=0)
  { ii0=current_IVFChessGame.BoardClicked%8;
    jj0=7-(current_IVFChessGame.BoardClicked-ii0)/8;
  }
  ii1=nnn%8;
  jj1=7-(nnn-ii1)/8;
  if (((current_IVFChessGame.Board[ii1][jj1]!=0))&&(current_IVFChessGame.BoardSetupMode!='delete')) 
  { SetBoardClicked(nnn); 
    return;
  }
  if (current_IVFChessGame.BoardSetupMode=='copy')
  { current_IVFChessGame.Board[ii1][jj1]=current_IVFChessGame.Board[ii0][jj0];
    SetBoardClicked(nnn);
  }
  if (current_IVFChessGame.BoardSetupMode=='move')
  { if (current_IVFChessGame.BoardClicked>=64)
    { ii0=current_IVFChessGame.BoardClicked%2;
      jj0=(current_IVFChessGame.BoardClicked-64-ii0)/2;
      if (ii0==0) current_IVFChessGame.Board[ii1][jj1]=jj0+1;
      else current_IVFChessGame.Board[ii1][jj1]=-jj0-1;
    }
    else
    { current_IVFChessGame.Board[ii1][jj1]=current_IVFChessGame.Board[ii0][jj0];
      current_IVFChessGame.Board[ii0][jj0]=0;
      SetBoardClicked(nnn);
    }  
  }
  if (current_IVFChessGame.BoardSetupMode=='delete')
  { current_IVFChessGame.Board[ii1][jj1]=0;
    SetBoardClicked(-1);
  }
  if (current_IVFChessGame.isRotated)
  { for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
      { if (current_IVFChessGame.Board[ii][jj]==0)
          SetImg(63-ii-(7-jj)*8,current_IVFChessGame.BoardPic);
        else
          SetImg(63-ii-(7-jj)*8,current_IVFChessGame.PiecePic[(1-sign(current_IVFChessGame.Board[ii][jj]))/2][Math.abs(current_IVFChessGame.Board[ii][jj])-1]);
      }
    }
  }
  else
  { for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
      { if (current_IVFChessGame.Board[ii][jj]==0)
          SetImg(ii+(7-jj)*8,current_IVFChessGame.BoardPic);
        else
          SetImg(ii+(7-jj)*8,current_IVFChessGame.PiecePic[(1-sign(current_IVFChessGame.Board[ii][jj]))/2][Math.abs(current_IVFChessGame.Board[ii][jj])-1]);
      }
    }
  }
}

function SetupPieceClick(ii,bb)
{
   try
   {
      if (current_IVFChessGame.isDragDrop&&(!bb)) return;
      var nn=current_IVFChessGame.BoardClicked;
      if (ii>11)
      {
         if (nn>=0)
         {
            SetBoardSetupMode('delete');
            if (current_IVFChessGame.isRotated) BoardClick(63-nn,true);
            else BoardClick(nn,true);
            SetBoardSetupMode('move');
         }
         return;
      }
      SetBoardClicked(-1);
      BoardClick(ii+64,true);
   }catch(e)
   {
      alert("SetupPieceClick>>error: " + e);
   }
}

function ParsePgn(nn,gg,ffile)
{
  current_IVFChessGame.appendLog("ParsePgn()");
  if ((nn>0)&&(nn<5)) current_IVFChessGame.ParseType=parseInt(nn);
  var ii, jj, ll=0, ss, tt, uu=""; 
  if (ffile) ss=" "+ffile;
  else
  { if (! parent.frames[1].document.documentElement) 
    { if (nn>-50) setTimeoutStub("ParsePgn("+(nn-5)+",'"+gg+"')",400); 
      return; 
    }
    ss=parent.frames[1].document.documentElement.innerHTML;
    if (ss!="") ll=ss.length;
    if (ll!=nn)
    { setTimeoutStub("ParsePgn("+ll+",'"+gg+"')",400);
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
      if (current_IVFChessGame.ParseType%2==1)
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
  if (current_IVFChessGame.ParseType%2==1) uu="unescape";
  var ssh=current_IVFChessGame.ScoreSheet;
  if ((document.BoardForm)&&(document.BoardForm.ScoreSheet))
    ssh=parseInt(document.BoardForm.ScoreSheet.options[document.BoardForm.ScoreSheet.options.selectedIndex].value);
  if ((parent.frames["annotation"])&&(ssh==0)) ssh=1;
  var bb=current_IVFChessGame.BGColor;
  if (bb=="") bb="#E0C8A0";
  var dd=parent.frames[1].document;
  dd.open();
  dd.writeln("<html><head>");
  dd.writeln("<style type='text/css'>");
  dd.writeln("body { background-color:"+bb+";color:#000000;font-size:10pt;line-height:12pt;font-family:Verdana; }");
  if ((ssh)||(current_IVFChessGame.ParseType>2))
  { dd.writeln("table { border-left:1px solid #808080; border-top:1px solid #808080; }");
    dd.writeln("td, th { border-right:1px solid #808080; border-bottom:1px solid #808080; font-size:10pt;line-height:12pt;font-family:Verdana; vertical-align:top}");
  }
  dd.writeln("a {color:#000000; text-decoration: none}");
  dd.writeln("a:hover {color:#FFFFFF; background-color:#808080}");
  dd.writeln("</style>");
  dd.writeln("<"+"script language='JavaScript'>");
  ii=current_IVFChessGame.PGNViewImagePath.replace("/","|");
  if ((document.BoardForm)&&(document.BoardForm.ImagePath))
    ii=document.BoardForm.ImagePath.options[document.BoardForm.ImagePath.options.selectedIndex].value;
  if (ii!="") ii="&SetImagePath="+ii;
  if (current_IVFChessGame.BGColor!="") ii=ii+"&SetBGColor="+current_IVFChessGame.BGColor.substr(1,6);
  if ((document.BoardForm)&&(document.BoardForm.Border)&&(document.BoardForm.Border.options.selectedIndex>0))
    ii=ii+"&SetBorder=1";
  if (parent.frames["annotation"])
    dd.writeln("if (! parent.frames[0]) location.href='pgnannotator.html?'+location.href+'&SetAnnotation="+current_IVFChessGame.AnnotationFile+ii+"';");
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
  if (current_IVFChessGame.isDragDrop) dd.writeln("      if (parent.frames[0].SetDragDrop) parent.frames[0].SetDragDrop(1);");    
  dd.writeln("      return;");
  dd.writeln("    }");
  dd.writeln("  }");
  dd.writeln("  setTimeoutStub('OpenGame('+nn+')',400);");    
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
  { if (current_IVFChessGame.ParseType<3)
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

function ScoreSheetHeader(tt)
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

function ScoreSheetFooter()
{ return("</td></tr></table></div>");
}

function PrintPosition()
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
    writeln(GetDiagram(pp,tt));
    if(current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount]) writeln(current_IVFChessGame.Annotation[current_IVFChessGame.g_MoveCount]);
    writeln("</div></body></html>");    
    close();
  }
  ww.print();
}


//TODO: to review and remove completely SetDragDrop
//      drag&drop have better HTML5 implemetations, no need for simulations anymore
function SetDragDrop(bb) 
{
  //  document.BoardForm.DragDrop.checked=bb; //??
  //current_IVFChessGame.isDragDrop=bb; //TODO: no impacts anymore

}
//TODO: to review and remove completely MouseDown
//      drag&drop have better HTML5 implemetations, no need for simulations anymore
function MouseDown(e)
{ var ii="";
  if (current_IVFChessGame.dragObj) MouseUp(e);
  if (e)
  { current_IVFChessGame.dragObj=e.target;
    ii=current_IVFChessGame.dragObj.id;
    current_IVFChessGame.dragX=e.clientX;
    current_IVFChessGame.dragY=e.clientY;
  }
  else if (window.event)
  { current_IVFChessGame.dragObj=event.srcElement;
    ii=current_IVFChessGame.dragObj.id;
    current_IVFChessGame.dragX=event.clientX;
    current_IVFChessGame.dragY=event.clientY;
  }
  else return;
  if (isNaN(parseInt(ii))) { current_IVFChessGame.dragObj=null; return; }
  if (ii<64) BoardClick(ii,true);
  else SetupPieceClick(ii-64,true);
  if (!current_IVFChessGame.isDragDrop) return;
  if ((current_IVFChessGame.BoardClicked<0)||(current_IVFChessGame.isAutoPlay)) current_IVFChessGame.dragObj=null;
  else 
  { current_IVFChessGame.dragObj.style.zIndex=200;
    current_IVFChessGame.dragBorder=current_IVFChessGame.dragObj.style.borderWidth;
    if (current_IVFChessGame.dragBorder) current_IVFChessGame.dragObj.style.borderWidth="0px";
  }
  return false;
}
//TODO: to review and remove completely MouseMove
//      drag&drop have better HTML5 implemetations, no need for simulations anymore
function MouseMove(e)
{
   if (!current_IVFChessGame.isDragDrop      ) return;
   if ( current_IVFChessGame.BoardClicked < 0) return; //not a drag&drop from board 
   if ( current_IVFChessGame.dragObj) //simulate piece drag
   {
      if (e)
      {
         current_IVFChessGame.dragObj.style.left = (e.clientX-current_IVFChessGame.dragX) + "px";
         current_IVFChessGame.dragObj.style.top  = (e.clientY-current_IVFChessGame.dragY) + "px";
      }
      else if (window.event) //probably IE
      {
         current_IVFChessGame.dragObj.style.left = (event.clientX-current_IVFChessGame.dragX) + "px";
         current_IVFChessGame.dragObj.style.top  = (event.clientY-current_IVFChessGame.dragY) + "px";
      }
   }
   return false;
}

//TODO: to review and remove completely MouseUp(e)
//      drag&drop have better HTML5 implemetations, no need for simulations anymore
//compute coords and call BoardClick or SetupPieceClick
//cell number: BoardClicked is not updated here
function MouseUp(e)
{
   var ii, jj, ddx = 0, ddy = 0, ww = 32;
   if (!current_IVFChessGame.isDragDrop)        return;
   if (current_IVFChessGame.BoardClicked < 0)   return;
   if (current_IVFChessGame.dragObj)
   {
      ww=current_IVFChessGame.dragObj.width;
      if (current_IVFChessGame.dragBorder) ww += 2 * parseInt(current_IVFChessGame.dragBorder);
   }
   if ((isNaN(ww)) || (ww==0)) ww = 32;
   if (e)
   {
      ddx = e.clientX - current_IVFChessGame.dragX;
      ddy = e.clientY - current_IVFChessGame.dragY;
   }
   else if (window.event)
   {
     ddx = event.clientX - current_IVFChessGame.dragX;
     ddy = event.clientY - current_IVFChessGame.dragY;
   }  
   else return;
   if (current_IVFChessGame.BoardClicked < 64)
   {
      if (current_IVFChessGame.isRotated)
      {
         ii =     ( 63 - current_IVFChessGame.BoardClicked )      % 8;
         jj = 7 - ( 63 - current_IVFChessGame.BoardClicked - ii ) / 8;
      }
      else
      {
         ii =       current_IVFChessGame.BoardClicked       % 8;
         jj = 7 - ( current_IVFChessGame.BoardClicked - ii) / 8;
      }
   }
   else 
   {
      ii = 9 +             current_IVFChessGame.BoardClicked       % 2 ;
      jj = 7 - Math.floor((current_IVFChessGame.BoardClicked - 64) / 2);
   }
   //Target i, j squares calculating
   ii += Math.round (ddx / ww); 
   jj -= Math.round (ddy / ww);
   if       ( ( ii >= 0) && (ii < 8) && (jj >= 0) && (jj  < 8)             )     BoardClick ( 8 * ( 7 - jj ) + ii, true);
   else if  ( (current_IVFChessGame.isSetupBoard) && (ii == 9) && (jj == 0))     SetupPieceClick(12, true);
   else                                                                          BoardClick(current_IVFChessGame.BoardClicked, true);

   // drag icon simulator
   if (current_IVFChessGame.dragObj)
   {
      current_IVFChessGame.dragObj.style.left = "0px";
      current_IVFChessGame.dragObj.style.top  = "0px";
      current_IVFChessGame.dragObj.style.zIndex = 1;
      if (current_IVFChessGame.dragBorder) current_IVFChessGame.dragObj.style.borderWidth = current_IVFChessGame.dragBorder;
      current_IVFChessGame.dragObj = null;
   } 
}

//TODO: what is this for?
function AnimateBoard(nn)
{ var pp=0, mm=parseInt(current_IVFChessGame.Delay)/100;
  current_IVFChessGame.isAnimating=true;
  if (current_IVFChessGame.dragPiece[4]>=0) mm*=0.75;
  mm=Math.floor(mm);
  if (mm>10) mm=10;
  if (nn>mm) pp=4;
  if (nn%mm==1)
  { if (current_IVFChessGame.isRotated) current_IVFChessGame.dragImg[pp%3]=current_IVFChessGame.xdocument.images[63-current_IVFChessGame.dragPiece[pp+2]-(7-current_IVFChessGame.dragPiece[pp+3])*8+current_IVFChessGame.ImageOffset];
    else current_IVFChessGame.dragImg[pp%3]=current_IVFChessGame.xdocument.images[current_IVFChessGame.dragPiece[pp+2]+(7-current_IVFChessGame.dragPiece[pp+3])*8+current_IVFChessGame.ImageOffset];
    current_IVFChessGame.dragPiece[pp+2]=current_IVFChessGame.dragImg[pp%3].offsetLeft;
    current_IVFChessGame.dragPiece[pp+3]=current_IVFChessGame.dragImg[pp%3].offsetTop;
    if (current_IVFChessGame.isRotated) current_IVFChessGame.dragImg[pp%3]=current_IVFChessGame.xdocument.images[63-current_IVFChessGame.dragPiece[pp+0]-(7-current_IVFChessGame.dragPiece[pp+1])*8+current_IVFChessGame.ImageOffset];
    else current_IVFChessGame.dragImg[pp%3]=current_IVFChessGame.xdocument.images[current_IVFChessGame.dragPiece[pp+0]+(7-current_IVFChessGame.dragPiece[pp+1])*8+current_IVFChessGame.ImageOffset];
    current_IVFChessGame.dragPiece[pp+0]=current_IVFChessGame.dragImg[pp%3].offsetLeft;
    current_IVFChessGame.dragPiece[pp+1]=current_IVFChessGame.dragImg[pp%3].offsetTop;
  }
  if (nn%mm!=0)
  { if (nn%mm==1)
    { current_IVFChessGame.dragImg[pp%3].style.zIndex=200+pp;
      current_IVFChessGame.dragImgBorder=parseInt(current_IVFChessGame.dragImg[pp%3].style.borderWidth);
      if (current_IVFChessGame.dragImgBorder) current_IVFChessGame.dragImg[pp%3].style.borderWidth="0px";
      else current_IVFChessGame.dragImgBorder=0;
    }
    current_IVFChessGame.dragImg[pp%3].style.left=(Math.round((nn%mm)*(current_IVFChessGame.dragPiece[pp+2]-current_IVFChessGame.dragPiece[pp+0])/(mm-1))+current_IVFChessGame.dragImgBorder)+"px";
    current_IVFChessGame.dragImg[pp%3].style.top=(Math.round((nn%mm)*(current_IVFChessGame.dragPiece[pp+3]-current_IVFChessGame.dragPiece[pp+1])/(mm-1))+current_IVFChessGame.dragImgBorder)+"px";
    if ((current_IVFChessGame.dragPiece[4]>=0)&&(mm-1==nn)) setTimeoutStub("AnimateBoard("+(mm+1)+")",50);
    else setTimeoutStub("AnimateBoard("+(nn+1)+")",50);
    return;
  }
  RefreshBoard();
  for (mm=0; mm<=pp; mm+=4)
  { current_IVFChessGame.dragImg[mm%3].style.left = 0;
    current_IVFChessGame.dragImg[mm%3].style.top  = 0;
    current_IVFChessGame.dragImg[mm%3].style.zIndex=1;
    if (current_IVFChessGame.dragImgBorder) current_IVFChessGame.dragImg[mm%3].style.borderWidth=current_IVFChessGame.dragImgBorder+"px";
    current_IVFChessGame.dragImg[mm%3]=null;
    current_IVFChessGame.dragPiece[mm+0]=-1;
  }
  current_IVFChessGame.isAnimating=false;
}

//TODO: what is this for?
function IsComplete()
{ return(current_IVFChessGame.isInit);
}