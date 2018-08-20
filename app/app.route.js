(function() {
    angular
        .module("userCart")
            .config(configRoutes)
            .run(runBlock);

    configRoutes.$inject = ["$stateProvider"];

    function configRoutes($stateProvider) {
        $stateProvider
            .state("userCart", {
                cache : true,
                views : {
                    "" : {
                        templateUrl : "app/components/landing/landing.html"
                    },
                    "header@userCart" : {
                        templateUrl : "app/shared/layout/header.html",
                        controller : "headerController as $hd"
                    },
                    "footer@userCart" : {
                        templateUrl : "app/shared/layout/footer.html"
                    }
                }
            })
            .state("userCart.dashboard", {
                cache : true,
                url : "/dashboard/:currentId",
                views : {
                    "content" : {
                        templateUrl : "app/components/dashboard/dashboard.html",
                        controller : "dashboardController as $dash"
                    }
                },
                // resolve: {
                //     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //         return $ocLazyLoad.load('main'); // Resolve promise and load before view 
                //     }]
                // }
            })
            .state("userCart.product", {
                cache : true,
                url : "/product",
                views : {
                    "content" : {
                        templateUrl : "app/components/product/product.html",
                        controller : "productController as $prod"
                    }
                }
            })
            .state("userCart.productDetails", {
                cache : true,
                url : "/productDetails/:key",
                views : {
                    "content" : {
                        templateUrl : "app/components/product/productDetails.html",
                        controller : "productDetailsController as $proDet"
                    }
                }
            })
            .state("userCart.about", {
                cache : true,
                url : "/about",
                views : {
                    "content" : {
                        templateUrl : "app/shared/about/about.html",
                        // controller : "productDetailsController as $proDet"
                    }
                }
            })
            .state("userCart.contact", {
                cache : true,
                url : "/contact",
                views : {
                    "content" : {
                        templateUrl : "app/shared/contact/contact.html",
                        controller : "contactController as $cont"
                    }
                }
            })  
            .state("userCart.cart", {
                cache : true,
                url : "/cart",
                views : {
                    "content" : {
                        templateUrl : "app/components/cart/cart.html",
                        controller : "cartController as $cart"
                    }
                }
            })  
            .state("profile", {
                cache : true,
                url : "/profile/:uid",
                templateUrl : "app/components/profile/profile.html",
                controller : "profileController as $pc",
                function($stateParams) {
                    $stateParams.email;  
                }
            })
            .state("newPassword", {
                url : "/newPassword/:emailId/:code",
                templateUrl : "app/components/login/newPassword.html",
                controller : "newPasswordController as $npc"
            })
            .state('emailVerify', {
                cache : true,
                url: '/verify-email?mode&oobCode',
                templateUrl: 'app/components/authentication/verify.html',
                controller: 'emailVerifyController as $ec',
            })
            .state("register", {
                cache : true,
                url : "/register",
                templateUrl : "app/components/register/register.html",
                controller : "registrationController as $rc"
            })
            .state("reset", {
                url :"/reset",
                templateUrl : "app/components/login/resetPassword.html",
                controller : "resetController as $rec"
            })
            .state("login", {
                cache : true,
                url : "/login",
                templateUrl : "app/components/login/login.html",
                controller : "loginController as $lc"
            })
            
            
    }

    runBlock.$inject = ["$rootScope", "$transitions", "$state"];

    function runBlock($rootScope, $transitions, $state) {



        $transitions.onSuccess({to: true }, ($transition) => {
           
            // if($transition.$from() == $transition.$to()) {
            //     $state.go('loading');
            // }
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) { 
                    var currentUser = user;
                    if(currentUser === null) {
                        if ($transition.$to().name !== 'login') {
                            $state.go("login");
                        }
                    } else if ($transition.$to().name === 'login') {
                        // $state.go('loading');
                        $state.go('login');
                    }
                } else {
                    var stateName = $transition.$to().name;
                    switch(stateName) {
                        case "register":
                            $state.go("register"); 
                            break;
                        case "reset":
                            $state.go("reset");
                            break;
                        case "newPassword":
                            $state.go("newPassword");
                        default :
                            $state.go("login");
                    }
                }
            });
        })
    }
})();