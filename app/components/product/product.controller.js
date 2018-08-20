(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("productController", productController);

    productController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster"];

    function productController($scope, $state, firebaseService, timeout, toaster) {

        var vm = this;
        vm.addToWish = addToWish;
        vm.removeWish = removeWish;
        var wishList = []; 
        var currentUser = null;
        var userUid = null;

        vm.init = init;

        function init() {
            vm.productTableData =[];
            vm.categoryTableData = [];
            vm.getProductData = getProductData;
            getCategory();
        }

        function getCategory() {
            var promise = firebaseService.getData("category");
            promise.then(successGetData, faliureGetData)
        }

        function successGetData(data) {
            vm.categoryTableData = data;
            getProductData();
        }

        function faliureGetData(message) {
            toaster.pop("error", "Error", message);
        }

        function getProductData(category) {
            vm.productTableData = [];
            currentUser = firebaseService.getCurrentUser();
            userUid = currentUser.uid;
            var promise = firebaseService.getWishList(userUid);
            promise.then(detailsWishList, noWishList)
            if(category == null) {
                var promise = firebaseService.getData("products");
                promise.then(successPData, faliurePData)
            } else {
                var categoryKey = category.key
                var promise = firebaseService.getProductCatData(categoryKey);
                promise.then(successPData, faliurePData)
            }
           
            
        }

        function successPData(data) {
            var pdata = [];
           
            _.forEach(data, function(value) {
                value.wishList = setWishStatus(value.key);
                _.forEach(value.image, function(img){
                    value.imageName = img.name,
                    value.imageUrl = img.url
                    
                })
                // vm.productTableData.data.push(value)  
                vm.productTableData.push(value);
                console.log(vm.productTableData)
                
            })
        }

        function setWishStatus(key) {
            for(var i = 0; i< wishList.length; i++) {
                if(wishList[i].key == key) {
                    return true;
                }    
            }
        }

        function detailsWishList(data) {
            wishList = data;
        }

        function noWishList() {

        }

        function faliurePData(message){
            toaster.pop("error", "Error", message);
        }

        function addToWish(product) {
            var currentUser = firebaseService.getCurrentUser(); 
            var userUid = currentUser.uid;
            var productKey = product.key 
            firebase.database().ref().child('users').child(userUid).child("wishlist").child(productKey).set({
                productStatus : true
            })
            _.forEach(vm.productTableData, function(value) {
                if(product.key == value.key) {
                    value.wishList = true;
                }
            })
            console.log(vm.productTableData);
        }

        function removeWish(product) {
            var firebaseRef = firebase.database().ref();
            var deleteRef = firebaseRef.child('users').child(userUid).child("wishlist").child(product.key);
            deleteRef.remove()
                .then(successDelete, failureDelete);

            function successDelete() {
                _.forEach(vm.productTableData, function(value) {
                    if(product.key == value.key) {
                        value.wishList = undefined;
                    }
                });
                timeout(function() {
                    vm.productTableData
                },10)
            }
        
            function failureDelete() {

            }
        }
    } 
})();



      