const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer")
const rep = require("absolutify")

// init
const app = express();


// use public file as static
app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=> {
    res.sendFile('/index.html')
})


app.get("/proxy", async (req,res)=> {
    const {url} = req.query;
    if(!url){
        return res.send("No url found")
    } else {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(`https://${url}`);

            let docc = await page.evaluate(()=> document.documentElement.outerHTML)

            docc = rep(docc,`/proxy?url=${url.split("/")[0]}`)
            await browser.close();

            return res.send(docc)
        } catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
})




const PORT = process.env.PORT || 4000;
app.listen(PORT,()=> console.log(`Server running on port: ${PORT}`))