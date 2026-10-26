"use client";

import { useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Participant, Assignment } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentsAction } from "../actions";
import ParticipantManager from "./participant-manager";

type SetupViewProps = {
  participants: Participant[];
  guidelines: string;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  setGuidelines: (guidelines: string) => void;
  setAssignments: (assignments: Assignment[]) => void;
};

export default function SetupView({
  participants,
  guidelines,
  addParticipant,
  removeParticipant,
  setGuidelines,
  setAssignments,
}: SetupViewProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetAssignments = () => {
    startTransition(async () => {
      try {
        const result = await getAssignmentsAction({
          participants: participants.map(({ name, email }) => ({ name, email })),
        });

        if (result.error) {
          console.error("Error from getAssignmentsAction:", result.error);
          toast({
            variant: "destructive",
            title: "Oops! Something went wrong.",
            description: result.error,
          });
        } else if (result.data) {
          toast({
            title: "Success!",
            description: "Secret Santas have been assigned.",
          });
          setAssignments(result.data);
        }
      } catch (error) {
        console.error("Unexpected error in handleGetAssignments:", error);
        toast({
          variant: "destructive",
          title: "Oops! Something went wrong.",
          description: "An unexpected error occurred while assigning Secret Santas.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ParticipantManager
          participants={participants}
          addParticipant={addParticipant}
          removeParticipant={removeParticipant}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gift Guidelines (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="guidelines" className="sr-only">Gift Guidelines</Label>
          <Textarea
            id="guidelines"
            placeholder="e.g., spending limit of $20, handmade gifts only..."
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            className="bg-card"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={participants.length < 2 || isPending}
          onClick={handleGetAssignments}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          Assign Secret Santas
        </Button>
      </div>
    </div>
  );
}
