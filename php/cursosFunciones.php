<?php

    include "gestorBD.php";

    if (isset($_POST["cargarCursosAlumno"])) {
        $gestorBD = new gestorBD();

        $jsonObject = new stdClass();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                curso.idCurso as idCurso,
                                                curso.Nom as nom
                                            FROM alumne
                                            JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                            JOIN modul ON modul.idModul = avaluacio.IdModul
                                            JOIN assignatura ON assignatura.idAssignatura = modul.IdAssignatura
                                            JOIN curso ON curso.idCurso = assignatura.IdCurs
                                            WHERE 
                                                alumne.idAlumne = " .$_POST["alumno"] . "
                                            GROUP BY curso.idCurso");
        if ($resultado != null) {
            // Cojo todos los modulos para pasarlos
            $arrayCursos;
            while ($cursoDatos = $resultado->fetch_assoc()) {
                $cursoActual = new stdClass();

                $cursoActual->nom = $cursoDatos["nom"];
                $cursoActual->idCurso = $cursoDatos["idCurso"];

                $arrayCursos[] = $cursoActual;
            }
            
            $jsonObject->cursos = $arrayCursos;

            $jsonFinal = json_encode($jsonObject);

            echo $jsonFinal;
        }
        return null;
    }
?>