function sendData() {
    const youtubeURL = document.getElementById('youtubeURL').value;
    console.log(youtubeURL);

    updateHistory(youtubeURL);

    const inputSection = document.getElementById('inputDiv');
    const chatContainer = document.getElementById('chatContainer');
    const chatDisplay = document.getElementById('chatDisplay');
    const label = document.querySelector('.youtubeLoadinglabel');

    // Show loading text
    label.innerText = 'Processing...';

    fetch('/process', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ youtubeURL: youtubeURL })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();  
    })
    .then(data => {
        console.log('Received JSON:', data);  

        // Hide input section and show chat container
        inputSection.style.display = 'none';
        chatContainer.style.display = 'flex';

        // Hide placeholder if exists
        const placeholder = document.getElementById('placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Show blog/post content
        const botMessage = document.createElement('div');
        botMessage.className = 'bot_msg';
        botMessage.innerHTML = marked.parse(data.result);
        chatDisplay.appendChild(botMessage);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;

        // Reset label
        label.innerText = "Your content is ready now...";

        const followUpPrompt = document.createElement('div');
        followUpPrompt.className = 'bot_msg';
        followUpPrompt.innerText = 'Are we good with the content? (yes/no)';
        chatDisplay.appendChild(followUpPrompt);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;

        // Update input placeholder
        const chatInput = document.getElementById('userInput');
        if (chatInput) {
            chatInput.placeholder = 'Type "yes" to confirm or "no" to improve...';
            }
        })
    .catch(error => {
        console.error('Fetch error:', error);

        // Show error message in chat
        const errorMsg = document.createElement('div');
        errorMsg.className = 'bot_msg';
        errorMsg.innerText = 'Something went wrong while fetching blog content.';
        chatDisplay.appendChild(errorMsg);

        // Still hide input and show chat so user can retry
        inputSection.style.display = 'none';
        chatContainer.style.display = 'flex';

        // Reset label
        label.innerText = "Get YouTube link's blog.....";
        const chatMsgPlaceholder = document.getElementById('userInput');
            if (chatMsgPlaceholder) {
                chatMsgPlaceholder.placeholder = 'Are we good with content?';
            }    });
}

function sendMessage() {
    const chatInput = document.getElementById('userInput');
    const userInput = chatInput.value.trim().toLowerCase();
    const chatDisplay = document.getElementById('chatDisplay');

    if (!userInput) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'user_msg';
    userMessage.innerText = userInput;
    chatDisplay.appendChild(userMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    chatInput.value = '';

    if (userInput === 'yes') {
        const botReply = document.createElement('div');
        botReply.className = 'bot_msg';
        botReply.innerText = 'Okay, thanks.';
        chatDisplay.appendChild(botReply);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;

        // You can auto-send email here or enable email input form
        // sendEmail();  <-- Call this if needed
    } else if (userInput === 'no') {
        const label = document.querySelector('.youtubeLoadinglabel');
        label.innerText = 'Processing...';
        
        const botReply = document.createElement('div');
        botReply.className = 'bot_msg';
        botReply.innerText = 'Alright, Processing your blog...';
        chatDisplay.appendChild(botReply);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;

        fetch('/regenerate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: "Improve the content" })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Regenerate response:', data);  // Check what's coming back
            const improvedBotMsg = document.createElement('div');
            improvedBotMsg.className = 'bot_msg';
            improvedBotMsg.innerHTML = marked.parse(data?.result || 'No improved content returned.');
            chatDisplay.appendChild(improvedBotMsg);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            const label = document.querySelector('.youtubeLoadinglabel');
            label.innerText = 'Here is your content.';
        })
        .catch(error => {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'bot_msg';
            errorMsg.innerText = 'Error while regenerating content.';
            chatDisplay.appendChild(errorMsg);
            console.error(error);
        });
    }
}


function sendEmail(){
    const email = document.getElementById('emailId').value
    console.log(email)

    fetch('/sendEmail',{
        method: 'POST',
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify({email:email })
    })
    .then(response => {
        console.log(response)
    })
}


function downloadAsPdf(){
      const element = document.querySelector('input[name="content"]:checked');
      if(!element){
        alert('Kindly check an option')
      }
      const element_id = element.value
      const element_section = document.getElementById(element_id)

      html2pdf().from(element_section).save('Youtube_Content.pdf');
}

function redirectFullContent(elementId){
    const content = document.getElementById(elementId).textContent
    localStorage.setItem('viewContent',content)
    localStorage.setItem("viewTitle", elementId.replace("_", " ").toUpperCase());
    window.location.href = "/view-content";  // Flask route, not .html file
}

let historyList = [];  // Store last 7 URLs

function updateHistory(url) {
    // Add new URL to the beginning of the list
    historyList.unshift(url);

    // Keep only 7 items
    if (historyList.length > 7) {
        historyList.pop();
    }

    // Update the HTML list
    const historyUl = document.getElementById('historyList');
    historyUl.innerHTML = '';  // Clear previous list

    historyList.forEach((link, index) => {
        const li = document.createElement('li');
        li.textContent = `URL ${index + 1}: ${link}`;
        historyUl.appendChild(li);
    });
}
