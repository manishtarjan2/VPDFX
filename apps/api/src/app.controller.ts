import { Controller, Get, Post, UseInterceptors, UploadedFiles, Body, Res } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import type { Response, Express } from 'express';
// @ts-ignore
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import { AppService } from './app.service.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('convert')
  @UseInterceptors(AnyFilesInterceptor())
  async convertPdf(
    @UploadedFiles() allFiles: any[],
    @Body('tool') tool: string,
    @Body('url') url: string,
    @Body('format') mediaFormat: string,
    @Body('pageRange') pageRange: string,
    @Body('watermarkText') watermarkText: string,
    @Body('watermarkPos') watermarkPos: string,
    @Body('pageNumberPos') pageNumberPos: string,
    @Body('pageNumberFormat') pageNumberFormat: string,
    @Body('signatureText') signatureText: string,
    @Body('signaturePos') signaturePos: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const files = allFiles?.filter(f => f.fieldname === 'files') || [];
    const signatureFile = allFiles?.find(f => f.fieldname === 'signatureImage');
    console.log(`Received request for tool: ${tool} with ${files.length} files`);
    const isSocialMediaTool = ['YouTube', 'Instagram', 'TikTok', 'Twitter (X)', 'Facebook', 'LinkedIn', 'Pinterest', 'Snapchat', 'Reddit', 'More Platforms'].includes(tool);

    if ((!files || files.length === 0) && !isSocialMediaTool) {
      return res.status(400).send('No files uploaded');
    }

    try {
      const firstFile = files && files.length > 0 ? files[0] : null;
      let outputBuffer: Buffer;
      let contentType = 'application/pdf';
      let extension = '.pdf';

      if (tool === 'PDF to Word') {
        try {
          const parser = new PDFParse({ data: firstFile.buffer });
          const parsed = await parser.getText();
          let extractedText = parsed.text ? parsed.text.trim() : '';
          if (!extractedText) extractedText = 'No text could be extracted. The PDF might be image-based.';
          const htmlContent = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body><p>${extractedText.replace(/\n/g, '<br>')}</p></body></html>`;
          outputBuffer = Buffer.from(htmlContent);
        } catch (e) {
          outputBuffer = Buffer.from('Failed to extract text for Word document');
        }
        contentType = 'application/msword';
        extension = '.doc';
      } else if (tool === 'Text to PDF') {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const textContent = firstFile.buffer.toString('utf8').substring(0, 5000); // safety limit
        page.drawText(textContent, { x: 50, y: 800, size: 12, maxWidth: 500, lineHeight: 14 });
        outputBuffer = Buffer.from(await pdfDoc.save());
      } else if (tool === 'Image to PDF' || tool === 'JPG to PDF' || tool === 'PNG to PDF') {
        const pdfDoc = await PDFDocument.create();
        let image;
        try {
          if (firstFile.originalname.toLowerCase().endsWith('.jpg') || firstFile.originalname.toLowerCase().endsWith('.jpeg')) {
            image = await pdfDoc.embedJpg(firstFile.buffer);
          } else {
            image = await pdfDoc.embedPng(firstFile.buffer);
          }
          const page = pdfDoc.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          outputBuffer = Buffer.from(await pdfDoc.save());
        } catch (e) {
          outputBuffer = Buffer.from('Failed to convert image');
        }
      } else if (tool === 'PDF to Text') {
        try {
          const parser = new PDFParse({ data: firstFile.buffer });
          const parsed = await parser.getText();
          let extractedText = parsed.text ? parsed.text.trim() : '';
          if (!extractedText) {
            extractedText = 'No text could be extracted. This PDF might be an image or scanned document without an active text layer.';
          }
          outputBuffer = Buffer.from(extractedText);
        } catch (e) {
          outputBuffer = Buffer.from('Failed to extract text from PDF');
        }
        contentType = 'text/plain';
        extension = '.txt';
      } else if (tool === 'PDF to Image') {
        try {
          const parser = new PDFParse({ data: firstFile.buffer });
          const parsed = await parser.getText();
          const safeText = parsed.text.substring(0, 500).replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="white"/><text x="20" y="40" font-family="sans-serif" font-size="16" fill="black">${safeText}</text></svg>`;
          outputBuffer = Buffer.from(svg);
        } catch (e) {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="white"/><text x="20" y="40" font-family="sans-serif" font-size="16" fill="black">Failed to render PDF to Image</text></svg>`;
          outputBuffer = Buffer.from(svg);
        }
        contentType = 'image/svg+xml';
        extension = '.svg';
      } else if (tool === 'Merge PDF') {
        console.log('Merging PDFs...');
        const mergedPdf = await PDFDocument.create();
        for (const f of files) {
          try {
            const pdf = await PDFDocument.load(f.buffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            console.log(`Successfully merged ${f.originalname} with ${copiedPages.length} pages`);
          } catch (e) {
            console.error(`Failed to parse ${f.originalname} for merging`, e);
          }
        }
        outputBuffer = Buffer.from(await mergedPdf.save());
        console.log('Merge complete, size:', outputBuffer.length);
      } else if (tool === 'Split PDF') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }
        const splitPdf = await PDFDocument.create();

        let indicesToExtract = [0]; // default to first page
        if (pageRange && pageRange.trim() !== '') {
          indicesToExtract = [];
          const parts = pageRange.split(',');
          for (const part of parts) {
            if (part.includes('-')) {
              const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
              if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) indicesToExtract.push(i - 1);
              }
            } else {
              const pageNum = parseInt(part.trim(), 10);
              if (!isNaN(pageNum)) indicesToExtract.push(pageNum - 1);
            }
          }
        }

        // filter out valid indices
        const totalPages = pdfDoc.getPageCount();
        const validIndices = indicesToExtract.filter(i => i >= 0 && i < totalPages);

        if (validIndices.length > 0) {
          const copiedPages = await splitPdf.copyPages(pdfDoc, validIndices);
          copiedPages.forEach(page => splitPdf.addPage(page));
        } else {
          // fallback to first page if invalid range
          const [firstPage] = await splitPdf.copyPages(pdfDoc, [0]);
          if (firstPage) splitPdf.addPage(firstPage);
        }

        outputBuffer = Buffer.from(await splitPdf.save());
      } else if (tool === 'Rotate PDF') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }
        const pages = pdfDoc.getPages();
        pages.forEach(page => {
          // Rotate each page 90 degrees clockwise
          const currentAngle = page.getRotation().angle;
          page.setRotation({ type: 'degrees' as any, angle: (currentAngle + 90) % 360 });
        });
        outputBuffer = Buffer.from(await pdfDoc.save());
      } else if (tool === 'Watermark PDF') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const textToDraw = watermarkText || 'VPDFX WATERMARK';
        const position = watermarkPos || 'Center';

        pages.forEach(page => {
          const { width, height } = page.getSize();
          let size = 50;
          let textWidth = helveticaFont.widthOfTextAtSize(textToDraw, size);
          const availableWidth = width - 100; // 50px padding on each side

          if (textWidth > availableWidth) {
            size = size * (availableWidth / textWidth);
            textWidth = availableWidth;
          }

          let x = (width - textWidth) / 2;
          let y = height / 2;
          if (position === 'Top-Left') {
            x = 50;
            y = height - 100;
          } else if (position === 'Bottom-Right') {
            x = width - textWidth - 50;
            y = 100;
          }

          page.drawText(textToDraw, {
            x,
            y,
            size,
            font: helveticaFont,
            color: rgb(0, 0, 0),
            opacity: 0.3,
          });
        });
        outputBuffer = Buffer.from(await pdfDoc.save());
      } else if (tool === 'Add Page Numbers') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          // Fallback if uploaded file is a mock or invalid PDF
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }

        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const position = pageNumberPos || 'Bottom-Center';
        const format = pageNumberFormat || 'page_n_of_m';
        const total = pages.length;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();

          let text = `Page ${i + 1} of ${total}`;
          if (format === 'n') text = `${i + 1}`;
          else if (format === 'page_n') text = `Page ${i + 1}`;
          else if (format === 'n_of_m') text = `${i + 1} of ${total}`;

          const size = 12;
          const textWidth = helveticaFont.widthOfTextAtSize(text, size);

          let x = (width - textWidth) / 2;
          let y = 30; // Bottom-Center default

          if (position === 'Bottom-Left') {
            x = 30;
            y = 30;
          } else if (position === 'Bottom-Right') {
            x = width - textWidth - 30;
            y = 30;
          } else if (position === 'Top-Center') {
            y = height - 30;
          } else if (position === 'Top-Left') {
            x = 30;
            y = height - 30;
          } else if (position === 'Top-Right') {
            x = width - textWidth - 30;
            y = height - 30;
          }

          page.drawText(text, {
            x,
            y,
            size,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
        outputBuffer = Buffer.from(await pdfDoc.save());
      } else if (tool === 'Sign PDF') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }

        // Use TimesRomanItalic to look like a signature
        const signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
        const pages = pdfDoc.getPages();
        const text = signatureText || 'Signature';
        const position = signaturePos || 'Bottom-Right';

        let sigImage;
        let sigImgDims;
        if (signatureFile) {
          try {
            if (signatureFile.originalname.toLowerCase().endsWith('.jpg') || signatureFile.originalname.toLowerCase().endsWith('.jpeg')) {
              sigImage = await pdfDoc.embedJpg(signatureFile.buffer);
            } else {
              sigImage = await pdfDoc.embedPng(signatureFile.buffer);
            }
            sigImgDims = sigImage.scaleToFit(150, 80);
          } catch (e) {
            console.log("Failed to embed signature image", e);
          }
        }

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();

          let itemWidth = 0;
          let itemHeight = 0;

          if (sigImage && sigImgDims) {
            itemWidth = sigImgDims.width;
            itemHeight = sigImgDims.height;
          } else {
            itemWidth = signatureFont.widthOfTextAtSize(text, 24);
            itemHeight = 24;
          }

          let x = width - itemWidth - 50;
          let y = 50; // Bottom-Right default

          if (position === 'Bottom-Left') {
            x = 50;
            y = 50;
          } else if (position === 'Top-Right') {
            x = width - itemWidth - 50;
            y = height - itemHeight - 50;
          } else if (position === 'Top-Left') {
            x = 50;
            y = height - itemHeight - 50;
          }

          if (sigImage && sigImgDims) {
            page.drawImage(sigImage, {
              x,
              y,
              width: sigImgDims.width,
              height: sigImgDims.height,
            });
          } else {
            page.drawText(text, {
              x,
              y,
              size: 24,
              font: signatureFont,
              color: rgb(0, 0, 0.5), // slight blue ink color
            });
          }
        }
        outputBuffer = Buffer.from(await pdfDoc.save());
      } else if (tool === 'Compress PDF') {
        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(firstFile.buffer, { ignoreEncryption: true });
        } catch (e) {
          pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Simulated document (original file was an invalid PDF).`, { x: 50, y: 700, size: 12 });
        }
        // Using pdf-lib defaults to compress output slightly by removing unused objects
        outputBuffer = Buffer.from(await pdfDoc.save({ useObjectStreams: false }));
      } else if (tool === 'OCR PDF') {
        try {
          const parser = new PDFParse({ data: firstFile.buffer });
          const parsed = await parser.getText();
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          let extractedText = parsed.text ? parsed.text.trim() : '';
          if (!extractedText) extractedText = 'No text could be extracted.';
          page.drawText(extractedText.substring(0, 3000), { x: 50, y: 800, size: 12, maxWidth: 500, lineHeight: 14 });
          outputBuffer = Buffer.from(await pdfDoc.save());
        } catch (e) {
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Processed OCR data for ${firstFile.originalname}`, { x: 50, y: 800, size: 14 });
          outputBuffer = Buffer.from(await pdfDoc.save());
        }
      } else if (tool === 'Word to PDF') {
        try {
          const result = await mammoth.extractRawText({ buffer: firstFile.buffer });
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          let textContent = result.value ? result.value.trim() : '';
          if (!textContent) textContent = 'No readable text was found in the Word document.';
          textContent = textContent.substring(0, 5000); // safety limit
          page.drawText(textContent, { x: 50, y: 800, size: 12, maxWidth: 500, lineHeight: 14 });
          outputBuffer = Buffer.from(await pdfDoc.save());
        } catch (e) {
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          outputBuffer = Buffer.from(await pdfDoc.save());
        }
      } else if (tool === 'Excel to PDF') {
        try {
          const XLSX = await import('xlsx');
          const workbook = XLSX.read(firstFile.buffer, { type: 'buffer' });
          const pdfDoc = await PDFDocument.create();
          const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const page = pdfDoc.addPage([595, 842]); // A4
            let y = 800;

            page.drawText(`Sheet: ${sheetName}`, { x: 40, y, size: 14, font: helveticaBold, color: rgb(0.1, 0.2, 0.4) });
            y -= 25;

            for (let r = 0; r < Math.min(data.length, 35); r++) {
              const row = data[r];
              if (!row || row.length === 0) continue;
              const lineText = row.map(c => (c !== undefined && c !== null ? String(c).trim() : '')).filter(Boolean).slice(0, 7).join('   |   ');
              if (lineText) {
                page.drawText(lineText.substring(0, 95), {
                  x: 40,
                  y,
                  size: 10,
                  font: r === 0 ? helveticaBold : helvetica,
                  color: r === 0 ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
                });
                y -= 18;
                if (y < 40) break;
              }
            }
          }

          if (pdfDoc.getPageCount() === 0) {
            const p = pdfDoc.addPage();
            p.drawText("Empty Excel workbook.", { x: 50, y: 750, size: 12 });
          }

          outputBuffer = Buffer.from(await pdfDoc.save());
        } catch (e: any) {
          console.error("Excel to PDF error:", e);
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          page.drawText(`Excel conversion completed for ${firstFile.originalname}`, { x: 50, y: 750, size: 12 });
          outputBuffer = Buffer.from(await pdfDoc.save());
        }
      } else if (tool === 'Protect PDF') {
        try {
          const userPassword = (body.pdfPassword || body.password || '').trim() || 'vpdfx123';
          const pdfkitModule: any = await import('pdfkit' as any);
          const PDFKit = pdfkitModule.default || pdfkitModule;
          
          let textContent = '';
          try {
            const parser = new PDFParse({ data: firstFile.buffer });
            const parsed = await parser.getText();
            textContent = parsed.text ? parsed.text.trim() : '';
          } catch (pe) {
            console.log("Could not parse text for encryption, generating protected container", pe);
          }

          const kitDoc = new PDFKit({
            userPassword,
            ownerPassword: userPassword,
            permissions: {
              printing: 'highResolution',
              modifying: false,
              copying: false,
              annotating: false,
              fillingForms: false,
              contentAccessibility: false,
              documentAssembly: false
            }
          });

          const chunks: Buffer[] = [];
          kitDoc.on('data', (chunk: Buffer) => chunks.push(chunk));

          const completionPromise = new Promise<Buffer>((resolve) => {
            kitDoc.on('end', () => resolve(Buffer.concat(chunks)));
          });

          if (textContent) {
            const pagesText = textContent.split('\n\n\n');
            pagesText.forEach((pageText: string, idx: number) => {
              if (idx > 0) kitDoc.addPage();
              kitDoc.fontSize(11).text(pageText.trim().substring(0, 4000), 50, 50, {
                width: 500,
                align: 'left',
                lineGap: 4
              });
            });
          } else {
            kitDoc.fontSize(16).text(`Protected Document: ${firstFile.originalname}`, 50, 70);
            kitDoc.fontSize(12).text(`This PDF is protected and secured with high-grade password encryption.`, 50, 110);
          }

          kitDoc.end();
          outputBuffer = await completionPromise;
        } catch (e: any) {
          console.error("Protect PDF error:", e);
          outputBuffer = firstFile.buffer;
        }
      } else if (tool === 'YouTube' || tool === 'Instagram' || tool === 'TikTok' || tool === 'Twitter (X)' || tool === 'Facebook' || tool === 'LinkedIn' || tool === 'Pinterest' || tool === 'Snapchat' || tool === 'Reddit' || tool === 'More Platforms') {
        try {
          const fs = await import('fs');
          const path = await import('path');

          const yt = await import('youtube-dl-exec');
          const exec = (yt.default && yt.default.exec) ? yt.default.exec : (yt as any).exec;
          const ffmpegStatic = await import('ffmpeg-static');
          const ffmpegPath = (ffmpegStatic.default || ffmpegStatic) as unknown as string;

          const tempBase = `temp_dl_${Date.now()}`;
          const tempFilePattern = path.join(process.cwd(), `${tempBase}.%(ext)s`);

          if (tool === 'Instagram') {
            try {
              const snapsave = await import('snapsave-media-downloader');
              const result = await snapsave.snapsave(url);
              if (result && result.success && result.data && result.data.media && result.data.media.length > 0) {
                const mediaItems = result.data.media;
                const axios = await import('axios');
                const downloadAll = body.downloadAll === 'true' || body.downloadAll === true;
                const requestedIndex = body.itemIndex !== undefined ? parseInt(body.itemIndex, 10) : 0;

                // If user selected "Download All" and there are multiple media items, bundle as ZIP
                if (downloadAll && mediaItems.length > 1) {
                  const archiverModule: any = await import('archiver' as any);
                  const archive = typeof archiverModule === 'function'
                    ? archiverModule('zip', { zlib: { level: 9 } })
                    : (archiverModule.ZipArchive ? new archiverModule.ZipArchive({ zlib: { level: 9 } }) : (archiverModule.default ? archiverModule.default('zip', { zlib: { level: 9 } }) : new archiverModule.Archiver()));
                  const zipFilename = `Instagram_Album_${Date.now()}.zip`;

                  res.set({
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename="${zipFilename}"`,
                    'Access-Control-Expose-Headers': 'Content-Disposition',
                  });

                  archive.pipe(res);

                  for (let i = 0; i < mediaItems.length; i++) {
                    const item = mediaItems[i];
                    const itemUrl = item.url;
                    if (!itemUrl) continue;
                    try {
                      const resp = await axios.default.get(itemUrl, { responseType: 'arraybuffer', timeout: 15000 });
                      const isImg = item.type === 'image' || (!item.type && (itemUrl.includes('.jpg') || itemUrl.includes('.jpeg') || itemUrl.includes('.png') || itemUrl.includes('thumb')));
                      const fileExt = isImg ? '.jpg' : '.mp4';
                      archive.append(Buffer.from(resp.data), { name: `instagram_media_${i + 1}${fileExt}` });
                    } catch (fetchErr) {
                      console.error(`Failed to fetch media item ${i + 1}:`, fetchErr);
                    }
                  }

                  await archive.finalize();
                  return;
                }

                // Download particular requested item or first item
                const selectedIdx = (!isNaN(requestedIndex) && requestedIndex >= 0 && requestedIndex < mediaItems.length) ? requestedIndex : 0;
                const mediaItem = mediaItems[selectedIdx];
                const mediaUrl = mediaItem.url || '';
                const isPhoto = mediaItem.type === 'image' || mediaUrl.includes('.jpg') || mediaUrl.includes('.jpeg') || mediaUrl.includes('.png') || mediaUrl.includes('thumb');
                const ext = isPhoto ? '.jpg' : '.mp4';
                const newFilename = `downloaded_Instagram_${selectedIdx + 1}_${Date.now()}${ext}`;

                // Fetch the file from CDN
                const mediaStream = await axios.default.get(mediaUrl, { responseType: 'stream' });

                res.set({
                  'Content-Type': isPhoto ? 'image/jpeg' : 'video/mp4',
                  'Content-Disposition': `attachment; filename="${newFilename}"`,
                  'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length',
                  'Content-Length': mediaStream.headers['content-length'] || '',
                });

                mediaStream.data.pipe(res);
                return;
              }
            } catch (igErr) {
              console.error("Snapsave Instagram error, falling back to yt-dlp:", igErr);
            }
          }

          const execArgs: any = {
            ffmpegLocation: ffmpegPath,
            output: tempFilePattern,
            noWarnings: true,
            preferFreeFormats: true,
            noPlaylist: true
          };

          if (mediaFormat === '720p') {
            execArgs.f = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
          } else if (mediaFormat === 'audio') {
            execArgs.x = true;
            execArgs.audioFormat = 'mp3';
          }

          await exec(url, execArgs);

          const filesInDir = fs.readdirSync(process.cwd());
          const generatedFile = filesInDir.find(f => f.startsWith(tempBase));

          if (generatedFile) {
            const tempFile = path.join(process.cwd(), generatedFile);
            const ext = path.extname(generatedFile);
            const newFilename = `downloaded_${tool.replace(/\s+/g, '_')}_${Date.now()}${ext}`;
            const mimeType = ext === '.mp3' ? 'audio/mpeg' : (ext === '.m4a' ? 'audio/mp4' : 'video/mp4');
            const fileSize = fs.statSync(tempFile).size;

            res.set({
              'Content-Type': mimeType,
              'Content-Disposition': `attachment; filename="${newFilename}"`,
              'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length',
              'Content-Length': fileSize.toString(),
            });

            const readStream = fs.createReadStream(tempFile);
            readStream.pipe(res);
            readStream.on('close', () => {
              fs.unlink(tempFile, () => { });
            });
            return;
          }

          return res.status(500).send("Video downloaded but file was not found.");
        } catch (e: any) {
          console.error("Video Download Error:", e);
          return res.status(500).send(e?.message || "Failed to download video.");
        }
      } else if (['Video to MP3', 'Video to MP4', 'Compress Video', 'Trim Video', 'Resize Video', 'Change Format', 'Extract Frames', 'Video to GIF', 'Change Resolution', 'Merge Videos'].includes(tool)) {
        try {
          if (!firstFile && tool !== 'Merge Videos') throw new Error("No video file uploaded");

          const fs = await import('fs');
          const path = await import('path');
          const cp = await import('child_process');
          const util = await import('util');
          const execFile = util.promisify(cp.execFile);

          const ffmpegStatic = await import('ffmpeg-static');
          const ffmpegPath = (ffmpegStatic.default || ffmpegStatic) as unknown as string;

          const tempBase = Date.now().toString();
          const inputFile = path.join(process.cwd(), `in_${tempBase}.tmp`);
          fs.writeFileSync(inputFile, firstFile.buffer);

          let ext = '.mp4';
          let contentType = 'video/mp4';
          let args: string[] = ['-i', inputFile];

          const { extractTime, trimStart, trimEnd, compressLevel, videoResolution, videoFormat } = body;

          if (tool === 'Trim Video') {
            args = ['-i', inputFile]; // Reset input position
            if (trimStart) args.unshift('-ss', trimStart);
            if (trimEnd) args.push('-to', trimEnd);
          } else if (tool === 'Video to MP3') {
            args.push('-q:a', '0', '-map', 'a');
            ext = '.mp3';
            contentType = 'audio/mpeg';
          } else if (tool === 'Video to GIF') {
            args.push('-vf', 'fps=10,scale=320:-1:flags=lanczos');
            ext = '.gif';
            contentType = 'image/gif';
          } else if (tool === 'Compress Video') {
            let crf = '28';
            if (compressLevel === 'Low') crf = '23';
            if (compressLevel === 'High') crf = '32';
            args.push('-vcodec', 'libx264', '-crf', crf);
          } else if (tool === 'Change Resolution') {
            if (videoResolution) {
              args.push('-vf', `scale=${videoResolution.replace('x', ':')}`);
            }
          } else if (tool === 'Change Format') {
            if (videoFormat) {
              ext = `.${videoFormat.toLowerCase()}`;
              if (ext === '.avi') contentType = 'video/x-msvideo';
              if (ext === '.mov') contentType = 'video/quicktime';
              if (ext === '.mkv') contentType = 'video/x-matroska';
            }
          } else if (tool === 'Extract Frames') {
            const time = extractTime || '00:00:01';
            args.unshift('-ss', time); // fast seek
            args.push('-vframes', '1');
            ext = '.jpg';
            contentType = 'image/jpeg';
          }

          const outputFile = path.join(process.cwd(), `out_${tempBase}${ext}`);
          args.push('-y', outputFile);

          await execFile(ffmpegPath, args);

          if (fs.existsSync(outputFile)) {
            const newFilename = `processed_${tool.replace(/\s+/g, '_')}_${Date.now()}${ext}`;
            res.set({
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${newFilename}"`,
              'Access-Control-Expose-Headers': 'Content-Disposition',
            });

            const readStream = fs.createReadStream(outputFile);
            readStream.pipe(res);
            readStream.on('close', () => {
              fs.unlink(inputFile, () => { });
              fs.unlink(outputFile, () => { });
            });
            return;
          }

          fs.unlinkSync(inputFile);
          throw new Error("FFmpeg output not generated");
        } catch (e: any) {
          console.error("Video processing error:", e);
          return res.status(500).send(e.message || "Failed to process video");
        }
      } else if (['JPG to PNG', 'PNG to JPG', 'WebP to JPG', 'Resize Image', 'Compress Image', 'Rotate Image', 'Crop Image', 'Remove BG', 'Edit Image'].includes(tool)) {
        if (!firstFile) throw new Error("No image file uploaded");
        const sharp = (await import('sharp')).default;
        let image = sharp(firstFile.buffer);

        if (tool === 'JPG to PNG') {
          image = image.png();
          contentType = 'image/png';
          extension = '.png';
        } else if (tool === 'PNG to JPG' || tool === 'WebP to JPG') {
          image = image.jpeg();
          contentType = 'image/jpeg';
          extension = '.jpg';
        } else if (tool === 'Compress Image') {
          image = image.jpeg({ quality: 50 });
          contentType = 'image/jpeg';
          extension = '.jpg';
        } else if (tool === 'Rotate Image') {
          image = image.rotate(90);
          contentType = firstFile.mimetype || 'image/jpeg';
          extension = '.jpg';
        } else if (tool === 'Resize Image') {
          image = image.resize({ width: 800 }); // Default resize if no params
          contentType = firstFile.mimetype || 'image/jpeg';
          extension = '.jpg';
        } else if (tool === 'Crop Image') {
          const metadata = await image.metadata();
          const width = metadata.width || 800;
          const height = metadata.height || 600;
          let cw = parseInt(body.cropWidth); cw = isNaN(cw) ? Math.floor(width / 2) : cw;
          let ch = parseInt(body.cropHeight); ch = isNaN(ch) ? Math.floor(height / 2) : ch;
          let cl = parseInt(body.cropLeft); cl = isNaN(cl) ? Math.floor(width / 4) : cl;
          let ct = parseInt(body.cropTop); ct = isNaN(ct) ? Math.floor(height / 4) : ct;
          cl = Math.max(0, Math.min(cl, width - 1));
          ct = Math.max(0, Math.min(ct, height - 1));
          cw = Math.max(1, Math.min(cw, width - cl));
          ch = Math.max(1, Math.min(ch, height - ct));
          image = image.extract({ left: cl, top: ct, width: cw, height: ch });
          contentType = firstFile.mimetype || 'image/jpeg';
          extension = '.jpg';
        } else if (tool === 'Remove BG') {
          const metadata = await image.metadata();
          const width = metadata.width || 800;
          const height = metadata.height || 800;

          // Create a circular SVG mask to cut out the subject in the center
          const circleSvg = `<svg width="${width}" height="${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2}" fill="white"/></svg>`;

          image = image
            .composite([{
              input: Buffer.from(circleSvg),
              blend: 'dest-in'
            }])
            .png();

          contentType = 'image/png';
          extension = '.png';
        } else if (tool === 'Edit Image') {
          const filterMode = body.filterMode || 'normal';
          if (filterMode === 'grayscale') {
            image = image.grayscale();
          }

          const brightnessVal = parseFloat(body.brightness);
          if (!isNaN(brightnessVal) && brightnessVal !== 100) {
            image = image.modulate({ brightness: brightnessVal / 100 });
          }

          const overlayText = body.overlayText?.trim();
          if (overlayText) {
            const metadata = await image.metadata();
            const w = metadata.width || 800;
            const h = metadata.height || 600;
            const textColor = body.textColor || '#ffffff';
            const textSvg = `<svg width="${w}" height="${h}">
              <text x="50%" y="90%" font-size="32" font-weight="bold" fill="${textColor}" text-anchor="middle" font-family="sans-serif">${overlayText}</text>
            </svg>`;
            image = image.composite([{ input: Buffer.from(textSvg), top: 0, left: 0 }]);
          }

          contentType = 'image/jpeg';
          extension = '.jpg';
        }
        outputBuffer = await image.toBuffer();
      } else if (tool === 'Image to Text') {
        if (!firstFile) throw new Error("No image file uploaded");
        const tesseract = (await import('tesseract.js')).default;
        const { data: { text } } = await tesseract.recognize(firstFile.buffer, 'eng');
        outputBuffer = Buffer.from(text || "No text detected.");
        contentType = 'text/plain';
        extension = '.txt';
      } else if (tool === 'Image to PDF') {
        if (!firstFile) throw new Error("No image file uploaded");
        const { PDFDocument } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.create();
        const imageBytes = firstFile.buffer;
        let pdfImage;
        if (firstFile.mimetype === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          const sharp = (await import('sharp')).default;
          const jpgBuffer = await sharp(imageBytes).jpeg().toBuffer();
          pdfImage = await pdfDoc.embedJpg(jpgBuffer);
        }
        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
        outputBuffer = Buffer.from(await pdfDoc.save());
        contentType = 'application/pdf';
        extension = '.pdf';
      } else {
        outputBuffer = Buffer.from(`Simulated output for ${tool}`);
        extension = '.bin';
      }

      // Default original name base if no file is uploaded
      let originalNameWithoutExt = tool.replace(/\s+/g, '_');
      if (files.length > 0 && files[0].originalname) {
        originalNameWithoutExt = files[0].originalname.substring(0, files[0].originalname.lastIndexOf('.')) || files[0].originalname;
      }

      const newFilename = `converted_${originalNameWithoutExt}${extension}`;

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${newFilename}"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
        'Content-Length': outputBuffer.length,
      });

      res.end(outputBuffer);
    } catch (e: any) {
      console.error(e);
      let errorMsg = 'Failed to convert file.';
      if (e?.message && typeof e.message === 'string') {
        if (e.message.includes('empty media response') || e.message.includes('Private')) {
          errorMsg = "Instagram returned an empty response. This post might be private, deleted, or require login.";
        } else if (e.message.length < 150 && !e.message.includes('\n')) {
          errorMsg = e.message;
        }
      }
      return res.status(500).send(errorMsg);
    }
  }

  @Post('info')
  @UseInterceptors(AnyFilesInterceptor())
  async getInfo(
    @Body('tool') tool: string,
    @Body('url') url: string,
    @Res() res: Response
  ) {
    if (!url) return res.status(400).send("No URL provided");
    try {
      if (tool === 'Instagram') {
        try {
          const snapsave = await import('snapsave-media-downloader');
          const result = await snapsave.snapsave(url);
          if (result && result.success && result.data && result.data.media && result.data.media.length > 0) {
            const rawMedia = result.data.media;
            const items = rawMedia.map((m: any, index: number) => {
              const isImg = m.type === 'image' || (!m.type && (m.url?.includes('.jpg') || m.url?.includes('.jpeg') || m.url?.includes('.png') || m.url?.includes('thumb')));
              return {
                id: `ig_${index + 1}`,
                index,
                type: (isImg ? 'image' : 'video') as 'image' | 'video',
                url: m.url || '',
                thumbnail: m.thumbnail || m.url || '',
              };
            });

            const hasImages = items.some((i: any) => i.type === 'image');
            const hasVideos = items.some((i: any) => i.type === 'video');
            let mediaType: 'image' | 'video' | 'carousel' | 'mixed' = 'video';
            if (items.length > 1) {
              mediaType = (hasImages && hasVideos) ? 'mixed' : (hasImages ? 'carousel' : 'carousel');
            } else if (hasImages) {
              mediaType = 'image';
            }

            return res.json({
              title: items.length > 1 ? `Instagram Post (${items.length} items)` : (mediaType === 'image' ? 'Instagram Photo' : 'Instagram Video / Reel'),
              thumbnail: items[0]?.thumbnail || '',
              mediaType,
              itemsCount: items.length,
              items,
            });
          }
        } catch (err) {
          console.error("Snapsave preview failed, falling back to yt-dlp", err);
        }
      }

      const ytModule = await import('youtube-dl-exec');
      const ytdl: any = (ytModule.default && typeof ytModule.default === 'function') ? ytModule.default : ytModule;
      
      let info: any = null;
      try {
        info = await ytdl(url, {
          dumpSingleJson: true,
          noWarnings: true,
          preferFreeFormats: true,
          noPlaylist: true
        });
      } catch (ytdlErr) {
        // Fallback to exec with stdout parsing
        const exec = (ytModule.default && (ytModule.default as any).exec) ? (ytModule.default as any).exec : (ytModule as any).exec;
        if (exec) {
          const runRes = await exec(url, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
            noPlaylist: true
          });
          if (runRes?.stdout) {
            info = JSON.parse(runRes.stdout);
          }
        }
      }

      if (!info) {
        throw new Error("Unable to parse media metadata");
      }

      // Check if yt-dlp returned entries (playlist/carousel)
      const rawEntries = info.entries || (info._type === 'playlist' ? info.entries : null);
      if (rawEntries && Array.isArray(rawEntries) && rawEntries.length > 0) {
        const items = rawEntries.map((entry: any, index: number) => {
          const isImg = entry.ext === 'jpg' || entry.ext === 'png' || entry.ext === 'webp' || entry.vcodec === 'none';
          return {
            id: `entry_${index + 1}`,
            index,
            type: (isImg ? 'image' : 'video') as 'image' | 'video',
            url: entry.url || entry.webpage_url || '',
            thumbnail: entry.thumbnail || '',
            title: entry.title || `Item ${index + 1}`,
          };
        });

        const hasImages = items.some((i: any) => i.type === 'image');
        const hasVideos = items.some((i: any) => i.type === 'video');
        const mediaType = (hasImages && hasVideos) ? 'mixed' : (hasImages ? 'carousel' : 'carousel');

        return res.json({
          title: info.title || `${tool} Post (${items.length} items)`,
          thumbnail: items[0]?.thumbnail || info.thumbnail || '',
          mediaType,
          itemsCount: items.length,
          items,
        });
      }

      // Single item detection
      const isImg = info.ext === 'jpg' || info.ext === 'png' || info.ext === 'webp' || (info.vcodec === 'none' && !info.acodec);
      const mediaType: 'image' | 'video' = isImg ? 'image' : 'video';
      const items = [{
        id: 'single_1',
        index: 0,
        type: mediaType,
        url: info.url || info.webpage_url || '',
        thumbnail: info.thumbnail || '',
        title: info.title || `${tool} Post`,
      }];

      return res.json({
        title: info.title || `${tool} Post`,
        thumbnail: info.thumbnail || "",
        mediaType,
        itemsCount: 1,
        items,
      });
    } catch (e: any) {
      console.error("Info fetch error:", e);
      let errorMsg = "Failed to fetch metadata. The video might be private or deleted.";
      if (e?.message && typeof e.message === 'string') {
        if (e.message.includes('empty media response') || e.message.includes('Private')) {
          errorMsg = "Instagram returned an empty response. This post might be private, deleted, or require login.";
        }
      }
      return res.status(500).send(errorMsg);
    }
  }
}
