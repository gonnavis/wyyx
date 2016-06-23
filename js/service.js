
angular.module('starter.services', [])

.factory('pn', function($http,$q) {

	//***********************************************************************************************************************************************************************************************************************************************
	var pm={};//pm=param

	//***********************************************************************************************************************************************************************************************************************************************
	var api={};
	api.empty=function(){
		var params={
		};

		return $http({
			method: 'POST',
			url: pm.apiUrl+'',
			data:fn.getPostDataText(params),
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' , 'Accept':'*/*'}
		})
	}

	//***********************************************************************************************************************************************************************************************************************************************
	var apip={};//api plus
	apip.get_payments_get_all=function(){
		var promise=api.get_payments_get_all();
		promise.then(function(data){
			pm.payments=data.data.data;
			pm.payment_first=pm.payments[Object.keys(pm.payments)[0]];
		})
		return promise;
	}

	//***********************************************************************************************************************************************************************************************************************************************
	var fn={};//fn=function
	fn.getPostDataText=function(obj){
		var postDataText='';
		for(var key in obj){
			postDataText+=key+'='+obj[key]+'&'
		}
		postDataText=postDataText.slice(0,-1);
		return postDataText;
	}

	//***********************************************************************************************************************************************************************************************************************************************
	var pn={};
	pn.api=api;
	pn.apip=apip;
	pn.fn=fn;
	pn.pm=pm;

	return pn;
})

.factory('im',function(){

	var appKey='6b745cf1e3082a06c8a2ffdb731844c7';

	var im={};
	painong.im=im;
	var data = {};
	var currentScope;

	var fn={};

	// login
		fn.login=function(params){
			im.nim = NIM.getInstance({
				appKey:appKey,
				account:params.account,
				token:params.password,
			    onconnect:params.onConnect,
				onwillreconnect:params.onWillReconnect,
				ondisconnect:params.onDisconnect,
				onerror:params.onError
			});
			// console.log(nim);
			// debugger;
		}

	// sessions
		fn.sessions=function(scope){
			im.nim.setOptions({
				onsessions:onSessions,
				onupdatesession:onUpdateSession,
			})
			currentScope=scope;
		}

		function onSessions(sessions) {
		    console.log('收到会话列表', sessions);
		    for(var i=0;i<sessions.length;i++){
		    	sessions[i].lastMsg.timeString=new Date(sessions[i].lastMsg.time).toString();
		    }
		    data.sessions = im.nim.mergeSessions(data.sessions, sessions);
		    updateSessionsUI();
		}
		function onUpdateSession(session) {
		    console.log('会话更新了', session);
		    data.sessions = im.nim.mergeSessions(data.sessions, session);
		    updateSessionsUI();
		}
		function updateSessionsUI() {
		    // 刷新界面
		    currentScope.$apply();
		}

	// getHistoryMsgs
		fn.getHistoryMsgs=function(account,getHistoryMsgsDone){
			im.nim.getHistoryMsgs({
			    scene: 'p2p',
			    to: account,
			    done: getHistoryMsgsDone
			});
		}

	// sendText
		fn.sendText=function(account,text,sendMsgDone){
			var msg = im.nim.sendText({
			    scene: 'p2p',
			    to: account,
			    text: text,
			    done: sendMsgDone,
			});
			console.log('正在发送p2p text消息, id=' + msg.idClient);
		}

	im.data=data;
	im.fn=fn;

	return im;
})