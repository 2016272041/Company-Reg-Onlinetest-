Node.js, Express & MySQL: Simple Add, Edit, Delete, View (CRUD)
========

A simple and basic CRUD application (Create, Read, Update, Delete) using Node.js, Express, MySQL & EJS Templating Engine.

**Blog:** [Node.js, Express & MySQL: Simple Add, Edit, Delete, View

**Creating database and table**

```
create database test;

use test;

CREATE TABLE company (
    companyid int(11) NOT NULL auto_increment,
    companyname varchar(100) NOT NULL,
    testcreator varchar(100) NOT NULL,
    PRIMARY KEY (companyid)
);

CREATE TABLE tests (
    creator_id int (12) NOT NULL auto_increment,
    test_name varchar(50) NOT NULL,
    test_type varchar(50) NOT NULL,
    test_desc varchar(50) NOT NULL,
    test_date date,
    test_time time,
    PRIMARY KEY (creator_id)
);
```
# Online-Assessment-CRUD-
# Company-Reg-Onlinetest-
