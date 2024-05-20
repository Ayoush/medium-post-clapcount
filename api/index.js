const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())

async function scrapeFollowersCount(profileUrl) {
    try {
        const response = await axios.get(profileUrl);
        
        const $ = cheerio.load(response.data);
        
        const followersElement = $('span.pw-follower-count.be.b.fx.ga.dn');
        
        const followersText = followersElement.text().trim();
        
        const followersCount = parseInt(followersText.match(/\d+/)[0]);

        return followersCount;
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw new Error('Failed to scrape followers count');
    }
}

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  

app.get("/", async (req, res) => {
    try {
        const profileUrl = 'https://medium.com/@ayoushchourasia';
        const followersCount = await scrapeFollowersCount(profileUrl);
        res.status(200).json({ followersCount });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
