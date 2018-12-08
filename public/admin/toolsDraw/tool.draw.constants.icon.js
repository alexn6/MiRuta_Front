(function () {
    'use strict';
    angular.module('drawingModule')
        .constant('pathIcons', {
            // ###################### PTO INTERES(cliente web) ######################
            PUNTO_CARGA: '../MiRuta_2017/public/src/img/carga.png',
            PUNTO_TRASLADO: '../MiRuta_2017/public/src/img/traslado.png',
            // ###################### RECORRIDO(cliente web) ######################
            PUNTO_INICIO_RECORRIDO: '../MiRuta_2017/public/src/img/inicio-recorrido.png',
            PUNTO_FIN_RECORRIDO: '../MiRuta_2017/public/src/img/fin-recorrido.png',
            // ###################### PARADAS(cliente web) ######################
            PARADA_IDA: '../MiRuta_2017/public/src/img/parada-ida.png',
            PARADA_VUELTA: '../MiRuta_2017/public/src/img/parada-vuelta.png'
        });
})()