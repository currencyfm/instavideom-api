export default async function handler(req, res) {
  console.log("REQUEST METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  console.log("INPUT URL:", url);

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const apiUrl =
      "https://instagram-reels-downloader-api.p.rapidapi.com/downloadReel?url=" +
      encodeURIComponent(url);

    const r = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-reels-downloader-api.p.rapidapi.com",
      },
    });

    const data = await r.json();
    console.log("RAW RESPONSE:", JSON.stringify(data));

    const videoUrl =
      data?.data?.video_url ||
      data?.data?.media?.video_url ||
      data?.data?.download_url ||
      data?.data?.video;

    if (!videoUrl) {
      return res.status(404).json({ error: "Video not found", raw: data });
    }

    return res.status(200).json({ video_url: videoUrl });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

