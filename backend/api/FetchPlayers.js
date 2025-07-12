import dotenv from "dotenv";
dotenv.config();
import fs from 'fs'
const fs = require('node:fs')

const url = 'https://api-nba-v1.p.rapidapi.com/players?team=1&season=2021';
const options = {
	method: 'GET',
	headers: {
		"rapidapi-key": process.env.RAPIDAPI_KEY,
      "rapidapi-host": process.env.RAPIDAPI_HOST,
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	fs.writeFile('file.txt', result, err => {
		if (err) {
			console.error(err)
		} else  {
			console.log("Fetch Players was a success")
		}
	})
} catch (error) {
	console.error(error);
}

