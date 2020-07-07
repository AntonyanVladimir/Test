var articles = [
	{
		id: 'article1',
		ueberschrift: 'HTML Dokumente',
		autor: 'Thomas Richter',
		datum: new Date('15. February 2015 20:14').toISOString(),
		anriss: 'Eine kurze Einführung in HTML-Dokumente',
		text: 'HTML Dokumente dienen der Strukturierung von Inhalten, die im Web bzw. mit Webtechnologien wie Internetbrowser und Hypertext Transfer Protocol (HTTP) verbreitet werden sollen. HTML Dokumente bestehen aus HTML-Elementen. Das einfachste HTML5 Dokument ist: <br>'
			+ '<pre>'
			+ '&lt;!DOCTYPE html&gt;\n'
			+ '&lt;html&gt;\n'
			+ '  &lt;head&gt;\n'
			+ '    &lt;title&gt;Titel des Dokuments&lt;/title&gt;\n'
			+ '  &lt;/head&gt;\n'
			+ '  &lt;body&gt;\n'
			+ '  &lt;/body&gt;\n'
			+ '&lt;/html&gt;\n'
			+ '</pre>',
		bild: 'https://cdn.pixabay.com/photo/2015/10/02/15/59/olive-oil-968657_960_720.jpg',
		tags: ['HTML5', 'Dokument', 'HTTP']
	},
	{
		id: 'article2',
		ueberschrift: 'HTML Elemente',
		autor: 'Thomas Richter',
		datum: new Date('15. February 2015 20:14').toISOString(),
		anriss: 'Eine kurze Einführung in HTML Elemente',
		text: 'Die HTML Elemente eines HTML Dokuments sind ineinander geschachtelt und bilden damit eine hierarchische Struktur, einen Baum. Ein Element besteht üblicherweise aus einem öffnenden und einem schließenden Tag. Zwischen den beiden Tags befindet sich der eigentliche Inhalt des Elements.<br> Weiterhin können im öffnenden Tag Attribute in Form von Schlüssel-Wert Paaren notiert werden.<br><br>Beispiel: <code>&lt;a href="https://w3.org"&gt;Das ist ein Link auf ein anderes HTML-Dokument (W3C)&lt;/a&gt;</code> wird dargestellt als:<br><br><a href="https://w3.org">Das ist ein Link auf ein anderes HTML-Dokument (W3C)</a>',
		bild: './images/swan.jpg',
		tags: ['HTML5', 'Element']
	},
	{
		id: 'article3',
		ueberschrift: 'Semantische Strukturierung von HTML-Seiten',
		autor: 'Thomas Richter',
		datum: new Date('15. February 2015 20:14').toISOString(),
		anriss: 'Ein kurzer Überblick über semantische Elemente in HTML5.',
		text: 'In der Vergangenheit wurden HTML-Dokumente häufig mit Tabellen oder Frames (ok, sehr weit zurückliegende Vergangenheit...) strukturiert. Später wurden dafür <code>&lt;div&gt;</code>-Elemente verwendet. In HTML5 gibt es Elemente, die es erlauben, den einzelnen Teilen des Dokuments eine Semantik zu verleihen, die von modernen Browsern ausgewertet wird und ggf. die Darstellung - z. B. auf Mobilgeräten und in Readern - beeinflusst. Beispielsweise lässt sich ein Dokument mit den Elementen <code>&lt;header&gt;, &lt;main&gt;, &lt;footer&gt;</code> grob in Kopf-, Inhalts- und Fußbereich unterteilen. Weitere semantische Elemente sind <code>&lt;nav&gt;, &lt;aside&gt;, &lt;article&gt;, &lt;section&gt;</code>',
		bild: 'https://cdn.pixabay.com/photo/2020/04/20/18/10/cinema-5069314_960_720.jpg',
		tags: ['Semantik', 'HTML5', 'Element']
	},
];

var http = require('http');

var url = require('url');

var express = require('express');

var cors = require('cors');

var bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser());

var server = http.createServer(app);

server.listen(3000);

app.get('/articles', (req, res) => {

	var urlParts = url.parse(req.url, true);
	var query = urlParts.query;
	let arts = articles;

	if (query.tag && query.suchwort) {
		let artsFromTag = getArticlesByTagName(articles, query.tag);
		arts = getArticlesBySuchwort(artsFromTag, query.suchwort);
	}
	else if (query.tag)
		arts = getArticlesByTagName(articles, query.tag);

	else if (query.suchwort)
		arts = getArticlesBySuchwort(articles, query.suchwort);

	res.contentType('application/json');
	res.send(JSON.stringify(arts));
	res.end();
})


app.delete('/articles/:id', (req, res) => {
	let successMessage = {
		status: 'deleted',
		message: 'Artikel wurde erfolgreich gelöscht.'
	}
	let errorMessage = {
		status: 'failed',
		message: 'Artikel wurde nicht gefunden.'
	}
	var artikelToBeDeleted = articles.find(a => a.id === req.params.id);
	if (!artikelToBeDeleted)
		res.status(404).send(JSON.stringify(errorMessage));

	const index = articles.indexOf(artikelToBeDeleted);
	articles.splice(index, 1);
	res.send(JSON.stringify(successMessage));
});

app.put('/articles/:id', (req, res) => {
	let artToBeChanged = articles.find(m => m.id === req.params.id);

	if (!artToBeChanged)
		res.status(404).send('Artikel wurde nicht gefunden.');
	
		artToBeChanged.id = req.body.id,
		artToBeChanged.anriss = req.body.anriss,
		artToBeChanged.text = req.body.text,
		artToBeChanged.autor = req.body.autor,
		
	 res.send(artToBeChanged);
})

app.post('/articles', (req, res)=>{
	 
	let newArticle = {};
	newArticle.id = (++articles.length).toString();
	newArticle.autor = req.body.autor;
	newArticle.datum = new Date();
	newArticle.anriss = req.body.anriss;
	newArticle.text = req.body.text;
	
	articles.push(newArticle);
	res.send(JSON.stringify(newArticle));
	res.end();
})

app.get('/tags', (req, res)=>{
	let tagMap = new Map();
	for(let artikel of articles)
		for(let tag of artikel.tags){
			if(!tagMap.has(tag))			
				tagMap.set(tag, 1);
			else{
				let incremntValue = tagMap.get(tag);
				tagMap.set(tag, ++incremntValue);
				
			}
		}
	var jsonText = JSON.stringify(Array.from(tagMap.entries()));
	res.send(jsonText);
	
})

function getArticleById(id, articles) {
	const article = articles.find(a => a.id == id);
	return article;
}

function getArticlesByTagName(artikels, tagName) {
	let arts = [];
	for (let artikel of artikels) {
		for (let tag of artikel.tags)
			if (tag === tagName)
				arts.push(artikel);
		continue;
	}

	return arts;
}

function getArticlesBySuchwort(artikels, suchwort) {
	const arts = [];
	for (let artikel of artikels) {
		for (property in artikel) {
			if (property === 'ueberschrift' || property === 'text') {
				if (artikel[property].search(suchwort) !== -1) {
					arts.push(artikel);
					continue;

				}
			}
		}
	}
	return arts;
}































































