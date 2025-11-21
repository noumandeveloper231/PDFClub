# PDFClub - PDF Converter

A modern, secure, and fast PDF converter built with Next.js 16 and powered by Convert API.

## Features

- **Fast Conversion**: Convert PDF files to DOCX format in seconds
- **Secure & Private**: Files are automatically deleted after 24 hours
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful interface built with Tailwind CSS
- **Real-time Progress**: Live conversion progress tracking
- **Customizable Settings**: Personalize your conversion experience

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Icons**: Lucide React
- **API**: Convert API for PDF to DOCX conversion
- **File Handling**: Native Node.js fs operations
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convert API key (get one from [convertapi.com](https://www.convertapi.com/))

### Installation

## Project Structure

```
pdfclub/
├── app/
│   ├── api/
│   │   ├── upload/          # File upload endpoint
│   │   ├── convert/         # PDF to DOCX conversion
│   │   ├── download/        # File download endpoint
│   │   └── status/          # Conversion status check
│   ├── components/
│   │   ├── Navigation.jsx   # Main navigation component
│   │   ├── FileUploader.jsx # Drag & drop file uploader
│   │   └── ConversionStatus.jsx # Conversion progress & results
│   ├── about/
│   │   └── page.jsx         # About page
│   ├── settings/
│   │   └── page.jsx         # Settings page
│   ├── layout.js            # Root layout
│   ├── page.js              # Home page
│   └── globals.css          # Global styles
├── uploads/                 # Temporary PDF storage
├── downloads/               # Converted DOCX files
└── public/                  # Static assets
```

## API Endpoints

- `POST /api/upload` - Upload PDF file
- `POST /api/convert/[fileId]` - Convert PDF to DOCX
- `GET /api/download/[fileId]` - Download converted DOCX file
- `GET /api/status/[fileId]` - Check conversion status

## Features Overview

### File Upload
- Drag & drop interface
- File validation (PDF only, 50MB max)
- Progress indicators
- Error handling

### Conversion Process
- Real-time progress tracking
- Convert API integration
- Automatic file cleanup
- Status monitoring

### User Interface
- Modern, responsive design
- Dark/light theme support
- Settings customization
- Mobile-friendly navigation

## Configuration

### Convert API Setup
1. Sign up at [convertapi.com](https://www.convertapi.com/)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

### File Limits
- Maximum file size: 50MB
- Supported input: PDF files only
- Output format: Microsoft Word DOCX

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:
- Create an issue on GitHub
- Check the documentation
- Visit [convertapi.com](https://www.convertapi.com/) for API-related questions
