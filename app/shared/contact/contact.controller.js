(function() {
    "use strict"
    angular
      .module("userCart")
      .controller("contactController", contactController);

      contactController.$inject = ["$scope", "$state", "firebaseService"];

    function contactController($scope, $state, firebaseService) {

        var vm = this;
        vm.sendMail = sendMail;
        vm.query = null;

        function sendMail() {

            var currentUser = firebaseService.getCurrentUser()
                
            
           
            var template_params = {
                "reply_to" : currentUser.email,
                "from_name" : "",
                "to_name" : "Admin",
                "message_html" : vm.query
            }
            
            var service_id = "default_service";
            var template_id = "template_kP2K3Usk";
            emailjs.send(service_id,template_id,template_params)
                .then(function(){ 
                    toaster.pop("info","Sent!","Mail sent");
                }, function(err) {
                    toaster.pop("error", "!error", "Send email failed!\r\n Response:\n " + JSON.stringify(err) );
                });
        }
  } 
})();



      