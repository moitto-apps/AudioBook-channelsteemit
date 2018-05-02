function steemjs_get_discussions_by_blog(tag, limit, start_author, start_permlink, handler) {
    var url = "https://api.steemjs.com/get_discussions_by_blog";
    var query = __query_for_discussions(tag, limit, start_author, start_permlink);

    fetch(url + "?" + "query=" + encodeURIComponent(query)).then(function(response){
        if (response.ok) {
           response.json().then(function(json) {
                handler(json);
            });
        }
    });
}

function steemjs_get_content(author, permlink, handler) {
	var url = "https://api.steemjs.com/get_content";
	var query = __query_for_content(author, permlink);

    fetch(url + "?" + query).then(function(response){
        if (response.ok) {
            response.json().then(function(json) {
                handler(json);
            });
        }
    });
}

function __query_for_discussions(tag, limit, start_author, start_permlink) {
    var params = {};

    params["tag"]   = tag;
    params["limit"] = limit.toString();

    if (start_author && start_permlink) {
        params["start_author"]   = start_author;
        params["start_permlink"] = start_permlink;
    }

    return JSON.stringify(params);
}

function __query_for_content(author, permlink) {
	var params = {};

	params["author"]   = author;
	params["permlink"] = permlink;

	return __to_query_string(params);
}

function __to_query_string(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join('&')
}
