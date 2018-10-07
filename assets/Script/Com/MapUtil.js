
var MapUtil = {
    extends: cc.Component,

    properties: {
        
    },

    start () {

    },
    //将像素坐标转化为瓦片坐标   像素坐标，地图size，格子size
    getTilePos: function(posInPixel,mapSize,tileSize) {

    var x = Math.floor(posInPixel.x / tileSize.width);
    var y = -Math.trunc((mapSize.height - Math.abs(posInPixel.y)) / tileSize.height);
    y = mapSize.height- y -1;
    // console.log(y,7878);
    return cc.p(x, y);
    },

    //根据传入瓦片坐标获取攻击范围
    //格子坐标
    //攻击类型 1-点 2 - 十字  3-方形  4 -菱形 5 - 射线 6-扇形
    //攻击范围
    //方向
    getAttackRange(tile,type,big,direction){
        var range = [];
        if(type==1){
            range.unshift(tile);
        }else if(type == 2){
            range.unshift(tile);
            for(var i = 0 ;i<4 ;i++){
                // console.log(big,1111111);
                for(var j = 1 ;j<=big ;j++){
                    if(i==0){
                        let a = cc.v2(tile.x-j,tile.y);
                        range.unshift(a);
                    }
                    if(i==1){
                        let a = cc.v2(tile.x,tile.y-j);
                        range.unshift(a);
                    }
                    if(i==2){
                        let a = cc.v2(tile.x+j,tile.y);
                        range.unshift(a);
                    }
                    if(i==3){
                        let a = cc.v2(tile.x,tile.y+j);
                        range.unshift(a);
                    }
                }
            }
        }else if(type == 3){
            let x = tile.x-big
            let y = tile.y-big
            for(var i = 0;i<2*big+1;i++){
                for(var j = 0;j<=2*big+1;j++){
                    let a = cc.v2(x+i,y+j);
                    range.unshift(a);
                }
            }
        }else if(type == 4){
            // range.unshift(tile);
            let big1 = big;
            for(var i = 0;i<=big;i++){
                let a = cc.v2(tile.x-i,tile.y);
                let b = cc.v2(tile.x+i,tile.y);
                if(a.x!=b.x){
                    range.unshift(a);
                    range.unshift(b);
                }else{
                    range.unshift(a);
                }
                for(var j = 1;j<=big1;j++){
                    let c = cc.v2(tile.x-i,tile.y-j);
                    let d = cc.v2(tile.x-i,tile.y+j);
                    let e = cc.v2(tile.x+i,tile.y-j);
                    let f = cc.v2(tile.x+i,tile.y+j);
                    if(c.x!=e.x){
                        range.unshift(c);
                        range.unshift(d);
                        range.unshift(e);
                        range.unshift(f);
                    }else{
                        range.unshift(c);
                        range.unshift(d);
                    }
                   
                }
                big1--;
                
            }
        }else if(type == 5){
            if(direction==1){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x-i,tile.y);
                    range.unshift(a);
                }
            }else if(direction==2){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x,tile.y-i);
                    range.unshift(a);
                }
            }else if(direction==3){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x+i,tile.y);
                    range.unshift(a);
                }
            }else if(direction==4){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x,tile.y+i);
                    range.unshift(a);
                }
            }
        }else if(type == 6){
            let big1 = 0;
            if(direction==1){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x-i,tile.y);
                    range.unshift(a);
                    for(var j = 0;j<big1;j++){
                        var b = cc.v2(tile.x-i,tile.y-j);
                        var c = cc.v2(tile.x-i,tile.y+j);
                        range.unshift(b);
                        range.unshift(c);
                    }
                    big1++;
                }
            }else if(direction==2){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x,tile.y-i);
                    range.unshift(a);
                    for(var j = 0;j<big1;j++){
                        var b = cc.v2(tile.x-j,tile.y-i);
                        var c = cc.v2(tile.x+j,tile.y-i);
                        range.unshift(b);
                        range.unshift(c);
                    }
                    big1++;
                }
            }else if(direction==3){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x+i,tile.y);
                    range.unshift(a);
                    for(var j = 0;j<big1;j++){
                        var b = cc.v2(tile.x+i,tile.y-j);
                        var c = cc.v2(tile.x+i,tile.y+j);
                        range.unshift(b);
                        range.unshift(c);
                    }
                    big1++;
                }
            }else if(direction==4){
                for(var i = 0;i<big;i++){
                    var a = cc.v2(tile.x,tile.y+i);
                    range.unshift(a);
                    for(var j = 0;j<big1;j++){
                        var b = cc.v2(tile.x-j,tile.y+i);
                        var c = cc.v2(tile.x+j,tile.y+i);
                        range.unshift(b);
                        range.unshift(c);
                    }
                    big1++;
                }
            }
        }
        return range;
    },
    // update (dt) {},
};
module.exports = MapUtil;
