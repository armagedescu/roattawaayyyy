// LT-PGN-VIEWER 3.48 (c) Lutz Tautenhahn (2001-2008)

//TODO: correct document.BoardForm.FEN to xdocument.BoardForm.FEN
//TODO: make xdocument_gen a variable
class xdocument_gen
{

   constructor ()
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

}

class IVFChessGame
{
//{events
    btnFlipBoardListener   () {try { this.flipBoard();       } catch (err)  { console.log (err); } } //TODO: move Move* functions to class member
    btnInitListener        () {try { this.Init('');          } catch (err)  { console.log (err); } }
    btnMoveBackListener    () {try { this.MoveBack(1);       } catch (err)  { console.log (err); } }
    btnMoveForwardListener () {try { this.MoveForward(1);    } catch (err)  { console.log (err); } }
    btnMoveLastListener    () {try { this.MoveForward(1000); } catch (err)  { console.log (err); } }
    btnGetFENListener      () {try { this.GetFEN();          } catch (err)  { console.log (err); } }
    btnShowFENListListener () {try { this.ShowFENList();     } catch (err)  { console.log (err); } }
    btnPlayListener        () {try { this.SwitchAutoPlay();  } catch (err)  { console.log (err); } }
//}end events

    //TODO: get rid of this
	constructor (imgPath, chessContent, listenerUpdater, chessBoard)
	{


       this.xdocument = new xdocument_gen();  //document stub/simulator TODO: to remove
	   this.ChessPiece = //static
          {
             Pos:
             {
                X: { _A:0, _B:1, _C:2, _D:3, _E:4, _F:5, _G:6, _H:7 },
                Y: { _1:0, _2:1, _3:2, _4:3, _5:4, _6:5, _7:6, _8:7 }
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
             Color: { White : 0, Black : 1 }
          };

       //public:
       this.inverse = 0;
       this.board =
	      {
                 gameTBodyElement:  null,
                 IMGNumersElement:  null,
                 IMGLettersElement: null,
                 IMGFlipElement:    null
	      };
       this.ImgResourcePath = imgPath;
       this.chess_board = chessBoard; //TODO: not used

       //private:
	   this.contentSelectedText = chessContent; //readonly
       this.ScriptPath       = "http://www.lutanho.net/pgn/";
       const MaxMove          = 500;
       //var isInit           = false;
       this.isCalculating    = false;
       this.StartMove        = null;
       this.MoveCount        = null;
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
       this.dragImg   = new Array(2); //TODO: to json
       this.dragPiece = new Array(8); //TODO: to json
       this.isDragDrop       = false;
       this.isAnimating      = false;
       this.isExecCommand    = true;
       this.BoardPic         = null;
       this.ParseType        = 1;
       this.AnnotationFile   = "";
       this.ImagePathOld     = "-";
       this.ImageOffset      = 0;
       this.IsLabelVisible   = true;
       this.Border           = 1;
       this.BorderColor      = "#404040";
       this.ScoreSheet       = 0;
       this.BGColor          = "";
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
       this.StandardFen      = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
       this.ColorName = ["w", "b", "t"];
       this.HalfMove = new Array(MaxMove + 1);

       this.ShowPieceName    = "KQRBNP";

       this.FenString        = 'standard';
////   ///////////////////////////////////////////
       this.OldCommands = new Array();
       this.NewCommands = new Array();

       this.ShortPgnMoveText = [new Array(), new Array(), new Array()]; //TODO: to json

       this.Piece = [new Array(16), new Array(16)];
       this.PieceCode  = [this.PieceName.charCodeAt(0), this.PieceName.charCodeAt(1), this.PieceName.charCodeAt(2),
                          this.PieceName.charCodeAt(3), this.PieceName.charCodeAt(4), this.PieceName.charCodeAt(5)];
       this.PiecePic   = [new Array(6), new Array(6)];

       this.Castling  = [new Array(2), new Array(2)];
       this.Board     = [new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8)];

       this.EnPass = new Array(MaxMove + 1);

       this.HistMove = new Array(MaxMove);
       this.HistCommand = new Array(MaxMove+1);
       this.HistPiece = [new Array(MaxMove), new Array(MaxMove)];
       this.HistType  = [new Array(MaxMove), new Array(MaxMove)];
       this.HistPosX  = [new Array(MaxMove), new Array(MaxMove)];
       this.HistPosY  = [new Array(MaxMove), new Array(MaxMove)];

       this.MoveArray = new Array();

       this.LabelPic   = new Array(5);
       this.Annotation = new Array();
       this.DocImg     = new Array();



////   ///////////////////////////////////////////
       this.timeProcessor = new timerWrapper(this);

       this.dragPiece[0] = -1;
       this.dragPiece[4] = -1;

       this.ShortPgnMoveText[0][this.CurVar] = "";

       for (let i = 0; i < 2; i++)
          for (let j = 0; j < 16; j++)
             this.Piece[i][j] = {Type:null,Pos:{X:null,Y:null},Moves:null};

       this.boardWriter (() => {listenerUpdater(this);});
       this.startParsingDetect_FEN_PGN (); //TODO: too many initialization functions
	}

    SetImagePath  (imgPath)//public
    {
       try
       {
          this.ImgResourcePath = imgPath;
          console.log("SetImagePath(imgPath = " + imgPath + ")() this.ImgResourcePath{" + this.ImgResourcePath + "}*****************");
       }catch(err)
       {}
    }

    InitImages ()
    {
       try
       {
          if (this.ImagePathOld == this.ImgResourcePath) return;
          let ii, jj;

          this.BoardPic = {src : this.ImgResourcePath + "t.gif"};
          for (ii = 0; ii < 2; ii++)
          {
             this.PiecePic[ii]  =  [{ src : this.ImgResourcePath + this.ColorName[ii] + "k.gif"},
                               { src : this.ImgResourcePath + this.ColorName[ii] + "q.gif"},
                               { src : this.ImgResourcePath + this.ColorName[ii] + "r.gif"},
                               { src : this.ImgResourcePath + this.ColorName[ii] + "b.gif"},
                               { src : this.ImgResourcePath + this.ColorName[ii] + "n.gif"},
                               { src : this.ImgResourcePath + this.ColorName[ii] + "p.gif"}];
          }

          //TODO: is this used?
          this.LabelPic = [{src : this.ImgResourcePath + "8_1.gif"},
                      {src : this.ImgResourcePath + "a_h.gif"},
                      {src : this.ImgResourcePath + "1_8.gif"},
                      {src : this.ImgResourcePath + "h_a.gif"},
                      {src : this.ImgResourcePath + "1x1.gif"}];

          this.ImagePathOld = this.ImgResourcePath;

          for (ii = 0; ii < this.xdocument.images.length; ii++)
          {
             if (this.xdocument.images[ii] == this.xdocument.images["RightLabels"])
             {
                if (ii > 64) this.ImageOffset = ii - 64;
             }
          }
          this.DocImg.length = 0;
       } catch(err)
       {
         throw 'this.InitImages()>> rethrow error: ' +  err + "\n";
       }
    }

    //TODO: this function is never used in current version
    //this.SkipRefreshBoard = function (skipRefresh){ SkipRefresh = skipRefresh; }

    ApplyFEN (ss)
    {
       try
       {
          if (ss && ss.length > 0)
             this.FenString = ss;

          if ((this.xdocument.BoardForm) && (this.xdocument.BoardForm.FEN))
                this.xdocument.BoardForm.FEN.value = this.FenString;
       }catch(err)
       {
          throw 'ApplyFEN(\'' + ss + '\') error' + '\n' + err;
       }
    }


    //currentIVFChessGame.this.PieceName standard "KQRBNP"
    //currentIVFChessGame.this.PieceName standard "012345"
    //PiecePosX: ABCDEFGH
    //           01234567
    //PiecePosY: 01234567
    //ii = 0: white; ii = 1: black;
    //King:0 //Queen:1
    //Rock:2
    //3:Knigh //Bishop:4
    //5:Pawn

    //Pieces, positions and moves

    Init (rr) //this.Init = function (rr)
    {
       try
       {
          let cc, ii, jj, kk, ll, nn, mm, pieceColor;
          //isInit = true;
          if (this.isAutoPlay) this.SetAutoPlay(false);
          if (rr != '')
          {
             this.StandardFen = rr;
             //TODO:
             //this.StandardFen = this.StandardFen.replace(/\|/gm, "/");
             while (this.StandardFen.indexOf("|") > 0) this.StandardFen = this.StandardFen.replace("|","/");
             //this.StandardFen = this.StandardFen(/\|/, "/");
          }
          if (this.FenString == 'standard') this.FenString = this.StandardFen;
          if (   (this.xdocument.BoardForm) && (this.xdocument.BoardForm.FEN)   ) this.xdocument.BoardForm.FEN.value = this.StandardFen;


          {
             // init for standard and nonstandard FEN (ie initial position different from the standard startup one)
             let fullProgressDone = 0;
             let HALF_MOVE_PARSED = 1;
             let FULL_MOVE_PARSED = 2;
             //all the pieces on A1?
             for (pieceColor = this.ChessPiece.Color.White; pieceColor <= this.ChessPiece.Color.Black; pieceColor++)
             {
                for (jj = 0; jj < 16; jj++)
                {
                   this.Piece[pieceColor][jj].Type  =  this.ChessPiece.Type.None;
                   this.Piece[pieceColor][jj].Pos.X =  this.ChessPiece.Pos.X.A;
                   this.Piece[pieceColor][jj].Pos.Y =  this.ChessPiece.Pos.X._1;
                   this.Piece[pieceColor][jj].Moves =  0;
                }
             }
             ii = 0; jj = 7; ll = 0; nn = 1; mm = 1; cc = this.StandardFen.charAt(ll++);
             //let this.StandardFen = this.StandardFen;
             //this.StandardFen = this.StandardFen.replace(/\s+/gi, " "); //multispace to single space
             //this.StandardFen = this.StandardFen.replace(/(^\s*|\s*$)/gi, ""); //trim
             //this.StandardFen = this.StandardFen.replace(/^[\"\s]*/gi, "");
             //this.StandardFen = this.StandardFen.replace(/^[\s\"\']*FEN?\s*:?[\s\"\']*/gi, "");
             //this.StandardFen = this.StandardFen.replace(/[\"\s]$/gi, "");
             //ii = 0; jj = 7; ll = 0; nn = 1; mm = 1; cc = this.StandardFen.charAt(ll++);
             while (cc != " ")
             {
                //todo: is there any slashes?
                if (cc == "/")
                {
                   if (ii != 8) //ii = A..F, 8=reset, must be when encounter the slash character
                      throw "Invalid FEN [1]: char " + ll + " in " + this.StandardFen;
                   ii = 0;
                   jj--;
                }
                if (ii == 8)
                   throw "Invalid FEN [2]: char " + ll + " in " + this.StandardFen;

                if (! isNaN(cc)) //is number of empty squares
                {
                   ii += parseInt(cc);
                   if (  (ii < 0) || (ii > 8)  )
                      throw "Invalid FEN [3]: char " + ll + " in " + this.StandardFen;
                }

                //is white piece?
                //this.PieceName standard "KQRBNP"
                if (cc.charCodeAt(0) == "KQRBNP".charCodeAt(0))//this.PieceName.toUpperCase().charCodeAt(0))
                {
                   if (this.Piece[0][0].Type != -1)
                      throw "Invalid FEN [4]: char " + ll + " in " + this.StandardFen;
                   this.Piece[0][0].Type = 0;
                   this.Piece[0][0].Pos.X = ii;
                   this.Piece[0][0].Pos.Y = jj;
                   ii++;
                }
                //is black piece?
                if (cc.charCodeAt(0) == "kqrbnp".charCodeAt(0)) //this.PieceName.toLowerCase().charCodeAt(0))
                {
                   if (this.Piece[1][0].Type != -1)
                      throw "Invalid FEN [5]: char " + ll + " in " + this.StandardFen;
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
                         throw "Invalid FEN [6]: char " + ll + " in " + this.StandardFen;
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
                         throw "Invalid FEN [7]: char " + ll + " in " + this.StandardFen;
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
             console.log("FEN this.EnPass: " + this.EnPass);

             if (ll == this.FenString.length)
             {
                throw "Invalid FEN [14]: char " + ll + " missing this.EnPass clock";
                //Init('standard');
                //return;
             }
             this.HalfMove[0] = 0;
             cc = this.FenString.charAt(ll++);
             while (cc != " ")
             {
                if (isNaN(cc))
                {
                   throw "Invalid FEN [15]: char " + ll + " invalid this.EnPass clock";
                   //Init('standard');
                   //return;
                }
                this.HalfMove[0] = this.HalfMove[0] * 10 + parseInt(cc);
                if (ll < this.FenString.length)
                    cc = this.FenString.charAt(ll++);
                else cc = " ";
                fullProgressDone |= HALF_MOVE_PARSED;
             }
             console.log("FEN half move No: " + this.HalfMove[0]);
             if (ll == this.FenString.length)
             {
                throw "Invalid FEN [16]: char " + ll + " missing fullmove number";
                //Init('standard');
                //return;
             }
             cc = this.FenString.substring(ll++);
             //cc = cc.replace(/^\s*|\s*$)/gi, "");
             cc = cc.match(/^\s*(\d+)[^\d]*/)[1];
             console.log ("FEN cc is: {" + cc + "}");
             if (isNaN(cc))
             {
                throw "Invalid FEN [17]: char " + ll + " invalid fullmove number;" + this.StandardFen.substring(0, ll);
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
             console.log("FEN start move No: " + this.StartMove);
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
                this.RefreshBoard(); //TODO: what is this for?
                if (this.xdocument.BoardForm.Position)
                {
                   if (this.StartMove % 2 == 0) this.xdocument.BoardForm.Position.value = "white to move";
                   else this.xdocument.BoardForm.Position.value = "black to move";
                }
                this.NewCommands.length = 0;
                this.ExecCommands();
             }
             this.MoveCount = this.StartMove;
             this.MoveType  = this.StartMove % 2;
             this.SetBoardClicked(-1);
             this.RecordCount = 0;
             this.CurVar = 0;
             this.MoveArray.length = 0;
             if (this.TargetDocument) this.HighlightMove("m" + this.MoveCount + "v" + this.CurVar);
             this.UpdateAnnotation(true);
             //if(this.MoveType == 1)
             //{
             //   this.xdocument.game.move[0].black_move = this.xdocument.game.move[0].white_move;
            //    this.xdocument.game.move[0].white_move = 0;
                //console.log("this.StartMove black");
             //}
             //end
          }
          console.log("this.StartMove=" + this.StartMove + ";this.MoveType=" + this.MoveType);
          this.UpdateBoardAndPieceImages();
       }
       catch (err)
       {
          throw 'rethrow init() >>error: ' + err;
       }
    }

    ParseAllPgn   (pgn)
    {
       try
       {
          let i;
          i = 0;
          i++;
          let pgnText;
          if(pgn) pgnText = pgn;

          let  prop, mov;
          pgnText = this.xdocument.BoardForm.PgnMoveText.value;//"[salut la toti] \r\n[norok la toti] salutari\r\n\r\n   ";

          console.log ("ParseAllPgn: before Clean");
          pgnText = pgnText.replace(/[\n\t\r]/gm,     " ");  //replace tabs, newlines and carriage returns
          pgnText = pgnText.replace(/(\{[^\}]*\})/gm, " ");  //remove comments
          pgnText = pgnText.replace(/(^\s*|\s*$)/gm,  "");    //trim
          pgnText = pgnText.replace(/(^[,\.\"\'\s]*|[,\.\"\'\s]*$)/gm,  "");    //trim
          //this.StandardFen = this.StandardFen
          let xfen;
          console.log ("ParseAllPgn: after Clean");
          for(i = 0; i < 2000 && pgnText.match(/.*\[.*/gm);  i++)
          {
             console.log ("ParseAllPgn: parsing tags");
             prop = pgnText.match(/^[^\[]*\[[^\]]*?\]/gm)[0];
             console.log("prop: {" + prop + "}");
             prop = prop.replace(/(^\s*|\s*$)/gm, "");
             this.xdocument.game.prop[i] = prop;
             let reFEN = new RegExp("[^\\[]*" + "\\[FEN\\s+[\"']*\\s*" + "([^\"']*)" + "\\s*[\"']*\\s*]\\s*", "ig");
             let arr = reFEN.exec(prop);
             if(arr != null && arr.length == 2)
             {
                this.StandardFen = arr[1];
             }
             reFEN = null;

             pgnText = pgnText.replace(/^[^\[]*\[[^\]]*?\]/gm, "");//"$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm,        "");
          }
          console.log( "ParseAllPgn: before Init");
          try
          {
             this.Init ('');
          }catch(err)
          {
             //appendLog.call (this, "err: ParseAllPgn() on Init(''):" + err);
             throw "rethrow: ParseAllPgn() from Init(''):" + "\n" + err;
          }

          //appendLog.call (this, "ParseAllPgn: before loop");
          for (i = 0; i < 6000 && pgnText.match(/^\d+\s*\./gm);  i++)
          {
             //appendLog.call (this, "ParseAllPgn: inside loop");
             let movNoCurrent, movNoNext;

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
                //let movTemp = pgnText.match(/^\d*\s*\.[^\.]*\.?/gm)[0];
                let movTemp = "";
                let pgnTemp = pgnText;
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
                this.xdocument.game.move[i].white_move = this.GetMove(mov, 0);
                this.xdocument.game.move[i].black_move = this.GetMove(mov, 1);
             }else
             {
                if(this.MoveType == 1)
                {
                   this.xdocument.game.move[i].white_move = "";
                   this.xdocument.game.move[i].black_move = this.GetMove(mov, 0);
                }else
                {
                   this.xdocument.game.move[i].white_move = this.GetMove(mov, 0);
                   this.xdocument.game.move[i].black_move = this.GetMove(mov, 1);
                }
             }

             //pgnText = pgnText.replace(/^\d+\s*\.[^\d]*/gm, "$`");
             pgnText = pgnText.replace(/(^\s*|\s*$)/gm, "");
             console.log ( "mov: " + mov + "; white: " + this.xdocument.game.move[i].white_move + "; black: " + this.xdocument.game.move[i].black_move);
          }

       }
       catch (err)
       {
          throw "rethrow ParseAllPgn() >> error: \n" + err;
       }
       return;
    }

    //TODO: this function allow drag&drop. Consider investigating
    AllowRecording  (bb)
    {
       if ((document.BoardForm) && (document.BoardForm.Recording))
          document.BoardForm.Recording.checked = bb;
       this.isRecording = bb;
       this.SetBoardClicked (-1);
    }

    startParsingDetect_FEN_PGN ()
    {
        console.log("startParsingDetect_FEN_PGN()");
        let isFen = false;
        try
        {
           this.AllowRecording(true);
           this.ApplyFEN(this.contentSelectedText);
           this.Init ('');
           isFen = true;
        }
        catch (err)
        {
           isFen = false;
           console.log("startParsingDetect_FEN_PGN(): catch is not fen");
        }
        try
        {
           if (!isFen)
           {

              console.log("startParsingDetect_FEN_PGN(): try PGN");
              this.ApplyFEN('standard');
              this.xdocument.BoardForm.PgnMoveText.value = this.contentSelectedText;
              console.log("startParsingDetect_FEN_PGN() start ParseAllPgn('" + this.contentSelectedText + "')");
              this.ParseAllPgn(this.contentSelectedText); //TODO: check passing a copy of this.contentSelectedText
           }
           console.log("after init image path{" + this.ImgResourcePath + "}");
        }
        catch (err)
        {
           throw "rethrow doStartGameGoogleChrome(" + this.contentSelectedText + "): \n" + err;
        }
    }

    //member
    UpdateBoardAndPieceImages () //TODO: to review usefullness of this function
    {
       console.log("UpdateBoardAndPieceImages:");
       try
       {
          //TODO: remove this trash
          let img = null;
          for(let i = 0; i < 64; i++)
          {
             img = document.getElementById("" + i);
             //img actually is a reference to real <img> element
             img.style.bordercolor = this.xdocument.images[i].style.borderColor;
             img.src = this.xdocument.images[i].src;
          }
          document.getElementById("Position").value = this.xdocument.BoardForm.Position.value;//TODO: by ID?

          let numbers_image = this.ImgResourcePath + "8_1.gif";
          let letters_image = this.ImgResourcePath + "a_h.gif";
          let flip_image    = this.ImgResourcePath + "flw.gif"; //TODO: to make black/white side flip image

          if ( this.inverse )
          {
             numbers_image = this.ImgResourcePath   + "1_8.gif";
             letters_image = this.ImgResourcePath   + "h_a.gif";
             flip_image    = this.ImgResourcePath   + "flb.gif"; //TODO: to make black/white side flip image
          }

          this.board.IMGLettersElement.src = letters_image;
          this.board.IMGNumersElement.src  = numbers_image;
          this.board.IMGFlipElement.src    =    flip_image;
       }catch(e)
       {
           throw "\nrethrow: UpdateBoardAndPieceImages()" + e;
       }
    }

    //member
    SetDelay      (vv)  { this.Delay      = vv; }    //TODO: change play speed. What is it from?
    AllowNullMove (bb)  { isNullMove = bb; }

    SwitchAutoPlay () { if (this.isAutoPlay) this.SetAutoPlay(false); else this.SetAutoPlay(true); }

    SetAutoPlay (bb) //try private
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

    SetImg (ii, oo)
    {
       if (this.DocImg[ii] == oo.src) return;
       this.DocImg[ii] = oo.src;
       //if (ii<64)
       if (isNaN(ii)) this.xdocument.images[ii].src = oo.src;
       else this.xdocument.images[ii + this.ImageOffset].src = oo.src;
    }


    //TODO: to review this function
    // missusing of functionality meant to be event handler
    // this.BoardClicked < 0 means no first cell to move from
    BoardClick (nn, bb)
    {//style
     //nn = 0..63

       try
       {
          let ii0, jj0, ii1, jj1, mm, nnn, vv, ffull, ssearch, llst, ttmp, mmove0;
          let pp, ffst = 0, ssub;

          if (this.isSetupBoard) { this.SetupBoardClick(nn); return; }

          if (!this.isRecording) return;
          //if (this.isAutoPlay)
          this.SetAutoPlay(false);//TODO: to remove if, let just SetAutoPlay
          if (this.MoveCount == MaxMove) return;
          if (this.BoardClickMove (nn)) return;
          if (this.isDragDrop && (!bb)) return; //TODO: don't allow first click while drag & drop?

          //TODO: no need to check, there are only IDs now, no more indexes
          /*if (isRotated) nnn = 63 - nn;
          else */ nnn = nn;

          if (this.BoardClicked == nnn) { this.SetBoardClicked(-1); return; } //same pozition, reset and do nothing

          if (this.BoardClicked < 0) //click from
          {
             ii0 = nnn % 8;
             jj0 = 7 - (nnn - ii0) / 8;
             if (Math.sign(this.Board[ii0][jj0]) == 0) return;
             if (Math.sign(this.Board[ii0][jj0]) != ((this.MoveCount + 1) % 2) * 2 - 1)
             {
                mm="---";
                if ((this.xdocument.BoardForm)&&(this.xdocument.BoardForm.PgnMoveText))
                   this.ShortPgnMoveText[0][this.CurVar]=Uncomment(this.xdocument.BoardForm.PgnMoveText.value);
                ssearch=Math.floor(this.MoveCount/2+1)+".";
                ffst=this.ShortPgnMoveText[0][this.CurVar].indexOf(ssearch);
                if (ffst>=0)
                   ssub=this.ShortPgnMoveText[0][this.CurVar].substring(0, ffst);
                else
                   ssub=this.ShortPgnMoveText[0][this.CurVar];
                if (this.ParseMove(mm, false)==0) { this.SetBoardClicked(-1); return; } //TODO: throws error
                if (!isNullMove) return;
                if (this.MoveCount%2==0) { if (!confirm("White nullmove?")) return; }
                else { if (!confirm("Black nullmove?")) return; }
                for (vv=this.CurVar; vv<this.ShortPgnMoveText[0].length; vv++)
                {
                   if ((vv==this.CurVar)||((this.ShortPgnMoveText[1][vv]==this.CurVar)&&(this.ShortPgnMoveText[2][vv]==this.MoveCount)))
                   {
                      ffull=Uncomment(this.ShortPgnMoveText[0][vv]);
                      ssearch=Math.floor(this.MoveCount/2+2)+".";
                      llst=ffull.indexOf(ssearch);
                      ssearch=Math.floor(this.MoveCount/2+1)+".";
                      ffst=ffull.indexOf(ssearch);
                      if (ffst>=0)
                      {
                         ffst+=ssearch.length;
                         if (llst<0) ttmp=ffull.substring(ffst);
                         else ttmp=ffull.substring(ffst, llst);
                         mmove0=this.GetMove(ttmp,this.MoveType);
                         if ((mmove0.indexOf(mm)<0)&&(this.MoveType==1))
                         {
                            ttmp=Math.floor(this.MoveCount/2+1);
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
                            this.SetMove(this.MoveCount+1, vv);
                            vv=this.ShortPgnMoveText[0].length+1;
                            if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",this.Delay/2, this);
                         }
                      }
                   }
                }
                if (vv<this.ShortPgnMoveText[0].length+1)
                {
                   if ((this.RecordCount==0)&&(!((this.xdocument.BoardForm)&&(this.xdocument.BoardForm.PgnMoveText))))
                   {
                      vv=this.ShortPgnMoveText[0].length;
                      this.ShortPgnMoveText[0][vv]="";
                      this.ShortPgnMoveText[1][vv]=this.CurVar;
                      this.ShortPgnMoveText[2][vv]=this.MoveCount;
                      this.CurVar=vv;
                   }
                   this.ParseMove(mm,true);
                   if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",this.Delay/2, this);
                   if (this.MoveType==0)
                   {
                      this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+"."+mm;
                      ssub+=Math.floor((this.MoveCount+2)/2)+".";
                   }
                   else
                   {
                      this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+". ... "+mm;
                      if (this.MoveCount==this.StartMove) ssub+=Math.floor((this.MoveCount+2)/2)+". ... ";
                      else ssub+=this.HistMove[this.MoveCount-this.StartMove-1]+" ";
                   }
                   if (this.RecordCount==0) RecordedMoves=this.HistMove[this.MoveCount-this.StartMove];
                   else
                   {
                      ttmp=RecordedMoves.split(" ");
                      ttmp.length=this.RecordCount+((this.MoveCount-this.RecordCount)%2)*2;
                      RecordedMoves=ttmp.join(" ");
                      if (this.MoveType==0) RecordedMoves+=" "+this.HistMove[this.MoveCount-this.StartMove];
                      else RecordedMoves+=" "+mm;
                   }
                   this.RecordCount++;
                   this.MoveCount++;
                   this.MoveType=1-this.MoveType;
                   if (this.xdocument.BoardForm)
                   {
                      if (this.xdocument.BoardForm.PgnMoveText) this.xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
                      if (this.xdocument.BoardForm.Position)
                         this.xdocument.BoardForm.Position.value=this.TransformSAN(this.HistMove[this.MoveCount-this.StartMove-1]);
                      this.NewCommands.length=0;
                      this.ExecCommands();
                      this.RefreshBoard(); //TODO: what this does?
                   }
                }
             }
             this.SetBoardClicked(nnn);
             return;
          } // this.BoardClicked < 0 => click from
          ii0=this.BoardClicked%8;
          jj0=7-(this.BoardClicked-ii0)/8;
          ii1=nnn%8;
          jj1=7-(nnn-ii1)/8;
          if (Math.abs(this.Board[ii0][jj0])==6)
          {
             if (ii0!=ii1) mm=String.fromCharCode(ii0+97)+"x";
             else mm="";
          }
          else
          {
             mm=this.PieceName.charAt(Math.abs(this.Board[ii0][jj0])-1);
             if (this.Board[ii1][jj1]!=0) mm+="x";
          }
          this.SetBoardClicked(-1);
          mm+=String.fromCharCode(ii1+97)+(jj1+1);
          if (Math.abs(this.Board[ii0][jj0])==1)
          {
             if (this.Piece[this.MoveType][0].Pos.Y==jj1)
             {
                if (this.Piece[this.MoveType][0].Pos.X+2==ii1) mm="O-O";
                if (this.Piece[this.MoveType][0].Pos.X-2==ii1) mm="O-O-O";
                if (this.Board[ii1][jj1]==(1-2*this.MoveType)*3) //for Chess960
                {
                   if (ii1>ii0) mm="O-O";
                   if (ii1<ii0) mm="O-O-O";
                }
             }
          }
          if ((this.xdocument.BoardForm)&&(this.xdocument.BoardForm.PgnMoveText))
             this.ShortPgnMoveText[0][this.CurVar]=Uncomment(this.xdocument.BoardForm.PgnMoveText.value);
          ssearch=Math.floor(this.MoveCount/2+1)+".";
          ffst=this.ShortPgnMoveText[0][this.CurVar].indexOf(ssearch);
          if (ffst>=0)
             ssub=this.ShortPgnMoveText[0][this.CurVar].substring(0, ffst);
          else
             ssub=this.ShortPgnMoveText[0][this.CurVar];
          if ((jj1==(1-this.MoveType)*7)&&(Math.abs(this.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
          {
             pp=0;
             while(pp==0)
             {
                if (pp==0) { if (confirm("Queen "+this.PieceName.charAt(1)+" ?")) pp=1; }
                if (pp==0) { if (confirm("Rook "+this.PieceName.charAt(2)+" ?")) pp=2; }
                if (pp==0) { if (confirm("Bishop "+this.PieceName.charAt(3)+" ?")) pp=3; }
                if (pp==0) { if (confirm("Knight "+this.PieceName.charAt(4)+" ?")) pp=4; }
             }
             mm=mm+"="+this.PieceName.charAt(pp);
          }
          pp=this.ParseMove(mm, false);
          if (pp==0) return;
          if (Math.abs(this.Board[ii0][jj0])!=1)
          {
             let mmm;
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
          for (vv = this.CurVar; vv<this.ShortPgnMoveText[0].length; vv++)
          {
             if ((vv==this.CurVar)||((this.ShortPgnMoveText[1][vv]==this.CurVar)&&(this.ShortPgnMoveText[2][vv]==this.MoveCount)))
             {
                ffull=Uncomment(this.ShortPgnMoveText[0][vv]);
                ssearch=Math.floor(this.MoveCount/2+2)+".";
                llst=ffull.indexOf(ssearch);
                ssearch=Math.floor(this.MoveCount/2+1)+".";
                ffst=ffull.indexOf(ssearch);
                if (ffst>=0)
                {
                   ffst += ssearch.length;
                   if (llst<0)
                      ttmp=ffull.substring(ffst);
                   else
                      ttmp=ffull.substring(ffst, llst);
                   mmove0=this.GetMove(ttmp,this.MoveType);
                   if ((mmove0.indexOf(mm)<0)&&(this.MoveType==1))
                   {
                      ttmp=Math.floor(this.MoveCount/2+1);
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
                      this.SetMove(this.MoveCount+1, vv);
                      if (window.UserMove) setTimeoutStub("UserMove(1,'"+mmove0+"')",this.Delay/2, this);
                      return;
                   }
                }
             }
          }
          if ((this.RecordCount==0)&&(!((this.xdocument.BoardForm)&&(this.xdocument.BoardForm.PgnMoveText))))
          {
             vv=this.ShortPgnMoveText[0].length;
             this.ShortPgnMoveText[0][vv] = "";
             this.ShortPgnMoveText[1][vv] = this.CurVar;
             this.ShortPgnMoveText[2][vv] = this.MoveCount;
             this.CurVar = vv;
          }
          this.ParseMove(mm, true);
          if (this.IsCheck(this.Piece[1-this.MoveType][0].Pos.X, this.Piece[1-this.MoveType][0].Pos.Y, 1-this.MoveType)) mm+="+";
          if (window.UserMove) setTimeoutStub("UserMove(0,'"+mm+"')",this.Delay/2, this);
          if (this.MoveType==0)
          {
             this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+"."+mm;
             ssub+=Math.floor((this.MoveCount+2)/2)+".";
          }
          else
          {
             this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+". ... "+mm;
             if (this.MoveCount==this.StartMove) ssub+=Math.floor((this.MoveCount+2)/2)+". ... ";
             else ssub+=this.HistMove[this.MoveCount-this.StartMove-1]+" ";
          }
          if (this.RecordCount==0) RecordedMoves=this.HistMove[this.MoveCount-this.StartMove];
          else
          {
             ttmp=RecordedMoves.split(" ");
             ttmp.length=this.RecordCount+((this.MoveCount-this.RecordCount)%2)*2;
             RecordedMoves=ttmp.join(" ");
             if (this.MoveType==0) RecordedMoves+=" "+this.HistMove[this.MoveCount-this.StartMove];
             else RecordedMoves+=" "+mm;
          }
          this.RecordCount++;
          this.MoveCount++;
          this.MoveType=1-this.MoveType;
          if (this.xdocument.BoardForm)
          {
             if (this.xdocument.BoardForm.PgnMoveText) this.xdocument.BoardForm.PgnMoveText.value=ssub+mm+" ";
             if (this.xdocument.BoardForm.Position)
                this.xdocument.BoardForm.Position.value=this.TransformSAN(this.HistMove[this.MoveCount-this.StartMove-1]);
             this.NewCommands.length=0;
             this.ExecCommands();
             this.RefreshBoard(); //TODO: what this does?
          }
       }catch(e)
       {
          //alert("currentIVFChessGame.BoardClick>>error" + e)
          throw("currentIVFChessGame.BoardClick>>rethrow error: \n" + e);
       }
    }

    //TODO: is RefreshBoard used anymore?
    RefreshBoard (rr)
    {
       //alert("try to refresh board");
       if (this.SkipRefresh > 0) return;
       this.InitImages ();
       if (rr) this.DocImg.length = 0;
       let ii, jj, kk, kk0, ll, mm = 1;
       try
       {
          if (this.xdocument.images["RightLabels"])
          {
             if (this.IsLabelVisible)
             {
                /*if (isRotated) this.SetImg("RightLabels",this.LabelPic[2]);
                else*/ this.SetImg("RightLabels",this.LabelPic[0]);
             }
             else this.SetImg("RightLabels",this.LabelPic[4]);
          }
          if (this.xdocument.images["BottomLabels"])
          {
             if (this.IsLabelVisible)
             {
                /*if (isRotated) this.SetImg("BottomLabels",this.LabelPic[3]);
                else*/ this.SetImg("BottomLabels",this.LabelPic[1]);
             }
             else this.SetImg("BottomLabels",this.LabelPic[4]);
          }
       }catch(e)
       {
           alert("RefreshBoard: " + e);
       }
       if (this.isSetupBoard)
       {
          //if (isRotated)
          //{
          //   for (ii=0; ii<8; ii++)
          //   {
          //      for (jj=0; jj<8; jj++)
          //      {
          //         if (this.Board[ii][jj]==0)
          //            this.SetImg(63-ii-(7-jj)*8,this.BoardPic);
          //         else
          //            this.SetImg(63-ii-(7-jj)*8,this.PiecePic[(1-Math.sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
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
                      this.SetImg(ii+(7-jj)*8,this.BoardPic);
                   else
                      this.SetImg(ii+(7-jj)*8,this.PiecePic[(1-Math.sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
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
                   //   this.SetImg(63-ii-(7-jj)*8,this.BoardPic);
                   //else
                      this.SetImg(ii+(7-jj)*8,this.BoardPic);
                }
             }
          }
          for (ii=0; ii<2; ii++)
          {
             for (jj=0; jj<16; jj++)
             {
                if (this.Piece[ii][jj].Type>=0)
                {
                   kk=this.Piece[ii][jj].Pos.X+8*(7-this.Piece[ii][jj].Pos.Y);
                   //if (isRotated)
                   //   this.SetImg(63-kk,this.PiecePic[ii][Piece[ii][jj].Type]);
                   //else
                      this.SetImg(kk,this.PiecePic[ii][this.Piece[ii][jj].Type]);
                }
             }
          }
          if (this.isCapturedPieces)
          {
             let pp0=new Array(0,1,1,2,2,2,8);
             kk0=0;
             if (this.xdocument.images["RightLabels"]) kk0++;
             kk=0;
             ii=0;
             //if (isRotated) ii=1;
             for (jj=0; jj<16; jj++) pp0[this.Piece[ii][jj].Type+1]--;
             for (jj=1; jj<5; jj++)
             {
                for (ll=0; ll<pp0[jj+1]; ll++)
                {
                   this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,this.PiecePic[ii][jj]);
                   kk++;
                   pp0[0]++;
                }
             }
             for (ll=0; ll>pp0[0]; ll--)
             {
                this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,this.PiecePic[ii][5]);
                kk++;
             }
             if (mm<kk) mm=kk;
             while (kk<4) { this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,this.BoardPic); kk++; }
             while (kk<16){ this.SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,this.LabelPic[4]); kk++; }
             let pp1=new Array(0,1,1,2,2,2,8);
             kk=0;
             ii=1-ii;
             for (jj=0; jj<16; jj++) pp1[this.Piece[ii][jj].Type+1]--;
             for (jj=1; jj<5; jj++)
             {
                for (ll=0; ll<pp1[jj+1]; ll++)
                {
                   this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,this.PiecePic[ii][jj]);
                   kk++;
                   pp1[0]++;
                }
             }
             for (ll=0; ll>pp1[0]; ll--)
             {
                this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,this.PiecePic[ii][5]);
                kk++;
             }
             if (mm<kk) mm=kk;
             while (kk<4) { this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,this.BoardPic); kk++; }
             while (kk<16){ this.SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,this.LabelPic[4]); kk++; }
             mm=Math.ceil(mm/4);
             if ((parent)&&(parent.ChangeColWidth)) parent.ChangeColWidth(mm);
          }
       }
       this.UpdateBoardAndPieceImages();
    }

    //rarely used function, not reviewed, replace document with this.xdocument
    MakeGamelink ()
    {
      console.log ( "MakeGamelink()");
      let nn=0, ff, mm="", tt="", pp="", oo, aa="";
      if (!document.BoardForm) return;
      if (document.BoardForm.FEN) ff=document.BoardForm.FEN.value;
      if (ff==this.StandardFen) ff="";
      if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
      if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
      if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
      let ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes");
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
      if (this.isDragDrop) aa+='&SetDragDrop=1';
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

    MakePuzzle ()
    { //get rid of global document

      console.log ( "MakePuzzle()");
      let ii, nn=0, ff, ff_old="", mm="", tt="", pp="", oo, aa="";
      if (!document.BoardForm) return;
      this.isCalculating=true;
      if (document.BoardForm.FEN) ff_old=document.BoardForm.FEN.value;
      ff=this.GetFEN();
      if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
      if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
      if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
      ii=Math.floor(this.MoveCount/2+1)+".";
      nn=mm.indexOf(ii);
      if (nn>=0)
      { mm=mm.substr(nn);
        if (this.MoveCount%2!=0)
        { mm.substr(ii.length);
          while ((mm!="")&&(mm.charAt(0)==" ")) mm=mm.substr(1);
          nn=mm.indexOf(" ");
          if (nn>0) mm=ii+" ..."+mm.substr(nn);
        }
      }
      if (document.BoardForm.FEN) document.BoardForm.FEN.value=ff_old;
      this.isCalculating=false;
      let ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes");
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
      if (this.isDragDrop) aa+='&SetDragDrop=1';
      //if (isRotated) aa+='&RotateBoard=1';
      if (tt!="") tt='&AddText='+tt;
      ww.document.writeln('<a href="'+nn+aa+tt+'"');
      while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
      while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
      ww.document.writeln('>'+nn+aa+tt+'</a>');
      if (this.MoveCount>2)
      { ff=ff_old[0]+" "+ff_old[1]+" "+ff_old[2]+" "+ff_old[3]+" 0 1";
        ii=Math.floor(this.MoveCount/2+1);
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

    ////TODO: this function is not actually being used
    //this.ParsePgn = function (nn,gg,ffile)
    //{
    //  console.log ( "ParsePgn()");
    //  if ((nn>0)&&(nn<5)) ParseType = parseInt(nn);
    //  let ii, jj, ll=0, ss, tt, uu="";
    //  if (ffile) ss=" "+ffile;
    //  else
    //  { if (! parent.frames[1].document.documentElement)
    //    { if (nn>-50) setTimeoutStub("ParsePgn("+(nn-5)+",'"+gg+"')",400, this);
    //      return;
    //    }
    //    ss=parent.frames[1].document.documentElement.innerHTML;
    //    if (ss!="") ll=ss.length;
    //    if (ll!=nn)
    //    { setTimeoutStub("ParsePgn("+ll+",'"+gg+"')",400, this);
    //      return;
    //    }
    //    if (ll==0) return;
    //    ss=ss.replace(/\<html\>/i,'');
    //    ss=ss.replace(/\<\/html\>/i,'');
    //    ss=ss.replace(/\<head\>/i,'');
    //    ss=ss.replace(/\<\/head\>/i,'');
    //    ss=ss.replace(/\<body\>/i,'');
    //    ss=ss.replace(/\<\/body\>/i,'');
    //    ss=ss.replace(/\<pre\>/i,'');
    //    ss=ss.replace(/\<\/pre\>/i,'');
    //    ss=ss.replace(/\<xmp\>/i,'');
    //    ss=ss.replace(/\<\/xmp\>/i,'');
    //    ss=ss.replace(/&quot;/g,'"');
    ////  while (ss.indexOf('&quot;')>0) ss=ss.replace('&quot;','"');
    //    ss=ss.replace(/&lt;/g,'<');
    //    ss=ss.replace(/&gt;/g,'>');
    //    ss=" "+ss;
    //  }
    //  ss = ss.split("[");
    //  if (ss.length<2) return;
    //  tt=new Array(ss.length-1);
    //  for (ii=1; ii<ss.length; ii++)
    //    tt[ii-1]=ss[ii].split("]");
    //  let bblack=new Array();
    //  let wwhite=new Array();
    //  let rresult=new Array();
    //  let ppgnText=new Array();
    //  let ggameText=new Array();
    //  let ffenText=new Array();
    //  let ssanText=new Array();
    //  let kk, ff, sstype=new Array();
    //  jj=0;
    //  ffenText[jj]="";
    //  ssanText[jj]="";
    //  ggameText[jj]="";
    //  for (ii=0; ii<tt.length; ii++)
    //  { kk=tt[ii][0].split(" ")[0];
    //    sstype[kk]=kk;
    //    if (tt[ii][0].substr(0,6)=="Black ")
    //      bblack[jj]=tt[ii][0].substr(6,tt[ii][0].length);
    //    if (tt[ii][0].substr(0,6)=="White ")
    //      wwhite[jj]=tt[ii][0].substr(6,tt[ii][0].length);
    //    if (tt[ii][0].substr(0,7)=="Result ")
    //      rresult[jj]=tt[ii][0].substr(7,tt[ii][0].length);
    //    if (tt[ii][0].substr(0,4)=="FEN ")
    //      ffenText[jj]=tt[ii][0].substr(4,tt[ii][0].length);
    //    if (tt[ii][0].substr(0,4)=="SAN ")
    //      ssanText[jj]=tt[ii][0].substr(4,tt[ii][0].length);
    //    ggameText[jj]+="["+tt[ii][0]+"]<br />";
    //    kk=0;
    //    while ((kk<tt[ii][1].length)&&(tt[ii][1].charCodeAt(kk)<49)) kk++;
    //    if (kk<tt[ii][1].length)
    //    { ppgnText[jj]=tt[ii][1].substr(kk,tt[ii][1].length);
    //      kk=0; ff=String.fromCharCode(13);
    //      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+""+ppgnText[jj].substr(kk+1);
    //      kk=0; ff=String.fromCharCode(10)+String.fromCharCode(10);
    //      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" <br /><br /> "+ppgnText[jj].substr(kk+2);
    //      kk=0; ff=String.fromCharCode(10);
    //      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" "+ppgnText[jj].substr(kk+1);
    //      while (ffenText[jj].indexOf('"')>=0) ffenText[jj]=ffenText[jj].replace('"','');
    //      while (ssanText[jj].indexOf('"')>=0) ssanText[jj]=ssanText[jj].replace('"','');
    //      if (ParseType%2==1)
    //      { ppgnText[jj]=escape(ppgnText[jj]);
    //        ffenText[jj]=escape(ffenText[jj]);
    //        ssanText[jj]=escape(ssanText[jj]);
    //        ggameText[jj]=escape(ggameText[jj]);
    //      }
    //      else
    //      { ppgnText[jj]=ppgnText[jj].replace(/\'/g,"\\'");
    //        ggameText[jj]=ggameText[jj].replace(/\'/g,"\\'");
    //      }
    //      jj++;
    //      ffenText[jj]="";
    //      ssanText[jj]="";
    //      ggameText[jj]="";
    //    }
    //  }
    //  if (ParseType%2==1) uu="unescape";
    //  let ssh=ScoreSheet;
    //  if ((document.BoardForm)&&(document.BoardForm.ScoreSheet))
    //    ssh=parseInt(document.BoardForm.ScoreSheet.options[document.BoardForm.ScoreSheet.options.selectedIndex].value);
    //  if ((parent.frames["annotation"])&&(ssh==0)) ssh=1;
    //  let bb=BGColor;
    //  if (bb=="") bb="#E0C8A0";
    //  let dd=parent.frames[1].document;
    //  dd.open();
    //  dd.writeln("<html><head>");
    //  dd.writeln("<style type='text/css'>");
    //  dd.writeln("body { background-color:"+bb+";color:#000000;font-size:10pt;line-height:12pt;font-family:Verdana; }");
    //  if ((ssh)||(ParseType>2))
    //  { dd.writeln("table { border-left:1px solid #808080; border-top:1px solid #808080; }");
    //    dd.writeln("td, th { border-right:1px solid #808080; border-bottom:1px solid #808080; font-size:10pt;line-height:12pt;font-family:Verdana; vertical-align:top}");
    //  }
    //  dd.writeln("a {color:#000000; text-decoration: none}");
    //  dd.writeln("a:hover {color:#FFFFFF; background-color:#808080}");
    //  dd.writeln("</style>");
    //  dd.writeln("<"+"script language='JavaScript'>");
    //  ii= this.ImgResourcePath.replace("/","|");
    //  if ((document.BoardForm)&&(document.BoardForm.ImagePath))
    //    ii=document.BoardForm.ImagePath.options[document.BoardForm.ImagePath.options.selectedIndex].value;
    //  if (ii!="") ii="&SetImagePath="+ii;
    //  if (BGColor!="") ii=ii+"&SetBGColor="+BGColor.substr(1,6);
    //  if ((document.BoardForm)&&(document.BoardForm.Border)&&(document.BoardForm.Border.options.selectedIndex>0))
    //    ii=ii+"&SetBorder=1";
    //  if (parent.frames["annotation"])
    //    dd.writeln("if (! parent.frames[0]) location.href='pgnannotator.html?'+location.href+'&SetAnnotation="+this.AnnotationFile+ii+"';");
    //  else
    //    dd.writeln("if (! parent.frames[0]) location.href='ltpgnviewer.html?'+location.href+'"+ii+"';");
    //  dd.writeln("let PgnMoveText=new Array();");
    //  dd.writeln("let GameText=new Array();");
    //  dd.writeln("let FenText=new Array();");
    //  dd.writeln("let SanText=new Array();");
    //  for (ii=0; ii<jj; ii++)
    //  { dd.writeln("PgnMoveText["+ii+"]='"+ppgnText[ii]+"';");
    //    dd.writeln("GameText["+ii+"]='"+ggameText[ii]+"';");
    //    if (ffenText[ii]!="") dd.writeln("FenText["+ii+"]='"+ffenText[ii]+"';");
    //    if (ssanText[ii]!="") dd.writeln("SanText["+ii+"]='"+ssanText[ii]+"';");
    //  }
    //  dd.writeln("function OpenGame(nn)");
    //  dd.writeln("{ if (parent.frames[0].IsComplete)");
    //  dd.writeln("  { if (parent.frames[0].IsComplete())");
    //  dd.writeln("    { if (nn>=0)");
    //  dd.writeln("      { if (FenText[nn]) parent.frames[0].Init("+uu+"(FenText[nn]));");
    //  dd.writeln("        else parent.frames[0].Init('standard');");
    //  dd.writeln("        if (SanText[nn]) parent.frames[0].ApplySAN("+uu+"(SanText[nn]));");
    //  dd.writeln("        //parent.frames[0].SetPgnMoveText("+uu+"(PgnMoveText[nn])); //variants not possible");
    //  dd.writeln("        parent.frames[0].ApplyPgnMoveText("+uu+"(PgnMoveText[nn]),'#CCCCCC',window.document); //variants possible");
    //  dd.writeln("        //document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+PgnMoveText[nn]; //pgn without html links");
    //  if (ssh)
    //  { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML=parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter(); //pgn with html links");
    //    dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write(parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter()); document.close(); }}//pgn with html links");
    //    if (parent.frames["annotation"])
    //      dd.writeln("        parent.frames[0].UpdateAnnotation(true);");
    //  }
    //  else
    //  { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true); //pgn with html links");
    //    dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write("+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true)); document.close(); }}//pgn with html links");
    //    dd.writeln("        if ((document.forms[0])&&(document.forms[0].GameList)) document.forms[0].GameList.options.selectedIndex=parseInt(nn)+1;");
    //  }
    //  dd.writeln("      }");
    //  if (this.isDragDrop) dd.writeln("      if (parent.frames[0].SetDragDrop) parent.frames[0].SetDragDrop(1);");
    //  dd.writeln("      return;");
    //  dd.writeln("    }");
    //  dd.writeln("  }");
    //  dd.writeln("  setTimeoutStub('OpenGame('+nn+')',400);", this);
    //  dd.writeln("}");
    //  dd.writeln("function SetMove(mm,vv){ if (parent.frames[0].SetMove) parent.frames[0].SetMove(mm,vv); }");
    //  if (jj>1)
    //  { dd.writeln("function SearchGame()");
    //    dd.writeln("{ let tt=document.forms[0].SearchText.value;");
    //    dd.writeln("  let oo=document.forms[0].SearchType;");
    //    dd.writeln("  oo=oo.options[oo.options.selectedIndex].text;");
    //    dd.writeln("  if (tt=='') return(false);");
    //    dd.writeln("  let ll=document.forms[0].GameList;");
    //    dd.writeln("  let ii, jj=ll.selectedIndex-1, kk=ll.options.length-1;");
    //    dd.writeln("  if (oo=='Moves')");
    //    dd.writeln("  { for (ii=1; ii<kk; ii++)");
    //    dd.writeln("    { if (PgnMoveText[(ii+jj)%kk].indexOf(tt)>=0)");
    //    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    //    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    //    dd.writeln("        return(false);");
    //    dd.writeln("      }");
    //    dd.writeln("    }");
    //    dd.writeln("    return(false);");
    //    dd.writeln("  }");
    //    dd.writeln("  tt=tt.toLowerCase();");
    //    dd.writeln("  if (oo=='Player')");
    //    dd.writeln("  { for (ii=1; ii<kk; ii++)");
    //    dd.writeln("    { if (ll.options[(ii+jj)%kk+1].text.toLowerCase().indexOf(tt)>=0)");
    //    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    //    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    //    dd.writeln("        return(false);");
    //    dd.writeln("      }");
    //    dd.writeln("    }");
    //    dd.writeln("    return(false);");
    //    dd.writeln("  }");
    //    dd.writeln("  for (ii=1; ii<kk; ii++)");
    //    dd.writeln("  { let nn, mm=oo.length+3, ss=GameText[(ii+jj)%kk].split('<br />');");
    //    dd.writeln("    for (nn=0; nn<ss.length; nn++)");
    //    dd.writeln("    { if ((ss[nn].indexOf(oo)>0)&&(ss[nn].toLowerCase().indexOf(tt)>=mm))");
    //    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    //    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    //    dd.writeln("        return(false);");
    //    dd.writeln("      }");
    //    dd.writeln("    }");
    //    dd.writeln("  }");
    //    dd.writeln("  return(false);");
    //    dd.writeln("}");
    //    dd.writeln("if (window.event) document.captureEvents(Event.KEYDOWN);");
    //    dd.writeln("document.onkeydown = KeyDown;");
    //    dd.writeln("function KeyDown(e)");
    //    dd.writeln("{ let kk=0;");
    //    dd.writeln("  if (e) kk=e.which;");
    //    dd.writeln("  else if (window.event) kk=event.keyCode;");
    //    dd.writeln("  if ((kk==37)||(kk==52)||(kk==65460)) { if (parent.frames[0].MoveBack) parent.frames[0].MoveBack(1); }");
    //    dd.writeln("  if ((kk==39)||(kk==54)||(kk==65462)) { if (parent.frames[0].MoveForward) parent.frames[0].MoveForward(1); }");
    //    dd.writeln("}");
    //  }
    //  dd.writeln("</"+"script>");
    //  if (jj==1) dd.writeln("</head><body onLoad=\"setTimeoutStub('OpenGame(0)',400)\">");
    //  else
    //  { if (ParseType<3)
    //    { if (parseInt(gg)<jj) dd.writeln("</head><body onLoad=\"setTimeoutStub('OpenGame("+gg+")',400)\">");
    //      else dd.writeln("</head><body>");
    //      dd.writeln("<FORM onSubmit='return SearchGame()'><NOBR><SELECT name='GameList' onChange='OpenGame(this.options[selectedIndex].value)' SIZE=1>");
    //      dd.writeln("<OPTION VALUE=-1>Select a game !");
    //      for (ii=0; ii<jj; ii++)
    //      { if (ii==gg) dd.writeln("<OPTION VALUE="+ii+" selected>"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
    //        else dd.writeln("<OPTION VALUE="+ii+">"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
    //      }
    //      dd.writeln("</SELECT>");
    //      if (jj<24) dd.writeln("<!--");
    //      dd.writeln("<INPUT name='SearchText' size=12><select name='SearchType'><option>Player</option>");
    //      for (kk in sstype) dd.writeln("<option>"+kk+"</option>");
    //      dd.writeln("<option>Moves</option></select><INPUT type='submit' value='search'>");
    //      if (jj<24) dd.writeln("//-->");
    //      dd.writeln("</NOBR></FORM>");
    //    }
    //    else
    //    { dd.writeln("</head><body>");
    //      for (ii=0; ii<jj; ii++)
    //      { wwhite[ii]=wwhite[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
    //        bblack[ii]=bblack[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
    //      }
    //      let ccT, ccL=1, ccN=new Array(), ccI=new Array(), ccC=new Array(), ccS=new Array(), ccO=new Array();
    //      ccI[wwhite[0]]=0;
    //      ccN[0]=wwhite[0];
    //      for (ii=1; ii<jj; ii++)
    //      { for (kk=0; kk<ccL; kk++)
    //        { if (wwhite[ii]==ccN[kk]) kk=ccL+1;
    //        }
    //        if (kk==ccL)
    //        { ccI[wwhite[ii]]=ccL;
    //          ccN[ccL++]=wwhite[ii];
    //        }
    //      }
    //      for (ii=0; ii<jj; ii++)
    //      { for (kk=0; kk<ccL; kk++)
    //        { if (bblack[ii]==ccN[kk]) kk=ccL+1;
    //        }
    //        if (kk==ccL)
    //        { ccI[bblack[ii]]=ccL;
    //          ccN[ccL++]=bblack[ii];
    //        }
    //      }
    //      let ccCT=new Array(ccL);
    //      for (kk=0; kk<ccL; kk++)
    //      { ccC[kk]=0; ccS[kk]=0; ccO[kk]=kk;
    //        ccCT[kk]=new Array(ccL);
    //        for (ii=0; ii<ccL; ii++) ccCT[kk][ii]="&nbsp;";
    //        ccCT[kk][kk]="&nbsp;*";
    //      }
    //      for (ii=0; ii<jj; ii++)
    //      { ccT=rresult[ii].replace(/"/g,'');
    //        if ((ccT.length==3)&&(ccT.indexOf("-")==1))
    //        { ccS[ccI[wwhite[ii]]]+=1.00001*parseInt(ccT.substr(0,1));
    //          ccS[ccI[bblack[ii]]]+=1.00001*parseInt(ccT.substr(2,1));
    //          ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(0,1)+"</a>&nbsp;";
    //          ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(2,1)+"</a>&nbsp;";
    //        }
    //        else
    //        { ccS[ccI[wwhite[ii]]]+=0.5;
    //          ccS[ccI[bblack[ii]]]+=0.5;
    //          ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
    //          ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
    //        }
    //        ccC[ccI[wwhite[ii]]]+=1;
    //        ccC[ccI[bblack[ii]]]+=1;
    //      }
    //      for (ii=0; ii<ccL-1; ii++)
    //      { for (kk=ii; kk<ccL; kk++)
    //        { if (ccS[ccO[ii]]<ccS[ccO[kk]])
    //          { ccT=ccO[ii];
    //            ccO[ii]=ccO[kk];
    //            ccO[kk]=ccT;
    //          }
    //        }
    //      }
    //      dd.writeln("<table border=1 celpadding=0 cellspacing=0 width='100%'><tr><th>Rank</th><th>Name</th>");
    //      for (kk=0; kk<ccL; kk++) dd.writeln("<th>"+(kk+1)+"</th>");
    //      dd.writeln("<th>Score</th></tr>");
    //      for (kk=0; kk<ccL; kk++)
    //      { dd.writeln("<tr><th nowrap>"+(kk+1)+"</th><th nowrap>"+ccN[ccO[kk]]+"</th>");
    //        for (ii=0; ii<ccL; ii++) dd.writeln("<th nowrap>"+ccCT[ccO[kk]][ccO[ii]]+"&nbsp;</th>");
    //        dd.writeln("<th nowrap>"+Math.round(10*ccS[ccO[kk]])/10+"/"+ccC[ccO[kk]]+"</th></tr>");
    //      }
    //      dd.writeln("</table><br>");
    //    }
    //  }
    //  dd.writeln("<div id='GameText'> </div>");
    //  dd.writeln("<layer id='GameTextLayer'> </layer>");
    //  dd.writeln("<!--generated with LT-PGN-VIEWER 3.4--></body></html>");
    //  dd.close();
    //}
    //
    //this.OpenUrl = function (ss) //TODO: unused
    //{
    //   if (ss != "")
    //      parent.frames[1].location.href = ss;
    //   else
    //   {
    //      if (document.BoardForm.Url.value != "")
    //      {
    //         let nn = document.BoardForm.OpenParsePgn.selectedIndex;
    //         if (      (   (nn) || (document.BoardForm.Url.value.indexOf(".htm") > 0)   ) && (!document.layers)       )
    //         {
    //            parent.frames[1].location.href = document.BoardForm.Url.value;
    //            if (nn) setTimeoutStub("ParsePgn(" + nn + ")", 400, this);
    //         }
    //         else parent.frames[1].location.href = "pgnframe.html?" + document.BoardForm.Url.value;
    //      }
    //      else parent.frames[1].location.href = "pgnframe.html";
    //   }
    //}

    GetHTMLMoveText (vvariant, nnoscript, ccommenttype, sscoresheet)
    { let vv=0, tt, ii, uu="", uuu="", cc, bb=0, bbb=0;
      let ss="", sstart=0, nn=MaxMove, ffst=0,llst,ssearch,ssub,ffull,mmove0="",mmove1="", gg="";
      if (sscoresheet) this.Annotation.length=0;
      if (startAnchor!=-1) gg=",'"+startAnchor+"'";
      this.isCalculating=true;
      if (vvariant)
      { vv=vvariant;
        if (! isNaN(this.ShortPgnMoveText[0][vv]))
        { this.SetMove(this.ShortPgnMoveText[0][vv], this.ShortPgnMoveText[1][vv]);
          if (this.MoveCount!=this.ShortPgnMoveText[0][vv]) return("("+this.ShortPgnMoveText[0][vv]+")");
          //this.CurVar=this.ShortPgnMoveText[1][vv];
          if (this.ShortPgnMoveText[0][vv].indexOf(".0")>0) return(this.GetDiagram(1));
          return(this.GetDiagram());
        }
        if (this.ShortPgnMoveText[2][vv]<0) return(this.ShortPgnMoveText[0][vv]);
        this.SetMove(this.ShortPgnMoveText[2][vv], this.ShortPgnMoveText[1][vv]);
        if (this.MoveCount!=this.ShortPgnMoveText[2][vv]) return(this.ShortPgnMoveText[0][vv]);
        this.CurVar=vvariant;
      }
      else this.MoveBack(MaxMove);
      tt=this.ShortPgnMoveText[0][vv];

      ffull=Uncomment(this.ShortPgnMoveText[0][this.CurVar]);
      for (ii=0; (ii<nn)&&(ffst>=0)&&(this.MoveCount<MaxMove); ii++)
      { ssearch=Math.floor(this.MoveCount/2+2)+".";
        llst=ffull.indexOf(ssearch);
        ssearch=Math.floor(this.MoveCount/2+1)+".";
        ffst=ffull.indexOf(ssearch);
        mmove1=""
        if (ffst>=0)
        { ffst+=ssearch.length;
          if (llst<0)
            ssub=ffull.substring(ffst);
          else
            ssub=ffull.substring(ffst, llst);
          mmove0=this.GetMove(ssub,this.MoveType);
          if (mmove0!="")
          { if (this.ParseMove(mmove0, true)>0)
            { mmove1=mmove0;
              if (this.MoveType==0)
                this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+"."+mmove1;
              else
                this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+". ... "+mmove1;
              this.HistCommand[this.MoveCount-this.StartMove+1]=this.NewCommands.join("|");
              this.MoveCount++;
              this.MoveType=1-this.MoveType;
            }
            else
            { if (this.MoveType==1)
              { ssub=Math.floor(this.MoveCount/2+1);
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
                      this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+". ... "+mmove1;
                      this.HistCommand[this.MoveCount-this.StartMove+1]=this.NewCommands.join("|");
                      this.MoveCount++;
                      this.MoveType=1-this.MoveType;
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
            { this.Annotation[this.MoveCount-1]=this.GetComment(tt.substr (0, sstart));
              if (ss=="")
              { if (sscoresheet==2) ss+="<table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'>";
                if (this.MoveCount%2==1) ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+((this.MoveCount+1)/2)+".</th>";
                else ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+(this.MoveCount/2)+".</th><th>&nbsp;</th>";
              }
              else
              { if (this.MoveCount%2==1) ss+="<tr><th>"+((this.MoveCount+1)/2)+".</th>";
              }
              ss+="<th>";
            }
            else ss+=tt.substr(0,sstart);
            if (! nnoscript) ss+="<a href=\"javascript:SetMove{{"+this.MoveCount+","+vv+gg+"}}\" name=\"m"+this.MoveCount+"v"+vv+"\">";
            if (vv==0) ss+="<b>";
            ss+=this.TransformSAN(mmove1);
            if (vv==0) ss+="</b>";
            if (! nnoscript) ss+="</a>";
            tt=tt.substr(sstart+mmove1.length);
            if (sscoresheet)
            { ss+="</th>";
              if (this.MoveCount%2==0) ss+="</tr>";
              if (sscoresheet==2)
              { if (this.MoveCount%80==0) ss+="</table></td></tr></table><table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
                else
                { if (this.MoveCount%40==0) ss+="</table></td><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
                }
              }
            }
          }
          else ffst=-1;
        }
      }
      if (sscoresheet)
      { this.Annotation[this.MoveCount]=this.GetComment(tt);
        if (this.MoveCount%2==1) ss+="<th>&nbsp;</th>";
        ss+="</tr></table>";
        if (sscoresheet==2)
        { if (this.MoveCount%80<40) ss+="</td><td width='50%'>&nbsp;";
          ss+="</td></tr></table>";
        }
      }
      else ss+=tt;

      let ll=ss.length;
      for (ii=0; ii<ll; ii++)
      { cc=ss.substr(ii,1);
        if (cc=="{") bbb++;
        if (cc=="}") bbb--;
        if (((cc==")")||(cc=="]"))&&(bbb==0))
        { bb--;
          if (bb==0)
          { if (bbb==0)
            { if (! isNaN(this.ShortPgnMoveText[0][uuu]))
              { cc=uu.length-1;
                uu=uu.substr(0,cc);
                cc="";
              }
              if (sscoresheet) uu+=this.GetHTMLMoveText(uuu, true);
              else uu+=this.GetHTMLMoveText(uuu, nnoscript);
              this.isCalculating=true;
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
      this.isCalculating=false;
      return(uu);
    }
    MoveBack (nn)
    {
       //alert("MoveBack");
       let ii, jj, cc;
       if (this.BoardClicked >= 0) this.SetBoardClicked(-1);
       for (jj = 0; (jj < nn) && (this.MoveCount > this.StartMove); jj++)
       {
          if (this.RecordCount > 0) this.RecordCount--;
          this.MoveCount--;
          this.MoveType = 1 - this.MoveType;
          cc = this.MoveCount - this.StartMove;
          ii = this.HistPiece[1][cc];
          if ((0 <= ii) && (ii < 16)) //we must do this here because of Chess960 castling
          {
             this.Board[this.Piece[this.MoveType][ii].Pos.X][this.Piece[this.MoveType][ii].Pos.Y] = 0;
             this.Board[this.HistPosX[1][cc]][this.HistPosY[1][cc]] = (this.HistType[1][cc]+1)*(1-2*this.MoveType);
          }
          ii = this.HistPiece[0][cc];
          this.Board[this.Piece[this.MoveType][ii].Pos.X][this.Piece[this.MoveType][ii].Pos.Y] = 0;
          this.Board[this.HistPosX[0][cc]][this.HistPosY[0][cc]] = (this.HistType[0][cc] + 1) * (1 - 2 * this.MoveType);
          this.Piece[this.MoveType][ii].Type = this.HistType[0][cc];
          this.Piece[this.MoveType][ii].Pos.X = this.HistPosX[0][cc];
          this.Piece[this.MoveType][ii].Pos.Y = this.HistPosY[0][cc];
          this.Piece[this.MoveType][ii].Moves--;
          ii=this.HistPiece[1][cc];
          if ((0<=ii)&&(ii<16))
          {
             this.Piece[this.MoveType][ii].Type = this.HistType[1][cc];
             this.Piece[this.MoveType][ii].Pos.X = this.HistPosX[1][cc];
             this.Piece[this.MoveType][ii].Pos.Y = this.HistPosY[1][cc];
             this.Piece[this.MoveType][ii].Moves--;
          }
          ii -= 16;
          if (0 <= ii)
          {
             this.Board[this.HistPosX[1][cc]][this.HistPosY[1][cc]] = (this.HistType[1][cc] + 1) * (2 * this.MoveType - 1);
             this.Piece[1 - this.MoveType][ii].Type = this.HistType[1][cc];
             this.Piece[1 - this.MoveType][ii].Pos.X = this.HistPosX[1][cc];
             this.Piece[1 - this.MoveType][ii].Pos.Y = this.HistPosY[1][cc];
             this.Piece[1 - this.MoveType][ii].Moves--;
          }
          if (this.CurVar != 0)
          {
             if (this.MoveCount == this.ShortPgnMoveText[2][this.CurVar])
             {
                this.CurVar = this.ShortPgnMoveText[1][this.CurVar];
                if ((!this.isCalculating) && (this.xdocument.BoardForm) && (this.xdocument.BoardForm.PgnMoveText))
                   this.xdocument.BoardForm.PgnMoveText.value = this.ShortPgnMoveText[0][this.CurVar];
             }
          }
       }
       if (this.HistCommand[this.MoveCount - this.StartMove]) this.NewCommands = this.HistCommand[this.MoveCount - this.StartMove].split("|");
       if (this.isCalculating) return;
       if ((this.OldCommands.length > 0) || (this.NewCommands.length > 0)) this.ExecCommands();
       if (this.xdocument.BoardForm)
       {
          this.RefreshBoard();
          if (this.xdocument.BoardForm.Position)
          {
             if (this.MoveCount>this.StartMove)
                this.xdocument.BoardForm.Position.value=this.TransformSAN(this.HistMove[this.MoveCount-this.StartMove-1]);
             else
                this.xdocument.BoardForm.Position.value="";
          }
       }
       if (this.TargetDocument) this.HighlightMove("m" + this.MoveCount + "v" + this.CurVar);
       this.UpdateAnnotation(false);
       if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
       if (this.isAutoPlay) this.AutoPlayInterval=setTimeoutStub("MoveBack("+nn+")", this.Delay, this);
       this.UpdateBoardAndPieceImages();
    }

    MoveForward (nMoveNumber, rr)
    {
       console.log("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")");
       try
       {
          let ii, llst, ssub, mmove0 = "", mmove1 = "";//,ssearch,ffst=0,ffull;
          if (rr);
          else
          {
             if ((this.xdocument.BoardForm) && (this.xdocument.BoardForm.PgnMoveText))
                this.ShortPgnMoveText[0][this.CurVar] = this.xdocument.BoardForm.PgnMoveText.value;
             if (this.BoardClicked >= 0) this.SetBoardClicked(-1);
          }
          console.log("MoveForward(nMoveNumber=" + nMoveNumber + ", rr=" + rr + ")this.MoveCount=" + this.MoveCount + ";len=" + this.xdocument.game.move.length);
          if(nMoveNumber > this.xdocument.game.move.length * 2 - (this.MoveCount - this.StartMove)) nMoveNumber  = this.xdocument.game.move.length * 2 - (this.MoveCount - this.StartMove);
          for (ii = 0; (ii < nMoveNumber) && ((this.MoveCount - this.StartMove) < this.xdocument.game.move.length * 2); ii++)
          {
             //ssearch = Math.floor(this.MoveCount / 2 + 2) + ".";
             //let idx  = (this.MoveCount & 0xfffffffe) >> 1 ;
             let idx  = (this.MoveCount + (this.StartMove & 1) - this.StartMove) >> 1;
             console.log("MoveForward(nMoveNumber, rr)this.MoveCount{"+this.MoveCount+"};this.StartMove{" + this.StartMove + "}ii={" + ii + "}idx={"+ idx +"}; nMoveNumber={" + nMoveNumber + "};len=" + this.xdocument.game.move.length);
             //ssearch = (2 + idx) + ".";
             //llst = ffull.indexOf(ssearch);
             //ssearch = Math.floor(this.MoveCount / 2 + 1) + ".";
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
                ssub = this.xdocument.game.move[idx].fullText;
                console.log("GetMove(ssub={" + ssub + "}, this.MoveType = {" + this.MoveType + "})");
                //mmove0 = GetMove(ssub, this.MoveType);
                if(this.MoveType == 0)
                {
                   mmove0 = this.xdocument.game.move[idx].white_move;
                }
                else
                {
                   mmove0 = this.xdocument.game.move[idx].black_move;
                }
                //console.log("mmove0 = {" + mmove0 + "}");
                if (mmove0 != "")
                {
                   if (this.ParseMove(mmove0, true) > 0)
                   {
                      mmove1 = mmove0;
                      if (this.MoveType == 0)
                         this.HistMove[this.MoveCount-this.StartMove] = Math.floor((this.MoveCount+2)/2) + "." + mmove1;
                      else
                         this.HistMove[this.MoveCount - this.StartMove] = Math.floor((this.MoveCount+2)/2) + ". ... " + mmove1;
                      this.HistCommand[this.MoveCount - this.StartMove + 1] = this.NewCommands.join("|");
                      this.MoveCount++;
                      this.MoveType = 1 - this.MoveType;
                   }

                   /**
                   else
                   {
                      if (this.MoveType == 1)
                      {
                         ssub = Math.floor(this.MoveCount / 2 + 1);
                         console.log("else if this.MoveType == 1 (ssub={" + ssub + "}");
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
                            if (llst<0) {ssub=ffull.substring(ffst); console.log("1 if llst lt 0 (ssub={" + ssub + "}");}
                            else {ssub=ffull.substring(ffst, llst); console.log("1 if llst lt 0 : else (ssub={" + ssub + "}");}

                            mmove0=GetMove(ssub,0);
                            if (mmove0!="")
                            {
                               if (this.ParseMove(mmove0, true)>0)
                               {
                                  mmove1=mmove0;
                                  this.HistMove[this.MoveCount-this.StartMove]=Math.floor((this.MoveCount+2)/2)+". ... "+mmove1;
                                  this.HistCommand[this.MoveCount-this.StartMove+1]=this.NewCommands.join("|");
                                  this.MoveCount++;
                                  this.MoveType=1-this.MoveType;
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
          if (this.isCalculating) return;
          if ((this.OldCommands.length > 0) || (this.NewCommands.length > 0)) this.ExecCommands();
          if (this.xdocument.BoardForm)
          {
             if ((this.xdocument.BoardForm.Position) && (mmove1 != ""))
                this.xdocument.BoardForm.Position.value = this.TransformSAN(this.HistMove[this.MoveCount - this.StartMove - 1]);
             if ((mmove1 != "") && (this.isDragDrop) && (nMoveNumber == 1) && (!dragObj) && (this.dragPiece[0] >= 0) && (!rr) && (!this.isAnimating)) this.AnimateBoard(1);
             else this.RefreshBoard();
          }
          if (this.TargetDocument) this.HighlightMove("m" + this.MoveCount + "v" + this.CurVar);
          this.UpdateAnnotation(false);
          if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
          let this_ref = this; //save, because this will change in context of lambda function
          if (this.isAutoPlay) this.AutoPlayInterval = setTimeoutStub(function(){this_ref.MoveForward(nMoveNumber);}, this.Delay, this);
          this.UpdateBoardAndPieceImages();
       }catch(e)
       {
          throw 'rethrow error MoveForward (' + nMoveNumber+ ', ' + rr+ '): ' + e + "\n";

       }
    }
    //private //static
    Uncomment(ss)
    {
       if (! ss) return(ss);
       let ii, jj, llist = ss.split("{"), ll = llist.length, uu = llist[0], tt, kk;
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
    BoardClickMove (nn)
    {
       try
       {
          let ii0, jj0, ii1, jj1, iiv, jjv, nnn=nn, mm, pp=0;
          if (this.BoardClicked>=0) return(false);
          //if (isRotated) nnn=63-nn;
          ii1=nnn%8;
          jj1=7-(nnn-ii1)/8;
          if (Math.sign(this.Board[ii1][jj1])==((this.MoveCount+1)%2)*2-1) return(false);
          for (ii0 = 0; ii0 < 8; ii0++)
          {
             for (jj0 = 0; jj0 < 8; jj0++)
             {
                if (Math.sign(this.Board[ii0][jj0])==((this.MoveCount+1)%2)*2-1)
                {
                   if (Math.abs(this.Board[ii0][jj0])==6)
                   {
                      mm = String.fromCharCode(ii0 + 97) + (jj0 + 1);
                      if (ii0 != ii1) mm += "x";
                   }
                   else
                   {
                      mm = this.PieceName.charAt(Math.abs(this.Board[ii0][jj0])-1)+String.fromCharCode(ii0+97)+(jj0+1);
                      if (this.Board[ii1][jj1]!=0) mm+="x";
                   }
                   mm+=String.fromCharCode(ii1+97)+(jj1+1);
                   if ((jj1==(1-this.MoveType)*7)&&(Math.abs(this.Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
                   {
                      mm=mm+"="+this.PieceName.charAt(1);
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
             this.BoardClick (nn);
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
    GetComment(ss)
    {
       if (! ss) return(ss);
       let ii, jj, llist = ss.split("}"), ll = llist.length, uu = "", tt, kk;
       for (ii=0; ii<ll; ii++)
       {
          tt=llist[ii];
          jj=tt.indexOf("{")+1;
          if (jj>0) uu+=tt.substring(jj);
       }
       return(uu);
    }

    GetFENList(sshort) //member
    { let mmove=this.MoveCount, vvariant=this.CurVar, nn=0;
      let ff, ff_new, ff_old;
      this.isCalculating=true;
      ff=this.GetFEN(sshort);
      ff_new=ff;
      do
      { ff_old=ff_new;
        this.MoveBack(1);
        ff_new=this.GetFEN(sshort);
        if (ff_old!=ff_new) { ff=ff_new+"\n"+ff; nn++ }
      }
      while (ff_old!=ff_new);
      this.isCalculating=false;
      if (vvariant==0)
      { if (nn>0) this.MoveForward(nn); }
      else this.SetMove(mmove, vvariant);
      return(ff);
    } // member

    Is3FoldRepetition() // private member
    { if (this.MoveCount<8) return(false);
      let ss = this.GetFENList ();
      ss = ss.split("\n");
      let ii, jj, kk=0, ll=ss.length-1;
      let tt=new Array(ll+1);
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

    GetFEN (sshort) //public
    {
       let ii, jj, ee, ss = "";
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
                   ss = ss + this.PieceName.toUpperCase().charAt (  this.Board[ii][jj] - 1);
                else
                   ss = ss + this.PieceName.toLowerCase().charAt ( -this.Board[ii][jj] - 1);
             }
          }
          if (ee > 0) ss = ss + "" + ee;
          if (jj > 0) ss = ss + "/";
       }
       if (sshort) return(ss);
       if (this.MoveType==0) ss = ss + " w";
       else ss = ss + " b";
       ee = "";
       if ((this.Castling[0][0] > 0) && (this.Piece[0][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((this.Piece[0][ii].Type == 2) && (this.Piece[0][ii].Pos.X == 7) && (this.Piece[0][ii].Pos.Y == 0))
               ee = ee + this.PieceName.toUpperCase().charAt(0);
          }
       }
       if ((this.Castling[0][1] > 0) && (this.Piece[0][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((this.Piece[0][ii].Type == 2) && (this.Piece[0][ii].Pos.X == 0) && (this.Piece[0][ii].Pos.Y == 0))
                ee = ee + this.PieceName.toUpperCase().charAt(1);
          }
       }
       if ((this.Castling[1][0] > 0) && (this.Piece[1][0].Moves == 0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((this.Piece[1][ii].Type == 2) && (this.Piece[1][ii].Pos.X == 7) && (this.Piece[1][ii].Pos.Y == 7))
                ee = ee + this.PieceName.toLowerCase().charAt(0);
          }
       }
       if ((this.Castling[1][1]>0)&&(this.Piece[1][0].Moves==0))
       {
          for (ii = 0; ii < 16; ii++)
          {
             if ((this.Piece[1][ii].Type == 2) && (this.Piece[1][ii].Pos.X == 0) && (this.Piece[1][ii].Pos.Y == 7))
                ee = ee + this.PieceName.toLowerCase().charAt(1);
          }
       }
       if (ee == "") ss = ss + " -";
       else ss = ss + " " + ee;
       if (this.MoveCount > this.StartMove)
       {
          this.CanPass = -1;
          ii = this.HistPiece[0][this.MoveCount-this.StartMove - 1];
          if ((this.HistType[0][this.MoveCount-this.StartMove - 1] == 5) && (Math.abs(this.HistPosY[0][this.MoveCount - this.StartMove - 1] - this.Piece[1 - this.MoveType][ii].Pos.Y) == 2))
             this.CanPass = this.Piece[1 - this.MoveType][ii].Pos.X;
       }
       else
         this.CanPass = this.EnPass;
       if (this.CanPass >= 0)
       {
          ss = ss + " " + String.fromCharCode(97 + this.CanPass);
          if (this.MoveType == 0) ss = ss + "6";
          else ss = ss + "3";
       }
       else ss = ss + " -";
       ss = ss + " " + this.HalfMove[this.MoveCount - this.StartMove];
       ss = ss + " " + Math.floor((this.MoveCount + 2) / 2);
       if ((this.xdocument.BoardForm) && (this.xdocument.BoardForm.FEN))
         this.xdocument.BoardForm.FEN.value = ss;
       try
       {//TODO: don't surpress this call
          document.getElementById("FEN").value = this.xdocument.BoardForm.FEN.value;//TODO: to centralize
       }catch(err)
       {
          console.log("norethrow/surpress failed to write FEN: " + err); //surpressed
       }
       return(ss);
    }
    IsInsufficientMaterial() //private
    {
      let ss=this.GetFEN(true);
      if (ss.indexOf("Q")>=0) return(false);
      if (ss.indexOf("q")>=0) return(false);
      if (ss.indexOf("R")>=0) return(false);
      if (ss.indexOf("r")>=0) return(false);
      if (ss.indexOf("P")>=0) return(false);
      if (ss.indexOf("p")>=0) return(false);
      let ii_B=false, ii_b=false, ii_N=false, ii_n=false;
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
      let ii, jj, ww=0, bb=0;
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

    IsDraw() //private
    { let ff=this.GetFEN().split(" ");
      if (parseInt(ff[4])>=100) return("Draw by 50 move rule.");
      if (this.Is3FoldRepetition()) return("Draw by 3-fold repetition.");
      if (this.IsInsufficientMaterial()) return("Draw by insufficient material.");
      return(false);
    }

    ShowFENList () //public
    {
      let ww = window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes");
      ww.document.open();
      ww.document.writeln("<html><head></head><body><pre>" + this.GetFENList() + "</pre></body></html>");
      ww.document.close();
    }

    //while(tmp.match(/^(\w+)/g))
    //{
    //idx = (/^(\w+)\.?/g.exec(tmp))[0];
    //  idx = tmp.match(/^(\w+)\.?/)[0];
    GetMove (strMoveText, isBlackMove)
    {
       let ii=0, jj=0, /*mm="",*/ ll=-1, cc, strTheMove = strMoveText;
       let retMove = "";
       //while (strTheMove.indexOf("<br />")>0) strTheMove = strTheMove.replace("<br />","");
       strTheMove = strTheMove.replace(/(^\s*|\s*<br\s*\/>\s*|\s*$)/gmi, "");
       let moveLen = strTheMove.length;
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
          ll = 0; this.NewCommands.length = 0; // there is a problem, this is replaced with window
          while ((ii >= 0) && (jj >= 0) && (ii < jj))
          {
             this.NewCommands[ll++] = retMove.substr(ii + 1, jj - ii - 1);
             retMove = retMove.substr(0, ii) + retMove.substr(jj + 1);
             ii = retMove.indexOf("<");
             jj = retMove.indexOf(">");
          }
       } //*/
       return(retMove);
    }

    ParseMove (mm, sstore)
    {
       let ii, ffrom = "", ccapt = 0, ll, yy1i = -1;
       let ttype0 = -1, xx0 = -1, yy0 = -1, ttype1 = -1, xx1 = -1, yy1 = -1;
       if (this.MoveCount > this.StartMove)
       {
          this.CanPass = -1;
          ii = this.HistPiece[0][this.MoveCount - this.StartMove - 1];
          if (   (this.HistType[0][this.MoveCount - this.StartMove - 1] == 5) && (Math.abs(this.HistPosY[0][this.MoveCount - this.StartMove - 1] - this.Piece[1 - this.MoveType][ii].Pos.Y) == 2)   )
             this.CanPass = this.Piece[1 - this.MoveType][ii].Pos.X;
       }
       else
          this.CanPass = this.EnPass;
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
             if ((mm.indexOf("O-O-O") >= 0) || (mm.indexOf("0-0-0") >= 0))// || (mm.indexOf("O–O–O") >= 0) || (mm.indexOf("0??") >= 0))
             {
                if (this.EvalMove(ttype0, 6, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
                   return(1);
                return(0);
             }
             if ((mm.indexOf("O-O") >= 0) || (mm.indexOf("0-0") >= 0))// || (mm.indexOf("O–O") >= 0) || (mm.indexOf("0?") >= 0))
             {
                if (this.EvalMove(ttype0, 7, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
                   return(1);
                return(0);
             }
             return(0);
          }
          if ((mm.indexOf("---") >= 0))// || (mm.indexOf("––?) >= 0))
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
        { if (ffrom.charCodeAt(0)==this.PieceCode[ii])
            ttype0=ii;
        }
        if (ffrom.charAt(ll-1)=="x") ccapt=1;
        else
        { if ((ffrom.charAt(ll-1)=="-"))ll--;//||(ffrom.charAt(ll-1)=="?)) ll--; //Smith Notation
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
      { if ((ttype0==5)&&(xx1==this.CanPass)&&(yy1==5-3*this.MoveType)) ccapt=1;
      }
      ttype1=ttype0;
      ii=mm.indexOf("=");
      if (ii<0) ii=yy1i;
      if ((ii>0)&&(ii<mm.length-1))
      { if (ttype0==5)
        { ii=mm.charCodeAt(ii+1);
          if (ii==this.PieceCode[1]) ttype1=1;
          if (ii==this.PieceCode[2]) ttype1=2;
          if (ii==this.PieceCode[3]) ttype1=3;
          if (ii==this.PieceCode[4]) ttype1=4;
        }
      }
      if (sstore)
      { for (ii=0; ii<16; ii++)
        { if (this.Piece[this.MoveType][ii].Type==ttype0)
          { if (this.EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, true))
              return(1);
          }
        }
      }
      else
      { ll=0;
        for (ii=0; ii<16; ii++)
        { if (this.Piece[this.MoveType][ii].Type==ttype0)
          { if (this.EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, false))
              ll++;
          }
        }
        return(ll);
      }
      return(0);
    }
    EvalMove (ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore)
    { let ddx, ddy, xx, yy, jj=-1, ttype2=-1, xx2=xx1, yy2=xx1, ttype3=-1, xx3=-1, yy3=-1, ff;
       if (ttype0==6) //O-O-O with Chess960 rules
       { jj=this.CanCastleLong();
         if (jj<0) return(false);
         if (this.StoreMove(0, 0, 2, this.MoveType*7, jj, 2, 3, this.MoveType*7, sstore))
           return(true);
         else return(false);
       }
       if (ttype0==7) //O-O with Chess960 rules
       { jj=this.CanCastleShort();
         if (jj<0) return(false);
         if (this.StoreMove(0, 0, 6, this.MoveType*7, jj, 2, 5, this.MoveType*7, sstore))
           return(true);
         return(false);
       }
       if (ttype0==8) // --- NullMove
       { if (this.StoreMove(0, 0, this.Piece[this.MoveType][0].Pos.X, this.Piece[this.MoveType][0].Pos.Y, -1, -1, -1, -1, sstore))
           return(true);
         return(false);
       }
       if ((this.Piece[this.MoveType][ii].Pos.X==xx1)&&(this.Piece[this.MoveType][ii].Pos.Y==yy1))
         return(false);
       if ((ccapt==0)&&(this.Board[xx1][yy1]!=0))
         return(false);
       if ((ccapt>0)&&(Math.sign(this.Board[xx1][yy1])!=(2*this.MoveType-1)))
       { if ((ttype0!=5)||(this.CanPass!=xx1)||(yy1!=5-3*this.MoveType))
           return(false);
       }
       if ((xx0>=0)&&(xx0!=this.Piece[this.MoveType][ii].Pos.X)) return(false);
       if ((yy0>=0)&&(yy0!=this.Piece[this.MoveType][ii].Pos.Y)) return(false);
       if (ttype0==0)
       { //if ((xx0>=0)||(yy0>=0)) return(false); //because of Smith Notation
         if (Math.abs(this.Piece[this.MoveType][ii].Pos.X-xx1)>1) return(false);
         if (Math.abs(this.Piece[this.MoveType][ii].Pos.Y-yy1)>1) return(false);
       }
       if (ttype0==1)
       { if ((Math.abs(this.Piece[this.MoveType][ii].Pos.X-xx1)!=Math.abs(this.Piece[this.MoveType][ii].Pos.Y-yy1))&&
             ((this.Piece[this.MoveType][ii].Pos.X-xx1)*(this.Piece[this.MoveType][ii].Pos.Y-yy1)!=0))
           return(false);
       }
       if (ttype0==2)
       { if ((this.Piece[this.MoveType][ii].Pos.X-xx1)*(this.Piece[this.MoveType][ii].Pos.Y-yy1)!=0)
           return(false);
       }
       if (ttype0==3)
       { if (Math.abs(this.Piece[this.MoveType][ii].Pos.X-xx1)!=Math.abs(this.Piece[this.MoveType][ii].Pos.Y-yy1))
           return(false);
       }
       if (ttype0==4)
       { if (Math.abs(this.Piece[this.MoveType][ii].Pos.X-xx1)*Math.abs(this.Piece[this.MoveType][ii].Pos.Y-yy1)!=2)
           return(false);
       }
       if ((ttype0==1)||(ttype0==2)||(ttype0==3))
       { ddx=Math.sign(xx1-this.Piece[this.MoveType][ii].Pos.X);
         ddy=Math.sign(yy1-this.Piece[this.MoveType][ii].Pos.Y);
         xx=this.Piece[this.MoveType][ii].Pos.X+ddx;
         yy=this.Piece[this.MoveType][ii].Pos.Y+ddy;
         while ((xx!=xx1)||(yy!=yy1))
         { if (this.Board[xx][yy]!=0) return(false);
           xx+=ddx;
           yy+=ddy;
         }
       }
       if (ttype0==5)
       {
          if (Math.abs(this.Piece[this.MoveType][ii].Pos.X-xx1)!=ccapt) return(false);
          if ((yy1==7*(1-this.MoveType))&&(ttype0==ttype1)) return(false);
          if (ccapt==0)
          {
             if (this.Piece[this.MoveType][ii].Pos.Y-yy1==4*this.MoveType-2)
             {
                if (this.Piece[this.MoveType][ii].Pos.Y!=1+5*this.MoveType) return(false);
                if (this.Board[xx1][yy1+2*this.MoveType-1]!=0) return(false);
             }
             else
             {
                if (this.Piece[this.MoveType][ii].Pos.Y-yy1!=2*this.MoveType-1) return(false);
             }
          }
          else
          {
             if (this.Piece[this.MoveType][ii].Pos.Y-yy1!=2*this.MoveType-1) return(false);
          }
       }
       if (ttype1!=ttype0)
       {
          if (ttype0 != 5) return(false);
          if (ttype1 >= 5) return(false);
          if (yy1 != 7 - 7 * this.MoveType) return(false);
       }
       if ((ttype0<=5)&&(ccapt>0))
       {
          jj=15;
          while ((jj>=0)&&(ttype3<0))
          {
             if ((this.Piece[1-this.MoveType][jj].Type>0)&&
                   (this.Piece[1-this.MoveType][jj].Pos.X==xx1)&&
                   (this.Piece[1-this.MoveType][jj].Pos.Y==yy1))
                ttype3=this.Piece[1-this.MoveType][jj].Type;
             else
               jj--;
          }
          if ((ttype3==-1)&&(ttype0==5)&&(this.CanPass>=0))
          { jj=15;
             while ((jj>=0)&&(ttype3<0))
             {
                if ((this.Piece[1-this.MoveType][jj].Type==5)&&
                      (this.Piece[1-this.MoveType][jj].Pos.X==xx1)&&
                      (this.Piece[1-this.MoveType][jj].Pos.Y==yy1-1+2*this.MoveType))
                   ttype3=this.Piece[1-this.MoveType][jj].Type;
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
    CanCastleLong ()
    { if (this.Castling[this.MoveType][1]==0) return(-1);
      if (this.Piece[this.MoveType][0].Moves>0) return(-1);
      let jj=0;
      while (jj<16)
      { if ((this.Piece[this.MoveType][jj].Pos.X<this.Piece[this.MoveType][0].Pos.X)&&
            (this.Piece[this.MoveType][jj].Pos.Y==this.MoveType*7)&&
            (this.Piece[this.MoveType][jj].Type==2)&&
            (this.Piece[this.MoveType][jj].Moves==0))
          jj+=100;
        else jj++;
      }
      if (jj==16) return(-1);
      jj-=100;
      this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=0;
      this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=0;
      let ff=this.Piece[this.MoveType][jj].Pos.X;
      if (ff>2) ff=2;
      while ((ff<this.Piece[this.MoveType][0].Pos.X)||(ff<=3))
      { if (this.Board[ff][this.MoveType*7]!=0)
        { this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=1-2*this.MoveType;
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=(1-2*this.MoveType)*3;
          return(-1);
        }
        ff++;
      }
      this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=1-2*this.MoveType;
      this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=(1-2*this.MoveType)*3;
      return(jj);
    }

    CanCastleShort ()
    { if (this.Castling[this.MoveType][0]==0) return(-1);
      if (this.Piece[this.MoveType][0].Moves>0) return(-1);
      let jj=0;
      while (jj<16)
      { if ((this.Piece[this.MoveType][jj].Pos.X>this.Piece[this.MoveType][0].Pos.X)&&
            (this.Piece[this.MoveType][jj].Pos.Y==this.MoveType*7)&&
            (this.Piece[this.MoveType][jj].Type==2)&&
            (this.Piece[this.MoveType][jj].Moves==0))
          jj+=100;
        else jj++;
      }
      if (jj==16) return(-1);
      jj-=100;
      this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=0;
      this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=0;
      let ff=this.Piece[this.MoveType][jj].Pos.X;
      if (ff<6) ff=6;
      while ((ff>this.Piece[this.MoveType][0].Pos.X)||(ff>=5))
      { if (this.Board[ff][this.MoveType*7]!=0)
        { this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=1-2*this.MoveType;
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=(1-2*this.MoveType)*3;
          return(-1);
        }
        ff--;
      }
      this.Board[this.Piece[this.MoveType][0].Pos.X][this.MoveType*7]=1-2*this.MoveType;
      this.Board[this.Piece[this.MoveType][jj].Pos.X][this.MoveType*7]=(1-2*this.MoveType)*3;
      return(jj);
    }

    StoreMove (ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore)
    { let iis_check=0, ll, cc=this.MoveCount-this.StartMove, ff=this.Piece[this.MoveType][0].Pos.X, dd=0;
      if ((ttype1==5)||((jj>=0)&&(ttype3<0)))
        this.HalfMove[cc+1]=0;
      else
        this.HalfMove[cc+1]=this.HalfMove[cc]+1;
      this.HistPiece[0][cc] = ii;
      this.HistType[0][cc] = this.Piece[this.MoveType][ii].Type;
      this.HistPosX[0][cc] = this.Piece[this.MoveType][ii].Pos.X;
      this.HistPosY[0][cc] = this.Piece[this.MoveType][ii].Pos.Y;
      if (!this.isAnimating)
      { this.dragPiece[0]=this.Piece[this.MoveType][ii].Pos.X;
        this.dragPiece[1]=this.Piece[this.MoveType][ii].Pos.Y;
        this.dragPiece[2]=xx1;
        this.dragPiece[3]=yy1;
        this.dragPiece[4]=-1;
      }
      if (jj<0)
        this.HistPiece[1][cc] = -1;
      else
      { if (ttype3>=0)
        { this.HistPiece[1][cc] = jj;
          this.HistType[1][cc] = this.Piece[this.MoveType][jj].Type;
          this.HistPosX[1][cc] = this.Piece[this.MoveType][jj].Pos.X;
          this.HistPosY[1][cc] = this.Piece[this.MoveType][jj].Pos.Y;
          if (!this.isAnimating)
          { this.dragPiece[4]=this.Piece[this.MoveType][jj].Pos.X;
            this.dragPiece[5]=this.Piece[this.MoveType][jj].Pos.Y;
            this.dragPiece[6]=xx3;
            this.dragPiece[7]=yy3;
          }
        }
        else
        { this.HistPiece[1][cc] = 16+jj;
          this.HistType[1][cc] = this.Piece[1-this.MoveType][jj].Type;
          this.HistPosX[1][cc] = this.Piece[1-this.MoveType][jj].Pos.X;
          this.HistPosY[1][cc] = this.Piece[1-this.MoveType][jj].Pos.Y;
        }
      }

      this.Board[this.Piece[this.MoveType][ii].Pos.X][this.Piece[this.MoveType][ii].Pos.Y]=0;
      if (jj>=0)
      { if (ttype3<0)
          this.Board[this.Piece[1-this.MoveType][jj].Pos.X][this.Piece[1-this.MoveType][jj].Pos.Y]=0;
        else
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.Piece[this.MoveType][jj].Pos.Y]=0;
      }
      this.Piece[this.MoveType][ii].Type=ttype1;
      if ((this.Piece[this.MoveType][ii].Pos.X!=xx1)||(this.Piece[this.MoveType][ii].Pos.Y!=yy1)||(jj>=0))
      { this.Piece[this.MoveType][ii].Moves++; dd++; } //not a nullmove
      this.Piece[this.MoveType][ii].Pos.X=xx1;
      this.Piece[this.MoveType][ii].Pos.Y=yy1;
      if (jj>=0)
      { if (ttype3<0)
        { this.Piece[1-this.MoveType][jj].Type=ttype3;
          this.Piece[1-this.MoveType][jj].Moves++;
        }
        else
        { this.Piece[this.MoveType][jj].Pos.X=xx3;
          this.Piece[this.MoveType][jj].Pos.Y=yy3;
          this.Piece[this.MoveType][jj].Moves++;
        }
      }
      if (jj>=0)
      { if (ttype3<0)
          this.Board[this.Piece[1-this.MoveType][jj].Pos.X][this.Piece[1-this.MoveType][jj].Pos.Y]=0;
        else
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.Piece[this.MoveType][jj].Pos.Y]=(this.Piece[this.MoveType][jj].Type+1)*(1-2*this.MoveType);
      }
      this.Board[this.Piece[this.MoveType][ii].Pos.X][this.Piece[this.MoveType][ii].Pos.Y]=(this.Piece[this.MoveType][ii].Type+1)*(1-2*this.MoveType);

      if ((ttype1==0)&&(ttype3==2)) //O-O-O, O-O
      { while (ff>xx1)
        { iis_check+=this.IsCheck(ff, this.MoveType*7, this.MoveType);
          ff--;
        }
        while (ff<xx1)
        { iis_check+=this.IsCheck(ff, this.MoveType*7, this.MoveType);
          ff++;
        }
      }
      iis_check+=this.IsCheck(this.Piece[this.MoveType][0].Pos.X, this.Piece[this.MoveType][0].Pos.Y, this.MoveType);

      if ((iis_check==0)&&(sstore))
      { this.MoveArray[cc]=String.fromCharCode(97+this.HistPosX[0][cc])+(this.HistPosY[0][cc]+1)+String.fromCharCode(97+this.Piece[this.MoveType][ii].Pos.X)+(this.Piece[this.MoveType][ii].Pos.Y+1);
        if (this.HistType[0][cc] != this.Piece[this.MoveType][ii].Type)
        { if (this.MoveType==0) this.MoveArray[cc]+=this.PieceName.charAt(this.Piece[this.MoveType][ii].Type);
          else this.MoveArray[cc]+=this.PieceName.charAt(this.Piece[this.MoveType][ii].Type).toLowerCase();
        }
        this.MoveArray.length=cc+1;
        return(true);
      }

      this.Board[this.Piece[this.MoveType][ii].Pos.X][this.Piece[this.MoveType][ii].Pos.Y]=0;
      this.Board[this.HistPosX[0][cc]][this.HistPosY[0][cc]]=(this.HistType[0][cc]+1)*(1-2*this.MoveType);
      this.Piece[this.MoveType][ii].Type=this.HistType[0][cc];
      this.Piece[this.MoveType][ii].Pos.X=this.HistPosX[0][cc];
      this.Piece[this.MoveType][ii].Pos.Y=this.HistPosY[0][cc];
      this.Piece[this.MoveType][ii].Moves-=dd;
      if (jj>=0)
      { if (ttype3>=0)
        { this.Board[this.Piece[this.MoveType][jj].Pos.X][this.Piece[this.MoveType][jj].Pos.Y]=0;
          this.Board[this.HistPosX[0][cc]][this.HistPosY[0][cc]]=(this.HistType[0][cc]+1)*(1-2*this.MoveType);
          this.Board[this.HistPosX[1][cc]][this.HistPosY[1][cc]]=(this.HistType[1][cc]+1)*(1-2*this.MoveType);
          this.Piece[this.MoveType][jj].Type=this.HistType[1][cc];
          this.Piece[this.MoveType][jj].Pos.X=this.HistPosX[1][cc];
          this.Piece[this.MoveType][jj].Pos.Y=this.HistPosY[1][cc];
          this.Piece[this.MoveType][jj].Moves--;
        }
        else
        { this.Board[this.HistPosX[1][cc]][this.HistPosY[1][cc]]=(this.HistType[1][cc]+1)*(2*this.MoveType-1);
          this.Piece[1-this.MoveType][jj].Type=this.HistType[1][cc];
          this.Piece[1-this.MoveType][jj].Pos.X=this.HistPosX[1][cc];
          this.Piece[1-this.MoveType][jj].Pos.Y=this.HistPosY[1][cc];
          this.Piece[1-this.MoveType][jj].Moves--;
        }
      }
      if (iis_check==0) return(true);
      return(false);
    }

    ExecCommand (bb) { this.isExecCommand = bb;}

    flipBoard () //this.flipBoard = function() //to move into chessgame
    {
      //never anymore write the board from scratch
      //by using board*Writer functions
      //don't generate anymore HTML text
      try
      {
         this.inverse ^= 1;

         let chessBoard = this.board.gameTBodyElement;
         let firstChild = chessBoard.firstChild;
         for (let i = 0; i < 7; i++)
         {
            let lastChild  = chessBoard.lastChild;
            chessBoard.insertBefore (lastChild, firstChild);
         }

         for (let i = 0; i < 8; i++)
         {
           let chessTRow = chessBoard.childNodes[i];
             let firstChild = chessTRow.firstChild;
             for (let j = 0; j < 7; j++)
             {
              let lastChild  = chessTRow.lastChild;
                  chessTRow.insertBefore (lastChild, firstChild);
             }
         }
         this.UpdateBoardAndPieceImages();

      }catch(err)
      {
         alert(err);
      }
    }
    boardGameWriter (tableBoardBorderTd)
    {
        try
        {
          let pp = this.ImgResourcePath;

          //standard start game setup
          let ll = [ pp + "br.gif", pp + "bn.gif", pp + "bb.gif", pp + "bq.gif", pp + "bk.gif", pp + "bb.gif", pp + "bn.gif", pp + "br.gif",
                     pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif", pp + "bp.gif",
                     pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                     pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                     pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                     pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif", pp +  "t.gif",
                     pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif", pp + "wp.gif",
                     pp + "wr.gif", pp + "wn.gif", pp + "wb.gif", pp + "wq.gif", pp + "wk.gif", pp + "wb.gif", pp + "wn.gif", pp + "wr.gif"  ];

          let cellId = "";
          let imgIdx = 0;

          let tableElement = document.createElement("table");
          tableElement.border      = 0;
          tableElement.cellPadding = 0;
          tableElement.cellSpacing = 0;
          this.board.gameTBodyElement = document.createElement("tbody");

          let tableTBodyTrElement;
          let tableTBodyTrTdElement;
          let tableTBodyTrTdImgElement;

          let ii  = 0;
          let tri = 0;
          let tdi = 0;

          let bImagePath = pp + "b.gif";
          let wImagePath = pp + "w.gif";

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
                if (this.inverse) imgIdx = 64 - (ii + 1);
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

    //TODO: split boardWriter
    boardWriter (updateBrowserListeners)
    {
        try
        {

           let tableElement = document.createElement("table");
           tableElement.border      = 0;
           tableElement.cellPadding = 0;
           tableElement.cellSpacing = 0;

           let tableTBodyElement = document.createElement("tbody");
           let tableTBodyTrElement = document.createElement("tr");
           let tableTBodyTrTdElement = document.createElement("td");  //1-8 image here

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
           chess_board.appendChild(tableElement);

           this.UpdateBoardAndPieceImages();

           //once listeners are set, no need for reattach/update listeners anymore
           //TODO: probably board_main better place
           updateBrowserListeners ();

        }catch(err)
        {
           console.log('error: boardWriter() ' + err);
        }

    }
    //TODO: notused: RotateBoard is not used anymore, using flipBoard instead
    //let RotateBoard = function(bb)
    //{ this.SetBoardClicked(-1);
    //  let ii, cc=new Array();
    //  for (ii=0; ii<this.OldCommands.length; ii++) cc[ii]=this.OldCommands[ii];
    //  this.NewCommands.length=0;
    //  this.ExecCommands();
    //  isRotated=bb;
    //  if ((document.BoardForm)&&(document.BoardForm.Rotated))
    //    document.BoardForm.Rotated.checked=bb;
    //  this.RefreshBoard();
    //  for (ii=0; ii<cc.length; ii++) this.NewCommands[ii]=cc[ii];
    //  this.ExecCommands();
    //}
    //TODO: this function is not used
    SwitchSetupBoard ()
    { this.SetBoardClicked(-1);
      if (!this.isSetupBoard)
      { this.Init('standard');
        this.isSetupBoard=true;
        if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
          document.BoardForm.SetupBoard.value=" Ready ";
        return;
      }
      this.isSetupBoard=false;
      if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
        document.BoardForm.SetupBoard.value="Setup this.Board";
      let ii, jj, ee, ss="";
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
              ss=ss+this.PieceName.toUpperCase().charAt(this.Board[ii][jj]-1);
            else
              ss=ss+this.PieceName.toLowerCase().charAt(-this.Board[ii][jj]-1);
          }
        }
        if (ee>0) ss=ss+""+ee;
        if (jj>0) ss=ss+"/";
      }
      this.MoveType=-1;
      while (this.MoveType<0)
      { if (this.MoveType<0)
        { if (confirm("White to move?")) this.MoveType=0;
        }
        if (this.MoveType<0)
        { if (confirm("Black to move?")) this.MoveType=1;
        }
      }
      if (this.MoveType==0) ss=ss+" w";
      else ss=ss+" b";
      ss=ss+" KQkq";
      ss=ss+" -";
      ss=ss+" "+this.HalfMove[this.MoveCount-this.StartMove];
      ss=ss+" "+Math.floor((this.MoveCount+2)/2);
      if ((document.BoardForm)&&(document.BoardForm.FEN))
        document.BoardForm.FEN.value=ss;
      this.Init(ss);
    }

    ApplyPgnMoveText (ss, rroot, ddocument, ggame)
    { let vv=0;
      if (! isNaN(rroot))
      { vv=this.ShortPgnMoveText[0].length;
        this.ShortPgnMoveText[0][vv]="";
      }
      else
      { this.ShortPgnMoveText[0].length=1;
        if (ddocument) this.TargetDocument=ddocument;
        else this.TargetDocument=window.document;
        if (rroot) activeAnchorBG=rroot;
        if (ggame) startAnchor=ggame;
        else startAnchor=-1;
      }
      let ii, uu="", uuu="", cc, bb=0, bbb=0, ll=ss.length;
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
        let uuc=Uncomment(uu);
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
        //if (bb<0) bb=this.MoveCount;
        SetPgnMoveText(uu, vv, rroot, bb);
      }
      else SetPgnMoveText(uu);
      return(vv);
    }

    //TODO: make it private
    HighlightCandidates (nn, ccs)
    { if (nn<0) { this.ExecCommands('',1); return; }
      let ii0=nn%8;
      let jj0=7-(nn-ii0)/8;
      let pp=this.Board[ii0][jj0];
      let cc=Math.sign(pp);
      let tt=(1-cc)/2;
      let dd, ddi, ddj, bb, jj, aa=new Array();
      let nna=0, ddA=0;
      if (ccs.charAt(0)=="A") ddA=1;

      if (Math.abs(pp)==6)
      { this.Board[ii0][jj0]=0;
        if (this.IsOnBoard(ii0, jj0+cc))
        { bb=this.Board[ii0][jj0+cc];
          if (bb==0)
          { this.Board[ii0][jj0+cc]=pp;
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
              aa[nna++]=String.fromCharCode(ii0+97)+(jj0+cc+1);
            this.Board[ii0][jj0+cc]=bb;
            if (2*jj0+5*cc==7)
            { bb=this.Board[ii0][jj0+2*cc];
              if (bb==0)
              { this.Board[ii0][jj0+2*cc]=pp;
                if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
              if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
                aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
              this.Board[ii0+ddi][jj0+cc]=bb;
            }
          }
          if (2*jj0-cc==7)
          { if (this.IsOnBoard(ii0+ddi, jj0))
            { if (this.Board[ii0+ddi][jj0]==-cc*6)
                { bb=this.Board[ii0+ddi][jj0+cc];
                if (bb==0)
                { if (this.MoveCount>this.StartMove)
                  { this.CanPass=-1;
                    dd=this.HistPiece[0][this.MoveCount-this.StartMove-1];
                    if ((this.HistType[0][this.MoveCount-this.StartMove-1]==5)&&(Math.abs(this.HistPosY[0][this.MoveCount-this.StartMove-1]-this.Piece[1-this.MoveType][dd].Pos.Y)==2))
                      this.CanPass=this.Piece[1-this.MoveType][dd].Pos.X;
                  }
                  else
                    this.CanPass=this.EnPass;
                  if (this.CanPass==ii0+ddi)
                  { this.Board[ii0+ddi][jj0+cc]=pp;
                    if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
                if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
                if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
            if (!this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, tt))
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
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.Piece[this.MoveType][jj].Pos.Y]=0;
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
          bb+=this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, this.MoveType);
          if (bb==0) aa[nna++]=String.fromCharCode(2+97)+(tt*7+1);
          this.Board[2][tt*7]=0;
          this.Board[3][tt*7]=0;
          this.Board[ii0][jj0]=pp;
          this.Board[this.Piece[tt][jj].Pos.X][this.Piece[tt][jj].Pos.Y]=cc*3;
        }
        jj=this.CanCastleShort();//O-O with Chess960 rules
        if (jj>=0)
        { this.Board[ii0][jj0]=0;
          this.Board[this.Piece[this.MoveType][jj].Pos.X][this.Piece[this.MoveType][jj].Pos.Y]=0;
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
          bb+=this.IsCheck(this.Piece[tt][0].Pos.X, this.Piece[tt][0].Pos.Y, this.MoveType);
          if (bb==0) aa[nna++]=String.fromCharCode(6+97)+(tt*7+1);
          this.Board[6][tt*7]=0;
          this.Board[5][tt*7]=0;
          this.Board[ii0][jj0]=pp;
          this.Board[this.Piece[tt][jj].Pos.X][this.Piece[tt][jj].Pos.Y]=cc*3;
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
        this.ExecCommands(bb,1);
      }
      else return(aa);
    }

    ApplySAN (ss)
    {
       if (ss.length<6)
       {
          this.PieceName = "KQRBNP";
          if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=this.PieceName;
       }
       else
       {
          this.PieceName = ss;
          if ((document.BoardForm)&&(document.BoardForm.SAN)) document.BoardForm.SAN.value=ss;
       }
       for (let ii=0; ii<6; ii++) this.PieceCode[ii]=this.PieceName.charCodeAt(ii);
    }

    ShowSAN (ss)
    {
       this.ShowPieceName = ss;
       if (ss.length != 6) this.ShowPieceName = "";
       if (   (this.ShowPieceName == "") || (this.ShowPieceName == this.PieceName)   ) return;
       if (   (document.BoardForm) && (document.BoardForm.PgnMoveText)   )
       {
          let tt = document.BoardForm.PgnMoveText.value;
          if (tt == "") return;
          let ww = window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes");
          ww.document.open();
          ww.document.writeln("<HTML><HEAD></HEAD><BODY>" + this.TransformSAN(tt) + "</BODY></HTML>");
          ww.document.close();
       }
    }

    TransformSAN (ss)
    {
       if (ss == "") return("");
       if ((this.ShowPieceName == "") || (this.ShowPieceName == this.PieceName)) return(ss);
       let jj, rr, tt = "";
       for (jj = 0; jj < ss.length; jj++)
       {
          rr = this.PieceName.indexOf(ss.charAt(jj));
          if (rr >= 0) tt += this.ShowPieceName.charAt(rr);
          else tt += ss.charAt(jj);
       }
       return(tt);
    }
    //TODO: miss using of function implemented in event handler manner
    SetBoardClicked (nn) //TODO: redundant drag effects and calculations to be removed, make it HTML5 compatible
    {
       try
       {
          if (! this.xdocument.BoardForm) return;
          if (! this.xdocument.images[this.ImageOffset].style) { this.BoardClicked = nn; return; }
          if (this.CandidateStyle != "") this.HighlightCandidates(nn, this.CandidateStyle);
          if (this.isDragDrop) { this.BoardClicked = nn; return; }
          //if (this.BoardClicked >= 0) //really needed styles processing?
          //{
          //   if (this.BoardClicked < 64)
          //   {
          //      if (isRotated)
          //         this.xdocument.images[this.ImageOffset + 63 - this.BoardClicked].style.borderColor = this.BorderColor;
          //      else
          //         this.xdocument.images[this.ImageOffset + this.BoardClicked].style.borderColor = this.BorderColor;
          //   }
          //   else this.xdocument.images[this.ImageOffset + this.BoardClicked + 3].style.borderColor = this.BorderColor;
          //}
          this.BoardClicked = nn;
          //if (this.BoardClicked >= 0)
          //{
          //   if (this.BoardClicked < 64)
          //   {
          //      if (isRotated)
          //         this.xdocument.images[this.ImageOffset + 63 - this.BoardClicked].style.borderColor="#FF0000";
          //      else
          //         this.xdocument.images[this.ImageOffset + this.BoardClicked].style.borderColor = "#FF0000";
          //   }
          //   else this.xdocument.images[this.ImageOffset + this.BoardClicked + 3].style.borderColor = "#FF0000";
          //}

       } catch (err)
       {
          throw "SetBoardClicked (" + nn + ")>>rethrow  error: " + err + "\n";
       }
    }

    //TODO: enable this function
    ShowCapturedPieces  (bb)
    {
      this.isCapturedPieces = bb;
      if (this.isCapturedPieces) this.RefreshBoard();
      else
      {
         let kk, kk0 = 0;
         if (this.xdocument.images["RightLabels"]) kk0++;
         for (kk = 0; kk < 32; kk++) this.SetImg(64 + kk0 + kk,this.LabelPic[4]);
         if ((parent) && (parent.ChangeColWidth)) parent.ChangeColWidth(0);
      }
    }

    //private
    ExecCommands (nnc, hh)
    {
       let ii, jj, kk, nn, mm, cc, tt, bb0, bb1, xx0, yy0, xx1, yy1, aa = "";
       if (!this.isExecCommand)  return;
       if (document.layers) return;
       if (!document.getElementById("this.Board")) return;
       if (nnc)
       {
          this.NewCommands.length = 0;

          if (nnc.indexOf(",") > 0) this.NewCommands = nnc.replace(/ /g, '').split(",");
          else this.NewCommands[0] = nnc.replace(/ /g, '');

          if (hh);
          else this.HistCommand[this.MoveCount - this.StartMove] = this.NewCommands.join("|");
          setTimeoutStub(function(){this.ExecCommands()}, 100, this);

          return;
       }

       let dd = parseInt(document.getElementById("this.Board").offsetHeight);
       let dd32 = Math.round(dd / 32);
       for (ii = 0; ii < this.OldCommands.length; ii++)
       {
          tt = this.OldCommands[ii].charAt(0);
          if ((tt == "B") || (tt == "C"))
          {
             nn = this.OldCommands[ii].charCodeAt(1) - 97 + (8 - parseInt(this.OldCommands[ii].charAt(2))) * 8;
             //if (isRotated) nn = 63 - nn;
             if ((nn >= 0) && (nn <= 63))
             {
                if (tt == "B") this.xdocument.images[this.ImageOffset + nn].style.borderColor = this.BorderColor;
                else this.xdocument.images[this.ImageOffset + nn].style.backgroundColor = "transparent";
             }
          }
          if (tt == "A") document.getElementById("Canvas").innerHTML = "<div style='position:absolute;top:0px;left:0px;width:0px;height:0px;'></div>";
       }
       if (this.NewCommands.length > 0) this.SetAutoPlay(false);
       for (ii = 0; ii < this.NewCommands.length; ii++)
       {
          tt = this.NewCommands[ii].substr(1, 4);
          if ((tt == "this") || (tt == "last"))
          {
             if (tt == "this") { kk = this.MoveCount - this.StartMove - 1; ll = 0; }
             else  { kk = this.MoveCount - this.StartMove - 2; ll = 1; }
             if (kk >= 0)
             {
                tt = this.NewCommands[ii].charAt(0);
                cc = this.NewCommands[ii].substr(5, 6);
                nn = this.NewCommands.length;
                if ((tt == "B") || (tt == "C"))
                {
                   this.NewCommands[nn]     = tt + String.fromCharCode(97 + this.HistPosX[0][kk]) + (1 + this.HistPosY[0][kk]) + cc;
                   this.NewCommands[nn + 1] = tt + String.fromCharCode(97 + this.Piece[(this.MoveType + ll + 1) % 2][this.HistPiece[0].Pos.X[kk]]) + (1 + this.Piece[(this.MoveType + ll + 1) % 2][this.HistPiece[0].Pos.Y[kk]]) + cc;
                }
                if (tt=="A")
                {
                   this.NewCommands[nn]=tt+String.fromCharCode(97+this.HistPosX[0][kk])+(1+this.HistPosY[0][kk]);
                   this.NewCommands[nn]+=String.fromCharCode(97+this.Piece[(this.MoveType+ll+1)%2][this.HistPiece[0].Pos.X[kk]])+(1+this.Piece[(this.MoveType+ll+1)%2][this.HistPiece[0].Pos.Y[kk]])+cc;
                }
                this.NewCommands[ii]="X";
             }
          }
          else
          {
             tt=this.NewCommands[ii].charAt(0);
             if ((tt=="B")||(tt=="C"))
             { nn=this.NewCommands[ii].charCodeAt(1)-97+(8-parseInt(this.NewCommands[ii].charAt(2)))*8;
               if ((nn>=0)&&(nn<=63))
               { //if (isRotated) nn=63-nn;
                 cc=this.NewCommands[ii].substr(3,6);
                 if (cc=="R") cc="FF0000";
                 if (cc=="G") cc="00FF00";
                 if (cc=="B") cc="0000FF";
                 if (cc.length!=6) cc="#FFFFFF";
                 else cc="#"+cc;
                 if (tt=="B") this.xdocument.images[this.ImageOffset+nn].style.borderColor=cc;
                 else this.xdocument.images[this.ImageOffset+nn].style.backgroundColor=cc;
               }
             }
             if ((tt=="A")&&(dd>0))
             {
                kk = this.NewCommands[ii].charCodeAt(1) - 97;
                jj = parseInt(this.NewCommands[ii].charAt(2));
                nn = kk + (8 - jj) * 8;
                if ((nn >= 0) && (nn <= 63)) bb0 = this.Board[kk][jj - 1];
                kk = this.NewCommands[ii].charCodeAt(3) - 97;
                jj = parseInt(this.NewCommands[ii].charAt(4));
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
                   cc = this.NewCommands[ii].substr(5, 6);
                   if (cc == "R") cc = "FF0000";
                   if (cc == "G") cc = "00FF00";
                   if (cc == "B") cc = "0000FF";
                   if (cc.length!=6) cc = "#FFFFFF";
                   else cc = "#" + cc;
                   aa += this.GetArrow(xx0, yy0, xx1, yy1, cc);
                }
             }
          }
       }
       if (aa != "")
       {
          document.getElementById("Canvas").style.top = -dd + "px";
          document.getElementById("Canvas").innerHTML = aa;
       }
       this.OldCommands.length = 0;
       for (ii = 0; ii < this.NewCommands.length; ii++) this.OldCommands[ii] = this.NewCommands[ii];
       this.NewCommands.length=0;
    }

    //TODO: wtf
    EvalUrlString (ss)
    { let ii, jj, aa, uurl = window.location.search;
      if (uurl != "")
      { uurl = uurl.substring(1, uurl.length);
        while (uurl.indexOf("|")>0) uurl=uurl.replace("|","/");
        while (uurl.indexOf("%7C")>0) uurl=uurl.replace("%7C","/");
        let llist = uurl.split("&");
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
    HighlightMove (nn)
    { let ii, cc, bb, jj=0, ll=this.TargetDocument.anchors.length;
      if (ll==0) return;
      if (! this.TargetDocument.anchors[0].style) return;
      if ((activeAnchor>=0)&&(ll>activeAnchor))
      { this.TargetDocument.anchors[activeAnchor].style.backgroundColor="";
        activeAnchor=-1;
      }
      if (isNaN(startAnchor))
      { while ((jj<ll)&&(this.TargetDocument.anchors[jj].name!=startAnchor)) jj++;
      }
      for (ii=jj; ((ii<ll)&&(activeAnchor<0)); ii++)
      { if (this.TargetDocument.anchors[ii].name==nn)
        { activeAnchor=ii;
          this.TargetDocument.anchors[activeAnchor].style.backgroundColor=activeAnchorBG;
          if ((document!=this.TargetDocument)&&(parent.document!=this.TargetDocument)&&(this.TargetDocument.anchors[activeAnchor].scrollIntoView))
            this.TargetDocument.anchors[activeAnchor].scrollIntoView(false);
          return;
        }
      }
    }
    IsMate ()
    { let aa, ii0, jj0, nn=0, ii=this.IsCheck(this.Piece[this.MoveType][0].Pos.X, this.Piece[this.MoveType][0].Pos.Y, this.MoveType);
      for (ii0=0; (nn==0)&&(ii0<8); ii0++)
      { for (jj0=0; (nn==0)&&(jj0<8); jj0++)
        { if (Math.sign(this.Board[ii0][jj0])==((this.MoveCount+1)%2)*2-1)
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

    SetPgnMoveText (ss, vvariant, rroot, sstart)
    { if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
        document.BoardForm.PgnMoveText.value=ss;
      if (vvariant)
      { this.ShortPgnMoveText[0][vvariant]=ss;
        this.ShortPgnMoveText[1][vvariant]=rroot;
        this.ShortPgnMoveText[2][vvariant]=sstart;
      }
      else this.ShortPgnMoveText[0][0]=ss;
    }


    PrintPosition ()
    { let pp="", tt="", ww;
      if (document.BoardForm)
      { if (document.BoardForm.Pawns) pp=document.BoardForm.Pawns.checked;
        if (pp) tt="Pawn structure after ";
        else tt="Position after ";
        if (parseInt(document.BoardForm.Position.value)>0) tt+=document.BoardForm.Position.value;
        else tt=document.BoardForm.Position.value;
      }
      ww=window.open("");
      //TODO: wtf?
      //with(ww.document)
      //{ open();
      //  writeln("<html><head><title>"+tt+"</title></head><body><div align='center'>");
      //  writeln(this.GetDiagram(pp,tt));
      //  if(this.Annotation[this.MoveCount]) writeln(this.Annotation[this.MoveCount]);
      //  writeln("</div></body></html>");
      //  close();
      //}
      ww.print();
    }

    IsCheck (xx, yy, tt)
    { let ii0=xx, jj0=yy, ddi, ddj, bb;
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
      if ((Math.abs(this.Piece[1-tt][0].Pos.X-xx)<2)&&(Math.abs(this.Piece[1-tt][0].Pos.Y-yy)<2))
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

    SetMove (mmove, vvariant)
    { if (isNaN(mmove)) return;
      let ii=this.isCalculating;
      this.isCalculating=true;
      if (this.RecordCount>0) this.MoveBack(MaxMove);
      if (vvariant)
      { if (vvariant>=this.ShortPgnMoveText[0].length) { this.isCalculating=ii; return; }
        if (this.CurVar!=vvariant)
        { this.SetMove(this.ShortPgnMoveText[2][vvariant], this.ShortPgnMoveText[1][vvariant]);
          this.CurVar=vvariant;
        }
      }
      else
      { while (this.CurVar!=0)
        { if (this.MoveCount==this.ShortPgnMoveText[2][this.CurVar])
          { this.CurVar=this.ShortPgnMoveText[1][this.CurVar];
            if ((!this.isCalculating)&&(document.BoardForm)&&(document.BoardForm.PgnMoveText))
              document.BoardForm.PgnMoveText.value=this.ShortPgnMoveText[0][this.CurVar];
          }
          else this.MoveBack(1);
        }
      }
      this.isCalculating=ii;
      let dd=mmove-this.MoveCount;
      if (dd<=0) this.MoveBack(-dd);
      else this.MoveForward(dd, 1);
      if (this.isCalculating) return;
      if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
        document.BoardForm.PgnMoveText.value=this.ShortPgnMoveText[0][this.CurVar];
      if (this.AutoPlayInterval) clearTimeoutStub(this.AutoPlayInterval, this);
      if (this.isAutoPlay) this.AutoPlayInterval=setTimeoutStub(function(){this.MoveForward(1);}, this.Delay, this);
    }

    UpdateAnnotation (bb)
    {
       if (! parent.frames["annotation"]) return;
       if(bb)
       {
          //TODO: wtf?
          //with (parent.frames["annotation"].document)
          //{
          //   open();
          //   writeln("<html><head></head><body><form>");
          //   writeln("<input type='hidden' name='this.MoveCount' value='"+this.MoveCount+"'>");
          //   write("<textarea rows=8 style='width:100%' name='this.Annotation'>");
          //   if (this.Annotation[this.MoveCount]) write(this.Annotation[this.MoveCount]);
          //   writeln("</textarea>");
          //   if (this.AnnotationFile) writeln("<input type='button' value='Save this.Annotation' onclick='parent.frames[\"board\"].SaveAnnotation(this.form)'>");
          //   writeln("</form></body></html>");
          //   close();
          //}
       }
       else
       {
          parent.frames["annotation"].document.forms[0].this.MoveCount.value=this.MoveCount;
          if (this.Annotation[this.MoveCount])
             parent.frames["annotation"].document.forms[0].this.Annotation.value=this.Annotation[this.MoveCount];
          else
             parent.frames["annotation"].document.forms[0].this.Annotation.value="";
       }
    }

    SaveAnnotation (ff)
    { let mm=parseInt(ff.this.MoveCount.value);
      this.Annotation[mm]=ff.this.Annotation.value;
      if ((this.AnnotationFile)&&(parent.frames['annotation']))
        parent.frames['annotation'].location.replace(this.AnnotationFile+"?this.MoveCount="+mm+"&this.Annotation="+escape(this.Annotation[mm]));
    }

    GetDiagram (pp, ssp)
    { let ii, jj, cc, tt, nn, mm, ss=String.fromCharCode(13)+"<P align=center>", oo, aa=new Array(64);
      let bb=Border;
      let iip= this.ImgResourcePath;
      if (document.BoardForm)
      { if (oo=document.BoardForm.ImagePath)
        { iip=oo.options[oo.options.selectedIndex].value;
          if (iip!="") { iip=iip.replace("|","/"); bb=0; }
        }
        if (oo=document.BoardForm.Border) bb=oo.options.selectedIndex;
      }
      for (ii=0; ii<64; ii++) aa[ii]="";
      if (this.isCalculating) oo=this.NewCommands;
      else oo=this.OldCommands;
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
      tt=new Array("k","q","r","b","n","p");
      //if (isRotated)
      //{ for (jj=0; jj<8; jj++)
      //  { ss+="<TR>";
      //    for (ii=7; ii>=0; ii--)
      //    { if ((this.Board[ii][jj]==0)||((pp)&&((this.Board[ii][jj]+6)%6!=0)))
      //        ss+="<TD background='"+iip+this.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
      //      else
      //        ss+="<TD background='"+iip+this.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+this.ColorName[(1-Math.sign(this.Board[ii][jj]))/2]+tt[Math.abs(this.Board[ii][jj])-1]+".gif'";
      //      if (document.layers) ss+=" border="+bb+"></TD>";
      //      else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+this.BorderColor+";"+aa[jj*8+(7-ii)]+"'></TD>";
      //    }
      //    ss+="</TR>";
      //  }
      //}
      //else
      { for (jj=7; jj>=0; jj--)
        { ss+="<TR>";
          for (ii=0; ii<8; ii++)
          { if ((this.Board[ii][jj]==0)||((pp)&&((this.Board[ii][jj]+6)%6!=0)))
              ss+="<TD background='"+iip+this.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
            else
              ss+="<TD background='"+iip+this.ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+this.ColorName[(1-Math.sign(this.Board[ii][jj]))/2]+tt[Math.abs(this.Board[ii][jj])-1]+".gif'";
            if (document.layers) ss+=" border="+bb+"></TD>";
            else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+this.BorderColor+";"+aa[(7-jj)*8+ii]+"'></TD>";
          }
          ss+="</TR>";
        }
      }
      ss+="</TABLE></div>";
      if (!document.layers)
      { let xx0, xx1, bb0, bb1, kk, dd=parseInt(document.getElementById("this.Board").offsetHeight);
        if (iip!=0)
        { dd=0;
          for (ii=0; ii<iip.length; ii++)
          { if (!isNaN(iip.charAt(ii))) { dd*=10; dd+=parseInt(iip.charAt(ii)); }
          }
          if (dd>0) dd+=2*bb;
          dd*=8;
        }
        let dd32=Math.round(dd/32);
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
                ss+=this.GetArrow(xx0,yy0,xx1,yy1,cc);
              }
            }
          }
          ss+="</div>";
        }
      }
      ss+="</TD></TR></TABLE>";
      if (this.IsLabelVisible)
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

    GetCapturedPieces (iip,bb)
    { let ii, jj, kk, ll, ss, rr=new Array(8);
      for (ii=0; ii<8; ii++) rr[ii]="";
      let tt=new Array("k","q","r","b","n","p");
      let pp0=new Array(0,1,1,2,2,2,8);
      kk=0;
      ii=0;
      //if (isRotated) ii=1;
      for (jj=0; jj<16; jj++) pp0[this.Piece[ii][jj].Type+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp0[jj+1]; ll++)
        { rr[kk%4]+="<td><IMG SRC='"+iip+this.ColorName[ii]+tt[jj]+".gif'></td>";
          kk++;
          pp0[0]++;
        }
      }
      for (ll=0; ll>pp0[0]; ll--)
      { rr[kk%4]+="<td><IMG SRC='"+iip+this.ColorName[ii]+tt[5]+".gif'></td>";
        kk++;
      }
      while (kk<4) { rr[kk%4]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
      while (kk<16){ rr[kk%4]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; }
      let pp1=new Array(0,1,1,2,2,2,8);
      kk=0;
      ii=1-ii;
      for (jj=0; jj<16; jj++) pp1[this.Piece[ii][jj].Type+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp1[jj+1]; ll++)
        { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+this.ColorName[ii]+tt[jj]+".gif'></td>";
          kk++;
          pp1[0]++;
        }
      }
      for (ll=0; ll>pp1[0]; ll--)
      { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+this.ColorName[ii]+tt[5]+".gif'></td>";
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
    GetArrow (theX0, theY0, theX1, theY1, theColor)
    { let ll, rr, tt, bb, ww, hh, ccl, ccr, cct, ccb, dd, tmpX0, tmpY0;
      let ddir=(((theY1>theY0)&&(theX1>theX0))||((theY1<theY0)&&(theX1<theX0))) ? true : false;
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
      let LL=1, ll0=ll, tt0=tt;
      let ccL=12, ccB=4;
      let DDX=theX1-theX0, DDY=theY1-theY0;
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
    SetBoardSetupMode (mm)
    { BoardSetupMode=mm;
      this.SetBoardClicked(-1);
    }
    SetupPieceClick (ii,bb)
    {
       try
       {
          if (this.isDragDrop&&(!bb)) return;
          let nn=this.BoardClicked;
          if (ii>11)
          {
             if (nn>=0)
             {
                this.SetBoardSetupMode('delete');
                /*if (isRotated) this.BoardClick(63-nn,true);
                else*/ this.BoardClick(nn,true);
                this.SetBoardSetupMode('move');
             }
             return;
          }
          this.SetBoardClicked(-1);
          this.BoardClick(ii+64,true);
       }catch(e)
       {
          alert("SetupPieceClick>>error: " + e);
       }
    }
    SetupBoardClick (nn)
    { let ii, jj, ii0, jj0, ii1, jj1, mm, nnn;
      /*if (isRotated) nnn=63-nn;
      else*/ nnn=nn;
      if ((this.BoardClicked<0)&&(BoardSetupMode!='delete'))
      { if (nn>=64) { this.SetBoardClicked(nn); return; }
        ii0=nnn%8;
        jj0=7-(nnn-ii0)/8;
        if (this.Board[ii0][jj0]!=0) this.SetBoardClicked(nnn);
        return;
      }
      if (this.BoardClicked>=0)
      { ii0=this.BoardClicked%8;
        jj0=7-(this.BoardClicked-ii0)/8;
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
      { if (this.BoardClicked>=64)
        { ii0=this.BoardClicked%2;
          jj0=(this.BoardClicked-64-ii0)/2;
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
      //        this.SetImg(63-ii-(7-jj)*8,this.BoardPic);
      //      else
      //        this.SetImg(63-ii-(7-jj)*8,this.PiecePic[(1-Math.sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
      //    }
      //  }
      //}
      //else
      { for (ii=0; ii<8; ii++)
        { for (jj=0; jj<8; jj++)
          { if (this.Board[ii][jj]==0)
              this.SetImg(ii+(7-jj)*8,this.BoardPic);
            else
              this.SetImg(ii+(7-jj)*8,this.PiecePic[(1-Math.sign(this.Board[ii][jj]))/2][Math.abs(this.Board[ii][jj])-1]);
          }
        }
      }
    }
    //TODO: make HTML5
    ScoreSheetHeader (tt)
    { let pp=new Array("Event","Site","Date","Round", "Result","White","Black","ECO","WhiteElo","BlackElo","FEN");
      let vv=new Array("?","?","?","?","?","?","?","?","?","?","");
      let ii, jj, ss, ee;
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
    ScoreSheetFooter ()
    { return("</td></tr></table></div>");
    }
    //TODO: notused; to review and remove completely SetDragDrop
    //      drag&drop have better HTML5 implemetations, no need for simulations anymore
    SetDragDrop (bb)
    {
      //  document.BoardForm.DragDrop.checked=bb; //??
      //this.isDragDrop=bb; //TODO: no impacts anymore

    }
    ////TODO: notused; to review and remove completely MouseDown
    ////      drag&drop have better HTML5 implemetations, no need for simulations anymore
    //this.MouseDown = function(e)
    //{ let ii="";
    //  if (dragObj) this.MouseUp(e);
    //  if (e)
    //  { dragObj=e.target;
    //    ii=dragObj.id;
    //    dragX=e.clientX;
    //    dragY=e.clientY;
    //  }
    //  else if (window.event)
    //  { dragObj=event.srcElement;
    //    ii=dragObj.id;
    //    dragX=event.clientX;
    //    dragY=event.clientY;
    //  }
    //  else return;
    //  if (isNaN(parseInt(ii))) { dragObj=null; return; }
    //  if (ii<64) this.BoardClick(ii,true);
    //  else this.SetupPieceClick(ii-64,true);
    //  if (!this.isDragDrop) return;
    //  if ((this.BoardClicked<0)||(this.isAutoPlay)) dragObj=null;
    //  else
    //  { dragObj.style.zIndex=200;
    //    dragBorder=dragObj.style.borderWidth;
    //    if (dragBorder) dragObj.style.borderWidth="0px";
    //  }
    //  return false;
    //}
    ////TODO: notused; to review and remove completely MouseMove
    ////      drag&drop have better HTML5 implemetations, no need for simulations anymore
    //this.MouseMove = function(e)
    //{
    //   if (!this.isDragDrop      ) return;
    //   if ( this.BoardClicked < 0) return; //not a drag&drop from board
    //   if ( dragObj) //simulate piece drag
    //   {
    //      if (e)
    //      {
    //         dragObj.style.left = (e.clientX-dragX) + "px";
    //         dragObj.style.top  = (e.clientY-dragY) + "px";
    //      }
    //      else if (window.event) //probably IE
    //      {
    //         dragObj.style.left = (event.clientX-dragX) + "px";
    //         dragObj.style.top  = (event.clientY-dragY) + "px";
    //      }
    //   }
    //   return false;
    //}

    ////TODO: used in notused; to review and remove completely MouseUp(e)
    ////      drag&drop have better HTML5 implemetations, no need for simulations anymore
    ////compute coords and call BoardClick or SetupPieceClick
    ////cell number: this.BoardClicked is not updated here
    //this.MouseUp = function(e)
    //{
    //   let ii, jj, ddx = 0, ddy = 0, ww = 32;
    //   if (!this.isDragDrop)        return;
    //   if (this.BoardClicked < 0)   return;
    //   if (dragObj)
    //   {
    //      ww=dragObj.width;
    //      if (dragBorder) ww += 2 * parseInt(dragBorder);
    //   }
    //   if ((isNaN(ww)) || (ww==0)) ww = 32;
    //   if (e)
    //   {
    //      ddx = e.clientX - dragX;
    //      ddy = e.clientY - dragY;
    //   }
    //   else if (window.event)
    //   {
    //     ddx = event.clientX - dragX;
    //     ddy = event.clientY - dragY;
    //   }
    //   else return;
    //   if (this.BoardClicked < 64)
    //   {
    //      //if (isRotated)
    //      //{
    //      //   ii =     ( 63 - this.BoardClicked )      % 8;
    //      //   jj = 7 - ( 63 - this.BoardClicked - ii ) / 8;
    //      //}
    //      //else
    //      {
    //         ii =       this.BoardClicked       % 8;
    //         jj = 7 - ( this.BoardClicked - ii) / 8;
    //      }
    //   }
    //   else
    //   {
    //      ii = 9 +             this.BoardClicked       % 2 ;
    //      jj = 7 - Math.floor((this.BoardClicked - 64) / 2);
    //   }
    //   //Target i, j squares calculating
    //   ii += Math.round (ddx / ww);
    //   jj -= Math.round (ddy / ww);
    //   if       ( ( ii >= 0) && (ii < 8) && (jj >= 0) && (jj  < 8) )     this.BoardClick ( 8 * ( 7 - jj ) + ii, true);
    //   else if  ( (this.isSetupBoard) && (ii == 9) && (jj == 0)    )     this.SetupPieceClick(12, true);
    //   else                                                              this.BoardClick(this.BoardClicked, true);
    //
    //   // drag icon simulator
    //   if (dragObj)
    //   {
    //      dragObj.style.left = "0px";
    //      dragObj.style.top  = "0px";
    //      dragObj.style.zIndex = 1;
    //      if (dragBorder) dragObj.style.borderWidth = dragBorder;
    //      dragObj = null;
    //   }
    //}

    //TODO: what is this for?
    AnimateBoard (nn)
    { let pp=0, mm=parseInt(this.Delay)/100;
      this.isAnimating=true;
      if (this.dragPiece[4]>=0) mm*=0.75;
      mm=Math.floor(mm);
      if (mm>10) mm=10;
      if (nn>mm) pp=4;
      if (nn%mm==1)
      { /*if (isRotated) dragImg[pp%3]=this.xdocument.images[63-this.dragPiece[pp+2]-(7-this.dragPiece[pp+3])*8+this.ImageOffset];
        else*/ dragImg[pp%3]=this.xdocument.images[this.dragPiece[pp+2]+(7-this.dragPiece[pp+3])*8+this.ImageOffset];
        this.dragPiece[pp+2]=dragImg[pp%3].offsetLeft;
        this.dragPiece[pp+3]=dragImg[pp%3].offsetTop;
        /*if (isRotated) dragImg[pp%3]=this.xdocument.images[63-this.dragPiece[pp+0]-(7-this.dragPiece[pp+1])*8+this.ImageOffset];
        else*/ dragImg[pp%3]=this.xdocument.images[this.dragPiece[pp+0]+(7-this.dragPiece[pp+1])*8+this.ImageOffset];
        this.dragPiece[pp+0]=dragImg[pp%3].offsetLeft;
        this.dragPiece[pp+1]=dragImg[pp%3].offsetTop;
      }
      if (nn%mm!=0)
      { if (nn%mm==1)
        { dragImg[pp%3].style.zIndex=200+pp;
          dragImgBorder=parseInt(dragImg[pp%3].style.borderWidth);
          if (dragImgBorder) dragImg[pp%3].style.borderWidth="0px";
          else dragImgBorder=0;
        }
        dragImg[pp%3].style.left=(Math.round((nn%mm)*(this.dragPiece[pp+2]-this.dragPiece[pp+0])/(mm-1))+dragImgBorder)+"px";
        dragImg[pp%3].style.top=(Math.round((nn%mm)*(this.dragPiece[pp+3]-this.dragPiece[pp+1])/(mm-1))+dragImgBorder)+"px";
        if ((this.dragPiece[4]>=0)&&(mm-1==nn)) setTimeoutStub("AnimateBoard("+(mm+1)+")",50, this);
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
        this.dragPiece[mm+0]=-1;
      }
      this.isAnimating=false;
    }

    //TODO: it is actually static
    IsOnBoard (ii, jj)
    { if (ii<0) return(false);
      if (ii>7) return(false);
      if (jj<0) return(false);
      if (jj>7) return(false);
      return(true);
    }

    //TODO: make deep review
    OpenGame (nn)
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
    IsInComment (ss, nn)
    { let ii=-1, bb=0;
      do { ii=ss.indexOf("{",ii+1); bb++; }
      while ((ii>=0)&&(ii<nn));
      ii=-1;
      do { ii=ss.indexOf("}",ii+1); bb--; }
      while ((ii>=0)&&(ii<nn));
      return(bb);
    }


    ////TODO: what is this for?
    //let IsComplete = function(){return(isInit);}
    //TODO: unused
    //let SetCandidateStyle = function (ss){this.CandidateStyle=ss;}
    //TODO: what is it for?
    SetAnnotation (ff) { this.AnnotationFile=ff;}

    SetBorder      (nn) { this.Border = parseInt(nn); }
    SetBorderColor (cc) { if (cc.length == 6) this.BorderColor = "#" + cc; else this.BorderColor = cc; } //TODO: make regexp
    SetScoreSheet  (nn) { ScoreSheet = parseInt(nn); }
    SetBGColor     (cc) { if (cc.charAt(0) == "#") BGColor = cc; else BGColor = "#" + cc; } //TODO: make regexp
    ShowLabels     (bb) { this.IsLabelVisible = bb; this.RefreshBoard(); }
    SwitchLabels   ()   { this.IsLabelVisible = !this.IsLabelVisible; this.RefreshBoard(); }
    GetValue       (oo) { let vv = ""; if(!(oo == null)){vv = + oo;} return(vv); } //TODO: not used
    //Math.sign            (nn) { if (nn > 0) return(1); if (nn < 0) return(-1); return(0); } //TODO: try to remove

    //TODO: to find out more suitable DOM solution
    //this.SetTitle = function (tt) {}  //top.document.title=tt; //TODO: to review this code
    AddText (tt) {}  //document.writeln(tt);  //TODO: to review this code





} //EDN class
