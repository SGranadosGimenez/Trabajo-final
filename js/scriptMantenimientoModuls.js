
var modulActual;
var accionActual;

function seleccionarAccion(){

    vaciarCampos();
    opcionElegida("");

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
            cojerAssignaturas();
            break;
        case "modificar":
            accionActual = accion;
            fieldSetSeleccionModul.disabled = "";
            fieldSetInputs.disabled = "";
            fieldSetButtonRealizarAccion.disabled = "";
            fieldSetOpciones.disabled = "";
            cojerAssignaturas();
            cojerModuls();
            break;
        case "ver":
            fieldSetSeleccionModul.disabled = "";
            fieldSetOpciones.disabled = "";
            accionActual = accion;
            cojerAssignaturas();
            cojerModuls();
            break;
        case "eliminar":
            accionActual = accion;
            fieldSetSeleccionModul.disabled = "";
            cojerModuls();
            break;
        default:
            break;
    }
}

function cojerModuls(){
    var modulEscogido = cojerElemento("modulEscogido");
    modulEscogido.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {cojerModuls: "true"},
        success:function(result){
            var modules = result.split(";");
            for (let index = 0; index < modules.length; index++) {
                var modulActual = modules[index].split("/");

                var html = "<option value='" + modulActual[0] + "'>" + modulActual[1] + "</option>";

                modulEscogido.innerHTML += html;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {   
            alert("Ha hagut un error");
       }
    });   
}

function cojerAssignaturas(){
    var selectAssignatura = cojerElemento("selectAssignatura");
    selectAssignatura.innerHTML = "<option value=''></option>";

    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {cojerAssignaturas: "true"},
        success:function(result){
            var assignatura = result.split(";");
            for (let index = 0; index < assignatura.length; index++) {
                var assignaturaActual = assignatura[index].split("/");

                var html = "<option value='" + assignaturaActual[0] + "'>" + assignaturaActual[1] + "</option>";

                selectAssignatura.innerHTML += html;
            }
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
                crearModul(datos);   
                break;
            case "modificar":
                modificarModul(datos);
                break;
            default:
                break;
        }
    }
}
/* Parte de creacion de moduls */
function validacionDatos(){

    var assignatura = cojerElemento("selectAssignatura").options[cojerElemento("selectAssignatura").selectedIndex].value;

    var inputNom = cojerElemento("inputNom").value;
    if (inputNom.trim() == "") {
        alert("Tens que posar un nom")
        return "";
    }

    var inputComentari = cojerElemento("inputComentari").value;

    var inputHores = cojerElemento("inputHores").value;
    if (inputHores.trim() == "") {
        alert("No has introduit les hores");
        return "";
    }

    return assignatura + ";" + inputNom + ";" + inputComentari + ";" + inputHores;
}

function crearModul(valores) {
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {crearModul: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                alert("Modul creat");
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

function modificarModul(valores) {
    valores += ";" + modulActual;
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {modificarModul: "true", datos: valores},
        success:function(result){
            if (result == "true") {
                alert("Modul modificado");
                vaciarCampos();
                cojerModuls();
                cojerAssignaturas();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });   
}

function vaciarCampos(){

    cleanSelects("modulEscogido");

    cojerElemento("inputNom").value = "";

    cojerElemento("inputComentari").value = "";

    cojerElemento("inputHores").value = "";

    opcionElegida("");
}

function cleanSelects(idSelect){
    var select = document.getElementById(idSelect);
    var length = select.options.length;
    for (i = length - 1; i > 0; i--) {
        select.options[i] = null;
    }
}
/* -----------------------------------------------------TERMINA CREACION modulS----------------------------------------------------------------*/


function seleccionarModul(){
    modulActual = cojerElemento("modulEscogido").options[cojerElemento("modulEscogido").selectedIndex].value;
    
    if (modulActual.trim() != "") {
        if (accionActual == "eliminar") {
            eliminarModul(modulActual);
        }else{
            informacionModul(modulActual);
        }
    }else
        alert("No has escogido ningun modul");
}

function informacionModul (modulEscogido){
        $.ajax({
            url:"../php/mantenimientoModuls.php",
            type: "post", 
            dataType: 'text',
            data: {informacionModul: "true", modulBuscado: modulEscogido},
            success:function(result){
                var objJson = JSON.parse(result);

                rellenarDatos(objJson);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha hagut un error");
           }
        });  
}

function eliminarModul (modulEscogido){
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {eliminarModul: "true", modulBuscado: modulEscogido},
        success:function(result){
            if (result == "true") {
                alert("Modul borrado");
                cojerModuls();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
       }
    });  
}

function rellenarDatos(jsonObject){

    cojerElemento("selectAssignatura").selectedIndex = buscarValorSelect("selectAssignatura", jsonObject.IdAssignatura);

    cojerElemento("inputNom").value = jsonObject.Nom;

    cojerElemento("inputComentari").value = jsonObject.Comentari;

    cojerElemento("inputHores").value = jsonObject.Hores;
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

/* Mantenimiento de archivos compartidos */

function cargarArxiusCompartits(){
    opcionElegida("divArxiusCompartits");
    //Borro todos los datos que estuvieran escritos
    cojerElemento("inputNomArxiuCompartit").value = "";
    cojerElemento("inputDescripcioArxiuCompartit").value = "";
    cojerElemento("arxiuCompartitFile").value = "";
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {cargarArxiusCompartits: "true", modul: modulActual},
        success:function(result){
            var valores = result.split("|");
            var divArxiusCompartits = cojerElemento("divArxiusCompartitsDatos");
            
            var html = "";
            for (let index = 0; index < valores.length; index++) {
                var archivoActual = valores[index].split(";");

                html += `<div class="panel panel-primary col-sm-6 col-sm-offset-3">
                            <div class="panel-heading">
                                <h3 class="panel-title">` + archivoActual[1] + `</h3>
                            </div>
                            <div class="panel-body">
                                ` + archivoActual[2] + `
                            </div>
                            <button type="button" class="btn btn-default" onclick="descargarArchivo(` + archivoActual[0] + `)">Descarregar</button>
                            <button type="button" class="btn btn-default" onclick="borrarArchivo(` + archivoActual[0] + `)">Borrar arxiu</button>
                        </div>`;
            }

            divArxiusCompartits.innerHTML = html;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function descargarArchivo(idArxiu) {
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {descargarArchivo: "true", idArchivo: idArxiu, modul: modulActual},
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

function borrarArchivo(idArxiu) {
    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {borrarArchivo: "true", idArchivo: idArxiu, modul: modulActual},
        success:function(result){
            switch (result) {
                case "true":
                    alert("Arxiu borrat");
                    cargarArxiusCompartits();
                    break;
                case "errorBorrarArxiu":
                    alert("Error al borrar l'arxiu");
                    break;
                case "errorEncontrarArxiu":
                    alert("Error al trobar l'arxiu");
                    break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function subirArchivoCompartido(){
    var archivos = document.getElementById("arxiuCompartitFile").files;
    var nom = cojerElemento("inputNomArxiuCompartit").value;
    var descripcio = cojerElemento("inputDescripcioArxiuCompartit").value;
    if (archivos.length != 1) {
        alert("Puja nomes un arxiu");
    }else if(nom.trim() == "" || descripcio.trim() == ""){
        alert("Tens que introduir un nom i una descripcio");
    }else{
        var formData = new FormData();
        formData.append("modul", modulActual)
        formData.append("nomArxiu", nom);
        formData.append("descripcioArxiu", descripcio);
        formData.append("arxiuCompartit", archivos[0]);
        $.ajax({
            url: '../php/mantenimientoModuls.php',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(response) {
                switch (response) {
                    case "true":
                        alert("Se ha creat l'arxiu compartit");
                        cargarArxiusCompartits()
                        break;
                    case "errorBD":
                        alert("Error al guardar les dades del arxiu.")
                        break;
                    case "existeArchivo":
                        alert("Ja existeix un arxiu amb aquest nom al modul");
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Ha ocurrido un error");
           }
        });
    }
}

/* FINAL ARCHIVOS COMPARTIDOS */

/* COMIENZA MANTENIMIENTO DE ENTREGAS DE MODULO */
function Printarentregas() {
    opcionElegida("divEntregasModul");
    $.ajax({
        url: "../php/entregasTrabajoFunciones.php",
        type: "post",
        dataType: 'text',
        data: { PrintarentregasModul: "true", modul: modulActual},
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
                    }else {
                        activa++;
                        var texto = '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">';
                    }
                    texto += entregaActual.nomas + " - " + entregaActual.modul + "</h3></div><div class='panel-body'><h4 class='text-center'>" + entregaActual.Nom + "</h4>";
                    texto += "<div class='col-xs-9 col-xs-offset-1'><button type='button' class='btn btn-default col-sm-5 col-sm-offset-4' onclick='eliminarEntrega(" + entregaActual.idEntrega + ")'>Eliminar entrega</button></div>";
                    texto += "<div class='row'><div class='col-xs-2 col-xs-offset-1'><p>Descripció: </p></div><div class='col-xs-9'><p>";
                    texto += entregaActual.Descripcio + "</p></div><div class='col-xs-2 col-xs-offset-1'><p>Data Inicial: </p></div><div class='col-xs-9'><p>" + entregaActual.DataInicial + "</p></div><div class='col-xs-2 col-xs-offset-1'>";
                    texto += "<p>Data Final: </p></div><div class='col-xs-9'><p>" + entregaActual.DataFinal + "</p></div>";
                    texto += "<div class='col-xs-2 col-xs-offset-1'><p>Data Entrega: </p></div><div class='col-xs-9'><p>" + entregaActual.DataEntrega + "</p></div>";
                    if (entregaActual.ArxiuAdjunt != null) {
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Enunciat: </p></div><div class='col-xs-9'><p>" + entregaActual.ArxiuAdjunt + "</p> <button type='button' class='btn btn-default' onclick='descargarArxiuAdjunt(" + entregaActual.idEntrega + ")'>Descarregar enunciat</button></div>";   
                    }else
                        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Arxiu adjunt: </p></div><div class='col-xs-9'><input type='file' id='arxiuAdjunt' class='form-control col-sm-4'> <button type='button' class='btn btn-default col-sm-4' onclick='pujarArxiuAdjunt(" + entregaActual.idEntrega + ")'>Pujar arxiu adjunt</button> </div>";
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
                        cargarEntregasTrabajos();
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
                        cargarEntregasTrabajos();
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
                cargarEntregasTrabajos();
            }else
                alert("Ha hagut un error");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function activarCrearEntrega(estado) {
    if (estado) {
        var divCreacion = cojerElemento("divCrearEntrega");
        divCreacion.style.display = "none";
        
        var boton = cojerElemento("botonCrearEntrega");
        boton.innerText = "Crear entrega";
        boton.onclick = function(){ activarCrearEntrega(false)};
    }else{

        rellenarModulCrearEntrega();

        var divCreacion = cojerElemento("divCrearEntrega");
        divCreacion.style.display = "block";
        
        var boton = cojerElemento("botonCrearEntrega");
        boton.innerText = "Cancelar creacion";
        boton.onclick = function(){ activarCrearEntrega(true)};
    }
}
//Quitar select de assignatura en modulo
function rellenarModulCrearEntrega() {
    $.ajax({
        url:"../php/entregasTrabajoFunciones.php",
        type: "post", 
        dataType: 'text',
        data: {cargarModulosEntrega: "true"},
        success:function(result){
            if (result != "errorBD") {
                var valores = result.split(";");
                var selectIdModul = cojerElemento("selectIdModul");
                selectIdModul.innerHTML = "";
                for (let index = 0; index < valores.length; index++) {
                    var moduloActual = valores[index].split("/");
                    selectIdModul.innerHTML += "<option value='" + moduloActual[0] + "'>" + moduloActual[1] + "</option>"
                }
            }else
                alert("Ha hagut un error a la base de dades");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function crearEntrega() {
    var valores = validarDatosEntrega();
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

function validarDatosEntrega(){
    var selectIdModul = cojerElemento("selectIdModul").options[cojerElemento("selectIdModul").selectedIndex].value;
    if (selectIdModul.trim() == "") {
        alert("El modul esta buit");
        return "";
    }

    var inputNomEntrega = cojerElemento("inputNomEntrega").value;
    if (inputNomEntrega.trim() == "") {
        alert("El nom esta buit");
        return "";
    }

    var inputDescripcioEntrega = cojerElemento("inputDescripcioEntrega").value;

    var inputDataInicialEntrega = cojerElemento("inputDataInicialEntrega").value;
    var inputHoraInicialEntrega = cojerElemento("inputHoraInicialEntrega").value;
    if (inputDataInicialEntrega.trim() == "") {
        alert("La data inicial esta buida");
        return "";
    }

    if(inputHoraInicialEntrega.trim() == ""){
        alert("L'hora inicial esta buida");
        return "";
    }

    var inputDataFinalEntrega = cojerElemento("inputDataFinalEntrega").value;
    var inputHoraFinalEntrega = cojerElemento("inputHoraFinalEntrega").value;
    if (inputDataFinalEntrega.trim() == "") {
        alert("La data final esta buida");
        return "";
    }

    if(inputHoraFinalEntrega.trim() == ""){
        alert("L'hora final esta buida");
        return "";
    }

    var inputDataEntregaEntrega = cojerElemento("inputDataEntregaEntrega").value;
    var inputHoraEntregaEntrega = cojerElemento("inputHoraEntregaEntrega").value;
    if (inputDataEntregaEntrega.trim() == "") {
        alert("La data d'entrega esta buida");
        return "";
    }

    if(inputHoraEntregaEntrega.trim() == ""){
        alert("L'hora d'entrega esta buida");
        return "";
    }

    var inputValorActivitat = cojerElemento("inputValorActivitat").value;
    if (inputValorActivitat.trim() == "") {
        alert("El valor de l'activitat esta buit");
        return "";
    }
    return selectIdModul + ";" + inputNomEntrega + ";" + inputDescripcioEntrega + ";" + inputDataInicialEntrega + " " + inputHoraInicialEntrega + ";" + inputDataFinalEntrega + " " + inputHoraFinalEntrega + ";" + inputDataEntregaEntrega + " " + inputHoraEntregaEntrega + ";" + inputValorActivitat;
}
/* FINAL MANTENIMIENTO DE ENTREGAS MODULO */
/* COMIENZA MANTENIMIENTO DE ALUMNOS MODULO */
function cargarAlumnos() {
    opcionElegida("divAlumnosModul");

    $.ajax({
        url:"../php/mantenimientoModuls.php",
        type: "post", 
        dataType: 'text',
        data: {cargarAlumnos: "true", modul: modulActual},
        success:function(result){
            var valoresResultado = result.split("|");

            var alumnosModulo = valoresResultado[0].split(";");
            var todosAlumnos = valoresResultado[1].split(";");

            var selectAlumnoModul = cojerElemento("selectAlumnoModul");
            selectAlumnoModul.innerHTML = "";
            if (alumnosModulo[0].trim() != "") {
                for (let index = 0; index < alumnosModulo.length; index++) {
                    var valoresModul = alumnosModulo[index].split("-");
                    selectAlumnoModul.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }

            var selectTotsAlumnos = cojerElemento("selectTotsAlumnos");
            selectTotsAlumnos.innerHTML = "";
            if (todosAlumnos[0].trim() != "") {
                for (let index = 0; index < todosAlumnos.length; index++) {
                    var valoresModul = todosAlumnos[index].split("-");
                    selectTotsAlumnos.innerHTML += "<option value='" + valoresModul[0] + "'>" + valoresModul[1] + "</option>";
                }   
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}

function anadirAlumno() {
    var selectTotsAlumnos = cojerElemento("selectTotsAlumnos");

    var opcionesSeleccionadas = "";
    var opciones = selectTotsAlumnos.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);
    if (opcionesSeleccionadas.trim() != "") {
        $.ajax({
            url:"../php/mantenimientoModuls.php",
            type: "post", 
            dataType: 'text',
            data: {anadirAlumnos: "true", modul: modulActual, alumnosAnadir: opcionesSeleccionadas},
            success:function(result){
                if (result == "true") {
                    alert("S'han afegit els alumnes");
                    cargarAlumnos();
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
    var selectAlumnoModul = cojerElemento("selectAlumnoModul");

    var opcionesSeleccionadas = "";
    var opciones = selectAlumnoModul.options;
    for (let index = 0; index < opciones.length; index++) {
        if (opciones[index].selected) {
            opcionesSeleccionadas += ";" + opciones[index].value;
        }
    }

    opcionesSeleccionadas = opcionesSeleccionadas.substr(1);
    if (opcionesSeleccionadas.trim() != "") {
        $.ajax({
            url:"../php/mantenimientoModuls.php",
            type: "post", 
            dataType: 'text',
            data: {borrarAlumnos: "true", modul: modulActual, alumnosBorrar: opcionesSeleccionadas},
            success:function(result){
                if (result == "true") {
                    alert("S'han borrat els moduls");
                    cargarAlumnos();
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

/* FINAL MANTENIMIENTO ALUMNOS */
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