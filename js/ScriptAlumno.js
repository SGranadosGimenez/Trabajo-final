function CanviarContra() {
    var actual = document.getElementById("actual");
    var nueva = document.getElementById("nueva");
    var repetirnueva = document.getElementById("repetirnueva");
    var idalumne = document.getElementById("user");
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { CanviarContra: "true", contraactual: actual.value, contranueva: nueva.value, contranueva2: repetirnueva.value },
        success: function (result) {

            if (result == "true") {
                alert("Contrasenya modificada amb exit!");
            }
            else {
                alert(result);
                alert("Contrasenya no modificada")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function Info() {
    $.ajax({
        url: "../php/mantenimientoAlumnos.php",
        type: "post",
        dataType: 'text',
        data: { informacionAlumno: "true" },
        success: function (result) {
            var objJson = JSON.parse(result);
            var texto;
            if (objJson.tutor[1] == null) {
                texto = "";
            }
            else {
                texto = objJson.tutor[1];
            }
            document.getElementById("Tutor").innerHTML = texto;
            document.getElementById("usuario").innerHTML = objJson.usuario;
            document.getElementById("nom").innerHTML = objJson.nom;

            document.getElementById("cognom1").innerHTML = objJson.primerCognom;

            document.getElementById("cognom2").innerHTML = objJson.segonCognom;
            if (objJson.enviarInformacioPares == 1) {
                texto = "Si";
            }
            else {
                texto = "No";
            }
            document.getElementById("info").innerHTML = texto;
            if (objJson.familiaNombrosa == 1) {
                texto = "Si";
            }
            else {
                texto = "No";
            }
            document.getElementById("fami").innerHTML = texto;

            document.getElementById("sexe").innerHTML = objJson.sexe;

            document.getElementById("DNI").innerHTML = objJson.dni;

            document.getElementById("naixament").innerHTML = objJson.dataNaixement;

            document.getElementById("nacio").innerHTML = objJson.nacionalitat;

            document.getElementById("llocnacio").innerHTML = objJson.llocNaixement;

            document.getElementById("nSS").innerHTML = objJson.numSeguretatSocial;

            document.getElementById("correu").innerHTML = objJson.correuElectronic;

            document.getElementById("telefon").innerHTML = objJson.telefon;

            document.getElementById("mobil").innerHTML = objJson.telefonMobil;

            document.getElementById("adreca").innerHTML = objJson.adreca;

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
            alert("Ha hagut un error");
        }
    });
}
function Alumno() {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { buscaralumno: "true" },
        success: function (result) {
            document.getElementById("user").innerHTML = result;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function selectentrega() {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { selectentrega: "true" },
        success: function (result) {
            document.getElementById("seleccionarentregas").innerHTML = result;
            if(document.getElementById("seleccionarentregas").value!= "Seleccionar"){
                Printarentregas();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function Printarentregas() {
    var seleccion = document.getElementById("seleccionarentregas").value;
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { Printarentregas: "true", seleccion: seleccion },
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
                    var fecha = new Date(obj[x].DataEntrega);
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
                    texto += obj[x].nomas + " - " + obj[x].modul + "</h3></div><div class='panel-body'><h4 class='text-center'>" + obj[x].Nom + "</h4>";
                    texto += "<div class='row'><div class='col-xs-2 col-xs-offset-1'><p>Descripció: </p></div><div class='col-xs-9'><p>";
                    texto += obj[x].Descripcio + "</p></div><div class='col-xs-2 col-xs-offset-1'><p>Data Inicial: </p></div><div class='col-xs-9'><p>" + obj[x].DataInicial + "</p></div><div class='col-xs-2 col-xs-offset-1'>";
                    texto += "<p>Data Final: </p></div><div class='col-xs-9'><p>" + obj[x].DataFinal + "</p></div>";
                    texto += "<div class='col-xs-2 col-xs-offset-1'><p>Data Entrega: </p></div><div class='col-xs-9'><p>" + obj[x].DataEntrega + "</p></div>";
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
/* printa en el onload de entregas todas*/
function printar() {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { entregatodas: "true" },
        success: function (result) {
            var objJson = JSON.parse(result);
            var obj = objJson.array;
            document.getElementById("printar").innerHTML = "";
            var f = new Date();
            // var mes = f.getMonth()+1;
            // var dia = f.getDate();
            // var hora = f.getHours();
            // var minutos = f.getMinutes();
            // var seconds = f.getSeconds();
            // if((f.getMonth()+1)<10){
            //     mes = "0"+(f.getMonth()+1);
            // }
            // if(f.getDate()<10){
            //     dia = "0"+f.getDate();
            // }
            // if(f.getHours()<10){
            //     hora = "0"+f.getHours();
            // }
            // if(f.getMinutes()<10){
            //     minutos = "0"+f.getMinutes();
            // }
            // if(f.getSeconds()<10){
            //     seconds = "0"+f.getSeconds();
            // }
            // var fecha = f.getFullYear() + "-" + mes + "-" + dia+ " "+hora+":"+minutos+":"+seconds;
            hola(obj, f);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function hola(obj, fechaactual) {
    var x = 0;
    var y = 0;
    var activa = 0;
    while (obj.length > x) {
        var fecha = new Date(obj[x].DataEntrega);
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
        texto += obj[x].nomas + " - " + obj[x].modul + "</h3></div><div class='panel-body'><h4 class='text-center'>" + obj[x].Nom + "</h4>";
        texto += "<div class='row'><div class='col-xs-2 col-xs-offset-1'><p>Descripció: </p></div><div class='col-xs-9'><p>";
        texto += obj[x].Descripcio + "</p></div><div class='col-xs-2 col-xs-offset-1'><p>Data Inicial: </p></div><div class='col-xs-9'><p>" + obj[x].DataInicial + "</p></div><div class='col-xs-2 col-xs-offset-1'>";
        texto += "<p>Data Final: </p></div><div class='col-xs-9'><p>" + obj[x].DataFinal + "</p></div>";
        texto += "<div class='col-xs-2 col-xs-offset-1'><p>Data Entrega: </p></div><div class='col-xs-9'><p>" + obj[x].DataEntrega + "</p></div>";
        texto += "</div></div></div>";
        document.getElementById("printar").innerHTML += texto;
        x++;
    }
}
/* COMO HACER QUE EL CERRAR SESSION FUNCIONE Y YA NO PUEDA ENTRAR A NINGUN HTML */
function cerrarsession() {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { cerrarsession: "true" },
        success: function (result) {
            if (result == "true") {
                alert("OK");
                location.href = "../html/login.html";
            }
            else {

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function materia() {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { materia: "true" },
        success: function (result) {
            var objJson = JSON.parse(result);
            var obj = objJson.array;
            var x = 0;
            var y = 0;
            var texto = '<div class="row" id="bloqueprincipal"><div class="col-md-1"></div>';
            while (obj.length > x) {
                if (y == 3) {
                    texto += '</div><br><br><div class="row" id="bloqueprincipal"><div class="col-md-1"></div>';
                    y = 0;
                }
                texto += '<div class="col-md-2 text-center center-block cuadro cuadromateria"><a href="materia2.html" onclick="pasarinfo(\''+obj[x].NomAsign+'\')"><h3 class="text-primary">' + obj[x].NomAsign +'</h3><p><span class="negrita">Professor: </span>' + obj[x].NomProf +" "+obj[x].primerCognom+ '<br><span class="negrita">Aula: </span>' + obj[x].aula + '<br><span class="negrita">Curs: </span>' + obj[x].curs + '</p></a></div><div class="col-md-2"> </div>';
                y++; x++;
            }
            var cadena = '<div class="row hidden-md hidden-lg"><div class="col-md-10 col-md-offset-1"><div class="row" id="bloqueprincipal">'
            x = 0;
            y = 0;
            while (obj.length > x) {
                if (y == 0 || y == 2) {
                    cadena += '<div class="col-xs-1"></div>';
                    y = 0;
                }
                cadena += '<div class="col-xs-4 text-center center-block cuadro"><a href="materia2.html" onclick="pasarinfo(\''+obj[x].NomAsign+'\')"><h3 class="text-primary">' + obj[x].NomAsign +'</h3><p><span class="negrita">Professor: </span>' + obj[x].NomProf +" "+obj[x].primerCognom+ '<br><span class="negrita">Aula: </span>' + obj[x].aula + '<br><span class="negrita">Curs: </span>' + obj[x].curs + '</p></a></div>';
                if (y == 0) {
                    cadena += '<div class="col-xs-2"> </div>';

                }
                else {
                    cadena += '<div class="col-xs-1"></div>'
                    if (y == 1) {
                        cadena += '</div></div></div><br><br><div class="row hidden-md hidden-lg"><div class="col-md-10 col-md-offset-1"><div class="row" id="bloqueprincipal">'
                    }
                }
                x++;
                y++;
            }
            document.getElementById("printarmateriassm").innerHTML = "";
            document.getElementById("printarmaterias").innerHTML = "";
            document.getElementById("printarmaterias").innerHTML = texto;
            document.getElementById("printarmateriassm").innerHTML = cadena;
            //     <div class="col-md-2 text-center center-block cuadro">
            //         <a href="#"><h3 class="text-primary">CALENDARI</h3>
            //         <img src="../Imagenes/calendari.svg" alt="foto de calendari"></a>
            //     </div>
            //     <div class="col-md-2">

            //     </div>
            //     <div class="col-md-2 text-center center-block cuadro">
            //         <a href="#"><h3 class="text-primary">EXPEDIENT</h3>
            //         <img src="../Imagenes/award.svg" alt="expedient foto"></a>
            //     </div>
            // </div>
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
/*Funcion que se ejecuta cuando elegies una materia  */ 
/*Crea una session llamada Assignatura*/
function pasarinfo(nom) {
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { materia2: "true", assignatura: nom },
        success: function (result) {
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
/*Printa la informacio a materia2.html */
function InfoAssign(){
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { infoAssign  : "true" },
        success: function (result) {
            var objJson = JSON.parse(result);
            document.getElementById("sitio").innerHTML=objJson.NomAsign;
            document.getElementById("Nom").innerHTML="<span class='negrita'>"+objJson.NomAsign+"</span><span class='pull-right'><span class='negrita'>Professor:</span> "+objJson.NomProf+" "+objJson.primerCognom+"</span>";
            infoModul(objJson.idAssign, objJson.aula,objJson.curs);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
function infoModul(Assignatura,aula,curs){
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { infoModul  : "true", idAssign:Assignatura },
        success: function (result) {
            var objJson = JSON.parse(result);
            var obj = objJson.array;
            var x = 0;
            while(obj.length>x){
                document.getElementById("materiamoduls").innerHTML+='<div class="col-md-3"><h3 class="text-center">'+obj[x].Nom+'</h3><div><p><span class="negrita">Curs: </span>'+curs+'<br><span class="negrita">Aula: </span>'+aula+'<br><span class="negrita">Horas: </span>'+obj[x].horas+'</p></div></div>';
                x++;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}
/*Funcion que se ejecuta cuando aprepatamos entrega de treballs dentro de materia*/
function entregaMateria(){
    $.ajax({
        url: "../php/index.php",
        type: "post",
        dataType: 'text',
        data: { entregaMateria  : "true" },
        success: function (result) {
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Ha hagut un error");
        }
    });
}