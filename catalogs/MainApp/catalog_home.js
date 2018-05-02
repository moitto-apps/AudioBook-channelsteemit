include("Scripts/steemjs.js");
include("config.js");

var last_author   = null;
var last_permlink = null;

var bundles = [];

function on_loaded() {
	var start_author = (bundles.length > 0) ? last_author	: null;
	var start_permlink = (bundles.length > 0) ? last_permlink : null;

	steemjs_get_discussions_by_blog(config["tag"], 10, start_author, start_permlink, function(discussions) {
		discussions.forEach(function(discussion) {
			if (!config["author"] || config["author"] === discussion["author"]) {
				var userpic_url       = __fetch_userpic_url_in_discussion(discussion);
				var userpic_large_url = __fetch_userpic_large_url_in_discussion(discussion);;
				var payout_value      = __fetch_payout_value_in_discussion(discussion).toFixed(2);

				var bundle_id = "S_BUNDLES_" + discussion["author"] + "_" + discussion["permlink"];
				var title = discussion["title"];

				if (__is_audio_book(title)) {
					bundles.push({
            			"id":bundle_id,
						"author":discussion["author"],
						"permlink":discussion["permlink"],
						"title":discussion["title"], 
						"userpic-url":userpic_url,
						"userpic-large-url":userpic_large_url,
						"payout-value":"$" + payout_value.toString(),
						"main-tag":discussion["category"],
            		    "created-at":discussion["created"], 
            		    "hides-navibar":"no"
					});
				}
			}
		});

		last_author = bundles[bundles.length - 1]["author"];
		last_permlink = bundles[bundles.length - 1]["permlink"];

		__reload_list();
	});
}

function feed_list(keyword, location, length, sortkey, sortorder, handler) {
	handler(bundles);
}

function __reload_list() {
	var showcase = view.object("showcase.audio");

	showcase.action("reload");
}

function __is_audio_book(title) {
	var audio = /\s*(오디오북)\s*[\d]*/g.exec(title);

	if (audio) {
		return true;
	}

	return false;
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

function __fetch_image_url_in_content(content) {
	var url = /!\[[^\]]*\]\(([^\)]+)\)/g.exec(content.body);

	if (url) {
		return url[1];
	}

	return null;
}
