import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary as raw file
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'resumes',
                    resource_type: 'raw',
                    public_id: title || file.name.replace(/\.[^/.]+$/, ''),
                    type: 'upload',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        const uploadResult = result as any;

        // Create a direct download URL with proper headers
        const downloadUrl = cloudinary.url(uploadResult.public_id, {
            resource_type: 'raw',
            type: 'upload',
            flags: 'attachment',
        });

        // Create a view URL (for inline viewing)
        const viewUrl = uploadResult.secure_url;

        return NextResponse.json({
            success: true,
            url: viewUrl,
            downloadUrl: downloadUrl,
            publicId: uploadResult.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
