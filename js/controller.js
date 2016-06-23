
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
		im.fn.login({
			account:$s.m.account,
			password:$s.m.password,
			onConnect:function () {
			    console.log('连接成功');
			    // console.log(im.nim);
			    // debugger;
			    location='#/sessions';
			},
			onWillReconnect:function (obj) {
			    // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
			    console.log('即将重连');
			    console.log(obj.retryCount);
			    console.log(obj.duration);
			},
			onDisconnect:function (error) {
			    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
			    console.log('丢失连接');
			    console.log(error);
			    if (error) {
			        switch (error.code) {
			        // 账号或者密码错误, 请跳转到登录页面并提示错误
			        case 302:
			            break;
			        // 被踢, 请提示错误后跳转到登录页面
			        case 'kicked':
			            break;
			        default:
			            break;
			        }
			    }
			},
			onError:function (error) {
			    console.log(error);
			},
		})
	}

})
//***********************************************************************************************************************************************************************************************************************************************
.controller('sessionsCtrl', function($scope,pn,im) {
	var $s=$scope;
	painong.scope.sessions=$s;

	im.fn.sessions($s);
	$s.data=im.data;

	// console.log(im.nim);
	// debugger;

	// im.fn.sessions({
	// 	onSessions:function (sessions) {
	// 		// debugger;
	// 	    console.log('收到会话列表', sessions);
	// 	    for(var i=0;i<sessions.length;i++){
	// 	    	sessions[i].lastMsg.timeString=new Date(sessions[i].lastMsg.time).toString();
	// 	    }
	// 	    $s.sessions = im.nim.mergeSessions($s.sessions, sessions);
	// 	    updateSessionsUI();
	// 	},
	// 	onUpdateSession:function (session) {
	// 		// debugger;
	// 	    console.log('会话更新了', session);
	// 	    $s.sessions = im.nim.mergeSessions($s.sessions, session);
	// 	    updateSessionsUI();
	// 	},
	// })

	// debugger;

	// function updateSessionsUI(){
	// 	$s.$apply();
	// }
})
//***********************************************************************************************************************************************************************************************************************************************
.controller('sessionCtrl', function($scope,pn,im,$location) {
	var $s=$scope;
	painong.scope.session=$s;
	$s.m={};

	$s.account=$location.search().account;

	im.fn.getHistoryMsgs($s.account,function(error,obj){
	    console.log('获取p2p历史消息' + (!error?'成功':'失败'));
	    console.log(error);
	    console.log(obj);
	    if (!error) {
	        $s.msgs=obj.msgs.reverse();
	        $s.$apply();
	    }
	})

	$s.send=function(){
		im.fn.sendText($s.account,$s.m.input,function(error, msg){
		    console.log(error);
		    console.log(msg);
		    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
	        $s.msgs.push(msg);
	        $s.$apply();
		})
	}


})