cc.Class({
    extends: cc.Component,
    properties: {
        tipLabel:cc.Label,
        _stateStr:'',
        _progress:0,
        _splash:null,
        _isLoading:false,
        progressBar1 :{
            type : cc.Node,
            default : null
        },

    },

    // use this for initialization
    onLoad: function () {
        console.log("onLoad");
        
    },
    
    start:function(){      
        console.log("call start.....");
        this.initMgr();
        this.startPreloading();
    },
    
    initMgr:function(){
        
        cc.HQ = {};//这是全局的公众变量
        //公共文件
        cc.HQ.Global = require("Global");
        cc.HQ.net = require("Net");
        var NetMgr = require("NetMgr");
        cc.HQ.netMgr = new NetMgr();
        cc.HQ.netMgr.init();
        //cc.HQ.netMgr.setDataEventHandler(this.node);
        cc.HQ.netMgr.dataEventHandler=this.node;
        cc.HQ.PlayerMgr = require("PlayerMgr");
        //游戏中默认开启声音
        cc.HQ.soundMgr =require("SoundManage");
        cc.HQ.soundMgr.setAudio(true);
        //记录声音选择的状态(开启或关闭) 用个全局变量cc.HQ.suoundState来控制
        cc.HQ.suoundState =true;
        //微信接口
        // cc.HQ.WechatApi = require('WechatApi');
        // cc.HQ.WechatApi.showShareMenu();

        this.onSetNode();
    },

    
    startPreloading:function(){
        this._stateStr = "加载中，请稍候";  
        this._isLoading = true;
        var that =this;

        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            if(that._isLoading){
                console.log("结果",completedCount/totalCount);
                that._progress = completedCount/totalCount;
                // that.tipLabel.string =(that._progress * 100).toFixed(0);
                if(that.progressBar1)that.progressBar1.getComponent(cc.ProgressBar).progress=that._progress;
            }
        };
        cc.director.loadScene("Game");
        // cc.HQ.WechatApi.wxlogin();
    },
    
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
            
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    },

    //监听事件
    onSetNode:function(){
        this.node.on('login_bak',function(data){
            console.log("监听要执行的事件!!!",data,data.detail.code,this.tipLabel.string);
            cc.HQ.WechatApi.getUser(data.detail);
            
        }.bind(this));

        this.node.on('open_bak',function(data){
            console.log("node:open_bak",data,data.detail);
            if(data.detail.code==1){
                // cc.HQ.WechatApi.set_sub_info();
                console.log("长连接成功");
                this.tipLabel.node.active =true;  //点击了获取信息按钮后，才显示加载信息
                cc.director.loadScene("Game");
            }else{
                console.log("长连接失败");
                cc.HQ.net.reconnect();
            }
            //cc.director.loadScene("Game");
        }.bind(this));
        
        //监听所有出错的事件回调
        this.node.on('error_bak',function(data){
            console.log("error_bak:",data);
        });

        //监听用户信息的更新
        this.node.on('user_info_mod_bak',function(data){
            console.log("user_info_mod_bak:",data);
        });
    },

});