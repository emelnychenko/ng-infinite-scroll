# angular-infinite-scroll
Angular lazy load handler, simple infinite scroll 

#### size: 469 Bytes

### Directive:

```
ig-scroll="handle"                      - (required) use "$scope.handle" instance on scroll.
ig-scroll-root="#dialog-scroll-canvas"  - use element with selector "#dialog-scroll-canvas" for calculate height. If this value null than handler use "window" height.
ig-scroll-dist="200"                    - create addition step for handler ($height - 200);
```

### Usage:
angular.application.script.js
```
angular.module(
    'app', [
        'igScroll'
    ]
).controller(
    'canvas', [
    '$scope', function($scope) {
        $scope.$pager = 1;
        $scope.$items = new Object();

        $scope.handle = function($done) {
            $http
                .get('http://example.com/xhr-load?page=' + $scope.$pager)
                .success(function($response) {
                    $scope.$items = $scope.$items.concat($response); // merge data from $response.

                    $done();         // unlock igScroll handler for next event.
                    ++$scope.$pager; // set next page number.
                });
        };
    }
]);

```

index.no-dialog.html (window height oriented)
```
<div ng-app="app">
    <div ng-controller="canvas">
        <ul ig-scroll="handle" ig-scroll-dist="200">
            <li ng-repeat="$item in $items">
                {{ $item['name'] }}
            </li>
        </ul>
    </div>
</div>
```

index.dialog.html (dialog height oriented)
```
<div ng-app="app">
    <div ng-controller="canvas" id="dialog-scroll-canvas">
        <ul ig-scroll="handle" ig-scroll-root="#dialog-scroll-canvas" ig-scroll-dist="200">
            <li ng-repeat="$item in $items">
                {{ $item['name'] }}
            </li>
        </ul>
    </div>
</div>
```
