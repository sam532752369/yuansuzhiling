//场景资源管理
var TweenMgr = require("TweenMgr");
cc.Class({
    extends: cc.Component,
    properties: {
        index_kuan:cc.Prefab,//首页
        _index_kuan_obj:null,

    },
    //加载资源例子（fun：操作后的执行函数）
    show_index_kuan:function(fun){
        fun = fun?fun:function(){};
        this._index_kuan_obj = cc.instantiate(this.index_kuan);
        this.node.addChild(this._index_kuan_obj);
        TweenMgr.scaleShow(this._index_kuan_obj,function(){
            this._index_kuan_obj.getComponent('index_kuan').init();
            fun();
        }.bind(this));
    },
    hide_index_kuan:function(fun){
        fun = fun?fun:function(){};
        TweenMgr.scaleHide(this._index_kuan_obj,function(){
            fun();
        }.bind(this));
    }
})