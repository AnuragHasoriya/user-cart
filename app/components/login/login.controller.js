(function() {       
    "use strict"
    angular
        .module("userCart")
        .controller("loginController", loginController);

        loginController.$inject = ["$state", "toaster", "$timeout", "firebaseService"];

        function loginController($state, toaster, $timeout, firebaseService) {
            var vm = this;
            vm.user = {};

            // vm.jumpToRegistration = function() {
            //     $state.go("register")
            // }

            vm.loginUser = function() {
            
                firebaseService.signIn(vm.user.email, vm.user.password)
                    .then(firebaseServiceSuccess)
                    .catch(firebaseServiceFail);
            }
        
            function firebaseServiceSuccess() {
                var currentId = firebaseService.getCurrentUser().uid;
                var promise = firebaseService.getLoginData("users", currentId)
                promise.then(resolve, reject);
                
                function resolve(data) {
                    var emailVerified = data.emailVerified;
                    if(emailVerified) {
                        toaster.pop("info", "LoggedIn!!", "Login Successfull Welcome!!");
                        $timeout(function() {
                            $state.go("userCart.dashboard", {currentId});
                        }, 1000);
                    } else {
                        $timeout(function() {
                            toaster.pop("error", "Error", "Please complete your profile");
                        },10);
                    }
                }
                
                function reject() {
                    toaster.pop("error", "Error!", "data not found");
                }
                
            }

            function firebaseServiceFail(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == "auth/wrong-password") {
                    $timeout(function() {
                        toaster.pop("error", "Error", errorMessage);
                    },10);
                } else {
                    $timeout(function() {
                        toaster.pop("error", "Error", errorMessage);
                    }, 10);
                }
            }

        }
}) ();