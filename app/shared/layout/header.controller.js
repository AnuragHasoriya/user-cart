(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("headerController", headerController);

      headerController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster", "$rootScope"];

    function headerController($scope, $state, firebaseService, timeout, toaster, $rootScope) {

        var vm = this;
        vm.cart = cart;
        vm.wishList = wishList;
        vm.getShopDetails = getShopDetails; 
        vm.wishListCount = null;
        vm.cartCount = null;
        var userUid = null;
        vm.dashboard = dashboard;

        vm.logOut = logOut;

        function logOut() {
            firebaseService.logOut()
                .then(logOutSuccess)
                .catch(logOutFail)
        }

        function logOutSuccess() {
            
            console.log(currentUser);
            $state.go("login");
        }

        function logOutFail(error) {
            toaster.pop("error", "Error", error)
        }

        function cart() {
            $state.go("userCart.cart")
        }

        function wishList() {
            $state.go();
        }

        function getShopDetails() {
            // userUid = $state.params.currentId;
            firebase.auth().onAuthStateChanged(function(currentUser){
                //var currentUser = firebaseService.getCurrentUser();
                if(currentUser) {
                    userUid = currentUser.uid;
                    var promise = firebaseService.getWishList(userUid);
                    promise.then(detailsWishList, noWishList);
                    getCartDetails();
                }
            })
        }

        function detailsWishList(data) {
            vm.wishListCount = data.length;
        }

        function noWishList() {
            vm.wishListCount = 0;
        }

        function getCartDetails() {
            var promise = firebaseService.getCartList(userUid);
            promise.then(cartList, noCartList)
        }

        function cartList(data) {
            vm.cartCount = data.length;
        }

        function noCartList() {
            vm.cartCount = 0;
        }

        function dashboard() {
            $state.go("userCart.dashboard");
        }
      
        $scope.$on("cart", function(event, data) {
            vm.cartCount += data;
        })

        $scope.$on("wish", function(event, data) {
            vm.wishListCount += data;
        })

    } 
})();
    
