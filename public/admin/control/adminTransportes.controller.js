// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('adminTransportesController', [
            '$scope',
            // 'creatorMap',
            'dataServer',
            AdminTransportesController
        ]);

    // function AdminTransportesController(vm, creatorMap, dataServer) {
    function AdminTransportesController(vm, dataServer) {

        // #################### VAR GOLBALES ####################

        vm.unidades = [];
        vm.empresas = [];

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
                    vm.creandoUnidad = false;
                    cargaUnidades();
                    $('#mod-operacion-exitosa').modal('show');
                    vm.resetDatosCreate();
                })
                .catch(function (err) {
                    // if(err.data=="401")
                    // { do this}
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al guardar la NUEVA UNIDAD: "+err.status);
                    console.log(err);
                    $('#mod-ya-existe').modal('show');
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
                    // actualizamos los datos mostrados con los nuevos
                    mostrarDatosUnidadSeleccionada();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar la UNIDAD");
                    $('#mod-ya-existe').modal('show');
                })
        }

        function deleteUnidad() {
            dataServer.deleteUnidad(vm.unidadSeleccionada.id)
                .then(function () {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("Datos eliminados con EXITO! = UNIDAD ELIMINADA");
                    cargaUnidades();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al eliminar la UNIDAD");
                })
        }


        // ###########################################################################
        // ###########################################################################

        // ###########################################################################
        // ########################## CREACION ########################################

        vm.nombreEmpresaSeleccionada = "";
        vm.empresaSeleccionadaCreate = null;
        vm.dataUnidadCreate = {
            "nombre": null,
            "horaInicio": null,
            "minInicio": null,
            "horaFin": null,
            "minFin": null,
            "frecuencia": null,
            "precioBoleto": null,
            "idEmpresa": null
        };

        // vm.newPrecioBoleto = null;
        vm.hsInicio = null;
        vm.minInicio = null;
        vm.hsFin = null;
        vm.minFin = null;
        // bandera para habilitar la creacion de una nueva linea
        vm.guardadoExitoso = false;
        // opciones para mostrar en las listas de seleccion
        vm.opcionesPrecio = [];
        vm.creandoUnidad = true;
        vm.precioBoletoCreate = null;
        vm.opcionesHs = [];
        vm.opcionesMin = [];

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
            vm.precioBoletoCreate = null;
            vm.hsInicio = null;
            vm.minInicio = null;
            vm.hsFin = null;
            vm.minFin = null;
            vm.nombreEmpresaSeleccionada = "";
            vm.empresaSeleccionadaCreate = null;
            // reseteamos las banderas
            vm.guardadoExitoso = false;
            vm.creandoUnidad = true;
        }
        
        vm.crearUnidadNew = function(){
            if(datosVaciosCreate()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            // aca deberia pasar la frecuencia
            if(!frecuenciaCorrecta(vm.dataUnidadCreate.frecuencia)){
                $('#mod-frec-incorrecta').modal('show');
                return;
            }
            if(!horarioCorrecto(vm.hsInicio, vm.minInicio, vm.hsFin, vm.minFin)){
                $('#mod-horario-incorrecto').modal('show');
                return;
            }
            recuperarDatosUnidadCreate();
            saveUnidad();
        }



        // recupera todos los datos ingresados en la vista y los asigna a
        // un objeto con el formato correcto para ser procesado en el servidor
        function recuperarDatosUnidadCreate() {
            vm.dataUnidadCreate.idEmpresa = vm.empresaSeleccionadaCreate.id;
            vm.dataUnidadCreate.precioBoleto = vm.precioBoletoCreate.value;
            //vm.dataUnidadCreate.precioBoleto = 0;
            vm.dataUnidadCreate.horaInicio = vm.hsInicio.value;
            vm.dataUnidadCreate.minInicio = vm.minInicio.value;
            vm.dataUnidadCreate.horaFin = vm.hsFin.value;
            vm.dataUnidadCreate.minFin = vm.minFin.value;
            console.log("Se recuperaron los datos de la nueva unidad.");
            console.log(vm.dataUnidadCreate);
        }

        function datosVaciosCreate(){
            if((vm.dataUnidadCreate.nombre == null)||vm.dataUnidadCreate.frecuencia == null){
                return true;
            }
            if(vm.precioBoletoCreate == null){
                return true;
            }
            if((vm.hsInicio == null)||(vm.minInicio == null)){
                return true;
            }
            if((vm.hsFin == null)||(vm.minFin == null)){
                return true;
            }
            if(vm.empresaSeleccionadaCreate == null){
                return true;
            }
            return false;
        }


        // ################################# FIN CREACION #############################
        // ###########################################################################

        // ###########################################################################
        // ########################## EDICION ########################################

        vm.unidadSeleccionada = null;
        vm.nombreUnidadSel = null;
        vm.dataUnidadUpdate = {
            "id": null,
            "nombre": null,
            "horaInicio": null,
            "minInicio": null,
            "horaFin": null,
            "minFin": null,
            "frecuencia": null,
            "precioBoleto": null,
            "idEmpresa": null
        };
        vm.hsInicioUpdate = null;
        vm.minInicioUpdate = null;
        vm.hsFinUpdate = null;
        vm.minFinUpdate = null;
        vm.empresaNuevaSeleccionada = null;
        vm.nombreEmpresaActual = null;

        // ****************** flags ****************
        vm.unidadSel = false;

        //********************** Funciones *********************

        vm.actualizarUnidad = function(){
            if(!hayCambiosEdit()){
                $('#mod-sin-cambios').modal('show');
                return;
            }
            if (nombreVacio()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            // aca se deberia pasar la frecuencia a la funcion
            if(!frecuenciaCorrecta(vm.dataUnidadUpdate.frecuencia)){
                $('#mod-frec-incorrecta').modal('show');
                return;
            }
            if (!horarioCorrecto(vm.hsInicioUpdate, vm.minInicioUpdate, vm.hsFinUpdate, vm.minFinUpdate)){
                $('#mod-horario-incorrecto').modal('show');
                return;
            }
            recuperarDatosUpdate();
            updateUnidad();
        }

        // al elegir otra unidad se deben reflejar los datos correspondientes
        // en la vista como asi tmb al eliminarla
        vm.changeUnidadSel = function () {
            actualizarSeleccion()
            mostrarDatosUnidadSeleccionada();
        }

        function actualizarSeleccion(){
            // seteamos la bandera
            if(!vm.unidadSel){
                vm.unidadSel = true;
            }
            // controlamos el caso cuando se elimina una unidad
            if(vm.unidadSeleccionada == null){
                 vm.unidadSel = false;
            }
        }

        // se encarga de mostrar los datos en la vista c/vez q se selecciona
        // una nueva unidad PANEL EDICION
        function mostrarDatosUnidadSeleccionada(){
            if(vm.unidadSeleccionada == null){
                resetDatosSel();
                return;
            }
            console.log("Datos de la unidad selecciondad:");
            console.log(vm.unidadSeleccionada);
            vm.dataUnidadUpdate.nombre = "" + vm.unidadSeleccionada.nombre;
            vm.dataUnidadUpdate.frecuencia = Number("" + vm.unidadSeleccionada.frecuencia);
            mostrarHora();
            mostrarEmpresa();
            mostrarPrecioBoletoSel();
        }

        function resetDatosSel(){
            vm.dataUnidadUpdate.idEmpresa = null;
            vm.dataUnidadUpdate.nombre = null;
            vm.dataUnidadUpdate.frecuencia = null;
            // ** esto se debe hacer solo al recuperar los datos para actualizarlos en el serv
            vm.dataUnidadUpdate.precioBoleto = null;
            vm.dataUnidadUpdate.horaInicio = null;
            vm.dataUnidadUpdate.minInicio = null;
            vm.dataUnidadUpdate.horaFin = null;
            vm.dataUnidadUpdate.minFin = null;
            vm.hsInicioUpdate = null;
            vm.minInicioUpdate = null;
            vm.hsFinUpdate = null;
            vm.minFinUpdate = null;
            vm.precioBoletoUpdate = null;
        }

        // separa el precio de la unidad seleccionada en 2 enteros
        // para poder mostrarlos en la vista
        function mostrarPrecioBoletoSel() {
            // console.log("Entro a mostrarBoleto()");
            for (let i = 0; i < vm.opcionesPrecio.length; i++) {
                const opcion = vm.opcionesPrecio[i];
                if(opcion.value == vm.unidadSeleccionada.precioBoleto){
                    vm.precioBoletoUpdate = opcion;
                }
            }
        }

        function mostrarHora(){
            var componentesHora = separarStringHora(vm.unidadSeleccionada.horaInicio);
            vm.hsInicioUpdate = vm.opcionesHs[Number(componentesHora[0])];
            vm.minInicioUpdate = vm.opcionesMin[Number(componentesHora[1])];
            componentesHora = separarStringHora(vm.unidadSeleccionada.horaFin);
            vm.hsFinUpdate = vm.opcionesHs[Number(componentesHora[0])];
            vm.minFinUpdate = vm.opcionesMin[Number(componentesHora[1])];
        }

        function mostrarEmpresa(){
            vm.empresaNuevaSeleccionada = vm.unidadSeleccionada.empresa;
            console.log("Entro a mostrarEmpresa(): ");
            console.log(vm.empresaNuevaSeleccionada);
        }

        // separa un string de hora en sus componentes menores
        function separarStringHora(hora){
            var componentesHora = hora.split(":");
            return componentesHora;
        }

        function hayCambiosEdit(){
            // aca deberia comparar campo a campo de la unidad
            if(vm.dataUnidadUpdate.nombre != vm.unidadSeleccionada.nombre){
                return true;
            }
            if(vm.dataUnidadUpdate.frecuencia != Number("" + vm.unidadSeleccionada.frecuencia)){
                return true;
            }
            
            var componentesHoraIniOriginal = separarStringHora(vm.unidadSeleccionada.horaInicio);
            if((Number(componentesHoraIniOriginal[0]) != vm.hsInicioUpdate.value) || (Number(componentesHoraIniOriginal[1]) != vm.minInicioUpdate.value)){
                return true;
            }
            var componentesHoraFinOriginal = separarStringHora(vm.unidadSeleccionada.horaFin);
            if((Number(componentesHoraFinOriginal[0]) != vm.hsFinUpdate.value) || (Number(componentesHoraFinOriginal[1]) != vm.minFinUpdate.value)){
                return true;
            }

            if(vm.empresaNuevaSeleccionada.id != vm.unidadSeleccionada.empresa.id){
                return true;
            }

            // ######### hacer con el nuevo precio de boleto #########

            return false;
        }

        vm.descartarCambios = function(){
            // console.log(vm.unidadSeleccionada);
            if(hayCambiosEdit()){
                $('#mod-descartar-cambios').modal('show');
            }
            else{
                $('#mod-sin-cambios').modal('show');
            }
        }

        // cuando se acepta descartar los cambios
        vm.confirmarSalir = function(){
            mostrarDatosUnidadSeleccionada();
        }

        vm.confirmaEliminarLinea = function(){
            $('#mod-eliminar-elemento').modal('show');
        }

        vm.eliminarLinea = function(){
            resetDatosSel();
            deleteUnidad();
        }
        

        // ################################# FIN EDICION #############################
        // ###########################################################################

        // ###########################################################################
        // ####################### Captura de datos ##################################

        function nombreVacio(){
            if(vm.dataUnidadUpdate.nombre == ""){
                return true;
            }
            return false;
        }

        function recuperarDatosUpdate(){
            vm.dataUnidadUpdate.id = vm.unidadSeleccionada.id;
            vm.dataUnidadUpdate.idEmpresa = vm.empresaNuevaSeleccionada.id;
            vm.dataUnidadUpdate.horaInicio = vm.hsInicioUpdate.value;
            vm.dataUnidadUpdate.minInicio = vm.minInicioUpdate.value;
            vm.dataUnidadUpdate.horaFin = vm.hsFinUpdate.value;
            vm.dataUnidadUpdate.minFin = vm.minFinUpdate.value;

            // ############# recuperar precio #################
            vm.dataUnidadUpdate.precioBoleto = vm.precioBoletoUpdate.value;

            console.log("Se recuperaron los datos para ACTUALIZAR correctamente.");
            console.log(vm.dataUnidadUpdate);
        }

        // ###########################################################################
        // ###########################################################################


        // ###########################################################################
        // ########################### Validacion ####################################

        // verifica que el horario de finalizacion del recorrido sea mayor
        // al de inicio
        function horarioCorrecto(hIni, mIni, hFin, mFin) {
            if (hFin.value < hIni.value) {
                return false;
            }
            if (hFin.value == hIni.value) {
                if (mFin.value <= mIni.value) {
                    return false;
                }
            }
            return true;
        }

        // deberia recibir como parametro la frecuencia
        function frecuenciaCorrecta(frecuencia){
            console.log("Frec recibida: "+frecuencia);
            if((frecuencia >= 5 ) && (frecuencia <= 300))
                return true;
            return false;
        }

        // ###########################################################################

        // ###########################################################################
        // ########################### Carga inicial datos ###########################

        function cargarOpcionesPrecioBoleto(){
            var opcionPrecioUnico = {
                "id": 1,
                "value": "precio unico"
            }
            var opcionPrecioSeccion = {
                "id": 2,
                "value": "precio por seccion"
            }
            vm.opcionesPrecio.push(opcionPrecioUnico);
            vm.opcionesPrecio.push(opcionPrecioSeccion);
        }

        function cargarHora(){
            var i=0;
            while(i < 24){
                var hora = {
                    "id": i,
                    "value": i
                }
                vm.opcionesHs.push(hora);
                i++;
            }
        }

        function cargarMinutos(){
            var i=0;
            while(i < 60){
                var min = {
                    "id": i,
                    "value": i
                }
                vm.opcionesMin.push(min);
                i++;
            }
        }

        // ###########################################################################

        // ###################################################################
        // ##################### INICIALIZACION DE DATOS #####################
        
        cargaUnidades();
        cargaEmpresas();
        cargarOpcionesPrecioBoleto();
        cargarHora();
        cargarMinutos();

    } // fin Constructor

})()