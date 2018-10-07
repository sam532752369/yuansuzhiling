var mapU = require('MapUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        player:cc.Node,
        map:cc.Node,
        npcPrefab:[cc.Prefab],
        _tilebasePool:null,
        _tiledMap:null,//地图组件
        _tileSize:null,//地图格子size
        _barrierGroup:null,//阻碍层
        _objectGroup:null,//对象层
    },

    
    onLoad: function () {
        cc.HQ.player = this.player;
        this.loadMap();
        // console.log(mapU.getAttackRange(cc.v2(5,5),2,3),454545);
        
    },
   
    //加载地图文件时调用
    loadMap: function () {
        //初始化地图位置
        // this.node.setPosition(cc.visibleRect.bottomLeft);
        //地图
        this._tiledMap = this.node.getComponent(cc.TiledMap);
        this._tileSize = this._tiledMap.getTileSize();
        this._mapSize = this._tiledMap.getMapSize();
        //players对象层
        this._objectGroup = this._tiledMap.getObjectGroup('obj');
        //障碍物图层
        this._barrierGroup = this._tiledMap.getLayer('meta');
        //循环对象层,设置对象位置
        for(var i in this._objectGroup.getObjects()){
            this.setObjectPos(this._objectGroup.getObjects()[i]);
        }
        //结束位置
        // var endPos = cc.p(0, 1000);
        // this.endTile = this.getTilePos(endPos);
        //更新player位置
        // this.updatePlayerPos();
    },

    //设置对象的位置
    setObjectPos(obj){
        var point = obj.offset;
        // console.log(point,99);
        var pos = cc.v2(point.x, point.y);
        //转成地图坐标
        var tilepos = mapU.getTilePos(pos,this._mapSize,this._tileSize);
        // var tilepos = this.getTilePos(pos);
        // console.log(tilepos,888);
        if(obj.name=='p1'){
            //转出来的坐标以左下为锚点
            console.log(tilepos,88);
            this.player.getComponent('fightPlayer').init(this._tiledMap,tilepos);
            this.player.getComponent('fightPlayer').updatePlayerPos();
        }else if (obj.name=='npc'){
            // console.log(); 
            var npc = cc.instantiate(this.npcPrefab[0]);
            npc.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/images/npc/npc1.jpg'));
            this.map.addChild(npc)
            var npcpos = this._barrierGroup.getPositionAt(tilepos);
            npc.setPosition(npcpos.x,-npcpos.y);
            npc.getComponent('npc').initNpc(npc.getPosition(),1,Number(obj.getProperties()['direction']),null,this._barrierGroup,this._tileSize,this._mapSize);
            // npc.getComponent('npc').move();
        }
        else if (obj.name=='enemy'){
            // console.log(obj.name);
            var npc = cc.instantiate(this.npcPrefab[0]);
            npc.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/images/npc/npc1.jpg'));
            this.map.addChild(npc)
            var npcpos = this._barrierGroup.getPositionAt(tilepos);
            npc.setPosition(npcpos.x,-npcpos.y);
            npc.getComponent('npc').initNpc(npc.getPosition(),2,Number(obj.getProperties()['direction']),null,this._barrierGroup,this._tileSize,this._mapSize);
            // npc.getComponent('npc').move();
            npc.getComponent('npc').checkD();
        }


        
    },

    //用瓦片坐标获取位置
    getPos: function(tile) {
        var pos = this._barrierGroup.getPositionAt(tile);
    },

    

    
    

});
