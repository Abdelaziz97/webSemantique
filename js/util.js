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

function requestArray(filename, fieldId, athlete, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%ATHLETE%', '"' + athlete + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var result = [];
			for(let i=0;i<resultatsReq.results.bindings.length;++i){
				result.push(format(resultatsReq.results.bindings[i]));
			}
			result.sort().reverse();
            if (result.length>0) {
            	for(let i=0;i<resultatsReq.results.bindings.length;++i){
					var e = $("<li></li>");
					e.html(result[i]);
	        		$(fieldId).append(e);
				}
            } else {
                $(fieldId).parent().hide();
            }
        });
    });
}

function requestImage(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%ATHLETE%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                $(fieldId).attr("src", result);
            }
        });
    });
}


function requestPodium(filename, athlete){
	readTextFile(filename, function(req) {
        req = req.replace('%ATHLETE%', '"' + athlete + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
				var event_name = first.name.value;
                var label_silver = first.labelSilver.value;
				var label_bronze = first.labelBronze.value;
				var img_gold = first.imgGold.value;
				var img_silver = first.imgSilver.value;
				var img_bronze = first.imgBronze.value;
				draw_podium(event_name,athlete,label_silver,label_bronze,img_gold,img_silver,img_bronze);
		    } else {
                $('#container').parent().hide();
                $('#container').text("UNDEFINED");
			}
		});
	});
}

function requestSpotlight(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%ATHLETE%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                spotlight(result, function(newResult) {
                    $(fieldId).html(newResult);
                });
            } else {
                $(fieldId).parent().hide();
                $(fieldId).text("UNDEFINED");
            }
        });
    });
}

function draw_podium(event_name,name_gold,name_silver,name_bronze,img_gold,img_silver,img_bronze) {
	$('#container').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: event_name
		},
		xAxis: {
			categories: false,
			lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			labels: {
			   enabled: false
		   },
			minorTickLength: 0,
			tickLength: 0
		},
		yAxis: {
			min: 0,
			gridLineWidth: 0,
			title: {
				text: false
			},
			labels: {
			   enabled: false
		   }
		},
		 legend: {
			   enabled: false
		   
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px"><b>{point.key}</b></span>',
			pointFormat: '<span></span>',
			shared: true,
			useHTML: true,
			positioner: function(boxWidth, boxHeight, point) {
				return {
					x: point.plotX,
					y: point.plotY + 100
				}
			}
		},
		plotOptions: {
			column: {
				pointPadding: -0.3,
				borderWidth: 0
			}
		},
	   
		series: [{
			data:[
				{name : name_silver, 
				 color : "#C0C0C0",
				 image : img_silver,
				 y: 2
				},
				{name : name_gold, 
				 color : "#FFD700",
				 image : img_gold, 
				 y : 3
				},
				{name : name_bronze,
				 color : "#CD7F32",
				 image : img_bronze,
				 y: 1}
			]
			,
			dataLabels: {
				enabled: true,
				color: 'white',
				align: 'center',
				x: 3,
				y: 60,
				useHTML: true,
				overflow: false,
				crop: false,
				formatter: function() {
					  return '<img src="'+this.point.image+'" style="width:50px;height:70px;" /> <br>' + (4 - this.y);  
				},
				style: {
					fontSize: '50px',
					fontFamily: 'Verdana, sans-serif',
					textShadow: '0 0 3px black'
				}
			}
		}]
	});
};

function spotlight(abstract, callback) {
    var url = "https://api.dbpedia-spotlight.org/en/annotate?text=" + encodeURIComponent(abstract) + "&confidence=0.9";
    $.get(url, function(result) {
        var index1 = result.indexOf("<div>") + 5;
        var index2 = result.indexOf("</div>");
        var newAbstract = result.substring(index1, index2);
        callback(newAbstract);
    });
}
