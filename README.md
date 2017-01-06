# 3DWayfinderAngular
Angular Service for 3D Wayfinder (now supports 2D maps also)

## Getting started

### Install
```bash 
bower install --save 3dwayfinder-angular
```

Please include the following JavaScript files into Your HTML file and inject wfangular into Your Angular app:

```javascript
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<!-- FOR 3D Map add the line below -->
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/frak-stable.min.js"></script>
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/Wayfinder3D.min.js"></script>
<!-- FOR 2D Map add the line below -->
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/Wayfinder2D.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
<script type="text/javascript" src="index.js"></script>

<script>
    var app = angular.module('basictest', ['wfangular']);
    app.config(['wfangularConfig', function(wayfinderConfig){
    	wayfinderConfig.mapType = '2d';
    }])
    app.run(['wfangular', function(wayfinder) {
      wayfinder.open();
    }]);
</script>
```
## Broadcasted events
* wf.data.loaded - broadcasted when all data is loaded
* wf.poi.click - broadcasted when user clicks on map. Arguments: POI
* wf.language.change - broadcasted when language is changed. Arguments: language code {string} (eg en, de etc)
* wf.floor.change - broadcasted when floor is changed. Arguments: Floor
* wf.zoom.change - broadcasted when zoom is changed. Arguments: zoom {float}
* wf.path.floor.change - broadcasted when path animation changes floor: Arguments: Object {current: Floor, next: Floor, destination: Floor}

## Directives
* wf-banner - displays a banner, ex. id="advertisements" template="default"
* wf-floor-buttons - displays floor buttons, on-click function to react, can give additional parameters for the button group via group-class and for the buttons via button-class, see example below
```javascript
<wf-floors-buttons group-class="btn-group floors-buttons" button-class="btn floor"></wf-floors-buttons>
```

##Options
Constant wfangularConfig takes the following arguments for changing the behavior:
*	assetsLocation: 'http://static.3dwayfinder.com/shared/',
*	apiLocation: 'http://api.3dwayfinder.com'
*	mapType: '3d'//2d
