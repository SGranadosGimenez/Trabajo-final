<?php

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require '../librerias/PHPMailer-master/src/Exception.php';
    require '../librerias/PHPMailer-master/src/PHPMailer.php';
    require '../librerias/PHPMailer-master/src/SMTP.php';

    function enviarEmail($emailEnviar, $asunto, $cuerpo, $nombreFichero = "", $datos = "", $ruta = ""){

        $email = new PHPMailer();
        $email->SetFrom('educabasic@educabasic', 'Sistema automatico');
        $email->Subject = $asunto;
        $email->Body = $cuerpo;
        $email->AddAddress($emailEnviar);

        if (!empty($nombreFichero)) {
            //Creo el archivo y introduzco los datos que me pasan
            $archivo = fopen($nombreFichero, "w");
            fwrite($archivo, $datos);

            //Guardo el fichero en la ruta indicada
            move_uploaded_file($archivo,$ruta . "/".$nombreFichero);
            //Lo adjunto con el correo
            $email->addAttachment($ruta . "/".$nombreFichero);
        }

        return $email->Send();
    }
?>