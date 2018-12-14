// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('recorridoController', [
            '$scope',
            'creatorMap',
            'dataServer',
            'srvStyles',
            'srvDrawFeature',
            'srvComponents',
            RecorridoController
        ]);

    function RecorridoController(vm, creatorMap, dataServer, styles, drawFeature, drawing) {

        // ********************************** VARIABLES PUBLICAS ************************
        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();

        // ******************* CAPAS *******************
        // array donde se almacenan los marcadores
        var vectorSourceOrigen = new ol.source.Vector();
        var capaOrigen = new ol.layer.Vector({
            source: vectorSourceOrigen
        });

        // array donde se almacenan los marcadores
        var vectorSourceDestino = new ol.source.Vector();
        var capaDestino = new ol.layer.Vector({
            source: vectorSourceDestino
        });

        // array donde se almacenan los marcadores
        var vectorSourceRuta = new ol.source.Vector();
        var capaRuta = new ol.layer.Vector({
            source: vectorSourceRuta
        });

        var estilosIcons = [];

        var modoOrigen = false;
        var modoDestino = false;
        var coordPuntoOrigen = null;
        var coordPuntoDestino = null;

        // var de los campo de textos de cada punto
        vm.puntoOrigen = null;
        vm.puntoDestino = null;

        // datos que seran enviados para buscar el mejor recorrido
        var datosRecorrido = {
            coordIni: null, // coordPuntoOrigen
            coordFin: null, // coordPuntoDestino
            transporte: null    // transporte elegido
        };

        // ###############################################################
        // ########################## PROMESAS ###########################

        function getRecorridoSelect(datos) {
            drawing.getRouteTransport(datos)
            //drawing.getRoute(datos)
                .then(function (data) {
                    vectorSourceRuta.clear();
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    var coordGeomRuta = data.coordinates;
                    console.log("Datos recuperados con EXITO! = RUTA_PTOS");
                    console.log(data);

                    // creamos el componente a mostrar en la capa y le asignamos un identificador
                    var ruta = drawing.getFeatureRoute(coordGeomRuta);
                    ruta.setStyle(styles.recorridoRuta());
                    // var id_inicial, id_feature;
                    // id_inicial = seleccionIdInicial();
                    // id_feature = getIdRuta(vm.ptosRecorrido);

                    // ruta.setId(id_inicial + id_feature);
                    // console.log("Se creo la ruta con id: " + ruta.getId());
                    // // seleccionamos el color de la ruta
                    // seleccionColorRecorrido(ruta);
                    vectorSourceRuta.addFeature(ruta);
                    
                    // console.log(" Cant de features de la capa RUTA: " + vm.cantFeaturesActual);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al recuperar RUTA_PTOS");
                    console.log(err);
                })
        }

        function recuperarDireccion(lat, lon){
            dataServer.getAdreessFromCoord(lat, lon)
                .then(function (data) {
                    console.log("Get Direccion con EXITO! = ADREESS");
                    // se vuelven a traer los datos para actualizarlos en la vista
                    console.log(data);
                    // actualizamos el campo de direccion
                    asignarDireccion(data.calle, data.ciudad, data.provincia, data.pais);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al actualizar las PUNTO_INTERES");
                })
        }

        // ###############################################################
        // ##################### FUNCIONES PUBLICAS ######################

        vm.buscarRecorrido = function(evtSelect){
            var transporteElegido = evtSelect.currentTarget.value;
            console.log("Opcion elegida: "+transporteElegido);
            // aca deberia ir a buscar el recorrido
            var datos = getDatosRecorrido(transporteElegido);
            if(datos != null){
                getRecorridoSelect(datos);
            }
            else{
                alert("Falta seleccionar el origen o destino del recorrido");
            }
            
        }

        // ##############################################################
        // ##################### FUNCIONES PRIVADAS #####################

        // recuperamos los iconos que vamos a usar para los features
        function cargarIconos(){
            // iconos para mostrar puntos
            estilosIcons["origen"] = styles.marcadorInicioRecorrido();
            estilosIcons["destino"] = styles.marcadorFinRecorrido();
        }

        function getStylePunto(){
            if(modoOrigen){
                return estilosIcons["origen"];
            }
            if(modoDestino){
                return estilosIcons["destino"];
            }
        }

        function getSourceCapaPunto(){
            if(modoOrigen){
                return vectorSourceOrigen;
            }
            if(modoDestino){
                return vectorSourceDestino;
            }
        }

        function getDatosRecorrido(medioTransporte){
            //recuperamos los datos seleccionados por el usuario
            // y los asignamos a la var para mandar rest
            datosRecorrido.coordIni = coordPuntoOrigen;
            datosRecorrido.coordFin = coordPuntoDestino;
            datosRecorrido.transporte = medioTransporte;

            if((coordPuntoOrigen == null) || (coordPuntoDestino == null)){
                return null;
            }

            return datosRecorrido;
        }

        // recupera los datos del punto seleccionado del mapa
        function asignarPuntoSeleccionado(coordenadas){
            if(modoOrigen){
                coordPuntoOrigen = coordenadas;
                console.log("Se selecciono el origen: "+coordenadas);
                return;
            }
            if(modoDestino){
                coordPuntoDestino = coordenadas;
                console.log("Se selecciono el destino: "+coordenadas);
                return;
            }
        }

        function asignarDireccion(direCalle, direCiudad, direProv, direPais){
            if(modoOrigen){
                vm.puntoOrigen = direCalle+ ", "+direCiudad+ ", "+direProv+ ", "+direPais;
            }
            if(modoDestino){
                vm.puntoDestino = direCalle+ ", "+direCiudad+ ", "+direProv+ ", "+direPais;
            }
        }

        // ###########################################################################
        // ################################# DIBUJO ##################################
        
        // limpia el mapa y dibuja el marcador correspondiente a las coord dadas
        function dibujarMarcadorUnico(coordenadas, estilo, sourceCapa) {
            sourceCapa.clear();
            var marcadorPtoInteres = drawFeature.getMarcadorByStyle(coordenadas, estilo);
            // le asignamos un id para poder recuperarlo mas facil
            marcadorPtoInteres.setId(0);
            sourceCapa.addFeature(marcadorPtoInteres);
            // vm.map.getView().setCenter(coordenadas);
        }

        // ##########################################################
        // ######################### EVENTOS ########################
        vm.map.on('click', function (evt) {
            if(modoOrigen || modoDestino){
                var coordenadas = evt.coordinate;
                asignarPuntoSeleccionado(coordenadas);
                var estilo = getStylePunto();
                var sourceCapa = getSourceCapaPunto();
                dibujarMarcadorUnico(evt.coordinate, estilo, sourceCapa);
                recuperarDireccion(coordenadas[0], coordenadas[1]);
            }
            else{
                $('#mod-selec-punto').modal('show');
            }
        })

        // muestra los mensajes de ayuda al lado del boton al pasar el mouse
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })

        // para determinar que estoy enfocado en el cuadro de punto de origen
        vm.selectOrigen = function(elemSelect){
            // console.log("Se selecciono el origen");
            modoOrigen = true;
            modoDestino = false;
        }

        // para determinar que estoy enfocado en el cuadro de punto de destino
        vm.selectDestino = function(elemSelect){
            modoDestino = true;
            modoOrigen = false;
            // console.log("Se selecciono el destino");
        }

        // ###################################################################
        // ##################### Inicializacion de datos #####################
        vm.map.addLayer(capaOrigen);
        vm.map.addLayer(capaDestino);
        vm.map.addLayer(capaRuta);
        cargarIconos();


        // para encontrar la ubicacion actual
        function showPosition(position) {
            console.log("Posicion: "+position);
        }

        function errorCallback(){
            console.log("Paso el tiempo de espera: no se encontro la ubicacion");
        }
        
        // buscando mi ubicacion
        function getLocation() {
            console.log("entro a geoLocation()");
            if (navigator.geolocation) {
                // navigator.geolocation.getCurrentPosition(showPosition);
                // navigator.geolocation.getCurrentPosition(showPosition,errorCallback,{timeout:30000});
                navigator.geolocation.getCurrentPosition(showPosition, errorCallback, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

            } else { 
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        //getLocation();

        function testGeolcation(){
            if ("geolocation" in navigator) {
                console.log("SI geolocation");
                navigator.geolocation.getCurrentPosition(function(position) {
                    // do_something(position.coords.latitude, position.coords.longitude);
                    console.log("algo");
                  });
              } else {
                console.log("No geolocation");
              }
        }
        //testGeolcation();

    } // fin Constructor

})()