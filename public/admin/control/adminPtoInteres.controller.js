// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('adminPtoInteresController', [
            '$scope',
            'creatorMap',
            'dataServer',
            'srvStyles',
            'srvDrawFeature',
            AdminPtoInteresController
        ]);

    // function AdminPtoInteresController(vm, creatorMap, dataServer, drawing, styles, drawFeature) {
    function AdminPtoInteresController(vm, creatorMap, dataServer, styles, drawFeature) {

        // ********************************** VARIABLES PUBLICAS ************************
        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();
        const ZOOM_PTO_INTERES = 16;

        var estilosActuales = [];

        // ###########################################################################
        // ################################# CREACION ###############################

        vm.tiposInteres = [];
        vm.tiposInteresUpdate = [];
        vm.nombrePunto;
        vm.tipoSeleccionado;
        vm.nuevoPtoInteres = {
            "nombre": "",
            "lat": "",
            "lon": "",
            "idTipo": ""
        }
        var latPuntoCreacion = null;
        var lonPuntoCreacion = null;

        // *************** Flags ******************

        var modoCreacion = false;
        vm.guardadoExitoso = false;

        // ******************* CAPAS *******************
        // array donde se almacenan los marcadores
        var vectorSourceCreacion = new ol.source.Vector();
        var capaCreacion = new ol.layer.Vector({
            source: vectorSourceCreacion
        });

        vm.guardarPunto = function(){
            if(datosVaciosCreacion()){
                $('#mod-faltan-datos').modal('show');
                return;
            }
            recuperarDatosPunto();
            guardarPuntoInteres();
        }

        function datosVaciosCreacion(){
            // controlamos que los datos no esten vacios
            if(vm.nombrePunto == null){
                console.log(" Falta el nombre del punto");
                return true;
            }
            if(vm.tipoSeleccionado == null){
                console.log(" Falta seleccionar el tipo de punto");
                return true;
            }
            if((latPuntoCreacion == null) || (lonPuntoCreacion== null)){
                return true;
            }

            return false;
        }

        // recuperamos los datos ingresados por el usuario CREACION
        function recuperarDatosPunto(){
            vm.nuevoPtoInteres.nombre = vm.nombrePunto;
            vm.nuevoPtoInteres.lat = latPuntoCreacion;
            vm.nuevoPtoInteres.lon = lonPuntoCreacion;
            vm.nuevoPtoInteres.idTipo = vm.tipoSeleccionado.id;
            console.log(" Datos del nuevo punto de interes.");
            console.log(vm.nuevoPtoInteres);
        }

        vm.resetDatosCreate = function(){
            vm.nombrePunto = null;
            vm.tipoSeleccionado = null;
            vm.nuevoPtoInteres = {
                "nombre": "",
                "lat": "",
                "lon": "",
                "idTipo": ""
            }
            vm.direccionSeleccionada = null;
            latPuntoCreacion = null;
            lonPuntoCreacion = null;

            vm.guardadoExitoso = false;
            vectorSourceCreacion.clear();
        }

        vm.hayTipoSeleccionadoCreate = function(){
            if(vm.tipoSeleccionado == null){
                return false;
            }
            return true;
        }

        // ###########################################################################
        // ################################# EDICION ###############################

        vm.nameTipoSeleccionado;

        var puntoSeleccionadoAux = null;

        vm.dataPuntoUpdate = {
            id: null,
            nombre: null,
            lat: null,
            lon: null,
            idTipointeres: null
        }

        // ********** campos nuevos *************
        vm.nuevoNombre;
        vm.nuevoTipoPunto;  // seleccionado desde la lista
        var nuevasCoord;

        // ******************* CAPA *******************
        // array donde se almacenan los marcadores
        var vectorSourceEdicion = new ol.source.Vector();
        var capaEdicion = new ol.layer.Vector({
            source: vectorSourceEdicion
        });

        // ******************** paginacion ************************
        // flag para mostrar los datos del punto en la vista
        vm.ptoInteresEditSelec = false;
        vm.tipoSeleccionadoUpdate = false;

        vm.ptosInteresByTipo = [];
        vm.pagActual;
        vm.pagTotal;
        vm.cantForPage = 5;

        vm.datosPuntoSeleccionado;
        vm.idPuntoFilaSeleccionada;

        // recupera los puntos del tipo seleccionado
        vm.buscarPuntos = function(){
            console.log("Name tipo seleccionado: ");
            console.log(vm.nameTipoSeleccionado);
            // para no mostrar marcada en la lista la opcion anterior
            vm.idPuntoFilaSeleccionada = null;


            if(vm.nameTipoSeleccionado == null){
                $('#mod-falta-tipopunto').modal('show');
                return;
            }
            vm.tipoSeleccionadoUpdate = true;
            resetDatosEdit();
            if(vm.datosPuntoSeleccionado != null){
                vm.datosPuntoSeleccionado.nombre = null;
            }
            vectorSourceEdicion.clear();
            getTipoPuntos();
        }

        // cuando se crea un nuevo punto
        function actualizarGetPuntosTipoSelecciondado(){
            // no se realizo la busqueda de tipo de puntos
            if(vm.nameTipoSeleccionado == null){
                return;
            }
            // volvemos a realizar la busqueda de puntos para mantener actualizada la lista de edicion
            if((vm.nameTipoSeleccionado.nombre == "todos")||(vm.nameTipoSeleccionado.nombre == vm.tipoSeleccionado.nombre)){
                console.log("[EDIT]: va a traer los ptoInteres");
                getTipoPuntos();
            }
            else{
                console.log("[EDIT]: lo deja como esta, no busca puntos");
            }
            
        }

        function updateDatosTabla(){
            vm.pagActual = 1;
            vm.pagTotal = Math.trunc(vm.ptosInteresByTipo.length/vm.cantForPage) + 1;
        }

        vm.noHayTipoSeleccionado = function(){
            if(vm.nameTipoSeleccionado == null){
                return true;
            }
            return false;
        }

        vm.cancelarCambios = function(){
            if(!hayCambiosEdit()){
                $('#mod-sin-cambios').modal('show');
                return;
            }
            else{
                $('#mod-descartar-cambios-edit').modal('show');
                return;
            }
            

            // si hay nuevas coord es xq se modifico el pto original
            // if(nuevasCoord != null){
            //     var estilo = getStyleMarker(vm.datosPuntoSeleccionado.tipointeres.nombre);
            //     dibujarMarcadorUnico(vm.datosPuntoSeleccionado.coordenada.coordinates, estilo, vectorSourceEdicion);
            // }
            // resetDatosEdit();
        }

        vm.descartarCambiosEdit = function(){
            // si hay nuevas coord es xq se modifico el pto original
            if(nuevasCoord != null){
                var estilo = getStyleMarker(vm.datosPuntoSeleccionado.tipointeres.nombre);
                dibujarMarcadorUnico(vm.datosPuntoSeleccionado.coordenada.coordinates, estilo, vectorSourceEdicion);
            }
            // seteamos la nueva ubicacion
            nuevasCoord = null;
            mostrarDatosPuntoSeleccionado(vm.datosPuntoSeleccionado);
        }

        // cuando se selecciona un punto
        vm.setPuntoSelected = function(puntoSeleccionado){
            console.log("Punto seleccionado:");
            console.log(puntoSeleccionado);
            puntoSeleccionadoAux = puntoSeleccionado;
            vm.ptoInteresEditSelec = true;
            if(hayCambiosEdit()){
                $('#mod-descartar-cambios').modal('show');
                return;
            }
            cambiarPtoSeleccionado();
        }

        vm.confirmarSalir = function(){
            cambiarPtoSeleccionado();
        }

        function cambiarPtoSeleccionado(){
            resetDatosEdit();

            // recuperamos los datos del nuevo punto seleccionado
            vm.idPuntoFilaSeleccionada = puntoSeleccionadoAux.id;
            vm.datosPuntoSeleccionado = puntoSeleccionadoAux;

            mostrarDatosPuntoSeleccionado(vm.datosPuntoSeleccionado);

            console.log("Punto seleccionado nuevo aux: ");
            console.log(puntoSeleccionadoAux);
            // recupero el estilo de acuerdo al tipo de punto para dibujarlo en el mapa
            var estilo = getStyleMarker(vm.datosPuntoSeleccionado.tipointeres.nombre);
            dibujarMarcadorUnico(vm.datosPuntoSeleccionado.coordenada.coordinates, estilo, vectorSourceEdicion);
        }

        function mostrarDatosPuntoSeleccionado(datosPunto){
            vm.nuevoNombre = datosPunto.nombre;
            // asignar nuevo tipo de punto a la lista de tipo de punto
            vm.nuevoTipoPunto = datosPunto.tipointeres;
        }

        // campos nuevos menu edicion
        function resetDatosEdit(){
            vectorSourceEdicion.clear();
            vm.nuevoNombre = null;
            vm.nuevoTipoPunto = null;
            nuevasCoord = null;
        }

        vm.pagAnterior = function(){
            if(vm.pagActual > 1){
                vm.pagActual--;
                return;
            }
        }

        vm.pagSiguiente = function(){
            if(vm.pagActual < vm.pagTotal){
                vm.pagActual++;
                return;
            }
        }

        vm.guardarCambios = function(){
            if(hayCambiosEdit()){
                recuperarDatosNuevos();
                actualizarPuntoInteres();
            }
            else{
                $('#mod-sin-cambios').modal('show')
            }
        }

        vm.eliminarPunto = function(){
            if(vm.datosPuntoSeleccionado != null){
                $('#mod-eliminar-punto').modal('show');
                return;
            }
        }

        vm.eliminarPtoSeleccionado = function(){
            eliminarPuntoInteres();
        }

        function hayCambiosEdit(){
            console.log("Entro a hayCambiosEdit()");
            // si estas variables estan en null es xq es la 1ra vez q se buscan datos
            if(vm.datosPuntoSeleccionado == null){
                return false;
            }
            if((vm.nuevoNombre == null)||(vm.nuevoTipoPunto == null)){
                return false;
            }
            // if(vm.nuevoNombre != null){
            //     return true;
            // }
            // if(vm.nuevoTipoPunto != null){
            //     return true;
            // }
            if(vm.nuevoNombre != vm.datosPuntoSeleccionado.nombre){
                console.log("nombre lista: "+vm.datosPuntoSeleccionado.nombre+" - nuevo nombre: "+vm.nuevoNombre);
                return true;
            }
            if(vm.nuevoTipoPunto.nombre != vm.datosPuntoSeleccionado.tipointeres.nombre){
                console.log("tipo lista: "+vm.datosPuntoSeleccionado.tipointeres.nombre+" - nuevo tipo: "+vm.nuevoTipoPunto.nombre);
                return true;
            }
            if(nuevasCoord != null){
                return true;
            }
            return false;
        }

        function recuperarDatosNuevos(){
            vm.dataPuntoUpdate.id = vm.datosPuntoSeleccionado.id;

            if(vm.nuevoNombre != null){
                vm.dataPuntoUpdate.nombre = vm.nuevoNombre;
            }
            else{
                vm.dataPuntoUpdate.nombre = vm.datosPuntoSeleccionado.nombre;
            }
            // ############ set a null cada vez que se cambia de punto 
            if(nuevasCoord != null){
                 vm.dataPuntoUpdate.lat = nuevasCoord[0];
                 vm.dataPuntoUpdate.lon = nuevasCoord[1];
            }
            else{
                vm.dataPuntoUpdate.lat = vm.datosPuntoSeleccionado.coordenada.coordinates[0];
                vm.dataPuntoUpdate.lon = vm.datosPuntoSeleccionado.coordenada.coordinates[1];
            }

            if(vm.nuevoTipoPunto != null){
                vm.dataPuntoUpdate.idTipointeres = vm.nuevoTipoPunto.id;
            }
            else{
                vm.dataPuntoUpdate.idTipointeres = vm.datosPuntoSeleccionado.tipointeres.id;
            }
            // console.log("Datos nuevos recuperados:");
            // console.log(vm.dataPuntoUpdate);
        }

        function actualizarCamposPuntoEditado(datosNuevos){
            // tipo del punto actualizado
            var tipoPunto = datosNuevos.tipointeres.nombre;
            var estilo = getStyleMarker(tipoPunto);
            // no mostramos los datos del punto si se cambio de tipo
            if((vm.nameTipoSeleccionado.nombre == "todos") || (tipoPunto == vm.nameTipoSeleccionado.nombre)){
                console.log("Entro a dibujar el punto: "+tipoPunto);
                vm.idPuntoFilaSeleccionada = datosNuevos.id;
                // vm.datosPuntoSeleccionado = puntoSeleccionadoAux;
                dibujarMarcadorUnico(datosNuevos.coordenada.coordinates, estilo, vectorSourceEdicion);
                mostrarDatosPuntoSeleccionado(datosNuevos);
                return;
            }
            //vm.datosPuntoSeleccionado.nombre = datosNuevos.nombre;
            resetDatosEdit();
        }

        // cargamos de entrada los iconos que vamos a usar en la vista
        function cargarIconos(){
            // iconos para mostrar puntos
            estilosActuales["carga"] = styles.marcadorCarga();
            //corregir esto
            estilosActuales["Taxi/Remis"] = styles.marcadorTraslado();
            // default
            estilosActuales["default"] = styles.marcadorDefault();
        }

        // agrega el tipo de punto generico
        function agregarTipo(arrayTipos){
            var indice = arrayTipos.length;
            var nuevoTipo = {
                "id": indice,
                "nombre": "todos"
            }
            arrayTipos.push(nuevoTipo);
        }

        // ###########################################################################
        // ################################# Serv REST ###############################

        function cargaTiposPuntosInteres() {
            dataServer.getTipoPtoInteres()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.tiposInteres = data;
                    // se clona el array para no trabajar con la misma referencia
                    vm.namesTiposInteres = [].concat(data);
                    console.log("Datos recuperados con EXITO! = TIPOS_INTERES");
                    console.log(data);
                    agregarTipo(vm.namesTiposInteres);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las TIPOS_INTERES");
                })
        }

        function guardarPuntoInteres(){
            dataServer.savePtoInteres(vm.nuevoPtoInteres)
                .then(function (data) {
                    vm.guardadoExitoso = true;
                    console.log("Creacion con EXITO! = PUNTOS_INTERES");
                    console.log(data);
                    // buscamos los puntos para que la creacion se vea reflejada en el otro panel
                    // vm.buscarPuntos();
                    actualizarGetPuntosTipoSelecciondado();
                    $('#mod-operacion-exitosa').modal('show');
                    vm.resetDatosCreate();
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al crear el PUNTO_INTERES");
                    $('#mod-existe-punto').modal('show');
                })
        }

        function actualizarPuntoInteres(){
            // console.log(vm.dataPuntoUpdate);
            // console.log(vm.datosPuntoSeleccionado);
            // console.log(vm.nameTipoSeleccionado);
            dataServer.updatePtoInteres(vm.dataPuntoUpdate)
                .then(function (data) {
                    // vm.guardadoExitoso = true;
                    console.log("Actualizacion con EXITO! = PUNTOS_INTERES");
                    console.log(data);
                    // esto para no mostrar el punto si es que se cambia de tipo
                    // vm.buscarPuntos();
                    getTipoPuntos();
                    vm.datosPuntoSeleccionado = data;
                    // se vuelven a traer los datos para actualizarlos en la vista
                    actualizarCamposPuntoEditado(data);
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar las PUNTO_INTERES");
                    $('#mod-existe-punto').modal('show');
                })
        }

        function recuperarDireccion(lat, lon){
            dataServer.getAdreessFromCoord(lat, lon)
                .then(function (data) {
                    console.log("Get Direccion con EXITO! = ADREESS");
                    // se vuelven a traer los datos para actualizarlos en la vista
                    console.log(data);
                    // actualizamos el campo de direccion
                    vm.direccionSeleccionada = data.calle+ ", "+data.ciudad+ ", "+data.provincia+ ", "+data.pais;
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar las PUNTO_INTERES");
                })
        }

        function eliminarPuntoInteres(){
            dataServer.deletePtoInteres(vm.datosPuntoSeleccionado.id)
                .then(function (data) {
                    console.log("Actualizacion con EXITO! = PUNTOS_INTERES");
                    // se vuelven a traer los datos para actualizarlos en la vista
                    vm.buscarPuntos();
                    $('#mod-operacion-exitosa').modal('show');
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar las PUNTO_INTERES");
                })
        }

        function getTipoPuntos(){
            dataServer.getPtoInteresByType(vm.nameTipoSeleccionado.nombre)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.ptosInteresByTipo = data;
                    updateDatosTabla();
                    console.log("Datos recuperados con EXITO! = TIPOS_INTERES");
                    console.log(vm.ptosInteresByTipo);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las TIPOS_INTERES");
                })
        }

        // ###########################################################################
        // ################################### EVENTOS ###############################
        
        vm.map.on('click', function (evt) {
            if(modoCreacion){
                // if(vm.hayTipoSeleccionadoCreate()){
                    latPuntoCreacion = evt.coordinate[0];
                    lonPuntoCreacion = evt.coordinate[1];

                    recuperarDireccion(latPuntoCreacion, lonPuntoCreacion);
        
                    // var estilo = getStyleMarker(vm.tipoSeleccionado.nombre);
                    var estilo = getStyleMarker("aca iria el tipo elegido");
                    // arreglar la recuperacion del estilo
                    dibujarMarcadorUnico(evt.coordinate, estilo, vectorSourceCreacion);
                // }
                // else{
                //     $('#mod-falta-tipopunto').modal('show');
                // }
            }
            
        });

        // ###########################################################################
        // ################################# DIBUJO ##################################
        
        // limpia el mapa y dibuja el marcador correspondiente a las coord dadas
        function dibujarMarcadorUnico(coordenadas, estilo, sourceCapa) {
            sourceCapa.clear();
            var marcadorPtoInteres = drawFeature.getMarcadorByStyle(coordenadas, estilo);
            // le asignamos un id para poder recuperarlo mas facil
            marcadorPtoInteres.setId(0);
            addInteractionByFeature(marcadorPtoInteres);
            sourceCapa.addFeature(marcadorPtoInteres);
            vm.map.getView().setCenter(coordenadas);
            vm.map.getView().setZoom(ZOOM_PTO_INTERES);
        }

        // ######### modificar para mostrar iconos #############
        function getStyleMarker(nombreTipoPunto){
            // var estilo = estilosActuales[nombreTipoPunto];

            // console.log("Estilo del marcador");
            // console.log(estilo);
            // // si no encuentra un icono para el tipo de punto devuelve por default
            // if(typeof(estilo) === "undefined"){
            //     estilo = estilosActuales["default"];
            // }
            // return estilo;
            
            return estilosActuales["default"];
        }

        function selectModoCreate(){
            capaEdicion.setVisible(false);
            capaCreacion.setVisible(true);
        }

        function selectModoEdit(){
            capaCreacion.setVisible(false);
            capaEdicion.setVisible(true);
        }

        function deselectModoCreate(){
            capaCreacion.setVisible(false);
        }

        function deselectModoEdit(){
            capaEdicion.setVisible(false);
        }

        // ###########################################################################
        // ######################### MOVER FEATURES  #################################

        function addInteractionByFeature(feature){
            var interaccionMoverMarcador = new ol.interaction.Translate({
                features: new ol.Collection([feature])
            });
            interaccionMoverMarcador.on('translateend', function (evt) {
                nuevasCoord = evt.coordinate;
                console.log("[addInter()]: "+nuevasCoord)
              });
            vm.map.addInteraction(interaccionMoverMarcador);
        }

        // ###########################################################################
        // ######################### CONTROL DE HTML ###########################

        $('#menuCreacion').on('shown.bs.collapse', function () {
            console.log("Se abrio el menu de creacion");
            modoCreacion = true;
            selectModoCreate();
            $('#menuEdit').collapse('hide');
        })

        $('#menuEdit').on('shown.bs.collapse', function () {
            console.log("Se abrio el menu de edicion");
            modoCreacion = false;
            selectModoEdit();
            $('#menuCreacion').collapse('hide');
        })

        $('#menuCreacion').on('hidden.bs.collapse', function () {
            console.log("Se cerro el menu de creacion");
            modoCreacion = false;
            deselectModoCreate();
        })

        $('#menuEdit').on('hidden.bs.collapse', function () {
            console.log("Se cerro el menu de edicion");
            // modoCreacion = false;
            deselectModoEdit();
        })

        // ######################### ADMIN MODAL ##############################

        // $('#modalTest').modal('show')


        // ###########################################################################
        // ########################### BUSCAR DIRECCION #############################

        vm.direccionSeleccionada = null;

        var inputFrom = document.getElementById('direccionAutocomplete');
        var autocompleteFrom = new google.maps.places.Autocomplete(
            inputFrom,
            // restricciones de busqueda (podria ser un array como options de arriba)
            {types: ['geocode']});
        google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
            // console.log("[callback]: promesa de la busqueda de dire");
            var place = autocompleteFrom.getPlace();
            // nuevas coordendas para el punto de edicion
            latPuntoCreacion = place.geometry.location.lng();
            lonPuntoCreacion = place.geometry.location.lat()
            var estilo = getStyleMarker(vm.tipoSeleccionado.nombre);
            dibujarMarcadorUnico([latPuntoCreacion, lonPuntoCreacion], estilo, vectorSourceCreacion);
        });

        // ###########################################################################
        // ############################## INICIALIZACION #############################

        // al crear el controlador ejecutamos esta funcion
        cargaTiposPuntosInteres();
        cargarIconos();

        // agregamos las capas de trabajo al mapa
        vm.map.addLayer(capaCreacion);
        vm.map.addLayer(capaEdicion);

    } // fin Constructor

})()