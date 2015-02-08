// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

$rootScope.getZomatoFromLatlong = function(){
  var position = marker.getLatLng();
  lat = Number(position['lat']);
  lng = Number(position['lng']);
  console.log(lat);
$.ajax({
    url: 'https://api.zomato.com/v1/geocode.json?lat='+lat+'&lon='+lng,
    type: 'GET',
    headers: {
        'X-Zomato-API-Key': '7749b19667964b87a3efc739e254ada2'
    },
    dataType: 'json',
    success: function (data) {
        console.log(data.locality.subzone_id);
        $.ajax({
          url: 'https://api.zomato.com/v1/search.json?city_id='+data.locality.city_id+'&subzone_id='+data.locality.subzone_id+'&count=50',
          type: 'GET',
          headers: {
            'X-Zomato-API-Key': '7749b19667964b87a3efc739e254ada2'
          },
          dataType: 'JSON',
          success: function(success){
            $rootScope.food = success.results;
            console.log($rootScope.food);
            $rootScope.$apply();
          },
          error: function(error){
            console.log(error);
          }
        });
        
    },
    error: function(err){
      console.log(err);
    }
});
}


})
.controller('OauthExample', function ($scope, $cordovaOauth, $rootScope) {
  $scope.googleLogin = function(){
    $cordovaOauth.google("124725328503-1u824iaaoe9rq28kubbe1s8ebso58ns3.apps.googleusercontent.com", ["https://www.googleapis.com/auth/plus.me", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/plus.circles.read", "https://www.googleapis.com/auth/plus.login"]).then(function(result1) {
            console.log(result1.access_token);
            var friends, userinfo;
            var setFriends = function(data){
              friends = data;
            }
            var setUserinfo = function(data){
              userinfo = data;
            }
            $.get('https://www.googleapis.com/plus/v1/people/me/people/visible?access_token='+result1.access_token, function(result2) {
              console.log(result2.items);
              setFriends(result2.items);
              $.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+result1.access_token, function(result3) {
                console.log(result3);
                setUserinfo(result3);
                $.post('http://localhost:1337/user/saveFriends', {myId: userinfo.id, data: userinfo, friends:friends}, function(data, textStatus, xhr) {
                  console.log('completed');
                });
              });
            });
            
        }, function(error) {
            console.log(error);
        });
  }
})
.controller('FoodController', function ($scope, $cordovaOauth, $rootScope) {

})

