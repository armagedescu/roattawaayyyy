//Application specific interactions, this is application dependent
//All the compatibility and portability issues should be solved here

// chrome bridge to board_doc_main
document.addEventListener('DOMContentLoaded',
   (event) =>
   {
      let chessPromise = browser.runtime.sendMessage (  { chessObject: { gametype : "PGN_OR_FEN_board" } }  );
      chessPromise.then((val)=>
      {
         console.log("response> " + JSON.stringify(val));
         board_doc_main(val.chessObject);
      });

      console.log("Popup DOMContentLoaded send message end");
   }
);
