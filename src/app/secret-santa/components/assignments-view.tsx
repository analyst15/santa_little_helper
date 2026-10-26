"use client";

import { useTransition } from "react";
import { Loader2, PartyPopper, RefreshCw, Send, ArrowRight, User } from "lucide-react";
import type { Participant, Assignment } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendEmailsAction } from "../actions";

type AssignmentsViewProps = {
  assignments: Assignment[];
  participants: Participant[];
  guidelines: string;
  onReset: () => void;
  onStartOver: () => void;
};

export default function AssignmentsView({
  assignments,
  participants,
  guidelines,
  onReset,
  onStartOver,
}: AssignmentsViewProps) {
  const [isSending, startSendingTransition] = useTransition();
  const { toast } = useToast();

  const handleSendEmails = () => {
    startSendingTransition(async () => {
      try {
        const result = await sendEmailsAction({
          assignments,
          participants,
          guidelines,
        });

        if (result.error) {
          console.error("Error from sendEmailsAction:", result.error);
          toast({
            variant: "destructive",
            title: "Email Error",
            description: result.error,
          });
        } else {
          toast({
            title: "Emails Sent!",
            description: "All participants have been notified (check console for simulation).",
          });
        }
      } catch (error) {
        console.error("Unexpected error in handleSendEmails:", error);
        toast({
          variant: "destructive",
          title: "Email Error",
          description: "An unexpected error occurred while sending emails.",
        });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
            <PartyPopper className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Assignments are Ready!</CardTitle>
          <CardDescription>
            Below are the Secret Santa pairings. You can now notify all participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment, index) => (
              <Card key={index} className="bg-background/50">
                <CardContent className="p-4 flex items-center justify-center space-x-4 text-lg">
                  <div className="flex items-center gap-2 font-medium">
                    <User className="h-5 w-5 text-primary" />
                    <span>{assignment.giver}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2 font-medium">
                    <User className="h-5 w-5 text-accent" />
                    <span>{assignment.recipient}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" onClick={onStartOver} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
        <Button
          size="lg"
          onClick={handleSendEmails}
          disabled={isSending}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send Notifications
        </Button>
      </div>
       <p className="text-center text-sm text-muted-foreground">
        Clicking 'Send Notifications' will simulate sending emails. Check your browser's developer console.
      </p>
    </div>
  );
}
