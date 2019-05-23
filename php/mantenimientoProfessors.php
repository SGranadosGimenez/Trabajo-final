<?php

    include "gestorBD.php";
    include "enviarEmails.php";

    /* COJER PROFESSORES */
    if (isset($_POST["cojerProfessores"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idProfessor, 
                                                    Usuari
                                                FROM professor");

        $professoresValor = "";

        while ($professor = $resultado->fetch_assoc()) {
            $professoresValor .= ";" . $professor["idProfessor"] . "/" . $professor["Usuari"];
        }

        echo substr($professoresValor, 1);
    }

    /* COJER alumnos */
    if (isset($_POST["cojerAlumnos"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idAlumne, 
                                                    Usuari
                                                FROM alumne");

        $alumnoValor = "";

        while ($alumno = $resultado->fetch_assoc()) {
            $alumnoValor .= ";" . $alumno["idAlumne"] . "/" . $alumno["Usuari"];
        }

        echo substr($alumnoValor, 1);
    }

    /* COJO LA INFORMACON DEL PROFESSOR SELECCIONADO */
    if (isset($_POST["informacionProfessor"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    Usuari as Usuari,
                                                    Contrasenya as Contrasenya,
                                                    Nom as Nom,
                                                    PrimerCognom as PrimerCognom,
                                                    SegonCognom as SegonCognom,
                                                    Sexe as Sexe,
                                                    DNI as DNI,
                                                    DataNaixement as DataNaixement,
                                                    Nacionalitat as Nacionalitat,
                                                    LlocNaixement as LlocNaixement,
                                                    NumSeguretatSocial as NumSeguretatSocial,
                                                    CorreuElectronic as CorreuElectronic,
                                                    Telefon as Telefon,
                                                    TelefonMobil as TelefonMobil,
                                                    Direccio as Direccio 
                                                FROM professor 
                                                WHERE idProfessor = " . $_POST["professorBuscado"]);
        if ($resultado != null) {
            $datosProfessor = $resultado->fetch_assoc();
            
            $professor = new stdClass();
            $professor->usuario = utf8ize($datosProfessor["Usuari"]);
            $professor->contrasenya = utf8ize($datosProfessor["Contrasenya"]);
            $professor->nom = utf8ize($datosProfessor["Nom"]);
            $professor->primerCognom = utf8ize($datosProfessor["PrimerCognom"]);
            $professor->segonCognom = utf8ize($datosProfessor["SegonCognom"]);
            $professor->sexe = utf8ize($datosProfessor["Sexe"]);
            $professor->dni = utf8ize($datosProfessor["DNI"]);
            $professor->dataNaixement = utf8ize($datosProfessor["DataNaixement"]);
            $professor->nacionalitat = utf8ize($datosProfessor["Nacionalitat"]);
            $professor->llocNaixement = utf8ize($datosProfessor["LlocNaixement"]);
            $professor->numSeguretatSocial = utf8ize($datosProfessor["NumSeguretatSocial"]);
            $professor->correuElectronic = utf8ize($datosProfessor["CorreuElectronic"]);
            $professor->telefon = utf8ize($datosProfessor["Telefon"]);
            $professor->telefonMobil = utf8ize($datosProfessor["TelefonMobil"]);
            $professor->direccio = utf8ize($datosProfessor["Direccio"]);

            echo json_encode($professor);
        }else
            echo "No se han encontrado resultados";
    }

    /* CREAR PROFESSOR */
    if (isset($_POST["crearProfessor"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        
        if(checkUsuariExisteix($valores[1])){
            echo "usuariExisteix";
        }else{
            $usuari = $valores[0];
            $contrasenya = $valores[1];
            $nom = $valores[2];
            $primerCognom = $valores[3];
            $segonCognom = $valores[4];
            $sexe = $valores[5];
            $dni = $valores[6];
            $dataNaixement = $valores[7];
            $nacionalitat = $valores[8];
            $llocNaixement = $valores[9];
            $numSeguretatSocial = $valores[10];
            $correuElectronic = $valores[11];
            $telefon = $valores[12];
            $telefonMobil = $valores[13];
            $direccio = $valores[14];
            
            $query = "INSERT INTO professor 
                        (Usuari, 
                        Contrasenya, 
                        Nom, 
                        PrimerCognom, 
                        SegonCognom, 
                        Sexe, 
                        DNI, 
                        DataNaixement, 
                        Nacionalitat, 
                        LlocNaixement, 
                        NumSeguretatSocial, 
                        CorreuElectronic, 
                        Telefon, 
                        TelefonMobil, 
                        Direccio) 
                    VALUES 
                        ('$usuari', 
                        '$contrasenya', 
                        '$nom', 
                        '$primerCognom', 
                        '$segonCognom', 
                        '$sexe', 
                        '$dni', 
                        '$dataNaixement', 
                        '$nacionalitat', 
                        '$llocNaixement', 
                        '$numSeguretatSocial', 
                        '$correuElectronic', 
                        '$telefon', 
                        '$telefonMobil', 
                        '$direccio')";
            $resultado = $gestorBD->realizarCambios($query);
            
            if ($resultado) 
                echo "true";
            else
                echo "false";
        }
    }

    /* MODIFICAR PROFESSOR */
    if (isset($_POST["modificarProfessor"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        
        $usuari = $valores[0];
        $contrasenya = $valores[1];
        $nom = $valores[2];
        $primerCognom = $valores[3];
        $segonCognom = $valores[4];
        $sexe = $valores[5];
        $dni = $valores[6];
        $dataNaixement = $valores[7];
        $nacionalitat = $valores[8];
        $llocNaixement = $valores[9];
        $numSeguretatSocial = $valores[10];
        $correuElectronic = $valores[11];
        $telefon = $valores[12];
        $telefonMobil = $valores[13];
        $direccio = $valores[14];
        $idProfessor = $valores[15];

        $query = "UPDATE professor 
                    SET
                        Usuari = '$usuari', 
                        Contrasenya = '$contrasenya', 
                        Nom = '$nom', 
                        PrimerCognom = '$primerCognom', 
                        SegonCognom = '$segonCognom', 
                        Sexe = '$sexe', 
                        DNI = '$dni', 
                        DataNaixement = '$dataNaixement', 
                        Nacionalitat = '$nacionalitat', 
                        LlocNaixement = '$llocNaixement', 
                        NumSeguretatSocial = '$numSeguretatSocial', 
                        CorreuElectronic = '$correuElectronic', 
                        Telefon = '$telefon', 
                        TelefonMobil = '$telefonMobil', 
                        Direccio = '$direccio'
                    WHERE idProfessor = $idProfessor";

        $resultado = $gestorBD->realizarCambios($query);
        
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["eliminarProfessor"])) {
        $gestorBD = new gestorBD();

        $professor = $_POST["professorBuscado"];

        $resultado = $gestorBD->realizarQuery("SELECT admin FROM professor WHERE idProfessor = $professor");
        if ($resultado != null) {
            $admin = $resultado->fetch_assoc();
            if ($admin["admin"] != 1) {
                $resultado = $gestorBD->realizarCambios("DELETE FROM professor WHERE idProfessor = $professor");
                
                if ($resultado) 
                    echo "true";
                else
                    echo "false";
            }else
                echo "errorAdmin";
        }else{
            echo "false";
        }
    }

    if (isset($_POST["cargarAlumnos"])) {
        $gestorBD = new gestorBD();

        $professor = $_POST["professor"];

        $resultado = $gestorBD->realizarQuery("SELECT
                                                    idAlumne as idAlumne,
                                                    Usuari as usuari
                                                FROM alumne 
                                                WHERE
                                                idTutor = $professor");

        $alumnosProfessor = "";
        if ($resultado != null) {
            while ($alumnos = $resultado->fetch_assoc()) {
                $alumnosProfessor .= ";" . $alumnos["idAlumne"] . "-" . $alumnos["usuari"];
            }
        }

        $resultado = $gestorBD->realizarQuery("SELECT
                                                    idAlumne as idAlumne,
                                                    Usuari as usuari
                                                FROM alumne
                                                WHERE
                                                    idTutor != $professor OR idTutor IS NULL");

        $todosAlumnos = "";
        if ($resultado != null) {
            while ($alumnos = $resultado->fetch_assoc()) {
                $todosAlumnos .= ";" . $alumnos["idAlumne"] . "-" . $alumnos["usuari"];
            }
        }

        echo substr($alumnosProfessor, 1) . "|" . substr($todosAlumnos, 1); 
    }

    if (isset($_POST["cargarAssignatura"])) {
        $gestorBD = new gestorBD();

        $professor = $_POST["professor"];

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idAssignatura as idAssignatura, 
                                                    Nom as nom
                                                FROM assignatura
                                                WHERE
                                                idProfessor = $professor");

        $assignaturasProfessor = "";
        if ($resultado != null) {
            while ($assignatura = $resultado->fetch_assoc()) {
                $assignaturasProfessor .= ";" . $assignatura["idAssignatura"] . "-" . $assignatura["nom"];
            }
        }

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    idAssignatura as idAssignatura, 
                                                    Nom as nom
                                                FROM assignatura
                                                WHERE
                                                idProfessor != $professor OR idProfessor IS NULL");

        $todasAssignaturas = "";
        if ($resultado != null) {
            while ($assignatura = $resultado->fetch_assoc()) {
                $todasAssignaturas .= ";" . $assignatura["idAssignatura"] . "-" . $assignatura["nom"];
            }
        }

        echo substr($assignaturasProfessor, 1) . "|" . substr($todasAssignaturas, 1); 
    }

    if (isset($_POST["anadirAlumnos"])) {
        $gestorBD = new gestorBD();

        $professor = $_POST["professor"];

        $alumnos = explode(";", $_POST["alumnosAnadir"]);

        $todoBien = true;
        foreach ($alumnos as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE alumne SET IdTutor = $professor WHERE idAlumne = $value");  

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

        $professor = $_POST["professor"];

        $alumnos = explode(";", $_POST["alumnosBorrar"]);

        $todoBien = true;
        foreach ($alumnos as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE alumne SET IdTutor = NULL WHERE idAlumne = $value");  
            
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
        $professor = $_POST["professor"];

        $assignatura = explode(";", $_POST["assignaturasAnadir"]);

        $todoBien = true;
        foreach ($assignatura as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE assignatura SET idProfessor = $professor WHERE idAssignatura = $value");

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

        $professor = $_POST["professor"];

        $assignatura = explode(";", $_POST["assignaturasBorrar"]);

        $todoBien = true;
        foreach ($assignatura as $key => $value) {
            $resultado = $gestorBD->realizarCambios("UPDATE assignatura SET idProfessor = NULL WHERE idAssignatura = $value");

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
        if (checkIdExisteix($_POST["professor"])) {
            $gestorBD = new gestorBD();

            $textArxiu = sha1(generarArxiuAleatori(20));

            $resultado = $gestorBD->realizarQuery("SELECT Usuari FROM professor WHERE idProfessor = " . $_POST["professor"]);

            if ($resultado != null) {
                $usuari = $resultado->fetch_assoc();
                $resultado = $gestorBD->realizarCambios("UPDATE professor SET archivoInicioSession = '" . $usuari["Usuari"] . ".txt' WHERE idProfessor = " . $_POST["professor"]);
                if ($resultado) {
                    if(enviarEmail($_POST["emailProfessor"], "Nou arxiu de inici de sessio", "Utilitza aquest nou arxiu per iniciar sessio", $usuari["Usuari"] . ".txt", $textArxiu, "../archivosProfessor"))
                        echo "true";
                    else    
                        echo "errorEmail";
                }else
                    echo "errorBD";
            }else   
                echo "errorUsuari";
        }else   
            echo "noExiste";
    }

    function checkUsuariExisteix($usuari){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT idProfessor FROM professor WHERE Usuari = '$usuari'");

        if ($resultado == null) 
            return false;
        else
            return true;
    }

    function checkIdExisteix($id){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT idProfessor FROM professor WHERE idProfessor = '$id'");

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