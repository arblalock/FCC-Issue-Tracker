/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

var expect = require('chai').expect
const mongoose = require('mongoose')
const issue = require('../models/issue')

module.exports = function (app, db) {
  app.route('/api/issues/:project')

    .get(function (req, res) {
      issue.find(req.query, (err, doc) => {
        if (err) return res.status(500).send('error')
        res.send(doc)
      })
    })

    .post(function (req, res) {
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'missing fields' })
      }
      let issObj = Object.assign({}, req.body, {created_on: new Date(), updated_on: new Date(), open: true})
      if (!issObj.assigned_to) issObj.assigned_to = ''
      if (!issObj.status_text) issObj.status_text = ''
      let newIssue = issue(issObj)
      newIssue.save((err, product) => {
        if (err) return console.error(err)
        return res.json(product)
      })
    })

    // next test sending a valid id
    .put(function (req, res) {
      let bfields = {}
      for (var k in req.body) {
        if (req.body[k] !== '' && k !== '_id') bfields[k] = req.body[k]
      }
      if (Object.values(bfields).length === 0) {
        return res.send('no updated field sent')
      }
      if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
        return res.send('could not update ' + req.body._id + '')
      }
      issue.findByIdAndUpdate(req.body._id, bfields, (err, doc) => {
        if (err) return console.error(err)
        if (!doc) return res.send('could not update ' + req.body._id + '')
        return res.send('successfully updated')
      })
    })

    .delete(function (req, res) {
      if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
        return res.send('_id error')
      }
      issue.findByIdAndRemove(req.body._id, (err, doc) => {
        if (err) return console.error(err)
        if (!doc) return res.send({failed: `could not delete ${req.body._id}`})
        return res.json({success: `deleted ${req.body._id}`})
      })
    })
}
