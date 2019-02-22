/* global $, angular, WayfinderAPI, Wayfinder2D, Wayfinder3D */

var wfangular = angular.module('wfangular', []);

wfangular.constant('wfangularConfig', {
	assetsLocation: '//static.3dwayfinder.com/shared/',
	apiLocation: '//api.3dwayfinder.com',
	mapType: '3d'
});
wfangular.factory('wfangular', [
	'$rootScope',
	'wfangularConfig',
	function($rootScope, config) {
		var wf = false;
		WayfinderAPI.LOCATION = config.apiLocation;

		if (config.mapType == "3d") {
			wf = new Wayfinder3D();
			wf.options.assetsLocation = config.assetsLocation;
		}
		else if (config.mapType == "2d")
			wf = new Wayfinder2D();


		if (wf) {
			wf.cbOnDataLoaded = function() {
				$rootScope.$broadcast('wf.data.loaded', []);
			};

			wf.cbOnPOIClick = function(poi) {
				$rootScope.$broadcast('wf.poi.click', poi);
			};

			wf.cbOnLanguageChange = function(language) {
				$rootScope.$broadcast('wf.language.change', language);
			};

			wf.cbOnFloorChange = function(floor) {
				$rootScope.$broadcast('wf.floor.change', floor);
			};

			wf.cbOnZoomChange = function(zoom) {
				$rootScope.$broadcast('wf.zoom.change', zoom);
			};

			wf.cbOnBeforeFloorChange = function(currentFloor, nextFloor, destinationFloor) {
				$rootScope.$broadcast('wf.path.floor.change', {
					current: currentFloor,
					next: nextFloor,
					destination: destinationFloor
				});
			};

			wf.cbOnTouch = function(type, value) {
				$rootScope.$broadcast('wf.touch', {
					type: type,
					value: value
				});
			};

			wf.cbOnMapReady = function() {
				$rootScope.$broadcast('wf.map.ready', []);
			};

			wf.cbOnPathFinished = function(path) {
				$rootScope.$broadcast('wf.path.finished', path);
			};
		}

		return wf;
	}
]);

wfangular.filter('wfCurrentLanguage', ['wfangular', function(wayfinder) {
    return function(input) {
        if (input && typeof input === "object") {
            if (input[wayfinder.getLanguage()]) {
                return input[wayfinder.getLanguage()];
            } else if (input["translations"] && input["translations"][wayfinder.getLanguage()]) {
                return input["translations"][wayfinder.getLanguage()];
            } else if (input["translations"] && !input["translations"][wayfinder.getLanguage()]){
                return input["translations"]['en'];
            }else {
				return "";
			}
        } else {
            return "";
        }
    };
}]);

wfangular.filter('wfPOIsByGroupObj', function () {
	return function (pois, obj) {
		var filtered = [];
		if (obj) {
			angular.forEach(pois, function (item) {
				if (item.groups && item.groups.indexOf(obj) > -1) {
					filtered.push(item);
				}
			});
		} else {
			filtered = pois;
		}
		return filtered;
	}
});
wfangular.filter('wfGroupsByParentGroupId',function () {
	return function (groups,num) {
		var filtered = [];
		if(num){
			angular.forEach(groups,function (item) {
				if(item.parent_id == num){
					filtered.push(item);
				}
			})
		} else {
			filtered = groups;
		}
		return filtered;
	}
});

wfangular.filter('wfPOIsByParentGroupId',function () {
	return function (pois,num) {
		var filtered = [];
		if(num){
			angular.forEach(pois,function (item) {
				angular.forEach(item.groups,function (elem) {
					if(elem.parent_id == num){
						filtered.push(item);
					}
				})
			})
		} else {
			filtered = pois;
		}
		return filtered;
	}
});

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
						if (template)
							setup();
					}
				}
			);

			$scope.$watch(function() {
					return $element.attr('template');
				},
				function() {
					if (!!$attrs.template && $attrs.template !== "") {
						template = $attrs.template;
						if (id)
							setup();
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
							container.element.append($('<video width="100%" height="auto" src="{0}" loop muted></video>'.format(
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
				}
				else
					current = 0;
			}

			function onClick(event) {
				//var id = $(event.currentTarget).data('id');
				// console.log('TODO: Banner.onClick', id);
			}
		}]
	}
}]);

wfangular.directive('wfFloorsButtons', ['wfangular', function(wayfinder) {
    return {
        restrict: 'AE',
        template: '<div class="{{buttonClass}}"' +
            ' ng-class="{\'{{activeClass}}\': floor.getActive()}"' +
            ' ng-repeat="floor in data.floors"' +
            ' ng-click="onFakeClick(floor)">{{floor.getNames() | wfCurrentLanguage}}</div>',
        scope: {
            onFakeClick: '&',
            onClick: '&?',
            buttonClass: '@',
            activeClass: '@'
        },
        controller: function($scope) {
            $scope.data = {
                floors: []
            };

            $scope.$on('wf.data.loaded', function(event, data) {
                $scope.data.floors = wayfinder.building.getSortedFloors();
                console.log("wayfinder.building.getSortedFloors();", wayfinder.building.getSortedFloors())
            });

            $scope.onFakeClick = function(sa) {
                if(typeof $scope.onClick === 'function'){
                    $scope.onClick({
                        floor: sa
                    });
                }
                else {
                    console.log("else", sa);
                    wayfinder.showFloor(sa);
                }
            }
        }
    }
}]);

wfangular.directive('wfResize', function($window) {
	return {
		restrict: 'AEC',
		scope: {
			cbResize: '&cbResize'
		},
		link: function(scope, element) {

			var w = element[0];
			scope.getWindowDimensions = function() {
				return {
					'h': w.clientHeight,
					'w': w.clientWidth
				};
			};

			scope.$watch(scope.getWindowDimensions, function(newValue) {
				scope.windowHeight = newValue.h;
				scope.windowWidth = newValue.w;

				scope.style = function() {
					return {
						'height': (newValue.h - 10) +
							'px',
						'width': (newValue.w - 10) +
							'px'
					};
				};

			}, true);

			angular.element($window).bind('resize', function() {
				scope.$apply(function() {
					scope.cbResize();
				});
			});
		}
	}
});
