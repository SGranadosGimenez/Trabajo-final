<?php  

    include "gestorBD.php";
    include "enviarEmails.php";

    //Busco su correo para enviar el email
    function encontrarCorreo($queryBusqueda, $gestorBD){

        $resultadoAlumno = $gestorBD->realizarQuery($queryBusqueda);

        if ($resultadoAlumno != null) {
            $email = $resultadoAlumno->fetch_assoc();
            return $email["CorreuElectronic"].";".$email["id"];
        }else{
            return null;
        }
    }

    //Inicio de session
    if (isset($_POST["iniciarSesion"])) {

        $gestorBD = new gestorBD();

        $usuario = $_POST["usuario"];
        $contrasena = $_POST["contrasena"];

        $resultado = $gestorBD->realizarQuery("SELECT idAlumne, Usuari, Contrasenya FROM alumne WHERE Usuari = '$usuario' AND Contrasenya = '" . sha1($contrasena) . "'");

        if ($resultado == null) {
            $resultado = $gestorBD->realizarQuery("SELECT idProfessor, Usuari, Contrasenya FROM professor WHERE Usuari = '$usuario' AND Contrasenya = '" . sha1($contrasena) . "'");
            
            if ($resultado == null) {
                echo "noExiste";
            }else {
                $idProfessor = $resultado->fetch_assoc();
                $_SESSION["inicioProfessorCorrecto"] = $idProfessor["idProfessor"];
                echo "professor";
            }
        }else{
            $idAlumno = $resultado->fetch_assoc();
            $_SESSION["alumnoLogeado"] = $idAlumno["idAlumne"];
            echo "alumno";   
        }
    }
    
    //Comprovamos archivo professor
    if (isset($_FILES["archivoSession"])) {
        if (isset($_SESSION["inicioProfessorCorrecto"])) {
            $idProfessor = $_SESSION["inicioProfessorCorrecto"];

            $archivo = $_FILES["archivoSession"];

            if ($archivo["type"] == 'text/plain') {
                $gestorBD = new gestorBD();

                $resultado = $gestorBD->realizarQuery("SELECT archivoInicioSession, admin FROM professor WHERE idProfessor = $idProfessor");
                
                if ($resultado == null) {
                    echo "errorBD";
                }else {
                    $archivoBD = $resultado->fetch_assoc();
                    $rutaArchivo = "../archivosProfessor/" . $archivoBD["archivoInicioSession"];
                    if (files_are_equal($rutaArchivo, $archivo["tmp_name"])) {
                        unset($_SESSION["inicioProfessorCorrecto"]);
                        if ($archivoBD["admin"] == 1) {
                            $_SESSION["adminLogeado"] = $idProfessor;
                            echo "admin";
                        }else {
                            $_SESSION["professorLogeado"] = $idProfessor;
                            echo "professor";
                        }
                    }else
                        echo "archivoIncorrecto";
                }
            }else
                echo "ExtensionIncorrecta";
        }else
            echo "SessionIncorrecta";
    }

    //Envio de correo de cambiar contraseña
    if (isset($_POST["cambioContrasena"])) {

        $gestorBD = new gestorBD();

        $tipoUsuario = "alumno";

        //Primero miro si es un alumno sino miro si es professor
        $datos = encontrarCorreo("SELECT CorreuElectronic, IdAlumne as id FROM alumne WHERE Usuari = '".$_POST["usuario"]."'", $gestorBD);
        if ($datos == null) {
            $datos = encontrarCorreo("SELECT CorreuElectronic, IdProfessor as id FROM professor WHERE Usuari = '".$_POST["usuario"]."'", $gestorBD);
            $tipoUsuario = "professor";
        }
        
        if ($datos != null) {
            $datosArray = explode(";", $datos);
            $email = $datosArray[0];
            $id = $datosArray[1];

            $numeroRandom = rand(100000, 999999);
            
            if(enviarEmail($email, "Recuperacio de contrasenya", $numeroRandom)){

                //Guardamos el codigo en la base de datos para comprovarlo despues
                $valores = "";
                if ($tipoUsuario == "alumno") {
                    $valores = "NULL, $id, ";
                }else if($tipoUsuario == "professor"){
                    $valores = "$id, NULL, ";
                }

                $valores .= $numeroRandom . ", '" . date("Y-m-d H:i") . "'";

                $query = "INSERT INTO logrecuperacioncontrasenya (IdProfessor, IdAlumne, codiRecuperacio, dataRecuperacio) VALUES ($valores)";

                if ($gestorBD->realizarCambios($query)) {
                    //Envio las dos cosas para ahorrar tiempo en la comprovacion
                    $_SESSION["datosRecuperacion"] = $id .";" . $tipoUsuario;
                    echo "Correo enviado";   
                }else
                    echo "Ha ocurrido un error en la base de datos";
            }else {
                echo "Ha ocurrido un error al enviar el correo";
            }
        }else
            echo "No se ha encontrado al usuario";
    }

    if (isset($_POST["comprovarCodigoRecuperacion"])) {
        if (isset($_SESSION["datosRecuperacion"])) {

            $gestorBD = new gestorBD();

            $codigoIntroducido = $_POST["codigo"];
            $datos = explode(";", $_SESSION["datosRecuperacion"]);
            
            $idUsuario = $datos[0];
            $tipoUsuario = $datos[1];

            $valores = "";
            if ($tipoUsuario == "alumno") {
                $valores = "IdAlumne = " . $idUsuario;
            }else if($tipoUsuario == "professor"){
                $valores = "IdProfessor = " . $idUsuario;
            }

            $date = new DateTime();
            $date->modify("-30 minutes");

            $query = "SELECT codiRecuperacio FROM logrecuperacioncontrasenya WHERE $valores AND dataRecuperacio >= '" . $date->format('Y-m-d H:i:s') . "' ORDER BY dataRecuperacio DESC LIMIT 1";

            $resultado = $gestorBD->realizarQuery($query);
            
            if ($resultado != null) {
                $codigoBD = $resultado->fetch_assoc();
                if ($codigoBD["codiRecuperacio"] == $codigoIntroducido) {
                    echo "true";
                }else
                    echo "codigoErroneo";
            }else{
                echo "caducado";
            }   
        }else
            echo "errorSession";
    }

    if (isset($_POST["cambiarContrasena"])) {
        if (isset($_SESSION["datosRecuperacion"])) {
            $gestorBD = new gestorBD();

            $datos = explode(";", $_SESSION["datosRecuperacion"]);
                
            $idUsuario = $datos[0];
            $tipoUsuario = $datos[1];

            $query = "";
            if ($tipoUsuario == "alumno") {
                $query = "UPDATE alumne SET Contrasenya = '" . sha1($_POST["nuevaContrasena"]) . "' WHERE idAlumne = $idUsuario";
            }else if($tipoUsuario == "professor"){
                $query = "UPDATE professor SET Contrasenya = '" . sha1($_POST["nuevaContrasena"]) . "' WHERE idProfessor = $idUsuario";
            }

            if ($gestorBD->realizarCambios($query)) {
                echo "true";
                unset($_SESSION["datosRecuperacion"]);
            }else
                echo "errorQuery";
        }else
            echo "errorSession";
    }

    function files_are_equal($a, $b){
        // Check if filesize is different
        if(filesize($a) !== filesize($b))
            return false;

        // Check if content is different
        $ah = fopen($a, 'rb');
        $bh = fopen($b, 'rb');

        $result = true;
        while(!feof($ah))
        {
            if(fread($ah, 8192) != fread($bh, 8192))
            {
            $result = false;
            break;
            }
        }

        fclose($ah);
        fclose($bh);

        return $result;
    }
?>