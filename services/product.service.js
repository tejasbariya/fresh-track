// freshtrack/services/product.service.js

angular.module('freshTrackApp').factory('ProductService', ['$q', '$timeout', function($q, $timeout) {
    var PRODUCTS_KEY = 'ft_products';

    function getStorage() {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || {};
    }

    function saveStorage(data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
    }

    // Helper to generate dates easily
    function getOffsetDate(days) {
        var d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString();
    }

    return {
        getAll: function(userId) {
            var deferred = $q.defer();
            $timeout(function() {
                var data = getStorage();
                deferred.resolve(data[userId] || []);
            });
            return deferred.promise;
        },

        add: function(userId, product) {
            var deferred = $q.defer();
            $timeout(function() {
                var data = getStorage();
                if (!data[userId]) data[userId] = [];
                
                product.id = 'prod_' + Date.now();
                data[userId].push(product);
                
                saveStorage(data);
                deferred.resolve(product);
            });
            return deferred.promise;
        },

        remove: function(userId, productId) {
            var deferred = $q.defer();
            $timeout(function() {
                var data = getStorage();
                if (data[userId]) {
                    data[userId] = data[userId].filter(function(p) { return p.id !== productId; });
                    saveStorage(data);
                }
                deferred.resolve();
            });
            return deferred.promise;
        },

        // Seed initial data for demo users
        seedDemoData: function(userId) {
            var data = getStorage();
            if (!data[userId] || data[userId].length === 0) {
                data[userId] = [
                    { id: 'dev1', name: 'Organic Milk', category: 'Dairy', emoji: '🥛', price: 4.50, added: getOffsetDate(-2), expiry: getOffsetDate(5), qty: 1, rating: 4 },
                    { id: 'dev2', name: 'Fresh Spinach', category: 'Vegetables', emoji: '🥬', price: 2.99, added: getOffsetDate(-4), expiry: getOffsetDate(-1), qty: 2, rating: 5 }, // Expired
                    { id: 'dev3', name: 'Chicken Breast', category: 'Meat', emoji: '🍗', price: 12.00, added: getOffsetDate(-1), expiry: getOffsetDate(2), qty: 1, rating: 4 }, // Soon
                    { id: 'dev4', name: 'Sourdough Bread', category: 'Bakery', emoji: '🍞', price: 6.00, added: getOffsetDate(-3), expiry: getOffsetDate(0), qty: 1, rating: 5 }, // Expiring today
                    { id: 'dev5', name: 'Cheddar Cheese', category: 'Cheese', emoji: '🧀', price: 5.50, added: getOffsetDate(-10), expiry: getOffsetDate(20), qty: 1, rating: 3 },
                    { id: 'dev6', name: 'Orange Juice', category: 'Beverages', emoji: '🧃', price: 3.25, added: getOffsetDate(-1), expiry: getOffsetDate(10), qty: 2, rating: 4 }
                ];
                saveStorage(data);
            }
        }
    };
}]);
