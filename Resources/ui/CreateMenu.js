/**
 * ui/CreateMenu.js
 * Create Menu
 */

function CreateMenu(view, menu, back) {
	var	g = this,
		defaultHeight = 50,
		menuHeight = 50;

	// background overlay
	var background = Ti.UI.createView({
		width: "auto",
		height: "auto",
		visible: false
	});
	view.add(background);

	// menu wrapper
	var wrap = Ti.UI.createView({
		layout: "vertical",
		top: 0,
		right: 0,
		width: g.dip(120),
		height: g.dip(defaultHeight)
	});
	view.add(wrap);

	// menu button (trigger)
	var button = Ti.UI.createLabel({
		id: "button",
		top: 0,
		right: 0,
		width: g.dip(50),
		height: g.dip(defaultHeight),
		backgroundColor: "#59c",
		text: "≡",
		textAlign: "center",
		color: "#fff",
		font: {fontSize: g.dip(24)}
	});
	wrap.add(button);

	// Back button (iOS only)
	if (! Ti.Platform.Android && back) {
		var back = Ti.UI.createImageView({
			top: g.dip(-50),
			width: g.dip(52),
			height: g.dip(defaultHeight),
			right: g.dip(50),
			backgroundColor: "#59c",
			image: "images/arrow.png"
		});
		var bar = Ti.UI.createLabel({
			top: 0,
			width: g.dip(2),
			height: g.dip(defaultHeight),
			right: 0,
			backgroundColor: "#59c",
			text: "|",
			textAlign: "center",
			color: "#fff",
			font: {fontSize: g.dip(24)}
		});
		back.add(bar);
		back.addEventListener("click", function () {
			g.currentWindow.close();
		});
		wrap.add(back);
	}

	// initialize
	function init() {
		background.visible = false;
		wrap.height = g.dip(defaultHeight);
	}

	// set menu list
	var rows = Object.keys(menu).map(function (key, index) {
		var	item = menu[key],
			font = {fontSize: g.dip(16)},
			color = "#fff";

		var row = Ti.UI.createTableViewRow({
			height: g.dip(menuHeight),
			color: color,
			font: font
		});

		if (Ti.Platform.Android) 
			row.title = key
		else {
			var label = Ti.UI.createLabel({
				left: g.dip(5),
				right: g.dip(5),
				width: Ti.UI.FILL,
				color: color,
				font: font,
				text: key
			});
			row.add(label);
		}

		row.addEventListener("click", function (e) {
			init();
			// click event, menu title, menu index が渡される
			item.click(e, key, index);
		});
		return row;
	});
	var list = Ti.UI.createTableView({
		top: g.dip(1),
		right: g.dip(5),
		// iOS だけ、ウィンドウのサイズを超えるとはみ出す
		height: Ti.UI.SIZE,
		backgroundColor: "#888",
		data: rows
	});
	wrap.add(list);

	// background action
	background.addEventListener("click", init);
	wrap.addEventListener("click", function (e) {
		if (e.source.id !== "button")
			init();
	});

	// menu action
	button.addEventListener("click", function () {
		if (wrap.height === g.dip(defaultHeight)) {
			background.visible = true;
			wrap.height = Ti.UI.FILL;
		} else
			init();
	});

	// bind menu key (Android only)
	if (Ti.Platform.Android)
		g.currentWindow.activity.onPrepareOptionsMenu = function () {
			button.fireEvent("click");
		};

	return button;
}

module.exports = CreateMenu;