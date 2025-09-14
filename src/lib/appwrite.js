'use client';

import { Client, Account, ID } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Appwrite endpoint or project ID is not defined in environment variables.");
}

client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export { ID };
