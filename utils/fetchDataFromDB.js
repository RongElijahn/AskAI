const mongoose = require('mongoose');
const conn = require('./connection');
const { historyModel, socialModel, computerModel } = require("./fetchDataFromFile");

const {OpenAI} = require('openai');
const openai = new OpenAI({
	apiKey:'??'
});

//ask question through AI 
async function askAI(question){
	let t1 = new Date().getTime();
	try {
    	const response = await openai.chat.completions.create({
     	model: 'gpt-3.5-turbo', // 选择你使用的模型
      	messages: [
       		{ role: 'system', content: 'Just choose one of the option from A,B,C,D, without extra explanition.' },  // 角色设定
        	{ role: 'user', content: question },  // 用户提问
      		],
    	});
    	let t2 = new Date().getTime();
        let interval = t2-t1;
        let ans = response.choices[0].message.content;
        var ans_int = [ans[0],interval];
    	return ans_int;
  	} catch (error) {
    	console.error('Error:', error);
    	throw error;
  	}

}

async function randomPickQuestions(num, models) {
    try {
        let randomFiles = [];

        if (Array.isArray(models)) {
            // Combine documents from all specified models
            for (const model of models) {
                const documents = await model.aggregate([{ $sample: { size: Math.ceil(num / models.length) } }]);
                randomFiles = randomFiles.concat(documents);
            }
        } else {
            // Fetch from a single model
            randomFiles = await models.aggregate([{ $sample: { size: num } }]);
        }

        //return type: array of objects
        randomFiles = randomFiles.map(doc => ({
            _id: doc._id || null,
            question: doc.question || "No question available",
        }));

        return randomFiles; // Return the selected questions

    } catch (error) {
        console.error("Error selecting random files:", error);
        throw error; // Re-throw error for upstream handling
    }
}

async function askAIAndUpdateDB(randomFiles, model) {
    try {
        // Process and update each document
        const updates = randomFiles.map(async (file) => {
            try {
                const ans_int = await askAI(file.question); // Get AI's response
                await model.updateOne(
                    { _id: file._id },
                    { $set: { chat_answer: ans_int } } // ans_int = [ans[0],interval];   
                );
                return model.findById(file._id); // Return the updated document
            } catch (error) {
                console.error("Error updating file:", file._id, error);
                throw error;
            }
        });

        // Wait for all updates to finish and return the updated files
        const updatedFiles = await Promise.all(updates);
        return updatedFiles;
    } catch (error) {
        console.error("Error updating database:", error);
        throw error; // Re-throw error for upstream handling
    }
}

module.exports ={
	randomPickQuestions,
    askAIAndUpdateDB
};

