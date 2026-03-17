// freshtrack/app.js

var app = angular.module('freshTrackApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/auth', {
            templateUrl: 'components/auth/auth.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        })
        .when('/dashboard', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'vm',
            resolve: {
                auth: ['AuthService', '$location', function(AuthService, $location) {
                    return AuthService.currentUser().then(function(user) {
                        return user; // returns user, resolving the route
                    }).catch(function() {
                        $location.path('/auth'); // Redirect to auth if not logged in
                        return Promise.reject('Not Authenticated');
                    });
                }]
            }
        })
        .when('/add', {
            templateUrl: 'components/add-product/add-product.html',
            controller: 'AddProductController',
            controllerAs: 'vm',
            resolve: {
                auth: ['AuthService', '$location', function(AuthService, $location) {
                    return AuthService.currentUser().then(function(user) {
                        return user;
                    }).catch(function() {
                        $location.path('/auth');
                        return Promise.reject('Not Authenticated');
                    });
                }]
            }
        })
        .otherwise({
            redirectTo: '/dashboard'
        });
}]);

// Global Route Guard & Initialization
app.run(['$rootScope', '$location', 'AuthService', 'ThemeService', function($rootScope, $location, AuthService, ThemeService) {
    // Initialize Theme
    ThemeService.init();

    // Default basic route change start logic (redundant due to resolve, but good for holistic checking)
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // We use resolve on individual routes for cleaner async auth checking.
        // However, if we synchronously know they aren't logged in and they are headed to restricted, early redirect:
        if (next && next.$$route && next.$$route.originalPath !== '/auth') {
            if (!AuthService.isLoggedInSync()) {
                event.preventDefault();
                $location.path('/auth');
            }
        }
        
        // Don't allow logged-in users to hit /auth
        if (next && next.$$route && next.$$route.originalPath === '/auth') {
            if (AuthService.isLoggedInSync()) {
                event.preventDefault();
                $location.path('/dashboard');
            }
        }
    });
}]);

// Global Filter for calculating product status
app.filter('statusFilter', function() {
    return function(expiryDateStr) {
        if (!expiryDateStr) return { status: 'unknown', daysLeft: 0 };
        
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        
        var expiry = new Date(expiryDateStr);
        expiry.setHours(0, 0, 0, 0);
        
        var diffTime = expiry.getTime() - today.getTime();
        var daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        var status = 'fresh';
        if (daysLeft < 0) {
            status = 'expired';
        } else if (daysLeft <= 3) {
            status = 'soon';
        }
        
        return {
            status: status,
            daysLeft: daysLeft
        };
    };
});
