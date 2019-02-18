document.addEventListener('DOMContentLoaded',
function (event)
{
   //var boardType = window.location.search.match("[\?&]boardType=([^&]+)")[1];
   //playBoard(boardType);
   console.log ("salut din popup");
   var PGN =  decodeURIComponent(window.location.search.match(".*?[\?&]PGN=([^&]+)")[1]);
   console.log ("salut cu selectia: " + PGN);
}
);

   function onCreated(windowInfo) {
     console.log("Popup.html: window info: " + windowInfo);//`Created window: ${windowInfo.id}`);
   }