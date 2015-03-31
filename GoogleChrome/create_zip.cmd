@del .\ChromeRoatta.zip /Q
@set zip7zPath="%ProgramFiles%\7-Zip\7z.exe"
@if not exist %zip7zPath% set zip7zPath="%ProgramFiles(x86)%\7-Zip\7z.exe"
@if not exist %zip7zPath% set zip7zPath="7z.exe"
@if not exist %zip7zPath% goto end
@%zip7zPath% a -tzip .\ChromeRoatta.zip  -xr!.svn -xr!*.bak -xr!*.cmd -xr!*.cmd -xr!ltpgnviewer.js -xr!Thumbs.db .
@goto finish
:end
@echo unsuccessfull finish, probably 7z not installed
:finish