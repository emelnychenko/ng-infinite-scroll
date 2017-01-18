angular.module('fx.infinite.scroll', [])
    .factory('fxScrollFactory', ['$window', function($window) {
        var $scroll = {
            "offset"    : undefined,
            "calculate" : function(element, distantion) {
                $scroll.offset = parseInt(
                    window.getComputedStyle(
                        element[0], null
                    ).getPropertyValue("height").replace(/px/, '')
                ) - window.innerHeight - (
                    distantion ? distantion : 50
                );
            },
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

                $scroll.calculate();
            },
            "switch"     : function(group) {
                $scroll.group.current = group;
                $scroll.calculate();
            },
        };

        return $scroll;
    }])
    .directive('fxScroll', ['fxScrollFactory', '$parse', function($scroll, $parse) {
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

                angular.element(
                    $attr.fxScrollRoot ? document.querySelector(
                        $attr.fxScrollRoot
                    ) : window
                ).bind("scroll", function() {
                    if (!$scroll.offset) $scroll.calculate(
                        $element, $attr.fxScrollDist
                    );

                    winoff = this.pageYOffset || this.scrollTop;

                    if (reverse ? ($scroll.offset > winoff) : ($scroll.offset < winoff)) {
                        if (!$scroll.chain[name] && $scroll.group.current === group) {
                            $scroll.chain[name] = true;

                            if (handler) {
                                handler(function() {
                                    $scroll.chain[name] = false;

                                    $scroll.calculate(
                                        $element, $attr.fxScroll
                                    );
                                });
                            }
                        }
                    }
                });
            }
        };
    }]);
