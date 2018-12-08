(function () {
    'use strict';
    // se hace referencia al modulo mapModule ya creado (esto esta determinado por la falta de [])
    angular.module('drawingModule')
        .service('srvStyles', [
            'pathIcons',
            SrvStyles
        ]);

    function SrvStyles(icon){
        
        var service = {
            // ************** pto interes ****************
            marcadorCarga: marcadorCarga,
            marcadorTraslado: marcadorTraslado,
            // ************** recorrido ****************
            marcadorInicioRecorrido: marcadorInicioRecorrido,
            marcadorFinRecorrido: marcadorFinRecorrido,
            recorridoUnidad: recorridoUnidad,
            puntoRecorrido: puntoRecorrido,
            marcadorParadaIda: marcadorParadaIda,
            marcadorParadaVuelta: marcadorParadaVuelta
        };

        return service;

        // #############################################################################
        // ########################## FUNCIONES PUBLICAS ###############################

        function marcadorCarga(){
            var estilo = createStyleByIcon(icon.PUNTO_CARGA);
            return estilo;
        }

        function marcadorTraslado(){
            var estilo = createStyleByIcon(icon.PUNTO_TRASLADO);
            return estilo;
        }

        function marcadorInicioRecorrido(){
            var estilo = createStyleByIcon(icon.PUNTO_INICIO_RECORRIDO);
            return estilo;
        }

        function marcadorFinRecorrido(){
            var estilo = createStyleByIcon(icon.PUNTO_FIN_RECORRIDO);
            return estilo;
        }

        function recorridoUnidad(){
            var estilo = createStyleRoute();
            return estilo;
        }

        function puntoRecorrido(){
            var estilo = createStylePtoRecorrido();
            return estilo;
        }

        function marcadorParadaIda(){
            var estilo = createStyleByIcon(icon.PARADA_IDA);
            return estilo;
        }

        function marcadorParadaVuelta(){
            var estilo = createStyleByIcon(icon.PARADA_VUELTA);
            return estilo;
        }

        // #############################################################################
        // ########################## FUNCIONES PRIVADAS ###############################

        function createStyleByIcon(icon){
            var estilo = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: icon
                })
            });
            
            return estilo;
        }

        function createStyleRoute(){
            var estilo = new ol.style.Style({
                stroke: new ol.style.Stroke({
                //   width: 3.5, color: [40, 40, 40, 0.8]
                    //width: 3.5, color: [211, 145, 58, 0.8]
                    width: 3.5, color: [198, 119, 40, 0.7]
                })
            });
            
            return estilo;
        }

        function createStylePtoRecorrido(){
            var estilo = new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 6,
                  stroke: new ol.style.Stroke({
                    color: 'gray',
                    width: 2
                  }),
                  fill: new ol.style.Fill({
                    color: 'yellow'
                  })
                })
              });
            
            return estilo;
        }
    }

})()