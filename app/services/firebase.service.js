(function() {
    angular
        .module("userCart")
            .factory("firebaseService", firebaseService)

    
    firebaseService.$inject = ["$q", "$rootScope"];
    function firebaseService($q, $rootScope) {
        return {
            signUp : signUp,
            signIn : signIn,
            logOut : logOut,
            emailVerify : emailVerify,
            getCurrentUser: getCurrentUser,
            resetPassword : resetPassword,
            getLoginData : getLoginData,
            getData : getData
            // tokenId : tokenId
        }

        function signUp(email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password);
        }

        function signIn(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        }

        function logOut() {
            return firebase.auth().signOut();
        }

        function getCurrentUser(){
            return firebase.auth().currentUser;
        }

        function emailVerify(currentuser) {
            return  currentuser.sendEmailVerification();
            
        }

        function resetPassword(email) {
            return firebase.auth().sendPasswordResetEmail(email) ;
        }

        function getLoginData(tableName, key) {
            return $q(function(resolve, reject){ 
                firebase.database().ref().child(tableName).child(key).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = snapshot.val()
                        resolve(data)
                    } else {
                        reject("no rows present");
                    }
                })
            })
        }

        function getData(tableName) {
            return $q(function(resolve, reject){ 
                firebase.database().ref().child(tableName).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key){
                            obj.key = key
                            return obj 
                        })
                        resolve(data)
                    } else {
                        reject("no rows present");
                    }
                })
            })
        }

    }

    

})();

