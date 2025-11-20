import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const filename = formData.get('filename') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!filename) {
            return NextResponse.json(
                { error: 'No filename provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are allowed' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the path to save the file
        const publicDir = join(process.cwd(), 'public', 'resumes');
        const filePath = join(publicDir, filename);

        // Ensure the directory exists
        await mkdir(publicDir, { recursive: true });

        // Write the file
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            url: `/resumes/${filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
