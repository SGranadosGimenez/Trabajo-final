<?php
	include "gestorBD.php";
	/*ALUMNO LOGUEADO */ 
	if(isset($_POST["buscaralumno"])){
		 $alumne=$_SESSION["alumnoLogeado"];
		if(!empty($alumne)){
			$gestorBD = new gestorBD();
			$resultado = $gestorBD->realizarQuery("SELECT Nom, PrimerCognom FROM alumne WHERE idAlumne = $alumne");
			$alumnoValor="";
            while ($alumno = $resultado->fetch_assoc()) {
            $alumnoValor = $alumno["Nom"] . " ".$alumno["PrimerCognom"];
        	}
            echo $alumnoValor;
		}
	}
	/* ENTREGA*/
	if(isset($_POST["selectentrega"])){
		Selectassignaturas();
	}
	if(isset($_POST["CanviarContra"])){
		if(!empty($_POST["contraactual"])){
			$gestorBD = new gestorBD();
			$resultado = $gestorBD->realizarQuery("SELECT * FROM alumne WHERE idAlumne = ".$_SESSION["alumnoLogeado"]);
			$fila = $resultado->fetch_assoc();
			if (sha1($_POST["contraactual"]) == $fila["Contrasenya"]){
				if($_POST["contranueva"]== $_POST["contranueva2"]){
					$resultado = $gestorBD->realizarCambios("UPDATE alumne SET Contrasenya = '".sha1($_POST['contranueva2'])."' WHERE idAlumne = ".$_SESSION["alumnoLogeado"]);
					echo "true";
				}
				else{
					echo "false";
				}
			}
		}
	}
	/* Printa todas las entregas del valor seleccionado en el select d'entregas*/
	if(isset($_POST["Printarentregas"])){

		$gestorBD = new gestorBD();
		if($_POST["seleccion"]!="Seleccionar"){
			$resultado = $gestorBD->realizarQuery("SELECT modul.Nom as modulnom, assignatura.Nom as nomas, entrega.Nom as Nom, entrega.Descripcio as Descripcio, entrega.DataInicial as DataInicial, entrega.DataEntrega as DataEntrega, entrega.DataFinal as DataFinal, entrega.ArxiuAdjunt as ArxiuAdjunt FROM assignatura JOIN modul ON modul.IdAssignatura = assignatura.idAssignatura JOIN entrega ON entrega.IdModul = modul.idModul INNER JOIN evaluarentrega ON evaluarentrega.IdEntrega = entrega.idEntrega WHERE assignatura.nom = '".$_POST["seleccion"]."' AND evaluarentrega.IdAlumne = " . $_SESSION["alumnoLogeado"] . " ORDER BY entrega.DataEntrega DESC");
		 }
		else{
			$resultado = $gestorBD->realizarQuery("SELECT modul.Nom as modulnom, assignatura.Nom as nomas, entrega.Nom as Nom, entrega.Descripcio as Descripcio, entrega.DataInicial as DataInicial, entrega.DataEntrega as DataEntrega, entrega.DataFinal as DataFinal, entrega.ArxiuAdjunt as ArxiuAdjunt FROM assignatura JOIN modul ON modul.IdAssignatura = assignatura.idAssignatura JOIN entrega ON entrega.IdModul = modul.idModul INNER JOIN evaluarentrega ON evaluarentrega.IdEntrega = entrega.idEntrega WHERE evaluarentrega.IdAlumne = " . $_SESSION["alumnoLogeado"] . " ORDER BY entrega.DataEntrega DESC");
		 }
		
		// ORDER BY entrega.fecha DESC
		$entrega = array();
		if($resultado != null){
			while($datosentrega = $resultado->fetch_assoc()){
				$datos = new stdClass();
				$datos->Nom = utf8ize($datosentrega["Nom"]);
				$datos->modul = utf8ize($datosentrega["modulnom"]);
				$datos->nomas = utf8ize($datosentrega["nomas"]);
				$datos->Descripcio= utf8ize($datosentrega["Descripcio"]);
				$datos->DataInicial= utf8ize($datosentrega["DataInicial"]);
				$datos->DataEntrega= utf8ize($datosentrega["DataEntrega"]);
				$datos->DataFinal= utf8ize($datosentrega["DataFinal"]);
				$datos->Arxiu= utf8ize($datosentrega["ArxiuAdjunt"]);
				$entrega[] = $datos;
			}
			$co = new stdClass();
			$co->array = $entrega;
			echo json_encode($co);
		}
		else{
			echo "string";
		}
	}
	/* Printa todas entregas que hay en el onload */
	if(isset($_POST["entregatodas"])){

		$gestorBD = new gestorBD();
		$resultado = $gestorBD->realizarQuery("SELECT modul.Nom as modulnom, assignatura.Nom as nomas, entrega.Nom as Nom, entrega.Descripcio as Descripcio, entrega.DataInicial as DataInicial, entrega.DataEntrega as DataEntrega, entrega.DataFinal as DataFinal, entrega.ArxiuAdjunt as ArxiuAdjunt FROM assignatura JOIN modul ON modul.IdAssignatura = assignatura.idAssignatura JOIN entrega ON entrega.IdModul = modul.idModul JOIN evaluarentrega ON evaluarentrega.IdEntrega = entrega.idEntrega WHERE evaluarentrega.IdAlumne = " . $_SESSION["alumnoLogeado"] . " ORDER BY entrega.DataEntrega DESC");
		// ORDER BY entrega.fecha DESC
		$entrega = array();
		if($resultado != null){
			while($datosentrega = $resultado->fetch_assoc()){
				$datos = new stdClass();
				$datos->Nom = utf8ize($datosentrega["Nom"]);
				$datos->modul = utf8ize($datosentrega["modulnom"]);
				$datos->nomas = utf8ize($datosentrega["nomas"]);
				$datos->Descripcio= utf8ize($datosentrega["Descripcio"]);
				$datos->DataInicial= utf8ize($datosentrega["DataInicial"]);
				$datos->DataEntrega= utf8ize($datosentrega["DataEntrega"]);
				$datos->DataFinal= utf8ize($datosentrega["DataFinal"]);
				$datos->Arxiu= utf8ize($datosentrega["ArxiuAdjunt"]);
				$entrega[] = $datos;
			}
			$co = new stdClass();
			$co->array = $entrega;
			echo json_encode($co);
		}
		else{
			echo "string";
		}
	}

	/*MATERIAS */
	if(isset($_POST["materia"])){
		$connexio = mysqli_connect("localhost", "root", "", "educabasic");
 		$sql = "SELECT assignatura.Nom as Nomassignatua, professor.PrimerCognom as primercognom, professor.Nom as Nomprofessor, assignatura.Aula as Aula, curso.Nom as curs FROM assignatura JOIN professor ON professor.idProfessor = assignatura.idProfessor JOIN curso ON curso.idCurso = assignatura.idCurs";
 		$resultat=mysqli_query($connexio, $sql);
 		$materias = array();
 		if($resultat != null){
			while($datos = $resultat->fetch_assoc()){
				$dades = new stdClass();
				$dades->primerCognom = utf8ize($datos["primercognom"]);
				$dades->NomAsign = utf8ize($datos["Nomassignatua"]);
				$dades->NomProf = utf8ize($datos["Nomprofessor"]);
				$dades->aula = utf8ize($datos["Aula"]);
				$dades->curs = utf8ize($datos["curs"]);
				$materias[] = $dades;
			}
			$co = new stdClass();
			$co->array = $materias;
			echo json_encode($co);
		}
	}
	if(isset($_POST["materia2"])){	
		$_SESSION["Assignatura"]=$_POST["assignatura"];
	}
	/* MATERIAS 2 */
	if(isset($_POST["infoAssign"])){

		$connexio = mysqli_connect("localhost", "root", "", "educabasic");
 		$sql = "SELECT assignatura.Nom as Nomassignatua,assignatura.idAssignatura as idAssign, modul.Nom as nomModul, professor.PrimerCognom as primercognom, professor.Nom as Nomprofessor, assignatura.Aula as Aula, curso.Nom as curs FROM assignatura JOIN professor ON professor.idProfessor = assignatura.idProfessor JOIN curso ON curso.idCurso = assignatura.idCurs JOIN modul ON modul.idAssignatura = assignatura.idAssignatura WHERE assignatura.Nom = '".$_SESSION["Assignatura"]."'";
		$resultat=mysqli_query($connexio, $sql);
 		if($resultat != null){
 			$dades = new stdClass();
			while($datos = $resultat->fetch_assoc()){
				$dades->primerCognom = utf8ize($datos["primercognom"]);
				$dades->idAssign = utf8ize($datos["idAssign"]);
				$dades->NomAsign = utf8ize($datos["Nomassignatua"]);
				$dades->NomProf = utf8ize($datos["Nomprofessor"]);
				$dades->aula = utf8ize($datos["Aula"]);
				$dades->curs = utf8ize($datos["curs"]);
			}
			echo json_encode($dades);
		}
		else{
			echo "false";
		}
	}
	if(isset($_POST["infoModul"])){
		$connexio = mysqli_connect("localhost", "root", "", "educabasic");
 		$sql = "SELECT * FROM modul WHERE idAssignatura = ".$_POST["idAssign"];
 		$resultat=mysqli_query($connexio, $sql);
 		$materias = array();
 		if($resultat != null){
			while($datos = $resultat->fetch_assoc()){
				$dades = new stdClass();
				$dades->Nom = utf8ize($datos["Nom"]);
				$dades->horas = utf8ize($datos["Hores"]);
				$materias[] = $dades;
			}
			$co = new stdClass();
			$co->array = $materias;
			echo json_encode($co);
		}
	}
		/* Guardar materia y printar las entregas con el selected*/
	
	if(isset($_POST["entregaMateria"])){
		if(isset($_SESSION["Assignatura"])){
			$_SESSION["assignMat"]=$_SESSION["Assignatura"];
		}
	}
	/* CERRAR SESSIOM */
	if(isset($_POST["cerrarsession"])){
		session_destroy();
		echo "true";
	}

	/*Funciones */
	function Selectassignaturas(){
		$connexio = mysqli_connect("localhost", "root", "", "educabasic");
 		$sql = "SELECT * FROM assignatura";
 		$resultat=mysqli_query($connexio, $sql);
 		echo "<option value='Seleccionar'> -- Seleccionar --</option>";
 		while($fila = mysqli_fetch_assoc($resultat)){
 			if(isset($_SESSION["assignMat"]) && $_SESSION["assignMat"]==$fila["Nom"]){
 					echo "<option selected value='".$fila["Nom"]."'>".$fila["Nom"]."</option>";
 			}
 			else{
 				echo "<option value='".$fila["Nom"]."'>".$fila["Nom"]."</option>";
 			}
 		}
 		$_SESSION["assignMat"]="";
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