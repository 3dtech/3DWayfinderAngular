var wfangular = angular.module('wfangular', []);

wfangular.constant('wfangularConfig', {
    assetsLocation: 'http://static.3dwayfinder.com/shared/',
    apiLocation: 'http://api.3dwayfinder.com',
    mapType: '3d'
});
wfangular.factory('wfangular', ['$rootScope', 'wfangularConfig', function($rootScope, config) {
    var wf = false;
    WayfinderAPI.LOCATION = config.apiLocation;

    if (config.mapType == "3d")
        wf = new Wayfinder3D();
    else if (config.mapType !== "2d")
        wf = new Wayfinder2D();

    wf.options.assetsLocation = config.assetsLocation;

    if (wf) {
        wf.cbOnDataLoaded = function() {
            $rootScope.$broadcast('wf.data.loaded', []);
        }

        wf.cbOnPOIClick = function(poi) {
            $rootScope.$broadcast('wf.poi.click', poi);
        }

        wf.cbOnLanguageChange = function(language) {
            $rootScope.$broadcast('wf.language.change', language);
        }

        wf.cbOnFloorChange = function(floor) {
            $rootScope.$broadcast('wf.floor.change', floor);
        }

        wf.cbOnZoomChange = function(zoom) {
            $rootScope.$broadcast('wf.zoom.change', zoom);
        }

        wf.cbOnBeforeFloorChange = function(currentFloor, nextFloor, destinationFloor) {
            $rootScope.$broadcast('wf.path.floor.change', {
                current: currentFloor,
                next: nextFloor,
                destination: destinationFloor
            });
        }

        wf.cbOnTouch = function(type, value) {
            $rootScope.$broadcast('wf.touch', {
                type: type,
                value: value
            });
        }
    }

    return wf;
}]);

wfangular.filter('wfCurrentLanguage', ['wfangular', function(wayfinder) {
    return function(input) {
        if (input && typeof input === "object") {
            if (input[wayfinder.getLanguage()]) {
                return input[wayfinder.getLanguage()];
            } else if (input["translations"][wayfinder.getLanguage()]) {
                return input["translations"][wayfinder.getLanguage()];
            } else {
                return input;
            }
        } else {
            return input;
        }
    };
}]);

wfangular.directive('wfBanner', ['$interval', 'wfangular', '$timeout', function($interval, wayfinder, $timeout) {
    return {
        restrict: 'EA',
        scope: {},
        controller: ['$scope', '$element', '$attrs', '$timeout', '$document', function($scope, $element, $attrs, $timeout, $document) {
            var timeoutId;
            var frames = [];
            var current = 0;
            var timer = null;
            var id = false;
            var template = "default";

            //watch id attribute for the banner placement
            $scope.$watch(function() {
                    return $element.attr('id');
                },
                function() {
                    if (!!$attrs.id && $attrs.id !== "") {
                        id = $attrs.id;
                    }
                }
            );

            $scope.$watch(function() {
                    return $element.attr('template');
                },
                function() {
                    if (!!$attrs.template && $attrs.template !== "") {
                        template = $attrs.template;
                    }
                }
            );

            $scope.$on('wf.data.loaded', function(event, data) {
                setup();
            });

            function setup() {
                var tpl = '<div style="position: absolute; background-size: cover; background-position: 50% 50%; background-repeat: no-repeat; left: {1}%; top: {2}%; width: {3}%; height: {4}%; {5}" data-id="{0}"></div>';

                if (wayfinder.advertisements["template-" + template] && wayfinder.advertisements["template-" + template][id]) {
                    frames = wayfinder.advertisements["template-" + template][id];
                }

                if (frames && frames.length > 0)
                    $document.find("body").addClass("banner-" + id);

                for (var i = 0; i < frames.length; i++) {
                    var frame = frames[i];
                    frame.element = $('<div style="position: relative; width: 100%; height: 100%;">');
                    for (var j = 0; j < frame.containers.length; j++) {
                        var container = frame.containers[j];
                        var image = '';
                        if (container.advertisement_id > 0 && !(container.type && container.type.substr(0, 5) == 'video')) {
                            image = "background-image: url('{0}');".format(WayfinderAPI.advertisements.data.url(container.advertisement_id));
                        }
                        container.element = $(tpl.format(
                            container.id,
                            container.left,
                            container.top,
                            container.width,
                            container.height,
                            image));
                        if (container.advertisement_id > 0 && container.type.substr(0, 5) === 'video') {
                            container.element.append($('<video width="100%" height="auto" src="{0}" loop></video>'.format(
                                WayfinderAPI.advertisements.data.url(container.advertisement_id))));
                        }
                        frame.element.append(container.element);
                    }
                    frame.element.hide();
                }

                play();
            }

            function play() {
                if (current >= frames.length) {
                    return;
                }
                var frame = frames[current];
                frame.element.show();
                $element.empty().append(frame.element);
                for (var i = 0; i < frame.containers.length; i++) {
                    if (frame.containers[i].type && frame.containers[i].type.substr(0, 5) === 'video' && frame.containers[i].element) {
                        var el = $(frame.containers[i].element).children('video').get(0);
                        el.play();
                        if (el.readyState) {
                            el.currentTime = '0';
                        }
                    }
                    if (frame.containers[i].element && frame.containers[i].element.hammer) {
                        frame.containers[i].element.on("click", onClick);
                    }
                }
                next();

                if (timer) {
                    $timeout.cancel(timer);
                }

                timer = $timeout(play, frame.duration);
            }

            function next() {
                if (current < frames.length - 1) {
                    current++;
                } else
                    current = 0;
            }

            function onClick(event) {
                //var id = $(event.currentTarget).data('id');
                // console.log('TODO: Banner.onClick', id);
            }
        }]
    }
}]);
