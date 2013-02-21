/**
 * config/settings.js
 * Settings Window data
 * 設定画面の項目を定義します
 * this.settings Object の中に id(呼び出し名) を key とする Object として設定項目を追加する
 * 各設定項目の Object には
 * - name     (設定項目名)
 * - title    (副項目名)
 * - type     (設定)
 * - init     (初期値)
 * - callback (option:初期化関数)
 * - data     (type が select, option のとき)
 * を設定する
 */

function Settings(g) {
	var self = this;
	
	function refreshUI() {
		// UIに適用
		setTimeout(function () {
			g.alert("地域設定", "カレンダーの描画が終わるまでお待ちください。");
			g.scroll.fireEvent('reload', {cache: 'refresh'});
		}, 10);
	}
	
	this.settings =  {
		'region': {
			name: '地域設定',
			type: 'select',
			title: '地域未指定',
			init: [],
			callback: refreshUI,
			data: {
				// 表示名: 検索名(複数指定可能)
				'締切': ['締切', '〆切'],
				'オンライン': ['オンライン'],
				'北海道': ['北海道'],
				'青森県': ['青森'],
				'岩手県': ['岩手'],
				'宮城県': ['宮城'],
				'秋田県': ['秋田'],
				'山形県': ['山形'],
				'福島県': ['福島'],
				'茨城県': ['茨城'],
				'栃木県': ['栃木'],
				'群馬県': ['群馬'],
				'埼玉県': ['埼玉'],
				'千葉県': ['千葉'],
				'東京都': ['東京'],
				'神奈川県': ['神奈川'],
				'新潟県': ['新潟'],
				'富山県': ['富山'],
				'石川県': ['石川'],
				'福井県': ['福井'],
				'山梨県': ['山梨'],
				'長野県': ['長野'],
				'岐阜県': ['岐阜'],
				'静岡県': ['静岡'],
				'愛知県': ['愛知'],
				'三重県': ['三重'],
				'滋賀県': ['滋賀'],
				'京都府': ['京都'],
				'大阪府': ['大阪'],
				'兵庫県': ['兵庫'],
				'奈良県': ['奈良'],
				'和歌山県': ['和歌山'],
				'鳥取県': ['鳥取'],
				'島根県': ['島根'],
				'岡山県': ['岡山'],
				'広島県': ['広島'],
				'山口県': ['山口'],
				'徳島県': ['徳島'],
				'香川県': ['香川'],
				'愛媛県': ['愛媛'],
				'高知県': ['高知'],
				'福岡県': ['福岡'],
				'佐賀県': ['佐賀'],
				'長崎県': ['長崎'],
				'熊本県': ['熊本'],
				'大分県': ['大分'],
				'宮崎県': ['宮崎'],
				'鹿児島県': ['鹿児島'],
				'沖縄県': ['沖縄']
			}
		},
		'font-size': {
			name: 'フォントサイズ',
			type: 'option',
			title: '',
			init: '中',
			data: {
				'大': 3,
				'中': 0,
				'小': -3
			},
			callback: refreshUI
		},
		'version': {
			name: 'バージョン情報',
			type: 'button',
			title: Ti.App.getName() + '  v' + Ti.App.getVersion(),
			init: null,
			callback: function () {
				Ti.Platform.openURL('http://www.infiniteloop.co.jp/it-study-calendar/');
			}
		},
		'license': {
			name: 'ライセンス情報',
			type: 'button',
			title: 'com.gs.calendar - module',
			init: null,
			callback: function () {
				g.alert("com.gs.calendar", [
					'Copyright 2011 by Goran Skledar',
					'',
					'Licensed under the Apache License, Version 2.0 (the "License");',
					'you may not use this file except in compliance with the License.',
					'You may obtain a copy of the License at',
					'',
					'http://www.apache.org/licenses/LICENSE-2.0',
					'',
					'Unless required by applicable law or agreed to in writing, software',
					'distributed under the License is distributed on an "AS IS" BASIS,',
					'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
					'See the License for the specific language governing permissions and',
					'limitations under the License.'
				].join("\n"));
			}
		}
	};
	this.load = function (id) {
		var	item = self.settings[id],
			set;
		if (! item) {
			Ti.API.debug('Can not load config: ' + id);
			return false;
		}
		switch (item.type) {
			case 'select':
				set = Ti.App.Properties.getList(id);
				// 値渡し
				set = set ? set : [].concat(item.init);
				break;
			case 'check':
				set = Ti.App.Properties.getBool(id);
				set = set !== null ? set : item.init;
				break;
			case 'option':
				set = Ti.App.Properties.getString(id);
				set = set !== null ? set : item.init;
				set = item.data[set];
				break;
		}
		return set;
	};
	this.set = function (id, data) {
		var	item = self.settings[id];
		if (! item) {
			Ti.API.info('Can not set config: ' + id);
			return false;
		}
		switch (item.type) {
			case 'select':
				Ti.App.Properties.setList(id, data);
				break;
			case 'check':
				Ti.App.Properties.setBool(id, data);
				break;
			case 'option':
				Ti.App.Properties.setString(id, data);
				break;
		}
	};
}

module.exports = function () {
	return new Settings(this);
};