"use client";
import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecule/text-field";
import { signIn } from "next-auth/react";
import { fetcher } from "@/lib/fetcher";

type SignupInput = {
  password: string;
  cPassword: string;
};

type State = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export function SignupForm() {
  const [inputs, setInputs] = useState<SignupInput>({
    password: "",
    cPassword: "",
  });

  const [state, setState] = useState<State>("IDLE");

  const [errors, setError] = useState<{
    name?: string;
    email?: string;
    password?: string;
    cPassword?: string;
  }>({});

  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (inputs.password !== inputs.cPassword) {
      setError({
        ...errors,
        cPassword: "Password and confirm password should be same",
      });
      return;
    }
    setError({
      email: "",
      password: "",
      cPassword: "",
      name: "",
    });

    setState("LOADING");
    const name = e.target.name.value;
    const email = e.target.email.value;
    const { password } = inputs;
    try {
      const response = await fetcher("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: "/",
      });
      setState("SUCCESS");
    } catch (error: any) {
      setState("ERROR");
      setError({
        ...errors,
        email: error?.message,
      });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <form
      className="flex flex-col items-center place-content-center h-full  rounded-md py-10"
      onSubmit={handleSignup}>
      <div className="flex flex-col items-center font-normal py-12">
        <h3 className="text-3xl font-bold ">Welcome back</h3>
        <Label>
          We are <strong className="theme-text-primary">happy</strong> to have
          you
        </Label>
      </div>

      <TextField
        label="Fullname"
        name="name"
        required={true}
        onChange={handleChange}
        autoComplete="name"
        error={errors.name}
        type="text"
        wrapperClassName="w-9/12"
        maxLength={30}
      />
      <TextField
        label="Email"
        name="email"
        required={true}
        onChange={handleChange}
        autoComplete="email"
        error={errors.email}
        type="email"
        wrapperClassName="w-9/12"
      />
      <TextField
        label="Password"
        name="password"
        required={true}
        onChange={handleChange}
        value={inputs.password}
        error={errors.password}
        type="password"
        minLength={6}
        wrapperClassName="w-9/12"
      />

      <TextField
        label="Confirm Password"
        name="cPassword"
        onChange={handleChange}
        required={true}
        value={inputs.cPassword}
        error={errors.cPassword}
        type="password"
        minLength={6}
        pattern={inputs.password}
        wrapperClassName="w-9/12"
      />
      <Button disabled={state === "LOADING"} className=" w-9/12">
        {state === "LOADING" ? (
          <div className="flex h-8 items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : (
          "Sign up"
        )}
      </Button>
      <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
        <span className="border-t theme-border flex-1" />
        <span className="px-4 text-sm hover:underline cursor-pointer">
          <Link href="login">DO YOU HAVE AN ACCOUNT?</Link>
        </span>
        <span className="border-t theme-border flex-1" />
      </div>
    </form>
  );
}
