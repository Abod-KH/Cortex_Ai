import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, attachments } = await req.json()

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]

    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Invalid request: No user message found", { status: 400 })
    }

    // Format previous messages for context
    const conversationHistory = messages
      .slice(0, -1)
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    let fullPrompt = conversationHistory
      ? `Previous conversation:\n${conversationHistory}\n\nUser: ${lastMessage.content}`
      : lastMessage.content

    // Add attachment information to the prompt if available
    if (attachments && attachments.length > 0) {
      const attachmentDescriptions = attachments.map(
        (attachment: any, index: number) => `Attachment ${index + 1}: ${attachment.name} (${attachment.type})`,
      )

      fullPrompt += "\n\nThe user has attached the following files:\n" + attachmentDescriptions.join("\n")
      fullPrompt += "\n\nPlease analyze these attachments and respond accordingly."
    }

    // Generate response using Gemini API
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: `${fullPrompt}\n\nPlease respond in plain text without markdown formatting. If you need to provide code, wrap it in triple backticks with the language specified. Do not use bold, italic, or other markdown formatting.`,
      system:
        "You are Cortex AI, an AI assistant specialized in generating code and helping users build applications. Provide helpful, accurate, and concise responses. When asked to generate code, provide clean, well-commented code with explanations. Do not use markdown formatting in your responses. If the user provides images or files, analyze them and incorporate your analysis into your response.",
      maxTokens: 2048,
    })

    // Parse the response to extract code blocks
    const codeBlockRegex = /```([a-zA-Z0-9]+)?\s*([\s\S]*?)```/g
    let match
    let responseContent = text
    let code = ""
    let language = ""

    while ((match = codeBlockRegex.exec(text)) !== null) {
      language = match[1] || "jsx"
      code = match[2].trim()

      // Remove the code block from the response content
      responseContent = responseContent.replace(match[0], "")
    }

    // Clean up the response content
    responseContent = responseContent.trim()

    return Response.json({
      role: "assistant",
      content: responseContent,
      code: code || undefined,
      language: language || undefined,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("Error processing your request: " + (error instanceof Error ? error.message : String(error)), {
      status: 500,
    })
  }
}
