var express = require('express');
var sq3 = require('sqlite3').verbose();
var AppDAO = require('../../../../data/dao');
var moment = require('moment');

const dao = new AppDAO('data/polls/polls.db');

const VALID_STATES = [
    'Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

const PollsController = {
    async president (req, res) {
        let polls = [];
        let state = req.params.state.charAt(0).toUpperCase() + req.params.state.slice(1).toLowerCase();

        // Make sure we're actually in a state
        if (!VALID_STATES.includes(state)) {
            res.render('404');
            return;
        }

        let sql = 'SELECT DISTINCT r.answer, r.pct, r.question_id, r.end_date, r.pollster, r.notes, r.fte_grade FROM r_poll_answer AS p JOIN r_poll_answer AS r ON r.question_id = p.question_id WHERE p.state = "' + state + '" ORDER BY r.end_date ASC';

        const result = await dao.all(sql).then((data) => {
            data.forEach((res) => {
                let question = polls.find(poll => poll.question_id === res.question_id);
                if (!question) {
                    question = {
                        question_id: res.question_id,
                        [res.answer]: res.pct,
                        pollster: res.pollster,
                        end_date: moment(new Date(res.end_date), "DD/MM/YYYY").format('YYYY-MM-DD'),
                        notes: res.notes,
                        grade: res.fte_grade
                    };
                    polls.push(question);
                } else {
                    question[res.answer] = res.pct;
                }
            });
        });

        res.render('polls', {
            "polls": polls,
            data: JSON.stringify(polls),
            state: state
        });
    }
}

module.exports = PollsController;
