const sqlite3 = require('sqlite3')

class AppDAO {
    constructor(dbFilepath) {
		this.db = new sqlite3.Database(dbFilepath, (err) => {
			if (err) {
				console.log("Could not connect to database", err);
			} else {
				console.log("Connected to database");
			}
		});
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    all(sql, params = []) {
        console.log(sql);
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = AppDAO;
