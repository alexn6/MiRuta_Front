(function () {
    'use strict';
    angular.module('routes')
        .constant('path', {
            LOGIN_VIEW: '/public/appUser/login_register/loginView.html',
            REGISTER_VIEW: '/public/appUser/login_register/registerView.html',
            HOME_VIEW: '/public/appUser/home/homeView.html',
            RECORRIDO_VIEW: '/public/appUser/recorrido/recorridoView.html',
            TRANSPORTES_VIEW: '/public/appUser/transportes/transportesView.html',
            PTOINTERES_VIEW: '/public/appUser/ptoInteres/ptoInteresView.html',
            ADMIN_LOGIN_VIEW: '/public/admin/partial/adminLoginView.html',
            ADMIN_HOME_VIEW: '/public/admin/partial/adminHomeView.html',
            ADMIN_RECORRIDO_VIEW: '/public/admin/partial/adminRecorridoView.html',
            ADMIN_RECORRIDO_VIEW_V1: '/public/admin/partial/adminRecorridoV1View.html',
            ADMIN_TRANSPORTE_VIEW: '/public/admin/partial/adminTransportesView.html',
            ADMIN_PTOINTERES_VIEW: '/public/admin/partial/adminPtoInteresView.html',
            ADMIN_TIPO_PTOINTERES_VIEW: '/public/admin/partial/adminTipoPtoInteresView.html',
            ADMIN_EMPRESA_VIEW: '/public/admin/partial/adminEmpresasView.html'
        });
})()