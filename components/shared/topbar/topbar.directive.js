// freshtrack/components/shared/topbar/topbar.directive.js

angular.module('freshTrackApp').directive('topbarComponent', ['ThemeService', 'AuthService', '$location', function(ThemeService, AuthService, $location) {
    return {
        restrict: 'E',
        template: `
            <header class="topbar glass-panel">
                <div class="topbar-content flex justify-between items-center">
                    <a href="#!/dashboard" class="brand flex items-center gap-2">
                        <span class="brand-icon">🍃</span>
                        <span class="brand-text font-bold text-xl">FreshTrack</span>
                    </a>
                    
                    <div class="topbar-actions flex items-center gap-4">
                        <button class="btn-icon theme-toggle" ng-click="toggleTheme()" aria-label="Toggle Theme">
                            <span ng-if="currentTheme === 'dark'">☀️</span>
                            <span ng-if="currentTheme === 'light'">🌙</span>
                        </button>
                        
                        <div class="user-chip flex items-center gap-2" ng-if="isLoggedIn">
                            <div class="avatar bg-accent flex items-center justify-center">
                                {{ userInitials }}
                            </div>
                            <span class="user-name text-sm font-bold hidden-mobile">{{ currentUser.name }}</span>
                            <button class="btn-icon text-sm" ng-click="logout()" title="Logout">🚪</button>
                        </div>
                    </div>
                </div>
            </header>
            
            <style>
            .topbar {
                position: sticky;
                top: 0;
                z-index: 50;
                border-radius: 0;
                border-left: none;
                border-right: none;
                border-top: none;
            }
            .topbar-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 1rem 2rem;
            }
            .brand {
                color: var(--accent-primary);
            }
            .brand-icon {
                font-size: 1.5rem;
            }
            .user-chip {
                background: var(--surface-solid);
                padding: 0.25rem 0.5rem 0.25rem 0.25rem;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-full);
            }
            .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--accent-primary);
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
            }
            @media (max-width: 600px) {
                .hidden-mobile { display: none; }
                .topbar-content { padding: 1rem; }
            }
            </style>
        `,
        link: function(scope) {
            scope.currentTheme = ThemeService.get();
            scope.isLoggedIn = false;
            scope.currentUser = null;
            scope.userInitials = '';

            scope.toggleTheme = function() {
                scope.currentTheme = ThemeService.toggle();
            };

            function updateAuth() {
                AuthService.currentUser().then(function(user) {
                    scope.isLoggedIn = true;
                    scope.currentUser = user;
                    scope.userInitials = user.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().substring(0, 2);
                }).catch(function() {
                    scope.isLoggedIn = false;
                    scope.currentUser = null;
                });
            }

            scope.logout = function() {
                AuthService.logout();
                updateAuth();
                $location.path('/auth');
            };

            // Listen for route changes to update auth state (e.g., after login)
            scope.$on('$routeChangeSuccess', function() {
                updateAuth();
            });
            
            // Initial check
            updateAuth();
        }
    };
}]);
