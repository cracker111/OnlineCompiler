var express = require('express');
var router = express.Router();
var soap = require('soap');
var easysoap = require('easysoap');
var Type = require('type-of-is');
var par = require('child_process');
var path = require('path');
var fs = require('fs');
var exec = par.exec;
var spawn = par.spawn;
var count = 0;
var pre;
var suff;
var filename;
var output;
var outexe;
var inputfile;
var pchild;

//var url = 'http://ideone.com/api/1/service.wsdl';
/*var user = 'nguria';
var pass = 'target9592';
var input = '';
var run = true;
var pvt = false;
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/compileonline', function(req, res) {
res.render('compileonline', {title: 'Practice programming online.'});
});

/*router.get('/test', function(req, res) {
res.render('test', {title: 'Practice programming online.'});
});

router.get('/test2', function(req, res) {
res.render('test2', {title: 'Practice programming online.'});
});
*/

router.post('/submit_code', function(req, res) {
	count++;
	console.log("Submission no. ")
	console.log(count);
	//var c = req.body;
	//console.log(c);
	var code = req.body.code;
	console.log(code);
	var usrinput = req.body.usrinput;
	var cf = req.body.chkbox;
	var lang = req.body.selectbox;
	console.log(lang)
	var type="";
	var command;
	var defout;
	var outexefile;
	var result="";
	var status;
	
	outexe="akdvklv.exe";
	pre = "Submission_";
	suff = count.toString();
	console.log(type);
	output = pre+suff;
	inputfile = output+"_input.txt";
	
    if(lang == "text/x-csrc")
	{
		type = ".c";
		outexe = output+'.exe';
	}
	else if(lang == "text/x-c++src")
	{
		type = ".cpp";
		outexe = output+'.exe';
	}
	else if(lang == "text/x-java")
	{
		console.log("Java");
		type = ".java";
		defin = "C:\\Users\\nguria\\Desktop\\programs\\"+output;
		defout = "C:\\Users\\nguria\\Desktop\\classfiles\\"+output;
		if (!fs.existsSync(defin)){
		fs.mkdirSync(defin);
		}
		if (!fs.existsSync(defout)){
		fs.mkdirSync(defout);
		}
	}
	
	filename = "C:\\Users\\nguria\\Desktop\\programs\\"+pre+suff+type;
	
	if(lang == "text/x-java")
		filename = defin + "\\" + "MainClass.java"
	
	fs.writeFile(filename, code, function(err){
		
		if(err)
		console.log(err);
		if(lang == "text/x-csrc")
			command = "gcc -o " + output + " " + filename;
		else if(lang == "text/x-c++src")
			command = "g++ -o "+ output + " " + filename;
		else if(lang == "text/x-java")
			command = "javac -d " + defout + " " + filename;
		console.log(command);
	
		
	var child = exec(command, function( error, stdout, stderr) 
	{
		console.log(stdout);
		console.log(stderr);
	   
	   if(lang == "text/x-java")
	   {
	    var files = fs.readdirSync(defout);
	   
	   for(var i in files)
	   {
		   outexe = files[i];
	   }
	   outexefile = outexe.slice(0,-6);
	   outexe = defout + "\\" +outexe;
	   }
	   
	   
	   console.log(outexe);
	   fs.stat(outexe, function(err, stat) {
		   
		if(err == null) {
			
		fs.writeFileSync(inputfile, usrinput);
        console.log('Compiled');
		
		if(lang == "text/x-java")
			pchild = spawn('java', [outexefile], {detached: true, cwd: defout});
		else
			pchild = spawn(outexe, {detached: true} );
		
		infile = fs.createReadStream(inputfile,{encoding:'utf8'});
		infile.pipe(pchild.stdin);
		
		var to = setTimeout(function(){
		console.log('kill');
		process.kill(pchild.pid);
		}, 30000);
		
		pchild.stdout.on('data', function(data) {
		console.log(data);	
		var str = data.toString();
		var lines = str.split(/(\r?\n)/g);
		console.log(lines.join(""));
		result+=str;
		});
		
		pchild.stderr.on('data', function(data) {
		console.log(data);
		result=data;
		});
		
		pchild.on('exit', function(err)
		{
			console.log(err);
			if(err == 0)
			status = "Status: Execution successful\n";
			else
			if(err == 1)
			status = "Status: Time limit exceeded\n";
			else
			status = "Status: Runtime error\n";
			
		});
		
		pchild.on('close', function(code) {
		console.log("Completed");
		console.log(code);
		clearTimeout(to);
		result = status + result;
		res.send(result);
		});
		
		} 
		else if(err.code == 'ENOENT') {
        //fs.writeFile('log.txt', 'Some log\n');
		console.log('Compilation failed');
		console.log(stderr);
		res.send(stderr);
		} 
		else {
		console.log('Some error occured');
		}
		
		
		});

       // normal 

	});
	
	});
	
	
	
  //res.render('compileonline', {datap: code});
});

module.exports = router;
