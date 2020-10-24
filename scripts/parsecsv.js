const csvtojson = require('csvtojson');
const csv = '../../data/president_polls.csv';
const fs = require('fs');

csvtojson()
    .fromFile(csv)
    .then(polls => {
        fs.writeFile('../../data/president_polls.json', JSON.stringify(polls, null, 4), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON array saved");
        });
    }).catch(err => {
        console.log(err);
    });
