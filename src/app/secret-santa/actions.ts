"use server";

import { z } from "zod";
import {
  assignSecretSanta,
  type AssignSecretSantaInput,
  type AssignSecretSantaOutput,
} from "@/ai/flows/automated-matching";
import type { Participant } from "./types";

const getAssignmentsSchema = z.object({
  participants: z
    .array(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .min(2, "At least two participants are required."),
});

export async function getAssignmentsAction(
  input: AssignSecretSantaInput
): Promise<{ data: AssignSecretSantaOutput | null; error: string | null }> {
  const validatedInput = getAssignmentsSchema.safeParse(input);

  if (!validatedInput.success) {
    console.error("Validation error in getAssignmentsAction:", validatedInput.error);
    return { data: null, error: validatedInput.error.flatten().fieldErrors.participants?.[0] || 'Invalid input.' };
  }

  try {
    const assignments = await assignSecretSanta(validatedInput.data);
    if (!assignments || assignments.length === 0) {
      console.error("Failed to generate assignments: empty result returned from assignSecretSanta");
      return { data: null, error: "Failed to generate assignments. The AI might be having a moment. Please try again." };
    }
    return { data: assignments, error: null };
  } catch (error) {
    console.error("Error getting assignments:", error);
    return { data: null, error: "An unexpected error occurred while generating assignments." };
  }
}

const sendEmailsSchema = z.object({
  assignments: z.array(z.object({ giver: z.string(), recipient: z.string() })),
  participants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      wishlistUrl: z.string().url().optional().or(z.literal('')),
    })
  ),
  guidelines: z.string().optional(),
});


export async function sendEmailsAction(data: {
  assignments: AssignSecretSantaOutput;
  participants: Participant[];
  guidelines: string;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const validatedData = sendEmailsSchema.safeParse(data);
    if (!validatedData.success) {
      console.error("Validation error in sendEmailsAction:", validatedData.error);
      return { success: false, error: 'Invalid data provided for sending emails.' };
    }

    const { assignments, participants, guidelines } = validatedData.data;

    const participantMap = new Map(participants.map((p) => [p.name, p]));

    console.log("--- SIMULATING EMAIL DELIVERY ---");
    for (const assignment of assignments) {
      const giver = participantMap.get(assignment.giver);
      const recipient = participantMap.get(assignment.recipient);

      if (giver && recipient) {
        console.log(`\nTo: ${giver.email}`);
        console.log(`Subject: 🤫 Your Secret Santa Assignment!`);
        console.log(`-------------------------------------------`);
        console.log(`Hi ${giver.name},`);
        console.log(`\nThe moment has come! You are the Secret Santa for...`);
        console.log(`\n** ${recipient.name} **\n`);
        if (recipient.wishlistUrl) {
          console.log(`They have a wishlist which might give you some ideas: ${recipient.wishlistUrl}`);
        }
        if (guidelines) {
          console.log(`\nRemember the group's gift guidelines:`);
          console.log(`"${guidelines}"`);
        }
        console.log(`\nHappy Gifting!`);
        console.log(`-------------------------------------------`);
      } else {
        console.error(`Could not find giver or recipient for assignment:`, assignment);
      }
    }
    console.log("\n--- SIMULATION COMPLETE ---");

    // In a real app, you would use an email service like SendGrid, Resend, or Nodemailer.
    // This is just a simulation.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in sendEmailsAction:", error);
    return { success: false, error: "An unexpected error occurred while sending emails." };
  }
}
