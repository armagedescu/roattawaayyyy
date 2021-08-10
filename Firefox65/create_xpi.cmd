@del .\ChessAddIn.zip /Q
@del .\ChessAddIn.xpi /Q
@set zip7zPath="%ProgramFiles%\7-Zip\7z.exe"
@if not exist %zip7zPath% set zip7zPath="%ProgramFiles(x86)%\7-Zip\7z.exe"
@if not exist %zip7zPath% set zip7zPath="7z.exe"
@if not exist %zip7zPath% goto end
%zip7zPath% a -tzip .\ChessAddIn.zip  -xr!.svn -xr!*.bak -xr!Thumbs.db -xr!defaults *.js *.html .\manifest.json .\icons .\medium35 .\mini18
@copy .\ChessAddIn.zip .\ChessAddIn.xpi
@goto finish
:end
@echo unsuccessfull finish, probably 7z not installed
:finish