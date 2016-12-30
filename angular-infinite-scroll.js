angular.module('fx.infinite.scroll', [])
    .factory('fxScrollFactory', ['$window', function($window) {
        var $scroll = {
            "offset"    : 0,
            "calculate" : function(element, distantion) {
                $scoll.offset = parseInt(
                    $window.getComputedStyle(
                        element[0], null
                    ).getPropertyValue("height").replace(/px/, '')
                ) - $window.innerHeight - (
                    distantion ? distantion : 50
                );
            }
            "group"     : {
                "current"    : 'default',
                "dependence" : new Object,
            },
            "chain"    : new Object,
            "append"  : function(name, group) {
                $scroll.chain[name]             = false;
                $scroll.group.dependence[name]  = group ? group : 'default';
            },
            "renew"     : function(name) {
                if ($scroll.chain[name])
                    $scroll.chain[name] = false;
            },
            "switch"     : function(group) {
                $scroll.group.current = group;
            },
        };

        return $scroll;
    }])
    .directive('fxScroll', ['fxScrollFactory', function($scroll) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var height      = 0, 
                    name        = $attr.fxScroll, 
                    group       = $attr.fxScrollGroup,
                    reverse     = $attr.fxScrollReverse ? true : false,
                    winoff      = false,
                    handler     = $scope.$eval(
                        $attr.fxScrollFn
                    );

                group = group ? group : 'default';

                $scroll.append(name, group);

                (
                    $attr.fxScrollRoot ? document.querySelector(
                        $attr.fxScrollRoot
                    ) : $window
                ).onscroll = function() {
                    if (!$scoll.height) $scoll.calculate(
                        $element, $attr.fxScrollDist 
                    );

                    winoff = this.pageYOffset || this.scrollTop;

                    if (reverse ? ($scoll.height > winoff) : ($scoll.height < winoff)) {
                        if (!$scope.chain[name] && $scope.group.current === group) {
                            $scope.chain[name] = true;

                            handler ? handler(function() {
                                $scope.chain[name] = false;
                                
                                $scoll.calculate(
                                    $element, $attr.fxScroll
                                );
                            }) : null;
                        }
                    }
                };
            }
        };
    }]);
