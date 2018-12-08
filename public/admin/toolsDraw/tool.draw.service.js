(function () {
    'use strict';
    // se hace referencia al modulo mapModule ya creado (esto esta determinado por la falta de [])
    angular.module('drawingModule')
        .service('srvComponents', [
            '$http',
            '$q',
            SrvComponents
        ]);

    function SrvComponents($http, $q){

        // ############################## VARIABLES PRIVADAS ##############################
        // ################################################################################

        var url = {
            OSRM_POINT_NEREAST: 'http://localhost:8080/miruta/routing/nearestPoint',
            OSRM_ADDRESs_POINT: 'http://localhost:8080/miruta/routing/addressPoint',
            OSRM_ROUTE: 'http://localhost:8080/miruta/routing/route',
            OSRM_ROUTE_TRANSPORT: 'http://localhost:8080/miruta/routing/routeTransport',
            ICON_PARADA_IDA_NORMAL: '../MiRuta_2017/public/src/img/parada-ida.png',
            ICON_PARADA_IDA_INICIO: '../MiRuta_2017/public/src/img/parada-ida-inicio.png',
            ICON_PARADA_IDA_FIN: '../MiRuta_2017/public/src/img/parada-ida-fin.png',
            ICON_PARADA_VUELTA_NORMAL: '../MiRuta_2017/public/src/img/parada-vuelta.png',
            ICON_PARADA_VUELTA_INICIO: '../MiRuta_2017/public/src/img/parada-vuelta-inicio.png',
            ICON_PARADA_VUELTA_FIN: '../MiRuta_2017/public/src/img/parada-vuelta-fin.png'
        }

        var estilos = {
            recorrido_ida: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 3, color: [48, 148, 57, 0.8]
                })
            }),
            recorrido_vuelta: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 3, color: [23, 130, 174, 0.8]
                })
            }),
            parada_ida_normal: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_IDA_NORMAL
                })
            }),
            parada_ida_inicio: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_IDA_INICIO
                })
            }),
            parada_ida_fin: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_IDA_FIN
                })
            }),
            parada_vuelta_normal: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_VUELTA_NORMAL
                })
            }),
            parada_vuelta_inicio: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_VUELTA_INICIO
                })
            }),
            parada_vuelta_fin: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: url.ICON_PARADA_VUELTA_FIN
                })
            })
        };

        var service = {
            // ************** pto interes ****************
            getMarcadorPtoInteres: getMarcadorPtoInteres,
            // paradas
            getMarcadorParadaIda: getMarcadorParadaIda,
            getMarcadorParadaVuelta: getMarcadorParadaVuelta,
            getFeatureRoute: getFeatureRoute,
            getPointNearest: getPointNearest,
            getAddressPoint: getAddressPoint,
            getRoute: getRoute,
            getRouteTransport: getRouteTransport,
            setStyleParadaFin: setStyleParadaFin,
            setStyleParadaNormal: setStyleParadaNormal,
            setStyleParadaFinVuelta: setStyleParadaFinVuelta,
            setStyleParadaNormalVuelta: setStyleParadaNormalVuelta,
            setStyleRecorridoIda: setStyleRecorridoIda,
            setStyleRecorridoVuelta: setStyleRecorridoVuelta
        };

        return service;

        

        // #############################################################################

        // #############################################################################
        // ########################## FUNCIONES PRIVADAS ###############################

        // #############################################################################

        // #############################################################################
        // ########################## FUNCIONES PUBLICAS ###############################

        function getMarcadorPtoInteres(coord) {
            var marcador = new ol.Feature({
                geometry: new ol.geom.Point([coord[0], coord[1]])
            });

            return marcador;
        }

        function getMarcadorParadaIda(coord) {
            var marcador = new ol.Feature({
                geometry: new ol.geom.Point([coord[0], coord[1]])
            });

            marcador.setStyle(estilos.parada_ida_inicio);

            return marcador;
        }

        function setStyleParadaNormal(marcador) {
            marcador.setStyle(estilos.parada_ida_normal);
        }

        function setStyleParadaFin(marcador) {
            marcador.setStyle(estilos.parada_ida_fin);
        }

        function getMarcadorParadaVuelta(coord) {
            var marcador = new ol.Feature({
                geometry: new ol.geom.Point([coord[0], coord[1]])
            });

            marcador.setStyle(estilos.parada_vuelta_inicio);

            return marcador;
        }
        function setStyleParadaNormalVuelta(marcador) {
            marcador.setStyle(estilos.parada_vuelta_normal);
        }

        function setStyleParadaFinVuelta(marcador) {
            marcador.setStyle(estilos.parada_vuelta_fin);
        }

        function getFeatureRoute(coordinates) {
            var finalRoute = new ol.Feature({
                geometry: new ol.geom.LineString(coordinates)
            });
            finalRoute.setStyle(estilos.route);

            return finalRoute;

        }

        function setStyleRecorridoIda(route) {
            route.setStyle(estilos.recorrido_ida);
        }

        function setStyleRecorridoVuelta(route) {
            route.setStyle(estilos.recorrido_vuelta);
        }

        // obtiene las coordenadas del punto mas cercano al recibido q se encuentre en la calle
        // esto para no visualizar puntos sobre edificios y lugares publicos (plazas,
        // bancos, escuelas, etc..)
        function getPointNearest(coord) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: url.OSRM_POINT_NEREAST +"?lon="+ coord[0] +"&lat=" + coord[1]
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log("Promesa");
                console.log(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function getAddressPoint(coord){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: url.OSRM_ADDRESs_POINT + "?lon=" + coord[0] + "&lat=" + coord[1]
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log("Promesa Address");
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function getRoute(puntos) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: url.OSRM_ROUTE,
                data: puntos
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log("Promesa ruta");
                console.log(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err);
                    console.log("error en la promesa");
                    console.log(err);
                }
            );

            return promise;
        }

        function getRouteTransport(datos) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: url.OSRM_ROUTE_TRANSPORT,
                data: datos
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log("Promesa ruta");
                console.log(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err);
                    console.log("error en la promesa");
                    console.log(err);
                }
            );

            return promise;
        }
        
        // #############################################################################

    }

})()