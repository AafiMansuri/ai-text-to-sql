import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        console.log("🚀 Webhook received!");

        const SIGNING_SECRET = process.env.NEXT_PUBLIC_WEBHOOK_SECRET;

        if (!SIGNING_SECRET) {
            console.error("❌ Error: Missing SIGNING_SECRET in environment variables.");
            return new Response("Error: Missing SIGNING_SECRET", { status: 500 });
        }

        const wh = new Webhook(SIGNING_SECRET);

        // Headers
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error("❌ Error: Missing Svix headers.");
            return new Response("Error: Missing Svix headers", { status: 400 });
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);

        console.log("📩 Received Payload:", body);

        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.error("❌ Error: Could not verify webhook:", err);
            return new Response("Error: Verification failed", { status: 400 });
        }

        console.log("✅ Webhook verified successfully!");

        const eventType = evt.type;
        console.log("🔔 Event Type:", eventType);

        if (eventType === "user.created") {
            try {
                const userData = evt.data;
                console.log("👤 New User Data:", userData);

                const userPublicMetadata = evt.data.public_metadata || {};
                const newUser = {
                    uid: userData.id,
                    email: userData.email_addresses?.[0]?.email_address || "",
                    first_name: userPublicMetadata.first_name || "",
                    last_name: userPublicMetadata.last_name || "",
                    role: userPublicMetadata.role || "User",
                };

                console.log("📨 Sending user data to backend:", newUser);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newUser),
                    }
                );

                if (!response.ok) {
                    const errorResponse = await response.text();
                    console.error("❌ Failed to create user in backend:", errorResponse);
                    return new Response("Error: Failed to create user in backend", { status: 500 });
                }

                console.log("✅ User successfully created in backend!");
                return new Response("User successfully created in backend", { status: 201 });
            } catch (error) {
                console.error("❌ Error processing user.created event:", error);
                return new Response("Error: Internal Server Error", { status: 500 });
            }
        } else {
            console.log("⚠️ Unhandled event type:", eventType);
            return new Response("Event ignored", { status: 200 });
        }
    } catch (error) {
        console.error("❌ Unexpected Server Error:", error);
        return new Response("Error: Internal Server Error", { status: 500 });
    }
}
