(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("cartController", cartController);

      cartController.$inject = ["$scope", "$state", "firebaseService"];

    function cartController($scope, $state, firebaseService) {

        var vm = this;
       

    } 
})();

