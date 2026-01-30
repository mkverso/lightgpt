/**
 * AI Text Generation Module
 * 
 * Handles AI chat responses using Puter.js serverless API.
 * Provides free access to GPT-4o-mini without authentication.
 * 
 * @module ai/generate
 */

// Puter.js - Free, serverless AI API (no credentials required)
// Supports GPT, Claude, Gemini, Llama, and more

let isGenerating = false;

// Declare puter as global (loaded from CDN script in index.html)
declare const puter: any;

/**
 * Generate an AI response using Puter.js cloud API.
 * Supports multi-modal inputs (text + image).
 * 
 * @param {string} prompt - The user's message or context
 * @param {string} [image] - Optional base64 encoded image string
 * @returns {Promise<string>} The AI's response text
 */
export async function generateResponse(prompt: string, image?: string): Promise<string> {
    // Concurrency guard
    if (isGenerating) {
        return "⚠️ Please wait for the current response to finish.";
    }

    try {
        isGenerating = true;

        if (typeof puter === 'undefined') {
            throw new Error("Puter.js not loaded. Please refresh the page.");
        }

        let payload: any = prompt;

        // If an image is provided, construct a multi-modal payload
        if (image) {
            payload = [
                {
                    role: 'user',
                    content: [
                        { type: "text", text: prompt || "What is in this image?" },
                        {
                            type: "image_url",
                            image_url: {
                                url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
                            }
                        }
                    ]
                }
            ];
        }

        // Call Puter.js AI chat API
        const response = await puter.ai.chat(payload, {
            model: 'gpt-4o-mini',
            stream: false
        });

        // Parse nested response structure: { message: { content: "..." } }
        let responseText = '';
        if (typeof response === 'string') {
            responseText = response;
        } else if (response?.message?.content && typeof response.message.content === 'string') {
            // Nested structure: response.message.content (standard format)
            responseText = response.message.content;
        } else if (response?.content && typeof response.content === 'string') {
            // Direct content (alternative format)
            responseText = response.content;
        } else if (response?.message && typeof response.message === 'string') {
            responseText = response.message;
        } else {
            console.log('Unexpected response format:', response);
            // Force to string
            responseText = String(response?.message?.content || response?.content || 'Error: Invalid response');
        }

        return responseText.trim();

    } catch (error) {
        console.error('AI Generation Error:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return `⚠️ AI Error: ${errorMessage}`;
    } finally {
        isGenerating = false;
    }
}

/**
 * Pre-load the AI model (no-op for API-based approach).
 * 
 * Kept for API compatibility. Since Puter.js is cloud-based,
 * no local model loading is required.
 */
export async function preloadModel() {
    console.log("Puter.js AI ready - no preload needed!");
}
