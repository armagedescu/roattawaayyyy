//<script type="text/javascript">	//put your js code here	//...
   //menu item into tools menu
   // Duplicate items found in HKEY_CURRENT_USER override those in HKEY_LOCAL_MACHINE .
   //optional
   //HKEY_LOCAL_MACHINE\Software\Microsoft\Internet Explorer\Extensions\{GUID}\MenuCustomizeMenuStatusBar
   //HKEY_LOCAL_MACHINE\Software\Microsoft\Internet Explorer\Extensions\{GUID}\MenuStatusBar
   
   //context menu
   // HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\MenuExt\<Menu Text>
   var extension_GUID = "{B550986D-56C4-43bc-ACA3-AD0707037971}";
   var CLSID_Shell_ToolbarExtExec  =  "{1FBA04EE-3024-11d2-8F1F-0000F87ABD16}";
   var txtMenuItem  = "Roatta Waayyyy!!!";
   Register();
   //Unregister();
   function Register()
   {
      var shell = new ActiveXObject("WScript.Shell");
      //shell.RegWrite("HKLM\\Software\\Microsoft\\Internet Explorer\\Extensions\\" + extension_GUID + "\\Script", 0);
      //add menu item to tools menu
      //shell.RegWrite("HKLM\\Software\\Microsoft\\Internet Explorer\\Extensions\\" + extension_GUID + "\\clsid", CLSID_Shell_ToolbarExtExec);
      //shell.RegWrite("HKLM\\Software\\Microsoft\\Internet Explorer\\Extensions\\" + extension_GUID + "\\Script", "C:\\Documents and Settings\\ion\\Desktop\\chess\\IVFIEChess.js");
      //shell.RegWrite("HKLM\\Software\\Microsoft\\Internet Explorer\\Extensions\\" + extension_GUID + "\\MenuText", txtMenuItem);

      shell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\MenuExt\\" + txtMenuItem + "\\", "file://C:\\Documents and Settings\\ion\\Desktop\\chess\\pgnviewer\\IVFIEMiniBoard.html");
      shell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\MenuExt\\" + txtMenuItem + "\\Contexts", 0x10, "REG_DWORD");
      shell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\MenuExt\\" + txtMenuItem + "\\Flags", 0x01, "REG_DWORD");
      
        //HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\MenuExt\<Menu Text>\Flags

      shell.Popup("salut");
   }
   function Unregister()
   {
      var shell = new ActiveXObject("WScript.Shell");
      shell.RegDelete("HKCU\\Software\\Microsoft\\Internet Explorer\\MenuExt\\" + txtMenuItem + "\\");
      //shell.RegDelete("HKLM\\Software\\Microsoft\\Internet Explorer\\Extensions\\" + extension_GUID + "\\");
   }
   //var parentwin = external.menuArguments;
   //var doc = parentwin.document;
   //var win = doc.window;
//</script>