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
            getData : getData,
            getProductCatData : getProductCatData,
            getCartList : getCartList,
            getWishList : getWishList,
            getProductData :getProductData,
            checkExistProd : checkExistProd,
            getInventoryVarient : getInventoryVarient
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

        function getProductData(key, tableName) {
            return $q(function(resolve, reject){ 
                firebase.database().ref().child(tableName).child(key).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = snapshot.val();
                        data.key = key;
                        resolve(data)
                    } else {
                        reject("no rows present");
                    }
                })
            })
        }

        function getProductCatData(categoryKey) {
            return $q(function(resolve, reject) {
                var productCatList = firebase.database().ref().child("products").orderByChild("category").equalTo(categoryKey);
                productCatList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key){
                            obj.key = key
                            return obj 
                        })
                        resolve(data)
                    } else {
                        reject("something went wrong");
                    }
                });
            })
        }

        function checkExistProd(userUid, productKey) {
            return $q(function(resolve, reject) {
                var checkExist = firebase.database().ref().child("users").child(userUid).child("cartlist").orderByKey().equalTo(productKey);
                checkExist.once('value', snapshot => {
                  if(snapshot.exists()) {
                    var data = _.map(snapshot.val(), function(obj, key) {
                        obj.key = key
                        return obj 
                    })   
                    resolve(data)
                  } else {
                    reject();
                  }
                })
            })
        }

        function getWishList(uid) {
            return $q(function(resolveWish, rejectWish) {
                var wishList = firebase.database().ref().child('users').child(uid).child("wishlist");
                wishList.on("value", snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
                            obj.key = key
                            return obj 
                        })
                        resolveWish(data);
                    } else {
                        rejectWish();
                    }
                })
            })
        }

        function getCartList(uid) {
            return $q(function(resolveCart, rejectCart) {
                var cartList = firebase.database().ref().child('users').child(uid).child("cartlist");
                cartList.on("value", snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
                            obj.key = key
                            return obj 
                        })
                        resolveCart(data);
                    } else {
                        rejectCart();
                    }
                })
            })
        }

        function getInventoryVarient(tableName, productKey) {
            return $q(function(resolve, reject) {
                var productCatList = firebase.database().ref().child(tableName).orderByChild("productkey").equalTo(productKey);
                productCatList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key){
                            obj.key = key
                            resolve(obj) 
                        })
                    } else {
                        reject("something went wrong");
                    }
                });
            })
        }

    }

})();

