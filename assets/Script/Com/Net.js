/*
网络连接公共库
*/
//新事件对像
/*
proid=>事件ID,
param=>事件参数,
func=>事件回调函数
*/
var NetEventObject = function(proid,param,func){ 
	this.a = proid;
	this.d = param;
	this.func = func;
}
//要发送的数据打包格式
/*
proid=>要执行的事件ID,
mode=>要执行的模块ID,
msg=>传送的数据,
packCount=>数据包顺序号
token=>用户的登陆key
*/
var ProtoTos = function(proid,mode,msg,packCount,token){
	this.a = proid;
	this.m = mode;
    this.d = msg;
	this.seq = packCount;
	if(typeof(token)!="undefined"){
		this.token = token;
	}else{
		this.token = "";
	}
};
//心跳包格式
var P10000 = function(){
	var t = new Date();
	var d={"a":t.getTime()};
	if( typeof(cc.HQ)!="undefined" 
		&& typeof(cc.HQ.PlayerMgr)!="undefined" 
		&& typeof(cc.HQ.PlayerMgr.info)!="undefined"
	){
		d.n = cc.HQ.PlayerMgr.info.name;
	}
	return d;
};
var MapKey = require("Map"); 
var Net = {
	wsServer: null, //连接的websocket服务器
	packCount : 0,//发包的顺序
	websocket : null,//websocket连接句柄
	state : 0,//websocket连接状态
	// eventMap: new MapKey(),//获取对应地图上的事件
	eventMap: new MapKey(),//获取对应地图上的事件
	heartPacket_int:null,//心跳定时器
	fun:null,//要执行的初始化内容
	//初始化websocket连接
	/*
	wsServer=>websocket服务器地址,
	fun=>初始化websocket需要执行的回调函数
	*/
	init : function(wsServer,fun){
		wsServer = wsServer.replace("ws://","");
		wsServer = "ws://"+wsServer;
		this.fun = fun;
		this.wsServer = wsServer;

		//创建websocket事件
		this.websocket = new WebSocket(wsServer);
		this.packCount = 0;
		//打开websocket连接
		this.websocket.onopen = function (evt) {
			//console.log(evt);
			//cc.HQ.net.event('socket_open',evt.data);
			this.state = 1;
			//创建连接完成时运行需要初始化的回调
			fun();
			//设置每10秒发送一次心跳包
			this.heartPacket_int = setInterval(function(){
				Net.heartPacket();
			},50000);
		}.bind(this);
		//关闭连接
		this.websocket.onclose = function (evt) {
			cc.log("close");
			cc.HQ.net.event('socket_close',evt.data);
			//如果连接被关闭,则进行重连
			this.reconnect();
		}.bind(this);
		//监听信息的接收
		this.websocket.onmessage = function (evt) {
			if(evt.data != "PONG"){
				//var o = eval("("+evt.data+")");
				var o = JSON.parse(evt.data);
				if(typeof(o.a)!="undefined"){
					console.log("返回的数据:",evt.data);
					//执行消息中需要做的事件
					cc.HQ.net.event(o.a,o);
				}else{
					console.log("不存在事件",o);
				}
			}else{
				console.log("PONG");
			}
		};
		//监听websocket出错
		this.websocket.onerror = function (evt) {
			console.log(evt.data);
			cc.HQ.net.event('socket_error',evt.data);
		}
	},
	//进行重连
	reconnect : function(){
		if(this.heartPacket_int!=null){
			clearInterval(this.heartPacket_int);
		}
		this.heartPacket_int=null;
		this.packCount = 0;
		console.log("reconnect重新连接");
		this.init(this.wsServer,this.fun);
	},

	//发送心跳包
	heartPacket : function(){
			var p10000 = new P10000();
			this.packSend("heartbeat","user_login",JSON.stringify(p10000));
	},
	//发送信息
	/*
	proid=>事件ID,
	mode=>要执行的模块ID,
	msg=>消息
	*/
	packSend : function(proid,mode,msg){
		if(this.packCount+1 > 255){
			var newpackCount = 0;
		}else{
			var newpackCount = this.packCount + 1;
		}
		console.log("proid:"+proid+" mode:" + mode +" newpackCount:"+newpackCount);
		//打包要发送的数据
		var data = this.pack(proid,mode,msg,newpackCount);
		if(this.websocket.readyState == 3){
			this.packCount = 0;
			this.websocket.close();
			return false;
		}else if(this.websocket.readyState == 1){
			this.send(data);
			this.packCount = newpackCount;
			return true;
		}
	},

	//AJAX发送信息
	/*
	url=>请求地址,
	data=>要发送的数据数组(注意不是JSON格式如:{"a":"login","m":"user","d":{}}),
	method=>POST 或者 GET
	*/
	packAjaxSend : function(url,data,method){
		//如果有用户的登陆token
		if( cc.HQ.PlayerMgr && cc.HQ.PlayerMgr.info && cc.HQ.PlayerMgr.info.token ){
			var data2 = this.packAjax(data.a,data.m,data.d,1,cc.HQ.PlayerMgr.info.token);
		}else{//如果没有
			var data2 = this.packAjax(data.a,data.m,data.d,1,'');
		}
        this.httpRequest(url,data2,method);
    },


	//ajax请求数据
	/*
	url=>请求的地址,
	data=>要提交的数据(是JSON数据来的,例如: {} ),
	cb=>回调函数,
	method=>请求方式(GET 或者 POST ,默认为 POST)
	*/
	httpRequest : function(url,data,method){
		var xhr = cc.loader.getXMLHttpRequest();
		var method2 = method ? method:"POST";
		xhr.open(method2, url);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var responseText=xhr.responseText;
				console.log("这是返回来的数据:"+responseText);
				var object = JSON.parse(responseText);
				if(typeof(object.a)!="undefined"){
					console.log("这是要执行的事件",object.a);
					//执行消息中需要做的事件
					cc.HQ.net.event(object.a,object);
				}else{
					console.log("不存在事件"+object);
				}
			}
		}
		xhr.send(data);
	},



	//执行对应的事件
	/*
	proid=>事件ID,
	data=>相关数据
	*/
	event : function(proid,data){
		var eventObj = this.eventMap.get(proid);
		if(eventObj != null){
			try {
				//判断是否需要执行完事件之后回调
				if(eventObj.d){//需要事件后回调
					eventObj.func(proid, data,eventObj.d);
				}else{//不需要事件后回调
					eventObj.func(proid, data);
				}
			}catch(e){//如果事件执行出错,则上报出错日志
				
				console.log("有出错日志");
				console.log(proid,e);
			}
		}else{//如果没有对应的事件,则输出错误
			
			console.log("有出错日志");
			console.log("不存在事件:"+proid,data);

		}		
	},
	//添加事件到地图上
	/*
	proid=>事件ID,
	func=>事件回调函数,
	param=>事件回调参数
	*/
	addEvent : function(proid,func,param){
		var eb = new NetEventObject(proid,param,func);
		this.eventMap.put(proid,eb);
	},
	//移动地图上的事件
	removeEvent : function(proid){
		this.eventMap.remove(proid);
	},
	//打包要发送的数据
	pack : function(proid,mode,msg,packCount){
		var vo = new ProtoTos(proid,mode,msg,packCount);
		var s = JSON.stringify(vo); 
		return s;
	},
	//打包要发送的Ajax数据
	packAjax : function(proid,mode,msg,packCount,token){
		var vo = new ProtoTos(proid,mode,msg,packCount,token);
		var s = "token="+vo.token;
		for(var k in vo ){//遍历vo
			if(k=='token'){
				continue;
			}
			if(k=='d'){
				s += "&" +k + "=" + encodeURIComponent(JSON.stringify(vo[k])); 
			}else{
				s += "&"+k+"="+vo[k];
			}
		}  
		return s;
	},
	//websocket发送数据
	/*
	Data=>已经打好包的事符串数据
	*/
	send : function(Data){
		this.websocket.send(Data);
	}
};
module.exports = Net;