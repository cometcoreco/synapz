"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from 'axios';
import Layout from "@/components/Layout";
import Image from "@/components/Image";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import PreviewChatBot from "@/components/PreviewChatBot";
import { createChatbot } from '../../../services/chatbotService';


// Assuming the structure of your bot object, adjust if necessary
interface Bot {
    id: string;
    title: string;
    image: string;
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

const CreateChatBotPage = () => {
    const [name, setName] = useState<string>("");
    const [bot, setBot] = useState<Bot>(bots[0]);
    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        console.log("Bot model id before sending:", bot.id); // Log the bot ID
      
        const formData = new FormData();
        formData.append('name', name);
        formData.append('botModel', bot.id);
        formData.append('message', message);
      
        if (file) {
            formData.append('file', file);
        }
      
        try {
            const response = await axios.post('http://localhost:3001/api/create-bot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
      
            console.log("Response:", response.data); // Log the response from the server
      
            if (response.data.success) {
                alert('Chatbot created successfully!');
                // Optionally, handle post-creation logic, like redirecting or updating state
            } else {
                // Handle case where server responds but chatbot creation is unsuccessful
                alert('Failed to create chatbot. Server responded but indicated failure.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle errors thrown by Axios
                if (error.response) {
                    // Server responded with a status other than 200 range
                    console.error('Error creating chatbot:', error.response.data);
                    alert(`Error in submitting the form: ${error.response.status} ${error.response.statusText}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Error creating chatbot: No response received', error.request);
                    alert('Error in submitting the form: No response received from server.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error creating chatbot:', error.message);
                    alert('Error in submitting the form: Request setup failed.');
                }
            } else {
                // Handle errors that aren't Axios errors
                console.error('Error creating chatbot:', error);
                alert('An unknown error occurred.');
            }
        }
      };

const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
};

const handleBotChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBotId = e.target.value;
    const selectedBot = bots.find(bot => bot.id === selectedBotId);
    if (selectedBot) {
        setBot(selectedBot);
    }
};

const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
};

return (
    <Layout>
        <div className="relative shrink-0 w-full h-[22.5rem] max-h-950:h-[18rem] max-h-850:h-[14rem] bg-n-2 lg:h-[14rem] md:h-44 dark:bg-n-7">
                <Image
                    className="object-cover"
                    src="/images/bg-7.jpg"
                    fill
                    alt=""
                />
            </div>
            <div className="relative -mt-[4.75rem] px-10 md:mt-0 md:px-0">
                <div className="max-w-[70.5rem] mx-auto p-16 border border-n-3 rounded-[1.25rem] bg-n-1 lg:p-12 md:border-0 md:rounded-none md:p-5 md:pb-8 dark:bg-n-6 dark:border-n-5">
                    <div className="max-w-[45rem] mx-auto">
                        <div className="flex justify-between items-center mb-5 md:-mx-5 md:mb-8 md:px-5 md:pb-5 md:border-b md:border-n-3 dark:md:border-n-5">
                            <div className="text-h2 lg:text-h3 md:text-h6">
                                Create a chat bot
                            </div>
                            <PreviewChatBot />
                        </div>
                        <div className="mb-12 text-body-1 text-n-4 md:text-body-2 md:mb-8">
                            Create an assistant chatbot that helps you answer
                            every client&apos;s website queries quickly
                        </div>
                        
        <form onSubmit={handleSubmit}>
            <Field
                className="w-full mb-3"
                label="Bot name"
                placeholder="E.g., UI8 Marketplace"
                value={name}
                onChange={handleNameChange}
                required
            />
            <select
        value={bot.id}
        onChange={handleBotChange}
        className="w-full mb-3"
    >
        {bots.map(botOption => (
            <option key={botOption.id} value={botOption.id}>{botOption.title}</option>
        ))}
    </select>
<div className="mb-3">
<div className="text-base-2 font-semibold text-n-4">
Chatbot logo
</div>
<div className="flex items-center text-small text-n-4">
<div className="flex justify-center items-center shrink-0 w-16 h-16 mr-6 bg-n-7 rounded-full">
<Image
                             className="w-5"
                             src={bot.image}
                             width={20}
                             height={20}
                             alt=""
                         />
</div>
800x800 PNG, JPG is recommended. Maximum file size: 2Mb
</div>
</div>
<Field
    className="mb-3"
    label="Description"
    placeholder="Enter description"
    note="Enter each message in a new line."
    value={message}
    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
    required
    textarea
/>
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
                <span>Create chatbot</span>
                <Icon name="add-circle-stroke" />
            </button>
    <button className="btn-stroke ml-3" type="button">
        Cancel
        </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>

);
};

export default CreateChatBotPage;
