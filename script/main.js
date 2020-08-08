"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(param) {
    //var random = param.random;// 乱数生成器
    var scene = new g.Scene({
        game: g.game,
        assetIds: ["rule"]      
    });
    var scene2 = new g.Scene({
        game: g.game,
        
    });
    var time = 60; // 制限時間
    var ruletime=5;//説明時間
    var timeall=1;//総合経過フレーム計算用(g.game.age)
    var gravity=1;//重力(変更可)
    var jumpp=7;//ジャンプ力(変更可)
    var jumpcount=1;//ジャンプ回数(2回まで)
    var v=0;//縦方向速度(計算用)
    var click=0;//クリックした時間
    var clicking=false;//クリック状態
    
    if (param.sessionParameter.totalTimeLimit) {
        time = param.sessionParameter.totalTimeLimit-ruletime-5; // セッションパラメータで制限時間が指定されたらその値を使用します
    }
    // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
    g.game.vars.gameState = { score: 0 , playThreshold: 1};
    scene2.loaded.add(function () {
        var haikei = new g.FilledRect({//haikei
            scene: scene2,
            cssColor: "white",
            opacity:0.7,
            width: g.game.width,
            height: g.game.height,
        });
        if (param.isAtsumaru) {
            haikei.opacity=1;
        }
        scene.append(haikei);
        var yuka2 = new g.FilledRect({//haikei
            scene: scene2,
            cssColor: "white",
            opacity:1,
            width: g.game.width,
            height: g.game.height/5,
            y:g.game.height*0.85
        });
        scene.append(yuka2);
        var yuka = new g.FilledRect({//haikei
            scene: scene2,
            cssColor: "black",
            opacity:1,
            width: g.game.width,
            height: g.game.height/40,
            y:g.game.height*0.85
        });
        scene.append(yuka);
    });
    g.game.pushScene(scene2);
    scene.loaded.add(function () {
        // ここからゲーム内容を記述します
        var bullets = new g.E({//弾置き場
            scene: scene,
            width: g.game.width,
            height: g.game.height,
        });
        scene.append(bullets);
        scene.pointDownCapture.add(function (){
            click=timeall;
            clicking=true;
            jumpcount++;
        });
        scene.pointUpCapture.add(function (){
            clicking=false;
        });
        var pl = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "black",
            opacity:1,
            angle:0,
            width: g.game.width/50,
            height: g.game.height/2,
            tag:{xy:[0,0,0,0,0,0,0,0]},
            anchorX: 0.5, 
            anchorY: 0.5
        });
        pl.x=(g.game.width-pl.height)*0.25;
        pl.y=g.game.height*0.8-pl.height/2;
        //pl.tag.xy=[pl.width/2,-pl.width/2,-pl.width/2,pl.width/2,-pl.height/2,-pl.height/2,pl.height/2,pl.height/2];            
        scene.append(pl);
        var takasa=((Math.abs(Math.cos(pl.angle/180*Math.PI)*pl.height)+Math.abs(Math.sin(pl.angle/180*Math.PI)*pl.width))/2);
        pl.update.add(function () {//ジャンプ時の挙動
            pl.opacity=1.0;
            takasa=((Math.abs(Math.cos(pl.angle/180*Math.PI)*pl.height)+Math.abs(Math.sin(pl.angle/180*Math.PI)*pl.width))/2);           
            if(clicking&&timeall-click<=10&&jumpcount<=2){//ジャンプ中
                v=-jumpp;
                if(jumpcount==1){
                    pl.angle+=4;
                }else{
                    pl.angle+=6;
                }
                pl.y+=v;
            }else if(pl.y<(g.game.height*0.85-takasa)){//空中
                v+=gravity;                
                if(pl.y+v>(g.game.height*0.85-takasa)){//着地直前
                    pl.y=(g.game.height*0.85-takasa);
                    v=0;
                    jumpcount=0;
                }else{
                    if(jumpcount==1){
                        pl.angle+=4;
                    }else{
                        pl.angle+=6;
                    }
                    pl.y+=v;
                }
            }else{//着地
                pl.y=(g.game.height*0.85-takasa);
                v=0;
                jumpcount=0;
            }
            pl.tag.xy=[
                pl.x+Math.cos(pl.angle/180*Math.PI)*pl.width/2+Math.sin(pl.angle/180*Math.PI)*pl.height/2,
                pl.x-Math.cos(pl.angle/180*Math.PI)*pl.width/2+Math.sin(pl.angle/180*Math.PI)*pl.height/2,
                pl.x-Math.cos(pl.angle/180*Math.PI)*pl.width/2-Math.sin(pl.angle/180*Math.PI)*pl.height/2,
                pl.x+Math.cos(pl.angle/180*Math.PI)*pl.width/2-Math.sin(pl.angle/180*Math.PI)*pl.height/2,
                pl.y+Math.sin(pl.angle/180*Math.PI)*pl.width/2-Math.cos(pl.angle/180*Math.PI)*pl.height/2,
                pl.y-Math.sin(pl.angle/180*Math.PI)*pl.width/2-Math.cos(pl.angle/180*Math.PI)*pl.height/2,
                pl.y-Math.sin(pl.angle/180*Math.PI)*pl.width/2+Math.cos(pl.angle/180*Math.PI)*pl.height/2,
                pl.y+Math.sin(pl.angle/180*Math.PI)*pl.width/2+Math.cos(pl.angle/180*Math.PI)*pl.height/2];
            pl.modified();
        });
        /*///確認用
        var point1 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "black",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point2 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "red",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point3 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "green",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point4 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "blue",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        scene.append(point1);
        scene.append(point2);
        scene.append(point3);
        scene.append(point4);
        scene.update.add(function (e) {
            point1.x=pl.tag.xy[0];
            point1.y=pl.tag.xy[4];
            point1.modified();
            point2.x=pl.tag.xy[1];
            point2.y=pl.tag.xy[5];
            point2.modified();
            point3.x=pl.tag.xy[2];
            point3.y=pl.tag.xy[6];
            point3.modified();
            point4.x=pl.tag.xy[3];
            point4.y=pl.tag.xy[7];
            point4.modified();
        });/*/
        function bullet(yoko,high,speed,color) {//弾データ               
            var shot = new g.FilledRect({//haikei
                scene: scene,
                cssColor: "black",
                opacity:1,
                width: 16,
                height: 16,
                tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
            });          
            shot.x = g.game.width+yoko;
            shot.y = high;
            if(color==1){
                shot.cssColor="red";
            }else if(color==2){
                shot.cssColor="blue";
            }else{
                shot.cssColor="green";
            }          
            shot.update.add(function () {
                // 毎フレームで座標を確認し、画面外に出ていたら弾をシーンから取り除きます
                if (shot.x < (-shot.width)){
                    shot.destroy();
                }           
                shot.x -= speed;
                shot.tag.xy=[shot.x+shot.width,shot.x,shot.x,shot.x+shot.width,shot.y,shot.y,shot.y+shot.height,shot.y+shot.height];
                shot.modified();
            });
            bullets.append(shot);
        };
        bullet(0,-200,10,1);//開始時に何か置いとかないといけない
        function danmaku(nm){//弾幕セット
            switch(nm){
                case 0://test
                    bullet(0,240,10,2);
                    bullet(0,260,10,2);
                    bullet(120,30,10,2);
                    bullet(120,50,10,2);
                    bullet(240,240,10,2);
                    bullet(240,260,10,2);
                break;
                case 1://大ジャンプ
                    for (var x = 0; x < 5; x++) {
                        bullet(x * 25, 280, 10, 1);
                    }
                    break;
                case 2://上練習
                    bullet(0,70,10,1);
                bullet(0,90,10,1);
                bullet(0,110,10,1);
                bullet(150,70,10,1);
                bullet(150,90,10,1);
                bullet(150,110,10,1);
                    break;
                case 3://中練習
                    bullet(0,150,10,1);
                    bullet(0,170,10,1);
                    bullet(0,190,10,1);
                    bullet(150,150,10,1);
                    bullet(150,170,10,1);
                    bullet(150,190,10,1);
                break;
                case 4://下練習
                    bullet(0,230,10,1);
                    bullet(0,250,10,1);
                    bullet(0,270,10,1);
                    bullet(150,230,10,1);
                    bullet(150,250,10,1);
                    bullet(150,270,10,1);
                break;
                case 5://上下練習
                bullet(0,30,10,1);
                bullet(0,50,10,1);
                bullet(150,30,10,1);
                bullet(150,50,10,1);               
                bullet(0,280,10,1);
                bullet(0,260,10,1);
                bullet(150,280,10,1);
                bullet(150,260,10,1);
                break;
                case 11://大ジャンプ
                for(var x=0;x<7;x++){
                    bullet(x*25,260,10,2);
                }    
                break;
                case 12://上下
                for(var x=0;x<5;x++){
                    bullet(0,30+x*20,10,x%2+1);
                    bullet(200,280-x*20,10,x%2+1);
                }
                    break;  
                case 13://下上
                for(var x=0;x<5;x++){
                    bullet(200,30+x*20,10,x%2+1);
                    bullet(0,280-x*20,10,x%2+1);
                }
                break;
                case 14://上壁
                for(var x=0;x<7;x++){
                    bullet(50,30+20*x,10,2);                   
                }
                bullet(50,170,10,1); 
                break;
                case 15://間
                for(var x=0;x<5;x++){
                    bullet(x*25,30,10,2);
                    bullet(x*25,280,10,2);
                } 
                break;
                case 21://大ジャンプ
                bullet(0,240,10,3);
                bullet(25,240,10,2);
                bullet(200,240,10,2);
                bullet(225,240,10,3);
                for(var x=2;x<8;x++){
                    bullet(x*25,240,10,1);
                } 
                break;
                case 22://上下上
                    bullet(0,30,10,3);
                    bullet(0,50,10,2);
                    bullet(0,70,10,1);
                    bullet(120,240,10,1);
                    bullet(120,260,10,2);
                    bullet(120,280,10,3);
                    bullet(240,30,10,3);
                    bullet(240,50,10,2);
                    bullet(240,70,10,1);
                    break;  
                case 23://下上下
                    bullet(0,240,10,1);
                    bullet(0,260,10,2);
                    bullet(0,280,10,3);
                    bullet(120,30,10,3);
                    bullet(120,50,10,2);
                    bullet(120,70,10,1);
                    bullet(240,240,10,1);
                    bullet(240,260,10,2);
                    bullet(240,280,10,3); 
                break; 
                case 24://高く
                    bullet(50,280,10,3);
                    bullet(50,260,10,3);
                    bullet(50,240,10,3);
                    bullet(50,220,10,3);
                    bullet(50,200,10,2);
                    bullet(50,180,10,2);
                    bullet(50,160,10,1);
                    bullet(50,140,10,1);
                break;
                case 25://低い上下
                for(var x=0;x<4;x++){
                    bullet(50,30+x*20,10,2);
                }
                bullet(50,110,10,1);
                bullet(50,240,10,1);
                bullet(50,260,10,2);
                bullet(50,280,10,3); 
                break;
                case 26://間
                for(var x=0;x<7;x++){
                    if(x==0||x==6){
                        bullet(x*25,30,10,3);
                    bullet(x*25,280,10,3);
                    }else if(x==1||x==5){
                        bullet(x*25,30,10,2);
                    bullet(x*25,280,10,2);
                    }else if(x>=2&&x<=4){
                        bullet(x*25,30,10,1);
                    bullet(x*25,280,10,1);
                    }
                }
                break;
                case 31://大ジャンプ
                for(var x=2;x<10;x++){
                    bullet(x*20,280,10,3);
                }
                bullet(0,280,10,1);
                bullet(20,280,10,2);
                bullet(200,280,10,2);
                bullet(220,280,10,1);
                for(var x=3;x<9;x++){
                    bullet(x*20,260,10,2);
                }
                bullet(20,260,10,1);
                bullet(40,260,10,2);
                bullet(180,260,10,2);
                bullet(200,260,10,1);
                for(var x=4;x<8;x++){
                    bullet(x*20,240,10,2);
                }
                bullet(40,240,10,1);
                bullet(60,240,10,1);
                bullet(160,240,10,1);
                bullet(180,240,10,1);
                for(var x=3;x<9;x++){
                    bullet(x*20,220,10,1);
                }
                for(var x=4;x<8;x++){
                    bullet(x*20,200,10,1);
                }
                for(var x=5;x<7;x++){
                    bullet(x*20,180,10,1);
                }
                break;
                case 32://上下
                    bullet(50,280,10,3);
                    bullet(50,260,10,3);
                    bullet(50,240,10,2);
                    bullet(50,220,10,2);
                    bullet(50,200,10,1);
                    bullet(50,110,10,1);
                    bullet(50,90,10,2);
                    bullet(50,70,10,2);
                    bullet(50,50,10,3);
                    bullet(50,30,10,3);
                break;
                case 33://右下
                    bullet(40,30,10,3);
                    bullet(60,50,10,3); 
                    bullet(80,70,10,2); 
                    bullet(100,90,10,2); 
                    bullet(120,110,10,1);
                    bullet(140,130,10,1);
                    bullet(0,180,10,1);
                    bullet(20,200,10,1);
                    bullet(40,220,10,2);
                    bullet(60,240,10,2);
                    bullet(80,260,10,3);
                    bullet(100,280,10,3);  
                break;
                case 34://右上
                    bullet(120,30,10,3);
                    bullet(100,50,10,3); 
                    bullet(80,70,10,2); 
                    bullet(60,90,10,2); 
                    bullet(40,110,10,1);
                    //bullet(20,130,10,1);
                    //bullet(100,180,10,1);
                    bullet(80,200,10,1);
                    bullet(60,220,10,2);
                    bullet(40,240,10,2);
                    bullet(20,260,10,3);
                    bullet(0,280,10,3); 
                break;
                case 35://上下針
                    for(var x=1;x<4;x+=2){
                        bullet(20+x*20,30,10,3);
                        bullet(20+x*20,280,10,3);
                    }
                    bullet(20,30,10,2);
                    bullet(20,280,10,2);
                    bullet(100,30,10,2);
                    bullet(100,280,10,2);
                    bullet(0,30,10,1);
                    bullet(120,30,10,1);
                    bullet(20,50,10,1);
                    bullet(40,50,10,2);
                    bullet(60,50,10,3);
                    bullet(80,50,10,2);
                    bullet(100,50,10,1);
                    bullet(40,70,10,1);
                    bullet(60,70,10,2);
                    bullet(80,70,10,1);
                    bullet(60,90,10,1);
                    bullet(0,280,10,1);
                    bullet(120,280,10,1);
                    bullet(20,260,10,1);
                    bullet(40,260,10,2);
                    bullet(60,260,10,3);
                    bullet(80,260,10,2);
                    bullet(100,260,10,1);
                    bullet(40,240,10,1);
                    bullet(60,240,10,2);
                    bullet(80,240,10,1);
                    bullet(60,220,10,1); 
                break;
                case 36://上中下
                for(var x=0;x<5;x++){
                    bullet(x*25,30,10,3-Math.abs(x-2));
                    bullet(x*25,155,10,3-Math.abs(x-2));
                    bullet(x*25,280,10,3-Math.abs(x-2));
                }
                break;
            }
        }
        /*///確認用
        var point5 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "black",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point6 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "red",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point7 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "green",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        var point8 = new g.FilledRect({//haikei
            scene: scene,
            cssColor: "blue",
            opacity:1,
            width: 4,
            height: 4,
            tag:{xy:[0,0,0,0,0,0,0,0]},//[x1,x2,x3,x4,y1,y2,y3,y4]
        });
        scene.append(point5);
        scene.append(point6);
        scene.append(point7);
        scene.append(point8);
        scene.update.add(function (e) {
            point5.x=bullets.children[0].tag.xy[0];
            point5.y=bullets.children[0].tag.xy[4];
            point5.modified();
            point6.x=bullets.children[0].tag.xy[1];
            point6.y=bullets.children[0].tag.xy[5];
            point6.modified();
            point7.x=bullets.children[0].tag.xy[2];
            point7.y=bullets.children[0].tag.xy[6];
            point7.modified();
            point8.x=bullets.children[0].tag.xy[3];
            point8.y=bullets.children[0].tag.xy[7];
            point8.modified();
        });/*/
        function hit(x1, y1, x2, y2, x3, y3, x4, y4) {//直線12と線分34が交わっているか
            var t1 = (x1 - x2) * (y3 - y1) + (y1 - y2) * (x1 - x3);
            var t2 = (x1 - x2) * (y4 - y1) + (y1 - y2) * (x1 - x4);
            if( t1*t2 < 0){
                return( true ); //クロスしている
              } else {
                return( false ); //クロスしない
              }
        }
        scene.update.add(function (e) {
            for (var i = 0; i < bullets.children.length ; i++) {//ダメージ判定
                var hitted=0;
                for(var j=0;j<=3;j++){
                    for(var k=0;k<=3;k++){
                        if(hit(pl.tag.xy[j%4],pl.tag.xy[(j%4)+4],pl.tag.xy[(j+1)%4],pl.tag.xy[((j+1)%4)+4],bullets.children[i].tag.xy[k%4],bullets.children[i].tag.xy[(k%4)+4],bullets.children[i].tag.xy[(k+1)%4],bullets.children[i].tag.xy[((k+1)%4)+4])
                        &&hit(bullets.children[i].tag.xy[k%4],bullets.children[i].tag.xy[(k%4)+4],bullets.children[i].tag.xy[(k+1)%4],bullets.children[i].tag.xy[((k+1)%4)+4],pl.tag.xy[j%4],pl.tag.xy[(j%4)+4],pl.tag.xy[(j+1)%4],pl.tag.xy[((j+1)%4)+4])){
                            hitted++;
                        }                  
                    }
                }
                if(timeall<=((time+ruletime)*g.game.fps)&&hitted!=0){//g.Collision.intersectAreas(pl, bullets.children[i])
                    pl.opacity=0.5;
                    if(bullets.children[i].cssColor==="red"){
                        g.game.vars.gameState.score-=10;
                        bullets.children[i].opacity=0.5;
                    }else if(bullets.children[i].cssColor==="blue"){
                        g.game.vars.gameState.score-=50;
                        bullets.children[i].opacity=0.5;
                    }else if(bullets.children[i].cssColor==="green"){
                        g.game.vars.gameState.score-=100;
                        bullets.children[i].opacity=0.5;
                    }
                    bullets.children[i].modified();                   
                    if(g.game.vars.gameState.score<0){
                        g.game.vars.gameState.score=0;
                    }
                }
            }
            pl.modified();
        });
        //ルール表示
        var rule = new g.Sprite({
            scene: scene,
            src: scene.assets["rule"],
            opacity:1,
            x:-320,
            y:-180,
            scaleX:0.3,
            scaleY:0.3,
        });
        scene.append(rule);       
        // フォントの生成
        var font = new g.DynamicFont({
            game: g.game,
            fontFamily: g.FontFamily.Serif,
            size: 48
        });
        // スコア表示用のラベル
        var scoreLabel = new g.Label({
            scene: scene,
            text: "SCORE: 0",
            font: font,
            fontSize: font.size / 2,
            textColor: "black"
        });
        scene.append(scoreLabel);
        // 残り時間表示用ラベル
        var timeLabel = new g.Label({
            scene: scene,
            text: "TIME: 0",
            font: font,
            fontSize: font.size / 2,
            textColor: "black",
            x: 0.82 * g.game.width
        });
        scene.append(timeLabel);
        if (param.isAtsumaru) {//Retryボタン(param.isAtsumaru)
            var buttonretry = new g.FilledRect({//ボタン(retry)
                scene: scene,
                cssColor: "black",
                x: -108 + ((g.game.width)),
                y: 320,
                width: 96,
                height: 32,
                touchable: true,
            });
            var buttonretry2 = new g.FilledRect({//ボタン(retry)
                scene: scene,
                cssColor: "white",
                x: 3,
                y: 3,
                width: 90,
                height: 26,
            });
            var textretry = new g.Label({//文字(retry)
                scene: scene,
                font: font,
                fontSize: 24,
                text: "Retry",
                tag: { sum: 0 },
                x: 18,
                y: 0,
            });
            buttonretry.append(buttonretry2);
            buttonretry.append(textretry);
            scene.append(buttonretry);            
            buttonretry.pointDown.add(function () {//ボタン(retry)推したとき
                timeall = ruletime*g.game.fps;
                jumpcount = 1;
                click = 0;
                clicking=false;
                pl.x=(g.game.width-pl.height)*0.25;
                pl.y = g.game.height * 0.8 - pl.height / 2;
                pl.angle = 0
                g.game.vars.gameState.score = 0;               
                window.RPGAtsumaru.globalServerVariable.triggerCall(2220);
            });
            buttonretry.update.add(function () {
                if(timeall>=((time+ruletime)*g.game.fps)+10){
                    buttonretry.show();  
                }else{
                    buttonretry.hide();   
                }
            });
            
        }
        var updateHandler = function () {
            if(timeall>=((ruletime-1)*g.game.fps)){
                rule.opacity=0;
            }           
            if(timeall>=(ruletime*g.game.fps)&&(timeall-(ruletime*g.game.fps))<(time*g.game.fps)/4&&(timeall-(ruletime*g.game.fps))%50==0){
                danmaku(param.random.get(1, 5));
            }else if(timeall>=(ruletime*g.game.fps)&&(timeall-(ruletime*g.game.fps))<(time*g.game.fps)/2&&(timeall-(ruletime*g.game.fps))%50==0){
                danmaku(param.random.get(11, 15));
            }else if(timeall>=(ruletime*g.game.fps)&&(timeall-(ruletime*g.game.fps))<(time*g.game.fps)*3/4&&(timeall-(ruletime*g.game.fps))%50==0){
                danmaku(param.random.get(21, 26));
            }else if(timeall>=(ruletime*g.game.fps)&&(timeall-(ruletime*g.game.fps))<(time*g.game.fps)&&(timeall-(ruletime*g.game.fps))%50==0){
                danmaku(param.random.get(31, 36));
            }
            // カウントダウン処理
            if(timeall<=(ruletime*g.game.fps)){//開始前
                timeLabel.text = "TIME: "+time;
            }else if (timeall>((time+ruletime)*g.game.fps)) {//終了時
                timeLabel.text = "TIME: 0";
            }else{
                timeLabel.text = "TIME: " + (time-Math.floor((timeall-ruletime*g.game.fps)/g.game.fps));
                g.game.vars.gameState.score+=10;
                scoreLabel.text = "SCORE: " + g.game.vars.gameState.score;
            }
            timeLabel.invalidate();
            scoreLabel.invalidate();
            if (timeall==((time+ruletime)*g.game.fps)+1) {
                // RPGアツマール環境であればランキングを表示します
                if (param.isAtsumaru) {
                    var boardId_1 = 1;
                    window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId_1, g.game.vars.gameState.score).then(function () {
                        window.RPGAtsumaru.experimental.scoreboards.display(boardId_1);
                    });
                }
            }
            timeall++;
        };
        scene.update.add(updateHandler);
        // ここまでゲーム内容を記述します
    });
    g.game.pushScene(scene);
}
exports.main = main;
