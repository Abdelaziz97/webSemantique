const queries = {
	getAllEvents: 'SELECT DISTINCT ?games '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:games ?games '+
        'FILTER regex(?games,"[12].*[a-z]$")} '+
'ORDER BY DESC(?games)',

	getAllMedalist: 'SELECT ?name ?human  '+
'WHERE{ '+
	'SELECT ?name ?human (count(*) as ?count) '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?name } '+ 
	'UNION {?event dbo:silverMedalist ?human . ?human rdfs:label ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human rdfs:label ?name} '+
        'FILTER (lang(?name) = "en") }} '+
'ORDER BY DESC(?count)',

	getByEventAbstract:'SELECT DISTINCT ?abstract '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:abstract ?abstract. '+
        'FILTER langMatches(lang(?abstract),"en") '+	          
'FILTER regex(str(?event), %ATHLETE%)}',

	getByEventBronze:'SELECT DISTINCT ?label ?bronze '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:bronzeMedalist ?bronze. '+
        '?bronze rdfs:label ?label '+
        'FILTER (lang(?label)="en") '+
        'FILTER regex(str(?event) ,%ATHLETE%) '+
'}',

	getByEventEvents:'SELECT DISTINCT ?event '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        'FILTER regex(?event,%ATHLETE%) '+
'}',

	getByEventGold:'SELECT DISTINCT ?label ?gold '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:goldMedalist ?gold. '+
        '?gold rdfs:label ?label '+
        'FILTER (lang(?label)="en") '+
        'FILTER regex(str(?event) ,%ATHLETE%) '+
'}',

	getByEventImage:'SELECT DISTINCT ?image '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:thumbnail ?image '+
        'FILTER regex(str(?event),%ATHLETE%) '+
'}',

	getByEventLabel:'SELECT DISTINCT ?label '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event rdfs:label ?label '+
        'FILTER (lang(?label)="en") '+
        'FILTER regex(str(?event),%ATHLETE%) '+
'}',

	getByEventPodium:'SELECT ?name ?labelGold ?labelSilver ?labelBronze ?imgGold ?imgSilver ?imgBronze '+
'WHERE{ '+
	'SELECT ?name ?human ?labelGold ?labelSilver ?labelBronze ?imgGold ?imgSilver ?imgBronze '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name .  '+
                                                '?event dbo:goldMedalist ?human.  '+
                                                'OPTIONAL{?human dbo:thumbnail ?imgGold.} '+
                                                '?human rdfs:label ?labelGold. '+
                                                '?event dbo:silverMedalist ?silver . '+
                                                '?silver rdfs:label ?labelSilver. '+
                                                'OPTIONAL {?silver dbo:thumbnail ?imgSilver.} '+
                                                '?event dbo:bronzeMedalist ?bronze . '+
                                                '?bronze rdfs:label ?labelBronze.  '+
                                                'OPTIONAL{?bronze dbo:thumbnail ?imgBronze.}} '+
	'FILTER (str(?name) = %ATHLETE%) '+
	'FILTER (lang(?labelGold)="en") '+
        'FILTER (lang(?labelSilver)="en") '+
        'FILTER (lang(?labelBronze)="en") '+
        'FILTER (lang(?name)="en") '+
        '} '+
'}',

	getByEventSilver:'SELECT DISTINCT ?label ?silver '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
        '?event dbo:silverMedalist ?silver. '+
        '?silver rdfs:label ?label '+
        'FILTER (lang(?label)="en") '+
        'FILTER regex(str(?event) ,%ATHLETE%) '+
'}',

	getByEventWinners:'SELECT DISTINCT ?event ?namevent (group_concat(DISTINCT ?namebronze;separator="|") as ?names_bronze) '+
                          '(group_concat(DISTINCT ?namesilver;separator="|") as ?names_silver) '+
                          '(group_concat(DISTINCT ?namegold;separator="|") as ?names_gold) '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
             '?event rdfs:label ?namevent . '+
             'FILTER langMatches(lang(?namevent),"en") '+
       	'?event dbo:bronzeMedalist ?bronze. '+
             '?bronze rdfs:label ?namebronze. '+
             'FILTER langMatches(lang(?namebronze),"en") '+
        '?event dbo:silverMedalist ?silver. '+
             '?silver rdfs:label ?namesilver. '+
             'FILTER langMatches(lang(?namesilver),"en") '+
        '?event dbo:goldMedalist ?gold. '+
             '?gold rdfs:label ?namegold. '+
             'FILTER langMatches(lang(?namegold),"en") '+
'FILTER regex(?namevent, %ATHLETE%)}',

	getByNameAbstract:'SELECT ?abstract '+
'WHERE{ '+
	'SELECT ?abstract '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbo:abstract ?abstract. ?human rdfs:label ?label }  '+
	'UNION {?event dbo:silverMedalist ?human . ?human dbo:abstract ?abstract. ?human rdfs:label ?label }  '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbo:abstract ?abstract. ?human rdfs:label ?label } '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label)="en") '+
        'FILTER (lang(?abstract) = "en")}}',

	getByNameBirthDate:'SELECT ?date '+
'WHERE{ '+
	'SELECT ?human ?date '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbo:birthDate ?date . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:silverMedalist ?human .?human dbo:birthDate ?date . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbo:birthDate ?date . ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label)="en")} '+
'LIMIT 1}',

	getByNameBirthPlace:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?human ?name '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label.  ?human dbo:birthPlace ?place . ?place rdfs:label ?name }  '+
	'UNION {?event dbo:silverMedalist ?human . ?human rdfs:label ?label. ?human dbo:birthPlace ?place . ?place rdfs:label ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human rdfs:label ?label. ?human dbo:birthPlace ?place . ?place rdfs:label ?name} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en") '+
	'FILTER (lang(?name) = "en")} '+
'LIMIT 1}',

	getByNameClub:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?human ?name '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label. ?human dbo:club ?club . ?club foaf:name ?name }  '+
	'UNION {?event dbo:silverMedalist ?human . ?human rdfs:label ?label . ?human dbo:club ?club . ?club foaf:name ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human rdfs:label ?label . ?human dbo:club ?club . ?club foaf:name ?name} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en") '+
	'FILTER (lang(?name) = "en")} '+
'LIMIT 1}',

	getByNameCoach:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?human ?name '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label { ?human dbo:coach ?coach } UNION { ?human dbp:coach ?coach } . ?coach rdfs:label ?name } '+ 
	'UNION {?event dbo:silverMedalist ?human . ?human rdfs:label ?label { ?human dbo:coach ?coach } UNION { ?human dbp:coach ?coach } . ?coach rdfs:label ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human rdfs:label ?label { ?human dbo:coach ?coach } UNION { ?human dbp:coach ?coach } . ?coach rdfs:label ?name} '+
	'FILTER regex(?label, %ATHLETE%) '+
        'FILTER (lang(?label) = "en") '+
	'FILTER (lang(?name) = "en")} '+
'LIMIT 1}', 

	getByNameGender:'SELECT ?gender '+
'WHERE{ '+
	'SELECT ?human ?gender '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human foaf:gender ?gender . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:silverMedalist ?human . ?human foaf:gender ?gender . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human foaf:gender ?gender . ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en") '+
  	'FILTER (lang(?gender) = "en")}}',

  	getByNameHeight:'SELECT ?height '+
'WHERE{ '+
	'SELECT ?height ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbo:height ?height . ?human rdfs:label ?label} '+
	'UNION {?event dbo:silverMedalist ?human . ?human dbo:height ?height . ?human rdfs:label ?label} '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbo:height ?height . ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en")}}',


  	getByNameImage:'SELECT ?image '+
'WHERE{ '+
	'SELECT ?image '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbo:thumbnail ?image . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:silverMedalist ?human . ?human dbo:thumbnail ?image . ?human rdfs:label ?label}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbo:thumbnail ?image . ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en")}}',

	getByNameNationality:'SELECT ?nationality '+
'WHERE{ '+
	'SELECT ?nationality ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbp:nationality ?nationality . ?human rdfs:label ?label} '+
	'UNION {?event dbo:silverMedalist ?human . ?human dbp:nationality ?nationality . ?human rdfs:label ?label} '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbp:nationality ?nationality . ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label) = "en")}}',

	getByNameNbMedals:'SELECT ?count  '+
'WHERE{ '+
	'SELECT (count(*) as ?count)  '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label  }  '+
	'UNION {?event dbo:silverMedalist ?human. ?human rdfs:label ?label}  '+
	'UNION {?event dbo:goldMedalist ?human. ?human rdfs:label ?label} '+
	'FILTER regex(?label, %ATHLETE%) '+
        'FILTER (lang(?label) = "en")}}',

    getByNameSport:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?name ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label . ?human <http://purl.org/linguistics/gold/hypernym> ?sport. ?sport rdfs:label ?name }  '+
	'UNION {?event dbo:silverMedalist ?human . ?human rdfs:label ?label . ?human <http://purl.org/linguistics/gold/hypernym> ?sport . ?sport rdfs:label ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human rdfs:label ?label . ?human <http://purl.org/linguistics/gold/hypernym> ?sport . ?sport rdfs:label ?name} '+
        'FILTER regex(?label, %ATHLETE%) '+
        'FILTER (lang(?label) = "en") '+
	'FILTER (lang(?name) = "en")}}',

	getByNameWeight:'SELECT ?weight '+
'WHERE{ '+
	'SELECT ?weight ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human. ?human dbo:weight ?weight . ?human rdfs:label ?name}  '+
	'UNION {?event dbo:silverMedalist ?human . ?human dbo:weight ?weight . ?human rdfs:label ?name}  '+
	'UNION {?event dbo:goldMedalist ?human . ?human dbo:weight ?weight . ?human rdfs:label ?name} '+
	'FILTER regex(?name, %ATHLETE%) '+
	'FILTER (lang(?name) = "en")}}',

	getByNameDescription:'SELECT ?description '+
'WHERE{ '+
	'SELECT ?description ?human ?name '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human . ?human dct:description ?description . ?human rdfs:label ?name }  '+
	'UNION {?event dbo:silverMedalist ?human . ?human dct:description ?description . ?human rdfs:label ?name} '+
        'UNION {?event dbo:goldMedalist ?human . ?human dct:description ?description . ?human rdfs:label ?name } '+
	'FILTER regex(?name, %ATHLETE%) '+
        'FILTER (lang(?name) = "en")}}',

    getByNameEventBronze:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?name ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . ?event dbo:bronzeMedalist ?human . ?human rdfs:label ?label } '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label)="en") '+
        'FILTER (lang(?name)="en")}}',

    getByNameEventGold:'SELECT ?name '+
'WHERE{ '+
	'SELECT ?name ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . ?event dbo:goldMedalist ?human . ?human rdfs:label ?label } '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label)="en") '+
        'FILTER (lang(?name)="en")}}',

	getByNameEventSilver: 'SELECT ?name '+
'WHERE{ '+
	'SELECT ?name ?human '+
	'WHERE {?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . ?event dbo:silverMedalist ?human . ?human rdfs:label ?label } '+
	'FILTER regex(?label, %ATHLETE%) '+
	'FILTER (lang(?label)="en") '+
        'FILTER (lang(?name)="en")}}',

    getByYearEvents: 'SELECT DISTINCT ?event ?name '+
'WHERE { '+
        '?event rdf:type dbo:OlympicEvent. '+
	'?event dbo:games ?year. '+
	'?event rdfs:label ?name. '+
	'FILTER regex(?year,%ATHLETE%) '+
        'FILTER (lang(?name) = "en")',

    getByNamePodium: 'SELECT ?name ?labelGold ?labelSilver ?labelBronze ?imgGold ?imgSilver '+ 
'?imgBronze '+
'WHERE{ '+ 
	'SELECT ?name ?human ?labelGold ?labelSilver ?labelBronze ?imgGold ?imgSilver ?imgBronze '+
	'WHERE {{?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . '+  
                                                '?event dbo:goldMedalist ?human . '+  
                                                'OPTIONAL {?human dbo:thumbnail ?imgGold.} '+ 
                                                '?human rdfs:label ?labelGold. '+
                                                '?event dbo:silverMedalist ?silver . '+ 
                                                '?silver rdfs:label ?labelSilver. '+ 
                                                '?silver dbo:thumbnail ?imgSilver. '+
                                                '?event dbo:bronzeMedalist ?bronze . '+ 
                                                '?bronze rdfs:label ?labelBronze. '+  
                                                '?bronze dbo:thumbnail ?imgBronze.} '+
	'FILTER regex(str(?labelGold),  %ATHLETE%) '+
        'FILTER (lang(?labelGold)="en") '+ 
        'FILTER (lang(?labelSilver)="en") '+ 
        'FILTER (lang(?labelBronze)="en") '+ 
        'FILTER (lang(?name)="en")} '+
        'UNION '+
        '{?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . '+  
                                                '?event dbo:goldMedalist ?human . '+  
                                                'OPTIONAL {?human dbo:thumbnail ?imgGold.} '+ 
                                                '?human rdfs:label ?labelGold. '+
                                                '?event dbo:silverMedalist ?silver . '+ 
                                                '?silver rdfs:label ?labelSilver. '+ 
                                                'OPTIONAL {?silver dbo:thumbnail ?imgSilver.} '+
                                                '?event dbo:bronzeMedalist ?bronze . '+ 
                                                '?bronze rdfs:label ?labelBronze. '+  
                                                'OPTIONAL{?bronze dbo:thumbnail ?imgBronze.}} '+
	'FILTER regex(str(?labelSilver),  %ATHLETE%) '+
        'FILTER (lang(?labelGold)="en") '+ 
        'FILTER (lang(?labelSilver)="en") '+ 
        'FILTER (lang(?labelBronze)="en") '+ 
        'FILTER (lang(?name)="en")} '+
        'UNION '+
        '{?event rdf:type dbo:OlympicEvent{?event rdfs:label ?name . '+  
                                                '?event dbo:goldMedalist ?human . '+  
                                                'OPTIONAL {?human dbo:thumbnail ?imgGold.} '+ 
                                                '?human rdfs:label ?labelGold. '+
                                                '?event dbo:silverMedalist ?silver . '+ 
                                                '?silver rdfs:label ?labelSilver. '+ 
                                                'OPTIONAL{?silver dbo:thumbnail ?imgSilver.} '+
                                                '?event dbo:bronzeMedalist ?bronze . '+ 
                                                '?bronze rdfs:label ?labelBronze. '+  
                                                'OPTIONAL{?bronze dbo:thumbnail ?imgBronze.}} '+
	'FILTER regex(str(?labelBronze),  %ATHLETE%) '+
        'FILTER (lang(?labelGold)="en") '+
        'FILTER (lang(?labelSilver)="en") '+ 
        'FILTER (lang(?labelBronze)="en") '+
        'FILTER (lang(?name)="en")}}}'
};
