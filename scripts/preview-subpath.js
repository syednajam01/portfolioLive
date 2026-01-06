// Simple Express server to preview the production build under /portfolioLive/
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from dist at /portfolioLive
app.use('/portfolioLive', express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback for client-side routing
app.get('/portfolioLive/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Redirect root to /portfolioLive/
app.get('/', (req, res) => {
    res.redirect('/portfolioLive/');
});

app.listen(port, () => {
    console.log(`\n  Preview server running at:\n`);
    console.log(`  → http://localhost:${port}/portfolioLive/\n`);
});
