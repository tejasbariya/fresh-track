// freshtrack/services/theme.service.js

angular.module('freshTrackApp').factory('ThemeService', function () {
    var STORAGE_KEY = 'ft_theme';
    var defaultTheme = 'dark';
    var currentTheme = localStorage.getItem(STORAGE_KEY) || defaultTheme;

    function applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    return {
        init: function () {
            applyTheme(currentTheme);
        },
        toggle: function () {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, currentTheme);
            applyTheme(currentTheme);
            return currentTheme;
        },
        get: function () {
            return currentTheme;
        }
    };
});
