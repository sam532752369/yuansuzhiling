var Global = require("Global");
//这个是微信api接口
var WechatApi = {

    userCode : null,//暂时保存的code
    phoneInfo:null,//保存用户设备信息
    userInfo : null,//用户的授权信息
    tmpUserInfo:null,//临时存储的用户信息
    webSockeInfo:null,//ws的信息
    shareTicket:null,//群分享时的shareTicket
    query:null,//这是小程序打开时带进来的参数
    setting_but:false,//记录是否打开过授权设置
    shareTitle:"(,,•́ . •̀,,)别戳我啦，受不了啦啊啊啊~",//分享标题　不可变
    shareImageUrl:Global.img_url+"res/shareimg/jf.png",//分享时的图片　　不可变
    shareQuery:"",//分享时的参数　　不可变

    shareTitle2:"(,,•́ . •̀,,)别戳我啦，受不了啦啊啊啊~",//分享标题　可改变
    shareImageUrl2:Global.img_url+"res/shareimg/jf.png",//分享时的图片　可改变
    shareQuery2:"",//分享时的参数　可改变

    shareInfoData:{//分享的文字数组
        "fs":{
            'img':[Global.img_url+'res/shareimg/fs.png'],//分享图->图片地址
            'info':['你别点！豆腐君就不带你玩╭(╯^╰)╮']//图片说明
        },
        "bs":{
            'img':[Global.img_url+'res/shareimg/bs.png'],//加步数->图片地址
            'info':['( ˘ ³˘)♥明明可以靠脸吃饭，却偏要靠才华']//图片说明
        },
        "jf":{
            'img':[Global.img_url+'res/shareimg/jf.png'],//转发图->图片地址
            'info':['(,,•́ . •̀,,)别戳我啦，受不了啦啊啊啊~']//图片说明
        }
    },

    //通过微信登录的接口获取到code给到服务端可以获取到openid和uinionid
    wxlogin:function(){
        wx.login({
            success:(res) => {
                //保存下code
                WechatApi.userCode = res.code;
                //这里发送用户的code给服务端
                var mydata = {"a":"login","m":"user","d":{"code":res.code}};
                //看看有没有推广参数
                console.log(WechatApi.query);
                if(typeof(WechatApi.query)!="undefined" && WechatApi.query!=null && WechatApi.query!=''){
                    if(typeof(WechatApi.query.uid)!="undefined" && WechatApi.query.uid!=""){
                        console.log("参数：",WechatApi.query.uid,mydata.d.reid,typeof(WechatApi.query.uid));
                        mydata.d.reid = WechatApi.query.uid;
                    }else{
                        console.log("参数2：",typeof(WechatApi.query.uid));
                    }
                    if(typeof(WechatApi.query.sid)!="undefined" && WechatApi.query.sid!=""){
                        mydata.d.sid = WechatApi.query.sid;
                    }
                    if(typeof(WechatApi.query.sid2)!="undefined" && WechatApi.query.sid2!=""){
                        mydata.d.sid2 = WechatApi.query.sid2;
                    }
                }else{
                    console.log("参数3：",WechatApi.query);
                }
                //操作系统
                if(typeof(WechatApi.phoneInfo.system)!="undefined"){
                    mydata.d.sys = WechatApi.phoneInfo.system;
                }
                console.log("这是登陆要提交的数据:",mydata);
                cc.HQ.net.packAjaxSend(cc.HQ.Global.login_url,mydata,"POST");
            },
            fail:(res) => {
                console.log('失败',res);
            }
        })
    },
    //接受服务端的用户信息
    getUser:function(mydata){
        console.log("mydata",mydata);
        //存一下用户的信息
        //mydata = JSON.parse( mydata );
        switch(mydata.code){
            case 1:
                cc.HQ.PlayerMgr.info = mydata.d.info;//用户的信息
                cc.HQ.net.wsServer = mydata.d.ws.ws.ws;//webstock信息
                console.log("信息",mydata.d.info,mydata.d.ws.ws.ws);
                
                //设置转发时把当前用户的uid带上
                WechatApi.shareQuery = "uid="+cc.HQ.PlayerMgr.info.uid
                if(typeof(cc.HQ.PlayerMgr.info.sid)!="undefined"){
                    WechatApi.shareQuery += "&sid="+cc.HQ.PlayerMgr.info.sid
                }
                if(typeof(cc.HQ.PlayerMgr.info.sid2)!="undefined"){
                    WechatApi.shareQuery += "&sid2="+cc.HQ.PlayerMgr.info.sid2
                }
                //获取用户的最新信息
                WechatApi.getSetting('scope.userInfo');
                break;
            case 2:
                //获取不到用户信息
                console.log("getUser获取用户信息出错");
                break;
        }
    },
    //获取用户授权的设置，看看用户有没有授权(scope:表示授权哪个接口，例如用户信息则填写scope.userInfo)
    getSetting:function(scope){
        wx.getSetting({
          success: (res) => {
            var authSetting = res.authSetting
            if (authSetting['scope.userInfo'] === true) {
                //用户已授权，可以直接调用API
                console.log("授权成功");
                //这里直接调用授权
                WechatApi.getuserinfo();
                
            } else if (authSetting['scope.userInfo'] === false){
                // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                console.log("您已经拒绝授权登录，请点击小程序右上角开启授权设置");
                //如果这里没有创建过授权按钮，再一次引导用户授权
                if(WechatApi.setting_but){
                    //由于用户再一次拒绝授权，这里直接建立stocke并进入游戏
                    cc.HQ.net.init(cc.HQ.net.wsServer+'/?token='+cc.HQ.PlayerMgr.info.token,function(){});
                }else{
                    WechatApi.openSetting();
                }
            } else {
                // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                if(scope == 'scope.userInfo'){//用户信息需要用户点击获取

                    WechatApi.createUserInfoButton();
                }else{
                    WechatApi.authorize(scope);
                }
            }
          },
            fail:(res) => {
                console.log('失败@@@@@@',res);
            }
        })
    },
    
    //弹出各个用户授权(scope:表示授权哪个接口，例如用户信息则填写scope.userInfo)
    authorize:function(scope){
        //调用一下授权提示，让用户授权
        wx.authorize({
            scope: scope,
            success:(res) =>{
                console.log("授权"+scope+"成功",res);
            },
            fail: (res) => {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                    // 处理用户拒绝授权的情况
                    console.log("您已经拒绝授权登录，请点击小程序右上角开启授权设置");
                }    
            }
        })
    },
    //生成获取用户信息的按钮
    createUserInfoButton:function(){
        
        //WechatApi.getSystemInfo();//先获取下手机的信息
        var buttonwidth = 180;  //150
        var buttonheight = 76;//按钮的高 40
        var buttonleft = (WechatApi.phoneInfo.windowWidth - buttonwidth)/2;
        var buttontop = (WechatApi.phoneInfo.windowHeight - buttonheight)/2+15;
        let userButton = wx.createUserInfoButton({
            type: 'image',
            // text: '点击获取信息',
            image:cc.HQ.Global.img_url+'res/shareimg/kaishiyouxi.png',
            style: {
                left: buttonleft,
                top: buttontop,
                width: buttonwidth,
                height: buttonheight,
                lineHeight: buttonheight,
                //backgroundColor: '#cccccc',
                color: '#ffffff',
                textAlign: 'center',
                //fontSize: 16,
                //borderRadius: 4
            }
        });
        
        userButton.onTap(function(res) {
            //摧毁掉按钮；
           userButton.destroy();
           if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                // 处理用户拒绝授权的情况
                console.log("您已经拒绝授权登录，请点击小程序右上角开启授权设置");
                //由于用户拒绝授权，这里直接建立stocke并进入游戏
                cc.HQ.net.init(cc.HQ.net.wsServer+'/?token='+cc.HQ.PlayerMgr.info.token,function(){});
                //cc.director.loadScene('Game');
                  
            }else{
                //先把最新的用户信息保存起来
                WechatApi.tmpUserInfo = res;
                //发送code和用户信息给服务端
                WechatApi.sendUserInfo();
            }
            
        });
    },
    //获取手机的信息
    getSystemInfo:function(){
        wx.getSystemInfo({
            success:(res) => {
                console.log(res);
                WechatApi.phoneInfo = res;

            }
        });
        //return phoneInfo;
    },
    //获取用户的授权信息
    getuserinfo:function(){
        wx.getUserInfo({
            withCredentials:true,
            lang:'zh_CN',
            success:(res) => {
                //先把最新的用户信息保存起来
                WechatApi.tmpUserInfo = res;
                //这里发送给服务端
                WechatApi.sendUserInfo();
            },
            fail:(res) =>{
                console.log('用户拒绝授权，获取不到信息',res);
                //这里创建授权按钮，再一次引导用户授权
                if(WechatApi.setting_but){
                    //由于用户再一次拒绝授权，这里直接建立stocke并进入游戏
                    cc.HQ.net.init(cc.HQ.net.wsServer+'/?token='+cc.HQ.PlayerMgr.info.token,function(){});
                }else{
                    WechatApi.openSetting();
                }
                //WechatApi.openSetting();
            }
        })
    },
    //把获取到的用户信息发给服务端
    sendUserInfo:function(){
        //这里先判断用户的名字和图片是不是一样的，不一样的话需要把最新的用户信息发给服务器
        let user = cc.HQ.PlayerMgr.info;
        let newuser = WechatApi.tmpUserInfo;
        let newUserInfo = JSON.parse(newuser.rawData);
        if(user.name != newUserInfo.nickName || user.pic != newUserInfo.avatarUrl || user.sex != newUserInfo.gender){
            cc.HQ.PlayerMgr.info.name = newUserInfo.nickName;//更新新的名字
            cc.HQ.PlayerMgr.info.pic = newUserInfo.avatarUrl;//更新新的头像
            cc.HQ.PlayerMgr.info.sex = newUserInfo.gender;//更新玩家性别
            //处理一下给服务器的信息
            let mydata = {"a":"user_info_mod","m":"user","d":{"rawData":newuser.rawData,"signature":newuser.signature,"encryptedData":newuser.encryptedData,"iv":newuser.iv}};
             cc.HQ.net.packAjaxSend(cc.HQ.Global.login_url,mydata,"POST");
        }
        //进入游戏
        cc.HQ.net.init(cc.HQ.net.wsServer+'/?token='+cc.HQ.PlayerMgr.info.token,function(){});
        //cc.director.loadScene('Game');
    },
    //如果用户拒绝授权，则提醒他授权
    openSetting:function(){
        //WechatApi.getSystemInfo();//先获取下手机的信息
        var buttonwidth = 180;
        var buttonheight = 76;//按钮的高
        var buttonleft = (WechatApi.phoneInfo.windowWidth - buttonwidth)/2;
        var buttontop = (WechatApi.phoneInfo.windowHeight - buttonheight)/2+15;
        let OpenSettingButton = wx.createOpenSettingButton({
            type: 'image',
            //text: '去授权',
            image:cc.HQ.Global.img_url+'res/shareimg/kaishiyouxi.png',
            style: {
                left: buttonleft,
                top: buttontop,
                width: buttonwidth,
                height: buttonheight,
                lineHeight: buttonheight,
                backgroundColor: '#cccccc',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })
        OpenSettingButton.onTap(function(res) {
            //摧毁掉按钮；
            OpenSettingButton.destroy();
            WechatApi.setting_but = true;
            WechatApi.wxlogin();
        });
    },
    //在页面中开启“转发”功能 分享（这里默认打开分享，并且带shareTicket）
    showShareMenu:function(){
        wx.showShareMenu({
            withShareTicket:true,
            success:function(){
                console.log('设置分享按钮成功');
            },
            fail:function(){
                console.log('设置分享按钮失败');
            }
        });
        /*
        wx.onShow(res => {
            console.log('这是群分享进来的' + res.shareTicket,res);
            WechatApi.shareTicket = res.shareTicket;
            WechatApi.query       = res.query;
        });
        */
        var tmp_data = wx.getLaunchOptionsSync();
        console.log('这是群分享进来的',tmp_data);
        if( tmp_data.scene == 1007 || tmp_data.scene == 1008 || typeof(tmp_data.query)!="undefined" ){
            WechatApi.shareTicket =tmp_data.shareTicket?tmp_data.shareTicket:'';
            WechatApi.query       =tmp_data.query;
        }
        //设置点转发时的提示内容
        this.onShareAppMessage();
        //获取手机的相关信息
        this.getSystemInfo();
    },

    /*设置分享的信息（被动监听右上角的分享按钮）
        title:标题
        imageUrl：分享的图片
        query:分享是携带的参数（必须是 key1=val1&key2=val2 的格式）
    */
    onShareAppMessage:function(){
        console.log("onShareAppMessage");
        wx.onShareAppMessage(function(){
            console.log("wx.onShareAppMessage");
            return {
                title:WechatApi.shareTitle,
                imageUrl:WechatApi.shareImageUrl,
                query:WechatApi.shareQuery
            }
        })
    },

    /*
        设置分享的信息,主动调起转发，进入选择通讯录界面（主动监听在界面上主动设置分享的按钮让用户分享）
        title:标题
        imageUrl：分享的图片
        query:分享是携带的参数（必须是 key1=val1&key2=val2 的格式）
    */
    shareAppMessage:function(){
        console.log("shareAppMessage");
        wx.shareAppMessage({
            title:WechatApi.shareTitle2,
            imageUrl:WechatApi.shareImageUrl2,
            query:WechatApi.shareQuery2
        })
    },
    //拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用
    /*只能在开放数据域下使用的！！！！
    mykey要获取的key(这个要求是数组，例如：["score"])
    */
    getFriendCloudStorage:function(mykey){
        console.log("getFriendCloudStorage");
        wx.getFriendCloudStorage({
            keyList:mykey,
            success: function(data) {
                console.log(data);
            },
            fail: function() {
                console.log('获取好友的分数出错');
            },
            complete: function() {
                console.log('正在获取好友的分数');
            }
        })
    },

    //改变分享显示的标题
    /*
    query:分享是携带的参数（必须是 key1=val1&key2=val2 的格式）
    type:分享类型(WechatApi.shareInfoData.fs,WechatApi.shareInfoData.bs,WechatApi.shareInfoData.js)
    */
    setShareInfo(query,type){
        console.log("设置分享信息成功",type);
        if(typeof(type)!="undefined"){
            WechatApi.shareTitle2=type.info[cc.HQ.Global.round(0,type.info.length)];
            WechatApi.shareImageUrl2=type.img[0];
        }
        //设置分享时的参数
        if(query!="undefined" && query!='' && query!=null){
            WechatApi.shareQuery2=query;
        }else{
            WechatApi.shareQuery2=WechatApi.shareQuery;
        }
    },
    //设置子域的信息openid和群分享的ticket
    set_sub_info:function(data){
        var data = {'type':'SaveUserInfo','openid':cc.HQ.PlayerMgr.info.openid,'ticket':WechatApi.shareTicket};
        cc.HQ.WechatApi.send_data_to_sub(data);
    },
    //获取当前用户托管数据当中对应 key 的数据。该接口只可在开放数据域下使用
    /*只能在开放数据域下使用的！！！！
    mykey要获取的key(这个要求是数组，例如：["score"])
    */
    getUserCloudStorage:function(mykey){
        console.log("getUserCloudStorage");
        wx.getUserCloudStorage({
            keyList:mykey,
            success: function(data) {
                console.log(data);
            },
            fail: function() {
                console.log('获取自己分数出错');
            },
            complete: function() {
                console.log('正在获取自己的分数');
            }
        })
    },
    //在小游戏是通过群分享卡片打开的情况下，可以通过调用该接口获取群同玩成员的游戏数据。该接口只可在开放数据域下使用。
    /*只能在开放数据域下使用的！！！！
    mykey要获取的key(这个要求是数组，例如：["score"])
    ticket 群分享生成的key(这个要求在游戏刚加载的时候就得获取了)
    例如在游戏加载页这样：
    wx.onShow(res => {
        var shareTicket = res.shareTicket;
    });
    */
   getGroupCloudStorage:function(mykey,ticket){
        console.log("getGroupCloudStorage");
        wx.getGroupCloudStorage({
            shareTicket: ticket,  //需要带上shareTicket
            keyList:mykey,
            success: function(data) {
                console.log(data);
            },
            fail: function() {
                console.log('获取群里的分数出错');
            },
            complete: function() {
                console.log('正在获取群里的分数');
            }
        })
    },

    //从主域把数据传给子域
    /*
    mydata要传的数据，
    格式为数据对像，例如：
    {
            type: 'group',
            data: shareTicket,
            key:[]
    }
    */
    send_data_to_sub:function(mydata){
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(mydata);
    },

    //在子域里接收主域传过来的数据,这个函数需要依据需求扩展
    get_data_from_main:function(){
        wx.onMessage(data => {
            console.log(data);
        });
    },
    //调起客服功能
    get_msg_Customer:function(){
        console.log("get_msg_Customer");
        wx.openCustomerServiceConversation({
            sessionFrom:"1",// 	string 	'' 	否 	会话来源 	
            showMessageCard:true,//	boolean 	false 	否 	是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话之后会收到一个消息卡片，通过以下三个参数设置卡片的内容 	
            sendMessageTitle:"欢迎联系豆腐君",// 	string 	'' 	否 	会话内消息卡片标题 	
            sendMessagePath:"",// 	string 	'' 	否 	会话内消息卡片路径 	
            sendMessageImg:cc.HQ.Global.img_url+'res/shareimg/share.png',// 	string 	'' 	否 	会话内消息卡片图片路径 	
            success:function(){// 	function 		否 	接口调用成功的回调函数 	
                console.log("调用客户功能成功");
            },
            fail:function(){//	function 		否 	接口调用失败的回调函数 	
                console.log("调用客户功能失败");
            },
            complete:function(){// 	function 		否 	接口调用结束的回调函数（调用成功、失败都会执行）
                console.log("调用客户功能结束");
            }
        });
    }



}

module.exports = WechatApi;


        

        
