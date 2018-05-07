sqlite3 = require('sqlite3').verbose()
fs = require('fs')

let db = null

function main() {
	initDB();
}

function log(message){
	console.log("LOG: %s", message);
}

function initDB() {
	log("Init of db goes here");

	if(!fs.existsSync("data"))
		fs.mkdirSync("data");

	let db = new sqlite3.Database("data/db.sqlite");
	db.serialize(() => {
		db.run("CREATE TABLE IF NOT EXISTS 'Note'(ID INTEGER PRIMARY KEY AUTOINCREMENT, note_text TEXT NOTT NULL)");
		db.run("INSERT INTO Note VALUES(1, 'TestNote1')");
		db.run("INSERT INTO Note VALUES(2, 'TestNote2')");
		db.run("INSERT INTO Note VALUES(3, 'TestNote3')");
	});
}

main();