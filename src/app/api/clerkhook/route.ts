import { addOrgIdToUser, createEncryptionKeyForOrg, createUser, deleteOrgIdFromUser, deleteUser, updateRoleInOrgForUser, updateUser } from "@/actions/aws/users";
import { sendSlackMessage } from "@/actions/slack";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const payload: WebhookEvent = await req.json();

    console.log("This is the payload: ", payload)

    try {
        switch (payload.type) {
            case "user.created":
                await createUser(payload.data);
                sendSlackMessage(`New user: ${payload.data.email_addresses[0].email_address}, ${payload.data.first_name} ${payload.data.last_name}`);
                break;
            case "user.updated":
                await updateUser(payload.data);
                break;
            case "organizationMembership.created":
                await addOrgIdToUser(payload.data);
                await createEncryptionKeyForOrg(payload.data);
                break;
            case "organizationMembership.updated":
                await updateRoleInOrgForUser(payload.data);
                break;
            case "organizationMembership.deleted":
                await deleteOrgIdFromUser(payload.data);
                break;
            case "user.deleted":
                await deleteUser(payload.data);
                break;
            // case "organization.created":
            //     console.log("This is the data: ", payload.data)
            //     break;
        }
    } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}