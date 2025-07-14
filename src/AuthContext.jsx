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

  // TODO: signup

  // TODO: authenticate

  const value = { location }; //this is where everything will be passed to
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//This is a hook. contect is React function on create context. If no context throw the error. Context is still foncusing to me.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
