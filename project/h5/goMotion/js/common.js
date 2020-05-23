(function (doc, win) {
	var docEl = doc.documentElement;
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;

			if (clientWidth >= 750)
				clientWidth = 750;

			if (!clientWidth) return;
			window.remvalue = 20 * (clientWidth / 375);
			docEl.style.fontSize = window.remvalue + 'px';
		};

	if (!doc.addEventListener) return;
	recalc();

	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(document).ready(function () {

	// 控制音乐播放
	function audioAutoPlay(id) {
		var audio = document.getElementById(id);
		var play = function () {
			// $("#media").attr("muted","false")
			audio.play();
		};
		document.addEventListener("WeixinJSBridgeReady", play, false);
		document.addEventListener('YixinJSBridgeReady', play, false);
		play();
	}
	audioAutoPlay('media');

	var audio = $('#media')[0];
	$('#audio-btn').click(function(){
		if($('#audio-btn').hasClass('rotate')) {
			$('#audio-btn').removeClass('rotate');
			audio.pause();
		}else{
			$('#audio-btn').addClass('rotate');
			audio.play();
		}
	});

	// 首页
	$(".content-index").fadeIn('fast',function() {
		setTimeout(function(){
			$(".btn-start").removeClass('animated zoomIn').addClass('pulsean');
		},2500)
	});

	// 开始按钮
	$(".btn-start").click(function(event) {
		$(".content-index").hide();
		$(".content-part1").show();
		$(".content-guide-part1").fadeIn();
	});

	// 开始第一关游戏
	$(".content-guide-part1 .btn-go").click(function(event) {
		$(".content-guide-part1").fadeOut('fast', function() {
			part1s();
		});
	});

	var flag = false;

	// part1 第一关
	var startTime = 0;
	var runNumber = 1;//动画帧
	var runwayX = 0;//背景x位置
	var runwayCount = 0;//点击次数
	var runs1,runs2,runs3,runInitials;
	var runTesting;//运动检测
	var runArr = [0];
	var part1Score=0;//第一关得分
	var mileageNum=0;//里程
	var quickenR = true;
	function part1s(){
		var part1Time = 15;//游戏时长

		// 游戏计时
		var part1s = setInterval(function(){
			part1Time--;
			$(".content-part1 .time").html(part1Time+"s");
			if(part1Time<=0){
				clearInterval(part1s);
				part1Score = Math.min(100, Math.floor(mileageNum/10));
				$(".quicken-left,.quicken-right").unbind();
				$(".content-score").fadeIn();
				$(".content-score .score-box .this-score").html(part1Score);
				setTimeout(function(){
					$(".content-part1").hide();
					$(".content-score").fadeOut();

					$(".content-part2").show();
					$(".content-guide-part2").fadeIn();

					$(".content-guide-part2 .btn-go").click(function(event) {
						$(".content-guide-part2").fadeOut('fast', function() {
							balls();
						});
					});

				},3000);

				clearInterval(runs2);
				clearTimeout(runTesting);
			}
		},1000);

		$(".content-part1 .timer-2").animate({"width":"0"},15500,"linear");//时间进度条


		// 人物初始速度跑步速度
		runs1 = setInterval(function() {
			runs();
		},120);

		// 左右交互点击判断
		var time1 = 0,time2 = 1000;
		$(".quicken-left,.quicken-right").on('touchstart',function(event) {
			if (event.currentTarget.className=='quicken-right') {
				if (quickenR) {
					clearTimeout(runTesting);
					runwayCount++;

					time1 = time2;
					time2 = new Date().getTime();

					quickenR=false;
					quickenFn()
				}
			} else if(event.currentTarget.className=='quicken-left') {
				if (!quickenR) {
					clearTimeout(runTesting);
					runwayCount++;

					time1 = time2;
					time2 = new Date().getTime();

					quickenR=true;
					quickenFn()
				}
			}
			clearInterval(runs1);
		});

		// 加速或者减速判断
		function quickenFn() {
			
			clearInterval(runs2);

			if(time2-time1>0 && time2-time1<350){
				runs2 = setInterval(function() {
					runs();
				},40);
			} else if(time2-time1>=350 && time2-time1<600){
				runs2 = setInterval(function() {
					runs();
				},80);
			} else {
				runs2 = setInterval(function() {
					runs();
				},120);
			}

			runTesting = setTimeout(function() {
				clearInterval(runs2);
				runs2 = setInterval(function() {
					runs();
				},120);
			},600)
		}

		// 跑步动作和背景
		function runs() {
			runNumber++;
			runwayX = runwayX + 5;
			$(".runWoman").attr("src","img/woman-"+runNumber+".png");
			if(runNumber>=8){
				runNumber = 0;
			}
			$(".runway-box").css({"background-position-x": -runwayX});

			mileageNum+=3;
			$(".mileage").html(mileageNum);
			// $(".mileage").html(runwayCount);
		}
	}

	// part2 第二关
	var part2Score=0;//第二关得分
	function balls() {
		var part2Time1 = new Date().getTime();
		var part2Time2;
		flag = true;
		var part2Time = 10;//游戏时长
		// var part2Time = 1;//测试

		// 游戏计时
		var part2s = setInterval(function(){
			part2Time--;
			$(".content-part2 .time").html(part2Time+"s");
			if(part2Time<=0){
				gameEnd();
			}
		},1000);

		// 刚开始速度较慢，2秒后恢复正常速度
		var initialNum = 0.5;
		setTimeout(function() {
			initialNum = 1;
		},2000);

		$(".content-part2 .timer-2").animate({"width":"0"},10000,"linear");//时间进度条

		// 重力感应
		try {
			var text = "";
			window.addEventListener("deviceorientation", orientationHandler, false);
			window.addEventListener('devicemotion', deviceMotionHandler, false);

			var xDev=1,
				// yDev=1,
				xDev2=1,
				// yDev2=1,
				speedX2,speedY2,
				w1=innerWidth/10;
				// w2=innerWidth/20,
				// h1=innerHeight/2,
				// h2=innerHeight/10;

			function orientationHandler(event) {
				// text = ""
				// var arrow = document.getElementById("arrow");
				// text += "前后旋转：rotate beta{" + Math.round(event.beta) + "deg)<br>";
				// text += "扭转设备：rotate gamma{" + Math.round(event.gamma) + "deg)<br>";
				// arrow.innerHTML = text;

				// $(".ball").animate({'transform':'translate('+event.gamma*20+'px,'+event.beta*20+'px)'},2000);

				if(flag){

					// var randomDev = Math.floor(Math.random()*200 - 100);
					var rotateBall = (event.beta + event.gamma) * 1 + 'deg';
					// var rotateHand = xDev2/5 + 'deg';

					var speedX = speedX2;
					var speedY = speedY2;

					if(event.gamma>0) {
						if(xDev2>w1){
							xDev = w1;
							xDev2 = w1;
							flag=false;
							TweenMax.to($(".ball"),1,{x: xDev2*5,y: Math.abs(xDev2*11),rotationZ: '180deg'});
							gameEnd();
						} else {
							xDev2 = xDev * 1;
							xDev+=initialNum;
							TweenMax.to($(".ball"),.5,{x: xDev2,y: Math.abs(xDev2/5),rotationZ: rotateBall});
						}
					} else {
						if(xDev2<-w1){
							xDev = -w1;
							xDev2 = -w1;
							flag=false;
							TweenMax.to($(".ball"),1,{x: xDev2*5,y: Math.abs(xDev2*11),rotationZ: '-180deg'});
							gameEnd();
						} else {
							xDev2 = xDev * 1;
							xDev-=initialNum;
							TweenMax.to($(".ball"),.5,{x: xDev2,y: Math.abs(xDev2/5),rotationZ: rotateBall});
						}
					}

				}
			}

			function deviceMotionHandler(e) {
				speedX2 = -e.accelerationIncludingGravity.x;
				speedY2 = e.accelerationIncludingGravity.y;
			}
		}
		catch (e) {
			$("#arrow").html(e.message);
		}

		// 游戏结束判断
		function gameEnd() {
			part2Time2 = new Date().getTime();
			part2Score = Math.floor((part2Time2 - part2Time1)/100);
			$(".content-part2 .timer-2").stop();
			clearInterval(part2s);

			window.removeEventListener("deviceorientation", orientationHandler, false);
			window.removeEventListener('devicemotion', deviceMotionHandler, false);

			flag = false;

			// $(".tips").fadeIn();
			$(".content-score").fadeIn();
			$(".content-score .score-box .this-score").html(part2Score);
			setTimeout(function(){
				$(".content-part2").hide();
				// $(".tips").fadeOut();
				$(".content-score").fadeOut();

				$(".content-part3").show();
				$(".content-guide-part3").fadeIn();

				$(".content-guide-part3 .btn-go").click(function(event) {
					$(".content-guide-part3").fadeOut('fast', function() {
						shake();
					});
				});

			},3000);
		}

	}

	// part3 第三关
	var part3Score=0;//第三关得分
	createjs.Ticker.timingMode = createjs.Ticker.RAF;//舞台自动更新
	var canvas = document.getElementById("circular1");
	var stage = new createjs.Stage(canvas);
	createjs.Ticker.on('tick',stage);
	createjs.Touch.enable(stage);

	var container = new createjs.Container();
	stage.addChild(container);

	var w = canvas.width;
	var h = canvas.height;

	/*分成几等分*/
	var num = 200;
	/*一份多少弧度*/
	var angle = Math.PI * 2 / num;

	/*原点坐标*/
	var x0 = w / 2;
	var y0 = h / 2;
	var i = 0;

	var vibrateSupport = "vibrate" in navigator;
	if (vibrateSupport) { //兼容不同的浏览器
		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	}

	var resultNum;
	function shake() {
		flag = true;

		var part3Time = 5;//游戏时长

		//第三关游戏倒计时
		var part3s = setInterval(function(){
			part3Time--;
			$(".content-part3 .time").html(part3Time+"s");
			if(part3Time<=0){
				clearInterval(part3s);

				window.removeEventListener('devicemotion',deviceMotionHandler,false);

				// $(".tips").fadeIn().html("测试完成");
				$(".content-score .score-box").addClass('score-box2');
				$(".content-score").fadeIn();
				$(".content-score .score-box .this-score").html(part3Score);
				var flag = false;
				setTimeout(function(){
					$(".content-part3").hide();
					// $(".tips").fadeOut();
					$(".content-score").fadeOut();

					$(".content-result").show();

					var strip1W = $(".strip1 .strip").width() / 100 * part1Score;
					var strip2W = $(".strip2 .strip").width() / 100 * part2Score;
					var strip3W = $(".strip3 .strip").width() / 100 * part3Score;
					$(".strip1 .strip").css({"width": strip1W});
					$(".strip2 .strip").css({"width": strip2W});
					$(".strip3 .strip").css({"width": strip3W});

					// 游戏最终得分判断
					if(part1Score>part2Score && part1Score>part3Score) {
						resultNum=1;
					} else if(part2Score>part1Score && part2Score>part3Score) {
						resultNum=2;
					} else if(part3Score>part1Score && part3Score>part2Score) {
						resultNum=3;
					} else {
						resultNum=1;
					}

					var gradeNum = Math.max(part1Score,part2Score,part3Score);
					if(gradeNum>=80){
						gradeNumber = 3;
					} else if(gradeNum>=60 && gradeNum<80){
						gradeNumber = 2;
					} else {
						gradeNumber = 1;
					}

					$(".result-box").css("background-image","url(img/bg-result-"+resultNum+".png)");
					$(".grade").attr("src","img/grade-"+gradeNumber+".png");
					var average = Math.floor((part1Score+part2Score+part3Score)/3);
					$(".score").html(gradeNum+"分，超过"+average+"%的人");

				},3000);
			}
		},1000);

		$(".content-part3 .timer-2").animate({"width":"0"},5000,"linear");//时间进度条

		// 运动事件监听
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion',deviceMotionHandler,false);
		}

		// 获取加速度信息
		// 通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
		// 而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
		var shake_threshold = 4000;
		var last_update = 0;
		var x, y, z, last_x = 0, last_y = 0, last_z = 0;

		
		function deviceMotionHandler(eventData) {
			if(flag){
				var acceleration =eventData.accelerationIncludingGravity;
				var curTime = new Date().getTime();
				if ((curTime-last_update)>10) {
					var diffTime = curTime -last_update;
					last_update = curTime;
					x = acceleration.x;
					y = acceleration.y;
					z = acceleration.z;
					var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
					if (speed > shake_threshold) {
						$(".shake-box .hand").addClass('handAn');
						var img = new Image();
						img.src = "img/bg-circular-2.png";
						img.onload = function() {
							var c = document.createElement("canvas");
							c.width = 597;
							c.height = 597;
							var ctx = c.getContext("2d");

							ctx.drawImage(img,0,0,597,597);
							ctx.globalCompositeOperation = "source-in";

							var startAngle = i * angle - Math.PI / 2;
							var endAngle = (i + 1) * angle - Math.PI / 2;
							ctx.beginPath();
							ctx.moveTo(x0, y0);
							ctx.arc(x0, y0, w/2, startAngle, endAngle);
							ctx.fillStyle = "#f0a10a";
							ctx.fill();

							var tempBitMap = new createjs.Bitmap(c);
							tempBitMap.x = 0;
							tempBitMap.y = 0;
							container.addChild(tempBitMap);
							i++;
							if(i>=num){
								i=num;
							}
							part3Score = Math.ceil(i/num*100);
							$(".content-part3 .power-box span").html(part3Score+"%");
						}
						stage.update();

						if(vibrateSupport){
							navigator.vibrate([300,200]);
						}
					}
					last_x = x;
					last_y = y;
					last_z = z;
				}
			}
		}
	}
	// shake();

	//短信发送及提交
    var codestate = 0;
    var verifystate = 1;
    var openid = getQueryStringByName('openID');
    var wsign = getQueryStringByName('wechatSignature');
    var typeNo = getQueryStringByName('typeNo');
    var agentNo = getQueryStringByName('agentNo');
    var sequenceNo = '';
    var proname = '';
    var sdata = {};


    //测试链接new
    //var serviceUrl = "https://pa18-mit-shop-bx-padis-dmzstg1.pa18.com/";
    //正式链接
    var serviceUrl = "https://jinling.pa18.com/";

    function showTips(content){
        $(".tips").fadeIn().html(content);
		setTimeout(function(){
			$(".tips").fadeOut();
		},2000);
    }

    function getQueryStringByName(b){
        var a = window.location.search.match(new RegExp("[?&]" + b + "=([^&]+)", "i"));
        if (a == null || a.length < 1) {
            return "";
        }
        return a[1];
    }

	$(".btn-identify").click(function(event) {
		var that = this;

		var phone = $('.phone').val();
        if(phone.length != 11){
            showTips('请输入正确的手机号码！');
            return false;
        }
       
        if(codestate <= 1 && verifystate == 1){
            codestate = 2;
            $.ajax({
                url: serviceUrl+"ebusiness/demand.adservice.mfaSmsAjax.shtml",
                data: {
                    sms_action:'send',//客户操作标识（send:发送验证码；verify:校验验证码）
                    clientMobile:phone,//客户手机号
                    dynamicPassword:'',//用户输入的验证码
                    bankSerial:'',//短信验证码表的主键
                    sequenceNo:'',
                    agentNo:agentNo,
                    productName:'',
                    productCode:typeNo,
                    openid:openid,
                    toolType:'tradition'
                },
                type: 'post',
                success: function(data){
                	sdata = data;
                    if(data.ResultCode == 'N'){
                        showTips(data.errorMessage);
                        codestate = 1;
                        return false;
                    }
                    showTips('发送成功',true);
                    var sec = 60;
                    $(that).html('60s');
                    var timer = setInterval(function(){
                        sec--;
                        if(sec < 0){
                            clearInterval(timer);
                            codestate = 1;
                            $(that).html('获取验证码');
                            return;
                        }
                        $(that).html(sec + 's');
                    },1000);
                }
            });
        }
		
	});
	$(".btn-submit").click(function(event) {
        
        var phone = $('.phone').val();
        var code = $('.identify').val();
        if(codestate == 0){
            showTips('请先获取验证码！')
            return false;
        }
        if(phone.length != 11){
            showTips('请输入正确的手机号码！');
            return false;
        }
        if(code.length == ''){
            showTips('请输入验证码！');
            return false;
        }
        if(verifystate == 1){
            verifystate = 2;
            $.ajax({
                url: serviceUrl+"ebusiness/demand.adservice.mfaSmsAjax.shtml",
                data: {
                    sms_action:'verify',//客户操作标识（send:发送验证码；verify:校验验证码）
                    clientMobile:phone,//客户手机号
                    dynamicPassword:code,//用户输入的验证码
                    bankSerial:sdata.bankSerial,//短信验证码表的主键
                    sequenceNo:sequenceNo,
                    agentNo:agentNo,
                    productName:proname,
                    productCode:typeNo,
                    openid:openid,
                    toolType:'tradition'
                },
                type: 'post',
                success: function(data){
                    if(data.ResultCode == 'N'){
                        showTips(data.errorMessage);
                        verifystate = 1;
                        return false;
                    }
                    verifystate = 3;
                    showTips('我们已收到您的预约，平安代理人将尽快为您提供服务！谢谢！',true);
                }
            });
        }
        
	});

	// 再玩一次
	$(".btn-replay").click(function(event) {
		location.reload();
	});

	// 排行榜关闭和显示
	$(".btn-rank").click(function(event) {
		$(".content-rank").fadeIn();
		$('.content-result').css("height","100%");
	});
	$(".btn-close").click(function(event) {
		$(".content-rank").fadeOut();
		$('.content-result').css("height","39.5rem");
	});

});
