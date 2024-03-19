// node
const os = require("os");
const { exec } = require('child_process');

// apiRoutes.js
const express = require("express");
const router = express.Router();

router.get("/api/godaddy/memory", (req, res) => {
  const totalmem = os.totalmem();
  const freemem = os.freemem();
  res.json({ totalmem, freemem });
});

router.get("/api/godaddy/space", (req, res) => {
  // Execute the df command to get total disk space
  const getTotalDiskSpace = new Promise((resolve, reject) => {
    exec("df /", (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
        return;
      }
      const lines = stdout.trim().split('\n');
      const [, totalspace] = lines[1].split(/\s+/);
      resolve(totalspace);
    });
  });

  // Execute the df command to get available disk space
  const getAvailableDiskSpace = new Promise((resolve, reject) => {
    exec("df --output=avail / | tail -n 1", (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
        return;
      }
      const freespace = stdout.trim();
      resolve(freespace);
    });
  });

  // Retrieve total and available disk space concurrently
  Promise.all([getTotalDiskSpace, getAvailableDiskSpace])
  .then(([totalspace, freespace]) => {
    res.json({ totalspace, freespace });
  })
  .catch(error => {
    console.error(`Error retrieving disk space: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

module.exports = router;
