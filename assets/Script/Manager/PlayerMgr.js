
/*
info 信息包括:
'sid'       => "渠道ID",
'sid2'      => "渠道ID2",
'uid' 		=> "玩家uid",
"name"=>"用户微信名称",
"nickname"=>"用户呢称",
"pic"=>"用户头像",
"sex"=>"用户性别"
token=>用户的登陆key(这个是登陆时添加的!)
*/

module.exports = {
    info : null,//玩家自己的信息
    prop : null,//用户的属性

    //设置玩家自己的信息(为了更新的时候不随便更新token)
    setInfo:function(data){
        if(typeof(data.token)!="undefined"){
            this.info = data;
        }else{
            data.token = this.info.token;
            this.info = data;
        }
    }

}
