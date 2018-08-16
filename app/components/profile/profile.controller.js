(function() {
    angular
        .module("userCart")
        .controller("profileController", profileController);

    profileController.$inject = ["$state", "$log", "toaster", "firebaseService", "$location"];

    function profileController($state, $log, toaster, firebaseService, $location) {
       
        var vm = this;
        vm.uid = $state.params.uid;
        vm.user = {};
        vm.userProfile = userProfile;

        function userProfile() {
            vm.user.uid = vm.uid;
            // firebase.firestore().collection("users").doc(vm.user.uid).set({
            firebase.database().ref().child('users').child(vm.uid).update({
                emailVerified : true,
                firstname : vm.user.firstname,
                lastname : vm.user.lastname,
                phoneno : vm.user.phoneno,
                dob : vm.user.dob.toString(),
            });
            $state.go("userCart.dashboard");
        }

    }
}) ();  

