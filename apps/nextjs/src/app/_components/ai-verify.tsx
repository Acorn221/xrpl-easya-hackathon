"use client";

import { use, useState } from "react";
import { CreatePostSchema } from "@sobrxrpl/db/schema";
import { Button } from "@sobrxrpl/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@sobrxrpl/ui/card";
import {
    useForm,
} from "@sobrxrpl/ui/form";
import { Textarea } from "@sobrxrpl/ui/textarea";


import { api } from "../../trpc/react";


import * as React from "react"


interface MessageType {
    content: string;
    role: string;
}



export function ChallengeCardWithForm({ profile, handleResult }: { profile: string, handleResult: (v: boolean) => void }) {
    const [messages, setMessages] = useState<MessageType[]>([
    ]);
    const [answer, setAnswer] = useState("");

    const createSecurityChallenge = api.verify.getSecurityMsg.useMutation({
        onSuccess: (val) => {
            console.log("Sucess")
            console.log(val)
            setMessages(
                [

                    { role: 'assistant', content: val },
                    ...messages
                ]
            )
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const answerSecurityChallenge = api.verify.submitAnswer.useMutation({
        onSuccess: (val) => {
            handleResult(val)

        },
        onError: (err) => {
            console.error(err);
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Verify</CardTitle>
                <CardDescription>Based on your profile collected on sign up an AI generated security question will need to be generated to verify your identity before completing the transaction.</CardDescription>
            </CardHeader>
            <CardContent>
                {createSecurityChallenge.isSuccess && createSecurityChallenge.data}
                <Textarea
                    placeholder="Tell us your answer...."
                    className="resize-none"
                    onChange={(e) => setAnswer(e.target.value)}
                />
                {/* {JSON.stringify(createSecurityChallenge)} */}

            </CardContent>
            <CardFooter className="flex justify-between">


                <Button variant="outline" onClick={() => {
                    setMessages(
                        [

                            { role: 'user', content: `${profile} Based on this statement ask a security question.` },
                            ...messages
                        ]
                    )
                    createSecurityChallenge.mutate({ profile: profile })
                }}>
                    Generate a security question
                </Button>

                <Button onClick={() => answerSecurityChallenge.mutate({ answer: answer, messages: messages })}>Submit</Button>
                {/* {JSON.stringify(answerSecurityChallenge)} */}
            </CardFooter>
        </Card>
    )
}

