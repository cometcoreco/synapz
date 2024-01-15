// services/chatbotService.js
const createChatbot = async (chatbotData, token) => {
    const response = await fetch('/api/chatbots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Assuming you use Bearer token for auth
      },
      body: JSON.stringify(chatbotData)
    });
  
    if (!response.ok) {
      throw new Error('Failed to create chatbot');
    }
  
    return response.json();
  };
  
  export { createChatbot };


  // services/chatbotService.js
const listChatbots = async (userId, token) => {
    const response = await fetch(`/api/chatbots/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Assuming you use Bearer token for auth
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to retrieve chatbots');
    }
  
    return response.json();
  };
  
  export { listChatbots };

