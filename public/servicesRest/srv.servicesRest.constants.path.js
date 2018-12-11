(function () {
    'use strict';
    angular.module('servicesRestModule')
        .constant('path', {
            PRUEBA_USERS: 'http://localhost:8080/miruta/users',
            GET_TOKEN_AUTH: 'http://localhost:8080/login',
            // ###################### UNIDADES ######################
            ALL_UNIDADES: 'http://localhost:8080/miruta/unidadlinea',
            ALL_NAMES_UNIDADES: 'http://localhost:8080/miruta/unidadlinea/names',
            // SAVE_UNIDAD: 'http://localhost:8080/miruta/unitransportes/create',
            SAVE_UNIDAD: 'http://localhost:8080/miruta/unidadlinea/create',
            // UPDATE_UNIDAD: 'http://localhost:8080/miruta/unitransportes/update',
            UPDATE_UNIDAD: 'http://localhost:8080/miruta/unidadlinea/update',
            // DELETE_UNIDAD: 'http://localhost:8080/miruta/unitransportes/delete',
            DELETE_UNIDAD: 'http://localhost:8080/miruta/unidadlinea/delete',
            // ALL_RECORRIDOS: 'http://localhost:8080/miruta/recorridos',
            // SAVE_RECORRIDO: 'http://localhost:8080/miruta/recorridos/create',
            // ###################### RECORRIDO ######################
            SET_RECORRIDO: 'http://localhost:8080/miruta/unidadlinea/setRecorrido',
            DELETE_RECORRIDO: 'http://localhost:8080/miruta/unidadlinea/deleteRecorrido',
            RECORRIDO: 'http://localhost:8080/miruta/unidadlinea/recorrido',
            // ###################### EMPRESA ######################
            ALL_EMPRESAS: 'http://localhost:8080/miruta/company',
            // ###################### USUARIO ######################
            SAVE_USUARIO: 'http://localhost:8080/miruta/users/create',
            // ###################### TIPO INTERES ######################
            ALL_TIPO_INTERES: 'http://localhost:8080/miruta/tipoInteres',
            SAVE_TIPO_INTERES: 'http://localhost:8080/miruta/tipoInteres/create',
            UPDATE_TIPO_INTERES: 'http://localhost:8080/miruta/tipoInteres/update',
            DELETE_TIPO_INTERES: 'http://localhost:8080/miruta/tipoInteres/delete',
            NAMES_TIPO_INTERES: 'http://localhost:8080/miruta/tipoInteres/names',
            // ###################### PUNTO INTERES ######################
            SAVE_PTO_INETERES: 'http://localhost:8080/miruta/ptoInteres/create',
            GET_PUNTOS_BY_TIPO: 'http://localhost:8080/miruta/ptoInteres/byNameType',
            UPDATE_PTO_INTERES: 'http://localhost:8080/miruta/ptoInteres/update',
            DELETE_PTO_INTERES: 'http://localhost:8080/miruta/ptoInteres/detete',
            // ###################### ROUTING ######################
            GET_ADREESS: 'http://localhost:8080/miruta/routing/addressCoord'
        });
})()