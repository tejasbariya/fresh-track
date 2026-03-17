// freshtrack/components/shared/toast/toast.service.js
// Handles publishing toast events

angular.module('freshTrackApp').factory('ToastService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
        show: function(message, type) {
            // type: 'success', 'error', 'info', 'warning'
            $rootScope.$broadcast('showToast', {
                message: message,
                type: type || 'info'
            });
        }
    };
}]);

// We also define the Toast Directive here for simplicity
angular.module('freshTrackApp').directive('toastComponent', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="toast-container" ng-class="{'show': visible}">
                <div class="toast glass-panel" ng-class="'toast-' + type">
                    <span class="toast-icon">
                        <span ng-if="type === 'success'">✓</span>
                        <span ng-if="type === 'error'">!</span>
                        <span ng-if="type === 'info'">i</span>
                        <span ng-if="type === 'warning'">⚠</span>
                    </span>
                    <span class="toast-message">{{ message }}</span>
                </div>
            </div>
            
            <style>
            .toast-container {
                position: fixed;
                bottom: -100px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
            }
            .toast-container.show {
                bottom: 2rem;
            }
            .toast {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.25rem;
                border-radius: var(--radius-full);
                background: var(--surface-solid);
                color: var(--text-primary);
                box-shadow: var(--shadow-md);
            }
            .toast-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                font-size: 0.75rem;
                font-weight: bold;
            }
            .toast-success .toast-icon { background: var(--semantic-fresh); color: white; }
            .toast-error .toast-icon { background: var(--semantic-expired); color: white; }
            .toast-warning .toast-icon { background: var(--semantic-soon); color: white; }
            .toast-info .toast-icon { background: var(--accent-primary); color: white; }
            </style>
        `,
        link: function(scope) {
            scope.visible = false;
            scope.message = '';
            scope.type = 'info';
            var hidePromise;

            scope.$on('showToast', function(event, data) {
                if (hidePromise) {
                    $timeout.cancel(hidePromise);
                }

                scope.message = data.message;
                scope.type = data.type;
                scope.visible = true;

                hidePromise = $timeout(function() {
                    scope.visible = false;
                }, 3000);
            });
        }
    };
}]);
