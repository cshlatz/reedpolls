async function convert() {
    const csv = require('csvtojson');
    const csvFile = 'data/president_polls.csv';
    
    return await csv().fromFile(csvFile).then((jsonObj)=>{
        console.log("line");
    });
}

const jsonArray = convert();
console.log(jsonArray);
