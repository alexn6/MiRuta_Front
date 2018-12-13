/* Ruteo general de la aplicacion */
(function () {
    'use strict';
    angular.module('routes')
        // a diferencia de los services, factories y controllers para hacer referencia a la funcion
        // encargada de hacer la configuracion no se exponene las '' al inicio (el primer Routing)

        .config(Routing, ['$routeProvider', '$locationProvider', '$windowProvider', 'path', Routing]);

    function Routing($routeProvider, $locationProvider, $windowProvider, path) {
        var $window = $windowProvider.$get(); // Se obtiene $window para poder usar location.
        // Se obtiene la ruta base (siempre descartando index.php si estuviera debido a que no es una carpeta valida).
        var base_route = $window.location.pathname.split('index.html')[0];

        // para evitar el cambio de / por %2F
        $locationProvider.hashPrefix('');

        ruteo();

        function ruteo() {
            $routeProvider
                .when('/login', {
                    templateUrl: base_route + path.LOGIN_VIEW
                })
                .when('/register', {
                    templateUrl: base_route + path.REGISTER_VIEW
                })
                .when('/admin', {
                    templateUrl: base_route + path.ADMIN_LOGIN_VIEW,
                })
                .when('/home', {
                    templateUrl: base_route + path.HOME_VIEW
                })
                .when('/recorrido', {
                    templateUrl: base_route + path.RECORRIDO_VIEW
                })
                .when('/transportes', {
                    templateUrl: base_route + path.TRANSPORTES_VIEW
                })
                .when('/ptoInteres', {
                    templateUrl: base_route + path.PTOINTERES_VIEW
                })
                .when('/adminHome', {
                    templateUrl: base_route + path.ADMIN_HOME_VIEW
                })
                .when('/adminRecorrido', {
                    // templateUrl: base_route + path.ADMIN_RECORRIDO_VIEW
                    templateUrl: base_route + path.ADMIN_RECORRIDO_VIEW_V1
                })
                // ************************************************************
                // *** para comparar con LA VISTA ANTERIOR (DESPUES BORRAR) ***
                // .when('/adminRecorridoOriginal', {
                //     // templateUrl: base_route + path.ADMIN_RECORRIDO_VIEW
                //     templateUrl: base_route + path.ADMIN_RECORRIDO_VIEW
                // })
                // ************************************************************
                .when('/adminTransporte', {
                    templateUrl: base_route + path.ADMIN_TRANSPORTE_VIEW
                })
                .when('/adminPtoInteres', {
                    templateUrl: base_route + path.ADMIN_PTOINTERES_VIEW
                })
                .when('/adminTipoPtoInteres', {
                    templateUrl: base_route + path.ADMIN_TIPO_PTOINTERES_VIEW
                })
                .when('/adminEmpresa', {
                    templateUrl: base_route + path.ADMIN_EMPRESA_VIEW
                })
                .otherwise({
                    redirectTo: '/home'
                });
        }
    }

})()