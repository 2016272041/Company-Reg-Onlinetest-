var express = require('express')
var app = express()

// SHOW LIST OF COMPANY //
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM company ORDER BY companyid DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('company/list', {
					title: 'Company List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('company/list', {
					title: 'Company List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD COMPANY FORM
app.get('/add', function(req, res, next){	
	// render to views/company/add.ejs
	res.render('company/add', {
		title: 'Add New Company',
		companyid: '',
		companyname: '',
		testcreator: ''		
	})
})

// ADD NEW COMPANY POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('companyid', 'A Valid Company ID is required').notEmpty()           //Validate Company ID
	req.assert('companyname', 'Company Name is required').notEmpty()             //Validate Company Name
    req.assert('testcreator', 'Test Creator is required').notEmpty()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.companyname = '   a company    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('companyname').trim(); // returns 'a company'
		********************************************/
		var company = {
			companyid: req.sanitize('companyid').escape().trim(),
			companyname: req.sanitize('companyname').escape().trim(),
			testcreator: req.sanitize('testcreator').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO company SET ?', company, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/company/add.ejs
					res.render('company/add', {
						title: 'Add New Company',
						companyid: company.companyid,
						companyname: company.companyname,
						testcreator: company.testcreator					
					})
				} else {				
					req.flash('success', 'Company Data added successfully!')
					
					// render to views/company/add.ejs
					res.render('company/add', {
						title: 'Add New Company',
						companyid: '',
						companyname: '',
						testcreator: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to company
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.companyname 
		 * because req.param('companyname') is deprecated
		 */ 
        res.render('company/add', { 
            title: 'Add New Company',
            companyid: req.body.companyid,
            companyname: req.body.companyname,
            testcreator: req.body.testcreator
        })
    }
})

// SHOW EDIT COMPANY FORM
app.get('/edit/(:companyid)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM company WHERE companyid = ?', [req.params.companyid], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Company not found with id = ' + req.params.companyid)
				res.redirect('/companyid')
			}
			else { // if user found
				// render to views/company/edit.ejs template file
				res.render('company/edit', {
					title: 'Edit Company', 
					//data: rows[0],
					companyid: rows[0].companyid,
					companyname: rows[0].companyname,
					testcreator: rows[0].testcreator					
				})
			}			
		})
	})
})

// EDIT COMPANY POST ACTION
app.put('/edit/(:companyid)', function(req, res, next) {
	req.assert('companyid', 'Company ID is required').isInt()           //Validate company id
	req.assert('companyname', 'Company Name is required').notEmpty()             //Validate company name
    req.assert('testcreator', 'Test Creator is required').notEmpty()  //Validate testcreator

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.companyname = '   a company   ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('companyname').trim(); // returns 'a company'
		********************************************/
		var company = {
			companyid: req.sanitize('companyid').escape().trim(),
			companyname: req.sanitize('companyname').escape().trim(),
			testcreator: req.sanitize('testcreator').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE company SET ? WHERE companyid = ' + req.params.companyid, company, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/company/add.ejs
					res.render('company/edit', {
						title: 'Edit Company',
						companyid: req.params.companyid,
						companyid: req.body.companyid,
						companyname: req.body.companyname,
						testcreator: req.body.testcreator
					})
				} else {
					req.flash('success', 'Company Data updated successfully!')
					
					// render to views/company/add.ejs
					res.render('company/edit', {
						title: 'Edit Company',
						companyid: req.params.companyid,
						companyid: req.body.companyid,
						companyname: req.body.companyname,
						testcreator: req.body.testcreator
					})
				}
			})
		})
	}
	else {   //Display errors to company
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('company/edit', { 
            title: 'Edit Company',            
			companyid: req.params.companyid, 
			companyid: req.body.companyid,
			companyname: req.body.companyname,
			testcreator: req.body.testcreator
        })
    }
})

// DELETE COMPANY
app.delete('/delete/(:companyid)', function(req, res, next) {
	var company = { companyid: req.params.companyid }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM company WHERE id = ' + req.params.companyid, company, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to company list page
				res.redirect('/company')
			} else {
				req.flash('success', 'Company deleted successfully! id = ' + req.params.companyid)
				// redirect to company list page
				res.redirect('/company')
			}
		})
	})
})

module.exports = app
