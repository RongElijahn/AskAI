const { randomPickQuestions, askAIAndUpdateDB } = require('./fetchDataFromDB');
const { historyModel, socialModel, computerModel } = require("./fetchDataFromFile");

async function calculateMetrics() {
    try{
        num = 150;
        const metrics = {};

        const updatedFiles1 = await randomPickQuestions(num, historyModel);
        const domain1 = await askAIAndUpdateDB(updatedFiles1,historyModel);
        let accuracy = 0.0;
        for(let question of domain1){
            let tmp = question.chat_answer.toString();
            let match = tmp.match(/'([^']+)'/);
            let firstElement = match ? match[1] : null;
 
            if(question.anti_answer == firstElement)
                accuracy++;
         }
        const responseTime =  domain1.reduce((sum,item)=>sum + parseInt((item.chat_answer.toString().split(','))[1]), 0);
        const averageTime = responseTime/domain1.length;
        
        metrics[0] = {
            accuracyRate: (accuracy / num) * 100,
            averageResponseTime: averageTime
        };

        const updatedFiles2 = await randomPickQuestions(num, socialModel);
        const domain2 = await askAIAndUpdateDB(updatedFiles2,socialModel);
        accuracy = 0.0;
        for(let question of domain2){
            let tmp = question.chat_answer.toString();
            let match = tmp.match(/'([^']+)'/);
            let firstElement = match ? match[1] : null;
 
            if(question.anti_answer == firstElement)
                accuracy++;
         }
        const responseTime2 =  domain2.reduce((sum,item)=>sum + parseInt((item.chat_answer.toString().split(','))[1]), 0);
        const averageTime2 = responseTime2/domain2.length;
        
        metrics[1] = {
            accuracyRate: (accuracy / num) * 100,
            averageResponseTime: averageTime2
        };

        const updatedFiles3 = await randomPickQuestions(num, computerModel);
        const domain3 = await askAIAndUpdateDB(updatedFiles3,computerModel);
        accuracy = 0.0;
        for(let question of domain3){
            let tmp = question.chat_answer.toString();
            let match = tmp.match(/'([^']+)'/);
            let firstElement = match ? match[1] : null;
 
            if(question.anti_answer == firstElement)
                accuracy++;
         }
        const responseTime3 =  domain3.reduce((sum,item)=>sum + parseInt((item.chat_answer.toString().split(','))[1]), 0);
        const averageTime3 = responseTime3/domain3.length;
        
        metrics[2] = {
            accuracyRate: (accuracy / num) * 100.0,
            averageResponseTime: averageTime3
        };
        return metrics;

    }catch(err){
        console.error('Error in processing 301:', err);
    }
}

module.exports = { calculateMetrics };


