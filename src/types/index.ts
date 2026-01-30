export type Message = {
    role: "user" | "ai";
    content: string;
    image?: string;
};

export type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
};
