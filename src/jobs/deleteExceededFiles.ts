import { deleteFilePermanently, freeUpSpaceWhenExceeded, getFilesToDelete } from "@/actions/aws/files";
import { getAllUsers, getExceededStorageUsers } from "@/actions/aws/users";
import { client } from "@/trigger";
import { Job, cronTrigger } from "@trigger.dev/sdk";

client.defineJob({
    id: "delete-exceeded-files",
    name: "Delete exceeded files",
    version: "0.0.1",
    trigger: cronTrigger({
        cron: "0 0 * * *",
    }),

    run: async (payload, io, ctx) => {

        const storageUsers = await getExceededStorageUsers()

        await io.runTask("deleteExceededFiles", async () => {
            for (const user of storageUsers) {
                console.log("Deleting files of user: ", user.userid)
                await freeUpSpaceWhenExceeded(user.userid.S, process.env.TRIGGER_API_KEY || '')
            }
        })

        await io.logger.info("Marked files deleted successfully")
    },
})