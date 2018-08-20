(function() {
  "use strict"
  angular
    .module("userCart")
    .controller("productDetailsController", productDetailsController);

  productDetailsController.$inject = ["$scope", "$state", "firebaseService"];

  function productDetailsController($scope, $state, firebaseService) {

    var vm = this;
    vm.init = init;
    var productKey = null; 
    vm.productDetails = [];
    vm.imageArr = [];

    function init() {
      productKey = $state.params.key;
      getProductDetails();
    }
    
    function getProductDetails() {
      var promise = firebaseService.getLoginData("products", productKey);
      promise.then(successDetails, failureDetails);
    }

    function successDetails(data) {
      debugger
      vm.productDetails = data;
      vm.imageArr = data.image;
    }

    function failureDetails() {

    }


  }
})();



      