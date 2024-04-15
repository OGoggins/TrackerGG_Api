const pt = require('puppeteer');

let num = 0
async function startpt(targetUrl, interaction) {

    let err;
    let errorResponse;
    const browser = await pt.launch({
        executablePath: '/usr/bin/google-chrome',
            headless: "new",
            args: [
                '--no-sandbox', '--disable-setuid-sandbox',
                `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36`
            ],
            userDataDir: './my-cache-dir', // Set a valid local path for cache
        });
    

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
        request.continue(); // Continue the request
    });

    page.on('response', async (response) => {
        switch (response.status()) {
            case 404:
                console.log(`404 error for URL: ${response.url()}`)
                err = true
                errorResponse = response.status()
                break
            case 451:
                console.log(`451 error for URL: ${response.url()}`)
                err = true
                break
            case 500:
                console.log(`500 error for URL: ${response.url()}`)
                err = true
                break

        }


    });

    await page.goto(targetUrl)

    await page.setViewport({ width: 2000, height: 3000 });

    if (!err) {
        return [page, browser]
    } else {
        browser.close()
        return  [err, errorResponse]
    }
}

function userToSearch(user) {
    console.log(user)
    const username = user[0].split(" ").join("%20")
    const tag = `%23${user[1].split(" ").join("%20")}`
    console.log(username + tag)
    return (username + tag)
}

function valUserRegex(useridentifier, interaction) {
    if (/^[a-zA-Z0-9\s]+$/.test(useridentifier[0])
        && /^[a-zA-Z0-9\s]+$/.test(useridentifier[1])) return true

    // ErrorEmbed(interaction, 'Invalid Characters')
    // logger(`Regex error`)
    return false
}

timeout = 0

function timeoutReset(value) {
    if (value) {
        timeout = value
    } else {
        timeout = 0
    }
}

module.exports = {
    startpt,
    userToSearch,
    valUserRegex,
    timeoutReset,
    timeout,
}