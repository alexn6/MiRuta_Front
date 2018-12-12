// Responsabilidad : Realizar las peticiones HTTP al servidor y brindar los resultados a los controladores
(function () {
    'use strict';
    angular.module('servicesRestModule')
        .factory('dataServer', ['$http', '$q', 'path', DataServer]);

    function DataServer($http, $q, path) {
        var service = {
            // prueba
            getPrueba: getPrueba,
            getTokenAuth: getTokenAuth,
            // UNIDADES TRANSPORTES
            getNombreUnidades: getNombreUnidades,
            getUnidades: getUnidades,
            saveUnidad: saveUnidad,
            updateUnidad: updateUnidad,
            deleteUnidad: deleteUnidad,
            // RECORRIDOS
            getRecorridos: getRecorridos,
            getRecorridoById: getRecorridoById,
            setRecorrido: setRecorrido,
            deleteRecorrido: deleteRecorrido,
            // EMPRESAS
            saveEmpresa: saveEmpresa,
            updateEmpresa: updateEmpresa,
            deleteEmpresa: deleteEmpresa,
            getEmpresas: getEmpresas,
            // USUARIOS
            saveUsuario: saveUsuario,
            // PUNTO DE INTERES
            savePtoInteres: savePtoInteres,
            updatePtoInteres: updatePtoInteres,
            deletePtoInteres: deletePtoInteres,
            getPtoInteresByType: getPtoInteresByType,
            // TIPO PUNTO DE INTERES
            getTipoPtoInteres: getTipoPtoInteres,
            getNamesTipoInteres: getNamesTipoInteres,
            saveTipoPtoInteres: saveTipoPtoInteres,
            updateTipoPtoInteres: updateTipoPtoInteres,
            deleteTipoPtoInteres: deleteTipoPtoInteres,
            // ROUTING
            getAdreessFromCoord: getAdreessFromCoord
        };
        return service;

        // se buscan los datos del servidor
        function getPrueba() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.PRUEBA_USERS
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log('Cant de USUARIOS creados: ' + res.data.length);
                console.log('Datos de los USUARIOS: ' + (res.data)[0]);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };

        // vamos en busca del token de autentificacion
        function getTokenAuth(dataUser) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.GET_TOKEN_AUTH,
                data: dataUser
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };


        // ******************** UNIDADES DE TRANSPORTE *************************
        // *********************************************************************
        function getNombreUnidades() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.ALL_NAMES_UNIDADES
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );
            
            return promise;
        }

        function getUnidades(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.ALL_UNIDADES
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function saveUnidad(nuevaUnidad){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SAVE_UNIDAD,
                data: nuevaUnidad
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }
         
        function updateUnidad(unidad){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.UPDATE_UNIDAD,
                data: unidad
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function deleteUnidad(idUnidad){
            var defered = $q.defer();
            var promise = defered.promise;
            
            $http({
                method: 'POST',
                url: path.DELETE_UNIDAD + "?id=" + idUnidad
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // **************************** RECORRIDOS *****************************
        // *********************************************************************
        function getRecorridos() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.RECORRIDO
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function getRecorridoById(idUnidad) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.RECORRIDO + "?id=" + idUnidad
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function setRecorrido(recorrido) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SET_RECORRIDO,
                data: recorrido
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function deleteRecorrido(nombreUnidad) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.DELETE_RECORRIDO,
                data: nombreUnidad
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // ##############################################################
        // ######################## EMPRESA #############################

        function saveEmpresa(empresa){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SAVE_EMPRESA,
                data: empresa
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function updateEmpresa(empresa){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.UPDATE_EMPRESA,
                data: empresa
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function deleteEmpresa(idEmpresa){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.DELETE_EMPRESA + "?id=" + idEmpresa
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }
        
        function getEmpresas() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.ALL_EMPRESAS
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // ****************************** USUARIOS *****************************
        // *********************************************************************
        
        function saveUsuario(usuario) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SAVE_USUARIO,
                data: usuario
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // ****************************** PUNTO INTERES *************************
        // *********************************************************************
        function savePtoInteres(punto){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SAVE_PTO_INETERES,
                data: punto
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function updatePtoInteres(punto){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.UPDATE_PTO_INTERES,
                data: punto
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function deletePtoInteres(idPunto){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.DELETE_PTO_INTERES + "?id=" + idPunto
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function getPtoInteresByType(tipo){
            var defered = $q.defer();
            var promise = defered.promise;
            
            $http({
                method: 'GET',
                url: path.GET_PUNTOS_BY_TIPO + "?tipo=" + tipo
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // ****************************** TIPO PUNTO INTERES *************************
        // *********************************************************************

        function getTipoPtoInteres(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.ALL_TIPO_INTERES
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function saveTipoPtoInteres(tipo_interes){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.SAVE_TIPO_INTERES,
                data: tipo_interes
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function updateTipoPtoInteres(tipo_interes){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.UPDATE_TIPO_INTERES,
                data: tipo_interes
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function deleteTipoPtoInteres(idTipoInteres){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.DELETE_TIPO_INTERES + "?id=" + idTipoInteres
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        function getNamesTipoInteres(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.NAMES_TIPO_INTERES
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }

        // ######################## ROUTING ########################
        // ##############################################################

        function getAdreessFromCoord(lon, lat){
            var defered = $q.defer();
            var promise = defered.promise;
            
            $http({
                method: 'GET',
                url: path.GET_ADREESS + "?lon=" +lon+ "&lat=" +lat
            }).then(function successCallback(res) {
                defered.resolve(res.data);
            },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        }
    }
})()
