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

export async function POST(req: Request) {
    let browser;
    try {
        const { websiteId, subdomain } = await req.json();

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
                executablePath: process.platform === 'darwin'
                    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                    : process.platform === 'win32'
                        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                        : '/usr/bin/google-chrome'
            });
        }

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 1,
        });

        const url = `https://${subdomain}.aiwebsitebuilder.tech`;
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 15000,
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: 80,
        }) as Buffer;

        if (!screenshot || !(screenshot instanceof Buffer)) {
            throw new Error('Failed to generate screenshot buffer');
        }

        const { error: uploadError } = await supabase.storage
            .from('website-thumbnails')
            .upload(`${websiteId}/thumbnail.jpg`, screenshot, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('website-thumbnails')
            .getPublicUrl(`${websiteId}/thumbnail.jpg`);

        const { error: updateError } = await supabase
            .from('websites')
            .update({ thumbnail_url: publicUrl })
            .eq('id', websiteId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error('Screenshot error:', error);
        return NextResponse.json(
            { error: 'Failed to generate screenshot' },
            { status: 500 }
        );
    } finally {
        if (browser) {
            await browser.close().catch(console.error);
        }
    }
} 