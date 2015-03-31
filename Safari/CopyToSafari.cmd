rem TODO: add cleanup there
@del  Roatta.safariextz /Q
@del  Roatta.safariextension\*.gif  /S /Q
@del  Roatta.safariextension\*.js   /S /Q
@del  Roatta.safariextension\*.html /S /Q
@copy board.html           Roatta.safariextension
@copy global.html          Roatta.safariextension
@copy inject.js            Roatta.safariextension
@copy safari_listener.js   Roatta.safariextension
@copy board_main.js        Roatta.safariextension
@copy pgn_parsers_main.js  Roatta.safariextension
@if not exist Roatta.safariextension\mini18   md Roatta.safariextension\mini18
@if not exist Roatta.safariextension\medium35 md Roatta.safariextension\medium35
@copy mini18\*.gif    Roatta.safariextension\mini18
@copy medium35\*.gif  Roatta.safariextension\medium35
rem @pause