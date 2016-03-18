document.addEventListener('DOMContentLoaded', function()
{
    //alert("Ready!");
	var chessObject =
		{
			gametype : "PGN_OR_FEN_board",
			content : " 1.f4 d5 2.Nf3 g6 3.e3 Bg7 4.Be2 Nf6 5.0-0 0-0 6.d3 c5.",
			imgPath : "/medium35"
		};
	board_doc_main (chessObject);
}, false);