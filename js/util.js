
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
}

function request(req, fieldId, athlete, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
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
}

function requestFromEvent(req, fieldId, athlete, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var first = result = resultatsReq.results.bindings[0];
        var result = format(first);
        $(fieldId).html(result);
    });
}

function requestArray(req, fieldId, athlete, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var result = [];
		for(let i=0;i<resultatsReq.results.bindings.length;++i){
			result.push(format(resultatsReq.results.bindings[i]));
		}
		result.sort().reverse();
        if (result.length>0) {
        	for(let i=0;i<resultatsReq.results.bindings.length;++i){
				var event_name = result[i].replace("\'", "£");
				var e = $('<li onclick=\'requestPodiumByEvent("'+event_name+'");\'></li>');
				e.html(result[i]);
        		$(fieldId).append(e);
			}
        } else {
            $(fieldId).parent().hide();
        }
    });
}

function requestImageArray(req, fieldId, athlete, index, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var first = resultatsReq.results.bindings[0];
        var e = "<tr><td><img src=\"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif\" class=\"img-thumbnail img-fluid\" style=\"width:80px;height:80px;\"/></td><td id=\"label"+index+"\"></td><td id=\"abstract"+index+"\"></td><td id=\"gold"+index+"\"><a id=\"goldRef"+index+"\"></a></td><td id=\"silver"+index+"\"><a id=\"silverRef"+index+"\"></a></td><td id=\"bronze"+index+"\"><a id=\"bronzeRef"+index+"\"></a></td></tr>";
        var result = format(first);
        e = e.replace('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',result);
        e = $(e);
        $(fieldId).append(e);
    });
}

function requestImage(req, fieldId, athlete, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var first = result = resultatsReq.results.bindings[0];
        if (first !== undefined && first !== null) {
            var result = format(first);
            $(fieldId).attr("src", result);
        }
    });
}

function requestPodiumByEvent(name_event){
	tmp = name_event.replace("£","\'");
	req = queries.getByEventPodium;
    req = req.replace('%ATHLETE%', '"' + tmp + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var first = result = resultatsReq.results.bindings[0];
        if (first !== undefined && first !== null) {
			var event_name = first.name.value;
			var label_gold = first.labelGold.value;
            var label_silver = first.labelSilver.value;
			var label_bronze = first.labelBronze.value;
			var img_gold;
			var img_silver;
			var img_bronze;
			if (first.imgGold !== undefined && first.imgGold.value !== null) {
				img_gold = first.imgGold.value;
			}else{
				img_gold = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			if (first.imgSilver !== undefined && first.imgSilver.value !== null) {
				img_silver = first.imgSilver.value;
			}else{
				img_silver = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			if (first.imgBronze !== undefined && first.imgBronze !== null) {
				img_bronze = first.imgBronze.value;
			}else{
				img_bronze = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			draw_podium(event_name,label_gold,label_silver,label_bronze,img_gold,img_silver,img_bronze);
	    } else {
            $('#container').parent().hide();
            $('#container').text("UNDEFINED");
		}
	});
}

function requestPodium(req, athlete){
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
    $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
        var first = result = resultatsReq.results.bindings[0];
        if (first !== undefined && first !== null) {
			var event_name = first.name.value;
            var label_silver = first.labelSilver.value;
			var label_bronze = first.labelBronze.value;
			var img_gold;
			var img_silver;
			var img_bronze;
			if (first.imgGold !== undefined && first.imgGold.value !== null) {
				img_gold = first.imgGold.value;
			}else{
				img_gold = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			if (first.imgSilver !== undefined && first.imgSilver.value !== null) {
				img_silver = first.imgSilver.value;
			}else{
				img_silver = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			if (first.imgBronze !== undefined && first.imgBronze !== null) {
				img_bronze = first.imgBronze.value;
			}else{
				img_bronze = "https://st3.depositphotos.com/5266903/13965/v/1600/depositphotos_139656228-stock-illustration-3rd-prizer-sportsman-flat-vector.jpg";
			}
			draw_podium(event_name,athlete,label_silver,label_bronze,img_gold,img_silver,img_bronze);
	    } else {
            $('#container').parent().hide();
            $('#container').text("UNDEFINED");
		}
	});
}

function requestSpotlight(req, fieldId, athlete, format) {
    req = req.replace('%ATHLETE%', '"' + athlete + '"');
    var reqUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
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


function getAllMedalistAndEvents(document, athleteList, athleteURL, yearList, yearURL, callback){
	var query = queries.getAllMedalist;
	var url = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(query) +'&format=json';
	$.getJSON(url+"&callback=?", function(resultats) {
	  resultats.results.bindings.forEach(function(element) {
	    athleteURL.push(element.human.value);
	    let name = element.name.value;
	    if(name.includes("("))
	      name = name.substring(0,name.indexOf("("));
	    athleteList.push(name);
	  });
	  autocomplete(document.getElementById('recherche'), document.getElementById("autocomplete"), athleteList, rechercher);
	  callback();
	});

	query = queries.getAllEvents;
	var url = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(query) +'&format=json';
	var urlGame = "https://dbpedia.org/resource/";
	$.getJSON(url+"&callback=?", function(resultats) {
	    resultats.results.bindings.forEach(function(element) {
	    yearList.push(element.games.value);
	    yearURL.push(urlGame+element.games.value);
	  });
	  var indexToDelete = yearList.indexOf("2016  Summer");
	  yearList.splice(indexToDelete, 1);
	  yearURL.splice(indexToDelete, 1);
	  autocomplete(document.getElementById('rechercheEvent'), document.getElementById("autocompleteEvent"), yearList, rechercherEvent);
	})
}
