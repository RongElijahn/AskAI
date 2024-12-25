const express = require("express");
const router = express.Router();
const { randomPickQuestions, askAIAndUpdateDB } = require("./utils/fetchDataFromDB");
const { historyModel, socialModel, computerModel } = require("./utils/fetchDataFromFile");
const { calculateMetrics } = require("./utils/evaluation");

// Endpoint to fetch a random question
router.get(`/question`, async (req, res) => {
    try {
        const model = req.query.model;
        let models;

        if (model === "history") {
            models = historyModel;
        } else if (model === "social") {
            models = socialModel;
        } else if (model === "computer") {
            models = computerModel;
        } else if (model === "all") {
            models = [historyModel, socialModel, computerModel];
        } else {
            return res.status(400).json({ error: "Invalid model type specified." });
        }

        const randomQuestions = await randomPickQuestions(1, models);
        const question = randomQuestions[0];

        if (!question) {
            return res.status(404).json({ error: 'No question found' });
        }
        
        //check response headers
        console.log("Headers before sending response:", res.getHeaders());
        
        res.json({ 
            question: question.question, 
            id: question._id 
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to process a single question with ChatGPT and update the database
router.post("/answer", async (req, res) => {
    const { id, question, model } = req.body; // Now includes model from the request body

    if (!id || !question || !model) {
        return res.status(400).json({ error: "ID, question, and model are required." });
    }

    try {
        // Step 1: Select the model based on the input
        let selectedModel;

        if (model === "history") {
            selectedModel = historyModel;
        } else if (model === "social") {
            selectedModel = socialModel;
        } else if (model === "computer") {
            selectedModel = computerModel;
        } else {
            return res.status(400).json({ error: "Invalid model specified." });
        }

        // Step 2: Use askAIAndUpdateDB to process and update the question
        const randomFiles = [{ _id: id, question }]; 
        const updatedQuestions = await askAIAndUpdateDB(randomFiles, selectedModel);

        if (updatedQuestions.length === 0) {
            return res.status(500).json({ error: "Failed to update the database." });
        }

        // Step 3: Return the ChatGPT's response
        res.json({ chatGPTResponse: updatedQuestions[0].chat_answer });
    } catch (error) {
        console.error("Error processing ChatGPT response:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/chart-data', async (req, res) => {
    const domains = [historyModel, socialModel, computerModel];
    const metrics = await calculateMetrics();
    res.json(metrics); // Send metrics as JSON
});

module.exports = router;


