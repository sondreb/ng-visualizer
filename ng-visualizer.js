(function (document, angular, $) {
    // ng-visualizer: Visualizes Angular Modules.

    // If "angular" is not available at the execution of this function, it will throw exception:
    // Uncaught ReferenceError: angular is not defined

    function NgVisualizer() {
        var self = this;

        var defaults = {
            hotkey: 'n'
        };

        self._container = null;
        self.visible = false;
        self.options = defaults;
        self.template = '<div style="padding: 20px; position: absolute; overflow: auto; top: 0; bottom: 0; left: 0; right: 0; z-index:100000; background-color: white; color: black;"></div>';
    };

    NgVisualizer.prototype.show = function () {
        var self = this;
        self.visible = true;

        var container = $(self.template)
        self._container = container;

        var allModules = angular.modules;

        allModules.forEach(function (module) {

            var angularModule = angular.module(module);
            var requires = angularModule.requires.join(', ');

            var moduleElement = $('<li/>');
            moduleElement.html('<i class="home icon"></i>' + module + ' (' + requires + ')');

            container.append(moduleElement);

            var modulesElement = $('<ul style="list-style:none;"/>');
            moduleElement.append(modulesElement);

            //var sortedComponents = _.sortBy(angularModule['_invokeQueue'], function (value) {
            //    return value[1];
            //});

            angularModule['_invokeQueue'].forEach(function (value) {

                var icon = '';
                var componentType = value[1];

                if (componentType === 'factory') {
                    icon = 'cubes';
                }
                else if (componentType === 'service') {
                    icon = 'cube';
                }
                else if (componentType === 'directive') {
                    icon = 'setting';
                }
                else if (componentType === 'provider') {
                    icon = 'settings';
                }
                else if (componentType === 'register') {
                    icon = 'book';
                }
                else if (componentType === 'constant') {
                    icon = 'lock';
                }
                else if (componentType === 'value') {
                    icon = 'alternate unlock';
                }

                var componentContainer = $('<ul/>');
                var componentElement = $('<li/>');

                componentElement.html('<i class="' + icon + ' icon"></i>' + value[2][0]);

                modulesElement.append(componentElement);

                var dependencyContainer = $('<ul style="list-style:none;"/>');
                componentElement.append(dependencyContainer);

                if (componentType === 'value' || componentType === 'constant') {
                    var dependencyElement = $('<li style="display: inline;"/>');
                    dependencyElement.html(JSON.stringify(value[2][1]));
                    dependencyContainer.append(dependencyElement);
                }
                else {

                    if (typeof value[2][1] === 'function') {
                        // do nothing else, we'll only show the name.
                    }
                    else if (angular.isArray(value[2][1])) {

                        var parameters = value[2][1].splice(0, value[2][1].length - 1).join(', ');

                        var dependencyElement = $('<li style="display: inline;"/>');
                        dependencyElement.html(parameters);
                        dependencyContainer.append(dependencyElement);

                    }
                    else {
                        debugger;
                        //var parameters = value[2][1].splice(-1, 1).join(', <br>');

                        //var dependencyElement = $('<li style="display: inline;"/>');
                        //dependencyElement.html(parameters);
                        //dependencyContainer.append(dependencyElement);

                    }
                }
            });

        });

        var body = $('body');
        body.append(self._container);
    };

    NgVisualizer.prototype.hide = function () {
        var self = this;
        self.visible = false;

        self._container.remove();
        self._container = null;
    };

    NgVisualizer.prototype.handleKey = function (input) {
        var self = this;

        if (self.options.hotkey === input) {
            if (self.visible) {
                self.hide();
            } else {
                self.show();
            }
        }
    };

    NgVisualizer.init = function () {

        var visualizer = new NgVisualizer();

        var orig = angular.module;

        // Extend angular with array of module names.
        angular.modules = [];

        angular.modules.select = function (query) {
            var cache = [], reg = new RegExp(query || '.*');

            for (var i = 0, l = this.length; i < l; i++) {
                var item = this[i];
                if (reg.test(item)) {
                    cache.push(item)
                }
            }

            return cache;
        }

        // Extend the module registration so  we keep track of all module names.
        angular.module = function () {
            var args = Array.prototype.slice.call(arguments);

            if (arguments.length > 1) {
                angular.modules.push(arguments[0]);
            }

            return orig.apply(null, args);
        }

        $(document).keypress(function (event) {
            var code = String.fromCharCode(event.which);
            visualizer.handleKey(code);
        });

    };

    NgVisualizer.init();

    // Expose NgVisualizer to the global object. Consider if we should not do this?
    window.NgVisualizer = NgVisualizer;

    // Expose as a CommonJS module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NgVisualizer;
    }

    // Expose as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return NgVisualizer;
        });
    }

})(document, angular, jQuery);