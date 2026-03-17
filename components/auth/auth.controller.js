// freshtrack/components/auth/auth.controller.js

angular.module('freshTrackApp').controller('AuthController', ['AuthService', 'ToastService', '$location', function(AuthService, ToastService, $location) {
    var vm = this;
    
    vm.activeTab = 'login'; // 'login' or 'register'
    
    vm.loginData = { email: '', password: '' };
    vm.registerData = { name: '', email: '', password: '' };
    vm.isLoading = false;

    vm.switchTab = function(tabName) {
        vm.activeTab = tabName;
    };

    vm.login = function() {
        if (!vm.loginData.email || !vm.loginData.password) return;
        
        vm.isLoading = true;
        AuthService.login(vm.loginData.email, vm.loginData.password)
            .then(function(user) {
                ToastService.show('Welcome back, ' + user.name + '!', 'success');
                $location.path('/dashboard');
            })
            .catch(function(err) {
                ToastService.show(err, 'error');
            })
            .finally(function() {
                vm.isLoading = false;
            });
    };

    vm.register = function() {
        if (!vm.registerData.name || !vm.registerData.email || !vm.registerData.password) return;
        
        vm.isLoading = true;
        AuthService.register(vm.registerData.name, vm.registerData.email, vm.registerData.password)
            .then(function(user) {
                ToastService.show('Account created successfully!', 'success');
                $location.path('/dashboard');
            })
            .catch(function(err) {
                ToastService.show(err, 'error');
            })
            .finally(function() {
                vm.isLoading = false;
            });
    };
}]);
