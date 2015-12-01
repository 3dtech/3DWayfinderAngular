var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', ['$rootScope', function($rootScope) {
	var wf = new Wayfinder3D();
	wf.onDataLoaded = function(){
		$rootScope.$broadcast('wf.data.loaded', []);
	}

	wf.cbOnPOIClick = function(poi){
		$rootScope.$broadcast('wf.poi.click', poi);
	}

	wf.cbOnLanguageChange = function(language){
		$rootScope.$broadcast('wf.language.change', language);
	}
 
	wf.cbOnFloorChange = function(floor){
		$rootScope.$broadcast('wf.floor.change', floor);
	}

	wf.cbOnZoomChange = function(zoom){
		$rootScope.$broadcast('wf.zoom.change', zoom);
	}

	wf.onBeforeFloorChange = function(currentFloor, nextFloor, destinationFloor){
		$rootScope.$broadcast('wf.path.floor.change', {current: currentFloor, next: nextFloor, destination: destinationFloor});
	}

	wf.cbOnTouch = function(type, value){
		$rootScope.$broadcast('wf.touch', {type: type, value: value, destination: destinationFloor});
	}

	return wf;
}]);

wfangular.filter('wfCurrentLanguage', ['wfangular3d', function(wayfinder) {
	return function(input) {
		if(input && typeof input === "object"){
			if(input[wayfinder.getLanguage()])
				return input[wayfinder.getLanguage()];
			else if(input["translations"][wayfinder.getLanguage()])
				return input["translations"][wayfinder.getLanguage()];
			else
				return input;
		}
		else {
			return input;
		}
	};
}]);

wfangular.directive('wfBanner', ['$interval', '$compile', 'wfangular3d', function($interval, $compile, wayfinder) {
	return	{
			restrict: 'EA',
			scope: {
			},
			controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
				var timeoutId;
				var frames = [];
				var current = 0;
				var timer = null;
				var id = false;

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

        $scope.$on('wf.data.loaded', function(event, data){
          setup();
        });

				function setup(){
					var tpl = '<div style="position: absolute; background-size: cover; background-position: 50% 50%; background-repeat: no-repeat; left: {1}%; top: {2}%; width: {3}%; height: {4}%; {5}" data-id="{0}">';

					for (var i=0; i<this.frames.length; i++) {
						var frame = this.frames[i];
						frame.element = $('<div style="position: relative; width: 100%; height: 100%;">');
						for (var j=0; j<frame.containers.length; j++) {
							var container = frame.containers[j];
							var image = '';
							if (container.advertisement_id>0 && !(container.type && container.type.substr(0, 5) == 'video')) {
								image = "background-image: url('{0}');".format(WayfinderAPI.advertisements.data.url(container.advertisement_id));
							}
							container.element = $(tplSubcontainer.format(
								container.id,
								container.left,
								container.top,
								container.width,
								container.height,
								image));
							if (container.advertisement_id>0 && container.type.substr(0, 5) === 'video') {
								container.element.append($('<video width="100%" height="auto" src="{0}" loop></video>'.format(
									WayfinderAPI.advertisements.data.url(container.advertisement_id))));
							}
							frame.element.append(container.element);
						}
						frame.element.hide();
					}

          tpl += "</div>";
				}

				$element.append($compile($element.contents())($scope));

				$element.on('$destroy', function() {
					$interval.cancel(timeoutId);
				});

				timeoutId = $interval(function() {
					updateTime(); // update DOM
				}, 1000);

				updateTime();
			}]
		}
}]);