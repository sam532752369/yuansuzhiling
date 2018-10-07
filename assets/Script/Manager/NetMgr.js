
cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        _connectCount : 0
    },

    setDataEventHandler(dataEventHandler){
        this.dataEventHandler = dataEventHandler;
    },
    //时间传递
    dispatchEvent(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    init : function(){
        cc.HQ.net.addEvent('socket_error',function(proid,data){
            this.dispatchEvent("socket_error",this._connectCount);
        }.bind(this));

        cc.HQ.net.addEvent('socket_open',function(proid,data){
            cc.log(data);
            this._connectCount ++ ;
            this.dispatchEvent("socket_open",this._connectCount);
        }.bind(this));

        cc.HQ.net.addEvent('socket_close',function(proid,data){
             this.dispatchEvent("socket_close",this._connectCount);
        }.bind(this));
        
        //出错信息
        cc.HQ.net.addEvent('error_bak',function(proid,data){
            console.log(data);
             this.dispatchEvent("error_bak",data);
        }.bind(this));

        //心跳包
        cc.HQ.net.addEvent('heartbeat_bak',function(proid,data){
            console.log(data);
             this.dispatchEvent("heartbeat_bak",data);
        }.bind(this));

        //微信登录页面（loading）
        cc.HQ.net.addEvent('login_bak',function(proid,data){
            this.dispatchEvent("login_bak",data);
       }.bind(this));
       cc.HQ.net.addEvent('user_info_mod_bak',function(proid,data){
            this.dispatchEvent("user_info_mod_bak",data);
        }.bind(this));
        //游戏主页面（Index）
        cc.HQ.net.addEvent('init_game_bak',function(proid,data){
            this.dispatchEvent("init_game_bak",data);
       }.bind(this));

        //长连接回调
        cc.HQ.net.addEvent('open_bak',function(proid,data){
            console.log("长连接回调:",data);
            this.dispatchEvent("open_bak",data);

            //关闭重连预制体
            var recNode =cc.find("Canvas/reconnect");
            if(recNode){
                recNode.removeFromParent();    
            }
        }.bind(this));

        //客户端获取开始游戏信息(AJAX)回调
        cc.HQ.net.addEvent('init_game_bak',function(proid,data){
            console.log("游戏开始回调:",data);
             this.dispatchEvent("init_game_bak",data);
        }.bind(this));
        
       

    }
});
