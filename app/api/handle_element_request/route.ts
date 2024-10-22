import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { elementCode, userRequest } = await request.json();

    // Here, you would typically process the request and generate the updated code
    // For this example, we're just adding the new button as requested
    const updatedCode = `<div class="mt-8 flex justify-center gap-4" contenteditable="true">
        <a href="#products" class="inline-block px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Shop nowww</a>
        <a href="#philosophy" class="inline-block px-6 py-3 text-sm font-semibold text-green-600 bg-green-100 rounded-md hover:bg-green-200">Learn More</a>
        <a href="#contact" class="inline-block px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Talk to Us</a>
    </div>`;

    return NextResponse.json({
        message: "Request processed",
        updatedCode
    });
}
