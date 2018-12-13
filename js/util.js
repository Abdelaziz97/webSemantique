var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function readTextFile(filename, callback) {
    $.get(filename, function(data) {
        callback(data);
    }, 'text');
}

function request(filename, fieldId, athlete, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%ATHLETE%', '"' + athlete + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                $(fieldId).html(result);
            } else {
                $(fieldId).parent().hide();
                $(fieldId).text("UNDEFINED");
            }
        });
    });
}