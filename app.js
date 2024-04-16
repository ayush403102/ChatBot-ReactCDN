const MainReact = () => {
  // State for user input, chat history, and API response
  const [userInput, setUserInput] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState([]);
  const [apiResponse, setApiResponse] = React.useState('');

  const sendMessage = async () => {
    if (userInput.trim() !== '') {
      try {
        // Create a new user message element
        const userMessage = {
          message: userInput,
          isFromUser: true,
        };
        setChatHistory([...chatHistory, userMessage]);
        // Send the user input to the ChatGPT API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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', // Replace with your OpenAI API key
          },
          body: JSON.stringify({
            messages: [{ role: "system", content: userInput}],
            model: "gpt-3.5-turbo",
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch response from API');
        }
  
        const data = await response.json();
        
        // Check if the response contains choices array
        if (data.choices && data.choices.length > 0) {
          // Extract the response text from the API response
          const apiResponse = data.choices[0].text.trim();
  
          // Update the chat history and API response
          setChatHistory([...chatHistory, { message: apiResponse, isFromUser: false }]);
          setApiResponse(apiResponse);
        } else {
          console.error('Invalid response format: Choices array not found');
        }

      } 
      catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
      setUserInput('');
    }
  };

  // Render the MainReact component
  return (
    <div className="container">
      <div className="chat-container" id="chat-container">
        <div className="chat-message bot-message">
          <h1 className="message-text">🐥 Yo, 'Sup! 🌟 🐥 </h1>
        </div>
        {chatHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.isFromUser ? 'user-message' : 'bot-message'}`}>
            {message.isFromUser ? (
              <div>
                <p className="message-text"><i className="fas fa-user user-icon"></i>{message.message}</p>
              </div>
            ) : (
              <div>
                <i className="fas fa-robot bot-icon"></i>
                <p className="message-text">{message.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-box">
        <div className="input-container">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            onKeyDown={handleKeyDown} // Call handleKeyDown function on Enter key press
          />
          <button onClick={sendMessage}>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// Render the MainReact component to the DOM
ReactDOM.render(<MainReact />, document.getElementById("root-react"));
