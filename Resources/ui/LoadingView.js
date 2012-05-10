// Loading View
module.exports = function (g) {
	/* iOSではActivityIndicatorの部分に変更が必要
	var bgView = Ti.UI.createView({
		backgroundColor: '#555',
		opacity: 0.5,
		zIndex: 1,
		visible: false,
		title: 'modal'
	});
	
	var innerH = g.disp.height / 3;
	var innerView = Ti.UI.createView({
		width: g.disp.width / 10 * 9,
		height: innerH,
		backgroundColor: '#fff',
		borderRadius: 10
	});
	bgView.add(innerView);
	
	var labelH = g.disp.height / 14;
	var label = Ti.UI.createLabel({
		height: labelH,
		top: innerH / 2 - labelH,
		left: g.disp.width / 10,
		value: 0,
		color: '#888',
		font: {fontSize:14},
		text: 'Loading'
	});
	innerView.add(label);
	
	var pb = Ti.UI.createImageView({
		bottom: innerH / 2 - labelH,
		image: '/images/progressbar.gif'
	});
	innerView.add(pb);
	
	bgView.addEventListener('openBar', function () {
		bgView.visible = true;
	});
	bgView.addEventListener('closeBar', function () {
		bgView.visible = false;
	});
	
	return bgView;
	*/
	
	var actin = Ti.UI.createActivityIndicator({
		message: 'Loading...'
	});
	
	var count = 0;
	setTimeout(function () {
		count++;
		if (count < 4) {
			actin.message += '.';
		} else {
			actin.message = 'Loading';
			count = 0;
		}
		setTimeout(arguments.callee, 300);
	}, 300);
	
	actin.addEventListener('openBar', function () {
		actin.show();
	});
	actin.addEventListener('closeBar', function () {
		actin.hide();
	});
	
	return actin;
};