import { useChat } from 'ai/react';

export const useAI = () => {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat-assistant'
    });

    const formattedChat = messages.map((message) => ({
        text: message.content,
        isUser: message.role === 'user'
    }));

    const sendMessage = async (message: string) => {
        await handleSubmit(new Event('submit') as any, {
            options: {
                body: {
                    message
                }
            }
        });
    };

    return {
        chat: formattedChat,
        sendMessage,
        loading: isLoading,
        input,
        handleInputChange
    };
}; 