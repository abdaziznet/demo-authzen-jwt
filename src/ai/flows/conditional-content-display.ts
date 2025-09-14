'use server';

/**
 * @fileOverview This flow dynamically displays content based on user roles or permissions.
 *
 * - conditionalContentDisplay - A function that handles the process of retrieving and displaying content based on authorization.
 * - ConditionalContentDisplayInput - The input type for the conditionalContentDisplay function.
 * - ConditionalContentDisplayOutput - The return type for the conditionalContentDisplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConditionalContentDisplayInputSchema = z.object({
  userRole: z.string().describe('The role of the user making the request.'),
  requestedContent: z.string().describe('The content that the user is requesting to view.'),
});
export type ConditionalContentDisplayInput = z.infer<typeof ConditionalContentDisplayInputSchema>;

const ConditionalContentDisplayOutputSchema = z.object({
  authorizedContent: z.string().describe('The content that the user is authorized to view, based on their role.'),
  isAuthorized: z.boolean().describe('Whether the user is authorized to view the requested content.'),
});
export type ConditionalContentDisplayOutput = z.infer<typeof ConditionalContentDisplayOutputSchema>;

export async function conditionalContentDisplay(input: ConditionalContentDisplayInput): Promise<ConditionalContentDisplayOutput> {
  return conditionalContentDisplayFlow(input);
}

const conditionalContentDisplayPrompt = ai.definePrompt({
  name: 'conditionalContentDisplayPrompt',
  input: {schema: ConditionalContentDisplayInputSchema},
  output: {schema: ConditionalContentDisplayOutputSchema},
  prompt: `You are an authorization expert. Given a user role and requested content, determine if the user is authorized to view the content.

  User Role: {{{userRole}}}
  Requested Content: {{{requestedContent}}}

  Respond with the content that the user is authorized to view, and whether the user is authorized in the isAuthorized field. If user is not authorized, authorizedContent should be empty. The content shown must be appropriate for the user role and the request, so be sensitive about what information can be displayed.`, 
});

const conditionalContentDisplayFlow = ai.defineFlow(
  {
    name: 'conditionalContentDisplayFlow',
    inputSchema: ConditionalContentDisplayInputSchema,
    outputSchema: ConditionalContentDisplayOutputSchema,
  },
  async input => {
    const {output} = await conditionalContentDisplayPrompt(input);
    return output!;
  }
);

