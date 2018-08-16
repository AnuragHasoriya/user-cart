(function() {
    var app = angular
        .module("userCart", 
        [ "ui.router",
        "toaster",
        "firebase", 
        "dataGrid", 
        "pagination",
        "ngAnimate",
        "oc.lazyLoad"]);

    app.config(configMain)
        .run(runBlock);

    configMain.$inject = ["$urlRouterProvider", "$ocLazyLoadProvider"];

    function configMain($urlRouterProvider, $ocLazyLoadProvider) {
        // $ocLazyLoadProvider.config({
        //     'debug': true, // For debugging 'true/false'
        //     'events': true, // For Event 'true/false'
        //     'modules': [{ // Set modules initially
        //         name : 'main', // State1 module
        //         files: ['../app/js/main.js']
        //     }]
        // });
        $urlRouterProvider.otherwise("/login");

    }
    
   
    
    runBlock.$inject = ["$state", "$rootScope"];
    
    function runBlock($state, $rootScope) {
    
    };

})();
