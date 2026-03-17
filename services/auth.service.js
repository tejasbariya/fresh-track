// freshtrack/services/auth.service.js

angular.module('freshTrackApp').factory('AuthService', ['$q', 'ProductService', function($q, ProductService) {
    var USERS_KEY = 'ft_users';
    var SESSION_KEY = 'ft_session';
    
    // In-memory cache for synchronous checks
    var currentUserCache = JSON.parse(localStorage.getItem(SESSION_KEY)) || null;

    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function setSession(user) {
        currentUserCache = user;
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    return {
        isLoggedInSync: function() {
            return !!currentUserCache;
        },

        currentUser: function() {
            var deferred = $q.defer();
            if (currentUserCache) {
                deferred.resolve(currentUserCache);
            } else {
                deferred.reject('Not authenticated');
            }
            return deferred.promise;
        },

        login: function(email, password) {
            var deferred = $q.defer();
            
            // DEMO MODE: Any email + "demo" password
            if (password === 'demo') {
                var demoUser = { id: 'demo_' + Date.now(), name: 'Demo User', email: email };
                setSession(demoUser);
                // Seed demo data
                ProductService.seedDemoData(demoUser.id);
                deferred.resolve(demoUser);
                return deferred.promise;
            }

            var users = getUsers();
            var user = users.find(function(u) { return u.email === email && u.password === password; });
            
            if (user) {
                // Return a copy without password
                var sessionUser = { id: user.id, name: user.name, email: user.email };
                setSession(sessionUser);
                deferred.resolve(sessionUser);
            } else {
                deferred.reject('Invalid credentials');
            }
            return deferred.promise;
        },

        register: function(name, email, password) {
            var deferred = $q.defer();
            var users = getUsers();
            
            if (users.find(function(u) { return u.email === email; })) {
                deferred.reject('Email already exists');
                return deferred.promise;
            }

            var newUser = {
                id: 'usr_' + Date.now(),
                name: name,
                email: email,
                password: password // In a real app, hash this!
            };

            users.push(newUser);
            saveUsers(users);
            
            var sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
            setSession(sessionUser);
            deferred.resolve(sessionUser);
            
            return deferred.promise;
        },

        logout: function() {
            currentUserCache = null;
            localStorage.removeItem(SESSION_KEY);
        }
    };
}]);
