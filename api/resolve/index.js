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
      "https://instagram-reels-downloader-api.p.rapidapi.com/download?url=" +
      encodeURIComponent(url);

    const response = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-reels-downloader-api.p.rapidapi.com",
      },
    });

    const data = await response.json();

    const videoUrl = data?.data?.medias?.find(
      (m) => m.type === "video"
    )?.url;

    if (!videoUrl) {
      return res.status(404).json({
        error: "Video not found",
        raw: data,
      });
    }

    return res.status(200).json({ video_url: videoUrl });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err?.message || "unknown",
    });
  }
}
