console.log("document.addEventListener");
document.addEventListener('DOMContentLoaded',
   function (event)
   {
      //browser.runtime.sendMessage (  { chessObject: { gametype : "PGN_OR_FEN_board" } }  )
      //          .then
      //          (
      //             (request) =>
      //             {
      //                 console.log("on DOMContentLoaded message: " + request.chessObject.gametype);
      //                 console.log("on DOMContentLoaded message: " + request.chessObject.content);
      //                 console.log("on DOMContentLoaded message: " + request.chessObject.imgPath);
      //             }
      //          );
	 chrome.extension.sendRequest
		(
		   {
			  chessObject:
			  {
				 gametype : "PGN_OR_FEN_board"
			  }
		   },
		   function(response)
		   {
			  console.log(response);
		   }
		);
      console.log("Popup DOMContentLoaded send message end");

   }
);
console.log("document.addEventListener end");
