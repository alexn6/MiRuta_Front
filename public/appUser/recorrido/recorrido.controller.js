// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('recorridoController', [
            '$scope',
            'creatorMap',
            'srvStyles',
            'srvDrawFeature',
            'srvComponents',
            RecorridoController
        ]);

    function RecorridoController(vm, creatorMap, styles, drawFeature, drawing) {

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

        // ********************************** FLAGS PUBLICAS ****************************

        // ************************DECLARACION DE FUNCIONES PUBLICAS ********************


        // ********************************** VARIABLES PRIVADAS ************************
        var datosRecorrido = {
            coordIni: null, // coordPuntoOrigen
            coordFin: null, // coordPuntoDestino
            transporte: null    // transporte elegido
        };

        // ###############################################################
        // ########################## PROMESAS ###########################
        function getRecorridoSelect(datos) {
            // drawing.getRouteTransport(datos)
            drawing.getRoute(datos)
                .then(function (data) {
                    vectorSourceRuta.clear();
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    var coordGeomRuta = data.coordinates;
                    console.log("Datos recuperados con EXITO! = RUTA_PTOS");
                    console.log(data);

                    // creamos el componente a mostrar en la capa y le asignamos un identificador
                    var ruta = drawing.getFeatureRoute(coordGeomRuta);
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
            }
            else{
                alert("Seleccione el cuadro del punto a ubicar:\n [Origen/Destino]");
            }
        })

        // muestra los mensajes de ayuda al lado del boton al pasar el mouse
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })

        vm.selectOrigen = function(elemSelect){
            // console.log("Se selecciono el origen");
            modoOrigen = true;
            modoDestino = false;
        }

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

    } // fin Constructor

})()