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
    var varientList = [];
    var cartVarientList = null;
    vm.init = init;
    vm.productDetails = [];
    vm.imageArr = [];
    vm.addCart = addCart;
    vm.selectedVarients = [];
    vm.addProductCount = addProductCount;
    vm.productCount = 0;
    vm.getVarients = getVarients;
    var VarientCount = null; 
    var varientName = "";
    var inventoryList = null;
    var selectionStatus = null;


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

    function getVarients() {
      var value= null;    
      var data = vm.productDetails.varients.map((res) => { 
        if(res.value)
        return {
          varient : res.value.value
        }
      });
        
      _.forEach(data, function(val) {
        if(val == undefined) {
          selectionStatus = false;
          varientList = [];
        } else {
          varientList.push(val.varient) 
          selectionStatus = true;
        }

      })
        
     if(selectionStatus) {
        _.forEach(varientList, function(varient) {
          varientName = varientName + varient;
        })
        varientList = [];
        var promise = firebaseService.getInventoryVarient("inventory", productKey);
        promise.then(varientData, varientEmpty);
     }
    }

    function varientData(data) {
      inventoryList = data.stock;

    }

    function varientEmpty() {

    }

    function addProductCount(num) {
      if(varientName.length > 0) {
        if(vm.productCount >= 0) {
          vm.productCount = vm.productCount + num;
        } else {
          toaster.pop("error", "Error", "Not allowed" )
        }
      } else {
        toaster.pop("error", "Error", "Please select size and color");
      }
    } 

    function addCart() {
      var varientStatus = null;
     
      var data =  vm.productDetails.varients.map((res) => { 
        return {
          varient : res.value.value,
        } 
      });

      data = varientList.map((res) => {
        return value = res.varient 
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



      