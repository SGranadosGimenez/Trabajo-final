
var alumnoActual;
var accionActual;

function seleccionarAccion(){

    vaciarCampos();

    var fieldSetSeleccionAlumno = cojerElemento("fieldSetSeleccionAlumno");
    fieldSetSeleccionAlumno.disabled = "disabled";
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
            cojerProfessores();
            break;
        case "modificar":
            accionActual = accion;
            fieldSetSeleccionAlumno.disabled = "";
            fieldSetInputs.disabled = "";
            fieldSetButtonRealizarAccion.disabled = "";
            fieldSetOpciones.disabled = "";
            cojerProfessores();
            cojerAlumnos();
            break;
        case "ver":
            fieldSetSeleccionAlumno.disabled = "";
            fieldSetOpciones.disabled = "";
            accionActual = accion;
            cojerAlumnos();
            break;
        case "eliminar":
            accionActual = accion;
            fieldSetSeleccionAlumno.disabled = "";
            cojerAlumnos();
            break;
        default:
            break;
    }
}

function cojerProfessores(){
    var selectTutor = cojerElemento("selectTutor");
    selectTutor.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {cojerProfessores: "true"},
        success:function(result){
            var professores = result.split(";");
            for (let index = 0; index < professores.length; index++) {
                var professorActual = professores[index].split("/");

                var html = "<option value='" + professorActual[0] + "'>" + professorActual[1] + "</option>";

                selectTutor.innerHTML += html;
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
        url:"../php/mantenimientoAlumnos.php",
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
                crearAlumno(datos, "");   
                break;
            case "modificar":
                modificarAlumno(datos);
                break;
            default:
                break;
        }
    }
}
/* Parte de creacion de alumnos */
function validacionDatos(){
    var Tutor = cojerElemento("selectTutor").options[cojerElemento("selectTutor").selectedIndex].value;
    if (Tutor.trim() == "") {
        alert("El tutor esta buit");
        return "";
    }

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

    var cbInformacioPares = "0";
    if (cojerElemento("cbInformacioPares").checked) {
        cbInformacioPares = "1";
    }

    var inputFamiliaNombrosa = cojerElemento("inputFamiliaNombrosa").value;
    if (inputFamiliaNombrosa.trim() == "")
        inputFamiliaNombrosa = "0"

    var sexe = cojerElemento("selectSexe").options[cojerElemento("selectSexe").selectedIndex].value;

    var inputDNI = cojerElemento("inputDNI").value;
    if (inputDNI.trim() == "" || comprovarDNI(inputDNI)) {
        alert("No has introduit el dni");
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

    var inputAdreca = cojerElemento("inputAdreca").value;

    return Tutor + ";" + usuari + ";" + inputContrasenya + ";" + inputNom + ";" + inputPrimerCognom + ";" + inputSegonCognom + ";" + cbInformacioPares + ";" + inputFamiliaNombrosa + ";" + sexe + ";" + inputDNI + ";" + inputDataNaixement + ";" + inputNacionalitat + ";" + inputLlocNaixement + ";" + inputNumeroSeguretatSocial + ";" + inputCorreuElectronic + ";" + inputTelefon + ";" + inputTelefonMobil + ";" + inputAdreca;
}

function crearAlumno(valores, massa) {
    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {crearAlumno: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                if (massa == "") {
                    alert("Alumno creado");
                    vaciarCampos();
                }
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

function modificarAlumno(valores) {
    var alumnoEscogido = cojerElemento("alumnoEscogido");
    valores += ";" + alumnoEscogido.value;
    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {modificarAlumno: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                alert("Alumno modificado");
                vaciarCampos();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function vaciarCampos(){

    cleanSelects("alumnoEscogido");
    
    cojerElemento("selectTutor").selectedIndex = "0";

    cojerElemento("inputUsuari").value = ""

    cojerElemento("inputContrasenya").value = "";

    cojerElemento("inputCodificado").value = "";

    cojerElemento("inputNom").value = "";

    cojerElemento("inputPrimerCognom").value = "";

    cojerElemento("inputSegonCognom").value = "";

    cojerElemento("cbInformacioPares").checked = false;

    cojerElemento("inputFamiliaNombrosa").value = "";

    cojerElemento("selectSexe").selectedIndex = "0";

    cojerElemento("inputDNI").value = "";

    cojerElemento("inputDataNaixement").value = "";

    cojerElemento("inputNacionalitat").value = "";

    cojerElemento("inputLlocNaixement").value = "";

    cojerElemento("inputNumeroSeguretatSocial").value = "";

    cojerElemento("inputCorreuElectronic").value = "";

    cojerElemento("inputTelefon").value = "";

    cojerElemento("inputTelefonMobil").value = "";

    cojerElemento("inputAdreca").value = "";

    opcionElegida("");
}

function cleanSelects(idSelect){
    var select = document.getElementById(idSelect);
    var length = select.options.length;
    for (i = length - 1; i > 0; i--) {
        select.options[i] = null;
    }
}
/* -----------------------------------------------------TERMINA CREACON ALUMNOS----------------------------------------------------------------*/
function cojerAlumnos(){
    var alumnoEscogido = cojerElemento("alumnoEscogido");
    alumnoEscogido.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {cojerAlumnos: "true"},
        success:function(result){
            var alumnos = result.split(";");
            for (let index = 0; index < alumnos.length; index++) {
                var alumnosActual = alumnos[index].split("/");

                var html = "<option value='" + alumnosActual[0] + "'>" + alumnosActual[1] + "</option>";

                alumnoEscogido.innerHTML += html;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}

function seleccionarAlumno(){
    alumnoActual = cojerElemento("alumnoEscogido").options[cojerElemento("alumnoEscogido").selectedIndex].value;
    
    if (alumnoActual.trim() != "") {
        if (accionActual == "eliminar") {
            eliminarAlumno(alumnoActual);
        }else{
            cojerProfessores();
            informacionAlumno(alumnoActual);
        }
    }else
        alert("No has escogido ningun alumno");
}

function informacionAlumno (alumnoEscogido){
        $.ajax({
            url:"../php/mantenimientoAlumnos.php",
            type: "post", 
            dataType: 'text',
            data: {informacionAlumno: "true", alumnoBuscado: alumnoEscogido},
            success:function(result){
                var objJson = JSON.parse(result);

                rellenarDatos(objJson);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });  
}

function eliminarAlumno (alumnoEscogido){
    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {eliminarAlumno: "true", alumnoBuscado: alumnoEscogido},
        success:function(result){
            if (result == "true") {
                alert("Alumno borrado");
                cojerAlumnos();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}
    
function rellenarDatos(jsonObject){

    cojerElemento("selectTutor").selectedIndex = buscarValorSelect("selectTutor", jsonObject.tutor[0]);

    cojerElemento("inputUsuari").value = jsonObject.usuario;

    cojerElemento("inputContrasenya").value = jsonObject.contrasenya;

    cojerElemento("inputNom").value = jsonObject.nom;

    cojerElemento("inputPrimerCognom").value = jsonObject.primerCognom;

    cojerElemento("inputSegonCognom").value = jsonObject.segonCognom;

    cojerElemento("cbInformacioPares").checked = jsonObject.enviarInformacioPares;

    cojerElemento("inputFamiliaNombrosa").value = jsonObject.familiaNombrosa;

    cojerElemento("selectSexe").selectedIndex = buscarValorSelect("selectSexe", jsonObject.sexe);

    cojerElemento("inputDNI").value = jsonObject.dni;

    cojerElemento("inputDataNaixement").value = jsonObject.dataNaixement;

    cojerElemento("inputNacionalitat").value = jsonObject.nacionalitat;

    cojerElemento("inputLlocNaixement").value = jsonObject.llocNaixement;

    cojerElemento("inputNumeroSeguretatSocial").value = jsonObject.numSeguretatSocial;

    cojerElemento("inputCorreuElectronic").value = jsonObject.correuElectronic;

    cojerElemento("inputTelefon").value = jsonObject.telefon;

    cojerElemento("inputTelefonMobil").value = jsonObject.telefonMobil;

    cojerElemento("inputAdreca").value = jsonObject.adreca;
}

function buscarValorSelect(idselect, valor){
    var select = cojerElemento(idselect);

    for (let index = 0; index < select.options.length; index++) {
        if(select.options[index].value == valor){
            return index;
        }
    }
    return 0;
}

function cargarFaltasAssistencia(){
    cleanSelects("selectModulo");
    opcionElegida("divFaltasAlumno");
    $.ajax({
        url:"../php/faltasAssistenciaFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {prepararFaltasAssistencia: "true", alumno: alumnoActual},
        success:function(result){
            if (result != "") {
                var objJson = JSON.parse(result);
                
                var arrayFaltas = objJson.faltasAssistencia;
                var arrayModulos = objJson.modulos;

                //Relleno el div de las faltas con las recogidas
                var divFaltasAssistencia = cojerElemento("divFaltasAssistencia");
                divFaltasAssistencia.innerHTML = "";
                for (let index = 0; index < arrayFaltas.length; index++) {
                    var objFalta = arrayFaltas[index];

                    var idAssistencia = objFalta.idAssistencia;

                    var estadoFalta = "";
                    var buttonJustificar = "";
                    if (objFalta.estat == "justificada") 
                        estadoFalta = "faltaJustificada";
                    else{
                        estadoFalta = "faltaNoJustificada";
                        buttonJustificar = "<button type='button' class='btn btn-default' onclick='justificarFalta(" + idAssistencia + ")'>Justificar</button>";
                    }
                    var nombre = objFalta.nom;
                    var fecha = objFalta.fecha;
                    var hora = objFalta.hora;
                    

                    var html = `<div class='col-sm-7 col-sm-push-3 ` + estadoFalta + `'>
                                    <p>Modul: ` + nombre + `</p>
                                    <p>La falta fue el ` + fecha + ` en la hora ` + hora + `</p>
                                    ` + buttonJustificar + `
                                </div>
                                <div class="row top-buffer"><div class="row top-buffer"> `;

                    divFaltasAssistencia.innerHTML += html;
                }

                var selectModulo = cojerElemento("selectModulo");
                for (let index = 0; index < arrayModulos.length; index++) {
                    var objModulo = arrayModulos[index];

                    var idModulo = objModulo.idModul;
                    var nomModulo = objModulo.nom;

                    var html = "<option value='" + idModulo + "'>" + nomModulo + "</option>";
                    selectModulo.innerHTML += html;
                }
            }else if(resultado == "noFaltas")
                alert("L'alumne no te faltas");
            else if(resultado == "noModulos")
                alert("L'alumne no te moduls")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function justificarFalta(idAssistencia){
    $.ajax({
        url:"../php/faltasAssistenciaFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {justificarFaltas: "true", assistenciaSeleccionada: idAssistencia},
        success:function(result){
            if (result = "true") {
                alert("Falta justificada.");
                cargarFaltasAssistencia();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function actualizarFaltas(modulo) {
    cojerElemento("divFaltasAssistencia").innerHTML = "";
    $.ajax({
        url:"../php/faltasAssistenciaFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {actualizarFaltas: "true", alumno: alumnoActual, moduloElegido: modulo},
        success:function(result){
            if (result != "noFaltas") {
                var objJson = JSON.parse(result);
                
                var arrayFaltas = objJson.faltasAssistencia;
                if (arrayFaltas != null) {
                    //Relleno el div de las faltas con las recogidas
                    var divFaltasAssistencia = cojerElemento("divFaltasAssistencia");
                    divFaltasAssistencia.innerHTML = "";
                    for (let index = 0; index < arrayFaltas.length; index++) {
                        var objFalta = arrayFaltas[index];

                        var idAssistencia = objFalta.idAssistencia;

                        var estadoFalta = "";
                        var buttonJustificar = "";
                        if (objFalta.estat == "justificada") 
                            estadoFalta = "faltaJustificada";
                        else{
                            estadoFalta = "faltaNoJustificada";
                            buttonJustificar = "<button type='button' class='btn btn-default' onclick='justificarFalta(" + idAssistencia + ")'>Justificar</button>";
                        }
                        var nombre = objFalta.nom;
                        var fecha = objFalta.fecha;
                        var hora = objFalta.hora;
                        

                        var html = `<div class='col-sm-7 col-sm-push-3 ` + estadoFalta + `'>
                                        <p>Modul: ` + nombre + `</p>
                                        <p>La falta fue el ` + fecha + ` en la hora ` + hora + `</p>
                                        ` + buttonJustificar + `
                                    </div>
                                    <div class="row top-buffer"><div class="row top-buffer"> `;

                        divFaltasAssistencia.innerHTML += html;
                    }
                }
            }else
                alert("L'alumne no te faltas");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function cargarAvaluacionesTrabajos() {
    opcionElegida("divAvaluacionAlumno");
    cargarAvaluaciones();
    cargarCursos();
}

function cargarAvaluaciones(){
    cojerElemento("divAvaluaciones").innerHTML = "";
    var cursoSeleccionado = "";
    if (selectCursoAvaluacio.selectedIndex > 0) {
        cursoSeleccionado = selectCursoAvaluacio.options[selectCursoAvaluacio.selectedIndex].value;   
    }
    $.ajax({
        url:"../php/avaluacionesFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cargarAvaluacionesAlumno: "true", alumno: alumnoActual, curso: cursoSeleccionado},
        success:function(result){
            if (result != "noDatos") {
                var objJson = JSON.parse(result);
                
                var arrayAvaluaciones = objJson.avaluaciones;

                //Relleno el div de las faltas con las recogidas
                var divAvaluacionAlumno = cojerElemento("divAvaluaciones");
                divAvaluacionAlumno.innerHTML = "";
                for (let index = 0; index < arrayAvaluaciones.length; index++) {
                    var avaluacionActual = arrayAvaluaciones[index];
                    //Le quito los espacios interiores para hacer una buena id
                    var nombreDiv = "divCurso" + avaluacionActual.nomCurs.replace(" ", "");
                        divAvaluacionAlumno.innerHTML += `<div id="` + nombreDiv + `">
                                                            <h2>` + avaluacionActual.nomCurs + `</h2>
                                                            <p>Nota media: ` + avaluacionActual.notaMediaCurso + `</p>
                                                            ` + cargarAssignaturasCurso(avaluacionActual.assignaturas);
                }
            }else if(resultado == "noDatos")
                alert("No s'han trobat dades");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function cargarCursos(){
    $.ajax({
        url:"../php/cursosFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cargarCursosAlumno: "true", alumno: alumnoActual},
        success:function(result){
            if (result != "noDatos") {
                var objJson = JSON.parse(result);
                
                var arrayCursos = objJson.cursos;

                var selectCursoAvaluacio = cojerElemento("selectCursoAvaluacio");
                selectCursoAvaluacio.innerHTML = "<option value='tots'>Tots</option>";
                for (let index = 0; index < arrayCursos.length; index++) {
                    var cursoActual = arrayCursos[index];
                    selectCursoAvaluacio.innerHTML += "<option value='" + cursoActual.idCurso + "'>" + cursoActual.nom + "</option>"
                }
            }else
                alert("No s'han trobat dades");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function cargarAssignaturasCurso(arrayAssignaturas){
    var htmlDatos = "";
    for (let index = 0; index < arrayAssignaturas.length; index++) {
        var assignaturaActual = arrayAssignaturas[index];
        htmlDatos += `<div class="col-sm-12">
                        <h3>` + assignaturaActual.nombreAssignatura + `</h3>
                        <p>Nota media assignatura: ` + assignaturaActual.notaMediaAssignatura + `</p>
                        `;

        for (let indexModulo = 0; indexModulo < assignaturaActual.modulos.length; indexModulo++) {
            var moduloActual = assignaturaActual.modulos[indexModulo];
            htmlDatos += `<div  class="col-sm-3 col-sm-offset-1">
                                <h4 class="nombreModul">` + moduloActual.nomModul + `</h4>
                                <p>Comentari: ` + moduloActual.comentariModul + `</p>
                                <p>Nota modul: ` + moduloActual.notaModul + `</p>
                            </div>`;
        }
        htmlDatos += "</div>";   
    }

    htmlDatos += `
                </div>`;

    return htmlDatos;
}

function cargarModulosAlumno(){
    opcionElegida("divModuloAlumno");
    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {cargarModulos: "true", alumno: alumnoActual},
        success:function(result){
            var valoresResultado = result.split("|");

            var modulosAlumno = valoresResultado[0].split(";");
            var todosModulos = valoresResultado[1].split(";");

            var selectModulAlumne = cojerElemento("selectModulAlumne");
            selectModulAlumne.innerHTML = "";
            if (modulosAlumno[0].trim() != "") {
                for (let index = 0; index < modulosAlumno.length; index++) {
                    var valoresModul = modulosAlumno[index].split("-");
                    selectModulAlumne.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }

            var selectTotsAlumne = cojerElemento("selectTotsAlumne");
            selectTotsAlumne.innerHTML = "";
            if (todosModulos[0].trim() != "") {
                for (let index = 0; index < todosModulos.length; index++) {
                    var valoresModul = todosModulos[index].split("-");
                    selectTotsAlumne.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function anadirModulo() {
    var selectTotsAlumne = cojerElemento("selectTotsAlumne");

    var opcionesSeleccionadas = "";
    var opciones = selectTotsAlumne.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);

    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {anadirModulos: "true", alumno: alumnoActual, modulosAnadir: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han afegit els moduls");
                cargarModulosAlumno();
            }else
                alert("Ha hagut un error en la base de dades")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

function eliminarModulo() {
    var selectModulAlumne = cojerElemento("selectModulAlumne");

    var opcionesSeleccionadas = "";
    var opciones = selectModulAlumne.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);

    $.ajax({
        url:"../php/mantenimientoAlumnos.php",
        type: "post", 
        dataType: 'text',
        data: {borrarModulos: "true", alumno: alumnoActual, modulosBorrar: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han borrat els moduls");
                cargarModulosAlumno();
            }else
                alert("Ha hagut un error en la base de dades")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

//Creacion de alumnos en    
function crearAlumnosMassa(){
    var archivo = cojerElemento("archivoMassa").files;

    if (archivo.length == 1) {
        var nombreArchivo = archivo[0].name;
        var lastDot = nombreArchivo.lastIndexOf('.');

        var extension = nombreArchivo.substring(lastDot + 1);
        if (extension == "csv") {
            Papa.parse(archivo[0], {
                header: true,
                complete: function(results) {
                    var arrayDatos = results.data;
                    for (let index = 0; index < arrayDatos.length - 1; index++) {
                        var alumnoActual = arrayDatos[index];
                        var Tutor = alumnoActual.idTutor;
                        var Usuari = alumnoActual.Usuari;
                        var Contrasenya = alumnoActual.Contrasenya;
                        var Nom = alumnoActual.Nom;
                        var PrimerCognom = alumnoActual.PrimerCognom;
                        var SegonCognom = alumnoActual.SegonCognom;
                        var EnviarInformacioPares = alumnoActual.EnviarInformacioPares;
                        var FamiliaNombrosa = alumnoActual.FamiliaNombrosa;
                        var Sexe = alumnoActual.Sexe;
                        var DNI = alumnoActual.DNI;
                        var DataNaixement = alumnoActual.DataNaixement;
                        var Nacionalitat = alumnoActual.Nacionalitat;
                        var LlocNaixement = alumnoActual.LlocNaixement;
                        var NumSeguretatSocial = alumnoActual.NumSeguretatSocial;
                        var CorreuElectronic = alumnoActual.CorreuElectronic;
                        var Telefon = alumnoActual.Telefon;
                        var TelefonMobil = alumnoActual.TelefonMobil;
                        var Adreca = alumnoActual.Adreca;

                        var datos = Tutor + ";" + Usuari + ";" + Contrasenya + ";" + Nom + ";" + PrimerCognom + ";" + SegonCognom + ";" + EnviarInformacioPares + ";" + FamiliaNombrosa + ";" + Sexe + ";" + DNI + ";" + DataNaixement + ";" + Nacionalitat + ";" + LlocNaixement + ";" + NumSeguretatSocial + ";" + CorreuElectronic + ";" + Telefon + ";" + TelefonMobil + ";" + Adreca;
                        crearAlumno(datos, "true");
                    }

                    alert("Se estan creats tots els alumnes");
                }
            });
        }else
            alert("Nomes pots pujar arxius .csv");
    }else
        alert("Tens que pujar un arxiu")
}

/* Funciones de entregas de trabajo */
function Printarentregas() {
    opcionElegida("divEntregasAlumno");
    $.ajax({
        url: "../php/entregasTrabajoFunciones.php",
        type: "post",
        dataType: 'text',
        data: { Printarentregas: "true", alumno: alumnoActual},
        success: function (result) {
            if (result == "string") {
                document.getElementById("printar").innerHTML = "<br><br><div class='block-center text-center'><h3>No hi ha ninguna entrega</h3></div>";
            }
            else {
                var objJson = JSON.parse(result);
                var obj = objJson.array;
                var x = 0;
                var y = 0;
                var activa = 0;
                document.getElementById("printar").innerHTML = "";
                var fechaactual = new Date();
                while (obj.length > x) {
                    var entregaActual = obj[x];
                    var fecha = new Date(entregaActual.DataEntrega);
                    if (fechaactual > fecha) {
                        if (y == 0 && activa > 0) {
                            var texto = '<br><hr><br><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">';
                            y++;
                        }
                        else {
                            var texto = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">';
                        }
                    }
                    else {
                        activa++;
                        var texto = '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">';
                    }
                    texto += entregaActual.nomas + " - " + entregaActual.modul + "</h3></div><div class='panel-body'><h4 class='text-center'>" + entregaActual.Nom + "</h4>";
                    texto += "<div class='col-xs-9 col-xs-offset-1'><button type='button' class='btn btn-default col-sm-5 col-sm-offset-4' onclick='eliminarEntrega(" + entregaActual.idEntrega + ")'>Eliminar entrega</button></div>";
                    texto += "<div class='row'><div class='col-xs-2 col-xs-offset-1'><p>Descripció: </p></div><div class='col-xs-9'><p>";
                    texto += entregaActual.Descripcio + "</p></div><div class='col-xs-2 col-xs-offset-1'><p>Data Inicial: </p></div><div class='col-xs-9'><p>" + entregaActual.DataInicial + "</p></div><div class='col-xs-2 col-xs-offset-1'>";
                    texto += "<p>Data Final: </p></div><div class='col-xs-9'><p>" + entregaActual.DataFinal + "</p></div>";
                    texto += "<div class='col-xs-2 col-xs-offset-1'><p>Data Entrega: </p></div><div class='col-xs-9'><p>" + entregaActual.DataEntrega + "</p></div>";
                    if (entregaActual.notaEntrega != null) {
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Nota: </p></div><div class='col-xs-9'><p>" + entregaActual.notaEntrega + "</p></div>";   
                    }
                    //Siempre es visible por si quiere cambiar la nota
                    texto += "<div class='col-xs-2 col-xs-offset-1'><p>Cambiar Nota: </p></div><div class='col-xs-9'><input type='number' id='notaEntrega' class='form-control col-sm-4'> <button type='button' class='btn btn-default col-sm-4' onclick='pujarNotaEntrega(" + entregaActual.idEntrega + ")'>Posar nota</button> </div>";

                    if (entregaActual.ArxiuAdjunt != null) {
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Enunciat: </p></div><div class='col-xs-9'><p>" + entregaActual.ArxiuAdjunt + "</p> <button type='button' class='btn btn-default' onclick='descargarArxiuAdjunt(" + entregaActual.idEntrega + ")'>Descarregar enunciat</button></div>";   
                    }else
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Arxiu adjunt: </p></div><div class='col-xs-9'><input type='file' id='arxiuAdjunt' class='form-control col-sm-4'> <button type='button' class='btn btn-default col-sm-4' onclick='pujarArxiuAdjunt(" + entregaActual.idEntrega + ")'>Pujar arxiu adjunt</button> </div>";
                    
                    if (entregaActual.fitxerEntregat != null) {
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Arxiu entregat: </p></div><div class='col-xs-9'><p>" + entregaActual.fitxerEntregat + "</p> <button type='button' class='btn btn-default' onclick='descargarArxiuEntrega(" + entregaActual.idEntrega + ")'>Descarregar arxiu entregat</button></div>";   
                    }else
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Pujar arxiu entregat: </p></div><div class='col-xs-9'><input type='file' id='arxiuEntregat' class='form-control col-sm-4'> <button type='button' class='btn btn-default col-sm-4' onclick='pujarArxiuEntrega(" + entregaActual.idEntrega + ")'>Pujar arxiu d'entrega</button> </div>";
                    
                    texto += "</div></div></div>";
                    document.getElementById("printar").innerHTML += texto;
                    x++;
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function pujarArxiuEntrega(idEntrega){
    var archivos = document.getElementById("arxiuEntregat").files;
    if (archivos.length != 1) {
        alert("Puja nomes un arxiu");
    }else{
        var formData = new FormData();
        formData.append("pujarArxiuEntregat", archivos[0]);
        formData.append("alumno", alumnoActual);
        formData.append("entrega", idEntrega);
        $.ajax({
            url: '../php/entregasTrabajoFunciones.php',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(response) {
                switch (response) {
                    case "true":
                        alert("S'ha pujat correctament l'arxiu");
                        Printarentregas();
                        break;
                    case "errorBD":
                        alert("Error al guardar l'arxiu en la base de dades");
                        break;
                    case "extensionExe":
                        alert("L'arxiu no pot tenir extensio .exe");
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

function descargarArxiuEntrega(idEntrega) {
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {decargarArchivoEntregado: "true", entrega: idEntrega, alumno: alumnoActual},
        success:function(result){
            if (result != "") {
                window.open("../php/"  + result, "_blank");
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function pujarArxiuAdjunt(idEntrega) {
    var archivos = document.getElementById("arxiuAdjunt").files;
    if (archivos.length != 1) {
        alert("Puja nomes un arxiu");
    }else{
        var formData = new FormData();
        formData.append("pujarArxiuAdjunt", archivos[0]);
        formData.append("entrega", idEntrega);
        $.ajax({
            url: '../php/entregasTrabajoFunciones.php',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(response) {
                switch (response) {
                    case "true":
                        alert("S'ha pujat correctament l'arxiu");
                        Printarentregas();
                        break;
                    case "errorBD":
                        alert("Error al guardar l'arxiu en la base de dades");
                        break;
                    case "extensionExe":
                        alert("L'arxiu no pot tenir extensio .exe");
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

function descargarArxiuAdjunt(idEntrega) {
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {decargarArchivoAdjunto: "true", entrega: idEntrega},
        success:function(result){
            if (result != "") {
                window.open("../php/"  + result, "_blank");
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function eliminarEntrega(idEntrega) {
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {eliminarEntrega: "true", entrega: idEntrega},
        success:function(result){
            if (result == "true") {
                alert("S'ha eliminat la entrega");
                Printarentregas();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
/* FINAL ENTREGAS DE TRABAJO */

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

function cojerElemento(id){
    return document.getElementById(id);
}