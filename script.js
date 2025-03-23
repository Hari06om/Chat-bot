// // Select DOM Elements
const prompt = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");
const imageBtn = document.querySelector("#image");
const image = document.querySelector("#image img");
const imageInput = document.querySelector("#image input");
const voiceBtn = document.querySelector("#voice");
const stopVoiceBtn = document.createElement("button");
stopVoiceBtn.textContent = "Stop Voice";
stopVoiceBtn.id = "stop-voice";
stopVoiceBtn.style.display = "none";
voiceBtn.insertAdjacentElement("afterend", stopVoiceBtn);

// API URL and User Data
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=Your_API_Key";
const user = {
  message: null,
  file: { mime_type: null, data: null },
};

// Speech Recognition and Synthesis Instances
let recognition = null;
let speechUtterance = null;

// Function to Stop AI Speech
function stopAISpeech() {
  if (speechUtterance) {
    speechSynthesis.cancel();
    speechUtterance = null;
  }
}

// Function to Convert AI Text to Speech
function speakText(text) {
  if (!text) return;
  stopAISpeech();
  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = "en-US";
  speechUtterance.rate = 1;
  speechUtterance.pitch = 1;
  speechSynthesis.speak(speechUtterance);
}

// Function to Generate AI Response
async function generateResponse(aiChatBox) {
  const textElement = aiChatBox.querySelector(".ai-chat-area");

  const requestBody = { contents: [{ parts: [{ text: user.message }] }] };
  if (user.file.data) {
    requestBody.contents[0].parts.push({ inline_data: user.file });
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    const apiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ AI Response Unavailable";

    textElement.innerHTML = apiResponse;
    stopVoiceRecognition();
    speakText(apiResponse);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    textElement.innerHTML = "⚠️ Error generating response. Try again.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    resetImage();
  }
}

// Function to Stop Voice Recognition
function stopVoiceRecognition() {
  if (recognition) {
    recognition.stop();
    stopVoiceBtn.style.display = "none";
    recognition = null;
  }
}

// Function to Start Voice Recognition
function startVoiceRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  stopAISpeech();

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.start();
  stopVoiceBtn.style.display = "inline-block";

  recognition.onstart = () => voiceBtn.classList.add("listening");
  recognition.onresult = (event) => {
    prompt.value = event.results[0][0].transcript;
    handleChatResponse(prompt.value);
  };
  recognition.onerror = () => alert("Voice recognition error. Try again.");
  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
    stopVoiceBtn.style.display = "none";
  };
}

// Function to Handle User Chat Submission
function handleChatResponse(userMessage) {
  if (!userMessage.trim()) return;
  user.message = userMessage;

  const userChatHtml = `<div class="user-chat-box">
    <img src="img/user.png" alt="User" width="8%">
    <div class="user-chat-area">${user.message}</div>
  </div>`;

  chatContainer.appendChild(createChatBox(userChatHtml, "user-chat-box"));
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const aiChatHtml = `<div class="ai-chat-box">
      <img src="img/ai.png" alt="AI" width="10%">
      <div class="ai-chat-area">
        <img src="img/loading.webp" alt="Loading" class="load" width="50px">
      </div>
    </div>`;

    const aiChatBox = createChatBox(aiChatHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);

  prompt.value = "";
}

// Function to Create Chat Box Elements
function createChatBox(html, classes) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to Reset Image Selection
function resetImage() {
  image.src = `img/img.svg`;
  image.classList.remove("choose");
  user.file = { mime_type: null, data: null };
}

// Event Listeners
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleChatResponse(prompt.value);
});
submitBtn.addEventListener("click", () => handleChatResponse(prompt.value));
voiceBtn.addEventListener("click", startVoiceRecognition);
stopVoiceBtn.addEventListener("click", stopVoiceRecognition);





// // Select DOM Elements
// const prompt = document.querySelector("#prompt");
// const submitBtn = document.querySelector("#submit");
// const chatContainer = document.querySelector(".chat-container");
// const imageBtn = document.querySelector("#image");
// const image = document.querySelector("#image img");
// const imageInput = document.querySelector("#image input");
// const voiceBtn = document.querySelector("#voice");
// const stopVoiceBtn = document.createElement("button");

// stopVoiceBtn.textContent = "Stop Voice";
// stopVoiceBtn.id = "stop-voice";
// stopVoiceBtn.style.display = "none";
// voiceBtn.insertAdjacentElement("afterend", stopVoiceBtn);

// // API URL (Replace with a valid key)
// const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB9IyDBsyrICqRbxwPMxXKYo3ivges6PR0";

// let user = { message: null, file: { mime_type: null, data: null } };
// let recognition = null; // Speech Recognition instance
// let speechUtterance = null; // Speech Synthesis instance

// // Function to Stop AI Speech
// function stopAISpeech() {
//   if (speechUtterance) {
//     speechSynthesis.cancel();
//     speechUtterance = null;
//   }
// }

// // Function to Detect Language (English or Hindi)
// function detectLanguage(text) {
//   return /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
// }

// // Function to Speak Text
// function speakText(text) {
//   if (!text) return;
//   stopAISpeech();

//   speechUtterance = new SpeechSynthesisUtterance(text);
//   speechUtterance.lang = detectLanguage(text);
//   speechUtterance.rate = 1.1; 
//   speechUtterance.pitch = 1.4; 
//   speechUtterance.volume = 1; 

//   function setVoiceAndSpeak() {
//     const voices = speechSynthesis.getVoices();
//     if (!voices.length) {
//       setTimeout(setVoiceAndSpeak, 100);
//       return;
//     }

//     // Try to find a suitable voice for English or Hindi
//     const selectedVoice = voices.find(voice => voice.lang === speechUtterance.lang) || voices[0];

//     if (selectedVoice) {
//       speechUtterance.voice = selectedVoice;
//     }

//     speechSynthesis.speak(speechUtterance);
//   }

//   if (speechSynthesis.getVoices().length === 0) {
//     speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
//     speechSynthesis.getVoices();
//   } else {
//     setVoiceAndSpeak();
//   }
// }

// // Ensure voices are loaded
// speechSynthesis.onvoiceschanged = () => {
//   console.log("Available voices:", speechSynthesis.getVoices());
// };

// // Function to Generate AI Response
// async function generateResponse(aiChatBox) {
//   let textElement = aiChatBox.querySelector(".ai-chat-area");

//   let requestBody = { contents: [{ parts: [{ text: user.message }] }] };
//   if (user.file.data) {
//     requestBody.contents[0].parts.push({ inline_data: user.file });
//   }

//   let requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(requestBody),
//   };

//   try {
//     let response = await fetch(API_URL, requestOptions);
//     let data = await response.json();
//     let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ AI Response Unavailable";

//     textElement.innerHTML = apiResponse;
//     stopVoiceRecognition();
//     speakText(apiResponse);
//   } catch (error) {
//     console.error("Error fetching AI response:", error);
//     textElement.innerHTML = "⚠️ Error generating response. Try again.";
//   } finally {
//     chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
//     resetImage();
//   }
// }

// // Function to Stop Voice Recognition
// function stopVoiceRecognition() {
//   if (recognition) {
//     recognition.stop();
//     stopVoiceBtn.style.display = "none";
//   }
// }

// // Function to Start Voice Recognition
// function startVoiceRecognition() {
//   if (!("webkitSpeechRecognition" in window)) {
//     alert("Voice recognition is not supported in this browser.");
//     return;
//   }

//   stopAISpeech();

//   recognition = new webkitSpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.continuous = false;
//   recognition.interimResults = false;
//   recognition.start();
//   stopVoiceBtn.style.display = "inline-block";

//   recognition.onstart = () => voiceBtn.classList.add("listening");
//   recognition.onresult = (event) => {
//     prompt.value = event.results[0][0].transcript;
//     handleChatResponse(prompt.value);
//   };
//   recognition.onerror = (err) => {
//     console.error("Speech Recognition Error:", err);
//     alert("Voice recognition error. Try again.");
//   };
//   recognition.onend = () => {
//     voiceBtn.classList.remove("listening");
//     stopVoiceBtn.style.display = "none";
//   };
// }

// // Function to Handle User Chat Submission
// function handleChatResponse(userMessage) {
//   if (!userMessage.trim()) return;
//   user.message = userMessage;

//   let userChatHtml = `<div class="user-chat-box">
//     <img src="img/user.png" alt="User" width="8%">
//     <div class="user-chat-area">${user.message}</div>
//   </div>`;
  
//   chatContainer.appendChild(createChatBox(userChatHtml, "user-chat-box"));
//   chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

//   setTimeout(() => {
//     let aiChatHtml = `<div class="ai-chat-box">
//       <img src="img/ai.png" alt="AI" width="10%">
//       <div class="ai-chat-area">
//         <img src="img/loading.webp" alt="Loading" class="load" width="50px">
//       </div>
//     </div>`;
    
//     let aiChatBox = createChatBox(aiChatHtml, "ai-chat-box");
//     chatContainer.appendChild(aiChatBox);
//     generateResponse(aiChatBox);
//   }, 600);

//   prompt.value = "";
// }

// // Function to Create Chat Box Elements
// function createChatBox(html, classes) {
//   let div = document.createElement("div");
//   div.innerHTML = html;
//   div.classList.add(classes);
//   return div;
// }

// // Function to Reset Image Selection
// function resetImage() {
//   image.src = `img/img.svg`;
//   image.classList.remove("choose");
//   user.file = { mime_type: null, data: null };
// }

// // Event Listeners
// prompt.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") handleChatResponse(prompt.value);
// });
// submitBtn.addEventListener("click", () => handleChatResponse(prompt.value));
// voiceBtn.addEventListener("click", startVoiceRecognition);
// stopVoiceBtn.addEventListener("click", stopVoiceRecognition);
