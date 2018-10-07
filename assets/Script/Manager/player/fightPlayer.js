var mapU = require('MapUtil');
cc.Class({
    extends: cc.Component,
    properties: {
        tilebasePrefab:cc.Prefab,
        tilePanel:cc.Node,//放置显示格子层
        _tiledMap: null,//地图组件
        _tileSize: null,//地图格子size
        _mapSize: null,//地图size
        _barrierGroup: null,//阻碍层
        _objectGroup: null,//对象层
        _playerState:2,//1移动  2准备发动技能 3确定技能位置
        _attackTile: null,//技能攻击选中位置
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {// 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.openshowTile();
        this.initPool(); 
        this.changeState(2);
    },

    start() {

    },
    initPool() {
        this._tilebasePool = new cc.NodePool();
    },
    init(map, tilepos) {
        this._tiledMap = map;
        this.playerTile = tilepos;
        this._tileSize = this._tiledMap.getTileSize();
        this._mapSize = this._tiledMap.getMapSize();
        //players对象层
        this._objectGroup = this._tiledMap.getObjectGroup('obj');
        //障碍物图层
        this._barrierGroup = this._tiledMap.getLayer('meta');
    },
    //==================================攻击
    //添加点击事件
    openshowTile() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, function (e) {
            //获取当前点击的全局坐标    
            var temp = e.getLocation()
            //  cc.log("点击全局坐标： ",temp.x,temp.y)   
            //获取当前点击的局部坐标           
            var tempPlayer = this.node.parent.convertToNodeSpaceAR(temp)
            var tempPlayer = cc.v2(tempPlayer.x, tempPlayer.y - 15);
            //  cc.log("点击局部坐标： ",tempPlayer.x,tempPlayer.y)
            var tile = mapU.getTilePos(tempPlayer, this._mapSize, this._tileSize);
            cc.log(this, 4444);
            cc.log(this._playerState, 4444);
            if(this._playerState==1){
                // console.log(this._playerState,'================');
                var pos = this._barrierGroup.getPositionAt(tile);
                this.node.setPosition(pos.x, -pos.y);
            }else if(this._playerState==2){
                if(this._attackTile==tile){//确定技能施放位置
                    //XXX 造成伤害
                }else{
                    this._attackTile = tile;
                    this.recoverTileBase();
                    //获取技能格子位置
                    var arr = mapU.getAttackRange(tile, 4, 3, null);
                    for (var i in arr) {
                        if(arr[i].x<0||arr[i].y<0||arr[i].x>this._mapSize.width-1||arr[i].y>this._mapSize.height-1){
                            continue;
                        }
                        var pos = this._barrierGroup.getPositionAt(arr[i]);
                        var tilebase = this.getTileBase();
                        tilebase.setPosition(pos.x, -pos.y);
                        this.tilePanel.addChild(tilebase);
                    }
                }
                
            }
        }, this);
    },
    showAttackTile(){

    },
    //回收图上的格子显示
    recoverTileBase(){
        var childs = this.tilePanel.children;
        for(var i =0;i<childs.length;){
            let c = childs[0];
            // cc.log(childs.length,'length');
            this._tilebasePool.put(c);
        }
       
    },
    getTileBase() {
        // console.log(this._tilebasePool,88);
        if (this._tilebasePool.size() > 0) {
            var tilebase = this._tilebasePool.get();
        } else {
            var tilebase = cc.instantiate(this.tilebasePrefab);
            cc.log('');
            // sp.
        }
        return tilebase;
    },



    // onKeyDown(event) {
    //     var newTile = cc.p(this.playerTile.x, this.playerTile.y);
    //     // console.log('cc.KEY.down');
    //     // set a flag when key pressed
    //     switch (event.keyCode) {
    //         case cc.KEY.w:
    //             newTile.y += 1;
    //             break;
    //         case cc.KEY.s:
    //             newTile.y -= 1;
    //             break;
    //         case cc.KEY.a:
    //             newTile.x -= 1;
    //             break;
    //         case cc.KEY.d:
    //             newTile.x += 1;
    //             break;
    //     }
    //     if (this._state == 1) {
    //         this.tryMoveToNewTile(newTile);
    //     }

    // },
    changeState(state) {
        this._playerState = state;
    },
    //=============================移动
    //移动到新的地图格
    tryMoveToNewTile: function (newTile) {
        var mapSize = this._tiledMap.getMapSize();
        //出了边界
        if (newTile.x < 0 || newTile.x >= mapSize.width) {
            return;
        }
        if (newTile.y < 0 || newTile.y >= mapSize.height) {
            return;
        }
        //地图为空
        if (!this._barrierGroup.getTileGIDAt(newTile)) {//GID=0,则该Tile为空
            cc.log('This way is blocked!');
        }
        //当遇到阻碍层时返回
        var newTile1 = cc.v2(newTile.x, mapSize.height - newTile.y - 1);//修复地图偏差
        // var newTile1 = newTile;//修复地图偏差
        if (this._barrierGroup.getTileGIDAt(newTile1) == 49) {
            return false;
        }
        //当遇到对象层时返回
        // console.log(newTile,888)
        for (var i in this._objectGroup.getObjects()) {
            var point = this._objectGroup.getObjects()[i].offset;
            var pos = cc.v2(point.x, point.y);
            //转成地图坐标
            var tilepos = mapU.getTilePos(pos, this._mapSize, this._tileSize);
            // console.log(this._objectGroup.getObjects()[i].offset,999);
            if (tilepos.x == newTile.x && tilepos.y == newTile.y) {
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
    // //更新玩家位置
    updatePlayerPos: function () {
        cc.HQ.playerTile = this.playerTile;
        var pos = this._barrierGroup.getPositionAt(this.playerTile);
        this.node.setPosition(pos.x, -pos.y);
        if (this.camera) {
            this.camera.setPosition(pos.x, -pos.y);
        }
    },
    // update (dt) {},
});