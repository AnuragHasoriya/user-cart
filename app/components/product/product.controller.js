(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("productController", productController);

    productController.$inject = ["$scope", "$state", "firebaseService"];

    function productController($scope, $state, firebaseService) {

        var vm = this;

        vm.init = init;

        function init() {
            // vm.productTableData = {
            //     data: [], 
            // };
            vm.productTableData =[]
            getProductData();
        }

        function getProductData() {
            // vm.productTableData.data = [];
            var promise = firebaseService.getData("products");
            promise.then(successGetData, faliureGetData)
        }

        function successGetData(data) {
            var pdata = []
            _.forEach(data, function(value) {
                // var imgData = _.map(value.image, function(obj){
                //     value.imageName = obj.name,
                //     value.imageUrl = obj.url
                //     return value
                // })
                _.forEach(value.image, function(img){
                    value.imageName = img.name,
                    value.imageUrl = img.url
                })
                // vm.productTableData.data.push(value)  
                vm.productTableData.push(value);
            })
           console.log(vm.productTableData )

        }

        function faliureGetData(message){
            toaster.pop("error", "Error", message);
        }
    
  } 
})();



      