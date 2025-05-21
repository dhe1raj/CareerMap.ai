
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import App from "../App";

export default function Root() {
  return (
    <>
      <App />
      <Toaster />
    </>
  );
}
