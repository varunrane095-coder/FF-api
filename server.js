const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const FF_UID_REGEX = /^[0-9]{8,12}$/;

const mockPlayers = {
  "123456789": { name: "ProGamer", level: 50 },
  "987654321": { name: "FireKing", level: 62 },
  "555666777": { name: "HeadshotX", level: 45 }
};

app.get("/api/freefire/player/:playerId", (req, res) => {
  const playerId = req.params.playerId;

  if (!FF_UID_REGEX.test(playerId)) {
    return res.status(400).json({
      playerId,
      playerName: null,
      playerLevel: null,
      error: "Invalid Free Fire player ID format."
    });
  }

  const player = mockPlayers[playerId];

  if (!player) {
    return res.status(404).json({
      playerId,
      playerName: null,
      playerLevel: null,
      error: "Player not found or invalid ID."
    });
  }

  res.json({
    playerId,
    playerName: player.name,
    playerLevel: player.level,
    error: null
  });
});

app.listen(PORT, () => {
  console.log("Free Fire API running");
});
