function IniciarSesion() {
    var inputUsuario = document.getElementById("usuario").value;
    var inputContrasena = document.getElementById("contrasena").value;
    if (inputUsuario.trim() != "" && inputContrasena.trim() != "") {
        $.ajax({
            url:"../php/LoginFunciones.php",
            type: "post", 
            dataType: 'text',
            data: {iniciarSesion: "true", usuario: inputUsuario, contrasena: inputContrasena},
            success:function(result){
                switch (result) {
                    case "noExiste":
                        alert("El usuario o la contraseña es erroneo");
                        break;
                    case "professor":
                        var formularioInicio = document.getElementById("formInicioSession");
                        formularioInicio.style.display = "none";
                    
                        var formularioArchivo = document.getElementById("formArchivoProfessor");
                        formularioArchivo.style.display = "block";
                        break;
                    case "alumno":
                        document.location.href = "../html/MainAlumno.html";
                        break;
                    default:
                        alert("Ha ocurrido un error");
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
           }
        });   
    }else
        alert("Tienes que introducir usuario y contraseña para iniciar sesion")
}

function comprovarArxiu() {
    var archivos = document.getElementById("archivoSession").files;
    if (archivos.length != 1) {
        alert("Sube solo un archivo");
    }else{
        var formData = new FormData();
        formData.append("archivoSession", archivos[0]);
        $.ajax({
            url: '../php/LoginFunciones.php',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(response) {
                switch (response) {
                    case "admin":
                        alert("Iniciando session de administrador");
                        document.location.href = "../html/panelControlAdmin.html";
                        break;
                    case "professor":
                        alert("Iniciando sesion...");
                        document.location.href = "../html/mainProfessor.html";
                        break;
                    case "SessionIncorrecta":
                        volverInicio();
                        alert("Ha habido un error con la session vuelve a iniciar");
                        break;
                    case "archivoIncorrecto":
                        alert("El archivo subido no es correcto");
                        break;
                    case "ExtensionIncorrecta":
                        alert("La extension del archivo tiene que ser .txt")
                        break;
                    default:
                        alert("Ha ocurrido un error prueba otra vez");
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
           }
        });
    }
}

function volverInicio() {
    var formularioInicio = document.getElementById("formInicioSession");
    formularioInicio.style.display = "block";

    var formularioArchivo = document.getElementById("formArchivoProfessor");
    formularioArchivo.style.display = "none";

    var formCodigoRecuperacion = document.getElementById("formCodigoRecuperacion");
    formCodigoRecuperacion.style.display = "none";

    var formNuevaContrasena = document.getElementById("formNuevaContrasena");
    formNuevaContrasena.style.display = "none";
}

function contrasenaOlvidada() {
    var inputUsuario = document.getElementById("usuario").value;
    if (inputUsuario.trim() != "") {
        $.ajax({
            url:"../php/LoginFunciones.php",
            type: "post", 
            dataType: 'text',
            data: {cambioContrasena: "true", usuario: inputUsuario},
            success:function(result){
                if (result == "Correo enviado") {
                    var formularioInicio = document.getElementById("formInicioSession");
                    formularioInicio.style.display = "none";

                    var formCodigoRecuperacion = document.getElementById("formCodigoRecuperacion");
                    formCodigoRecuperacion.style.display = "block";
                }else
                    alert(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
            }
        });  
    }else{
        alert("Tens que posar algun usuari de la base de dades")
    }
}


function comprovarCodigoRecuperacion() {
    var codigoRecuperacion = document.getElementById("codigoRecuperacion").value;
    if (codigoRecuperacion.trim() != "") {
        $.ajax({
            url:"../php/LoginFunciones.php",
            type: "post", 
            dataType: 'text',
            data: {comprovarCodigoRecuperacion: "true", codigo: codigoRecuperacion},
            success:function(result){
                switch (result) {
                    case "true":
                        var formCodigoRecuperacion = document.getElementById("formCodigoRecuperacion");
                        formCodigoRecuperacion.style.display = "none";
        
                        var formNuevaContrasena = document.getElementById("formNuevaContrasena");
                        formNuevaContrasena.style.display = "block";
                        break;
                    case "codigoErroneo":
                        alert("Codigo introducido erroneo");
                        break;
                    case "caducado":
                        alert("El codigo ha caducado porfavor vuelve a recuperar contraseña");
                        volverInicio();
                        break;
                    case "errorSession":
                        alert("Ha ocurrido un error con la session vuelve a recuperar la contraseña");
                        volverInicio();
                        break;
                    default:
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
           }
        });   
    }else
        alert("Para  enviar el correo tiene que poner tu  email")
}

function cambiarContrasena() {
    var contrasenaNuevaPrimera = document.getElementById("contrasenaNuevaPrimera").value;
    var contrasenaNuevaSegunda = document.getElementById("contrasenaNuevaSegunda").value;
    if (contrasenaNuevaPrimera.trim() != "" && contrasenaNuevaSegunda.trim() != "") {
        if (contrasenaNuevaPrimera == contrasenaNuevaSegunda) {
            $.ajax({
                url:"../php/LoginFunciones.php",
                type: "post", 
                dataType: 'text',
                data: {cambiarContrasena: "true", nuevaContrasena: contrasenaNuevaPrimera},
                success:function(result){
                    switch (result) {
                        case "true":
                            alert("Contraseña cambiada");
                            volverInicio();
                            break;
                        case "errorQuery":
                            alert("Error en la base de datos");
                            break;
                        case "errorSession":
                            alert("Ha ocurrido un error con la session vuelve a recuperar la contraseña");
                            volverInicio();
                            break;
                        default:
                            break;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Ha ocurrido un error");
               }
            });      
        }
    }else
        alert("Para  enviar el correo tiene que poner tu  email")
}

