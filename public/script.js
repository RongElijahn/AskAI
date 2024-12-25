//get question
document.getElementById("fetchQuestion").addEventListener("click", async () => {
    const questionDisplay = document.getElementById("questionDisplay");
    const answerButton = document.getElementById("getAnswer")
    const modelSelector = document.getElementById("modelSelector");
    const selectedModel = modelSelector.value;;

    try {
        const response = await fetch(`/api/question?model=${encodeURIComponent(selectedModel)}`);

        const data = await response.json();
        questionDisplay.innerText = `Question: ${data.question}`;
        answerButton.style.display = "block";
        answerDisplay.style.display = "none";

        // Store question and ID for answer request
        answerButton.dataset.question = data.question;
        answerButton.dataset.id = data.id;
        answerButton.dataset.model = selectedModel;
    } catch (error) {
        console.error("Error fetching question:", error);
    }
});

document.getElementById("getAnswer").addEventListener("click", async (event) => {
    const question = event.target.dataset.question;
    const id = event.target.dataset.id;
    const model = event.target.dataset.model;
    const answerDisplay = document.getElementById("answerDisplay");
    answerDisplay.style.display = "block";

    try {
        const response = await fetch("/api/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, question, model }),
        });
        const data = await response.json();
        answerDisplay.innerText = `ChatGPT's Answer: ${data.chatGPTResponse[0]} (Time taken: ${data.chatGPTResponse[1]}ms)`;
    } catch (error) {
        console.error("Error fetching ChatGPT response:", error);
    }
});
