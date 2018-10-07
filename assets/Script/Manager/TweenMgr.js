
var Tween = {
	scaleShow:function(handleNode,fun){
		handleNode.scaleX = 0;
		handleNode.scaleY = 0;
		var showAct = cc.scaleTo(0.1,1,1);
		handleNode.runAction(cc.sequence(showAct,cc.callFunc(function(){
			fun();
		})))
	},
	scaleHide:function(handleNode,fun){
		var showAct = cc.scaleTo(0.1,0,0);
		handleNode.runAction(cc.sequence(showAct,cc.callFunc(function(){
			fun();
		})))
	},
	
		

};

module.exports = Tween;