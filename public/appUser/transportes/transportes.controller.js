// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('transportesController', [
            '$scope',
            '$interval',
            'creatorMap',
            'dataServer',
            'srvStyles',
            'srvDrawFeature',
            'srvComponents',
            TransportesController
        ]);

    function TransportesController(vm, $interval, creatorMap, dataServer, factoryStyle ,drawFeature, drawing) {

        // ###########################################################################
        // ############################## VAR PUBLICAS ###############################
        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();

        vm.unidades;
        vm.unidadSeleccionda;
        vm.hayUnidadSeleccionada = false;
        // cantidad de marcadores para dibujar
        vm.puntosRecorrido;
        vm.botonVerParadas = "Ver paradas";
        vm.botonVerRecorrido = "Ocultar Recorrido";
        var recorridoMostrado = true;
        var paradasMostradas = false;
        vm.indiceMarcadorPtosRecorrido;

        // para mostrar mje de alert en la vista
        vm.lineaConRecorrido = true;

        var estilos = {
            recorrido: null,
            pto_recorrido: null,
            inicioRecorrido: null,
            finRecorrido: null,
            parada_ida: null,
            parada_vuelta: null
        };

        var coordRecorridos = [];

        // ******************* CAPAS *******************
        // array donde se almacenan los marcadores
        var vectorSourceDibujo = new ol.source.Vector();
        var capaDibujo = new ol.layer.Vector({
            source: vectorSourceDibujo
        });
        // array donde se almacenan los paradas
        var vectorSourceParadas = new ol.source.Vector();
        var capaParadas = new ol.layer.Vector({
            source: vectorSourceParadas
        });

        // ###########################################################################
        // ############################## FUNCIONES ##################################

        vm.changeUnidad = function(){
            // console.log("cambio la unidad");
            resetOpcionesBotones();
            if(vm.unidadSeleccionda != null){
                vm.hayUnidadSeleccionada = true;
                // cada vez q se cambia deberiamos dibujar lor recorridos
                // y paradas en el mapa
                if(!existeRecorrido(vm.unidadSeleccionda.nombre)){
                    console.log("Se va a buscar el recorrido de "+vm.unidadSeleccionda.nombre);
                    // se debe ir a buscar el geom del recorrido
                    cargaRecorridoUnidad(vm.unidadSeleccionda.id);
                }
                else{
                    console.log("El recorrido de la unidad seleccionada ya se recupero");
                    vm.lineaConRecorrido = true;
                    var datosUnidad = coordRecorridos[vm.unidadSeleccionda.nombre];
                    dibujarRecorrido(datosUnidad);
                    verAnimacionRecorrido(datosUnidad);
                }
            }
            
        }

        function resetOpcionesBotones(){
            // reset de los botones
            vectorSourceParadas.clear();
            vm.botonVerParadas = "Ver paradas";
            paradasMostradas = false;
            // boton ocultar recorrido
            recorridoMostrado = true;
            capaDibujo.setVisible(true);
            vm.botonVerRecorrido = "Ocultar recorrido";
        }

        // dibujo los recorridos de la unidad seleccionada
        function dibujarRecorrido(datos_unidad){
            vectorSourceDibujo.clear();
            agregarRecorridos(datos_unidad, vectorSourceDibujo);
            agregarIniFinRecorrido(datos_unidad, vectorSourceDibujo);
        }

        // crea los features necesarios y los agrega en el mapa
        function agregarRecorridos(datos, vectoSourceCapa){
            var feature_recorrido_ida = crearFeatureRecorrido(datos.recorrido_ida.coordinates);
            var feature_recorrido_vuelta = crearFeatureRecorrido(datos.recorrido_vuelta.coordinates);
            vectoSourceCapa.addFeature(feature_recorrido_ida);
            vectoSourceCapa.addFeature(feature_recorrido_vuelta);
        }

        // crea el feature del recorrido con su estilo
        function crearFeatureRecorrido(coordRecorrido){
            var feature = drawing.getFeatureRoute(coordRecorrido);
            feature.setStyle(estilos.recorrido);

            return feature;
        }

        // crea los feature de inicio y fin del recorrido
        function agregarIniFinRecorrido(datos, vectoSourceCapa){
            var coordIniRecorrido = datos.recorrido_ida.coordinates;
            var coordVueltaRecorrido = datos.recorrido_vuelta.coordinates;

            // creamos los feature de los marcadores de recorrido de ida
            // y los agregamos al mapa
            var featureInicioRecorrido = crearFeatureRecorridoByStyle(coordIniRecorrido[0], estilos.inicioRecorrido);
            var featureFinRecorrido = crearFeatureRecorridoByStyle(coordIniRecorrido[coordIniRecorrido.length - 1], estilos.finRecorrido);

            vectoSourceCapa.addFeature(featureInicioRecorrido);
            vectoSourceCapa.addFeature(featureFinRecorrido);

            // creamos los feature de los marcadores de recorrido de vuelta
            // y los agregamos al mapa
            var featureInicioRecorrido = crearFeatureRecorridoByStyle(coordVueltaRecorrido[0], estilos.inicioRecorrido);
            var featureFinRecorrido = crearFeatureRecorridoByStyle(coordVueltaRecorrido[coordVueltaRecorrido.length - 1], estilos.finRecorrido);

            vectoSourceCapa.addFeature(featureInicioRecorrido);
            vectoSourceCapa.addFeature(featureFinRecorrido);
        }

        // crea un marcador con el estilo definido
        function crearFeatureRecorridoByStyle(coordPunto, estilo){
            var feature = drawFeature.getMarcadorByStyle(coordPunto, estilo);
            return feature;
        }

        // una vez recuperados los datos del recorrido de la unidad seleccionada
        // se guardan en un array para no volver a buscarlos
        function actualizarRecorridos(datosRecorrido){
            if(coordRecorridos[datosRecorrido.nombre_unidad] == null){
                coordRecorridos[datosRecorrido.nombre_unidad] = datosRecorrido;
                return;
            }
            console.log("El recorrido ya se recupero del servidor");
        }

        // si ya se recuperaron los datos del recorrido
        function existeRecorrido(nombreLinea){
            console.log("Entro a existe(): "+nombreLinea);
            if(coordRecorridos[nombreLinea] == null){
                return false;
            }
            return true;
        }

        // se inicializa el array que contendra los datos del recorrido
        function inicializacionRecorridoUnidades(){
            var unidad;
            // creamos la variable que almacenara los datos de los recorrido de c/unidad
            for (let index = 0; index < vm.unidades.length; index++) {
                unidad = vm.unidades[index];
                coordRecorridos[unidad.nombre] = null;
            }
            // console.log("Se inicializo el array de recorridos");
            // console.log(coordRecorridos);
        }

        vm.dibujarParadas = function(){
            var recorridoIda = vm.unidadSeleccionda.recorridoIda;
            var recorridoVuelta = vm.unidadSeleccionda.recorridoVuelta;
            verParadas(recorridoIda, estilos.parada_ida);
            verParadas(recorridoVuelta, estilos.parada_vuelta);
        }

        vm.mostrarParadas = function(){
            if(!vm.lineaConRecorrido){
                $('#mod-no-recorrido').modal('show');
                return;
            }
            var recorridoIda = vm.unidadSeleccionda.recorridoIda;
            var recorridoVuelta = vm.unidadSeleccionda.recorridoVuelta;
            verParadas(recorridoIda, estilos.parada_ida);
            verParadas(recorridoVuelta, estilos.parada_vuelta);
            if(paradasMostradas){
                paradasMostradas = false;
                capaParadas.setVisible(paradasMostradas);
                vm.botonVerParadas = "Ver paradas";
            }else{
                paradasMostradas = true;
                capaParadas.setVisible(paradasMostradas);
                vm.botonVerParadas = "Ocultar paradas";
            }
        }

        // para ver/ocultar recorrido
        vm.toogleRecorrido = function(){
            if(!vm.lineaConRecorrido){
                $('#mod-no-recorrido').modal('show');
                return;
            }
            if(recorridoMostrado){
                recorridoMostrado = false;
                capaDibujo.setVisible(false);
                vm.botonVerRecorrido = "Ver recorrido";
            }
            else{
                recorridoMostrado = true;
                capaDibujo.setVisible(true);
                vm.botonVerRecorrido = "Ocultar recorrido";
            }
        }

        // muestra las paradas de un recorrido
        function verParadas(recorridoUnidad, estilo){
            var ptos_parada = recorridoUnidad.coordinates;

            // dibujamos los marcadores de las paradas
            for (let i = 0; i < ptos_parada.length; i++) {
                var coord = ptos_parada[i];
                var marcadorFeature = drawFeature.getMarcadorByStyle(coord, estilo);
                vectorSourceParadas.addFeature(marcadorFeature);
            }
        }

        // busca los estilos que se utilizaran para la creacion de componentes en el mapa
        function cargaEstilos(){
            estilos.recorrido = factoryStyle.recorridoUnidad();
            estilos.inicioRecorrido = factoryStyle.marcadorInicioRecorrido();
            estilos.finRecorrido = factoryStyle.marcadorFinRecorrido();
            estilos.pto_recorrido = factoryStyle.puntoRecorrido();
            estilos.parada_ida = factoryStyle.marcadorParadaIda();
            estilos.parada_vuelta = factoryStyle.marcadorParadaVuelta();
        }


        // ###########################################################################
        // ################################# EVENTOS #################################

        function verAnimacionRecorrido(datosUnidad) {
            // creamos una nueva capa auxiliar y ocultamos las demas
            var vectorSource = new ol.source.Vector();
            var capa = new ol.layer.Vector({
                source: vectorSource
            });

            // hacemos invisible todas las capas anteriores excepto las 2 1ras que
            // serian las capas que muestra el mapa y la del recorrido
            var i = 0;
            vm.map.getLayers().forEach(function(layer){
                if(i > 1){
                    layer.setVisible(false);
                }
                i++;
            });

            vm.map.addLayer(capa);

            // juntamos los recorridos como uno solo y hacemos la animacion          
            var recorridoCompleto, recorridoIda, recorridoVuelta;
            recorridoIda = datosUnidad.recorrido_ida.coordinates;
            recorridoVuelta = datosUnidad.recorrido_vuelta.coordinates;
            var recorridoCompleto, recorridoIda, recorridoVuelta;
            recorridoCompleto = recorridoIda.concat(recorridoVuelta);
            var puntosRecorrido = recorridoCompleto.length;
            var coordPunto, marcadorAux, marcador, i;
            i = 0;

            $interval(function(){
                if(i > 0){
                    marcadorAux = vectorSource.getFeatureById(i-1);
                    vectorSource.removeFeature(marcadorAux);
                }
                coordPunto = recorridoCompleto[i];
                marcador = drawFeature.getMarcadorByStyle(coordPunto, estilos.pto_recorrido);
                marcador.setId(i);
                vectorSource.addFeature(marcador);
                i++;
                // intentamos borrar el ultimo punto
                if(i == puntosRecorrido){
                    vectorSource.clear();
                }
            }, 60, puntosRecorrido);
        }

        // ###########################################################################
        // ################################# Serv REST ###############################

        function cargaUnidades() {
            dataServer.getUnidades()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.unidades = data;
                    console.log("Datos recuperados con EXITO! = UNIDADES");
                    console.log(vm.unidades);
                    inicializacionRecorridoUnidades();
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las UNIDADES");
                })
        }

        // recupera solo los recorridos de c/unidad y los almacena en un array
        function cargaRecorridoUnidad(idUnidad) {
            dataServer.getRecorridoById(idUnidad)
                .then(function (data) {
                    if(data == null){
                        alert("La unidad aun no dispone de un recorrido");
                        return;
                    }
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    // datosRecorridos = data;
                    console.log("Datos recuperados con EXITO! = RECORRIDO_BY_ID");
                    console.log(data);
                    actualizarRecorridos(data);
                    var datosUnidad = coordRecorridos[vm.unidadSeleccionda.nombre];
                    dibujarRecorrido(datosUnidad);
                    verAnimacionRecorrido(datosUnidad);
                    vm.lineaConRecorrido = true;
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar RECORRIDO_BY_ID");
                    vm.lineaConRecorrido = false;
                })
        }


        // ************************ Inicializacion de datos *****************************

        cargaUnidades();
        cargaEstilos();
        vm.map.addLayer(capaDibujo);
        vm.map.addLayer(capaParadas);

    } // fin Constructor

})()