// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    // angular.module('mapModule', ['drawModule'])
    angular.module('mapModule')
        .controller('adminRecorridoController_v1', [
            '$scope',
            'creatorMap',
            'dataServer',
            // 'drawController',
            'srvComponents',
            AdminRecorridoController
        ]);

    function AdminRecorridoController(vm, creatorMap, dataServer, drawing) {

        // #############################################################################
        // ########################## VARIABLES PUBLICAS ###############################

        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();

        vm.nombreUnidades = [];

        vm.indice = 0;

        vm.direccionParada = "";

        vm.nombreUnidadSeleccionada = "";
        // vm.unidadTrsnspSelec = [];
        // vm.transporteSeleccionado = false;


        // #############################################################################
        // #############################################################################


        // #############################################################################
        // ######################### VARIABLES PRIVADAS ################################

        // variable con los datos que se enviaran al servidor para crear un nuevo recorrido
        // var puntosRecorridoCreate = [];
        // datso completos del recorrido nuevo
        var nuevoRecorrido;
        // array con las direcciones de las paradas
        var direcciones = [];
        const MIN_TAMANIO_RECORRIDO = 2;

        // para controlar el acceso alas funcionalidades de cada seccion
        var modo_creacion = false;
        var modo_eliminacion = false;

        // array donde se almacenan los marcadores
        var vectorSource = new ol.source.Vector();
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        // capa y componentes de 
        var vectorSourceElim = new ol.source.Vector();
        var layerEliminacion = new ol.layer.Vector({
            source: vectorSourceElim
        });

        // #############################################################################
        // #############################################################################


        // #############################################################################
        // ######################### FUNCIONES PRIVADAS ################################


        // ####################################################################
        // ######################### SERVICIOS REST ###########################
        function cargaNombreUnidades() {
            dataServer.getNombreUnidades()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.nombreUnidades = data;
                    console.log("Datos recuperados con EXITO! = UNIDADES");
                    console.log(vm.nombreUnidades);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las UNIDADES");
                })
        }

        // recupera solo los recorridos de c/unidad y los almacena en un array
        function cargaRecorridos() {
            dataServer.getRecorridos()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.datos_recorridos = data;
                    console.log("Datos recuperados con EXITO! = RECORRIDOS");
                    console.log(vm.datos_recorridos);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las RECORRIDOS");
                })
        }

        function guardarRecorridoServ(datosRecorrido) {
            console.log("Datos del nuevo recorrido");
            console.log(datosRecorrido);
            // dataServer.saveRecorrido(datosRecorrido)
            dataServer.setRecorrido(datosRecorrido)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    console.log("NUEVO RECORRIDO creado con EXITO!");
                    console.log(data);
                    // alert("El recorrido fue creado con exito!");
                    $('#mod-operacion-exitosa').modal('show');
                    cargaRecorridos();
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al crear NUEVO RECORRIDO");
                })
        }

        function didujarPuntoCercano(coordMapa) {
            drawing.getPointNearest(coordMapa)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    var coord = data;
                    console.log("Datos recuperados con EXITO! = PUNTO CERCANO");
                    if(vm.editIda){
                        var marcadorPtoCercano = drawing.getMarcadorParadaIda(coord);
                    }
                    if (vm.editVuelta) {
                        var marcadorPtoCercano = drawing.getMarcadorParadaVuelta(coord);
                    }
                    // se le asgina un id inicial distinto para c/recorrido
                    var id_inicial, id_feature;
                    id_inicial = seleccionIdInicial();
                    id_feature = getIdPunto(vm.ptosRecorrido);

                    marcadorPtoCercano.setId(id_inicial + id_feature);
                    console.log("Se creo el punto con id: " + marcadorPtoCercano.getId());
                    vectorSource.addFeature(marcadorPtoCercano);

                    // actualizamos la lista de marcadores, sus estilos
                    actualizarMarcadores(vm.ptosRecorrido);

                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al recuperar coord PUNTO CERCANO");
                })
        }

        function recuperarDireccion(coordMapa) {
            drawing.getAddressPoint(coordMapa)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.direccionParada = data[0];
                    // guardamos la direccion en el array con su id
                    direcciones[vm.cantParadas] = data[0];
                    console.log("Datos recuperados con EXITO! = DIRECCION");
                    console.log(vm.direccionParada);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al recuperar DIRECCION");
                    console.log(err);
                })
        }

        function dibujarRutaPtos(puntos) {
            drawing.getRoute(puntos)
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    var coordGeomRuta = data.coordinates;
                    console.log("Datos recuperados con EXITO! = RUTA_PTOS");

                    // creamos el componente a mostrar en la capa y le asignamos un identificador
                    var ruta = drawing.getFeatureRoute(coordGeomRuta);
                    var id_inicial, id_feature;
                    id_inicial = seleccionIdInicial();
                    id_feature = getIdRuta(vm.ptosRecorrido);

                    ruta.setId(id_inicial + id_feature);
                    console.log("Se creo la ruta con id: " + ruta.getId());
                    // seleccionamos el color de la ruta
                    seleccionColorRecorrido(ruta);
                    vectorSource.addFeature(ruta);
                    
                    // console.log(" Cant de features de la capa RUTA: " + vm.cantFeaturesActual);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al recuperar RUTA_PTOS");
                    console.log(err);
                })
        }

        // ####################################################################
        // ####################################################################

        // ####################################################################
        // ######################### SOPORTE SERVICIOS REST ###########################

        // soporte para vm.borrarUltimo()
        function borrarPunto(nro_punto) {
            var id_inicial, id_feature;
            
            id_inicial = seleccionIdInicial();
            id_feature = getIdPunto(nro_punto);

            var feature_punto = vectorSource.getFeatureById(id_inicial + id_feature);
            vectorSource.removeFeature(feature_punto);

            console.log("Se borro el feature-punto con id: " + (id_inicial + id_feature));
        }

        // soporte para vm.borrarUltimo()
        function borrarRuta(nro_punto) {
            var id_inicial, id_feature;

            id_inicial = seleccionIdInicial();
            id_feature = getIdRuta(nro_punto);

            var feature_ruta = vectorSource.getFeatureById(id_inicial + id_feature);
            vectorSource.removeFeature(feature_ruta);

            console.log("Se borro el feature-ruta con id: " + (id_inicial + id_feature));
        }

        // preparamos los datos para enviarlos al servidor y guardarlos
        function recuperarDatosRecorrido() {
            // recuperamos los datos del recorrido
            var puntos_recorrido_ida, puntos_recorrido_vuelta;

            puntos_recorrido_ida = getPuntos(coord_ida);
            puntos_recorrido_vuelta = getPuntos(coord_vuelta);
            // recuperamos los datos
            // ver como recuperar estos recorridos (puntosRecorridoCreate)
            var nuevoRecorrido = {
                "puntos_ida": puntos_recorrido_ida,
                "puntos_vuelta": puntos_recorrido_vuelta,
                "nombreLinea": vm.nombreUnidadSeleccionada
            }

            console.log("Puntos del nuevo recorrido");
            console.log(nuevoRecorrido);

            return nuevoRecorrido;
        }

        // reasignamos los datos de los puntos cargados
        function getPuntos(arrayRecorrido) {

            var puntos = [];
            var puntoRecorridoCreado, nuevoPuntoRecorrido;

            for (let i = 0; i < arrayRecorrido.length; i++) {
                puntoRecorridoCreado = arrayRecorrido[i];
                // creamos el dato para mandar al servidor
                nuevoPuntoRecorrido = {
                    "x": puntoRecorridoCreado[0],
                    "y": puntoRecorridoCreado[1]
                }
                // almacenamos el nuevo dato en el array nuevo modificado
                puntos.push(nuevoPuntoRecorrido);
            }

            return puntos;
        }

        // ####################################################################
        // ####################################################################

        // #############################################################################
        // ##################### CREACION DE RECORRIDOS ################################
        
        vm.editIda = false;
        vm.editVuelta = false;
        
        const ID_INI_IDA = 100;
        const ID_INI_VUELTA = 200;
        const TAM_RECORRIDO_MIN = 3;

        vm.ptosRecorrido = 0;

        // array de recorrido generico
        var coord_recorrido;
        // array con las coordenadas del recorrido de ida
        var coord_ida = [];
        // array con las coordenadas del recorrido de ida
        var coord_vuelta = [];

        // elegimos el recorrido a editar segun la opcion elegida
        var seleccionRecorridoActual = function(){
            if (vm.editIda) {
                coord_recorrido = coord_ida;
                console.log("Se selecciono el recorrido IDA");
            }
            if (vm.editVuelta) {
                 coord_recorrido = coord_vuelta;
                console.log("Se selecciono el recorrido VUELTA");
            }
        }

        // elegimos el id inicial de los feature creados
        var seleccionIdInicial = function(){
            if (vm.editIda) {
                return ID_INI_IDA;
            }
            if (vm.editVuelta) {
                return ID_INI_VUELTA;
            }
        }

        var seleccionColorRecorrido = function(ruta){
            if (vm.editIda) {
                drawing.setStyleRecorridoIda(ruta);
                return;
            }
            if (vm.editVuelta) {
                drawing.setStyleRecorridoVuelta(ruta);
                return;
            }
        }

        // entrar si la cantidad de puntos es mayor a 2
        var actualizarMarcadores = function(nro_marcadores){
            // si hay un solo marcador se deja el estilo original del marcador
            // ya que es el de parada de inicio
            if (nro_marcadores == 1){
                return;
            }

            var marcadorAux1, marcadorAux2, id_inicial, id_feature;

            id_inicial = seleccionIdInicial();

            // si hay 2 marcadores, seteamos el estilo del 2do punto
            // q pasaria a ser la parada final
            
            if (nro_marcadores == 2) {
                id_feature = getIdPunto(nro_marcadores);
                marcadorAux1 = vectorSource.getFeatureById(id_inicial + id_feature);
                if(vm.editIda){
                    drawing.setStyleParadaFin(marcadorAux1);
                }
                else{
                    drawing.setStyleParadaFinVuelta(marcadorAux1);
                }
                return;
            }

            // si hay mas de 2 marcadores
            if (nro_marcadores > 2) {
                // seteamos el ultimo marcador como parada fin
                id_feature = getIdPunto(nro_marcadores);
                marcadorAux1 = vectorSource.getFeatureById(id_inicial + id_feature);
                if (vm.editIda) {
                    drawing.setStyleParadaFin(marcadorAux1);
                }
                else {
                    drawing.setStyleParadaFinVuelta(marcadorAux1);
                }

                // buscamos el anteultimo marcador y lo dejamos como parada normal
                id_feature = getIdPunto(nro_marcadores - 1);
                marcadorAux2 = vectorSource.getFeatureById(id_inicial + id_feature);
                if (vm.editIda) {
                    drawing.setStyleParadaNormal(marcadorAux2);
                }
                else {
                    drawing.setStyleParadaNormalVuelta(marcadorAux2);
                }
            }
            
            return;
        }

        vm.recorridoCorrecto = function(){
            // vemos si el recorrido cumple con las condiciones
            
            var tam_recorrido_ida = coord_ida.length;
            var tam_recorrido_vuelta = coord_vuelta.length;

            if((tam_recorrido_ida >= TAM_RECORRIDO_MIN) && (tam_recorrido_vuelta >= TAM_RECORRIDO_MIN)){
                return true;
            }

            return false;
        }

        // para controlar el boton de borrar ultimo
        vm.hayParada = function(){
            if (vm.ptosRecorrido == 0)
                return false;
            return true;
        }

        vm.selectBotonIda = function(){
            // desactivamos el otro boton
            if (vm.editVuelta) {
                vm.editVuelta = false
            }
            if(!vm.editIda){
                vm.editIda = true;
                coord_recorrido = coord_ida;
                console.log("Se selecciono el recorrido IDA");
                vm.ptosRecorrido = coord_recorrido.length;
            }
        }

        vm.selectBotonVuelta = function () {
            // desactivamos el otro boton
            if (vm.editIda) {
                vm.editIda = false
            }
            if (!vm.editVuelta) {
                vm.editVuelta = true;
                coord_recorrido = coord_vuelta;
                console.log("Se selecciono el recorrido VUELTA");
                vm.ptosRecorrido = coord_recorrido.length;
            }
        }

        // devuelve el id del punto segun la cantidad de puntos del recorrido
        function getIdPunto(nro_punto){
            // 1 --> 1,  2 -- > 3,  3 -- > 5,  4 -- > 7
            if(nro_punto == 1){
                return 1;
            }

            return ((2*nro_punto) - 1);
        }

        // devuelve el id de la ruta segun la cantidad de puntos del recorrido
        function getIdRuta(nro_punto){
            // 2 -- > 2,  3 -- > 4,  4 -- > 6,  5 -- > 8
            if(nro_punto == 2){
                return 2;
            }

            return (nro_punto + (nro_punto - 2));
        }

        // #############################################################################
        // ##################### ELIMINACION DE RECORRIDOS #############################

        // almacena solo los datos de los recorridos de c/unidad
        vm.datos_recorridos;
        vm.nombreUnidadSeleccionadaElim = "";
        vm.unidadConRecorrido = true;
        vm.lineaSeleccionada = false;
        console.log("linea seleccionada_ini: "+vm.lineaSeleccionada);
        var lineaSelec = false;

        // capa generica del mapa
        var capaActual;

        vm.changeUnidad = function () {
            console.log("linea seleccionada: "+vm.lineaSeleccionada);
            if(!vm.lineaSeleccionada){
                vm.lineaSeleccionada = true;
            }
            console.log("linea seleccionada_1: "+vm.lineaSeleccionada);
            // recuperar el recorrido de esa unidad y mostrarlo
            var recorrido = recuperarRecorrido(vm.nombreUnidadSeleccionadaElim);
            if(recorrido == null){
                console.log(" La unidad seleccionada no cuenta con un recorrido disponible");
                // alert(" La unidad seleccionada no cuenta con un recorrido disponible");
                $('#mod-no-recorrido').modal('show');
                return;
            }
            mostrarRecorridoUnidad(recorrido);
            // console.log("#################### Se selecciono la UNIDAD: "+vm.nombreUnidadSeleccionadaElim+" ##################");
        }

        // devuelve los datos del recorrido de la unidad, null si no lo encuentra
        function recuperarRecorrido(nombreUnidad){
            // buscamos la unidad seleccionada
            var dato_recorrido;
            var recorrido = null;

            for (let i = 0; i < vm.datos_recorridos.length; i++) {
                dato_recorrido = vm.datos_recorridos[i];
                if (dato_recorrido.nombre_unidad == nombreUnidad){
                    recorrido = new Array(2);
                    recorrido[0] = dato_recorrido.recorrido_ida;
                    recorrido[1] = dato_recorrido.recorrido_vuelta;
                    return recorrido;
                }
            }

            return recorrido;
        }

        function mostrarRecorridoUnidad(datos_recorrido){
            // console.log(" Datos del recorrido obtenido:");
            console.log(datos_recorrido);
            var feature_recorrido_ida = drawing.getFeatureRoute(datos_recorrido[0].coordinates);
            var feature_recorrido_vuelta = drawing.getFeatureRoute(datos_recorrido[1].coordinates);

            // vectorSource.addFeature(feature_recorrido_ida);
            // vectorSource.addFeature(feature_recorrido_vuelta);
            // primeros borramos los features anteriores de la capa
            // y luego agregamos los nuevos festures
            vectorSourceElim.clear();
            vectorSourceElim.addFeature(feature_recorrido_ida);
            vectorSourceElim.addFeature(feature_recorrido_vuelta);
            // layerEliminacion.setVisible(true);
        }

        // vm.lineaSeleccionada = function(){
        //     return lineaSelec;
        // }

        vm.eliminarRecorrido = function(){
            if(vm.lineaSeleccionada){
                dataServer.deleteRecorrido(vm.nombreUnidadSeleccionadaElim)
                    .then(function (data){
                        console.log("Se elimino el recorrido correctamente.");
                        cargaRecorridos();
                        vectorSourceElim.clear();
                    })
                    .catch(function (err){
                        console.log(" Hubo un problema al borrar el recorrido!!!!");
                    })
            }else{
                // alert(" Debe seleccionar la unidad del recorrido a borrar!");
                $('#mod-seleccione-elemento').modal('show');
            }
        }

        function cargaRecorridoUnidades() {
            // dataServer.getNombreUnidades()
            //     .then(function (data) {
            //         // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
            //         vm.nombreUnidades = data;
            //         console.log("Datos recuperados con EXITO! = UNIDADES");
            //         console.log(vm.nombreUnidades);
            //     })
            //     .catch(function (err) {
            //         console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las UNIDADES");
            //     })
        }


        // #############################################################################
        // #############################################################################

        // #############################################################################
        // ################################ EVENTOS #####################################

        vm.map.on('click', function (evt) {
            console.log(evt.coordinate);
            if (vm.nombreUnidadSeleccionada == "") {
                // alert("Debe seleccionar una UNIDAD DE TRANSPORTE antes de crear un recorrido");
                $('#mod-seleccione-elemento').modal('show');
            }
            else {
                if (!vm.editIda && !vm.editVuelta) {
                    // alert("Debe seleccionar el tipo de recorrido que desea elaborar");
                    $('#mod-selec-tipo-recorrido').modal('show');
                    return;
                }

                // agregamos el marcador al mapa(lo nuevo)
                coord_recorrido.push(evt.coordinate);
                vm.ptosRecorrido = coord_recorrido.length;

                if (vm.ptosRecorrido > 1) {
                    var puntos = {
                        coordIni: coord_recorrido[vm.ptosRecorrido - 2],
                        coordFin: evt.coordinate
                    };
                    dibujarRutaPtos(puntos);
                }

                // buscamos el punto mas cercano que sea calle
                didujarPuntoCercano(evt.coordinate);

                // mostrar la direccion
                // recuperarDireccion(evt.coordinate);
            }
        });

        
        vm.guardarRecorrido = function () {
            // verificamos que ambos recorridos tengan mas de un elemento
            var paradasRecorridoIda, paradasRecorridoVuelta, datosNuevoRecorrido;
            paradasRecorridoIda = coord_ida.length;
            paradasRecorridoVuelta = coord_vuelta.length;

            console.log("IDA : " + paradasRecorridoIda + " - - - VUELTA: " + paradasRecorridoVuelta);

            if ((paradasRecorridoIda < MIN_TAMANIO_RECORRIDO) || (paradasRecorridoVuelta < MIN_TAMANIO_RECORRIDO))  {
                // alert(" Los recorridos deben contener al menos " + MIN_TAMANIO_RECORRIDO + " paradas.")
                $('#mod-pocas-paradas').modal('show');
                return;
            }
            else {
                datosNuevoRecorrido = recuperarDatosRecorrido();
                guardarRecorridoServ(datosNuevoRecorrido);
            }
        }

        vm.borrarUltimo = function () {
            console.log(" ANTES --> Cant de features de la capa: " + vm.ptosRecorrido);
            // volvemos a la direccion del ultimo punto
            // analizar como manejar las direcciones
            vm.direccionParada = direcciones[vm.cantParadas];
            // con esto se saca el ultimo punto del array auxiliar q se usa para los puntos
            coord_recorrido.pop();

            if (vm.ptosRecorrido == 1) {
                borrarPunto(vm.ptosRecorrido);
                vm.ptosRecorrido--;
                return;
            }
            // sino, si hay mas de un marcador entonces tambien hay una ruta entre estos
            // por lo que se deben borrar el ultimo marcador y la ruta
            borrarPunto(vm.ptosRecorrido);
            borrarRuta(vm.ptosRecorrido);

            vm.ptosRecorrido--;

            actualizarMarcadores(vm.ptosRecorrido);

            // Tambien se debe borrar la direccion y mantenerla actualizada
            // con la ultima que quedo --> Sol: agregar un array con las calles
            // de cada punto y su indice que seria el id (array[n°id] --> calle)

            console.log(" DESPUES --> Cant de features de la capa: " + vm.ptosRecorrido);
        }

        // boton Borrar Todo
        vm.resetDatosRecorrido = function () {
            coord_recorrido = [];
            vm.direccionParada = "";
            borrarFeatureRecorrido(); 
        }

        // borramos los features de la capa del recorrido actual
        // y reseteamos la cant de puntos
        function borrarFeatureRecorrido(){
            var id_inicial, cantFeatures, fetaureAux;
            id_inicial = seleccionIdInicial();
            cantFeatures = getIdPunto(vm.ptosRecorrido);

            // borramos los feature de la capa
            for (let i = 1; i < (cantFeatures + 1); i++) {
                fetaureAux = vectorSource.getFeatureById(id_inicial + i);
                vectorSource.removeFeature(fetaureAux); 
            }

            vm.ptosRecorrido = 0;
        }

        // ****************************************************************

        // vm.unidadTranspChanged = function(){
        //     if (!vm.transporteSeleccionado){
        //         vm.transporteSeleccionado = true;
        //     }
        // }

        // #############################################################################
        // #############################################################################

        // ****************************************************************
        // ********** administracion de la apertura de los paneles ********

        vm.selectCreate = function(){
            console.log("Se selecciono el panel de CREACION");
            layerEliminacion.setVisible(false);
            vectorLayer.setVisible(true);
        }

        vm.selectElim = function () {
            console.log("Se selecciono el panel de ELIMINACION");
            // se cambia de capa de trabajo
           //  capaActual = layerEliminacion;
            vectorLayer.setVisible(false);
            layerEliminacion.setVisible(true);
        }

        // ****************************************************************

        // #############################################################################
        // #############################################################################

        // ************************ Inicializacion de datos *****************************
        // al crear el controlador ejecutamos esta funcion
        cargaNombreUnidades();
        cargaRecorridos();
        // recuperarDatosRecorrido();
        // agregamos una capa de dibujo al mapa por cada modo de edicion
        vm.map.addLayer(vectorLayer);
        vm.map.addLayer(layerEliminacion);

        // **************************************************************
        // ******************* pa probar funcionalidad ******************

    } // fin Constructor

})()