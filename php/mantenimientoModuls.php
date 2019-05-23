<?php

    include "gestorBD.php";
    include "enviarEmails.php";

    /* COJER MODULOS */
    if (isset($_POST["cojerModuls"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idModul, 
                                                    Nom
                                                FROM modul");

        $modulosValor = "";

        while ($modulo = $resultado->fetch_assoc()) {
            $modulosValor .= ";" . $modulo["idModul"] . "/" . $modulo["Nom"];
        }

        echo substr($modulosValor, 1);
    }

    if (isset($_POST["cojerAssignaturas"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idAssignatura, 
                                                    Nom
                                                FROM assignatura");

        $assignaturaValor = "";

        while ($assignatura = $resultado->fetch_assoc()) {
            $assignaturaValor .= ";" . $assignatura["idAssignatura"] . "/" . $assignatura["Nom"];
        }
        
        echo substr($assignaturaValor, 1);
    }

    /* COJO LA INFORMACON DEL PROFESSOR SELECCIONADO */
    if (isset($_POST["informacionModul"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    IdAssignatura,
                                                    Nom,
                                                    Comentari,
                                                    Hores
                                                FROM modul
                                                WHERE idModul = " . $_POST["modulBuscado"]);
        if ($resultado != null) {
            $datosModulo = $resultado->fetch_assoc();
            
            $modulo = new stdClass();
            $modulo->IdAssignatura = utf8ize($datosModulo["IdAssignatura"]);
            $modulo->Nom = utf8ize($datosModulo["Nom"]);
            $modulo->Comentari = utf8ize($datosModulo["Comentari"]);
            $modulo->Hores = utf8ize($datosModulo["Hores"]);

            echo json_encode($modulo);
        }else
            echo "No se han encontrado resultados";
    }

    /* CREAR PROFESSOR */
    if (isset($_POST["crearModul"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        

        $assignatura = $valores[0];
        $nom = $valores[1];
        $comentari = $valores[2];
        $hores = $valores[3];
        
        $query = "INSERT INTO modul
                    (IdAssignatura, 
                    Nom, 
                    Comentari, 
                    Hores) 
                VALUES 
                    ($assignatura, 
                    '$nom', 
                    '$comentari', 
                    $hores)";
        $resultado = $gestorBD->realizarCambios($query);
        
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    /* MODIFICAR PROFESSOR */
    if (isset($_POST["modificarModul"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        
        $assignatura = $valores[0];
        $nom = $valores[1];
        $comentari = $valores[2];
        $hores = $valores[3];
        $modul = $valores[4];

        $query = "UPDATE modul
                    SET
                        IdAssignatura = $assignatura, 
                        Nom = '$nom', 
                        Comentari = '$comentari', 
                        Hores = $hores
                    WHERE idModul = $modul";

        $resultado = $gestorBD->realizarCambios($query);
        
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["eliminarModul"])) {
        $gestorBD = new gestorBD();

        $modulo = $_POST["modulBuscado"];

        $resultado = $gestorBD->realizarCambios("DELETE FROM modul WHERE idModul = $modulo");
            
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["cargarArxiusCompartits"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $resultado = $gestorBD->realizarQuery("SELECT *
                                                FROM arxiucompartit
                                                WHERE IdModul = $modul");

        if ($resultado != null) {
            $valoresArxius = "";

            while ($arxiuActual = $resultado->fetch_assoc()) {
                $valoresArxius .= "|" . $arxiuActual["idArxiuCompartit"] . ";" . $arxiuActual["Nom"] . ";" . $arxiuActual["Descripcio"]; 
            }

            echo substr($valoresArxius, 1);
        }else
            echo "noArxius";
    }

    if (isset($_POST["descargarArchivo"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $idArchivo = $_POST["idArchivo"];

        $resultado = $gestorBD->realizarQuery("SELECT Arxiu 
                                                FROM arxiucompartit
                                                WHERE idArxiuCompartit = $idArchivo AND IdModul = $modul");
        if ($resultado != null) {
            $arxiu = $resultado->fetch_assoc();
            $nomArxiu = $arxiu["Arxiu"];
            
            echo "download.php?file=" . $nomArxiu . "&modul=$modul&tipoDescarga=arxiuCompartit";
        }else
            echo "";
    }

    if (isset($_POST["borrarArchivo"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $idArchivo = $_POST["idArchivo"];

        $resultado = $gestorBD->realizarQuery("SELECT Arxiu 
                                                FROM arxiucompartit
                                                WHERE idArxiuCompartit = $idArchivo AND IdModul = $modul");
        if ($resultado != null) {
            $arxiu = $resultado->fetch_assoc();
            $nomArxiu = $arxiu["Arxiu"];
            
            $resultado = $gestorBD->realizarCambios("DELETE FROM arxiucompartit WHERE idArxiuCompartit = $idArchivo AND IdModul = $modul");

            if ($resultado) {
                unlink("../arxiusCompartits/modul$modul/" . $nomArxiu);
                echo "true";
            }else
                echo "errorBorrarArxiu";
        }else
            echo "errorEncontrarArxiu";
    }

    if (isset($_FILES["arxiuCompartit"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $archivo = $_FILES["arxiuCompartit"];
        $nom = $_POST["nomArxiu"];
        $descripcio = $_POST["descripcioArxiu"];
        //Compruebo que no exista un archivo con ese nombre
        $resultado = $gestorBD->realizarQuery("SELECT Nom FROM arxiucompartit WHERE IdModul = $modul AND Nom = '$nom'");

        //Saco la extension del archivo para guardarlo como el mismo
        $arrayNombre = explode(".", $archivo["name"]);
        $extension = end($arrayNombre);

        //Quito los espacios en blanco para que no haya errores
        $nombreArchivo = str_replace(" ", "_", $nom . "." . $extension);
    
        if ($resultado == null) {
            //Primero sus datos en la base de datos
            $resultado = $gestorBD->realizarCambios("INSERT INTO arxiucompartit 
                                        (IdModul, Nom, Descripcio, Arxiu) 
                                    VALUES 
                                        ($modul, '$nom', '$descripcio', '$nombreArchivo')");
            if ($resultado) {
                $ruta = "../arxiusCompartits/modul" . $modul;
                if (file_exists($ruta)) {
                    move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
                }else{
                    mkdir($ruta);
                    move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
                }
                echo "true";
            }else
                echo "errorBD";
        }else
            echo "existeArchivo";

    }

    if (isset($_POST["cargarAlumnos"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    alumne.idAlumne as idAlumne,
                                                    alumne.Usuari as usuari
                                                FROM alumne
                                                JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                                JOIN modul ON modul.idModul = avaluacio.IdModul
                                                WHERE
                                                avaluacio.idModul = $modul
                                                GROUP BY alumne.idAlumne");

        $alumnoModul = "";
        $alumnosCojidos = "";
        if ($resultado != null) {
            while ($alumno = $resultado->fetch_assoc()) {
                $alumnoModul .= ";" . $alumno["idAlumne"] . "-" . $alumno["usuari"];
                $alumnosCojidos .= ", " . $alumno["idAlumne"];
            }
        }

        if ($alumnosCojidos != "") {
            $alumnosCojidos = " AND alumne.idAlumne NOT IN (" . substr($alumnosCojidos, 1) . ")";
        }

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    alumne.idAlumne as idAlumne,
                                                    alumne.Usuari as usuari
                                                FROM alumne
                                                LEFT JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                                LEFT JOIN modul ON modul.idModul = avaluacio.IdModul
                                                WHERE
                                                    (avaluacio.idModul != $modul OR avaluacio.idModul IS NULL)
                                                    $alumnosCojidos
                                                    GROUP BY alumne.idAlumne");

        $todosAlumnos = "";
        if ($resultado != null) {
            while ($alumnos = $resultado->fetch_assoc()) {
                $todosAlumnos .= ";" . $alumnos["idAlumne"] . "-" . $alumnos["usuari"];
            }
        }

        echo substr($alumnoModul, 1) . "|" . substr($todosAlumnos, 1); 
    }

    if (isset($_POST["anadirAlumnos"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $alumnos = explode(";", $_POST["alumnosAnadir"]);

        $todoBien = true;
        foreach ($alumnos as $key => $idAlumno) {
            $resultado = $gestorBD->realizarCambios("INSERT INTO avaluacio 
                                                        (IdModul,
                                                        IdAlumne)
                                                    VALUES
                                                        ($modul,
                                                        $idAlumno)");  

            if (!$resultado) 
                $todoBien = false;
        }

        if ($todoBien) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["borrarAlumnos"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $alumnos = explode(";", $_POST["alumnosBorrar"]);

        $todoBien = true;
        foreach ($alumnos as $key => $idAlumne) {
            $resultado = $gestorBD->realizarCambios("DELETE FROM avaluacio WHERE IdModul = $modul AND IdAlumne = $idAlumne");  
            
            if (!$resultado) 
                $todoBien = false;
        }

        if ($todoBien) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["anadirAssignatura"])) {
        $gestorBD = new gestorBD();
        $modulo = $_POST["modulo"];

        $assignatura = explode(";", $_POST["assignaturasAnadir"]);

        $todoBien = true;
        foreach ($assignatura as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE assignatura SET idModulo = $modulo WHERE idAssignatura = $value");

            if (!$resultado) {
                $todoBien = false;
            }
        }

        
        if ($todoBien) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["borrarAssignatura"])) {
        $gestorBD = new gestorBD();

        $modulo = $_POST["modulo"];

        $assignatura = explode(";", $_POST["assignaturasBorrar"]);

        $todoBien = true;
        foreach ($assignatura as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE assignatura SET idModulo = NULL WHERE idAssignatura = $value");

            if (!$resultado) {
                $todoBien = false;
            }
        }

        
        if ($todoBien) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["generarArxiu"])) {
        if (checkIdExisteix($_POST["modulo"])) {
            $gestorBD = new gestorBD();

            $textArxiu = sha1(generarArxiuAleatori(20));

            $resultado = $gestorBD->realizarQuery("SELECT Nom FROM modulo WHERE idModulo = " . $_POST["modulo"]);

            if ($resultado != null) {
                $usuari = $resultado->fetch_assoc();
                if(enviarEmail($_POST["emailModulo"], "Nou arxiu de inici de sessio", "Utilitza aquest nou arxiu per iniciar sessio", $usuari["Nom"], $textArxiu, "../archivosModulo"))
                    echo "true";
                else    
                    echo "errorEmail";
            }else   
                echo "errorNom";
        }else   
            echo "noExiste";
    }

    function checkNomExisteix($usuari){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT idModulo FROM modulo WHERE Nom = '$usuari'");

        if ($resultado == null) 
            return false;
        else
            return true;
    }

    function checkIdExisteix($id){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT idModulo FROM modulo WHERE idModulo = '$id'");

        if ($resultado == null) 
            return false;
        else
            return true;
    }

    function generarArxiuAleatori($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    function utf8ize($mixed) {
        if (is_array($mixed)) {
            foreach ($mixed as $key => $value) {
                $mixed[$key] = utf8ize($value);
            }
        } else if (is_string ($mixed)) {
            return utf8_encode($mixed);
        }
        return $mixed;
    }

    if (isset($_POST["codificar"])) {
        echo sha1($_POST["codigo"]);
    }
?>