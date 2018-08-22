(function() {
  "use strict"
  angular
    .module("userCart")
    .controller("productDetailsController", productDetailsController);

  productDetailsController.$inject = ["$scope", "$state", "firebaseService", "$rootScope", "toaster"];

  function productDetailsController($scope, $state, firebaseService, $rootScope, toaster) {

    var vm = this;
    var productKey = null; 
    var userUid = null;
    var varientList = null;
    var cartVarientList = null;
    vm.init = init;
    vm.productDetails = [];
    vm.imageArr = [];
    vm.addCart = addCart;
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
      var count = 0;
      var varientStatus = null;
      var varientName = "";
      varientList =  vm.productDetails.varients.map((res) => { 
        return {
          name : res.name, 
          value : res.value
        } 
      });
      _.forEach(varientList, function(val) {
        if (count < varientList.length) {
          if (val.name && val.value == undefined) {
            varientStatus = false;
            varientName = varientName + " " + val.name;
            count ++;
          } else{
            varientStatus = true;
            count ++;
          }
        } 
      })

      if(varientStatus) {
        cartVarientList = varientList.map(function(obj) {
          var rObj = {};
          rObj[obj.name] = obj.value.value
          return rObj 
        })
        var currentUser = firebaseService.getCurrentUser();
        userUid = currentUser.uid;
        var promise = firebaseService.checkExistProd(userUid, productKey)
        promise.then(dataExists, dataEmpty);
        
      } else {
        toaster.pop("error", "Error", "Please select" + varientName)
      }
    }

    function dataExists(data) {
      debugger
      _.forEach(data, (val) => {
        var fireData = JSON.stringify(val.varients);
        var appData = JSON.stringify(cartVarientList);
        if(fireData == appData) {
          toaster.pop("info", "checkOut", "item Already Present");
        } else{
          dataEmpty();
        }
      })
    }

    function dataEmpty() {
      firebase.database().ref().child('users').child(userUid).child("cartlist").child(productKey).set({
        cartListStatus : true,
        varients : cartVarientList
      });
      var cartCount = 1;
      $rootScope.$broadcast("cart", cartCount);
      toaster.pop("info", "Added", "Go to cart for Checkout")
    }
  }
})();



      