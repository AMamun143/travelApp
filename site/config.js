module.exports = {

	'facebook': {
			'appId': '623533801143929',
			'appSecret': '46bb008d27679fb9dab0d0cf0f7ea581',
		},

	bundles: {
		clientJavaScript: {
			main: {
				file: '/js.min/meadowlark.min.9b77d847.js',
				location: 'head',
				contents: [
					'/js/contact.js',
					'/js/cart.js',
				]
			}
		},
		clientCss: {
			main: {
				file: '/css/meadowlark.min.2a8883cf.css',
				contents: [
					'/css/main.css',
					'/css/cart.css',
				]
			}
		},
	},
}
