const cheerio = require('cheerio')
const axios = require('axios')

async function title(url) {
    const titulo = await axios.get(url,{
        headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'}
    }).then(function(response) {
        let $ = cheerio.load(response.data)

        return $('head > title').text()
    }).catch(function(e){
        throw (e.message)
    })

    return titulo
}

module.exports = {
    title,
}