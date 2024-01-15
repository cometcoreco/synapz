"use client";
import React, { ChangeEvent, useState } from "react";
import axios from 'axios';
import Image from "@/components/Image";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import PreviewChatBot from "@/components/PreviewChatBot";

// Assuming the structure of your bot object and chatbot data
interface Bot {
    id: string;
    title: string;
    image: string;
}

interface ChatBotData {
    name: string;
    botModel: string;
    message: string;
    file: File | null;
    // Include other properties as needed
}

const bots: Bot[] = [
    {
        id: "gpt-4-1106-preview",
        title: "ChatGPT-4",
        image: "/images/logo-chat-gpt.svg",
    },
    {
        id: "gpt-3.5-turbo-1106",
        title: "ChatGPT-3.5",
        image: "/images/logo-chat-gpt.svg",
    },
];

const CreateChatBotPage = ({ chatbot }: { chatbot?: ChatBotData }) => {
    // Check if chatbot data is available
    if (!chatbot) {
        return <div>Loading...</div>; // Or any other loading state you prefer
    }

    const [name, setName] = useState<string>(chatbot.name);
    const [selectedBot, setSelectedBot] = useState<Bot>(bots.find(bot => bot.id === chatbot.botModel) || bots[0]);
    const [message, setMessage] = useState<string>(chatbot.message);
    const [file, setFile] = useState<File | null>(chatbot.file);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('botModel', selectedBot.id);
            formData.append('message', message);
            if (file) {
                formData.append('file', file);
            }

            // Replace with your API endpoint
            const response = await axios.post('/api/update-chatbot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Chatbot updated successfully!');
                // Handle additional logic after successful update
            } else {
                alert('Failed to update chatbot. Server responded but indicated failure.');
            }
        } catch (error) {
            console.error('Error updating chatbot:', error);
            alert('An error occurred while updating the chatbot.');
        }
    };

    const handleBotChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedBot = bots.find(bot => bot.id === e.target.value);
        if (selectedBot) {
            setSelectedBot(selectedBot);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="w-full mb-3"
                label="Bot name"
                placeholder="E.g., UI8 Marketplace"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required

        />
        <Select
            className="w-full mb-3"
            label="Base bot"
            items={bots}
            value={selectedBot}
            onChange={handleBotChange}
        />
        <Field
            className="mb-3"
            label="Description"
            placeholder="Enter description"
            note="Enter each message in a new line."
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            required
            textarea
        />
        <div className="mb-3">
            <div className="text-base-2 font-semibold text-n-4">
                Chatbot logo
            </div>
            <div className="flex items-center text-small text-n-4">
                <div className="flex justify-center items-center shrink-0 w-16 h-16 mr-6 bg-n-7 rounded-full">
                    <Image
                        className="w-5"
                        src={selectedBot.image}
                        width={20}
                        height={20}
                        alt=""
                    />
                </div>
                800x800 PNG, JPG is recommended. Maximum file size: 2Mb
            </div>
        </div>
        <div className="mb-3">
            <div className="flex mb-2 text-base-2 font-semibold text-n-4">
                Files/documents (optional)
            </div>
            <div className="relative flex justify-center items-center h-32 border-2 border-n-3 border-dashed rounded-2xl dark:border-n-5">
                <input
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    onChange={handleFileChange}
                />
                <Icon className="w-6 h-6 fill-n-7 dark:fill-n-2" name="add-circle-stroke" />
            </div>
        </div>
        <div className="flex">
            <button className="btn-gradient md:grow" type="submit">
                <span>Update Chatbot</span>
                <Icon name="save" />
            </button>
            <button className="btn-stroke ml-3" type="button">
                Cancel
            </button>
        </div>
    </form>
);
};

export default CreateChatBotPage;