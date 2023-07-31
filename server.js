import mysql from "mysql";
import config from "./config.js";
import fetch from "node-fetch";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import response from "express";
import { mapProps } from "recompose";

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

const convertSearchSetting = (setting) => {
  if (setting === 'byMovieName') {
    return "m.name";
  } else if (setting === 'byDirectorName') {
    return "CONCAT(d.first_name, ' ', d.last_name)";
  } else {
    return "CONCAT(a.first_name, ' ', a.last_name)";
  }
}

app.post('/api/searchMovie', (req, res) => {
  let connection = mysql.createConnection(config);
  let searchSettings = req.body.searchSettings;
  let userID = req.body.userID;
  console.log("Search Settings", searchSettings)
  let data = [];
  let sql = `SELECT m.name as movieTitle, GROUP_CONCAT(DISTINCT CONCAT(d.first_name, ' ', d.last_name)) as directorName, GROUP_CONCAT(DISTINCT r.reviewContent) as reviewContent, CAST(AVG(r.reviewScore) AS DECIMAL(10,2)) as averageScore
  FROM movies m
  LEFT JOIN review r ON r.movieID = m.id
  JOIN movies_directors md ON md.movie_id = m.id
  JOIN directors d ON md.director_id = d.id
  JOIN roles ro ON ro.movie_id = m.id
  JOIN actors a ON ro.actor_id = a.id 
  WHERE 1 = 1`;
  let length = searchSettings.length;

  const nonFalsyKeysList = searchSettings.map((searchSetting) => {
    return Object.keys(searchSetting).filter((key) => searchSetting[key]);
  });

  if (length === 1) {
    console.log("length of settings is 1")
    var searchTerm = searchSettings[0].searchTerm;
    if (searchTerm.trim().length <= 0) {
      console.log("no search term, pulling all movies from database");
      data.push(userID);
    } else {
      var searchSetting = nonFalsyKeysList[0][0];
      console.log("searching with one term and setting");
      var setting = convertSearchSetting(searchSetting);
      if (searchTerm.trim().length === 1) {
        sql = sql + ` AND ${setting} LIKE ?`;
        data.push(searchTerm.trim() + "%");
      } else {
        sql = sql + ` AND ${setting} LIKE ?`;
        data.push("%" + searchTerm.trim() + "%");
      }
      console.log("settings are length 1", sql);
    }
  } else if (length === 2) {
    console.log("length of settings is 2")
    var searchTerms = [searchSettings[0].searchTerm, searchSettings[1].searchTerm]
    var settings = [nonFalsyKeysList[0][0], nonFalsyKeysList[1][0]]
    var setting1 = convertSearchSetting(settings[0])
    var setting2 = convertSearchSetting(settings[1])
    var searchTerm1 = searchTerms[0]
    var searchTerm2 = searchTerms[1]
    if (setting1 === setting2) {
      console.log("the 2 settings are the same")
      if (searchTerm1.trim().length === 0) {
        console.log("the first search term is empty")
        if (searchTerm2.trim().length === 1) {
          sql = sql + ` AND ${setting2} LIKE ?`;
          data.push(searchTerm2.trim() + "%");
        } else {
          sql = sql + ` AND ${setting2} LIKE ?`;
          data.push("%" + searchTerm2.trim() + "%");
        }
      } else if (searchTerm2.trim().length === 0) {
        console.log("the second search term is empty")
        if (searchTerm1.trim().length === 1) {
          sql = sql + ` AND ${setting1} LIKE ?`;
          data.push(searchTerm1.trim() + "%");
        } else {
          sql = sql + ` AND ${setting1} LIKE ?`;
          data.push("%" + searchTerm1.trim() + "%");
        }
      } else if (searchTerm1.trim().length > 0 && searchTerm2.trim().length > 0) {
        console.log("neither are empty")
        for (var i = 0; i < settings.length; i++) {
          var curTerm = searchTerms[i]
          var curSetting = convertSearchSetting(settings[i])
          if (searchTerm1.trim().length === 1) {
            sql = sql + ` AND ${curSetting} LIKE ?`;
            data.push(curTerm.trim() + "%");
          } else {
            sql = sql + ` OR ${curSetting} LIKE ?`;
            data.push("%" + curTerm.trim() + "%");
          }
        }
      } else if (searchTerm1.trim().length === 0 && searchTerm2.trim().length === 0) {
        console.log("both terms are empty, searching for all movies: ", setting1)
      }
    } else {
      console.log("neither settings are equal")
      if (searchTerm1.trim().length === 0) {
        console.log("the first search term is empty")
        if (searchTerm2.trim().length === 1) {
          sql = sql + ` AND ${setting2} LIKE ?`;
          data.push(searchTerm2.trim() + "%");
        } else {
          sql = sql + ` AND ${setting2} LIKE ?`;
          data.push("%" + searchTerm2.trim() + "%");
        }
      } else if (searchTerm2.trim().length === 0) {
        console.log("the second search term is empty")
        if (searchTerm1.trim().length === 1) {
          sql = sql + ` AND ${setting1} LIKE ?`;
          data.push(searchTerm1.trim() + "%");
        } else {
          sql = sql + ` AND ${setting1} LIKE ?`;
          data.push("%" + searchTerm1.trim() + "%");
        }
      } else if (searchTerm1.trim().length > 0 && searchTerm2.trim().length > 0) {
        console.log("neither are empty")
        for (var i = 0; i < settings.length; i++) {
          var curTerm = searchTerms[i]
          var curSetting = convertSearchSetting(settings[i])
          if (searchTerm1.trim().length === 1) {
            sql = sql + ` AND ${curSetting} LIKE ?`;
            data.push(curTerm.trim() + "%");
          } else {
            sql = sql + ` AND ${curSetting} LIKE ?`;
            data.push("%" + curTerm.trim() + "%");
          }
        }
      } else if (searchTerm1.trim().length === 0 && searchTerm2.trim().length === 0) {
        console.log("both terms are empty, searching for all movies: ", setting1)
      }
    }
  } else {
    console.log("there are 3 settings");
    var searchTerms = [searchSettings[0].searchTerm, searchSettings[1].searchTerm, searchSettings[2].searchTerm]
    var settings = [nonFalsyKeysList[0][0], nonFalsyKeysList[1][0], nonFalsyKeysList[2][0]]
    var setting1 = convertSearchSetting(settings[0])
    var setting2 = convertSearchSetting(settings[1])
    var setting3 = convertSearchSetting(settings[2])
    var searchTerm1 = searchTerms[0]
    var searchTerm2 = searchTerms[1]
    var searchTerm3 = searchTerms[2]
    if (searchTerm1.trim().length === 0 && searchTerm2.trim() === 0) {
      console.log("only search term 3 is non empty");
      if (searchTerm3.trim().length === 1) {
        sql = sql + ` AND ${setting3} LIKE ?`;
        data.push(searchTerm3.trim() + "%");
      } else {
        sql = sql + ` AND ${setting3} LIKE ?`;
        data.push("%" + searchTerm3.trim() + "%");
      }
    } else if (searchTerm2.trim().length === 0 && searchTerm3.trim === 0) {
      console.log("only search term 2 is non empty");
      if (searchTerm2.trim().length === 1) {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push(searchTerm2.trim() + "%");
      } else {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push("%" + searchTerm2.trim() + "%");
      }
    } else if (searchTerm2.trim().length === 0 && searchTerm3.trim === 0) {
      console.log("only search term 1 is non empty");
      if (searchTerm1.trim().length === 1) {
        sql = sql + ` AND ${setting11} LIKE ?`;
        data.push(searchTerm1.trim() + "%");
      } else {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push("%" + searchTerm1.trim() + "%");
      }
    } else if (searchTerm1.trim().length === 0) {
      console.log("only search term 1 is empty");
      if (searchTerm2.trim().length === 1) {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push(searchTerm2.trim() + "%");
      } else {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push("%" + searchTerm2.trim() + "%");
      }
      if (searchTerm3.trim().length === 1) {
        sql = sql + ` OR ${setting3} LIKE ?`;
        data.push(searchTerm3.trim() + "%");
      } else {
        sql = sql + ` OR ${setting3} LIKE ?`;
        data.push("%" + searchTerm3.trim() + "%");
      }
    } else if (searchTerm2.trim().length === 0) {
      console.log("only search term 2 is empty");
      if (searchTerm1.trim().length === 1) {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push(searchTerm1.trim() + "%");
      } else {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push("%" + searchTerm1.trim() + "%");
      }
      if (searchTerm3.trim().length === 1) {
        sql = sql + ` AND ${setting3} LIKE ?`;
        data.push(searchTerm3.trim() + "%");
      } else {
        sql = sql + ` AND ${setting3} LIKE ?`;
        data.push("%" + searchTerm3.trim() + "%");
      }
    } else if (searchTerm3.trim().length === 0) {
      console.log("only search term 3 is empty");
      if (searchTerm1.trim().length === 1) {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push(searchTerm1.trim() + "%");
      } else {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push("%" + searchTerm1.trim() + "%");
      }
      if (searchTerm2.trim().length === 1) {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push(searchTerm2.trim() + "%");
      } else {
        sql = sql + ` AND ${setting2} LIKE ?`;
        data.push("%" + searchTerm2.trim() + "%");
      }
    } else if (searchTerm1.trim().length > 0 && searchTerm2.trim().length > 0 && searchTerm3.trim().length > 0) {
      console.log("none are empty");
      if (searchTerm1.trim().length === 1) {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push(searchTerm1.trim() + "%");
      } else {
        sql = sql + ` AND ${setting1} LIKE ?`;
        data.push("%" + searchTerm1.trim() + "%");
      }
      if (searchTerm2.trim().length === 1) {
        sql = sql + ` OR ${setting2} LIKE ?`;
        data.push(searchTerm2.trim() + "%");
      } else {
        sql = sql + ` OR ${setting2} LIKE ?`;
        data.push("%" + searchTerm2.trim() + "%");
      }
      if (searchTerm3.trim().length === 1) {
        sql = sql + ` OR ${setting3} LIKE ?`;
        data.push(searchTerm3.trim() + "%");
      } else {
        sql = sql + ` OR ${setting3} LIKE ?`;
        data.push("%" + searchTerm3.trim() + "%");
      }
    }
  }


  sql = sql + ` GROUP BY m.name, d.first_name, d.last_name`

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

app.post("/api/findTrailer", (req, res) => {
  let connection = mysql.createConnection(config);
  let selectedMovie = req.body.selectedMovie;

  let sql = `SELECT mp.movieTrailer 
  FROM myPage mp
  WHERE mp.movieTitle LIKE ?;`;
  console.log(sql);
  let data = ["%" + selectedMovie + "%"];
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

app.post("/api/findReviews", (req, res) => {
  let connection = mysql.createConnection(config);
  let selectedMovie = req.body.selectedMovie;

  let sql1 = `SELECT r.reviewContent as reviewContents, r.reviewScore
    FROM myPage mp
    JOIN movies m ON m.name = mp.movieTitle
    JOIN review r ON m.id = r.movieID
    WHERE mp.movieTitle LIKE ?;`;

  let data1 = ["%" + selectedMovie + "%"];

  let sql2 = `SELECT CAST(AVG(r.reviewScore) AS DECIMAL(10,2)) as averageScore
    FROM myPage mp
    JOIN movies m ON m.name = mp.movieTitle
    JOIN review r ON m.id = r.movieID
    WHERE mp.movieTitle LIKE ?
    GROUP BY r.movieID;`;
  let data2 = ["%" + selectedMovie + "%"];

  connection.query(sql1, data1, (error1, results1, fields1) => {
    if (error1) {
      connection.end();
      return console.error(error1.message);
    }

    connection.query(sql2, data2, (error2, results2, fields2) => {
      connection.end();

      if (error2) {
        return console.error(error2.message);
      }

      let string1 = JSON.stringify(results1);
      let string2 = JSON.stringify(results2);

      res.send({ express1: string1, express2: string2 });
    });
  });
});



app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
