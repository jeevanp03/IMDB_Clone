import mysql from "mysql";
import config from "./config.js";
import fetch from "node-fetch";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import response from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.post("/api/loadUserSettings", (req, res) => {
  let connection = mysql.createConnection(config);
  let userID = req.body.userID;

  let sql = `SELECT mode FROM user WHERE userID = ?`;
  console.log(sql);
  let data = [userID];
  console.log(data);

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    //let obj = JSON.parse(string);
    res.send({ express: string });
    console.log(results);
  });
  connection.end();
});

app.post("/api/getMovies", (req, res) => {
  let connection = mysql.createConnection(config);
  let userID = req.body.userID;

  let sql = `SELECT * FROM movies`;
  console.log(sql);
  let data = [userID];
  console.log(data);

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    //let obj = JSON.parse(string);
    res.send({ express: string });
    console.log(typeof results);
  });
  connection.end();
});

app.post("/api/sendReview", (req, res) => {
  let connection = mysql.createConnection(config);
  let userID = req.body.userID;
  let reviewTitle = req.body.reviewTitle;
  let reviewContent = req.body.reviewContent;
  let reviewScore = req.body.reviewScore;
  let movieID = req.body.movieID;

  let sql = `INSERT INTO review (reviewTitle, reviewContent, reviewScore, userID, movieID) VALUES (?, ?, ?, ?, ?)`;
  console.log(sql);
  var values = [reviewTitle, reviewContent, reviewScore, userID, movieID];
  console.log(values);

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    //let obj = JSON.parse(string);
    res.send({ express: string });
    console.log(typeof results);
  });
  connection.end();
});

app.post('/api/searchMovie', (req, res) => {
	let connection = mysql.createConnection(config);
	let searchSettings = req.body.searchSettings;
	let userID = req.body.userID;
	console.log("Search Settings", searchSettings)
	let data;
	let sql;
  let length = searchSettings.length;
  if(length === 1){
    var searchTerm = searchSettings[0].searchTerm;
    var searchSetting = searchSetting[0].searchSetting;
    sql = ``;
    data = [searchTerm, searchSetting]
  }else if(length === 2){
    var searchTerms = [];
    var settings = [];
    sql = ``;
    data = [searchTerm[0], searchSetting[0], searchTerm[1], searchSetting[1]]
  }else{
    var searchTerms = [];
    var settings = [];
    sql = ``;
    data = [searchTerm[0], searchSetting[0], searchTerm[1], searchSetting[1], searchTerm[2], searchSetting[2]]
  }
	// if(caloriesSearchTerm.trim() > 0){
	// 	sql = `SELECT * FROM recipe WHERE calories <= ?`;
	// 	data = [caloriesSearchTerm];
	// }else{
	// 	sql = 'SELECT * FROM recipe'
	// 	data = [recipeID]
	// }
  	
  	console.log(sql);
  	 
  	console.log(data);

  	connection.query(sql, data, (error, results, fields) => {
    	if (error) {
      		return console.error(error.message);
    	}

    	let string = JSON.stringify(results);
    	//let obj = JSON.parse(string);
    	res.send({ express: string });
    	console.log(typeof results);
  	});
  	connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
