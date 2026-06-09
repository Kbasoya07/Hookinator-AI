import { z } from 'zod';

// Define the final validation schemas for our outputs
export const OptimizeOutputSchema = z.object({
  optimizedTitle: z.string().min(1, 'Title cannot be empty'),
  optimizedDescription: z.string().min(1, 'Description cannot be empty'),
  hashtags: z.array(z.string()),
  explanation: z.string().optional(),
  scoreImprovement: z.number().min(0).max(100).optional().default(38)
});

export const GenerateOutputSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  hashtags: z.array(z.string()),
  explanation: z.string().optional(),
  scoreImprovement: z.number().min(0).max(100).optional().default(92)
});

export type OptimizeOutput = z.infer<typeof OptimizeOutputSchema>;
export type GenerateOutput = z.infer<typeof GenerateOutputSchema>;

// Helper to clean and format hashtags (remove duplicates, hash sign, slice to 7)
function cleanHashtags(tags: string[]): string[] {
  const unique = Array.from(
    new Set(
      tags
        .map(t => t.replace(/#/g, '').trim())
        .filter(t => t.length > 0)
    )
  );
  
  // Pad if less than 7, slice if more
  while (unique.length < 7) {
    unique.push('youtube');
  }
  return unique.slice(0, 7);
}

// Call Groq API with specified model (70B for content, 8B for tags)
async function callGroqModel(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.startsWith('your-')) {
    throw new Error('Missing or invalid GROQ_API_KEY environment variable.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: {
        type: 'json_object'
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Groq API (${model}) Error Response:`, errorBody);
    throw new Error(`Groq request failed with status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('Groq returned an empty or invalid response structure.');
  }

  return rawText;
}

// Call Google Gemini API (gemini-flash-latest) with key rotation
async function callGemini(prompt: string): Promise<string> {
  const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  if (!keysString || keysString.startsWith('your-')) {
    throw new Error('Missing or invalid API_KEY environment variable.');
  }

  const keys = keysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  if (keys.length === 0) {
    throw new Error('No valid API keys found in the key pool.');
  }

  // Randomly select a key from the pool
  const randomIndex = Math.floor(Math.random() * keys.length);
  const apiKey = keys[randomIndex];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error Response:', errorBody);
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('AI returned an empty or invalid response structure.');
  }

  return rawText;
}

/**
 * Optimizes an existing title and description.
 */
export async function optimizeHook(title: string, description: string): Promise<OptimizeOutput> {
  // Try Groq First
  try {
    // 1. Optimize Title and Description using 70B model
    const textPrompt = `Optimize this YouTube title and description for maximum CTR and SEO. Ensure the output targets curiosity gaps, psychological hooks, and high searchability.
    Compare the optimized version with the original version, and assign an improvement score (percentage) from 0 to 100 representing how much better the new title and description are. Return it as an integer in "scoreImprovement".
    
Input Title: "${title}"
Input Description: "${description}"

Return ONLY valid JSON with exactly the following structure:
{
  "optimizedTitle": "New high-CTR YouTube title here",
  "optimizedDescription": "SEO-friendly description with chapters, search terms, and timestamps here",
  "explanation": "A brief explanation of the hooks used",
  "scoreImprovement": 45
}`;

    const textResult = await callGroqModel(textPrompt, 'llama-3.3-70b-versatile');
    const textParsed = JSON.parse(textResult);
    const textValidated = z.object({
      optimizedTitle: z.string().min(1),
      optimizedDescription: z.string().min(1),
      explanation: z.string().optional(),
      scoreImprovement: z.number().min(0).max(100).optional().default(38)
    }).parse(textParsed);

    // 2. Generate Hashtags using 8B model based on optimized text
    const tagsPrompt = `Generate exactly 7 targeted hashtags for this YouTube video.
Title: "${textValidated.optimizedTitle}"
Description: "${textValidated.optimizedDescription}"

Return ONLY valid JSON with exactly the following structure:
{
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"]
}`;

    const tagsResult = await callGroqModel(tagsPrompt, 'llama-3.1-8b-instant');
    const tagsParsed = JSON.parse(tagsResult);
    const tagsValidated = z.object({
      hashtags: z.array(z.string())
    }).parse(tagsParsed);
    
    return {
      optimizedTitle: textValidated.optimizedTitle,
      optimizedDescription: textValidated.optimizedDescription,
      explanation: textValidated.explanation || 'Optimized successfully.',
      hashtags: cleanHashtags(tagsValidated.hashtags),
      scoreImprovement: textValidated.scoreImprovement
    };
  } catch (groqError) {
    console.warn('Groq optimization failed. Falling back to Gemini...', groqError);
    
    const prompt = `Optimize this YouTube title and description for maximum CTR and SEO. Ensure the output targets curiosity gaps, psychological hooks, and high searchability.
    Compare the optimized version with the original version, and assign an improvement score (percentage) from 0 to 100 representing how much better the new title and description are. Return it as an integer in "scoreImprovement".
  
Input Title: "${title}"
Input Description: "${description}"

Return ONLY valid JSON with exactly the following structure:
{
  "optimizedTitle": "New high-CTR YouTube title here",
  "optimizedDescription": "SEO-friendly description with chapters, search terms, and timestamps here",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
  "explanation": "A brief explanation of the hooks used",
  "scoreImprovement": 45
}`;

    // Fallback to Gemini
    try {
      const rawResult = await callGemini(prompt);
      const parsed = JSON.parse(rawResult);
      const validated = OptimizeOutputSchema.parse(parsed);
      
      return {
        ...validated,
        hashtags: cleanHashtags(validated.hashtags)
      };
    } catch (geminiError) {
      console.warn('Gemini optimization failed. Retrying with stricter instructions...', geminiError);
      
      // Retry once with an even more explicit formatting prompt
      const strictPrompt = `${prompt}\n\nCRITICAL: You must return raw JSON only. Do not wrap in markdown code blocks like \`\`\`json. The JSON keys must match exactly: "optimizedTitle", "optimizedDescription", "hashtags", "explanation", and "scoreImprovement".`;
      const rawResult = await callGemini(strictPrompt);
      const parsed = JSON.parse(rawResult);
      const validated = OptimizeOutputSchema.parse(parsed);
      
      return {
        ...validated,
        hashtags: cleanHashtags(validated.hashtags)
      };
    }
  }
}

/**
 * Generates metadata from scratch based on a topic and genre.
 */
export async function generateMetadata(topic: string, genre: string): Promise<GenerateOutput> {
  // Try Groq First
  try {
    // 1. Generate Title and Description using 70B model
    const textPrompt = `Generate a viral YouTube title and SEO-optimized description for:
Topic: "${topic}"
Genre: "${genre}"

Calculate an SEO and quality score (an integer between 85 and 99) representing how optimized and engaging the generated title/description is, and return it in "scoreImprovement".

Return ONLY valid JSON with exactly the following structure:
{
  "title": "A highly clickable title",
  "description": "SEO description targeting search terms for the ${genre} genre",
  "explanation": "A brief explanation of the hook strategy",
  "scoreImprovement": 94
}`;

    const textResult = await callGroqModel(textPrompt, 'llama-3.3-70b-versatile');
    const textParsed = JSON.parse(textResult);
    const textValidated = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      explanation: z.string().optional(),
      scoreImprovement: z.number().min(0).max(100).optional().default(92)
    }).parse(textParsed);

    // 2. Generate Hashtags using 8B model based on generated text
    const tagsPrompt = `Generate exactly 7 targeted hashtags for this YouTube video.
Title: "${textValidated.title}"
Description: "${textValidated.description}"
Genre: "${genre}"

Return ONLY valid JSON with exactly the following structure:
{
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"]
}`;

    const tagsResult = await callGroqModel(tagsPrompt, 'llama-3.1-8b-instant');
    const tagsParsed = JSON.parse(tagsResult);
    const tagsValidated = z.object({
      hashtags: z.array(z.string())
    }).parse(tagsParsed);
    
    return {
      title: textValidated.title,
      description: textValidated.description,
      explanation: textValidated.explanation || 'Generated successfully.',
      hashtags: cleanHashtags(tagsValidated.hashtags),
      scoreImprovement: textValidated.scoreImprovement
    };
  } catch (groqError) {
    console.warn('Groq generation failed. Falling back to Gemini...', groqError);
    
    const prompt = `Generate a viral YouTube title, SEO-optimized description, and 7 targeted hashtags for:
Topic: "${topic}"
Genre: "${genre}"

Calculate an SEO and quality score (an integer between 85 and 99) representing how optimized and engaging the generated title/description is, and return it in "scoreImprovement".

Return ONLY valid JSON with exactly the following structure:
{
  "title": "A highly clickable title",
  "description": "SEO description targeting search terms for the ${genre} genre",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
  "explanation": "A brief explanation of the hook strategy",
  "scoreImprovement": 94
}`;

    // Fallback to Gemini
    try {
      const rawResult = await callGemini(prompt);
      const parsed = JSON.parse(rawResult);
      const validated = GenerateOutputSchema.parse(parsed);
      
      return {
        ...validated,
        hashtags: cleanHashtags(validated.hashtags)
      };
    } catch (geminiError) {
      console.warn('Gemini generation failed. Retrying with stricter instructions...', geminiError);
      
      const strictPrompt = `${prompt}\n\nCRITICAL: You must return raw JSON only. Do not wrap in markdown code blocks like \`\`\`json. The JSON keys must match exactly: "title", "description", "hashtags", "explanation", and "scoreImprovement".`;
      const rawResult = await callGemini(strictPrompt);
      const parsed = JSON.parse(rawResult);
      const validated = GenerateOutputSchema.parse(parsed);
      
      return {
        ...validated,
        hashtags: cleanHashtags(validated.hashtags)
      };
    }
  }
}
