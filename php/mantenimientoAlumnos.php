<?php

    include "gestorBD.php";
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

    /* COJO LA INFORMACON DEL ALUMNO SELECCIONADO */
    if (isset($_POST["informacionAlumno"])) {
        $gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    COALESCE(p.idProfessor, '') as idProfessor,
                                                    COALESCE(p.Usuari, '') as profUsuari,
                                                    a.Usuari as Usuari,
                                                    a.Contrasenya as Contrasenya,
                                                    a.Nom as Nom,
                                                    a.PrimerCognom as PrimerCognom,
                                                    a.SegonCognom as SegonCognom,
                                                    a.EnviarInformacioPares as EnviarInformacioPares,
                                                    a.FamiliaNombrosa as FamiliaNombrosa,
                                                    a.Sexe as Sexe,
                                                    a.DNI as DNI,
                                                    a.DataNaixement as DataNaixement,
                                                    a.Nacionalitat as Nacionalitat,
                                                    a.LlocNaixement as LlocNaixement,
                                                    a.NumSeguretatSocial as NumSeguretatSocial,
                                                    a.CorreuElectronic as CorreuElectronic,
                                                    a.Telefon as Telefon,
                                                    a.TelefonMobil as TelefonMobil,
                                                    a.Adreca as Adreca 
                                                FROM alumne as a 
                                                LEFT JOIN professor as p ON p.idProfessor = a.IdTutor 
                                                WHERE idAlumne = " . $_POST["alumnoBuscado"]);
        if ($resultado != null) {
            $datosAlumno = $resultado->fetch_assoc();
            
            $alumno = new stdClass();
            $alumno->tutor = utf8ize([$datosAlumno["idProfessor"], $datosAlumno["profUsuari"]]);
            $alumno->usuario = utf8ize($datosAlumno["Usuari"]);
            $alumno->contrasenya = utf8ize($datosAlumno["Contrasenya"]);
            $alumno->nom = utf8ize($datosAlumno["Nom"]);
            $alumno->primerCognom = utf8ize($datosAlumno["PrimerCognom"]);
            $alumno->segonCognom = utf8ize($datosAlumno["SegonCognom"]);
            $alumno->enviarInformacioPares = utf8ize($datosAlumno["EnviarInformacioPares"]);
            $alumno->familiaNombrosa = utf8ize($datosAlumno["FamiliaNombrosa"]);
            $alumno->sexe = utf8ize($datosAlumno["Sexe"]);
            $alumno->dni = utf8ize($datosAlumno["DNI"]);
            $alumno->dataNaixement = utf8ize($datosAlumno["DataNaixement"]);
            $alumno->nacionalitat = utf8ize($datosAlumno["Nacionalitat"]);
            $alumno->llocNaixement = utf8ize($datosAlumno["LlocNaixement"]);
            $alumno->numSeguretatSocial = utf8ize($datosAlumno["NumSeguretatSocial"]);
            $alumno->correuElectronic = utf8ize($datosAlumno["CorreuElectronic"]);
            $alumno->telefon = utf8ize($datosAlumno["Telefon"]);
            $alumno->telefonMobil = utf8ize($datosAlumno["TelefonMobil"]);
            $alumno->adreca = utf8ize($datosAlumno["Adreca"]);

            echo json_encode($alumno);
        }else
            echo "";
    }

    /* CREAR ALUMNO */
    if (isset($_POST["crearAlumno"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        
        if(checkUsuariExisteix($valores[1])){
            echo "usuariExisteix";
        }else{
            $idTutor = $valores[0];
            $usuari = $valores[1];
            $contrasenya = $valores[2];
            $nom = $valores[3];
            $primerCognom = $valores[4];
            $segonCognom = $valores[5];
            $enviarInformacioPares = $valores[6];
            $familiaNombrosa = $valores[7];
            $sexe = $valores[8];
            $dni = $valores[9];
            $dataNaixement = $valores[10];
            $nacionalitat = $valores[11];
            $llocNaixement = $valores[12];
            $numSeguretatSocial = $valores[13];
            $correuElectronic = $valores[14];
            $telefon = $valores[15];
            $telefonMobil = $valores[16];
            $adreca = $valores[17];
            
            $query = "INSERT INTO alumne 
                        (idTutor, 
                        Usuari, 
                        Contrasenya, 
                        Nom, 
                        PrimerCognom, 
                        SegonCognom, 
                        EnviarInformacioPares, 
                        FamiliaNombrosa, 
                        Sexe, 
                        DNI, 
                        DataNaixement, 
                        Nacionalitat, 
                        LlocNaixement, 
                        NumSeguretatSocial, 
                        CorreuElectronic, 
                        Telefon, 
                        TelefonMobil, 
                        Adreca) 
                    VALUES 
                        ($idTutor, 
                        '$usuari', 
                        '$contrasenya', 
                        '$nom', 
                        '$primerCognom', 
                        '$segonCognom', 
                        $enviarInformacioPares, 
                        $familiaNombrosa, 
                        '$sexe', 
                        '$dni', 
                        '$dataNaixement', 
                        '$nacionalitat', 
                        '$llocNaixement', 
                        '$numSeguretatSocial', 
                        '$correuElectronic', 
                        '$telefon', 
                        '$telefonMobil', 
                        '$adreca')";
            $resultado = $gestorBD->realizarCambios($query);
            
            if ($resultado) 
                echo "true";
            else
                echo "false";
        }
    }

    /* CREAR ALUMNO */
    if (isset($_POST["modificarAlumno"])) {
        $gestorBD = new gestorBD();

        $valores = explode(";", $_POST["datos"]);
        
        $idTutor = $valores[0];
        $usuari = $valores[1];
        $contrasenya = $valores[2];
        $nom = $valores[3];
        $primerCognom = $valores[4];
        $segonCognom = $valores[5];
        $enviarInformacioPares = $valores[6];
        $familiaNombrosa = $valores[7];
        $sexe = $valores[8];
        $dni = $valores[9];
        $dataNaixement = $valores[10];
        $nacionalitat = $valores[11];
        $llocNaixement = $valores[12];
        $numSeguretatSocial = $valores[13];
        $correuElectronic = $valores[14];
        $telefon = $valores[15];
        $telefonMobil = $valores[16];
        $adreca = $valores[17];
        $idAlumne = $valores[18];

        $query = "UPDATE alumne 
                    SET
                        idTutor = $idTutor, 
                        Usuari = '$usuari', 
                        Contrasenya = '$contrasenya', 
                        Nom = '$nom', 
                        PrimerCognom = '$primerCognom', 
                        SegonCognom = '$segonCognom', 
                        EnviarInformacioPares = $enviarInformacioPares, 
                        FamiliaNombrosa = $familiaNombrosa, 
                        Sexe = '$sexe', 
                        DNI = '$dni', 
                        DataNaixement = '$dataNaixement', 
                        Nacionalitat = '$nacionalitat', 
                        LlocNaixement = '$llocNaixement', 
                        NumSeguretatSocial = '$numSeguretatSocial', 
                        CorreuElectronic = '$correuElectronic', 
                        Telefon = '$telefon', 
                        TelefonMobil = '$telefonMobil', 
                        Adreca = '$adreca'
                    WHERE idAlumne = $idAlumne";
        $resultado = $gestorBD->realizarCambios($query);
        
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["eliminarAlumno"])) {
        $gestorBD = new gestorBD();

        $alumno = $_POST["alumnoBuscado"];

        $resultado = $gestorBD->realizarCambios("DELETE FROM alumne WHERE idAlumne = $alumno");
            
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["cargarModulos"])) {
        $gestorBD = new gestorBD();

        $alumno = $_POST["alumno"];

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    modul.idModul as idModul, 
                                                    modul.Nom as nom
                                                FROM alumne
                                                JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                                JOIN modul ON modul.IdModul = avaluacio.idModul
                                                WHERE
                                                    alumne.idAlumne = $alumno");

        $modulosAlumno = "";
        $modulosSeleccionados = "";
        if ($resultado != null) {
            while ($modulos = $resultado->fetch_assoc()) {
                $modulosAlumno .= ";" . $modulos["idModul"] . "-" . $modulos["nom"];
                $modulosSeleccionados .= ", " . $modulos["idModul"];
            }
        }

        if (trim($modulosSeleccionados) != "") {
            $modulosSeleccionados = "WHERE idModul NOT IN (" . substr($modulosSeleccionados, 1) . ")";
        }

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    modul.idModul as idModul, 
                                                    modul.Nom as nom
                                                FROM modul
                                                $modulosSeleccionados");

        $todosModulos = "";
        if ($resultado != null) {
            while ($modulos = $resultado->fetch_assoc()) {
                $todosModulos .= ";" . $modulos["idModul"] . "-" . $modulos["nom"];
            }
        }

        echo substr($modulosAlumno, 1) . "|" . substr($todosModulos, 1); 
    }

    if (isset($_POST["anadirModulos"])) {
        $gestorBD = new gestorBD();
        $alumno = $_POST["alumno"];

        $modulos = explode(";", $_POST["modulosAnadir"]);

        $valuesIntroducir = "";
        foreach ($modulos as $key => $value) {
            $valuesIntroducir .= ", (" . $value . ", $alumno)";
        }
        $valuesIntroducir = substr($valuesIntroducir, 1);
        $resultado = $gestorBD->realizarCambios("INSERT INTO avaluacio (IdModul, IdAlumne) VALUES $valuesIntroducir");
        
        if ($resultado) 
            echo "true";
        else
            echo "false";
    }

    if (isset($_POST["borrarModulos"])) {
        $gestorBD = new gestorBD();

        $alumno = $_POST["alumno"];

        $modulos = explode(";", $_POST["modulosBorrar"]);

        $todoBien = true;
        foreach ($modulos as $key => $value) {
            $resultado = $gestorBD->realizarCambios("DELETE FROM avaluacio WHERE IdModul = " . $value . " AND IdAlumne = $alumno");  
            if (!$resultado) 
                $todoBien = false;
        }

        if ($todoBien) 
            echo "true";
        else
            echo "false";
    }

    function checkUsuariExisteix($usuari){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT idAlumne FROM alumne WHERE Usuari = '$usuari'");

        if ($resultado == null) 
            return false;
        else
            return true;
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