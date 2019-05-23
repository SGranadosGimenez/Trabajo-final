<?php

    include "gestorBD.php";

    /*Json orden:
    *
    *  -faltas
    *       -ArrayFaltas
    *           -estat
    *           -hora
    *           -fecha
    *           -nom
    *  -modulos
    *      - NomModul
    *      - idModul
    * 
    */
    if(isset($_POST["prepararFaltasAssistencia"])){
        $gestorBD = new gestorBD();

        $arrayFaltas = cojerFaltas($_POST["alumno"], "tots");
        if ($arrayFaltas != null) {
            
            $jsonObject = new stdClass();

            $jsonObject->faltasAssistencia = $arrayFaltas;

            
            $arrayModulos = cojerModulos();

            if ($arrayModulos != null) {
                $jsonObject->modulos = $arrayModulos;

                $jsonFinal = json_encode($jsonObject);

                echo $jsonFinal;
            }else
            echo "noModulos";
        }else
            echo "noFaltas";
    }

    if (isset($_POST["actualizarFaltas"])) {
        $jsonObject = new stdClass();

        $jsonObject->faltasAssistencia = cojerFaltas($_POST["alumno"], $_POST["moduloElegido"]);
        if ($jsonObject->faltasAssistencia == null) {
            echo "noFaltas";
        }else
            echo json_encode($jsonObject);
    }

    function cojerModulos(){
        $gestorBD = new gestorBD();
        
        $resultado = $gestorBD->realizarQuery("SELECT
                                                    modul.nom as nom,
                                                    modul.idModul as idModul
                                                FROM alumne
                                                JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                                JOIN modul ON avaluacio.IdModul = modul.idModul
                                                WHERE
                                                    alumne.idAlumne = " . $_POST["alumno"] . "
                                                ORDER BY modul.nom");
        if ($resultado != null) {
            // Cojo todos los modulos para pasarlos
            $arrayModulos;
            while ($modulosDatos = $resultado->fetch_assoc()) {
                $moduloActual = new stdClass();

                $moduloActual->nom = $modulosDatos["nom"];
                $moduloActual->idModul = $modulosDatos["idModul"];

                $arrayModulos[] = $moduloActual;
            }
            return $arrayModulos;
        }
        return null;
    }

    function cojerFaltas($alumno, $modulo){
        $gestorBD = new gestorBD();

        $sqlModulo = "";
        if ($modulo != "tots") {
            $sqlModulo = "AND modul.idModul = $modulo";
        }

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                assistencia.Estat as estat, 
                                                sessio.Hora as hora,
                                                sessio.Fecha as fecha, 
                                                modul.Nom as nom,
                                                assistencia.idAssistencia as idAssistencia
                                            FROM assistencia
                                            JOIN sessio ON sessio.idSession = assistencia.IdSessio
                                            JOIN modul ON modul.idModul = sessio.IdModul
                                            WHERE 
                                                assistencia.IdAlumne = " . $alumno . "
                                                $sqlModulo
                                            ORDER BY sessio.Fecha , sessio.Hora");
        if ($resultado == null) {
            return null;
        }

        $arrayFaltas;
        //Cojo todas las assistencias y las convierto en un objeto json
        while ($faltas = $resultado->fetch_assoc()) {
            $faltaActual = new stdClass();

            $faltaActual->estat =  $faltas["estat"];
            $faltaActual->hora =  $faltas["hora"];
            $faltaActual->fecha =  $faltas["fecha"];
            $faltaActual->nom =  $faltas["nom"];
            $faltaActual->idAssistencia = $faltas["idAssistencia"];

            $arrayFaltas[] = $faltaActual;
        }

        return $arrayFaltas;
    }

    if (isset($_POST["justificarFaltas"])) {
        $gestorBD = new gestorBD();

        $idAssistencia = $_POST["assistenciaSeleccionada"];

        $resultado = $gestorBD->realizarCambios("UPDATE assistencia SET Estat = 'justificada' WHERE idAssistencia = $idAssistencia");

        if ($resultado) 
            echo "true";
        else
            echo "false";
    }
?>