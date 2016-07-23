var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Go out tonight and get wasted, you will meet your dream girl.",
	"Play lotto today and quit your job. Lucky numbers are: 6, 8, 10, 9, 5.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Drive faster to avoid cops today after you drink.",
	"Whenever possible, keep it simple.",
];

exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
};
