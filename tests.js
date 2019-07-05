var express = require('express')
var app = express()

// SHOW LIST OF CREATORS //
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM tests ORDER BY creator_id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('tests/list', {
					title: 'Tests List', 
					data: ''
				})
			} else {
				// render to views/tests/list.ejs template file
				res.render('tests/list', {
					title: 'Tests List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD TESTS FORM
app.get('/add', function(req, res, next){	
	// render to views/tests/add.ejs
	res.render('tests/add', {
		title: 'Add New Tests',
		creator_id: '',
		test_name: '',
        test_type: '',
        test_desc: '',
        test_date: '',
        test_time: '',		
	})
})

// ADD NEW TESTS POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('creator_id', 'A Valid Creator ID is required').isInt()           //Validate Creator ID
	req.assert('test_name', 'Test Name is required').notEmpty()             //Validate Test Name
    req.assert('test_type', 'Test Type is required').notEmpty()  //Validate Test Type
    req.assert('test_desc', 'Test Description is required').notEmpty()  //Validate Test Description
    req.assert('test_date', 'Test Date is required').isDate() //Validate Test Date
    req.assert('test_time', 'Test Time is required').notEmpty() //Validate Test Time

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.tests = '   a tests    ';
		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('companyname').trim(); // returns 'a company'
		********************************************/
		var tests = {
			creator_id: req.sanitize('creator_id').escape().trim(),
			test_name: req.sanitize('test_name').escape().trim(),
            test_type: req.sanitize('test_type').escape().trim(),
            test_desc: req.sanitize('test_desc').escape().trim(),
            test_date: req.sanitize('test_date').escape().trim(),
            test_time: req.sanitize('test_time').escape().trim(),
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO tests SET ?', tests, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/tests/add.ejs
					res.render('tests/add', {
						title: 'Add New Tests',
						creator_id: tests.creator_id,
						test_name: tests.test_name,
						test_type: tests.test_type,
						test_desc: tests.test_desc,
						test_date: tests.test_date,
						test_time: tests.test_time					
					})
				} else {				
					req.flash('success', 'Tests Data added successfully!')
					
					// render to views/tests/add.ejs
					res.render('tests/add', {
						title: 'Add New Tests',
						creator_id: '',
						test_name: '',
						test_type: '',
						test_desc: '',
						test_date: '',
						test_time: '',					
					})
				}
			})
		})
	}
	else {   //Display errors to tests
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.testname 
		 * because req.param('testname') is deprecated
		 */ 
        res.render('tests/add', { 
            title: 'Add New Tests',
            creator_id: req.body.creator_id,
            test_name: req.body.test_name,
			test_type: req.body.test_type,
			test_desc: req.body.test_desc,
			test_date: req.body.test_date,
			test_time: req.body.test_time
        })
    }
})

// SHOW EDIT COMPANY FORM
app.get('/edit/(:creator_id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM tests WHERE creator_id = ?', [req.params.creator_id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Tests not found with creator_id = ' + req.params.creator_id)
				res.redirect('/companyid')
			}
			else { // if user found
				// render to views/tests/edit.ejs template file
				res.render('tests/edit', {
					title: 'Edit Company', 
					//data: rows[0],
					creator_id: rows[0].creator_id,
					test_name: rows[0].test_name,
					test_type: rows[0].test_type,
					test_desc: rows[0].test_desc,
					test_date: rows[0].test_date,
					test_time: rows[0].test_time					
				})
			}			
		})
	})
})

// EDIT TESTS POST ACTION
app.put('/edit/(:creator_id)', function(req, res, next) {
	req.assert('creator_id', 'Creator ID is required').isInt()           //Validate creator id
	req.assert('test_name', 'Test Name is required').notEmpty()             //Validate test name
	req.assert('test_type', 'Test Type is required').notEmpty()  //Validate test type
	req.assert('test_desc', 'Test Description is required').notEmpty() //Validate test description
	req.assert('test_date', 'test Date is required').isDate() // Validate test date
	req.assert('test_time', 'Test Time is required').notEmpty() // Validate test time

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.tests = '   a tests   ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('companyname').trim(); // returns 'a company'
		********************************************/
		var tests = {
			creator_id: req.sanitize('creator_id').escape().trim(),
			test_name: req.sanitize('test_name').escape().trim(),
			test_type: req.sanitize('test_type').escape().trim(),
			test_desc: req.sanitize('test_desc').escape().trim(),
			test_date: req.sanitize('test_date').escape().trim(),
			test_time: req.sanitize('test_time').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE tests SET ? WHERE creator_id = ' + req.params.creator_id, company, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/tests/add.ejs
					res.render('tests/edit', {
						title: 'Edit Tests',
						creator_id: req.params.creator_id,
						creator_id: req.body.creator_id,
						test_name: req.body.test_name,
						test_type: req.body.test_type,
						test_desc: req.body.test_desc,
						test_date: req.body.test_date,
						test_time: req.body.test_time
						})
				} else {
					req.flash('success', 'Tests Data updated successfully!')
					
					// render to views/Tests/add.ejs
					res.render('tests/edit', {
						title: 'Edit Tests',
						creator_id: req.params.creator_id,
						creator_id: req.body.creator_id,
						test_name: req.body.test_name,
						test_type: req.body.test_type,
						test_desc: req.body.test_desc,
						test_date: req.body.test_date,
						test_time: req.body.test_time					
					})
				}
			})
		})
	}
	else {   //Display errors to tests
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('tests/edit', { 
            title: 'Edit Tests',            
			creator_id: req.params.creator_id, 
			creator_id: req.body.creator_id,
			test_name: req.body.test_name,
			test_type: req.body.test_type,
			test_desc: req.body.test_desc,
			test_date: req.body.test_date,
			test_time: req.body.test_time
        })
    }
})

// DELETE TESTS
app.delete('/delete/(:creator_id)', function(req, res, next) {
	var tests = { creator_id: req.params.creator_id}
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM tests WHERE creator_id = ' + req.params.creator_id, tests, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to company list page
				res.redirect('/tests')
			} else {
				req.flash('success', 'Tests deleted successfully! creator_id = ' + req.params.creator_id)
				// redirect to company list page
				res.redirect('/tests')
			}
		})
	})
})

module.exports = app
