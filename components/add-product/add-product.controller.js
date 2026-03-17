// freshtrack/components/add-product/add-product.controller.js

angular.module('freshTrackApp').controller('AddProductController', ['ProductService', 'AuthService', 'ToastService', '$location', function (ProductService, AuthService, ToastService, $location) {
    var vm = this;
    var userId = null;

    vm.categories = [
        { name: 'Dairy', emoji: '🥛' },
        { name: 'Vegetables', emoji: '🥬' },
        { name: 'Fruits', emoji: '🍎' },
        { name: 'Meat', emoji: '🍗' },
        { name: 'Seafood', emoji: '🐟' },
        { name: 'Bakery', emoji: '🍞' },
        { name: 'Pantry', emoji: '🥫' },
        { name: 'Beverages', emoji: '🧃' },
        { name: 'Cheese', emoji: '🧀' },
        { name: 'Snacks', emoji: '🥨' }
    ];

    // Today format: YYYY-MM-DD for input[type=date]
    var todayStr = new Date().toISOString().split('T')[0];

    vm.product = {
        name: '',
        category: vm.categories[0].name, // default
        price: null,
        added: new Date(todayStr),
        expiry: null,
        qty: 1,
        rating: 3,
        emoji: vm.categories[0].emoji
    };

    // Since the route resolves auth, it should be in cache synchronously
    AuthService.currentUser().then(function (user) {
        userId = user.id;
    });

    vm.updateEmoji = function () {
        var cat = vm.categories.find(function (c) { return c.name === vm.product.category; });
        if (cat) vm.product.emoji = cat.emoji;
    };

    vm.setRating = function (rating) {
        vm.product.rating = rating;
    };

    vm.save = function () {
        // Ensure we have user auth
        AuthService.currentUser().then(function (user) {
            userId = user.id;
            performSave();
        }).catch(function () {
            ToastService.show('Authentication error', 'error');
            $location.path('/auth');
        });
    };

    function performSave() {
        if (!vm.product.name || !vm.product.expiry || !vm.product.price) {
            ToastService.show('Please fill required fields', 'error');
            return;
        }

        // Validate expiry > added
        var addedTime = new Date(vm.product.added).getTime();
        var expiryTime = new Date(vm.product.expiry).getTime();

        if (expiryTime <= addedTime) {
            ToastService.show('Expiry date must be after the added date', 'error');
            return;
        }

        var newProduct = {
            name: vm.product.name,
            category: vm.product.category,
            emoji: vm.product.emoji,
            price: vm.product.price,
            added: vm.product.added.toISOString(),
            expiry: vm.product.expiry.toISOString(),
            qty: vm.product.qty,
            rating: vm.product.rating
        };

        ProductService.add(userId, newProduct).then(function () {
            ToastService.show('Product added successfully', 'success');
            // Force angular digest to pick up the location change if needed
            $location.path('/dashboard');
        });
    }
}]);
