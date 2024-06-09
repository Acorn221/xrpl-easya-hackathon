"use client";

import { use, useState } from "react";
import * as React from "react";

import type { RouterOutputs } from "@sobrxrpl/api";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@sobrxrpl/ui/form";
import { Textarea } from "@sobrxrpl/ui/textarea";
import { toast } from "@sobrxrpl/ui/toast";

import { api } from "../../trpc/react";

interface MessageType {
  content: string;
  role: string;
}

export function ChallengeCardWithForm() {
  const profile =
    "My favourite author is Malorie Blackman and my favourite book is Boys don't cry from Malorie Blackman. My hobbies include dodgeball, karate and climbing which I try to do on a weekly basis. I study computer science which I enjoy.";
  // messages: [{ role: 'user', content: `"My favourite author is Malorie Blackman and my favourite book is Boys don't cry from Malorie Blackman. My hobbies include dodgeball, karate and climbing which I try to do on a weekly basis. I study computer science which I enjoy." Based on this statement ask a security question.` },
  //     { role: 'assistant', content: `What is the title of your favorite book by Malorie Blackman?` },
  //     { role: 'user', content: `Boys don't cry. Is this correct yes or no?` }
  const [messages, setMessages] = useState<MessageType[]>([]);

  const form = useForm({
    schema: CreatePostSchema,
    defaultValues: {
      response: "",
    },
  });
  const createSecurityChallenge = api.verify.getSecurityMsg.useMutation({
    onSuccess: (val) => {
      console.log("Sucess");
      console.log(val);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const answerSecurityChallenge = api.verify.submitAnswer.useMutation({
    onSuccess: (val) => {
      console.log("Sucess");
      console.log(val);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>
          Based on your profile collected on sign up an AI generated security
          question will need to be generated to verify your identity before
          completing the transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {JSON.stringify(createSecurityChallenge)}
        {createSecurityChallenge.isSuccess && createSecurityChallenge.data}
        {createSecurityChallenge.isSuccess && (
          <Form {...form}>
            <form
              className="flex w-full max-w-2xl flex-col gap-4"
              onSubmit={form.handleSubmit((data) => {
                console.log(data);
                console.log("Hello");
              })}
            >
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us your answer...."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Hello</Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit">Hello</Button>

        {/*<Button variant="outline" onClick={() =>{*/}
        {/*    setMessages(*/}
        {/*        [*/}
        {/*            ...messages,*/}
        {/*            { role: 'user', content: `${profile} .Based on this statement ask a security question.` }*/}
        {/*        ]*/}
        {/*    )*/}
        {/*    createSecurityChallenge.mutate({ profile: profile })}}>*/}
        {/*    Generate a security question*/}
        {/*</Button>*/}
        {/*{createSecurityChallenge.isSuccess && <Button onClick={()=>answerSecurityChallenge()}>Submit</Button>}*/}
        {/*<Button onClick={() => answerSecurityChallenge.mutate()}>Submit</Button>*/}
        {/*{JSON.stringify(answerSecurityChallenge)}*/}
      </CardFooter>
    </Card>
  );
}

// "My favourite author is Malorie Blackman and my favourite book is Boys don't cry from Malorie Blackman. My hobbies include dodgeball, karate and climbing which I try to do on a weekly basis. I study computer science which I enjoy." Based on this statement ask a security question.
