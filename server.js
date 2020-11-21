if(process.env.NODE_ENV != 'production'){
	require('dotenv').config();
	}

console.log(process.env.SECRET_KEY);  /// dotenv is working
//////////////////////////////////////
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const fs = require('fs');// to enable us to read files
const mysql=require('mysql');
const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'stairadmin',
      password: 'ericpass',
      database: 'stairadmin',
      timezone: 'utc'
    });

app.set('view engine', 'ejs');

app.use(express.static('public'));
// body parser middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.post('/acct', urlencodedParser, function(req,res){
	
	res.setHeader('Content-Type', 'text/html')
	console.log('in post'+JSON.stringify(req.body))
	custID=req.body.custID;
	//////mysql fetch data /////////////////////////////////////
	var qry='select c.id, c.name, DATE_FORMAT(c.bal_date,"%d-%b-%Y") AS b_date'+
		', c.bal, c.email, t.invoice_no, p.prop, p.stair, p.postcode'+
		', DATE_FORMAT(t.tdate,"%d-%b-%Y") AS t_date, t.amt, t.trans '+
	 	 ' from customers'+
      ' as c inner join properties as p on c.property_id=p.id'+
      ' inner join payments as t on t.custID = c.id'+
      ' WHERE c.id='+custID+'&& t.tdate>c.bal_date'
      ';';
      connection.query(qry, function(err,rows){
          if(err) throw err;
           rows.forEach( (row) => { 
                 //console.log(`${row.id} is in ${row.tdate} and ${row.trans}`); 
                });
           //res.send(rows)
    		res.render('acct.ejs',{rows:rows})       
      });

})

app.listen(3000);