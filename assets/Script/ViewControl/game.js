//场景页面
cc.Class({
    extends: cc.Component,

    properties: {
       _prefabs:null,
       prefabM:[cc.Prefab],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //设置当前监听事件的场景
        cc.HQ.netMgr.setDataEventHandler(this.node);
        //监听事件
        this.onSetNode();
        console.log(7878787);
        //map
        var a = cc.instantiate(this.prefabM[1])
        this.node.addChild(a);
        a.setPosition(-240,240);
        

    },
    //监听事件
    onSetNode: function(){
        //前后台切换 监听
        cc.game.on(cc.game.EVENT_HIDE, function(){
            console.log("游戏进入后台");
        },this);
        cc.game.on(cc.game.EVENT_SHOW, function(){
            console.log("重新返回游戏");
        },this);
    },
    
    //update
    update (dt) {
        
    }

    

});
