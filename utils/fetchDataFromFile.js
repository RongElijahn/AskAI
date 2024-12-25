const fs = require('fs');
const csv = require('csv-parser');
let filePath_comp = '/Users/sunrunze/Documents/ITEC4020/assignment/part2/public/data/computer_security_test.csv';
let filePath_hist = '/Users/sunrunze/Documents/ITEC4020/assignment/part2/public/data/prehistory_test.csv';
let filePath_soci = '/Users/sunrunze/Documents/ITEC4020/assignment/part2/public/data/sociology_test.csv';


const mongoose = require('mongoose');
const conn = require('./connection');

let quesSchema = new mongoose.Schema({
	question:String,
	anti_answer : String,
    chat_answer : {answer:String, respTime:Number}
})

let historyModel = conn.model('hisQuestion', quesSchema);
let socialModel = conn.model('socQuestion', quesSchema);
let computerModel = conn.model('comQuestion', quesSchema);


function readFile(fs,path, model){
	let count = 0;
    let ques = [];
	fs.createReadStream(path)
	.pipe(csv())
	.on('data',async(row)=>{
		count ++;
		const Value = Object.values(row)[0];
		const A = Object.values(row)[1];
		const B = Object.values(row)[2];
		const C = Object.values(row)[3];
		const D = Object.values(row)[4];
		ques[0] = `${Value} \n A:${A}\n B:${B}\n C:${C}\n D:${D}`;
		ques[1] = Object.values(row)[5];

    	try{
    		await model.create({
    			question:ques[0],
    			anti_answer:ques[1],
    			chat_answer:null
    		})

    	}catch(err){
    		console.error('Error inserting data:', err);
  	  	}
    
	})
	.on('end',()=>{
    	console.log('CSV file successfully processed.');
    	console.log(count);
	});

}

function showData(model){
	model.find({}).then(doc=>{
    console.log(doc);
	console.log(doc.length);
	});
}
//delete the result in database
function deleteData(model){
	model.deleteMany({}).then(doc=>{
    console.log(doc);
	console.log(doc.length);
	});
}


//uncomment below to populate database
// readFile(fs,filePath_soci, socialModel);
// readFile(fs,filePath_comp, computerModel);
// readFile(fs,filePath_hist, historyModel);

// showData(historyModel);
// showData(computerModel);
// showData(socialModel);

module.exports = { historyModel, socialModel, computerModel };


