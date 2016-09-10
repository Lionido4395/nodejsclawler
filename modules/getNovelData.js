;(function(){
    var cheerio = require('cheerio')
    var gs = require('nodegrass')

    var url = 'http://www.biquku.com/0/330/'

    /**
     * 获取小说章节数据
     * @return {[json]} [小说章节列表]
     */
    var getList = function (){
        var chapterData = []
        gs.get(url,function(data){
            var html= data
            var $ = cheerio.load(html)
            $('#list dd a').each(function(idx, item){
                var $item = $(item);
                chapterData.push({
                    'title': $item.text(),
                    'id': $item.attr('href').split('.')[0]
                })
            })
        },'gbk').on('error',function(err){
            console.log(err)
        })
        return chapterData
    }

    var getContent = function (id){
        var chapterData = getList()
        var content = ""
        var subUrl = url + id + '.html'
        gs.get(subUrl,function(data){
            var html= data
            var $ = cheerio.load(html)
            content = $('#content').text()
            
        },'gbk').on('error',function(err){
            console.log(err)
        })
        return content
    }
    module.exports = {
        getList: getList,
        getContent: getContent
    }
}).call(this)