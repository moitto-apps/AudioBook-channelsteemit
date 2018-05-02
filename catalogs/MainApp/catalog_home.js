include("Scripts/steemjs.js");
include("config.js");

var account = require("account");

var __last_discussion = null;

function on_loaded() {
}

function feed_list(keyword, location, length, sortkey, sortorder, handler) {
	// var username = account.is_logged_in() ? account.username() : "moitto";

	var start_author = (location > 0) ? __last_discussion["author"]	: null;
	var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

	steemjs_get_discussions_by_blog(config["tag"], 10, start_author, start_permlink, function(discussions) {
		var data = [];

		if (location > 0) {
			discussions = discussions.slice(1);
		}

		discussions.forEach(function(discussion) {
			if (!config["author"] || config["author"] === discussion["author"]) {
				var image_url 		  = __fetch_image_url_in_discussion(discussion);
				var userpic_url       = __fetch_userpic_url_in_discussion(discussion);
				var userpic_large_url = __fetch_userpic_large_url_in_discussion(discussion);;
				var payout_value      = __fetch_payout_value_in_discussion(discussion).toFixed(2);
				var source_url 		  = __fetch_audio_book_source_url_in_discussion(discussion);

				var identifer = "S_FEEDS_" + discussion["author"] + "_" + discussion["permlink"];
				var title = discussion["title"];

				if (__is_audio_book(title)) {
					data.push({
						"id": identifer,
						"author": discussion["author"],
						"permlink": discussion["permlink"],
						"title": __fetch_audio_book_title(title),
						"number": __fetch_audio_book_number(title),
						"source-url": source_url,
						"image-url":image_url,
						"userpic-url":userpic_url,
						"userpic-large-url":userpic_large_url,
						"payout-value":"$" + payout_value.toString(),
						"votes-count":discussion["net_votes"].toString(),
						"main-tag":discussion["category"],
            		    "created-at":discussion["created"], 
            		    "hides-navibar":"yes"
					});
				}
			}
		});

		if (discussions.length > 0) {
			__last_discussion = discussions[discussions.length - 1];
		}

		handler(data);
	});
}

function __is_audio_book(title) {
	var audio = /\s*(오디오북)\s*[\d]*/g.exec(title);

	if (audio) {
		return true;
	}

	return false;
}

function __fetch_audio_book_source_url_in_discussion(discussion) {
	// https://steemit.com/kr/@pediatrics/2aascf
	var links = JSON.parse(discussion["json_metadata"])["links"];
	var source_url = "";

	links.forEach(function(link) {
		if (link.includes("steemit.com")) {
			source_url = link;

			return;
		}
	})

	return source_url;
}

function __fetch_audio_book_number(title) {
	var num = /\s*오디오북\s*([\d]*)./g.exec(title);

	if (num) {
		return num[1];
	}

	return "";
}

function __fetch_audio_book_title(source_title) {
	var title = /\s*오디오북\s*[\d]*.\s*(.*)/g.exec(source_title);

	if (title) {
		return title[1];
	}

	return "";
}

function __fetch_payout_value_in_discussion(discussion) {
	var total_payout_value = parseFloat(discussion["total_payout_value"].replace("SBD", "").trim());

	if (total_payout_value > 0) {
		return total_payout_value;
	}

	return parseFloat(discussion["pending_payout_value"].replace("SBD", "").trim());
}

function __fetch_userpic_url_in_discussion(discussion) {
	return "https://steemitimages.com/u/" + discussion["author"] + "/avatar/small";
}

function __fetch_userpic_large_url_in_discussion(discussion) {
	return "https://steemitimages.com/u/" + discussion["author"] + "/avatar";
}

function __fetch_image_url_in_discussion(discussion) {
	var images = JSON.parse(discussion["json_metadata"])["image"];

	if (images && images.length > 0) {
		return images[0];
	}

	return "";
}

function __fetch_image_url_in_content(content) {
	var url = /!\[[^\]]*\]\(([^\)]+)\)/g.exec(content.body);

	if (url) {
		return url[1];
	}

	return null;
}
