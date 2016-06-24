
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
	im.fn={};

	var data = {};
	var pm={};
	var nim;

	im.ev={};
	im.fn.login=function(account,password){
		nim = NIM.getInstance({
		    // debug: true,
		    appKey: appKey,
		    account: account,
		    token: password,
		    onconnect: onConnect,
		    onwillreconnect: onWillReconnect,
		    ondisconnect: onDisconnect,
		    onerror: onError,
		    onsessions: onSessions,
		    onupdatesession: onUpdateSession,
		    onroamingmsgs: onRoamingMsgs,
		    onofflinemsgs: onOfflineMsgs,
		    onmsg: onMsg,
    		onsyncdone: onSyncDone,
		});
	}

	im.ev.onSyncDone=function(){};
	function onSyncDone() {
		console.info('onSyncDone');
	    console.log('同步完成');
	    im.ev.onSyncDone();
	}

	im.ev.onConnect=function(){};
	function onConnect() {
		console.info('onConnect');
	    console.log('连接成功');
	    im.ev.onConnect();
	}
    im.ev.onWillReconnect=function(){};
	function onWillReconnect(obj) {
		console.info('onWillReconnect');
	    // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
	    console.log('即将重连');
	    console.log(obj.retryCount);
	    console.log(obj.duration);
	    im.ev.onWillReconnect(obj);
	}
    im.ev.onDisconnect=function(){};
	function onDisconnect(error) {
		console.info('onDisconnect');
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
	    im.ev.onDisconnect(error);
	}
    im.ev.onError=function(){};
	function onError(error) {
		console.info('onError');
	    console.log(error);
	    im.ev.onError(error);
	}

    im.ev.onSessions=function(){};
	function onSessions(sessions) {
		console.info('onSessions');
	    console.log('收到会话列表', sessions);
		for(var i=0;i<sessions.length;i++){
			sessions[i].lastMsg.timeStr=new Date(sessions[i].lastMsg.time).toString();
		}
	    data.sessions = nim.mergeSessions(data.sessions, sessions);
	    updateSessionsUI();
	    im.ev.onSessions(sessions);
	}
    im.ev.onUpdateSession=function(){};
	function onUpdateSession(session) {
		console.info('onUpdateSession');
	    console.log('会话更新了', session);
		session.lastMsg.timeStr=new Date(session.lastMsg.time).toString();
	    data.sessions = nim.mergeSessions(data.sessions, session);
	    updateSessionsUI();
	    im.ev.onUpdateSession(session);
	}
	function updateSessionsUI() {
	    // 刷新界面
	}


    im.ev.onRoamingMsgs=function(){};
	function onRoamingMsgs(obj) {
		console.info('onRoamingMsgs');
	    console.log('收到漫游消息', obj);
	    pushMsg(obj.msgs);
	    im.ev.onRoamingMsgs(obj);
	}
    im.ev.onOfflineMsgs=function(){};
	function onOfflineMsgs(obj) {
		console.info('onOfflineMsgs');
	    console.log('收到离线消息', obj);
	    pushMsg(obj.msgs);
	    im.ev.onOfflineMsgs(obj);
	}
    im.ev.onMsg=function(){};
	function onMsg(msg) {
		console.info('onMsg');
	    console.log('收到消息', msg.scene, msg.type, msg);
	    pushMsg(msg);
	    switch (msg.type) {
	    case 'custom':
	        onCustomMsg(msg);
	        break;
	    case 'notification':
	        // 处理群通知消息
	        onTeamNotificationMsg(msg);
	        break;
	    default:
	        break;
	    }
	    im.ev.onMsg(msg);
	}
	function pushMsg(msgs) {
	    if (!Array.isArray(msgs)) { msgs = [msgs]; }
	    var sessionId = msgs[0].sessionId;
	    data.msgs = data.msgs || {};
	    data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
	}
    im.ev.onCustomMsg=function(){};
	function onCustomMsg(msg) {
		console.info('onCustomMsg');
	    // 处理自定义消息
	    im.ev.onCustomMsg(msg);
	}

	im.fn.sendText=function(account,text){
		var msg = nim.sendText({
		    scene: 'p2p',
		    to: account,
		    text: text,
		    done: sendMsgDone
		});
		console.log('正在发送p2p text消息, id=' + msg.idClient);
		pushMsg(msg);
	}
    im.ev.sendMsgDone=function(){};
	function sendMsgDone(error, msg) {
		console.info('sendMsgDone');
	    console.log(error);
	    console.log(msg);
	    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
	    pushMsg(msg);
	    im.ev.sendMsgDone(error, msg);
	}

	im.fn.getHistoryMsgs=function(account){
		nim.getHistoryMsgs({
		    scene: 'p2p',
		    to: account,
		    done: getHistoryMsgsDone
		});
	}
    im.ev.getHistoryMsgsDone=function(){};
	function getHistoryMsgsDone(error, obj) {
		console.info('getHistoryMsgsDone');
	    console.log('获取p2p历史消息' + (!error?'成功':'失败'));
	    console.log(error);
	    console.log(obj);
	    if (!error) {
	        console.log(obj.msgs);
	    }
	    im.ev.getHistoryMsgsDone(error, obj);
	}

	im.data=data;
	im.nim=nim;
	im.pm=pm;

	return im;

})