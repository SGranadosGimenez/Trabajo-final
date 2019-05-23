<?php   
    $file = basename($_GET['file']);
    
    switch ($_GET["tipoDescarga"]) {
        case 'arxiuCompartit':
            $modul = $_GET["modul"];
            chdir("../arxiusCompartits/modul$modul/"); 
            break;
        case 'trabajoArchivoEntregado':
            $alumno = $_GET["alumno"];
            chdir("../arxiusAlumnes/alumne$alumno/"); 
            break;
        case 'trabajoArchivoAdjunto':
            $modul = $_GET["modul"];
            chdir("../enunciadosTrabajos/modul$modul/"); 
            break;
            
    }

    if(!file_exists($file)){ // file does not exist
        die('file not found');
    } else {
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename=$file");
        header("Content-Type: application/zip");
        header("Content-Transfer-Encoding: binary");
    
        // read the file from disk
        readfile($file);
    }
?>