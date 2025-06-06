import { NextRequest, NextResponse } from 'next/server';
const gmiApiKey = process.env.GMI_API_KEY as string; // For LLM API

if (!gmiApiKey) {
  console.warn(
    'Missing GMI_API_KEY. The AI pairing feature will not work without it. Please set GMI_API_KEY in your .env.local file.'
  );
}

interface UserProfile {
  name: string;
  questions: string[];
  answers: string[];
}

interface AllResultItem {
  id?: string;
  fields: {
    person: string;
    question: string;
    answer: string;
  };
}

export async function POST(request: NextRequest) {
  if (!gmiApiKey) {
    return NextResponse.json(
      { success: false, error: 'GMI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const currentUserProfile: UserProfile = body.currentUser;
    const allUsersDataFromFrontend: AllResultItem[] = body.allUsersData || [];

    // 1. Process data received from the frontend
    const recordsByPerson: { [key: string]: { questions: string[], answers: string[] } } = {};

    allUsersDataFromFrontend.forEach(item => {
      const person = item.fields?.person;
      const question = item.fields?.question;
      const answer = item.fields?.answer;

      if (person && question && answer) {
        if (!recordsByPerson[person]) {
          recordsByPerson[person] = { questions: [], answers: [] };
        }
        recordsByPerson[person].questions.push(question);
        recordsByPerson[person].answers.push(answer);
      }
    });

    // Add/Update current user's data to ensure it's included and up-to-date
    if (currentUserProfile && currentUserProfile.name) {
      recordsByPerson[currentUserProfile.name] = {
        questions: currentUserProfile.questions,
        answers: currentUserProfile.answers
      };
    }

    const peopleDataForLLM = Object.entries(recordsByPerson).map(([name, data]) => ({
        name,
        qas: data.questions.map((q, i) => ({ question: q, answer: data.answers[i] }))
    }));

    // 2. Construct the prompt for the LLM
    const promptContent = `You are an expert matchmaker. Based on the following Q&A submissions from various people, identify the best potential pairs. 
    For each person, suggest one or more other people they would be a good match with, and provide a brief reasoning for each pairing. 
    Consider shared interests, complementary personalities, or intriguing differences revealed in their answers.
    The current user for whom we are primarily generating pairs is: ${currentUserProfile.name}.
    Focus on finding good matches for ${currentUserProfile.name} with others, but also list other potential interesting pairs among the entire group.

    Here is the data for all participants:
    ${JSON.stringify(peopleDataForLLM, null, 2)}

    Please provide your response as a JSON object with a single key "pairings". 
    The value of "pairings" should be an array of objects. Each object should represent a person and their suggested matches, like this:
    {
      "person": "Name1",
      "matches": [
        { "match_with": "Name2", "reason": "Both love dogs and enjoy quiet nights in." },
        { "match_with": "Name3", "reason": "Name1's adventurous spirit complements Name3's planning skills for exciting trips." }
      ]
    }
    Ensure the JSON is well-formed. Prioritize matches for ${currentUserProfile.name}.
    `;

    // 3. Call the LLM API
    const llmResponse = await fetch('https://api.gmi-serving.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gmiApiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant specialized in matchmaking based on Q&A data. Output JSON.' },
          { role: 'user', content: promptContent },
        ],
        temperature: 0.2, // Adjust for creativity vs. determinism
        max_tokens: 1500, // Adjust based on expected output size
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error('LLM API error:', errorText);
      throw new Error(`LLM API request failed with status ${llmResponse.status}: ${errorText}`);
    }

    const llmData = await llmResponse.json();
    
    // 4. Parse the LLM's response
    // The LLM is asked to return JSON directly in the 'content' of its message.
    let pairsData;
    try {
      // Check if the response structure is as expected from the cURL example
      if (llmData.choices && llmData.choices[0] && llmData.choices[0].message && llmData.choices[0].message.content) {
        let jsonString = llmData.choices[0].message.content.trim();
        // Strip markdown fences if present
        if (jsonString.startsWith('```json') && jsonString.endsWith('```')) {
          jsonString = jsonString.substring(7, jsonString.length - 3).trim();
        } else if (jsonString.startsWith('```') && jsonString.endsWith('```')) {
          // Handle case where ``` is used without 'json' specifier
          jsonString = jsonString.substring(3, jsonString.length - 3).trim();
        }
        pairsData = JSON.parse(jsonString);
      } else {
        console.error('Unexpected LLM response structure:', llmData);
        throw new Error('Unexpected LLM response structure.');
      }
    } catch (parseError) {
      console.error('Error parsing LLM JSON response:', parseError);
      console.error('LLM raw response content:', llmData.choices && llmData.choices[0] ? llmData.choices[0].message.content : 'No content found');
      throw new Error('Failed to parse LLM response as JSON.');
    }

    return NextResponse.json({ success: true, pairs: pairsData });

  } catch (error: unknown) {
    console.error('Error in generatePairs API:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error generating pairs' },
      { status: 500 }
    );
  }
}
