<?php

include "gestorBD.php";

    /*
     * -Curso
     *      -idCurso 
     *      -nom
     *      -any
     *      -assignaturas
     *          -idAssignatura
     *          -nom
     *          -moduls
     *              -idModul
     *              -horas
     *              -avaluacio
     *                  -nota
     *                  -comentari
     */

    if (isset($_POST["cargarAvaluacionesAlumno"]) && isset($_POST["alumno"])) {
        $gestorBD = new gestorBD();

        $jsonObject = new stdClass();

        $filtroCurso = "";
        if (!empty($_POST["curso"])) {
            $filtroCurso = " AND curso.idCurso = " . $_POST["curso"];
        }
        
        $arrayAvaluaciones = cojerAvaluacioAlumno($_POST["alumno"], $gestorBD, $filtroCurso);
        if ($arrayAvaluaciones != null) {
          
            $jsonObject->avaluaciones = $arrayAvaluaciones;

            $jsonFinal = json_encode($jsonObject);

            echo $jsonFinal;
            
        }else
            echo "noDatos";
    }

    function cojerAvaluacioAlumno($alumno, $gestorBD, $filtroCurso){

        $resultado = $gestorBD->realizarQuery("SELECT curso.Nom as nomCurs, 
                                                    curso.Any as anyCurs, 
                                                    assignatura.Nom as nomAsignatura,
                                                    modul.Hores as horesModul, 
                                                    modul.Nom as nomModul,
                                                    COALESCE(avaluacio.Nota, 0) as notaModul,
                                                    COALESCE(avaluacio.Comentari, '') as comentari
                                                FROM alumne
                                                JOIN avaluacio ON avaluacio.IdAlumne = alumne.idAlumne
                                                JOIN modul ON modul.idModul = avaluacio.IdModul
                                                JOIN assignatura ON assignatura.idAssignatura = modul.IdAssignatura
                                                JOIN curso ON curso.idCurso = assignatura.IdCurs
                                                WHERE alumne.idAlumne = " .$_POST["alumno"] . $filtroCurso);

        if ($resultado != null) {
            $arrayAvaluacio = array();
            while ($datosCurso = $resultado->fetch_assoc()) {
                $cursActual = new stdClass();


                $indexCurso = buscarExisteCurso($arrayAvaluacio, $datosCurso["nomCurs"]);
                if ($indexCurso != -1) {
                    $cursActual = $arrayAvaluacio[$indexCurso];

                    $indexAssignatura = buscarExisteAssignatura($cursActual->assignaturas, $datosCurso["nomAsignatura"]);
                    if ($indexAssignatura == -1) {
                        $novaAssignatura = new stdClass();
                        $novaAssignatura->nombreAssignatura = utf8ize($datosCurso["nomAsignatura"]);
                        $novaAssignatura->notaMediaAssignatura = 0;

                        $nouModul = new stdClass();
                        $nouModul->nomModul = utf8ize($datosCurso["nomModul"]);
                        $nouModul->horesModul = utf8ize($datosCurso["horesModul"]);
                        $nouModul->notaModul = utf8ize($datosCurso["notaModul"]);
                        $nouModul->comentariModul = utf8ize($datosCurso["comentari"]);

                        //Si ya existe le añadimos nota a las actuales sino la rellenamos
                        if (isset($novaAssignatura->horasAssignatura)) 
                            $novaAssignatura->horasAssignatura += $nouModul->horesModul;
                        else
                            $novaAssignatura->horasAssignatura = $nouModul->horesModul;

                        $cursActual->horasCurso += $nouModul->horesModul;
                       
                        $novaAssignatura->modulos[] = $nouModul;
                        $cursActual->assignaturas[] = $novaAssignatura;
                    }else{
                        $assignaturaActual = $cursActual->assignaturas[$indexAssignatura];

                        $nouModul = new stdClass();
                        $nouModul->nomModul = utf8ize($datosCurso["nomModul"]);
                        $nouModul->horesModul = utf8ize($datosCurso["horesModul"]);
                        $nouModul->notaModul = utf8ize($datosCurso["notaModul"]);
                        $nouModul->comentariModul = utf8ize($datosCurso["comentari"]);

                        $assignaturaActual->horasAssignatura += $nouModul->horesModul;

                        $cursActual->horasCurso += $nouModul->horesModul;

                        $assignaturaActual->modulos[] = $nouModul;                
                    }



                }else{
                    $cursActual->nomCurs = utf8ize($datosCurso["nomCurs"]);
                    $cursActual->anyCurs = utf8ize($datosCurso["anyCurs"]);
                    $cursActual->notaMediaCurso = 0;

                    $novaAssignatura = new stdClass();
                    $novaAssignatura->nombreAssignatura = utf8ize($datosCurso["nomAsignatura"]);
                    $novaAssignatura->notaMediaAssignatura = 0;
                    
                    $nouModul = new stdClass();
                    $nouModul->nomModul = utf8ize($datosCurso["nomModul"]);
                    $nouModul->horesModul = utf8ize($datosCurso["horesModul"]);
                    $nouModul->notaModul = utf8ize($datosCurso["notaModul"]);
                    $nouModul->comentariModul = utf8ize($datosCurso["comentari"]);

                    //Relleno aqui las horas para usarlas despues en lxas notas
                    $novaAssignatura->horasAssignatura = $nouModul->horesModul;

                    //Si ya existe le añadimos nota a las actuales sino la rellenamos
                    if (isset($cursActual->horasCurso)) 
                        $cursActual->horasCurso += $novaAssignatura->horasAssignatura;
                    else
                        $cursActual->horasCurso = $novaAssignatura->horasAssignatura;

                    $novaAssignatura->modulos[] = $nouModul;
                    $cursActual->assignaturas[] = $novaAssignatura;
                    $arrayAvaluacio[] = $cursActual;  
                }
            }
            calcularNotas($arrayAvaluacio);
            
            return $arrayAvaluacio;     
        }else
            return null;
    }

    function calcularNotas(&$arrayAvaluaciones){
        foreach ($arrayAvaluaciones as $key => $curso) {
            foreach ($curso->assignaturas as $key => $assignatura) {
                foreach ($assignatura->modulos as $key => $modulo) {
                    $assignatura->notaMediaAssignatura += round($modulo->notaModul/$assignatura->horasAssignatura*$modulo->horesModul, 3);
                }
                $curso->notaMediaCurso += round($assignatura->notaMediaAssignatura/$curso->horasCurso*$assignatura->horasAssignatura, 3     );
            }
        }
    }

    function buscarExisteCurso($arrayAvaluacio, $nombreCurso){
        foreach ($arrayAvaluacio as $key => $value) {
            if ($value->nomCurs == $nombreCurso) {
                return $key;
            }
        }

        return -1;
    }

    function buscarExisteAssignatura($assignaturas, $nombreAssignatura){
        foreach ($assignaturas as $key => $value) {
            if ($value->nombreAssignatura == $nombreAssignatura) {
                return $key;
            }
        }

        return -1;
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
    
?>