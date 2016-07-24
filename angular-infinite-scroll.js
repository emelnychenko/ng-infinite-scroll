angular.module('igScroll', [])
    .directive('igScroll', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var $height, $locker = false, $event  = $scope.$eval($attr.igScroll);

                var co = function() {
                    $height = parseInt(
                        $window.getComputedStyle(
                            $element[0], null
                        ).getPropertyValue("height").replace(/px/, '')
                    ) - $window.innerHeight - (
                        $attr.igScrollDist ? $attr.igScrollDist : 50
                    );
                };

                (
                    $attr.igScrollRoot ? document.querySelector($attr.igScrollRoot) : $window
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