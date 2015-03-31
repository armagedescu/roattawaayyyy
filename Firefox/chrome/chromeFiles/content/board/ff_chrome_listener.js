//Application specific interactions, this is application dependent

document.addEventListener('DOMContentLoaded',
function ()
{
   var boardType = window.location.search.match("[\?&]boardType=([^&]+)")[1];
   playBoard(boardType);
}
);

//The only global variable,
//in FF should be placed in HTML inline javascript
//because in FF script is evaluated twice,
//and initialized variable is reset back to null
//keep comment for diffs

// firefox bridge to board_doc_main
function playBoard(boardType)
{
   try
   {
      board_doc_main
         (
            {
               "imgPath": boardType,
               "content": window.opener.gBrowser.contentWindow.getSelection().toString()
            }
         );
   }catch(err)
   {
      alert(err);
   }
}

//browser specific timer implementation
//FF requires nsITimer
//all other browsers will use standard mechanism,
//with Stub aliases, for portability

function clearTimeoutStub(timerStub, chessGame)
{
   chessGame.timeProcessor.stop();
}
function setTimeoutStub(eventarg, intervalarg, chessGame)
{
   if(!chessGame) return 0;
   if(!chessGame.timeProcessor) return 0;
   chessGame.timeProcessor.stop();
   chessGame.timeProcessor.oneShot(new eventWrapper(eventarg), intervalarg);
   return 1;
}

function eventWrapper(eventFunc)
{
   this.notify = function(timer)
   {
      eventFunc();
   }
}
function timerWrapper()
{
    var timerID = null;
    var timerObject     = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	this.oneShot        = function (eventarg, intervalarg){timerObject.initWithCallback(eventarg, intervalarg, Components.interfaces.nsITimer.TYPE_ONE_SHOT);}
	this.startPermament = function (eventarg, intervalarg){timerObject.initWithCallback(eventarg, intervalarg, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);}
	this.startExactly   = function (eventarg, intervalarg, shotCount){timerObject.initWithCallback(eventarg, intervalarg, Components.interfaces.nsITimer.TYPE_ONE_SHOT);if(shotCount > 0) this.startExactly (event, interval, shotCount - 1);}
	this.stop           = function(){timerObject.cancel();}
}