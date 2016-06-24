
angular.module('starter', [
	'starter.controllers',
	'starter.services',
	'starter.directives',
	'ngRoute',
	'ngCookies',
])

.run(function($route) {

	location='#/login';

})

.config(function($routeProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$routeProvider

	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	})

	.when('/sessions', {
		templateUrl: 'templates/sessions.html',
		controller: 'sessionsCtrl'
	})

	.when('/session', {
		templateUrl: 'templates/session.html',
		controller: 'sessionCtrl'
	})

	$routeProvider.otherwise('/login');

})