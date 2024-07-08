import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = createClient();
    const data = await request.formData();
    const file = data.get("file") as File;
    const website_id = data.get("website_id") as string;
    const user_id = data.get("user_id") as string;

    if (!file) {
        return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const { data: uploadData, error } = await supabase.storage.from('user_website_images').upload(`${user_id}/${website_id}/${uniqueFilename}`, file);

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }

    const imageUrl =
        // URL.createObjectURL(file);
        uploadData?.path ? `https://lervpgatcoelsswuahga.supabase.co/storage/v1/object/public/user_website_images/${uploadData.path}` : '';

    return NextResponse.json({ imageUrl });

}