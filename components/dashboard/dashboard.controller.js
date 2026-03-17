// 1. Add $timeout to both the array and the function arguments (make sure the order matches!)
angular.module('freshTrackApp').controller('DashboardController', ['ProductService', 'AuthService', 'ToastService', '$filter', '$timeout', function (ProductService, AuthService, ToastService, $filter, $timeout) {
    var vm = this;

    vm.products = [];
    vm.filteredProducts = [];
    vm.stats = { total: 0, fresh: 0, soon: 0, expired: 0 };
    vm.activeFilter = 'all'; // all, fresh, soon, expired
    vm.searchQuery = '';

    // Status filter alias for controller use
    var getStatus = $filter('statusFilter');

    loadProducts();

    function loadProducts() {
        AuthService.currentUser().then(function (user) {
            vm.userId = user.id;
            return ProductService.getAll(user.id);
        }).then(function (docs) {
            // 2. Wrap the data assignment and calculations in $timeout
            $timeout(function () {
                vm.products = docs;
                calculateStats();
                applyFilters();
            });
        });
    }

    function calculateStats() {
        vm.stats = { total: vm.products.length, fresh: 0, soon: 0, expired: 0 };

        vm.products.forEach(function (p) {
            var info = getStatus(p.expiry);
            p._statusInfo = info; // Cache it for the view and filtering

            if (info.status === 'fresh') vm.stats.fresh++;
            if (info.status === 'soon') vm.stats.soon++;
            if (info.status === 'expired') vm.stats.expired++;

            // Calculate lifespan progress
            var added = new Date(p.added).getTime();
            var expiry = new Date(p.expiry).getTime();
            var now = new Date().getTime();
            var totalLifespan = expiry - added;
            var elapsed = now - added;

            var progress = 0;
            if (totalLifespan > 0) {
                progress = Math.max(0, Math.min(100, (elapsed / totalLifespan) * 100));
            }
            p._lifespanProgress = progress;
        });
    }

    vm.setFilter = function (filterName) {
        vm.activeFilter = filterName;
        applyFilters();
    };

    vm.updateSearch = function () {
        applyFilters();
    };

    function applyFilters() {
        var query = (vm.searchQuery || '').toLowerCase();

        vm.filteredProducts = vm.products.filter(function (p) {
            // Text Search (safe against undefined)
            var nSearch = p.name ? p.name.toLowerCase() : '';
            var cSearch = p.category ? p.category.toLowerCase() : '';
            var matchesSearch = nSearch.indexOf(query) !== -1 || cSearch.indexOf(query) !== -1;

            // Status Filter
            var matchesStatus = true;
            if (vm.activeFilter !== 'all') {
                matchesStatus = p._statusInfo && p._statusInfo.status === vm.activeFilter;
            }

            return matchesSearch && matchesStatus;
        });
    }

    vm.removeProduct = function (productId) {
        if (!confirm('Remove this product permanently?')) return;

        ProductService.remove(vm.userId, productId).then(function () {
            ToastService.show('Product removed', 'info');
            loadProducts(); // Reload to update stats and view
        });
    };

    vm.throwOutExpired = function () {
        var expiredProducts = vm.products.filter(function (p) { return p._statusInfo.status === 'expired'; });

        if (expiredProducts.length === 0) return;
        if (!confirm('Throw out ' + expiredProducts.length + ' expired product(s)?')) return;

        // Remove them sequentially (or using Promise.all in real app)
        expiredProducts.forEach(function (p) {
            ProductService.remove(vm.userId, p.id);
        });

        ToastService.show('Cleaned up ' + expiredProducts.length + ' expired items', 'success');

        // Ensure loadProducts runs after a brief delay if promises don't resolve instantly
        $timeout(function () {
            loadProducts();
        }, 100);
    };
}]);