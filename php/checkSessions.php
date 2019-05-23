<?php

    include "gestorBD.php";

    function comprovarAdmin(){
        if (!isset($_SESSION["adminLogeado"])) {
            header("Location:login.html");
        }    
    }

    function comprovarProfessor(){
        if(!isset($_SESSION["professorLogeado"])){
            header("Location:login.html");
        }
    }

    function comprovarTodasSessiones(){
        if(!isset($_SESSION["professorLogeado"]) || isset($_SESSION["alumnoLogeado"])){
            header("Location:login.html");
        }
    }
?>