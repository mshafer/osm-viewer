/**
 * Created by mshafer on 17/04/15.
 */

(function($, angular) {
    var API_BASE_URL = '/api';
    var API_POINTS_ENDPOINT = '/points';
    var MAPBOX_ID = 'mshafer.lofi3idm';

    var app = angular.module('osmviewer', ['leaflet-directive']);

    app.controller('MapController', ['$scope', 'leafletData', 'pointsService', function($scope, leafletData, pointsService) {
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
                    enable: ['load'],
                    logic: 'emit'
                }
            }
        });

        $scope.markers = new Array();

        $scope.$on('leafletDirectiveMap.load', function(event) {
            fetchPointsWithinBounds();
        });

        $scope.$on('leafletDirectiveMap.moveend', function(event) {
            fetchPointsWithinBounds();
        });

        var existingMarkerIds = {};

        function fetchPointsWithinBounds() {
            leafletData.getMap().then(function(map) {
                var bounds = map.getBounds();
                var fetchPointsSuccess = function(points) {
                    points.forEach(function(point) {
                        createMarkerForPoint(point);
                    });
                };

                pointsService.getPoints(bounds).success(fetchPointsSuccess);
            });
        }

        function createMarkerForPoint(point) {
            if (!existingMarkerIds[point.osmId]) { // Don't want to add markers that already exist
                $scope.markers.push({
                    lat: point.latitude,
                    lng: point.longitude,
                    message: point['name']
                });
                existingMarkerIds[point.osmId] = true;
            }
        }
    }]);

    app.factory('pointsService', ['$http', function($http) {
        var service = {
            /**
             * Make an API call to fetch all the points within the specified bounds
             *
             * @param bounds A LatLngBounds instance
             */
            getPoints: function(bounds) {
                var requestParams = {
                    north: bounds.getNorth(),
                    east: bounds.getEast(),
                    south: bounds.getSouth(),
                    west: bounds.getWest()
                };

                return $http({
                    url: API_BASE_URL + API_POINTS_ENDPOINT,
                    method: 'GET',
                    params: requestParams
                });
            }
        };

        return service;
    }]);

//    // This hashtable is used to keep track of which points we've already added to the map.
//    // Uses the point's osmId as the key
//    var existingPointsByOsmId = {};
//
//    var map = L.map('map-view').setView(STARTING_COORDINATES, INITIAL_ZOOM);
//    map.on('load', fetchPointsInBounds(map.getBounds()));
//
//    L.tileLayer(, {
//        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//        maxZoom: 18
//    }).addTo(map);
//
//    /**
//     * Make an API call to get all the points (bus and train stops) within the given bounds.
//     *
//     * @param bounds A LatLngBounds instance
//     */
//    function fetchPointsInBounds(bounds) {
//        var requestData = {
//            north: bounds.getNorth(),
//            east: bounds.getEast(),
//            south: bounds.getSouth(),
//            west: bounds.getWest()
//        };
//
//        $.ajax({
//            method: 'GET',
//            url: API_BASE_URL + API_POINTS_ENDPOINT,
//            data: requestData
//        }).done(createMarkersFromPoints);
//    }
//
//    /**
//     * Given a list of points (bus and train stops), add leaflet markers to the map.
//     *
//     * @param points
//     */
//    function createMarkersFromPoints(points) {
//        busStopMarkers.clearLayers();
//        trainStopMarkers.clearLayers();
//
//        points.forEach(function(point) {
//            L.marker([point.latitude, point.longitude], {
//                title: point['name']
//            }).addTo(map);
//
//            if (point['type'] === "train") {
//                trainStopMarkers.addLayer(marker);
//            } else {
//                busStopMarkers.addLayer(marker);
//            }
//        });
//    }

})(jQuery, angular);