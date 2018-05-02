include("Scripts/steemjs.js");
include("config.js");

var bundle = null;

function feed_post() {
	steemjs_get_content($data["author"], $data["permlink"], function(content) {
		bundle = {};

		bundle["title"] = content["title"];
		bundle["body"] = content["body"];

		var meta = JSON.parse(content["json_metadata"]);

		bundle["youtube"] = __get_youtube_url(meta["links"])
		bundle["video-id"] = __get_youtube_id(bundle["youtube"])

		var tags = meta["tags"]

		var index = 1;

		tags.forEach(function(tag) {
			var tag_key = "tag-" + index;
			bundle[tag_key] = tag;

			index ++;
		});

		__reload_cell();
	});
}

function __get_youtube_id(url) {
	var tokens = url.split("/")
	var path = tokens[tokens.length - 1]
	var pathnames = path.split("?")
	var params = pathnames[pathnames.length -1].split("&")

	var id = tokens[tokens.length - 1];

	for (var i=0; i<params.length; i++) {
		var values = params[i].split("=");
		if (values[0] === "v") {
			id = values[values.length - 1]
			break;
		}
	}



	return id;
}

function __get_youtube_url(links) {
	var ylink = "";

	links.forEach(function(link) {
		if (link.includes("youtu")) {
			ylink = link;
			return;
		}
	});

	return ylink;
}

function __reload_cell() {
	if (bundle) {
		var cell = view.object("cell.detail." + $data["id"]);

		cell.data("display-unit", bundle);
		cell.action("reload");
	}
}