const cheerio = require('cheerio')
const axios = require('axios')

const url = 'http://www.clarin.com.ar'

axios.get(url,{
    headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'}
}).then(function(response) {
    let $ = cheerio.load(response.data)

    console.log($('head > title').text())
}). catch(function(e){
    console.log('Error:', e.code, ' ', e.hostname)
})
