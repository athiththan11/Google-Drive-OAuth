"use strict";

angular.module("app.controller", []).controller("AppController", [
    "$scope",
    "AppService",
    function($scope, AppService) {
        $scope.initialize = function() {
            $scope.getOAuthUrl();
        };

        $scope.getOAuthUrl = function() {
            AppService.getOAuthUrl().then(
                (data) => {
                    $scope.authUrl = data.url;
                },
                (err) => {
                    console.error(err);
                }
            );
        };

        $scope.file = "";
        $scope.message = { message: "", status: true };

        $scope.upload = function() {
            $scope.reset();

            var fileType = $scope.file.type;
            if (!(fileType == "image/png" || fileType == "image/jpg" || fileType == "image/jpeg")) {
                $scope.message = {
                    message: "Not an Image File!",
                    status: false
                };

                return;
            }

            console.log($scope.file);

            AppService.uploadImage($scope.file).then(
                (data) => {
                    $scope.file = "";
                    $scope.message = {
                        message: "Uploaded Successfully",
                        status: true
                    };
                },
                (err) => {
                    $scope.file = "";
                    $scope.message = {
                        message: "Something went wrong!",
                        status: false
                    };
                }
            );
        };

        $scope.clear = function() {
            $scope.file = "";
            $scope.reset();
        };

        $scope.reset = function() {
            $scope.message = {};
        };

        $scope.initialize();
    }
]);
