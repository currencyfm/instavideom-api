const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'instagram-reels-downloader-api.p.rapidapi.com';

app.get('/api/resolve', async (req, res) => {
  const reelUrl = req.query.url;

  if (!reelUrl) {
    return res.status(400).json({ success: false, error: 'URL parametresi eksik' });
  }

  try {
    const response = await axios.get('https://instagram-reels-downloader-api.p.rapidapi.com/downloadReel', {
      params: { url: reelUrl },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    const data = response.data;

    if (data.success && data.data?.medias?.length > 0) {
      const videoUrl = data.data.medias.find(m => m.type === 'video')?.url;

      if (videoUrl) {
        return res.json({
          success: true,
          videoUrl,
          thumbnail: data.data.thumbnail || null,
          caption: data.data.title || null,
          duration: data.data.duration || null,
          author: data.data.author || null
        });
      }
    }

    return res.status(404).json({ success: false, error: 'Video URL bulunamadı' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: 'API hatası: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
