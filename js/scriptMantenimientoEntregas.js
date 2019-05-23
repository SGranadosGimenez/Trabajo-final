
var entregaActual = "";
var modulActual = "";
var accionActual;

function seleccionarAccion(){

    vaciarCampos();

    var fieldSetSeleccionEntrega = cojerElemento("fieldSetSeleccionEntrega");
    fieldSetSeleccionEntrega.disabled = "disabled";
    var fieldSetSeleccionModul = cojerElemento("fieldSetSeleccionModul");
    fieldSetSeleccionModul.disabled = "disabled";
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
            fieldSetSeleccionEntrega.disabled = "";
            fieldSetInputs.disabled = "";
            fieldSetButtonRealizarAccion.disabled = "";
            fieldSetOpciones.disabled = "";
            break;
        case "ver":
            fieldSetSeleccionEntrega.disabled = "";
            fieldSetOpciones.disabled = "";
            accionActual = accion;
            break;
        case "eliminar":
            accionActual = accion;
            fieldSetSeleccionEntrega.disabled = "";
            break;
        default:
            break;
    }
    cojerModuls();
    fieldSetSeleccionModul.disabled = "";
}

function realizarAccion() {
    switch (accionActual) {
        case "crear":   
            crearEntrega();   
            break;
        case "modificar":
            modificarEntrega();
            break;
        default:
            break;
    }
}
/* Parte de creacion de entregas */
function validacionDatos(){

    var inputNomEntrega = cojerElemento("inputNomEntrega").value;
    if (inputNomEntrega.trim() == "") {
        alert("Tens que posar un nom")
        return "";
    }

    var inputDescripcioEntrega = cojerElemento("inputDescripcioEntrega").value;

    var inputDataInicialEntrega = cojerElemento("inputDataInicialEntrega").value;
    if (inputDataInicialEntrega.trim() == "") {
        alert("Tens que posar una data inicial")
        return "";
    }

    var inputHoraInicialEntrega = cojerElemento("inputHoraInicialEntrega").value;
    if (inputHoraInicialEntrega.trim() == "") {
        alert("Tens que posar una hora inicial")
        return "";
    }

    var dateTimeInicial = parseDate(inputDataInicialEntrega + "-" + inputHoraInicialEntrega);

    var inputDataFinalEntrega = cojerElemento("inputDataFinalEntrega").value;
    if (inputDataFinalEntrega.trim() == "") {
        alert("Tens que posar una data final");
        return "";
    }

    var inputHoraFinalEntrega = cojerElemento("inputHoraFinalEntrega").value;
    if (inputHoraFinalEntrega.trim() == "") {
        alert("Tens que posar una hora final");
        return "";
    }

    var dateTimeFinal = parseDate(inputDataFinalEntrega + "-" + inputHoraFinalEntrega);

    var inputDataEntregaEntrega = cojerElemento("inputDataEntregaEntrega").value;
    if (inputDataEntregaEntrega.trim() == "") {
        alert("Tens que posar una data d'entrega");
        return "";
    }

    var inputHoraEntregaEntrega = cojerElemento("inputHoraEntregaEntrega").value;
    if (inputHoraEntregaEntrega.trim() == "") {
        alert("Tens que posar una hora d'entrega");
        return "";
    }

    var dateTimeEntrega = parseDate(inputDataEntregaEntrega + "-" + inputHoraEntregaEntrega);

    //Compruebo que las fechas esten correctamente elegidas
    if (dateTimeInicial > dateTimeFinal || dateTimeInicial > dateTimeEntrega) {
        alert("La data inicial te que ser la primera");
        return "";
    }

    //Compruebo que las fechas esten correctamente elegidas
    if (dateTimeFinal > dateTimeEntrega) {
        alert("La data final te que ser avans de la data d'entrega");
        return "";
    }

    var inputValorActivitat = cojerElemento("inputValorActivitat").value;
    if (inputValorActivitat.trim() == "") {
        alert("No has introduit un valor per l'activitat");
        return "";
    }
    
    if (modulActual  == "") {
        alert("Tens que seleccionar un modul");
        return ""
    }

    return modulActual + ";" + inputNomEntrega + ";" + inputDescripcioEntrega + ";" + inputDataInicialEntrega + " " + inputHoraInicialEntrega + ";" + inputDataFinalEntrega + " " + inputHoraFinalEntrega + ";" + inputDataEntregaEntrega + " " + inputHoraEntregaEntrega + ";" + inputValorActivitat;
}

function crearEntrega() {
    var valores = validacionDatos();
    if(valores != ""){
        var archivos = document.getElementById("inputArxiuAdjuntEntrega").files;
        if (archivos.length != 1) {
            alert("Puja nomes un arxiu");
        }else{
            var formData = new FormData();
            formData.append("crearEntrega", true);
            formData.append("arxiuEntregaCreada", archivos[0]);
            formData.append("valores", valores);
            $.ajax({
                url: '../php/entregasTrabajoFunciones.php',
                data: formData,
                type: 'POST',
                processData: false,
                contentType: false,
                success: function(response) {
                    switch (response) {
                        case "true":
                            alert("S'ha creat l'entrega de treball");
                            cargarEntregasTrabajos();
                            break;
                        case "errorCrear":
                            alert("Error al crear entrega");
                            break;
                        case "errorId":
                            alert("Ha hagut un error a la base de dades");
                            break;
                        default:
                            alert("Ha hagut un error proba un altre vegada");
                            break;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Ha ocurrido un error");
               }
            });
        }
    }
}


function modificarEntrega(valores) {
    var valores = validacionDatos();
    if(valores != ""){
        valores += ";" + entregaActual;
        var formData = new FormData();
        formData.append("modificarEntrega", true);
        formData.append("entrega", entregaActual);
        formData.append("modul", modulActual);
        formData.append("valores", valores);
        var archivos = document.getElementById("inputArxiuAdjuntEntrega").files;
        if (archivos.length = 1) {
            formData.append("arxiuEntregaModificada", archivos[0]);
        }
        $.ajax({
            url: '../php/entregasTrabajoFunciones.php',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(response) {
                if (response == "true") {
                    alert("Entrega modificada");
                    vaciarCampos();
                }else
                    alert("Ha hagut un error");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
            }
        });
    }  
}

function vaciarCampos(){

    cleanSelects("entregaEscogida");
    
    cojerElemento("inputNomEntrega").value = "";

    cojerElemento("inputDescripcioEntrega").value = ""

    cojerElemento("inputDataInicialEntrega").value = "";

    cojerElemento("inputHoraInicialEntrega").value = "";

    cojerElemento("inputDataFinalEntrega").value = "";

    cojerElemento("inputHoraFinalEntrega").value = "";

    cojerElemento("inputDataEntregaEntrega").value = "";

    cojerElemento("inputHoraEntregaEntrega").value = "";

    cojerElemento("inputArxiuAdjuntEntrega").value = "";
    cojerElemento("ArchivoCargado").innerText = "";

    cojerElemento("inputValorActivitat").value = "0";

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
function cojerModuls(){
    var modulEscogido = cojerElemento("modulEscogido");
    modulEscogido.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cargarModulosEntrega: "true"},
        success:function(result){
            var modul = result.split(";");
            for (let index = 0; index < modul.length; index++) {
                var modulsActual = modul[index].split("/");

                var html = "<option value='" + modulsActual[0] + "'>" + modulsActual[1] + "</option>";

                modulEscogido.innerHTML += html;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}

function cojerEntregas(){
    var entregaEscogida = cojerElemento("entregaEscogida");
    entregaEscogida.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cojerEntregas: "true", modul: modulActual},
        success:function(result){
            if (result != "errorBD") {
                var entregas = result.split(";");
                for (let index = 0; index < entregas.length; index++) {
                    var entregasActual = entregas[index].split("/");

                    var html = "<option value='" + entregasActual[0] + "'>" + entregasActual[1] + "</option>";

                    entregaEscogida.innerHTML += html;
                }
            }else
                alert("Aquest modul no te entreges");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}

function seleccionarModul(){
    modulActual = cojerElemento("modulEscogido").options[cojerElemento("modulEscogido").selectedIndex].value;
    
    if (modulActual.trim() != "") {
        cojerEntregas();
    }else
        alert("No has escogido ningun entrega");
}

function seleccionarEntrega(){
    entregaActual = cojerElemento("entregaEscogida").options[cojerElemento("entregaEscogida").selectedIndex].value;
    
    if (entregaActual.trim() != "") {
        if (accionActual == "eliminar") {
            eliminarEntrega(entregaActual, false);
        }else{
            informacionEntrega(entregaActual);
        }
    }else
        alert("No has escogido ningun entrega");
}

function informacionEntrega (entregaEscogido){
        $.ajax({
            url:"../php/entregasTrabajoFunciones.php",
            type: "post", 
            dataType: 'text',
            data: {informacionEntrega: "true", entrega: entregaEscogido},
            success:function(result){
                var objJson = JSON.parse(result);

                rellenarDatos(objJson);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });  
}
    
function rellenarDatos(jsonObject){

    cojerElemento("inputNomEntrega").value = jsonObject.nom;

    cojerElemento("inputDescripcioEntrega").value = jsonObject.descripcio;

    cojerElemento("inputDataInicialEntrega").value = jsonObject.dataInicial;

    cojerElemento("inputHoraInicialEntrega").value = jsonObject.horaInicial;

    cojerElemento("inputDataFinalEntrega").value = jsonObject.dataFinal;

    cojerElemento("inputHoraFinalEntrega").value = jsonObject.horaFinal;

    cojerElemento("inputDataEntregaEntrega").value = jsonObject.dataEntrega;

    cojerElemento("inputHoraEntregaEntrega").value = jsonObject.horaEntrega;

    cojerElemento("ArchivoCargado").innerText = "Archivo: " + jsonObject.arxiuAdjunt;

    cojerElemento("inputValorActivitat").selectedIndex = jsonObject.valorActivitat;

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
    opcionElegida("divFaltasEntrega");
    $.ajax({
        url:"../php/faltasAssistenciaFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {prepararFaltasAssistencia: "true", entrega: entregaActual},
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
        data: {actualizarFaltas: "true", entrega: entregaActual, moduloElegido: modulo},
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
    opcionElegida("divAvaluacionEntrega");
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
        data: {cargarAvaluacionesEntrega: "true", entrega: entregaActual, curso: cursoSeleccionado},
        success:function(result){
            if (result != "noDatos") {
                var objJson = JSON.parse(result);
                
                var arrayAvaluaciones = objJson.avaluaciones;

                //Relleno el div de las faltas con las recogidas
                var divAvaluacionEntrega = cojerElemento("divAvaluaciones");
                divAvaluacionEntrega.innerHTML = "";
                for (let index = 0; index < arrayAvaluaciones.length; index++) {
                    var avaluacionActual = arrayAvaluaciones[index];
                    //Le quito los espacios interiores para hacer una buena id
                    var nombreDiv = "divCurso" + avaluacionActual.nomCurs.replace(" ", "");
                        divAvaluacionEntrega.innerHTML += `<div id="` + nombreDiv + `">
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
        data: {cargarCursosEntrega: "true", entrega: entregaActual},
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

function cargarModulosEntrega(){
    opcionElegida("divModuloEntrega");
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cargarModulos: "true", entrega: entregaActual},
        success:function(result){
            var valoresResultado = result.split("|");

            var modulosEntrega = valoresResultado[0].split(";");
            var todosModulos = valoresResultado[1].split(";");

            var selectModulAlumne = cojerElemento("selectModulAlumne");
            selectModulAlumne.innerHTML = "";
            if (modulosEntrega[0].trim() != "") {
                for (let index = 0; index < modulosEntrega.length; index++) {
                    var valoresModul = modulosEntrega[index].split("-");
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
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {anadirModulos: "true", entrega: entregaActual, modulosAnadir: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han afegit els moduls");
                cargarModulosEntrega();
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
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {borrarModulos: "true", entrega: entregaActual, modulosBorrar: opcionesSeleccionadas},
        success:function(result){
            if (result == "true") {
                alert("S'han borrat els moduls");
                cargarModulosEntrega();
            }else
                alert("Ha hagut un error en la base de dades")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });
}

/* Funciones de entregas de trabajo */
function Printarentregas() {
    opcionElegida("divEntregasEntrega");
    $.ajax({
        url: "../php/entregasTrabajoFunciones.php",
        type: "post",
        dataType: 'text',
        data: { Printarentregas: "true", entrega: entregaActual},
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
                    texto += "<div class='col-xs-9 col-xs-offset-1'><button type='button' class='btn btn-default col-sm-5 col-sm-offset-4' onclick='eliminarEntregaeliminarEntrega(" + entregaActual.idEntrega + ", true)'>Eliminar entrega</button></div>";
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
        formData.append("entrega", entregaActual);
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
        data: {decargarArchivoEntregado: "true", entrega: idEntrega, entrega: entregaActual},
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

function eliminarEntrega(idEntrega, printar) {
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {eliminarEntrega: "true", entrega: idEntrega},
        success:function(result){
            if (result == "true") {
                alert("S'ha eliminat la entrega");
                if (printar) {
                    Printarentregas();   
                }else
                    cojerEntregas();
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

// Añado un onclick en todos los botones para cuando los clicken les añada la clase active
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

function parseDate(input) {
    var parts = input.split('-');
    try {
        var horas = parts[3].split(":");
        return new Date(parts[2], parts[1]-1, parts[0], horas[0], horas[1]);   
    } catch (error) {
        return "";
    } 
  }

function cojerElemento(id){
    return document.getElementById(id);
}