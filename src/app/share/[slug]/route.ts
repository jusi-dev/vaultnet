import { NextResponse } from "next/server";
import { getLink, setLink } from "./aws-actions";
import { getShareLink, setShareLink } from "@/actions/aws/files";

function randomIdGenerator () {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 20) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export const POST = async (req : Request, res : NextResponse) => {
    const formData = await req.formData();

    const targetLink = formData.get('targetLink');

    const shareLinkId = randomIdGenerator();

    try {
        await setShareLink(shareLinkId, targetLink as string);

        return new Response(JSON.stringify({
            shareUrl: `${process.env.PAGE_URL}/share/${shareLinkId}`
        }), { status: 200 });
    } catch (uploadError) {
      return new Response('Failed to generate link', { status: 500 });
    };
};

export const GET = async (_ : any, {params} : any) => {
    let result;

    try {
        const {targetLink} = await getShareLink(params.slug);
        result = targetLink;
    } catch (error) {
        console.error("Error querying the database:", error);
        return new Response(`<h1>/${params.slug} is not in our record</h1>`, {
            status: 400,
            headers: {
              'content-type': 'text/html',
            },
        });
    }

    if (!result) {
        return new Response(`<h1>/${params.slug} is not in our record</h1>`, {
            status: 400,
            headers: {
              'content-type': 'text/html',
            },
        });
    }
    return NextResponse.redirect(result, 302);
};
