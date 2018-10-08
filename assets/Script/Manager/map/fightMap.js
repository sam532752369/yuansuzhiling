var mapU = require('MapUtil');
var mapConfig = require('mapConfig');
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
        var self = this;
        //动态加载地图
        var theMap = this.node.addComponent(cc.TiledMap);
        let mapBG = mapConfig.fightMap[1].bg;
        cc.loader.loadRes(mapBG, function (err, map) {
            cc.log(map,8888);
            // 资源加载完成，为地图组件设置地图资源
            theMap.tmxAsset = map;
            // //地图
            self._tiledMap = self.node.getComponent(cc.TiledMap);
            self._tileSize = self._tiledMap.getTileSize();
            self._mapSize = self._tiledMap.getMapSize();
            //players对象层
            self._objectGroup = self._tiledMap.getObjectGroup('obj');
            //障碍物图层
            self._barrierGroup = self._tiledMap.getLayer('meta');
            //对象改为配置设置
            //循环对象层,设置对象位置
            for(var i in self._objectGroup.getObjects()){
                self.setObjectPos(self._objectGroup.getObjects()[i]);
            }
        });


        //初始化地图位置
        // this.node.setPosition(cc.visibleRect.bottomLeft);
        

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
