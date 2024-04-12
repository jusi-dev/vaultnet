import { addOrgIdToUser, createUser, deleteOrgIdFromUser, deleteUser, updateRoleInOrgForUser, updateUser } from "@/actions/aws/users";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const payload: WebhookEvent = await req.json();

    try {
        switch (payload.type) {
            case "user.created":
                await createUser(payload.data);
                break;
            case "user.updated":
                await updateUser(payload.data);
                break;
            case "organizationMembership.created":
                await addOrgIdToUser(payload.data);
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
        }
    } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}