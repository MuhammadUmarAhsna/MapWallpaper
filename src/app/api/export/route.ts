import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { state, type = 'png' } = await req.json();

    if (!state) {
      return NextResponse.json({ error: 'State is required' }, { status: 400 });
    }

    // SSRF protection: only allow internal navigation
    const origin = req.nextUrl.origin;
    const exportUrl = `${origin}/export-preview?state=${encodeURIComponent(JSON.stringify(state))}`;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    
    const page = await browser.newPage();
    
    // Set viewport for high-res
    await page.setViewport({
      width: 2480, // A4 at 300 DPI (approx)
      height: 3508,
      deviceScaleFactor: 2,
    });

    await page.goto(exportUrl, { waitUntil: 'networkidle0' });

    // Wait for map to load
    await new Promise(r => setTimeout(r, 2000));

    let data;
    let contentType;

    if (type === 'pdf') {
      data = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
      });
      contentType = 'application/pdf';
    } else {
      data = await page.screenshot({
        type: 'png',
        fullPage: true,
      });
      contentType = 'image/png';
    }

    await browser.close();

    return new NextResponse(data as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="map-poster.${type}"`,
      },
    });
  } catch (error) {
    console.error('Puppeteer export error:', error);
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}
