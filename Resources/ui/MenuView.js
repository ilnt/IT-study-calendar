// Menu View
module.exports = function (g) {
	var hw = 48;
	var view = Ti.UI.createView({
		layout: 'horizontal',
		width: g.disp.width,
		top: 0,
		bottom: 0,
		backgroundColor: '#4080bf'
	});
	
	var search = Ti.UI.createView({
		right: 0,
		width: hw,
		backgroundFocusedColor: '#3575ba'
	});
	view.add(search);
	var search_icon = Ti.UI.createImageView({
		width: hw,
		height: hw,
		image: 'img/ic_action_search.png'
	});
	search.add(search_icon);
	
	var option = Ti.UI.createView({
		right: 0,
		width: hw,
		backgroundFocusedColor: '#3575ba'
	});
	view.add(option);
	var option_icon = Ti.UI.createImageView({
		width: hw,
		height: hw,
		image: 'img/ic_action_search.png'
	});
	option.add(option_icon);
	
	search.addEventListener('click', function () {
		alert('search');
	});
	option.addEventListener('click', function () {
		alert('option');
	});
	
	return view;
};
