console.log("Popup adding chrome listener");
//chrome.runtime.onMessage.addListener

let docvar = document;
let wndvar = window;
browser.runtime.onMessage.addListener
(
   (request) =>
   {
      console.log("popup chrome listen to game: " + request.chessObject.gametype);
      console.log("popup chrome listen to game: " + request.chessObject.content);
      console.log("popup chrome listen to game: " + request.chessObject.imgPath);
	  console.log("popup chrome listen to game: document inner html: " + document.innerHTML);
	  document.innerHTML += "<br/>" + request.chessObject.content;
	  console.log("popup chrome listen to game: document inner html: " + document.innerHTML);
      //console.log("popup chrome listen to game: " + chessObject.gametype);
      //if (chessObject.gametype === 'PGN_OR_FEN_board')
      //{
      //   return Promise.resolve('done');
      //}
      return false;
   }
);
console.log("Popup added listener");


document.addEventListener('DOMContentLoaded',
   function (event)
   {
      //var boardType = window.location.search.match("[\?&]boardType=([^&]+)")[1];
      //playBoard(boardType);
      console.log ("salut din popup");
      var PGN =  decodeURIComponent(window.location.search.match(".*?[\?&]PGN=([^&]+)")[1]);
      console.log ("salut cu selectia: " + PGN);
	  console.log( "Salut cu document: " + window.document.title);
	  //console.log( "Salut cu id: " + window.id);
	  
	  browser.runtime.onMessage.addListener
       (
          (request) =>
          {
             console.log("zz popup chrome listen to game: " + request.chessObject.gametype);
             console.log("zz popup chrome listen to game: " + request.chessObject.content);
             console.log("zz popup chrome listen to game: " + request.chessObject.imgPath);
       	     console.log("zz popup chrome listen to game: document inner html: " + document.innerHTML);
       	     document.innerHTML += "<br/>" + request.chessObject.content;
       	     console.log("popup chrome listen to game: document inner html: " + document.innerHTML);
             //console.log("popup chrome listen to game: " + chessObject.gametype);
             //if (chessObject.gametype === 'PGN_OR_FEN_board')
             //{
             //   return Promise.resolve('done');
             //}
             return false;
          }
       );
	  

   }
);

