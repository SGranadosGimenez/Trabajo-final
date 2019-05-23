<?php
    session_start();

    //Lo cambio desde el principio para cuando haga date()
    date_default_timezone_set('Europe/Paris');

    class gestorBD{

        private $conn;

        function __construct() {
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "educabasic";

            $this->conn = new mysqli($servername, $username, $password, $dbname);

            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            } 
        }

        function realizarQuery($query){
            $result = $this->conn->query($query);

            //Si ha ocurrido un error tambien devolvemos null
            if (!$result)
                return null;

            if ($result->num_rows > 0) {
                return $result; 
            } else {
                return null;
            }
        }

        function realizarCambios($query){
            $result = $this->conn->query($query);
            if (!$result) {
                return false;
            }else
                return true;
        }

        function cerrarConexion(){
                $this->conn->close();
        }
    }
    
?>