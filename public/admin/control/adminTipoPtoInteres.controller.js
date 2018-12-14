// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('adminTipoInteresController', [
            '$scope',
            'dataServer',
            AdminTipoInteresController
        ]);

    function AdminTipoInteresController(vm, dataServer){

        // ###############################################################
        // ########################### CREACION ##########################

        vm.tipoPtoInteresCreate = {
            "nombre": null,
            "icono": null
        }

        // ************* flags ******************
        vm.guardadoExitoso = false;
        vm.creandoTipo = true;

        function hayDatosVaciosCreate(){
            if((vm.tipoPtoInteresCreate.nombre == null)||(vm.tipoPtoInteresCreate.nombre == "")){
                return true;
            }
            // if((vm.tipoPtoInteresCreate.icono == null)||(vm.tipoPtoInteresCreate.nombre == "")){
            //     return true;
            // }
            return false;
        }

        vm.resetDatosCreate = function(){
            vm.tipoPtoInteresCreate.nombre = null;
            vm.tipoPtoInteresCreate.icono = null
            vm.guardadoExitoso = false;
            vm.creandoTipo = true;
        }

        vm.crearTipoPtoInteres = function(){
            if(hayDatosVaciosCreate()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            // hacer esta funcion desde el dataServer
            saveTipoInteres();
        }

        // ###############################################################

        // ###############################################################
        // ######################### EDICION #############################

        vm.tiposPtoInteres = [];

        vm.tipoPtoInteresSeleccionado = null;
        vm.tipoSeleccionado = false;

        vm.dataTipoInteresUpdate = {
            nombre: null,
            icono: null
        }

        vm.changeTipoSel = function(){
            actualizarSeleccion();
            // para controlar cuando se elimina un elemento
            if(vm.tipoPtoInteresSeleccionado != null){
                mostrarDatosTipoSeleccionado();
            }
        }

        function actualizarSeleccion(){
            // seteamos la bandera
            if(!vm.tipoSeleccionado){
                vm.tipoSeleccionado = true;
            }
            // controlamos el caso cuando se elimina una unidad
            if(vm.tipoPtoInteresSeleccionado == null){
                 vm.tipoSeleccionado = false;
            }
        }

        function mostrarDatosTipoSeleccionado(){
            vm.dataTipoInteresUpdate.nombre = "" + vm.tipoPtoInteresSeleccionado.nombre;
            // dsp incorporar el icono
        }

        function hayCambiosEdit(){
            // aca deberia comparar campo a campo de la unidad
            if(vm.tipoPtoInteresSeleccionado.nombre != vm.dataTipoInteresUpdate.nombre){
                return true;
            }
            // falta con el icono
            return false;
        }

        function hayDatosVaciosUpdate(){
            if((vm.dataTipoInteresUpdate.nombre == null)||(vm.dataTipoInteresUpdate.nombre == "")){
                return true;
            }
            // if((vm.dataTipoInteresUpdate.icono == null)||(vm.dataTipoInteresUpdate.nombre == "")){
            //     console.log("Icono vacio");
            //     return true;
            // }
            return false;
        }

        vm.eliminarTipoInteres = function(){
            console.log("Se va a eliminarel tipo");
            deleteTipoInteres();
        }

        vm.confirmaSalir = function(){
            console.log("Se descartan los cambios");
            mostrarDatosTipoSeleccionado();
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

        vm.actualizarTipo = function(){
            if(!hayCambiosEdit()){
                $('#mod-sin-cambios').modal('show');
                return;
            }
            if(hayDatosVaciosUpdate()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            // falta una funcion para recuperar los datos
            updateTipoInteres();
        }

        vm.confirmaEliminarTipo = function(){
            $('#mod-eliminar-elemento').modal('show');
        }

        // ###############################################################
        // ###################### SERVICIOS REST #########################

        function cargaTiposInteres() {
            dataServer.getTipoPtoInteres()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.tiposPtoInteres = data;
                    console.log("Datos recuperados con EXITO! = TIPOS INTERES");
                    console.log(vm.tiposPtoInteres);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las TIPOS INTERES");
                })
        }

        function saveTipoInteres() {
            var aux = {
                nombre: null
            }

            aux.nombre = vm.tipoPtoInteresCreate.nombre;
            // dataServer.saveTipoPtoInteres(vm.tipoPtoInteresCreate)
            dataServer.saveTipoPtoInteres(aux)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos guardados con EXITO! = TIPO INTERES CREADO");
                    console.log(data);
                    vm.guardadoExitoso = true;
                    vm.creandoTipo = false;
                    cargaTiposInteres();
                    vm.resetDatosCreate();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al guardar la NUEVO TIPO INTERES");
                    $('#mod-existe-elemento').modal('show');
                })
        }

        function updateTipoInteres() {
            var aux = {
                id: null,
                nombre: null
            }

            aux.id = vm.tipoPtoInteresSeleccionado.id;
            aux.nombre = vm.dataTipoInteresUpdate.nombre;
            // dataServer.saveTipoPtoInteres(vm.tipoPtoInteresCreate)
            dataServer.updateTipoPtoInteres(aux)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos actualizados con EXITO! = TIPO INTERES ACTUALIZADO");
                    console.log(data);
                    cargaTiposInteres();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al guardar la NUEVO TIPO INTERES");
                    $('#mod-existe-elemento').modal('show');
                })
        }

        function deleteTipoInteres() {
            dataServer.deleteTipoPtoInteres(vm.tipoPtoInteresSeleccionado.id)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos eliminados con EXITO! = TIPO INTERES");
                    console.log(data);
                    cargaTiposInteres();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al eliminar la NUEVO TIPO INTERES");
                })
        }

        // ###############################################################

        // ###############################################################
        // ###################### inicializacion #########################
        cargaTiposInteres();
    }

})()