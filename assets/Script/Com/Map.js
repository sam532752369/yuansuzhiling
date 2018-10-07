
//地图上事件处理

cc.Class({
    extends: cc.Component,

	properties :{
        _entrys : [] //事件列表数组
    },
    //设置事件
    /*
    key=>存放事件的对像ID, 
    value=>事件内容
    */
    put : function(key, value){
        if (key === null || key === undefined) {
            return;
        }
        var index = this._getIndex(key);
        if (index === -1) {
            var entry = {};
            entry.key = key;
            entry.value = value;
            this._entrys[this._entrys.length] = entry;
        }else{
            this._entrys[index].value = value;
        }        
    },
    //获取对像ID对应的事件
    /*
    key=>存放事件的对像ID, 
    */
    get : function(key){
        var index = this._getIndex(key);
        return (index != -1) ? this._entrys[index].value : null;
    },
    //移除对像ID对应的事件
    /*
    key=>存放事件的对像ID, 
    */
    remove : function(key){
        var index = this._getIndex(key);
        if (index != -1) {
            this._entrys.splice(index, 1);
        }
    },
    //清除地图的所有事件
    clear : function(){
        this._entrys.length = 0;
    },
    //查找对像ID对应的事件是否存在(存在返回true,不存在返回false)
    contains : function(key){
        var index = this._getIndex(key);
        return (index != -1) ? true : false;
    },
    //获取地图设置的事件个数
    getCount : function(){
        return this._entrys.length;
    },
    //获取地图设置的事件列表
    getEntrys :  function(){
        return this._entrys;
    },
    //查找对像ID对应的事件索引(如果没有找到则返回 -1)
    /*
    key=>存放事件的对像ID, 
    */
    _getIndex : function(key){
        if (key === null || key === undefined) {
            return -1;
        }
        var _length = this._entrys.length;
        for (var i = 0; i < _length; i++) {
            var entry = this._entrys[i];
            if (entry === null || entry === undefined) {
                continue;
            }
            if (entry.key === key) {//equal
                return i;
            }
        }
        return -1;
    }

});
