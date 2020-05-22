(function (doc, win) {
	var docEl = doc.documentElement;
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;

			if (clientWidth <= 1200) {
				clientWidth = 1200;
			} else if (clientWidth >= 1920) {
				clientWidth = 1920;
			}

			if (!clientWidth) return;
			window.remvalue = 20 * (clientWidth / 960);
			docEl.style.fontSize = window.remvalue + 'px';
		};

	if (!doc.addEventListener) return;
	recalc();

	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
