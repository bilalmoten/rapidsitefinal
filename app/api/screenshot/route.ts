import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request): Promise<Response> {
  let browser: puppeteer.Browser | null = null;

  try {
    // Step 1: Validate Request Inputs
    const { websiteId, subdomain }: { websiteId: string; subdomain: string } = await req.json();
    console.log("Request Inputs:", { websiteId, subdomain });

    if (!websiteId || !subdomain) {
      throw new Error("Invalid websiteId or subdomain");
    }

    // Step 2: Launch Puppeteer Browser
    console.log("Launching Puppeteer browser...");
    if (isProd) {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
        executablePath:
          process.platform === 'darwin'
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : process.platform === 'win32'
              ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
              : '/usr/bin/google-chrome',
      });
    }
    console.log("Puppeteer browser launched successfully.");

    // Step 3: Open Page and Navigate to URL
    const page = await browser.newPage();
    const url = `https://${subdomain}.rapidai.website`;
    console.log("Navigating to URL:", url);

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    } catch (err) {
      console.error("Failed to navigate to URL:", url, (err as Error).message);
      throw new Error(`Unable to access ${url}`);
    }
    console.log("Page navigation successful.");

    // Step 4: Generate Screenshot
    console.log("Generating screenshot...");
    const screenshot = (await page.screenshot({
      type: 'jpeg',
      quality: 80,
    })) as Buffer;

    if (!screenshot || !(screenshot instanceof Buffer)) {
      console.error("Failed to generate screenshot buffer for:", { websiteId, subdomain });
      throw new Error("Failed to generate screenshot buffer");
    }
    console.log("Screenshot generated successfully for:", websiteId);

    // Step 5: Upload Screenshot to Supabase
    console.log("Uploading screenshot to Supabase...");
    const { error: uploadError } = await supabase.storage
      .from('website-thumbnails')
      .upload(`${websiteId}/thumbnail.jpg`, screenshot, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload screenshot for:", websiteId, uploadError.message);
      throw new Error("Screenshot upload failed");
    }
    console.log("Screenshot uploaded successfully for:", websiteId);

    // Step 6: Generate Public URL
    const { data } = supabase.storage
      .from('website-thumbnails')
      .getPublicUrl(`${websiteId}/thumbnail.jpg`);

    if (!data || !data.publicUrl) {
      console.error("Failed to retrieve public URL for:", websiteId);
      throw new Error("Failed to retrieve public URL");
    }

    const publicUrl = data.publicUrl;
    console.log("Public URL for screenshot:", publicUrl);

    // Step 7: Update Database with Public URL
    const { error: updateError } = await supabase
      .from('websites')
      .update({ thumbnail_url: publicUrl })
      .eq('id', websiteId);

    if (updateError) {
      console.error("Failed to update database for:", websiteId, updateError.message);
      throw new Error("Database update failed");
    }
    console.log("Database updated successfully for:", websiteId);

    // Step 8: Return Success Response
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    // Enhanced Error Logging
    console.error("Screenshot generation failed:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to generate screenshot", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close().catch((err) => console.error("Failed to close browser:", err.message));
    }
  }
}
