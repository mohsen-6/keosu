app.controller('authentification_gadgetController',function ($scope, $http, usSpinnerService) {

	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	/**************
	 * Routing part
	 **************/
	$scope.routing = function (page) {

		$scope.login = false;
		$scope.register = false;
	
		switch (page) {
			case 'login':
			$scope.login = true;
			break;
		
			case 'register':
			$scope.register = true;
			break;
		}
	}
	
	/**************
	 * Init part
	 **************/
	$scope.init = function(host, param, page, gadget, zone){
		$scope.param = {
			'host' :   host+param,
			'page' :   page,
			'gadget' : gadget,
			'zone' :   zone
		}
		$scope.loginInit();
	};

	/**************
	 * Login part
	 **************/
	$scope.loginInit = function(message,success) {
	
		usSpinnerService.spin('spinner');
		$scope.routing('login');
		$scope.loginError = message;
		$scope.loginSuccess = success;
		$http.get($scope.param.host + 'service/gadget/authentification/' + $scope.param.gadget + '/json/login').success(function(data) {
			usSpinnerService.stop('spinner');
			$scope.token = data.csrf_token;
		});
	}
	$scope.loginAction = function() {
	
		usSpinnerService.spin('spinner');
		$scope.loginError = null;
		var data = '_csrf_token='+$scope.token+'&_username='+$scope.username+'&_password='+$scope.password+'&ajax=true';
		$http.post($scope.param.host + 'login_check',data).success(function(data) {
			usSpinnerService.stop('spinner');
			if(!data.success) {
				$scope.loginInit(data.message);
			}
		});
	};
	
	/**************
	 * Register part
	 **************/
	$scope.registerInit = function(message) {
		usSpinnerService.spin('spinner');
		$scope.routing('register');
		$scope.registerError = message;
		$http.get($scope.param.host + 'service/gadget/authentification/' + $scope.param.gadget + '/json/register').success(function(data) {
			usSpinnerService.stop('spinner');
			$scope.token = data.csrf_token;
		});
	}

	$scope.registerAction = function() {
		
		$scope.registerError = null;
		if($scope.password.length < 5 ) {
			$scope.registerError = "a password must contain at least 5 characters";
		} else if($scope.password != $scope.password2) {
			$scope.registerError = "passwords don't match";
		} else {
			usSpinnerService.spin('spinner');
			var data = 'csrf_token='+$scope.token+'&username='+$scope.username+'&password='+$scope.password+'&password2='+$scope.password2+'&email='+$scope.email;
			$http.post($scope.param.host + 'service/gadget/authentification/' + $scope.param.gadget + '/json/register',data).success(function(data) {
				usSpinnerService.stop('spinner');
				if(data.success) {
					$scope.loginInit(null,"Registration completed you can now log in");
				} else {
					$scope.registerInit(data.message);
				}
			});
		}
	}
	
});
