(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("cartController", cartController);

      cartController.$inject = ["$scope", "$state", "firebaseService"];

    function cartController($scope, $state, firebaseService) {

        var vm = this;
        vm.init = init;
        var userUid = null;
        vm.productList = [];

        function init() {
            firebase.auth().onAuthStateChanged(function(currentUser) {
                if(currentUser) {
                    userUid = currentUser.uid;
                    var promise = firebaseService.getCartList(userUid);
                    promise.then(cartList, noCartList)
                }
            })
        }

        function cartList(data) {
            _.forEach(data, function(value) {
                var productKey = value.key;
                var promise = firebaseService.getProductData(productKey, "products");
                    promise.then(productData, productError)
            })
        }

        function productData(data) {
            vm.productList.push(data);
            console.log(vm.productList);
        }

        function productError() {

        } 

        function noCartList() {

        }
        

    } 
})();

