import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext(); //this creates the context

//A JWI is a compact, URL-safe string that represtends a set of claims(peice of information)about the suer, signed by the server.
//three parts to a JWI, the header, the payload, and the signature
//header declares the signing algorithm
//payload is a JSON object that has info like the username, user ID, or whatever else is unique to the user
//Signature is produced by a server-known secret. I'm pretty sure that's stuff like my AI API key.
//because the server holds the secret, clients can't tamper with claims without invalidating the signature.
//this is why my AI API key had to hidden in the secure server!

export function AuthProvider({ children }) {
  const [token, setToken] = useState(); //token holds the JWT from the API
  //setLocation updates the string and it's matched up against the values in App.jsx to check what page you should be on.
  const [location, setLocation] = useState("GATE"); //location controls which screen to show. Does GATE mean entrance? Answer: Yes. For some reason in App.jsx GATE is assigned to entrance. This is a string entry.

  //making async function that takes username since the demo only used username
  async function signup(username) {
    //this calls the signup end point passing JSON headers and body along with it
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: "password" }), //aparently a fake password is needed to make this work even though we never use it from what i can tell from the demo
    });

    //converts the response into a JS object
    const data = await res.json();

    //if there is a failure in fetching the API there will be an error thrown. Somewhere else the error will be caught
    if (!data.success) {
      throw new Error(data.message);
    }

    //on success the JWT is stored and the UI is changed to "TABLET"
    setToken(data.token);
    setLocation("TABLET");
  }

  //asyn is needed because it needs to await the network call. There are no parameters because JWT is stores in token.
  //because token is defined inside the same function scope as authenticate(), Javascript will automatically give it access. This is called a closure. authenticate will close over the token variable automatically.
  async function authenticate() {
    //verify that a token is recieved
    //cheks the token state frfom useState at the top
    //this is needed because someone could call authenticate() before signing up and this will catch it before it sends bad data to the api
    //this throw will go up to whatever component called authenticate so it will show this error
    if (!token) {
      throw new Error("No token");
    }
    //obvi the API/authenticate takes us to the link with the autheticate section
    //according to the API documentation we use GET
    const res = await fetch(`${API}/authenticate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    //res.json returns a promise so it needs to await for it.
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }
    //update location state frfom "TABLET" to "TUNNEL"
    //in App.jsx this causes React to rerender and display <Tunnel /> instead of <Tablet />
    setLocation("TUNNEL");
  }

  //the value object is the only thing the children can see when they do useContext(AuthContext) or useAuth
  //anything i want the child components to be able to read or call MUST live in the this value object

  const value = { location, signup, authenticate }; //this is where everything will be passed to
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//This is a hook. contect is React function on create context. If no context throw the error. Context is still foncusing to me.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}

//in React Context exposing something means making it available to any component that consumes the context.
//AuthContext is where the authentication logic lives: State (token, location) and functions that chaange the state (signup and authenticate)
