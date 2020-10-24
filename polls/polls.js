var express = require('express');
var sq3 = require('sqlite3').verbose();
var AppDAO = require('../dao');
var moment = require('moment');

const dao = new AppDAO('db/polls.db');

const polls = {
    async president (req, res) {
        let polls = [];
        let state = req.params.state.charAt(0).toUpperCase() + req.params.state.slice(1);
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

        res.render('poll-display', {
            "polls": polls,
            data: JSON.stringify(polls),
            state: state
        });
    }
}

module.exports = polls;
