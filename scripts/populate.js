var sq3 = require('../../node_modules/sqlite3/sqlite3.js');
var polls = require('../../data/president_polls.json');
var moment = require('moment');

const R_POLL_ANSWER_FIELDS = 'question_id, poll_id, cycle, state, pollster_id, pollster, sponsor_ids, sponsors, display_name, pollster_rating_id, pollster_rating_name, fte_grade, sample_size, population, population_full, methodology, office_type, seat_number, seat_name, start_date, end_date, election_date, sponsor_candidate, internal, partisan, tracking, nationwide_batch, ranked_choice_reallocated, created_at, notes, url, stage, race_id, answer, candidate_id, candidate_name, candidate_party, pct';

let db = new sq3.Database('../../db/polls.db', (err) => {
    if (err) {
        console.log(err.message);
        return;
    }

    console.log("Connected to polls database");

    // Delete all rows
    db.run('DELETE FROM r_poll_answer');

    // Prepare query
    let sql = 'INSERT INTO r_poll_answer (' + R_POLL_ANSWER_FIELDS + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let statement = db.prepare(sql);
    let count = polls.length;
    let i = 1;

    polls.forEach(poll => {
        let placeholder = [poll.question_id, poll.poll_id, poll.cycle, poll.state, poll.pollster_id, poll.pollster, poll.sponsor_ids, poll.sponsors, poll.display_name, poll.pollster_rating_id, poll.pollster_rating_name, poll.fte_grade, poll.sample_size, poll.population, poll.population_full, poll.methodology, poll.office_type, poll.seat_number, poll.seat_name, poll.start_date, new Date(poll.end_date).toISOString(), poll.election_date, poll.sponsor_candidate, poll.internal, poll.partisan, poll.tracking, poll.nationwide_batch, poll.ranked_choice_reallocated, poll.created_at, poll.notes, poll.url, poll.stage, poll.race_id, poll.answer, poll.candidate_id, poll.candidate_name, poll.candidate_party, poll.pct];
        statement.run(placeholder, function(err) {
            if (err) {
                throw err;
            }
            process.stdout.write('poll ' + i + '/' + count + ' inserted\r');
            i++;
        });
    });

    statement.finalize();

    console.log("Closing database");
    db.close();
});

