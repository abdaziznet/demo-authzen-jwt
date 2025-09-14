'use server';

import { conditionalContentDisplay } from '@/ai/flows/conditional-content-display';

export async function getConditionalContent(input) {
  try {
    const output = await conditionalContentDisplay(input);
    return output;
  } catch (error) {
    console.error('Error in getConditionalContent server action:', error);
    // It's better to return a structured error than to throw
    // as throwing can expose server-side details to the client.
    return {
      isAuthorized: false,
      authorizedContent: 'An error occurred while processing your request.',
    };
  }
}
