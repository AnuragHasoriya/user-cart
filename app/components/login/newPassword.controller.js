(function() {
    angular
        .module("userCart")
        .controller("newPasswordController", newPasswordController);

    newPasswordController.$inject = ["$state", "$log", "toaster", "firebaseService", "$location"];

    function newPasswordController($state, $log, toaster, firebaseService, $location) {
       
        var vm = this;
        var email = $state.params.emailId;
        var code = $state.params.code;
        vm.user = {};
        vm.user.email = email;
        vm.newPasswordUser = newPasswordUser;

        function newPasswordUser() {
            var newPassword = vm.user.password
            firebase.auth().confirmPasswordReset(code, newPassword).then(function(resp) {
                console.log(resp);
                toaster.pop("info", "Success", "Password Changed")
                $state.go("login")
            })
        }

        
    }
})()