(function() {
  "use strict"
  angular
    .module("userCart")
    .controller("productDetailsController", productDetailsController);

  productDetailsController.$inject = ["$scope", "$state", "firebaseService", "$rootScope", "toaster"];

  function productDetailsController($scope, $state, firebaseService, $rootScope, toaster) {

    var vm = this;
    vm.init = init;
    var productKey = null; 
    vm.productDetails = [];
    vm.imageArr = [];
    vm.addCart = addCart;
    vm.getVarients = getVarients;
    vm.selectedVarients = [];

    function init() {
      productKey = $state.params.key;
      getProductDetails();
    }
    
    function getProductDetails() {
      var promise = firebaseService.getLoginData("products", productKey);
      promise.then(successDetails, failureDetails);
    }

    function successDetails(data) {
      vm.productDetails = data;
      vm.imageArr = data.image;
    }

    function failureDetails() {

    }

    function addCart() {
      var count = 1;
      // $rootScope.emit("cart", count);
      var varientList =  vm.productDetails.varients.map((res) => { 
        return {
          name: res.name, 
          value: res.selectedVarient.value
        } 
      });

      if(varientList.name && varientList.value == null) {
        toaster.pop("error","Error", "Please select size and color")
      } else {
        toaster.pop("info","Success", "cdcsc")
      }

    }

    function getVarients(data) {
      // vm.selectedVarients.push(data);
      console.log(vm.selectedVarients);
    }

  }
})();



      