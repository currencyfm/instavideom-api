export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const apiUrl =
      "https://instagram-reels-downloader-api.p.rapidapi.com/downloadReel?url=" +
      encodeURIComponent(url);

    const r = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-reels-downloader-api.p.rapidapi.com",
      },
    });

    const data = await r.json();

    // 🔴 DEBUG: RAW RESPONSE
    console.log("RAW RESPONSE:", JSON.stringify(data));

    // Esnek alan araması (EaseApi varyasyonları)
    const videoUrl =
      data?.data?.video_url ||
      data?.data?.media?.video_url ||
      data?.data?.download_url ||
      data?.video_url ||
      data?.url;

    if (!videoUrl) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.status(200).json({ video_url: videoUrl });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
