// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('adminTransportesController', [
            '$scope',
            'creatorMap',
            'dataServer',
            AdminTransportesController
        ]);

    function AdminTransportesController(vm, creatorMap, dataServer) {

        // ********************************** VARIABLES PUBLICAS ************************
        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();

        // #################### VAR GOLBALES ####################

        vm.unidades = [];
        vm.empresas = [];

        // ****************************** FUNCIONES PUBLICAS ****************************

        // $("#btnSubmit").click(function(event) {

        //     // Fetch form to apply custom Bootstrap validation
        //     var form = $("#myForm")
        
        //     if (form[0].checkValidity() === false) {
        //       event.preventDefault()
        //       event.stopPropagation()
        //     }
            
        //     form.addClass('was-validated');
        //     // Perform ajax submit here...
            
        // });

        // ****************************** FUNCIONES PRIVADAS ****************************

        // ###########################################################################
        // ################################# Serv REST ###############################

        function cargaUnidades() {
            dataServer.getUnidades()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.unidades = data;
                    console.log("Datos recuperados con EXITO! = UNIDADES");
                    console.log(vm.unidades);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las UNIDADES");
                })
        }

        function cargaEmpresas() {
            dataServer.getEmpresas()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.empresas = data;
                    console.log("Datos recuperados con EXITO! = EMPRESAS");
                    console.log(vm.empresas);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las EMPRESAS");
                })
        }

        function saveUnidad() {
            dataServer.saveUnidad(vm.dataUnidadCreate)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos guardados con EXITO! = UNIDAD CREADA");
                    console.log(data);
                    vm.guardadoExitoso = true;
                    cargaUnidades();
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al guardar la NUEVA UNIDAD");
                })
        }

        function updateUnidad() {
            dataServer.updateUnidad(vm.dataUnidadUpdate)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos actualizados con EXITO! = UNIDAD ACTUALIZADA");
                    console.log(data);
                    // recuperamos los datos actualizados del servidor
                    cargaUnidades();
                    vm.actualizacionCorrecta = true;
                    // actualizamos los datos mostrados con los nuevos
                    actualizarDatos();
                })
                .catch(function (err) {
                    vm.actualizacionCorrecta = false;
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar la UNIDAD");
                    console.log(err);
                })
        }

        function deleteUnidad() {
            dataServer.deleteUnidad(vm.unidadSeleccionada.id)
                .then(function () {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos eliminados con EXITO! = UNIDAD ELIMINADA");
                    cargaUnidades();
                    vm.unidadEliminadaExito = true;
                    console.log("Unidad sel exito: "+vm.unidadEliminadaExito);
                    alert("La unidad se elimino exitosamente");
                })
                .catch(function (err) {
                    vm.unidadEliminadaExito = false;
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al eliminar la UNIDAD");
                })
        }


        // ###########################################################################
        // ###########################################################################

        // ###########################################################################
        // ########################## CREACION ########################################

        vm.nombreEmpresaSeleccionada = "";
        vm.empresaSeleccionadaCreate;
        vm.dataUnidadCreate = {
            "nombre": "",
            "horaInicio": "",
            "minInicio": "",
            "horaFin": "",
            "minFin": "",
            "frecuencia": "",
            "precioBoleto": "",
            "idEmpresa": ""
        };

        vm.intPrecioCreate = "";
        vm.decPrecioCreate = "";
        // bandera para mostrar mje de elegir empresa en la vista
        vm.empresaSel = false;
        // bander para informar que hay problemas en los datos
        vm.datosOkCreate = true;
        vm.guardadoExitoso = false;

        //********************** Funciones *********************

        vm.resetDatosCreate = function(){
            vm.dataUnidadCreate.nombre = "";
            vm.dataUnidadCreate.horaInicio = "";
            vm.dataUnidadCreate.minInicio = "";
            vm.dataUnidadCreate.horaFin = "";
            vm.dataUnidadCreate.minFin = "";
            vm.dataUnidadCreate.frecuencia = "";
            vm.dataUnidadCreate.precioBoleto = "";
            vm.dataUnidadCreate.idEmpresa = "";
            vm.intPrecioCreate = "";
            vm.decPrecioCreate = "";
            vm.nombreEmpresaSeleccionada = "";
            vm.empresaSeleccionadaCreate = "";
            // reseteamos las banderas
            vm.empresaSel = false;
            vm.datosOkCreate = true;
            vm.guardadoExitoso = false;
        }
        
        vm.crearUnidadNew = function(){
            recuperarDatosUnidadCreate();
            if(vm.datosOkCreate){
                saveUnidad();
            }
        }

        // recupera todos los datos ingresados en la vista y los asigna a
        // un objeto con el formato correcto para ser procesado en el servidor
        function recuperarDatosUnidadCreate() {
                if(!vm.empresaSel){
                    console.log("Falta seleccionar empresa");
                    // vm.datosOkCreate = false;
                    return;
                }
                if(vm.datosVaciosCreate()){
                    // vm.datosOkCreate = false;
                    console.log("Faltan completar los datos");
                    return;
                }
                if(!horarioCorrecto(vm.dataUnidadCreate.horaInicio, vm.dataUnidadCreate.minInicio,
                    vm.dataUnidadCreate.horaFin, vm.dataUnidadCreate.minFin)){
                    console.log("controlar los horarios");
                    vm.datosOkCreate = false;
                    return;
                }
                vm.datosOkCreate = true;
                vm.dataUnidadCreate.idEmpresa = vm.empresaSeleccionadaCreate.id;
                vm.dataUnidadCreate.precioBoleto = getPrecioBoleto(vm.intPrecioCreate, vm.decPrecioCreate);
                console.log("Se recuperaron los datos de la nueva unidad.");
                console.log(vm.dataUnidadCreate);
        }

        // paso los datos ingresados en la vista y los unifica en el formato
        // correcto para ser enviado al servidor
        function getPrecioBoleto(parteInt, parteDec) {
            var precioBoletoString = parteInt + "." + parteDec;
            var precioBoletoFloat = parseFloat(precioBoletoString);
            console.log("Precio de boleto FLOAT: " + precioBoletoFloat);
            return precioBoletoFloat;
        }

        vm.selecEmpresaCreate = function(){
            if(!vm.empresaSel){
                vm.empresaSel = true;
            }
            console.log("Empresa seleccionada: ");
            console.log(vm.empresaSeleccionadaCreate);
        }

        vm.datosVaciosCreate = function(){
            // se deshabilita el boton luego de crear una unidad
            // para forzar a usar el boton de "Crear nueva unidad"
            if(vm.guardadoExitoso){
                return true;
            }
            if(!vm.empresaSel){
                return true;
            }
            if((vm.dataUnidadCreate.nombre == "")||vm.dataUnidadCreate.frecuencia == ""){
                return true;
            }
            if(vm.intPrecioCreate == ""){
                return true;
            }
            if((vm.dataUnidadCreate.horaInicio == "")||(vm.dataUnidadCreate.minInicio == "")){
                return true;
            }
            if((vm.dataUnidadCreate.horaFin == "")||(vm.dataUnidadCreate.minFin == "")){
                return true;
            }
            return false;
        }


        // ################################# FIN CREACION #############################
        // ###########################################################################

        // ###########################################################################
        // ########################## EDICION ########################################

        vm.unidadSeleccionada = null;
        vm.nombreUnidadSel = "";
        vm.dataUnidadUpdate = {
            "id": "",
            "nombre": "",
            "horaInicio": "",
            "minInicio": "",
            "horaFin": "",
            "minFin": "",
            "frecuencia": "",
            "precioBoleto": "",
            "idEmpresa": ""
        };
        vm.intPrecioUpdate = "";
        vm.decPrecioUpdate = "";
        vm.empresaNuevaSeleccionada = null;
        vm.nombreEmpresaActual = "";

        // ****************** flags ****************
        vm.unidadSel = false;
        vm.actualizacionCorrecta = false;
        vm.datosCorrectos = true;
        vm.unidadEliminadaExito = false;

        //********************** Funciones *********************

        vm.actualizarUnidad = function(){
            if (!datosCompletosUpdate()){
                console.log("Hay campos vacios!!!!!!!...");
                vm.datosCorrectos = false;
                return;
            }
            if (!horarioCorrecto(vm.dataUnidadUpdate.horaInicio, vm.dataUnidadUpdate.minInicio,
                vm.dataUnidadUpdate.horaFin, vm.dataUnidadUpdate.minFin)){

                    vm.datosCorrectos = false;
                    console.log("Controlar los horarios!!!!!!!...");
                    return;
            }
            recuperarDatosUpdate();
            updateUnidad();
        }

        // al elegir otra unidad se deben reflejar los datos correspondientes
        // en la vista como asi tmb al eliminarla
        vm.changeUnidadSel = function () {
            actualizarSeleccion()
            actualizarDatos();
            vm.actualizacionCorrecta = false;
            // controlar q se haya borrado una unidad
            vm.unidadEliminadaExito = false;
            // if(vm.unidadEliminadaExito){
            //     vm.unidadEliminadaExito = false;
            // }
        }

        function actualizarSeleccion(){
            if(!vm.unidadSel){
                vm.unidadSel = true;
            }
            if(vm.unidadSeleccionada == null){
                 vm.unidadSel = false;
            }
        }

        // se encarga de mostrar los datos en la vista c/vez q se selecciona
        // una nueva unidad
        function actualizarDatos(){
            if(vm.unidadSeleccionada == null){
                resetDatosSel();
                return;
            }
            vm.dataUnidadUpdate.nombre = "" + vm.unidadSeleccionada.nombre;
            vm.dataUnidadUpdate.frecuencia = Number("" + vm.unidadSeleccionada.frecuencia);
            separarPrecioBoletoSel();
            mostrarHora();
        }

        function resetDatosSel(){
            vm.dataUnidadUpdate.nombre = "";
            vm.dataUnidadUpdate.frecuencia = "";
            // ** esto se debe hacer solo al recuperar los datos para actualizarlos en el serv
            vm.dataUnidadUpdate.precioBoleto = null;
            vm.dataUnidadUpdate.horaInicio = null;
            vm.dataUnidadUpdate.minInicio = null;
            vm.dataUnidadUpdate.horaFin = null;
            vm.dataUnidadUpdate.minFin = null;

            vm.intPrecioUpdate = "";
            vm.decPrecioUpdate = "";
        }

        // separa el precio de la unidad seleccionada en 2 enteros
        // para poder mostrarlos en la vista
        function separarPrecioBoletoSel() {
            // console.log("Entro a separarBoleto()");
            vm.intPrecioUpdate = Math.trunc(vm.unidadSeleccionada.precioBoleto);
            vm.decPrecioUpdate = Number(((vm.unidadSeleccionada.precioBoleto - vm.intPrecioUpdate).toFixed(2)) * 100);
        }

        function mostrarHora(){
            var componentesHora = separarStringHora(vm.unidadSeleccionada.horaInicio);
            vm.dataUnidadUpdate.horaInicio = Number(componentesHora[0]);
            vm.dataUnidadUpdate.minInicio = Number(componentesHora[1]);
            componentesHora = separarStringHora(vm.unidadSeleccionada.horaFin);
            vm.dataUnidadUpdate.horaFin = Number(componentesHora[0]);
            vm.dataUnidadUpdate.minFin = Number(componentesHora[1]);
        }

        // separa un string de hora en sus componentes menores
        function separarStringHora(hora){
            var componentesHora = hora.split(":");
            return componentesHora;
        }

        vm.cancelarActualizacion = function(){
            actualizarDatos();
        }

        vm.eliminarUnidad = function(){
            resetDatosSel();
            deleteUnidad();
            // vm.unidadEliminadaExito = true;
        }
        

        // ################################# FIN EDICION #############################
        // ###########################################################################

        // ###########################################################################
        // ####################### Captura de datos ##################################

        function datosCompletosUpdate(){
                if((vm.dataUnidadUpdate.nombre == "")||vm.dataUnidadUpdate.frecuencia == ""){
                    // console.log("La frec o nombre vacios:");
                    console.log(vm.dataUnidadUpdate.nombre + ' , ' +vm.dataUnidadUpdate.frecuencia);
                    return false;
                }
                // if((vm.intPrecioUpdate == "")||(vm.decPrecioUpdate == "")){
                if(vm.intPrecioUpdate == ""){
                    // console.log("La frec o nombre vacios:");
                    console.log(vm.intPrecioUpdate + ' , ' +vm.decPrecioUpdate);
                    return false;
                }
                // if((vm.dataUnidadUpdate.horaInicio == "")||(vm.dataUnidadUpdate.minInicio == "")){
                if(vm.dataUnidadUpdate.horaInicio == ""){
                    // console.log("La frec o nombre vacios:");
                    console.log(vm.dataUnidadUpdate.horaInicio + ' , ' +vm.dataUnidadUpdate.minInicio);
                    return false;
                }
                // if((vm.dataUnidadUpdate.horaFin == "")||(vm.dataUnidadUpdate.minFin == "")){
                if(vm.dataUnidadUpdate.horaFin == ""){
                    // console.log("La frec o nombre vacios:");
                    console.log(vm.dataUnidadUpdate.horaFin + ' , ' +vm.dataUnidadUpdate.minFin);
                    return false;
                }
                return true;
        }

        function recuperarDatosUpdate(){
            vm.dataUnidadUpdate.id = vm.unidadSeleccionada.id;
            vm.dataUnidadUpdate.precioBoleto = getPrecioBoleto(vm.intPrecioUpdate, vm.decPrecioUpdate);
            // si no se selecciono una nueva empresa se toma la empresa anterior
            if(vm.empresaNuevaSeleccionada == null){
                vm.dataUnidadUpdate.idEmpresa = vm.unidadSeleccionada.empresa.id;
            }

            console.log("Se recuperaron los datos correctamente.");
            console.log(vm.dataUnidadUpdate);
        }

        // ###########################################################################
        // ###########################################################################


        // ###########################################################################
        // ########################### Validacion ####################################

        // verifica que el horario de finalizacion del recorrido sea mayor
        // al de inicio
        function horarioCorrecto(hIni, mIni, hFin, mFin) {
            if (hFin < hIni) {
                return false;
            }
            if (hFin == hIni) {
                if (mFin <= mIni) {
                    return false;
                }
            }
            return true;
        }

        // ###########################################################################
        // ###########################################################################

        // ###########################################################################
        // ############################## SOPORTE ####################################

        

        // ###########################################################################
        // ###########################################################################


        // ###################################################################
        // ##################### INICIALIZACION DE DATOS #####################
        
        cargaUnidades();
        cargaEmpresas();

    } // fin Constructor

})()