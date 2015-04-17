/**
 * Created by mshafer on 17/04/15.
 */

(function($, angular) {
    var API_BASE_URL = '/api';
    var API_FEATURES_ENDPOINT = '/features';
    var MAPBOX_ID = 'mshafer.lofi3idm';

    var app = angular.module('osmviewer', ['leaflet-directive']);

    app.controller('MapController', ['$scope', 'leafletData', 'featureService', function($scope, leafletData, featureService) {
        angular.extend($scope, {
            defaults: {
                tileLayer: 'http://{s}.tiles.mapbox.com/v3/'+ MAPBOX_ID + '/{z}/{x}/{y}.png',
                maxZoom: 18
            },
            sydney: {
                lat: -33.8658763,
                lng: 151.21242949999998,
                zoom: 15
            },
            events: {
                map: {
                    enable: ['moveend'],
                    logic: 'emit'
                }
            },
            markers: []
        });

        $scope.$on('leafletDirectiveMap.moveend', function(event) {
            fetchPointsWithinBounds();
        });

        var existingMarkerIds = {};

        function fetchPointsWithinBounds() {
            leafletData.getMap().then(function(map) {
                var bounds = map.getBounds();
                var fetchPointsSuccess = function(features) {
                    features.forEach(function(feature) {
                        createMarkerForFeature(feature);
                    });
                };
                featureService.getFeatures(bounds).success(fetchPointsSuccess);
            });
        }

        function createMarkerForFeature(feature) {
            if (!existingMarkerIds[feature.osmId]) { // Don't want to add markers that already exist
                var marker = {
                    lat: feature.latitude,
                    lng: feature.longitude,
                    message: feature['name']
                };
                $scope.markers.push(marker);
                existingMarkerIds[feature.osmId] = true;
            }
        }
    }]);

    app.factory('featureService', ['$http', function($http) {
        var service = {
            /**
             * Make an API call to fetch all the features within the specified bounds
             *
             * @param bounds A LatLngBounds instance
             */
            getFeatures: function(bounds) {
                var requestParams = {
                    north: bounds.getNorth(),
                    east: bounds.getEast(),
                    south: bounds.getSouth(),
                    west: bounds.getWest()
                };

                return $http({
                    url: API_BASE_URL + API_FEATURES_ENDPOINT,
                    method: 'GET',
                    params: requestParams
                });
            }
        };

        return service;
    }]);

})(jQuery, angular);