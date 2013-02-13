/**
 * ui/LoadingView.js
 * Loading View
 */

function LoadingView(g) {
	var timer = 0;
	this.table = function (table) {
		// Set loading bar
		var loading = Ti.UI.createTableViewRow({
			height: g.dip(40),
			backgroundColor: "#fff",
			color: "#000",
			title: "Now loading",
			font: {fontSize: g.dip(24)}
		});
		clearInterval(timer);
		var times = 0;
		timer = setInterval(function () {
			loading.title = "Now loading" + ["", ".", "..", "..."][times++ % 4];
		}, 300);
		
		table.data = [loading];
		
		return loading;
	};
	this.window = function () {
		var style = Ti.Platform.Android ? Titanium.UI.ActivityIndicatorStyle.BIG : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
		var actin = Ti.UI.createActivityIndicator({
			color: "#fff",
			style: style
		});
		
		var view = Ti.UI.createView({
			backgroundColor: "#000",
			opacity: 0.8,
			zIndex: 100
		});
		actin.addEventListener("show", function () {
			actin.show();
			g.currentWindow.add(view);
		});
		actin.addEventListener("hide", function () {
			actin.hide();
			g.currentWindow.remove(view);
		});
		view.add(actin);
		
		return actin;
	};
}

module.exports =  function () {
	return new LoadingView(this);
};