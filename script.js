/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.innerHTML = `<div class="msg ai"><strong>AI:</strong> 👋 Hello! How can I help you today?</div>`;

// Handle form submission
chatForm.addEventListener("submit", async (event) => {
  // Prevent the form from reloading the page
  event.preventDefault();

  // Get the user's message
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user's message in the chat window
  chatWindow.innerHTML += `<div class="msg user"><strong>You:</strong> ${userMessage}</div>`;

  // Clear the input field
  userInput.value = "";

  // Show a loading message
  chatWindow.innerHTML += `<div class="msg ai" id="loading"><strong>AI:</strong> Thinking...</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Prepare the messages array for OpenAI
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful beauty and skincare product advisor for L'Oréal. Only answer questions related to L’Oréal products, skincare routines, and recommendations. Do not answer questions unrelated to L’Oréal or its product lines. Your responses should be knowledgeable, concise, and focus on providing expert advice about L'Oréal offerings, how to use them effectively, and recommendations tailored to a customer’s skincare needs.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    // Replace with your actual Cloudflare Worker URL
    const workerUrl = "https://project-loreal.tonymcmo.workers.dev/";

    // Send the request to the Cloudflare Worker
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using gpt-4o model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // Remove the loading message
    document.getElementById("loading").remove();

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Get the AI's response from the data
    const aiMessage = data.choices[0].message.content;

    // Display the AI's response in the chat window
    chatWindow.innerHTML += `<div class="msg ai"><strong>AI:</strong> ${aiMessage}</div>`;

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    // Remove the loading message if there's an error
    const loadingMsg = document.getElementById("loading");
    if (loadingMsg) {
      loadingMsg.remove();
    }

    // Display an error message
    chatWindow.innerHTML += `<div class="msg ai"><strong>AI:</strong> Sorry, I encountered an error. Please try again.</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Log the error to the console for debugging
    console.error("Error:", error);
  }
});
