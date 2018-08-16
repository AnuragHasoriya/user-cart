(function() {
    "use strict"
    angular
        .module("userCart")
            .controller("emailVerifyController", emailVerifyController);

        emailVerifyController.$inject = ["$scope", "$state", "firebaseService", "toaster", "$stateParams", "$timeout"];

        function emailVerifyController($scope, $state, firebaseService, toaster, $stateParams, $timeout) {

            var vm = this;
            vm.doVerify = doVerify;

            function doVerify() {
              var actionCode = $stateParams.oobCode
              var mode = $stateParams.mode;
              if(mode == "resetPassword") {
                firebase.auth().verifyPasswordResetCode(actionCode).then(function(email) {
                  console.log(email);
                  $state.go("newPassword", {emailId : email, code : actionCode })
                })
              } else {
                firebase.auth().applyActionCode(actionCode)
                  .then(function(data) {
                    console.log(data)
                    console.log("user id = " + firebaseService.getCurrentUser().uid)
                    // firebase.firestore().collection("users").doc(firebaseService.getCurrentUser().uid)
                    firebase.database().ref().child('users')
                      .child(firebaseService.getCurrentUser().uid)
                      .update({ emailVerified: false });
                    toaster.success('Verification happened', 'Success!');
                    $state.go('profile', {uid: firebaseService.getCurrentUser().uid});
                  })
                  .catch(function(error) {
                    $scope.error = error.message;
                    toaster.error(error.message, error.reason, { timeOut: 0 });
                  })
              }

            };
        } 
})();