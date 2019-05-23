<?php
    include "gestorBD.php";

    /* Printa todas las entregas del valor seleccionado en el select d'entregas de un alumno*/
	if(isset($_POST["Printarentregas"])){

		$gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    modul.Nom as modulnom, 
                                                    assignatura.Nom as nomas, 
                                                    entrega.Nom as Nom, 
                                                    entrega.Descripcio as Descripcio, 
                                                    entrega.DataInicial as DataInicial, 
                                                    entrega.DataEntrega as DataEntrega, 
                                                    entrega.DataFinal as DataFinal, 
                                                    entrega.ArxiuAdjunt as ArxiuAdjunt,
                                                    entrega.idEntrega as idEntrega,  
                                                    evaluarentrega.Fitxer as fitxerEntregat, 
                                                    evaluarentrega.Nota as notaEntrega 
                                                FROM assignatura 
                                                JOIN modul ON modul.IdAssignatura = assignatura.idAssignatura 
                                                JOIN entrega ON entrega.IdModul = modul.idModul 
                                                INNER JOIN evaluarentrega ON evaluarentrega.IdEntrega = entrega.idEntrega 
                                                WHERE evaluarentrega.IdAlumne = " . $_POST["alumno"] ." 
                                                ORDER BY entrega.DataEntrega DESC");
    
		$entrega = array();
		if($resultado != null){
			while($datosentrega = $resultado->fetch_assoc()){
				$datos = new stdClass();
				$datos->Nom = utf8ize($datosentrega["Nom"]);
				$datos->modul = utf8ize($datosentrega["modulnom"]);
				$datos->nomas = utf8ize($datosentrega["nomas"]);
				$datos->Descripcio = utf8ize($datosentrega["Descripcio"]);
				$datos->DataInicial = utf8ize($datosentrega["DataInicial"]);
				$datos->DataEntrega = utf8ize($datosentrega["DataEntrega"]);
				$datos->DataFinal = utf8ize($datosentrega["DataFinal"]);
                $datos->ArxiuAdjunt = utf8ize($datosentrega["ArxiuAdjunt"]);
                $datos->idEntrega = utf8ize($datosentrega["idEntrega"]);
				$datos->fitxerEntregat = utf8ize($datosentrega["fitxerEntregat"]);
                $datos->notaEntrega = utf8ize($datosentrega["notaEntrega"]);
                
				$entrega[] = $datos;
			}
			$co = new stdClass();
			$co->array = $entrega;
			echo json_encode($co);
		}else{
			echo "string";
		}
    }

    /* Printa todas las entregas del valor seleccionado en el select d'entregas de un alumno*/
	if(isset($_POST["PrintarentregasModul"])){

		$gestorBD = new gestorBD();

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    modul.Nom as modulnom, 
                                                    assignatura.Nom as nomas, 
                                                    entrega.Nom as Nom, 
                                                    entrega.Descripcio as Descripcio, 
                                                    entrega.DataInicial as DataInicial, 
                                                    entrega.DataEntrega as DataEntrega, 
                                                    entrega.DataFinal as DataFinal, 
                                                    entrega.ArxiuAdjunt as ArxiuAdjunt,
                                                    entrega.idEntrega as idEntrega
                                                FROM assignatura 
                                                JOIN modul ON modul.IdAssignatura = assignatura.idAssignatura 
                                                JOIN entrega ON entrega.IdModul = modul.idModul 
                                                WHERE modul.idModul = " . $_POST["modul"] ." 
                                                ORDER BY entrega.DataEntrega DESC");
    
		$entrega = array();
		if($resultado != null){
			while($datosentrega = $resultado->fetch_assoc()){
				$datos = new stdClass();
				$datos->Nom = utf8ize($datosentrega["Nom"]);
				$datos->modul = utf8ize($datosentrega["modulnom"]);
				$datos->nomas = utf8ize($datosentrega["nomas"]);
				$datos->Descripcio = utf8ize($datosentrega["Descripcio"]);
				$datos->DataInicial = utf8ize($datosentrega["DataInicial"]);
				$datos->DataEntrega = utf8ize($datosentrega["DataEntrega"]);
				$datos->DataFinal = utf8ize($datosentrega["DataFinal"]);
                $datos->ArxiuAdjunt = utf8ize($datosentrega["ArxiuAdjunt"]);
                $datos->idEntrega = utf8ize($datosentrega["idEntrega"]);
                
				$entrega[] = $datos;
			}
			$co = new stdClass();
			$co->array = $entrega;
			echo json_encode($co);
		}else{
			echo "string";
		}
    }

    if (isset($_FILES["pujarArxiuEntregat"])) {
        $gestorBD = new gestorBD();

        $alumno = $_POST["alumno"];
        $entrega = $_POST["entrega"];

        $archivo = $_FILES["pujarArxiuEntregat"];

        //Saco la extension del archivo para guardarlo como el mismo
        $arrayNombre = explode(".", $archivo["name"]);
        $extension = end($arrayNombre);

        //Si es exe no puede subirlo
        if ($extension != "exe") {
            //Quito los espacios en blanco para que no haya errores
            $nombreArchivo = str_replace(" ", "_", $arrayNombre[0] . $entrega . "." . $extension);
        
            //Primero sus datos en la base de datos
            $resultado = $gestorBD->realizarCambios("UPDATE evaluarentrega
                                                    SET
                                                        Fitxer = '$nombreArchivo'
                                                    WHERE IdAlumne = $alumno
                                                        AND IdEntrega = $entrega");
            if ($resultado) {
                $ruta = "../arxiusAlumnes/alumne" . $alumno;
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
            echo "extensionExe";
    }

    if (isset($_POST["decargarArchivoEntregado"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];
        $alumno = $_POST["alumno"];

        $resultado = $gestorBD->realizarQuery("SELECT Fitxer 
                                                FROM evaluarentrega
                                                WHERE IdAlumne = $alumno AND IdEntrega = $entrega");
        if ($resultado != null) {
            $arxiu = $resultado->fetch_assoc();
            $nomArxiu = $arxiu["Fitxer"];
            
            echo "download.php?file=" . $nomArxiu . "&alumno=$alumno&tipoDescarga=trabajoArchivoEntregado";
        }else
            echo "error";
    }
    
    if (isset($_FILES["pujarArxiuAdjunt"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];

        $archivo = $_FILES["pujarArxiuAdjunt"];

        //Saco la extension del archivo para guardarlo como el mismo
        $arrayNombre = explode(".", $archivo["name"]);
        $extension = end($arrayNombre);

        $resultado = $gestorBD->realizarQuery("SELECT
                                                    IdModul
                                                FROM entrega
                                                WHERE idEntrega = $entrega");

        if ($resultado != null) {

            $modul = ($resultado->fetch_assoc())["IdModul"];
            
            //Quito los espacios en blanco para que no haya errores
            $nombreArchivo = str_replace(" ", "_", $arrayNombre[0] . $entrega . "." . $extension);
        
            //Primero sus datos en la base de datos
            $resultado = $gestorBD->realizarCambios("UPDATE entrega
                                                    SET
                                                        ArxiuAdjunt = '$nombreArchivo'
                                                    WHERE idEntrega = $entrega");
            if ($resultado) {
                $ruta = "../enunciadosTrabajos/modul" . $modul;
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
            echo "errorModulo";
    }

    if (isset($_POST["decargarArchivoAdjunto"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];

        $resultado = $gestorBD->realizarQuery("SELECT ArxiuAdjunt, IdModul 
                                                FROM entrega
                                                WHERE idEntrega = $entrega");
        if ($resultado != null) {
            $entrega = $resultado->fetch_assoc();
            $nomArxiu = $entrega["ArxiuAdjunt"];
            $idModul = $entrega["IdModul"];
            
            echo "download.php?file=" . $nomArxiu . "&modul=$idModul&tipoDescarga=trabajoArchivoAdjunto";
        }else
            echo "error";
    }

    if (isset($_POST["eliminarEntrega"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];

        $resultado = $gestorBD->realizarCambios("DELETE FROM entrega WHERE idEntrega = $entrega");
        
        if ($resultado) {
            echo "true";
        }else
            echo "false";
    }

    if (isset($_POST["cargarModulosEntrega"])) {
        $gestorBD = new gestorBD();

        $whereModulo = "";
        if(isset($_SESSION["professorLogeado"])){
            $whereModulo = "JOIN assignatura ON assignatura.idAssignatura = modul.IdAssignatura WHERE assignatura.idProfessor =" . $_SESSION["professorLogeado"];
        }

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    modul.idModul as idModul,
                                                    modul.Nom as nom
                                                FROM modul
                                                $whereModulo");

        if ($resultado != null) {
            $moduloString = "";
            while ($modulo = $resultado->fetch_assoc()) {
                $moduloString .= ";" . $modulo["idModul"] . "/" . $modulo["nom"]; 
            }

            echo substr($moduloString, 1);
        }else
            echo "errorBD";
    }

    if (isset($_POST["cojerEntregas"])) {
        $gestorBD = new gestorBD();

        $modul = $_POST["modul"];

        $resultado = $gestorBD->realizarQuery("SELECT
                                                    idEntrega,
                                                    Nom
                                                FROM entrega
                                                WHERE IdModul = $modul");

        if ($resultado != null) {
            $entregaString = "";
            while ($entrega = $resultado->fetch_assoc()) {
                $entregaString .= ";" . $entrega["idEntrega"] . "/" . $entrega["Nom"]; 
            }

            echo substr($entregaString, 1);
        }else
            echo "errorBD";
    }

    if (isset($_POST["crearEntrega"])) {
        $gestorBD = new gestorBD();

        $archivo = $_FILES["arxiuEntregaCreada"];

        //Saco la extension del archivo para guardarlo como el mismo
        $arrayNombre = explode(".", $archivo["name"]);
        $extension = end($arrayNombre);

        $valores = explode(";", $_POST["valores"]);

        $modul = $valores[0];
        $nom = $valores[1];
        $descripcio = $valores[2];
        $dataInicial = $valores[3];
        $dataFinal = $valores[4];
        $dataEntrega = $valores[5];
        $valorActivitat = $valores[6];

        $resultado = $gestorBD->realizarQuery("SELECT AUTO_INCREMENT as id
                                                FROM information_schema.TABLES
                                                WHERE TABLE_SCHEMA = 'educabasic'
                                                AND TABLE_NAME = 'entrega'");

        if ($resultado != null) {
            $nextIdEntrega = $resultado->fetch_assoc();
            //Quito los espacios en blanco para que no haya errores
            $nombreArchivo = str_replace(" ", "_", $arrayNombre[0] . $nextIdEntrega["id"] . "." . $extension);
        
            //Primero sus datos en la base de datos
            $resultado = $gestorBD->realizarCambios("INSERT INTO entrega
                                                        (IdModul, 
                                                        Nom, 
                                                        Descripcio, 
                                                        DataInicial, 
                                                        DataFinal, 
                                                        DataEntrega, 
                                                        ArxiuAdjunt, 
                                                        ValorActivitat)
                                                    VALUES 
                                                        ($modul,
                                                        '$nom',
                                                        '$descripcio',
                                                        '$dataInicial',
                                                        '$dataFinal',
                                                        '$dataEntrega',
                                                        '$nombreArchivo',
                                                        $valorActivitat)");

            if ($resultado) {
                $ruta = "../enunciadosTrabajos/modul" . $modul;
                if (file_exists($ruta)) {
                    move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
                }else{
                    mkdir($ruta);
                    move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
                }
                echo "true";
            }else
                echo "errorCrear";   
        }else
            echo "errorId";
    }

    if (isset($_POST["modificarEntrega"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];
        $modul = $_POST["modul"];

        $nombreArchivo = "";
        if (isset($_FILES["arxiuEntregaModificada"])) {
            $archivo = $_FILES["arxiuEntregaModificada"];

            //Saco la extension del archivo para guardarlo como el mismo
            $arrayNombre = explode(".", $archivo["name"]);
            $extension = end($arrayNombre);

            //Quito los espacios en blanco para que no haya errores
            $nombreArchivo = str_replace(" ", "_", $arrayNombre[0] . $entrega . "." . $extension);

            $ruta = "../enunciadosTrabajos/modul" . $modul;
            if (file_exists($ruta)) {
                move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
            }else{
                mkdir($ruta);
                move_uploaded_file($archivo['tmp_name'], $ruta . "/" . $nombreArchivo);
            }
        }

        $valores = explode(";", $_POST["valores"]);

        $nom = $valores[1];
        $descripcio = $valores[2];
        $dataInicial = $valores[3];
        $dataFinal = $valores[4];
        $dataEntrega = $valores[5];
        $valorActivitat = $valores[6];
        
        $setArxiuAdjunt = "";
        if ($nombreArchivo != "") {
            $setArxiuAdjunt = "ArxiuAdjunt = '$nombreArchivo',";
        }
        //Primero sus datos en la base de datos
        $resultado = $gestorBD->realizarCambios("UPDATE entrega
                                                SET 
                                                    Nom = '$nom',
                                                    Descripcio = '$descripcio',
                                                    DataInicial = '$dataInicial',
                                                    DataFinal = '$dataFinal',
                                                    DataEntrega = '$dataEntrega',
                                                    $setArxiuAdjunt
                                                    ValorActivitat = $valorActivitat
                                                WHERE
                                                    entrega.idEntrega = $entrega");

        if ($resultado) {
            echo "true";
        }else
            echo "errorModificar";   
    }

    if (isset($_POST["informacionEntrega"])) {
        $gestorBD = new gestorBD();

        $entrega = $_POST["entrega"];

        $resultado = $gestorBD->realizarQuery("SELECT 
                                                    Nom,
                                                    Descripcio,
                                                    DataInicial,
                                                    DataFinal,
                                                    DataEntrega,
                                                    ArxiuAdjunt,
                                                    ValorActivitat 
                                                FROM entrega
                                                WHERE idEntrega = $entrega");
        if ($resultado != null) {
            $datosEntrega = $resultado->fetch_assoc();
            
            $entrega = new stdClass();
            $entrega->nom = utf8ize($datosEntrega["Nom"]);
            $entrega->descripcio = utf8ize($datosEntrega["Descripcio"]);

            $dataInicial = explode(" ", $datosEntrega["DataInicial"]);
            $entrega->dataInicial = utf8ize($dataInicial[0]);
            $entrega->horaInicial = utf8ize($dataInicial[1]);

            $DataFinal = explode(" ", $datosEntrega["DataFinal"]);
            $entrega->dataFinal = utf8ize($DataFinal[0]);
            $entrega->horaFinal = utf8ize($DataFinal[1]);
            
            $DataEntrega = explode(" ", $datosEntrega["DataEntrega"]);
            $entrega->dataEntrega = utf8ize($DataEntrega[0]);
            $entrega->horaEntrega = utf8ize($DataEntrega[1]);

            $entrega->arxiuAdjunt = utf8ize($datosEntrega["ArxiuAdjunt"]);
            $entrega->valorActivitat = utf8ize($datosEntrega["ValorActivitat"]);

            echo json_encode($entrega);
        }else
            echo "";
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