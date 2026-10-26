// src/ai/flows/automated-matching.ts
'use server';
/**
 * @fileOverview A flow for automatically assigning Secret Santa recipients.
 *
 * - assignSecretSanta - A function that handles the assignment process.
 * - AssignSecretSantaInput - The input type for the assignSecretSanta function.
 * - AssignSecretSantaOutput - The return type for the assignSecretSanta function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignSecretSantaInputSchema = z.object({
  participants: z.array(
    z.object({
      name: z.string().describe('The name of the participant.'),
      email: z.string().email().describe('The email address of the participant.'),
    })
  ).describe('A list of participants in the Secret Santa draw.'),
});
export type AssignSecretSantaInput = z.infer<typeof AssignSecretSantaInputSchema>;

const AssignSecretSantaOutputSchema = z.array(
  z.object({
    giver: z.string().describe('The name of the gift giver.'),
    recipient: z.string().describe('The name of the gift recipient.'),
  })
).describe('A list of Secret Santa assignments.');
export type AssignSecretSantaOutput = z.infer<typeof AssignSecretSantaOutputSchema>;

/**
 * Validates that an assignment list is a valid bijection where:
 * 1. Number of assignments equals number of participants
 * 2. Every participant is a giver exactly once
 * 3. Every participant is a recipient exactly once
 * 4. No participant gives to themselves
 */
function isValidAssignment(
  assignments: AssignSecretSantaOutput | null | undefined,
  participants: { name: string }[]
): boolean {
  if (!assignments || !Array.isArray(assignments)) return false;
  if (assignments.length !== participants.length) return false;

  const giverSet = new Set<string>();
  const recipientSet = new Set<string>();
  const participantNames = new Set(participants.map((p) => p.name));

  for (const { giver, recipient } of assignments) {
    if (!giver || !recipient) return false;
    if (giver === recipient) return false;
    if (!participantNames.has(giver) || !participantNames.has(recipient)) return false;
    giverSet.add(giver);
    recipientSet.add(recipient);
  }

  return giverSet.size === participants.length && recipientSet.size === participants.length;
}

/**
 * Generates a valid Secret Santa derangement:
 * Shuffles participants and forms a single Hamiltonian cycle (Pi -> P(i+1)%n),
 * strictly guaranteeing that no one receives themselves and everyone participates.
 */
function generateAlgorithmicAssignments(
  participants: { name: string; email: string }[]
): AssignSecretSantaOutput {
  if (participants.length < 2) {
    throw new Error('At least 2 participants are required for Secret Santa.');
  }

  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const assignments: AssignSecretSantaOutput = [];
  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i].name;
    const recipient = shuffled[(i + 1) % shuffled.length].name;
    assignments.push({ giver, recipient });
  }

  return assignments;
}

export async function assignSecretSanta(input: AssignSecretSantaInput): Promise<AssignSecretSantaOutput> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const aiResult = await assignSecretSantaFlow(input);
      if (isValidAssignment(aiResult, input.participants)) {
        return aiResult;
      }
    } catch {
      // Fall through to algorithmic matching if AI fails or key is invalid
    }
  }

  return generateAlgorithmicAssignments(input.participants);
}

const assignSecretSantaPrompt = ai.definePrompt({
  name: 'assignSecretSantaPrompt',
  input: {schema: AssignSecretSantaInputSchema},
  output: {schema: AssignSecretSantaOutputSchema},
  prompt: `You are a Secret Santa assignment expert. Given a list of participants, you will generate a valid list of Secret Santa assignments.

Participants:
{{#each participants}}
- Name: {{this.name}}, Email: {{this.email}}
{{/each}}

Output a JSON array where each object has a giver and recipient. Ensure that no one is giving a gift to themselves.
Do not explain the assignments, just output a valid JSON array.
`,
});

const assignSecretSantaFlow = ai.defineFlow(
  {
    name: 'assignSecretSantaFlow',
    inputSchema: AssignSecretSantaInputSchema,
    outputSchema: AssignSecretSantaOutputSchema,
  },
  async input => {
    const {output} = await assignSecretSantaPrompt(input);
    return output!;
  }
);
