import { useState } from 'react';

function ChatGPTInput() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Update the messages state with the new user message
        const newUserMessage = {
            role: 'user',
            content: [{ type: 'text', text: input }],
        };
        setMessages([...messages, newUserMessage]);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY2}`, // Ensure your environment variable is correctly set
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: messages.concat(newUserMessage), // Include the new user message in the request
                max_tokens: 150,
            }),
        };

        try {
            const response = await fetch(
                'https://api.openai.com/v1/chat/completions',
                requestOptions
            );
            const data = await response.json();
            const newBotMessage = {
                role: 'system',
                content: [
                    { type: 'text', text: data.choices[0].message.content },
                ],
            };
            setResponse(data.choices[0].message.content);
            setMessages([...messages, newUserMessage, newBotMessage]);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Failed to fetch response.');
        }

        // Clear the input field
        setInput('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' value={input} onChange={handleInputChange} />
                <button type='submit'>Submit</button>
            </form>
            <p>Response: {response}</p>
        </div>
    );
}

export default ChatGPTInput;
