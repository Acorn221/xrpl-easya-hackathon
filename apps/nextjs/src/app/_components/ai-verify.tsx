"use client";

import { use, useState } from "react";

import type { RouterOutputs } from "@acme/api";
import { CreatePostSchema } from "@acme/db/schema";
import { Button } from "@sobrxrpl/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    useForm,
} from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { api } from "../../trpc/react";
import {
    Textarea
} from "@sobrxrpl/ui/textarea"


import * as React from "react"


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@sobrxrpl/ui/card"
interface MessageType {
    content: string;
    role: string;
}



export function ChallengeCardWithForm() {
    const profile = "My favourite author is Malorie Blackman and my favourite book is Boys don't cry from Malorie Blackman."
    const [messages, setMessages] = useState<MessageType[]>([
    ]);
    const [answer, setAnswer] = useState("");

    const form = useForm({
        schema: CreatePostSchema,
        defaultValues: {
            response: "",
        },
    });
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
                <Textarea
                    placeholder="Tell us your answer...."
                    className="resize-none"
                    onChange={(e) => setAnswer(e.target.value)}
                />
                {/*{JSON.stringify(createSecurityChallenge)}*/}
                {createSecurityChallenge.isSuccess && createSecurityChallenge.data}
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
                {/*{JSON.stringify(answerSecurityChallenge)}*/}
            </CardFooter>
        </Card>
    )
}



