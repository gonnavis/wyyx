
angular.module('starter.controllers', [])
//***********************************************************************************************************************************************************************************************************************************************
.controller('allCtrl', function($scope,pn) {
	var $s=$scope;

})
//***********************************************************************************************************************************************************************************************************************************************
.controller('loginCtrl', function($scope,pn,im) {
	var $s=$scope;
	$s.m={};

	$s.login=function(){
		im.fn.login($s.m.account,$s.m.password);
	}
	im.ev.onConnect=function(){
		location='#/sessions';
	}
	im.ev.onDisconnect=function(error){
		alert(error.message);
	}

})
//***********************************************************************************************************************************************************************************************************************************************
.controller('sessionsCtrl', function($scope,pn,im) {
	var $s=$scope;
	painong.scope.sessions=$s;
	$s.data=im.data;
	$s.m={};

	im.ev.onSessions=function(sessions){
		console.log('sessions');
		console.log(sessions);
		$s.data=im.data;
		$s.$apply();
	}
	im.ev.onUpdateSession=function(session){
		console.log('session');
		console.log(session);
	}
	// im.ev.onSyncDone=function(){
	// 	$s.data=im.data;
	// 	$s.$apply();
	// }
})
//***********************************************************************************************************************************************************************************************************************************************
.controller('sessionCtrl', function($scope,pn,im,$location) {
	var $s=$scope;
	painong.scope.session=$s;
	$s.m={};

	$s.account=$location.search().account;
	im.fn.getHistoryMsgs($s.account);
	im.ev.getHistoryMsgsDone=function(error, obj){
		$s.msgs=obj.msgs.reverse();
		$s.$apply();
	}

	$s.send=function(){
		im.fn.sendText($s.account,$s.m.input);
		$s.m.input='';
	}
	im.ev.onUpdateSession=function(session){

	}
	im.ev.sendMsgDone=function(error, msg){
		if(!error){
			$s.msgs.push(msg);
			$s.$apply();
		}
	}
	im.ev.onMsg=function( msg){
		$s.msgs.push(msg);
		$s.$apply();
	}
})