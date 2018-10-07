var Md5 = require("Md5");
var Global = {

		debugMode: 1,
		login_url : "http://2login.test.llewan.com/api/login.api.php",//登陆地址
		pay_url: "http://2pay.test.llewan.com/index.php",//支付地址
		bug_url: "http://2admin.test.llewan.com/bug_report.php",//bug提交地址
		game_url:"http://2kun.test.llewan.com/index.php",//游戏地址
		

		img_url:"https://login1.test.llewan.com/",//额外图片的地址

		//返回unix时间截(到秒的)
		unixTime:function(){
			return Math.round(new Date().getTime()/1000);
		},

		//判断一维数组里是否存在这个值
		/*
		arr=>对应的数组,
		value=>要判断的值
		*/
		isInArray :function (arr,value){
			for(var i = 0; i < arr.length; i++){
				if(value === arr[i]){
					return true;
				}
			}
			return false;
		},

		//获取本地存诸的数据值
		getLocalStorage : function(name){
			var cookieVal = this.getCookie(name);
			if(!cookieVal){
				cookieVal = localStorage.getItem(name);
			}
			return cookieVal;
		},
		//获取Cookies的值
		getCookie :function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
				return unescape(arr[2]);
			}else{
				return null;
			}
		},
		//获取当前URL连接的所有参数并设置为公共变量的值
		UrlSearch : function() {
		   var name,value; 
		   var str=location.href; //取得整个地址栏
		   var num=str.indexOf("?") 
		   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

		   var arr=str.split("&"); //各个参数放到数组里
		   for(var i=0;i < arr.length;i++){ 
				num=arr[i].indexOf("="); 
				if(num>0){ 
					name=arr[i].substring(0,num);
					value=arr[i].substr(num+1);
					this[name]=value;
				} 
		    }
		},
		//获取当前URL连接中的某个参数值
		GetQueryString : function(name){
		    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if(r!=null){
				 return  unescape(r[2]);
			}else{ 
				return null;
			}
		},
		//获取某url数据中的某个参数值
		GetQueryString2 : function(str,name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = str.search.substr(1).match(reg);
			if(r!=null){
					return  unescape(r[2]);
			}else{ 
				return null;
			}
		},
		//移除当前页面的某个节点
		/*
		id=>节点的ID
		*/
		removeChild : function(id){
			if(id){
				try{
					var id0 = document.getElementById(id);
					id0.parentNode.removeChild(id0);
				}catch(e){
					console.log("parentNode remove:"+e+"id:"+id);
				}
			}
		},
		//获取某个范围的随机数据
		/*
		lowValue=>最小值,
		highValue=>最大值
		*/
		round : function(lowValue,highValue){
			var choice=highValue-lowValue;
			return Math.floor(Math.random()*choice+lowValue);
		},
		//把PHP获取的时间截(1527498193)转为 2018/5/28 下午5:03:13 格式的时间
		getLocalTime : function(nS) { 
			return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
		} ,
		//把JS的时间对像转化为 2018-5-28 5:03:13 格式的时间
		dateFormat:function(now) { 
			var year=now.getYear(); 
			var month=now.getMonth()+1; 
			var date=now.getDate(); 
			var hour=now.getHours(); 
			var minute=now.getMinutes(); 
			var second=now.getSeconds(); 
			return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
		},
		//判断html对象上是否存在某个css类
		/*
		obj=>html对象, 
		cls=>CSS类
		*/
		hasClass :function(obj, cls) { 
		    return  obj.classNam && obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
		},
		//往html对象上添加某个css类
		/*
		obj=>html对象, 
		cls=>CSS类
		*/
		addClass : function(obj, cls) {  
		    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
		},
		//删除html对象上的某个css类
		/*
		obj=>html对象, 
		cls=>CSS类
		*/ 
		removeClass : function(obj, cls) {  
		    if (this.hasClass(obj, cls)) {  
		        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
		        obj.className = obj.className.replace(reg, ' ');  
		    }  
		},
		//切换html对象上的某个css类(如果类存在,则删除,如果类不存在则添加)
		/*
		obj=>html对象, 
		cls=>CSS类
		*/ 
		toggleClass: function(obj,cls){  
		    if(this.hasClass(obj,cls)){  
		        this.removeClass(obj, cls);  
		    }else{  
		        this.addClass(obj, cls);  
		    }  
		},
		//在某节点上添加点击事件函数
		addClickEventListener : function(node,func,that){
				node.addClickEventListener(func.bind(that));
		},
		
		setTouchesSwallow : function(that){
			var listener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function (touch, event) {
					return true;
				}
			});
			//管理用户注册的事件监听器，根据触发的事件类型分发给相应的事件监听器
			cc.eventManager.addListener(listener, that);
		}

};

module.exports = Global;