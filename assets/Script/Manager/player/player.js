var mapU = require('MapUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        camera:cc.Node,
        _tiledMap:null,//地图组件
        _tileSize:null,//地图格子size
        _mapSize:null,//地图size
        _barrierGroup:null,//阻碍层
        _objectGroup:null,//对象层
        _state:1,//1自由移动  2战斗准备或触发剧情，不能移动
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {// 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    start () {

    },
    init(map,tilepos){
        this._tiledMap = map;
        this.playerTile = tilepos;
        this._tileSize = this._tiledMap.getTileSize();
        this._mapSize = this._tiledMap.getMapSize();
        //players对象层
        this._objectGroup = this._tiledMap.getObjectGroup('obj');
        //障碍物图层
        this._barrierGroup = this._tiledMap.getLayer('meta');
    },
    onKeyDown (event) {
        var newTile = cc.p(this.playerTile.x, this.playerTile.y);
        // console.log('cc.KEY.down');
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.KEY.w:
                newTile.y += 1;
                break;
            case cc.KEY.s:
                newTile.y -= 1;
                break;
            case cc.KEY.a:
                newTile.x -= 1;
                break;
            case cc.KEY.d:
                newTile.x += 1;
                break;
        }
        if(this._state==1){
            this.tryMoveToNewTile(newTile);
        }
        
    },
    changeState(state){
        this._state = state;
    },

    //移动到新的地图格
    tryMoveToNewTile: function(newTile) {
        var mapSize = this._tiledMap.getMapSize();
        //出了边界
        if (newTile.x < 0 || newTile.x >= mapSize.width){
            return;
        }
        if (newTile.y < 0 || newTile.y >= mapSize.height){
            return;
        } 
        //地图为空
        if (!this._barrierGroup.getTileGIDAt(newTile)) {//GID=0,则该Tile为空
            cc.log('This way is blocked!');
        }
        //当遇到阻碍层时返回
        var newTile1 = cc.v2(newTile.x, mapSize.height- newTile.y-1);//修复地图偏差
        // var newTile1 = newTile;//修复地图偏差
        if(this._barrierGroup.getTileGIDAt(newTile1)==49){
            return false;
        }
        //当遇到对象层时返回
        // console.log(newTile,888)
        for(var i in this._objectGroup.getObjects()){
            var point = this._objectGroup.getObjects()[i].offset;
            var pos = cc.v2(point.x, point.y);
            //转成地图坐标
            var tilepos = mapU.getTilePos(pos,this._mapSize,this._tileSize);
            // console.log(this._objectGroup.getObjects()[i].offset,999);
            if(tilepos.x==newTile.x&&tilepos.y==newTile.y){
                // this._objectGroup.getObjects()[i].offset = cc.v2(0,0);
                return false;
            }
        }
        // if(this._objectGroup.getTileGIDAt(newTile1)==49){
        //     return false;
        // }
        // console.log(this.playerTile,888888);
        this.playerTile = newTile;
        this.updatePlayerPos();

        if (cc.pointEqualToPoint(this.playerTile, this.endTile)) {
            cc.log('succeed');
        }
    },
    //更新玩家位置
    updatePlayerPos: function() {
        cc.HQ.playerTile = this.playerTile;
        var pos = this._barrierGroup.getPositionAt(this.playerTile);
        this.node.setPosition(pos.x,-pos.y);
        if(this.camera){
            this.camera.setPosition(pos.x,-pos.y);
        }
    },
    // update (dt) {},
});
