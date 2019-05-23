
var professorActual;
var accionActual;

function seleccionarAccion(){

    vaciarCampos();

    var fieldSetSeleccionProfessor = cojerElemento("fieldSetSeleccionProfessor");
    fieldSetSeleccionProfessor.disabled = "disabled";
    var fieldSetInputs = cojerElemento("fieldSetInputs");
    fieldSetInputs.disabled = "disabled";
    var fieldSetButtonRealizarAccion = cojerElemento("fieldSetButtonRealizarAccion");
    fieldSetButtonRealizarAccion.disabled = "disabled";
    var fieldSetOpciones = cojerElemento("fieldSetOpciones");
    fieldSetOpciones.disabled = "disabled";

    var inputAccionRealizar = cojerElemento("accionRealizar");
    var accion = inputAccionRealizar.options[inputAccionRealizar.selectedIndex].value;
    
    switch (accion) {
        case "crear":
            accionActual = accion;
            fieldSetInputs.disabled = "";
            fieldSetButtonRealizarAccion.disabled = "";
            break;
        case "modificar":
            accionActual = accion;
            fieldSetSeleccionProfessor.disabled = "";
            fieldSetInputs.disabled = "";
            fieldSetButtonRealizarAccion.disabled = "";
            fieldSetOpciones.disabled = "";
            cojerProfessors();
            break;
        case "ver":
            fieldSetSeleccionProfessor.disabled = "";
            fieldSetOpciones.disabled = "";
            accionActual = accion;
            cojerProfessors();
            break;
        case "eliminar":
            accionActual = accion;
            fieldSetSeleccionProfessor.disabled = "";
            cojerProfessors();
            break;
        default:
            break;
    }
}

function cojerProfessors(){
    var professorEscogido = cojerElemento("professorEscogido");
    professorEscogido.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {cojerProfessores: "true"},
        success:function(result){
            var professores = result.split(";");
            for (let index = 0; index < professores.length; index++) {
                var professorActual = professores[index].split("/");

                var html = "<option value='" + professorActual[0] + "'>" + professorActual[1] + "</option>";

                professorEscogido.innerHTML += html;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {   
            alert("Ha hagut un error");
       }
    });   
}

function codificar() {
    var inputCodificado = cojerElemento("inputCodificado");
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {codificar: "true", codigo: inputCodificado.value},
        success:function(result){
            inputCodificado.value = result;
        },
        error: function (xhr, ajaxOptions, thrownError) {   
            alert("Ha hagut un error");
       }
    }); 
}

function realizarAccion() {
    var datos = validacionDatos();
    if (datos != "") {
        switch (accionActual) {
            case "crear":   
                crearProfessor(datos);   
                break;
            case "modificar":
                modificarProfessor(datos);
                break;
            default:
                break;
        }
    }
}
/* Parte de creacion de professors */
function validacionDatos(){

    var usuari = cojerElemento("inputUsuari").value;
    if (usuari.trim() == "") {
        alert("Tens que posar un usuari")
        return "";
    }

    var inputContrasenya = cojerElemento("inputContrasenya").value;
    if (inputContrasenya.trim() == "") {
        alert("Tens que posar una contraenya")
        return "";
    }

    var inputNom = cojerElemento("inputNom").value;
    if (inputNom.trim() == "") {
        alert("Tens que posar un nom")
        return "";
    }

    var inputPrimerCognom = cojerElemento("inputPrimerCognom").value;
    if (inputPrimerCognom.trim() == "") {
        alert("Tens que posar un primer cognom")
        return "";
    }

    var inputSegonCognom = cojerElemento("inputSegonCognom").value;
    if (inputSegonCognom.trim() == "") {
        alert("Tens que posar un segon cognom")
        return "";
    }

    var sexe = cojerElemento("selectSexe").options[cojerElemento("selectSexe").selectedIndex].value;

    var inputDNI = cojerElemento("inputDNI").value;
    if (inputDNI.trim() == "") {
        alert("No has introduit el dni");
        return "";
    }else if(!comprovarDNI(inputDNI)){
        alert("El dni es incorrecto");
        return "";
    }

    var inputDataNaixement = cojerElemento("inputDataNaixement").value;
    if (inputDataNaixement.trim() == "") {
        alert("No has introduit la data de naixement");
        return "";
    }

    var inputNacionalitat = cojerElemento("inputNacionalitat").value;
    if (inputNacionalitat.trim() == "") {
        alert("No has introduit la nacionalitat");
        return "";
    }

    var inputLlocNaixement = cojerElemento("inputLlocNaixement").value;
    if (inputLlocNaixement.trim() == "") {
        alert("No has introduit el lloc de naixement");
        return "";
    }

    var inputNumeroSeguretatSocial = cojerElemento("inputNumeroSeguretatSocial").value;
    /*if (inputNumeroSeguretatSocial != "" && !checkNSS(inputNumeroSeguretatSocial)) {
        alert("El numero de la seguretat social es incorrecte");
        return "";
    }*/

    var inputCorreuElectronic = cojerElemento("inputCorreuElectronic").value;
    if (inputCorreuElectronic.trim() == "" || !validateEmail(inputCorreuElectronic)) {
        alert("No has introduit el correu electronic o es incorrecte");
        return "";
    }

    var inputTelefon = cojerElemento("inputTelefon").value;
    if (inputTelefon != "" && (typeof inputTelefon != 'number' || inputTelefon.length != 9)) {
        alert("El telefon te un format incorrecte");
        return "";
    }

    var inputTelefonMobil = cojerElemento("inputTelefonMobil").value;
    if (inputTelefonMobil != "" && (typeof inputTelefonMobil != 'number' || inputTelefonMobil.length != 9)) {
        alert("El telefon mobil te un format incorrecte");
        return "";
    }

    var inputDireccio = cojerElemento("inputDireccio").value;

    return usuari + ";" + inputContrasenya + ";" + inputNom + ";" + inputPrimerCognom + ";" + inputSegonCognom + ";" + sexe + ";" + inputDNI + ";" + inputDataNaixement + ";" + inputNacionalitat + ";" + inputLlocNaixement + ";" + inputNumeroSeguretatSocial + ";" + inputCorreuElectronic + ";" + inputTelefon + ";" + inputTelefonMobil + ";" + inputDireccio;
}

function crearProfessor(valores) {
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {crearProfessor: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                alert("Professor creado");
                vaciarCampos();
            }else if(result == "usuariExisteix"){
                alert("Aquest usuari ja existeix");
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function modificarProfessor(valores) {
    valores += ";" + professorActual;
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {modificarProfessor: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                alert("Professor modificado");
                vaciarCampos();
                cojerProfessors();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function vaciarCampos(){

    cleanSelects("professorEscogido");
    
    cojerElemento("inputUsuari").value = ""

    cojerElemento("inputContrasenya").value = "";

    cojerElemento("inputCodificado").value = "";

    cojerElemento("inputNom").value = "";

    cojerElemento("inputPrimerCognom").value = "";

    cojerElemento("inputSegonCognom").value = "";

    cojerElemento("selectSexe").selectedIndex = "0";

    cojerElemento("inputDNI").value = "";

    cojerElemento("inputDataNaixement").value = "";

    cojerElemento("inputNacionalitat").value = "";

    cojerElemento("inputLlocNaixement").value = "";

    cojerElemento("inputNumeroSeguretatSocial").value = "";

    cojerElemento("inputCorreuElectronic").value = "";

    cojerElemento("inputTelefon").value = "";

    cojerElemento("inputTelefonMobil").value = "";

    cojerElemento("inputDireccio").value = "";

    opcionElegida("");
}

function generarArxiu() {
    var inputCorreuElectronic = cojerElemento("inputCorreuElectronic").value;
    if (inputCorreuElectronic.trim() == "") {
        alert("Tens que introduir un correu per poder crear l'arxiu");
    }else{
        $.ajax({
            url:"../php/mantenimientoProfessors.php",
            type: "post", 
            dataType: 'text',
            data: {generarArxiu: "true", professor: professorActual, emailProfessor: inputCorreuElectronic},
            success:function(result){
                switch (result) {
                    case "true":
                        alert("Se ha enviado el correo con el archivo y guardado en la carpeta de archivos");
                        break;
                    case "errorEmail":
                        alert("Error a l'enviar l'email");
                        break;
                    case "errorUsuari":
                        alert("Error al buscar l'usuari");
                        break;
                    case "noExiste":
                        alert("No existeix l'usuari");
                        break;
                    default:
                        break;
                }     
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });
    }  
}

function cleanSelects(idSelect){
    var select = document.getElementById(idSelect);
    var length = select.options.length;
    for (i = length - 1; i > 0; i--) {
        select.options[i] = null;
    }
}
/* -----------------------------------------------------TERMINA CREACION PROFESSORS----------------------------------------------------------------*/


function seleccionarProfessor(){
    professorActual = cojerElemento("professorEscogido").options[cojerElemento("professorEscogido").selectedIndex].value;
    
    if (professorActual.trim() != "") {
        if (accionActual == "eliminar") {
            eliminarProfessor(professorActual);
        }else{
            informacionProfessor(professorActual);
        }
    }else
        alert("No has escogido ningun professor");
}

function informacionProfessor (professorEscogido){
        $.ajax({
            url:"../php/mantenimientoProfessors.php",
            type: "post", 
            dataType: 'text',
            data: {informacionProfessor: "true", professorBuscado: professorEscogido},
            success:function(result){
                var objJson = JSON.parse(result);

                rellenarDatos(objJson);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });  
}

function eliminarProfessor (professorEscogido){
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {eliminarProfessor: "true", professorBuscado: professorEscogido},
        success:function(result){
            if (result == "true") {
                alert("Professor borrado");
                cojerProfessors();
            }else if(result == "errorAdmin"){
                alert("No pots eliminar a l'adminsitrador")
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}

function rellenarDatos(jsonObject){

    cojerElemento("inputUsuari").value = jsonObject.usuario;

    cojerElemento("inputContrasenya").value = jsonObject.contrasenya;

    cojerElemento("inputNom").value = jsonObject.nom;

    cojerElemento("inputPrimerCognom").value = jsonObject.primerCognom;

    cojerElemento("inputSegonCognom").value = jsonObject.segonCognom;

    cojerElemento("selectSexe").selectedIndex = buscarValorSelect("selectSexe", jsonObject.sexe);

    cojerElemento("inputDNI").value = jsonObject.dni;

    cojerElemento("inputDataNaixement").value = jsonObject.dataNaixement;

    cojerElemento("inputNacionalitat").value = jsonObject.nacionalitat;

    cojerElemento("inputLlocNaixement").value = jsonObject.llocNaixement;

    cojerElemento("inputNumeroSeguretatSocial").value = jsonObject.numSeguretatSocial;

    cojerElemento("inputCorreuElectronic").value = jsonObject.correuElectronic;

    cojerElemento("inputTelefon").value = jsonObject.telefon;

    cojerElemento("inputTelefonMobil").value = jsonObject.telefonMobil;

    cojerElemento("inputDireccio").value = jsonObject.direccio;
}

//Funcion para buscar el numero del valor que le pase
function buscarValorSelect(idselect, valor){
    var select = cojerElemento(idselect);

    for (let index = 0; index < select.options.length; index++) {
        if(select.options[index].value == valor){
            return index;
        }
    }
    return 0;
}

function cargarTutoriasProfessor(){
    opcionElegida("divTutoriaProfessor");
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {cargarAlumnos: "true", professor: professorActual},
        success:function(result){
            var valoresResultado = result.split("|");

            var alumnosProfessor = valoresResultado[0].split(";");
            var todosAlumnos = valoresResultado[1].split(";");

            var selectAlumnosProfessor = cojerElemento("selectAlumnosProfessor");
            selectAlumnosProfessor.innerHTML = "";
            if (alumnosProfessor[0].trim() != "") {
                for (let index = 0; index < alumnosProfessor.length; index++) {
                    var valoresModul = alumnosProfessor[index].split("-");
                    selectAlumnosProfessor.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }

            var selectTotsAlumnes = cojerElemento("selectTotsAlumnes");
            selectTotsAlumnes.innerHTML = "";
            if (todosAlumnos[0].trim() != "") {
                for (let index = 0; index < todosAlumnos.length; index++) {
                    var valoresModul = todosAlumnos[index].split("-");
                    selectTotsAlumnes.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function cargarAssignaturaProfessor(){
    opcionElegida("divAssignaturaProfessor");
    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {cargarAssignatura: "true", professor: professorActual},
        success:function(result){
            var valoresResultado = result.split("|");

            var assignaturaProfessor = valoresResultado[0].split(";");
            var todasAssignaturas = valoresResultado[1].split(";");

            var selectAssignaturaProfessor = cojerElemento("selectAssignaturaProfessor");
            selectAssignaturaProfessor.innerHTML = "";
            if (assignaturaProfessor[0].trim() != "") {
                for (let index = 0; index < assignaturaProfessor.length; index++) {
                    var valoresAssignatura = assignaturaProfessor[index].split("-");
                    selectAssignaturaProfessor.innerHTML += "<option value='" + valoresAssignatura[0] + "'>" + valoresAssignatura[1] + "</option>";
                }   
            }

            var selectTotsAssignatura = cojerElemento("selectTotsAssignatura");
            selectTotsAssignatura.innerHTML = "";
            if (todasAssignaturas[0].trim() != "") {
                for (let index = 0; index < todasAssignaturas.length; index++) {
                    var valoresAssignatura = todasAssignaturas[index].split("-");
                    selectTotsAssignatura.innerHTML += "<option value='" + valoresAssignatura[0] + "'>" + valoresAssignatura[1] + "</option>";
                }   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function anadirAlumno() {
    var selectTotsAlumne = cojerElemento("selectTotsAlumnes");

    var opcionesSeleccionadas = "";
    var opciones = selectTotsAlumne.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);
    if (opcionesSeleccionadas.trim() != "") {
        $.ajax({
            url:"../php/mantenimientoProfessors.php",
            type: "post", 
            dataType: 'text',
            data: {anadirAlumnos: "true", professor: professorActual, alumnosAnadir: opcionesSeleccionadas},
            success:function(result){
                if (result == "true") {
                    alert("S'han afegit els alumnes");
                    cargarTutoriasProfessor();
                }else
                    alert("Ha hagut un error en la base de dades")
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });   
    }else
        alert("No has seleccionat cap alumne");
}

function eliminarAlumno() {
    var selectAlumnosProfessor = cojerElemento("selectAlumnosProfessor");

    var opcionesSeleccionadas = "";
    var opciones = selectAlumnosProfessor.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);
    if (opcionesSeleccionadas.trim() != "") {
        $.ajax({
            url:"../php/mantenimientoProfessors.php",
            type: "post", 
            dataType: 'text',
            data: {borrarAlumnos: "true", professor: professorActual, alumnosBorrar: opcionesSeleccionadas},
            success:function(result){
                if (result == "true") {
                    alert("S'han borrat els moduls");
                    cargarTutoriasProfessor();
                }else
                    alert("Ha hagut un error en la base de dades")
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
        }
        });
    }else
        alert("No has seleccionat cap alumne");
}

function anadirAssignatura() {
    var selectTotsAssignatura = cojerElemento("selectTotsAssignatura");

    var opcionesSeleccionadas = "";
    var opciones = selectTotsAssignatura.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);

    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {anadirAssignatura: "true", professor: professorActual, assignaturasAnadir: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han afegit els moduls");
                cargarAssignaturaProfessor();
            }else
                alert("Ha hagut un error en la base de dades")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function eliminarAssignatura() {
    var selectModulAlumne = cojerElemento("selectAssignaturaProfessor");

    var opcionesSeleccionadas = "";
    var opciones = selectModulAlumne.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);

    $.ajax({
        url:"../php/mantenimientoProfessors.php",
        type: "post", 
        dataType: 'text',
        data: {borrarAssignatura: "true", professor: professorActual, assignaturasBorrar: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han borrat els moduls");
                cargarAssignaturaProfessor();
            }else
                alert("Ha hagut un error en la base de dades")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

//opciones del menu inferior
function opcionElegida(idSeleccionada){

    var opciones = document.getElementsByClassName("divsOpciones");
    for (let index = 0; index < opciones.length; index++) {
        opciones[index].style.display = "none";
    }

    if (idSeleccionada != "") {
        var divSeleccionado = cojerElemento(idSeleccionada);
        divSeleccionado.style.display = "block";   
    }
}

// Get the container element
var btnContainer = cojerElemento("divBotonesOpciones");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("btnOpciones");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    //Empiezo por el  1 envez de 0 porque el cero esta ocupado por el navbar principal
    if (current[1] != undefined) {
        current[1].className = current[1].className.replace(" active", "");   
    }
    this.className += " active";
  });
} 

function cojerElemento(id){
    return document.getElementById(id);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkNSS(nss) {
	if (!nss) return false;
	if (nss.length != 11 && nss.length != 12) return false;
	if (nss.substr(2, 1) == 0) nss = "" + nss.substr(0, 2) + nss.substr(3, nss.length-1);
	if (mod(nss.substr(0, nss.length-2), 97) == nss.substr(nss.length-2, 2)) return true;
	else return false;
}

function comprovarDNI(dni) {
    var numero
    var letr
    var letra
    var expresion_regular_dni
   
    expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
   
    if(expresion_regular_dni.test (dni) == true){
       numero = dni.substr(0,dni.length-1);
       letr = dni.substr(dni.length-1,1);
       numero = numero % 23;
       letra='TRWAGMYFPDXBNJZSQVHLCKET';
       letra=letra.substring(numero,numero+1);
      if (letra!=letr.toUpperCase()) {
         return false;
       }else{
         return true;
       }
    }else{
       return false;
     }
  }