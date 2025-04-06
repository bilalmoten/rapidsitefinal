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
        // Create a new form event
        const formEvent = new Event('submit') as any;

        // Set the input value first
        handleInputChange({
            target: { value: message }
        } as any);

        // Then submit the form with the updated input
        await handleSubmit(formEvent);
    };

    return {
        chat: formattedChat,
        sendMessage,
        loading: isLoading,
        input,
        handleInputChange
    };
}; 