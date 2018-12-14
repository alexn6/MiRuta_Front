// Responsabilidad : Permitir ver la ponderacion de los recorridos
// TODO sin funcionalidad debido a que no se creo el servicio en el backend
(function () {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('ptoInteresController', [
            '$scope',
            'creatorMap',
            'dataServer',
            'srvStyles',
            'srvDrawFeature',
            PtoInteresController
        ]);

    function PtoInteresController(vm, creatorMap, dataServer, styles, drawFeature) {

        // ********************************** VARIABLES PUBLICAS ************************
        // generamos un mapa de entrada
        vm.map = creatorMap.getMap();

        // ************* model vista ***************
        vm.nombreTipoSeleccionado;
        vm.nombresTiposInteres = [];
        vm.ptosInteresByTipo = [];

        // ************* estilos marcadores ***************
        var estilosMarcadores = [];

        // *************** capa de dibujo ********************
        var vectorSourceDibujo = new ol.source.Vector();
        var capaDibujo = new ol.layer.Vector({
            source: vectorSourceDibujo
        });

        // ###########################################################################
        // ######################### FUNCIONES VISTA  ###############################

        // recupera los puntos del tipo seleccionado
        vm.buscarPuntos = function(){
            vectorSourceDibujo.clear();
            if(vm.nombreTipoSeleccionado == null){
                alert("No hay tipo seleccionado");
                return;
            }
            getTipoPuntos();
        }

        function getTipoPuntos(){
            dataServer.getPtoInteresByType(vm.nombreTipoSeleccionado.nombre)
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

        // cargamos de entrada los iconos que vamos a usar en la vista
        function cargarIconos(){
            // iconos para mostrar puntos
            estilosMarcadores["carga"] = styles.marcadorCarga();
            estilosMarcadores["traslado"] = styles.marcadorTraslado();
        }

        // limpia el mapa y dibuja el marcador correspondiente a las coord dadas
        function dibujarMarcadorUnico(coordenadas, estilo, sourceCapa) {
            sourceCapa.clear();
            var marcadorPtoInteres = drawFeature.getMarcadorByStyle(coordenadas, estilo);
            // le asignamos un id para poder recuperarlo mas facil
            sourceCapa.addFeature(marcadorPtoInteres);
        }

        // ###########################################################################
        // ########################### PAGINACION ####################################
        vm.ptosInteresByTipo = [];
        vm.pagActual;
        vm.pagTotal;
        vm.cantForPage = 6;
        vm.idPuntoFilaSeleccionada;

        // cuando se elije un punto de la lista
        vm.setPuntoSelected = function(puntoSeleccionado){
            vm.idPuntoFilaSeleccionada = puntoSeleccionado.id;
            var datosPuntoSeleccionado = puntoSeleccionado;
            var estilo = estilosMarcadores[datosPuntoSeleccionado.tipointeres.nombre];
            dibujarMarcadorUnico(datosPuntoSeleccionado.coordenada.coordinates, estilo, vectorSourceDibujo);
            vm.map.getView().setCenter(datosPuntoSeleccionado.coordenada.coordinates);
        }

        function updateDatosTabla(){
            vm.pagActual = 1;
            vm.pagTotal = Math.trunc(vm.ptosInteresByTipo.length/vm.cantForPage) + 1;
        }

        vm.pagAnterior = function(){
            if(vm.pagActual > 1){
                vm.pagActual--;
                // console.log('Pagina actual PREV: ' + vm.pagActual);
                return;
            }
            // console.log("No hay paginas para retroceder");
        }

        vm.pagSiguiente = function(){
            if(vm.pagActual < vm.pagTotal){
                vm.pagActual++;
                // console.log('Pagina actual NEXT: ' + vm.pagActual);
                return;
            }
            // console.log("No hay paginas para avanzar");
        }

        // ###########################################################################
        // ###################### SOPORTE FUNCIONES SERVIDOR  ###############################

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
        // ############################ CONEXION SERVIDOR ###############################

        function cargaTiposPuntosInteres() {
            dataServer.getTipoPtoInteres()
                .then(function (data) {
                    // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                    vm.nombresTiposInteres = data;
                    console.log("Datos recuperados con EXITO! = TIPOS_INTERES");
                    console.log(vm.nombresTiposInteres);
                    agregarTipo(vm.nombresTiposInteres);
                })
                .catch(function (err) {
                    console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las TIPOS_INTERES");
                })
        }

        // ###########################################################################
        // ###################### INICIALIZACION DE DATOS ##########################
        
        cargaTiposPuntosInteres();
        cargarIconos();
        vm.map.addLayer(capaDibujo);

    } // fin Constructor

})()