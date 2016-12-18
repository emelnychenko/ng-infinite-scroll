angular.module('tp.infinite.scroll', [])
    .directive('tpScroll', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var $height, $locker = false, $event  = $scope.$eval($attr.tpScroll);

                var co = function() {
                    $height = parseInt(
                        $window.getComputedStyle(
                            $element[0], null
                        ).getPropertyValue("height").replace(/px/, '')
                    ) - $window.innerHeight - (
                        $attr.tpScrollDist ? $attr.tpScrollDist : 50
                    );
                };

                (
                    $attr.tpScrollRoot ? document.querySelector($attr.tpScrollRoot) : $window
                ).onscroll = function() {
                    if (!$height) co();

                    if ($height < (this.pageYOffset || this.scrollTop)) {
                        if (!$locker) {
                            $locker = true;

                            $event ? $event(function() {
                                $locker = false; co();
                            }) : null;
                        }
                    }
                };
            }
        };
    }]);
