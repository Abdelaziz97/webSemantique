const queries = {
	getAllEvents: `SELECT DISTINCT ?games
WHERE {
        ?event rdf:type dbo:OlympicEvent.
        ?event dbo:games ?games
        FILTER regex(?games,"[12].*[a-z]$")
}
ORDER BY DESC(?games)`,

}