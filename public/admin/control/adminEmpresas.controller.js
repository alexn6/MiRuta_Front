// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('adminEmpresasController', [
            '$scope',
            'dataServer',
            AdminEmpresasController
        ]);

    function AdminEmpresasController(vm, dataServer){

        // ###############################################################
        // ########################### CREACION ##########################

        vm.empresaCreate = {
            "nombre": null,
            "cuit": null,
            "mail": null,
            "telefono": null
        }

        // ************* flags ******************
        vm.guardadoExitoso = false;
        vm.creandoEmpresa = true;

        vm.cuitCreate_p1 = null;
        vm.cuitCreate_p2 = null;
        vm.cuitCreate_p3 = null;

        vm.codTelefonoCreate = null;
        vm.numTelefonoCreate = null;

        function hayDatosVaciosCreate(){
            if((vm.empresaCreate.nombre == null)||(vm.empresaCreate.nombre == "")){
                console.log("Nombre incorrecto");
                return true;
            }
            // cuit
            if((vm.cuitCreate_p1 == null)||(vm.cuitCreate_p1 == "")){
                console.log("Cuitp1 incorrecto");
                return true;
            }
            if((vm.cuitCreate_p2 == null)||(vm.cuitCreate_p2 == "")){
                console.log("Cuitp2 incorrecto");
                return true;
            }
            if((vm.cuitCreate_p3 == null)||(vm.cuitCreate_p3 == "")){
                console.log("Cuitp3 incorrecto");
                return true;
            }
            // mail
            if((vm.empresaCreate.mail == null)||(vm.empresaCreate.mail == "")){
                console.log("Mail incorrecto");
                return true;
            }
            // telefono
            if((vm.codTelefonoCreate == null)||(vm.codTelefonoCreate == "")){
                console.log("CodArea incorrecto");
                return true;
            }
            if((vm.numTelefonoCreate == null)||(vm.numTelefonoCreate == "")){
                console.log("NUmber incorrecto");
                return true;
            }
            return false;
        }

        function recuperarDatosEmpresaCreate(){
            vm.empresaCreate.cuit = "" +vm.cuitCreate_p1+ "-" +vm.cuitCreate_p2+ "-" +vm.cuitCreate_p3;
            vm.empresaCreate.telefono = "(" +vm.codTelefonoCreate+ ") " +vm.numTelefonoCreate;
        }

        // ###########################################################

        // ###########################################################
        // ################### BOTONES CREACION ######################

        vm.crearEmpresa = function(){
            if(hayDatosVaciosCreate()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            if(!cuitCorrecto(vm.cuitCreate_p1, vm.cuitCreate_p2, vm.cuitCreate_p3)){
                $('#mod-cuit-incorrecto').modal('show');
                return;
            }
            if(!mailCorrecto(vm.empresaCreate.mail)){
                $('#mod-mail-incorrecto').modal('show');
                return;
            }
            if(!telefonoCorrecto(vm.codTelefonoCreate, vm.numTelefonoCreate)){
                $('#mod-tel-incorrecto').modal('show');
                return;
            }
            recuperarDatosEmpresaCreate();
            saveEmpresa();
            // console.log("guarda la empresa");
        }

        vm.resetDatosCreate = function(){
            vm.empresaCreate.nombre = null;
            vm.cuitCreate_p1 = null;
            vm.cuitCreate_p2 = null;
            vm.cuitCreate_p3 = null;
            vm.empresaCreate.mail = null;
            vm.codTelefonoCreate = null;
            vm.numTelefonoCreate = null;
            vm.guardadoExitoso = false;
            vm.creandoEmpresa = true;
        }

        // ###########################################################

        // ###########################################################
        // ###################### EDICION ############################
        
        vm.empresaSeleccionada = null;
        vm.seSeleccionoEmpresa = false;

        vm.cuitUpdate_p1 = null;
        vm.cuitUpdate_p2 = null;
        vm.cuitUpdate_p3 = null;

        vm.codTelefonoUpdate = null;
        vm.numTelefonoUpdate = null;

        vm.empresas = [];

        vm.empresaUpdate = {
            "id": null,
            "nombre": null,
            "cuit": null,
            "mail": null,
            "telefono": null
        }

        vm.changeEmpresaSel = function(){
            actualizarSeleccion();
            // controlamos cuando borramos un elemento
            if(vm.empresaSeleccionada != null){
                mostrarDatosEmpresaSeleccionada();
            }
        }

        function actualizarSeleccion(){
            // seteamos la bandera
            if(!vm.seSeleccionoEmpresa){
                vm.seSeleccionoEmpresa = true;
            }
            // controlamos el caso cuando se elimina una unidad
            if(vm.empresaSeleccionada == null){
                 vm.seSeleccionoEmpresa = false;
            }
        }

        function mostrarDatosEmpresaSeleccionada(){
            vm.empresaUpdate.nombre = "" +vm.empresaSeleccionada.nombre;
            vm.empresaUpdate.mail = "" +vm.empresaSeleccionada.mail;
            mostrarCuit(vm.empresaSeleccionada.cuit);
            mostrarTelefono(vm.empresaSeleccionada.telefono);
        }

        function mostrarCuit(stringCuit){
            var partes_cuit = stringCuit.split("-");
            vm.cuitUpdate_p1 = Number(partes_cuit[0]);
            vm.cuitUpdate_p2 = Number(partes_cuit[1]);
            vm.cuitUpdate_p3 = Number(partes_cuit[2]); 
        }

        function mostrarTelefono(stringTelefono){
            var partes_tel = stringTelefono.split(")");
            vm.codTelefonoUpdate = Number(partes_tel[0].slice(1, partes_tel[0].length));
            vm.numTelefonoUpdate = Number(partes_tel[1]);
        }

        function hayCambiosEdit(){
            if(vm.empresaUpdate.nombre != vm.empresaSeleccionada.nombre){
                return true;
            }
            var cuitAux = vm.cuitUpdate_p1+ "-" +vm.cuitUpdate_p2+ "-" +vm.cuitUpdate_p3;
            if(cuitAux != vm.empresaSeleccionada.cuit){
                return true;
            }
            if(vm.empresaUpdate.mail != vm.empresaSeleccionada.mail){
                return true;
            }
            var telAux = "(" +vm.codTelefonoUpdate+ ") " +vm.numTelefonoUpdate;
            if(telAux != vm.empresaSeleccionada.telefono){
                return true;
            }
            return false;
        }

        function hayDatosVaciosUpdate(){
            if((vm.empresaUpdate.nombre == null) ||(vm.empresaUpdate.nombre == "")){
                return true;
            }
            if((vm.cuitUpdate_p1 == null) ||(vm.cuitUpdate_p1 == "")){
                return true;
            }
            if((vm.cuitUpdate_p2 == null) ||(vm.cuitUpdate_p2 == "")){
                return true;
            }
            if((vm.cuitUpdate_p3 == null) ||(vm.cuitUpdate_p3 == "")){
                return true;
            }
            if((vm.codTelefonoUpdate == null) || (vm.codTelefonoUpdate == "")){
                return true;
            }
            if((vm.numTelefonoUpdate == null) || (vm.numTelefonoUpdate == "")){
                return true;
            }
            if((vm.empresaUpdate.mail == null) ||(vm.empresaUpdate.mail == "")){
                return true;
            }
        }

        vm.eliminarEmpresa = function(){
            console.log("Se va a eliminar empresa");
            deleteEmpresa();
        }

        vm.confirmaSalir = function(){
            console.log("Se descartan los cambios");
            mostrarDatosEmpresaSeleccionada();
        }

        function recuperarDatosUpdate(){
            vm.empresaUpdate.id = vm.empresaSeleccionada.id;
            vm.empresaUpdate.cuit = vm.cuitUpdate_p1+ "-" +vm.cuitUpdate_p2+ "-" +vm.cuitUpdate_p3;
            vm.empresaUpdate.telefono = "(" +vm.codTelefonoUpdate+ ") " +vm.numTelefonoUpdate;
        }

        // ###############################################################
        // ###################### BOTONES EDICION ########################

        vm.descartarCambios = function(){
            if(hayCambiosEdit()){
                $('#mod-descartar-cambios').modal('show');
            }
            else{
                $('#mod-sin-cambios').modal('show');
            }
        }

        vm.actualizarEmpresa = function(){
            if(!hayCambiosEdit()){
                $('#mod-sin-cambios').modal('show');
                return;
            }
            if(hayDatosVaciosUpdate()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            if(!cuitCorrecto(vm.cuitUpdate_p1, vm.cuitUpdate_p2, vm.cuitUpdate_p3)){
                $('#mod-cuit-incorrecto').modal('show');
                return;
            }
            if(!mailCorrecto(vm.empresaUpdate.mail)){
                $('#mod-mail-incorrecto').modal('show');
                return;
            }
            if(!telefonoCorrecto(vm.codTelefonoUpdate, vm.numTelefonoUpdate)){
                $('#mod-tel-incorrecto').modal('show');
                return;
            }
            recuperarDatosUpdate();
            updateEmpresa();
        }

        vm.confirmaEliminarEmpresa = function(){
            $('#mod-eliminar-elemento').modal('show');
        }

        // ###########################################################

        // ###########################################################
        // ################### validacion ############################

        function cuitCorrecto(cuit1, cuit2, cuit3){
            var cuit_p1 = "" +cuit1;
            if(cuit_p1.length != 2){
                return false;
            }
            var cuit_p2 = "" +cuit2;
            if(cuit_p2.length != 8){
                return false;
            }
            var cuit_p3 = "" +cuit3;
            if(cuit_p3.length != 1){
                return false;
            }
            return true;
        }

        function telefonoCorrecto(cod, num){
            var codigo = "" +cod;
            if((codigo.length < 4) || (codigo.length > 6)){
                return false;
            }

            var numero = "" +num;
            if((numero.length < 6) || (numero.length > 8)){
                return false;
            }

            return true;
        }

        function mailCorrecto(stringMail){
            if(!stringMail.includes("@") || !stringMail.includes(".")){
                return false;
            }
            return true;
        }

        // ###########################################################

        // ###########################################################
        // ################### servicio REST #########################

        function cargarEmpresas() {
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

        function saveEmpresa(){
            dataServer.saveEmpresa(vm.empresaCreate)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos guardados con EXITO! = EMPRESA CREADO");
                    console.log(data);
                    vm.guardadoExitoso = true;
                    vm.creandoEmpresa = false;
                    cargarEmpresas();
                    $('#mod-operacion-exitosa').modal('show');
                    vm.resetDatosCreate();
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al guardar la NUEVO EMPRESA");
                    $('#mod-existe-empresa').modal('show');
                })
        }

        function updateEmpresa() {
            dataServer.updateEmpresa(vm.empresaUpdate)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos actualizados con EXITO! = EMPRESA ACTUALIZADA");
                    console.log(data);
                    cargarEmpresas();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar la NUEVA EMPRESA");
                    $('#mod-existe-empresa').modal('show');
                })
        }

        function deleteEmpresa() {
            dataServer.deleteEmpresa(vm.empresaSeleccionada.id)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos eliminados con EXITO! = EMPRESA");
                    console.log(data);
                    cargarEmpresas();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al eliminar la NUEVA EMPRESA");
                })
        }

        // ############################################################
        // ################### inicializacion #########################

        cargarEmpresas();
    }
})()