// frontend/types/contacts.ts

export interface ContactPayload {
    body: string
    email: string
    name: string
    subject: string
}

/* -----------------------------
   api response
------------------------------*/

export interface ContactResponse {
    message: string
    message_key?: string
    retry_after?: number
}

/* -----------------------------
   contacts
------------------------------*/

export interface ContactPerson {
    address: string
    name: string
    phone: string
    role: string

    email: {
        user: string
        domain: string
    }
}
