var mapU = require('MapUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        _mapObject:null,//地图对象层上的对象，用来记录当前位置以及消失
        _type:1,//npc类型，1-对话npc 2-战斗npc 3-剧情npc
        _direction:1,//方向 1-左 2-上 3-右 4-下
        _tileSize:1,//格子size
        _mapSize:1,//地图size
        _map:null , //地图
        _state:1,//1静止 2促发
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.move();
    },
    initNpc(mapObject,type,direction,objs,map,tileSize,mapSize){
        this._mapObject = mapObject;
        this._type = type;
        this._direction = direction;
        this._objs = objs;
        this._map = map;
        this._tileSize = tileSize;
        this._mapSize = mapSize;
        this._tilepos = mapU.getTilePos(this.node.getPosition(),this._mapSize,this._tileSize);
        // console.log(this._tilepos,8888);
        
    },

    checkD(){
        // return;
        if(this._type==2){
            switch (this._direction){
                case 1:
                    if(this._tilepos.y == cc.HQ.playerTile.y&& this._tilepos.x>cc.HQ.playerTile.x &&this._tilepos.x-cc.HQ.playerTile.x<5){
                        this._state =2
                        this.move();
                    }
                    break;
                case 2:
                    if(this._tilepos.x == cc.HQ.playerTile.x&& this._tilepos.y<cc.HQ.playerTile.y&&this._tilepos.y-cc.HQ.playerTile.y>-5){
                        this._state =2
                        this.move();
                    }
                    break;
                case 3:
                    if(this._tilepos.y == cc.HQ.playerTile.y&& this._tilepos.x < cc.HQ.playerTile.x &&this._tilepos.x-cc.HQ.playerTile.x>-5){
                        this._state =2
                        this.move();
                    }
                    break;
                case 4:
                    if(this._tilepos.x == cc.HQ.playerTile.x&& this._tilepos.y>cc.HQ.playerTile.y && this._tilepos.y-cc.HQ.playerTile.y<5){
                        this._state =2
                        this.move();
                    }
                    break;
            }
        }
    },
    move(){
        cc.HQ.player.getComponent('player').changeState(2);
        var self = this;
        // var pos = this.node.getPosition();
        // var tilePos = mapU.getTilePos(pos,this._mapSize,this._tileSize);
        // var tilePos = cc.v2(tilePos.x, this._mapSize.height- tilePos.y);//修复地图偏差
        // console.log(tilePos,pos);
        switch (this._direction){
            case 1:
                this._tilepos.x -= 1;
                break;
            case 2:
                this._tilepos.y += 1;
                break;
            case 3:
                this._tilepos.x += 1;
                break;
            case 4:
                this._tilepos.y -= 1;
                break;
        }
        if(cc.HQ.playerTile.x==this._tilepos.x&&cc.HQ.playerTile.y==this._tilepos.y){
            //XXX 触发战斗
            return;
        }
        var nextPos = this._map.getPositionAt(this._tilepos);
        // if(){

        // }
        this.node.setPosition(nextPos.x,-nextPos.y);
        setTimeout(function(){
            self.move();
        },500)
        
    },

    update (dt) {
        // console.log(cc.HQ.playerTile,4343434343);
        if(cc.HQ.playerTile&&this._state == 1){
            this.checkD();
        }

    },
});
