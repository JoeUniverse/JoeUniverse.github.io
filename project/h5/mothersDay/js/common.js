var rpx = 0;//1个rem = n个px
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
			rpx = 20 * (clientWidth / 375);
		};

	if (!doc.addEventListener) return;
	recalc();

	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(document).ready(function() {

	function audioAutoPlay(id) {
		var audio = document.getElementById(id);
		var play = function () {
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

	setTimeout(function(argument) {
		$(".btn-start").removeClass('zoomIn').addClass('pulse');
	},2000);

	$(".btn-start").click(function(event) {
		$(".content-index").hide();
		$(".content-page1").fadeIn();
	});

	$(".select").click(function(event) {
		$(this).unbind().addClass('act');
		$(this).attr('src','img/select-'+$(this).data('selectnum')+'-2.png');

		$(".dialog").attr('src','img/dialog-'+$(this).data('selectnum')+'.png');

		if($(".content-page1 .select.act").length>3){
			$(".btn-reselect").hide();
			$(".btn-want").show();
		}
		// console.log($(".content-page1 .select.act").length)
		setTimeout(function(){
			$(".content-page1").hide();
			$(".content-page2").fadeIn();
		},200);
	});

	$(".btn-reselect").click(function(event) {
		$(".select.act").each(function(){
			$(this).attr('src','img/select-'+$(this).data('selectnum')+'-3.png');
		});
		$(".content-page1").fadeIn();
		$(".content-page2").hide();
	});

	$(".btn-want").click(function(event) {
		$(".content-page2").hide();
		$(".content-page3").fadeIn();
		// setTimeout(function(argument) {
		// 	$(".content-page3").fadeOut();
		// 	$(".content-page4").fadeIn();
		// },10000);
	});

	$(".btn-next").click(function(event) {
		$(".content-page3").fadeOut();
		$(".content-page4").fadeIn();
	});

	// 点击分享
	$(".btn-share").click(function(event) {
		$(".content-share").fadeIn();
	});
	$(".content-share").click(function(event) {
		$(".content-share").fadeOut();
	});

});
