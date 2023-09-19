"use client";

import { useState, ChangeEvent, MouseEventHandler } from "react";
import { UserType } from "@/models/user";
import useLocalStorage from "@/utils/useLocalStorage";
import {
  InputForm,
  ButtonWrapper,
  LoginWrapper,
  RegisterWrapper,
  LoginLayout,
  RegisterLayout,
} from "../../styles/pageStyles/authpage.styles";
import { TextButton, FilledButton } from "@/components/buttons";
import { ShortInput, InputLabel } from "@/components/inputs";
import { Logo } from "@/components/logo/logo";
import AnimatedBackground from "@/components/animatedBackground";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Error } from "@/styles/pageStyles/guides.styles";
import Spinner from "@/components/spinner";

type CredentailsData = {
  email: string;
  password: string;
  repeatPassword?: string;
  name?: string;
  background?: string;
  careerGoals?: string;
  interests?: string;
  favoriteArtists?: string;
};

const authPage = () => {
  const [authSwitch, setAuthSwitch] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useLocalStorage<CredentailsData>(
    "credentails",
    { email: "", password: "" }
  );

  const router = useRouter();

  const handleAuthSwitch: MouseEventHandler<HTMLAnchorElement> = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAuthSwitch(!authSwitch);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const login = async ({ email, password }: CredentailsData) => {
    const user = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const x = await user.json();
    console.log("login success", x);
    if (x.message === "logged in") {
      router.push("/guides");
      router.refresh();
      return;
    }
    if (x.message) {
      console.log(x.message);
      setError(x.message);
      return;
    } else {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };
  async function createUser({
    email,
    password,
    name,
    background,
    careerGoals,
    interests,
    favoriteArtists,
  }: CredentailsData) {
    const user: UserType = {
      email,
      password,
      name: name || "",
      background: background || "",
      careerGoals: careerGoals || "",
      interests: interests || "",
      favoriteArtists: favoriteArtists || "",
      createdAt: new Date(),
      role: "student",
      avatarUrl: "",
    };
    const res = await fetch("api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const x = await res.json();
    console.log("this is x", x);
    if (x.message === "User created successfully") {
      login({ email, password });
    }
    if (x.message) {
      console.log(x.message);
      setError(x.message);
    } else {
      setError("Something went wrong");
    }
  }

  const submit: MouseEventHandler<HTMLButtonElement> = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!credentials.email || !credentials.password) {
      setError("Please fill out all fields");
      return;
    }
    if (!authSwitch && credentials.password !== credentials.repeatPassword)
      return;
    e.preventDefault();
    setIsLoading(true);
    authSwitch ? login(credentials) : createUser(credentials);
  };

  return (
    <>
      <AnimatedBackground />
        <AnimatePresence>
          {authSwitch ? (
            //login
            <LoginLayout>
            <LoginWrapper
              layout
              initial={{ opacity: 0, y: 500 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Logo>{"{ Vefskolinn }"}</Logo>
              <Error>{error}</Error>
              <InputForm>
                <InputLabel>Email</InputLabel>
                <ShortInput
                  type="text"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                />
                <InputLabel>Password</InputLabel>
                <ShortInput
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
                <ButtonWrapper>
                  <TextButton onClick={handleAuthSwitch}>
                    {authSwitch
                      ? "Create Account"
                      : "I already have an account"}
                  </TextButton>
                  <FilledButton onClick={submit}>
                    {" "}
                    {authSwitch ? "LOGIN" : "REGISTER"}{" "}
                  </FilledButton>
                </ButtonWrapper>
              </InputForm>
            </LoginWrapper>
            </LoginLayout>
          ) : (
            //register
            <RegisterLayout>
            <RegisterWrapper
              layout
              initial={{ opacity: 0, y: 500 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Logo>{"{ Vefskolinn }"}</Logo>
              <Error>{error}</Error>
              <InputForm>
                {/* Credentials  */}
                <InputLabel>Name</InputLabel>
                <ShortInput
                  required
                  type="name"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                />
                <InputLabel>Email</InputLabel>
                <ShortInput
                  required
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                />
                <InputLabel>Password</InputLabel>
                <ShortInput
                  required
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
                <InputLabel>Repeat Password</InputLabel>
                <ShortInput
                  required
                  type="password"
                  name="repeatPassword"
                  value={credentials.repeatPassword}
                  onChange={handleInputChange}
                />

                {/* About you  */}
                <InputLabel>
                 What is your background
                </InputLabel>
                <ShortInput
                  type="text"
                  name="background"
                  value={credentials.background}
                  onChange={handleInputChange}
                />
                <InputLabel>Near future career goals</InputLabel>
                <ShortInput
                  type="text"
                  name="careerGoals"
                  value={credentials.careerGoals}
                  onChange={handleInputChange}
                />
                <InputLabel>Main interests</InputLabel>
                <ShortInput
                  type="text"
                  name="interests"
                  value={credentials.interests}
                  onChange={handleInputChange}
                />
                <InputLabel>Favourite band/s or artist/s</InputLabel>
                <ShortInput
                  type="text"
                  name="favouriteBands"
                  value={credentials.favoriteArtists}
                  onChange={handleInputChange}
                />
                <ButtonWrapper>
                  <TextButton onClick={handleAuthSwitch}>
                    {authSwitch
                      ? "Create Account"
                      : "I already have an account"}
                  </TextButton>
                  {isLoading?<Spinner></Spinner>:<FilledButton onClick={submit}>
                    {" "}
                    {authSwitch ? "LOGIN" : "REGISTER"}{" "}
                  </FilledButton>}
                </ButtonWrapper>
              </InputForm>
            </RegisterWrapper>
            </RegisterLayout>
          )}
        </AnimatePresence>
    </>
  );
};

export default authPage;
