(function() {       
    "use strict"
    angular
        .module("userCart")
        .controller("resetController", resetController);

        resetController.$inject = ["$state", "toaster", "$timeout", "firebaseService"];

        function resetController($state, toaster, $timeout, firebaseService) {
            var vm = this;
            vm.user = {};
            vm.resetUser = resetUser;

            function resetUser() {
            
            firebaseService.resetPassword(vm.user.email)
                .then(firebaseServiceSuccess)
                .catch(firebaseServiceFail);
            }

            function firebaseServiceSuccess(data) {
                toaster.pop("info", "Email", "Check Email");
                $state.go("login");
            }

            function firebaseServiceFail() {

            }


        }
        
    }
)();