import Head from "next/head";
import React from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Health Vault - Secure Health Information Management</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Health Vault is a secure platform for storing and managing your personal health information. Easily track your medical history, appointments, and medications, and share your information with trusted healthcare professionals."
        />
        <meta
          name="keywords"
          content="health, vault, medical, information, management, personal, secure"
        />
        <meta name="author" content="Health Vault Team" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://www.healthvault.com/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
