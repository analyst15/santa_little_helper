"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Trash2, User, Mail, Link as LinkIcon, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Participant } from "../types";

type ParticipantManagerProps = {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
};

export default function ParticipantManager({
  participants,
  addParticipant,
  removeParticipant,
}: ParticipantManagerProps) {
  const participantSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").refine(
        (name) => !participants.some((p) => p.name.toLowerCase() === name.toLowerCase()),
        "This name is already in the list."
    ),
    email: z.string().email("Please enter a valid email.").refine(
        (email) => !participants.some((p) => p.email.toLowerCase() === email.toLowerCase()),
        "This email is already in the list."
    ),
    wishlistUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  });
  
  type ParticipantFormValues = z.infer<typeof participantSchema>;

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: { name: "", email: "", wishlistUrl: "" },
  });

  function onSubmit(data: ParticipantFormValues) {
    try {
      addParticipant({ ...data, id: crypto.randomUUID() });
      form.reset();
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users /> Participants</CardTitle>
        <CardDescription>Add everyone who will be part of the gift exchange.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Santa Claus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="santa@northpole.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="wishlistUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wishlist URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/wishlist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Add Participant
            </Button>
          </form>
        </Form>
        <div className="flex-grow flex flex-col mt-4">
          {participants.length > 0 ? (
            <ScrollArea className="h-64 pr-4">
              <ul className="space-y-2">
                {participants.map((p) => (
                  <li key={p.id}>
                    <Card className="bg-card/50">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex flex-col space-y-1 overflow-hidden">
                           <div className="flex items-center gap-2 text-sm font-medium truncate"><User className="h-4 w-4 shrink-0"/> {p.name}</div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground truncate"><Mail className="h-4 w-4 shrink-0"/> {p.email}</div>
                           {p.wishlistUrl && <div className="flex items-center gap-2 text-xs text-blue-500 truncate"><LinkIcon className="h-4 w-4 shrink-0"/> <a href={p.wishlistUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.wishlistUrl}</a></div>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeParticipant(p.id)}
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/50 rounded-lg p-4">
              <Users className="h-8 w-8 mb-2"/>
              <p>No participants added yet.</p>
              <p className="text-xs">Use the form above to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
