'use strict'

const sql = require('sqlite3')
const util = require('util')

// This can be replaced with a filename for a persistent database.
const db = new sql.Database(':memory:')

// Check if database exists
const cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ActivityTable' "

db.get(cmd, function (err, val) {
  if (err) {
    console.log('Problem accessing the SQL server:', err)
  }
  if (val === undefined) {
    console.log('No profile table - creating one')
    createActivityTable()
  } else {
    console.log('Activity table found')
  }
})

function createActivityTable () {
  const cmd = 'CREATE TABLE ActivityTable (rowIdNum INTEGER PRIMARY KEY, activity TEXT, date INTEGER, amount FLOAT)'
  db.run(cmd, (err, val) => {
    if (err) {
      console.log('Acitivity database creation error', err.message)
    } else {
      console.log('Created Activity database')
    }
  })
}

db.run = util.promisify(db.run)
db.get = util.promisify(db.get)
db.all = util.promisify(db.all)

const insertDB = 'insert into ActivityTable (activity, date, amount) values (?,?,?)'
const getDB = 'select * from ActivityTable where activity = ?'
const deleteOneDB = 'delete from ActivityTable where rowIdNum = ?'

async function postActivity (activity, date, amount) {
  try {
    await db.run(insertDB, [activity, date, amount])
  } catch (error) {
    console.log('Error inserting to DB:', error)
  }
}

async function getActivity (activity) {
  try {
    const results = await db.get(getDB, activity)
    return (results.rowIdNum != null) ? results : null
  } catch (error) {
    console.log('Error getting one from database:', error)
    return null
  }
}

async function getAllActivities (activity) {
  try {
    const results = await db.all(getDB, activity)
    return (results[0] != null) ? results : null
  } catch (error) {
    console.log('Error getting all', activity, 'activities from the database:', error)
    return null
  }
}

async function deleteActivity (rowIdNum) {
  try {
    await db.run(deleteOneDB, [rowIdNum])
  } catch (error) {
    console.log('Error deleting activity with rowIdNum =', rowIdNum, ':', error)
  }
}

db.postActivity = postActivity
db.getActivity = getActivity
db.getAllActivities = getAllActivities
db.deleteActivity = deleteActivity
module.exports = db
