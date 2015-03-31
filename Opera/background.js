//Opera specific script
//runs in background process

try
{
   if (opera.contexts.menu)
   {
      var menu = opera.contexts.menu;
      var itemRoatta = opera.contexts.menu.createItem (
         {
            contexts: ['selection'], // 'page'
            title : 'Roatta Waaayyyy!!!',
            type  : 'folder'
         });

      var itemMini18 = opera.contexts.menu.createItem (
         {
            title: 'Mini board',
            contexts: ['selection'],
            onclick: function (event)
               {
                  try
                  {
                     event.source.postMessage(
                        {
                           chessObject:
                           {
                              gametype : "PGN_OR_FEN_board",
                              imgPath  : "mini18",
                              height   : 300,
                              width    : 300
                           }
                        });
                  }
                  catch (err)
                  {
                     opera.postError("error on sending sent PGN_OR_FEN_board message to injected script");                           
                  }
               }
         });
		 


      var itemMedium35 = opera.contexts.menu.createItem (
         {
            title: 'Medium board',
            contexts: ['selection'],
            onclick: function (event)
               {
                  try
                  {
                     event.source.postMessage(
                        {
                           chessObject:
                           {
                              gametype : "PGN_OR_FEN_board",
                              content  : "",          //selection,
                              imgPath  : "medium35",  //imagePath
                              height   : 500,
                              width    : 500
                           }
                        });
                  }
                  catch (err)
                  {
                     opera.postError("error on sending sent PGN_OR_FEN_board message to injected script");                           
                  }
               }
         });
	  opera.contexts.menu.addItem(itemRoatta);
      itemRoatta.addItem(itemMini18);
      itemRoatta.addItem(itemMedium35);

   }
}
catch (err)
{
}

opera.extension.onmessage = function(event)
   {
      var message = event.data;
      opera.postError("message back");
      if (message.chessObject)
         chessObject = message.chessObject;
      else
         return;
	  var href = 'board.html?boardType=' + chessObject.imgPath + "&PGN=" + chessObject.content;
	  var brWnd = opera.extension.windows.create([{url: href}],
                                                 {
                                                    height  : chessObject.height,
                                                    width   : chessObject.width,
                                                    top     : 50,
                                                    left    : 100,
													focused : true});

   };   
