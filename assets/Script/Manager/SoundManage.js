/**
 * 声音管理
 */

module.exports = {
    isPlayMusic: true,   //   
    b_music_effect: -1,  //表示我们游戏是否静音，0没有静音，1为静音;默认为开启  (静音的话，则背景音乐与点击啥的音效我都统一关闭)

    //播放背景音乐
    playBgMusic: function(num){
        var url =null;
        switch(num){
            case 0:  //游戏开始页面的背景音乐
                url = cc.url.raw("resources/Music/music_home.mp3");
            break;
            case 1:  //游戏主页面的背景音乐
                url = cc.url.raw("resources/Music/music_fightBg.mp3");
            break;
            case 2:  //关闭背景音乐
                url = cc.url.raw("resources/Music/music_fightBg.mp3");  
                cc.audioEngine.stopMusic(url, false);   
            break;
        }
        if(this.b_music_effect){  //不是静音时，播放
            cc.audioEngine.playMusic(url, true);  
            cc.audioEngine.setMusicVolume(1);
        }
    },

    //点击豆腐方块，播放点击音效
    playClickEffet: function(num){
        var url =null;
        switch(num){
            case 0:  //播放点击方块音效
                url = cc.url.raw("resources/Music/sound_click.mp3");
            break;
            case 1:  //播放旋转音效
                url = cc.url.raw("resources/Music/sound_rotate.mp3");
            break;
            case 2:  //播放消除方块音效
                url = cc.url.raw("resources/Music/sound_remove.mp3");
            break;
        }
        if(this.b_music_effect){  //不是静音时，播放
            cc.audioEngine.play(url, false, 1);    
        } 
    },

    //游戏中是否要有声音 (1开启， 0关闭)
    setAudio: function(b_mute){
        this.b_music_effect = (b_mute) ? 1 : 0;
        
    },

};