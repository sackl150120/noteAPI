const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let db = null;

function main() {
	initDB();

	var bodyParser = require('body-parser');
	var express = require('express');
	var app = express();

	app.use(bodyParser.json())

	app.route('/notes')
		.get(getNote)
		.post(postNote)

	app.route('/notes/:id')
		.get(getNoteByID)
		.put(putNoteByID)
		.delete(deleteNoteByID)
	
	app.listen(3000, () => log("Listen to port 3000..."));
}

function getNote(req, res){
	db.all("SELECT ID, note_text FROM Note", function(err, rows){
		if (err) {
			log(err);
		} else {
			var notes = [];
			rows.forEach(function(row){
				var note = { "ID": row.ID, "note_text": row.note_text };
				notes.push(note);
			})
			res.json({"notes":notes});
		}
	})
}

function postNote(req, res){
	var note_text = req.body.note_text
	if (note_text) {
		db.serialize(() => {
			db.run("INSERT INTO Note VALUES(null ,'"+note_text+"')", function(err){
				if (err) {
					res.json(err);
				} else {
					res.json({"note_text": note_text});
				}
			});
		});
	}
}

function getNoteByID(req, res){
var id = req.params.id;
	db.get("SELECT ID, note_text FROM Note WHERE ID = '"+id+"'", function(err, row){
		if (err) {
			log(err);
		} else {
			var note = { "ID": row.ID, "note_text": row.note_text };
			res.json({"note": note});
		}
	});
}

function putNoteByID(req, res){
	var id = req.params.id;
	var note_text = req.body.note_text;
	if (note_text) {
		db.serialize(() => {
			// Insert Into or Replace statt Update
			db.run("UPDATE Note SET note_text = '"+note_text+"' WHERE ID = '"+id+"'", function(err){
				if (err) {
					log(err);
				} else {
					res.json({ "ID": id, "note_text": note_text });
				}
			});
			
		});
	}
}

function deleteNoteByID(req, res){
	var id = req.params.id;
	db.serialize(() =>  {
		db.run("DELETE FROM Note WHERE ID = '"+id+"'", function(err){
			if (err) {
				log(err);
			} else {
				var del_note = "Notiz mit ID " + id + " wurde gelöscht!";
				res.json(del_note);
			}
		});
	});
}




function log(message){
	console.log("LOG: %s", message);
}

function initDB() {
	log("Init of db goes here");

	if(!fs.existsSync("data"))
		fs.mkdirSync("data");
	
	if (!fs.existsSync("data/db.sqlite")) {
			db = new sqlite3.Database("data/db.sqlite");
			db.serialize(() => {
			db.run("CREATE TABLE IF NOT EXISTS 'Note'(ID INTEGER PRIMARY KEY AUTOINCREMENT, note_text TEXT NOT NULL)");
			db.run("INSERT INTO Note VALUES(null ,'TestNote1')");
			db.run("INSERT INTO Note VALUES(null ,'TestNote2')");
			db.run("INSERT INTO Note VALUES(null ,'TestNote3')");
		});
	}
	else
	{
		db = new sqlite3.Database("data/db.sqlite");
		log("DB is scho do!");
	}
}

main();