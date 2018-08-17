/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')
chai.use(chaiHttp)
const issue = require('../models/issue')

suite('Functional Tests', function () {
  suite('POST /api/issues/{project} => object with issue data', function () {
    afterEach((done) => {
      issue.remove({}, (err) => {
        done()
      })
    })
    test('Every field filled in', function (done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          if (err) {
            console.error('error')
          }
          assert.equal(err, null)
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          done()
        })
    })

    test('Required fields filled in', function (done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'New Title',
          issue_text: 'text',
          created_by: 'adam'
        })
        .end(function (err, res) {
          if (err) {
            console.error('error')
          }
          assert.equal(err, null)
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'New Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'adam')
          done()
        })
    })

    test('Missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function (err, res) {
          if (err) {
            console.error('error')
          }
          assert.equal(res.body.error, 'missing fields')
          done()
        })
    })
  })

  suite('PUT /api/issues/{project} => text', function () {
    test('No body', function (done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({})
        .end(function (err, res) {
          if (err) console.error('error')
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no updated field sent')
          done()
        })
    })

    test('One field to update', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Title',
        issue_text: 'text',
        created_by: 'adam'
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .put('/api/issues/apitest')
          .send({_id: doc._id, issue_title: 'New Title'})
          .end(function (err, res) {
            if (err) console.error('error')
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
      })
    })

    test('Multiple fields to update', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Title',
        issue_text: 'text',
        created_by: 'adam'
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .put('/api/issues/apitest')
          .send({_id: doc._id, issue_title: 'New Title', created_by: 'jim'})
          .end(function (err, res) {
            if (err) console.error('error')
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
      })
    })
  })

  suite('GET /api/issues/{project} => Array of objects with issue data', function () {
    test('No filter', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Title',
        issue_text: 'text',
        created_by: 'adamsssss',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .get('/api/issues/apitest')
          .query({})
          .end(function (err, res) {
            if (err) return console.error(err)
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.property(res.body[0], 'issue_title')
            assert.property(res.body[0], 'issue_text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'updated_on')
            assert.property(res.body[0], 'created_by')
            assert.property(res.body[0], 'assigned_to')
            assert.property(res.body[0], 'open')
            assert.property(res.body[0], 'status_text')
            assert.property(res.body[0], '_id')
            done()
          })
      })
    })

    test('One filter', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Title',
        issue_text: 'text',
        created_by: 'adam',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .get('/api/issues/apitest')
          .query({created_by: 'adam'})
          .end(function (err, res) {
            if (err) return console.error(err)
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.equal(res.body[0].created_by, 'adam')
            done()
          })
      })
    })
    //
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Titles',
        issue_text: 'text',
        created_by: 'adam',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .get('/api/issues/apitest')
          .query({created_by: 'adam', issue_title: 'Newer Titles'})
          .end(function (err, res) {
            if (err) return console.error(err)
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.equal(res.body[0].issue_title, 'Newer Titles')
            done()
          })
      })
    })
  })

  suite('DELETE /api/issues/{project} => text', function () {
    test('No _id', function (done) {
      chai.request(server)
        .delete('/api/issues/apitest')
        .send({})
        .end(function (err, res) {
          if (err) console.error('error')
          assert.equal(res.status, 200)
          assert.equal(res.text, '_id error')
          done()
        })
    })

    test('Valid _id', function (done) {
      let issueNew = issue({
        issue_title: 'Newer Title',
        issue_text: 'text',
        created_by: 'adam'
      })
      issueNew.save((err, doc) => {
        if (err) console.error('error')
        chai.request(server)
          .delete('/api/issues/apitest')
          .send({_id: doc._id})
          .end(function (err, res) {
            if (err) console.error('error')
            assert.equal(res.status, 200)
            assert.property(res.body, 'success')
            done()
          })
      })
    })
  })
})
