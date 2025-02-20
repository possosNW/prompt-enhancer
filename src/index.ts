export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    try {
      // Define the expected JSON structure
      interface RequestBody {
        input: string;
        scope?: string;
      }

      const body: RequestBody = await request.json(); // Type assertion

      if (!body.input) {
        return new Response(JSON.stringify({ error: "No input provided" }), { status: 400 });
      }

      const ai = env.AI;
      const model = "@cf/meta/llama-2-7b-chat-int8";

      // Define scoped prompt templates
      const scopeTemplates: Record<string, string> = {
        storytelling: `Enhance the following prompt with vivid storytelling elements:\n\n"${body.input}"`,
        technical: `Make the following prompt more detailed and precise for technical use:\n\n"${body.input}"`,
        concise: `Refine this prompt to be more concise and to the point:\n\n"${body.input}"`,
        default: `Improve the clarity and effectiveness of this prompt:\n\n"${body.input}"`,
      };

      // Select the correct scoped prompt
      const prompt = scopeTemplates[body.scope || "default"];

      // Call the AI model
      const response = await ai.run(model, { prompt });

      return new Response(JSON.stringify({ enhanced_prompt: response.text }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  },
};
