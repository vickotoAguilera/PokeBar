Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Ejecutar Electron en segundo plano sin ninguna ventana de consola CMD (modo 0 = oculto)
If CreateObject("Scripting.FileSystemObject").FileExists("node_modules\electron\dist\electron.exe") Then
    WshShell.Run """node_modules\electron\dist\electron.exe"" . --poketokenbar-app=PokeTokenBar-Windows", 0, False
Else
    WshShell.Run "cmd /c npm start -- --poketokenbar-app=PokeTokenBar-Windows", 0, False
End If
