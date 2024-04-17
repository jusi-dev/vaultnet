import { deleteFilePermanently, getFilesToDelete } from "@/actions/aws/files";
import { client } from "@/trigger";
import { Job, cronTrigger } from "@trigger.dev/sdk";

client.defineJob({
    id: "delete-marked-files",
    name: "Delete marked files",
    version: "0.0.1",
    trigger: cronTrigger({
        cron: "0 0 * * *",
    }),

    run: async (payload, io, ctx) => {
        const todaysDate = new Date();

        const files = await getFilesToDelete();
        files?.map(async file => {
            // Check if file.deleteDate is 7 days before todaysDate
            const daysDifference = await io.runTask("calculate-days-difference", async () => {
                const timeDifference = todaysDate.getTime() - file.deleteDate
                console.log(timeDifference)
                return timeDifference / (1000 * 3600 * 24);
            })
            if (daysDifference >= 20) {
                // Delete file permanently
                await io.runTask("delete-file-permanently", async () => {
                    deleteFilePermanently(file.fileId, process.env.TRIGGER_API_KEY || '');
                });
            }
            return true;
        })

        await io.logger.info("Marked files deleted successfully")
    },
})