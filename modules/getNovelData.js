;(function(){
    var cheerio = require('cheerio');
    var gs = require('nodegrass');
    
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/novel');

    var url = 'http://www.biquku.com/';
    var query = 'xiaoshuodaquan/'

    /**
     * 获取小说章节数据
     * @return {[json]} [小说章节列表]
     */
    var getList = function (){
        var chapterData = [];
        gs.get(url+query,function(data){
            var html= data;
            var $ = cheerio.load(html);

            var NovelList = mongoose.model('NovelList', {
                title: String,
                href: String
            });
            
            $('#main .novellist li').each(function(idx, item){
                var $item = $(item).find('a');
                chapterData.push({
                    'title': $item.text(),
                    'id': $item.attr('href').split('http://www.biquku.com')[1]
                });
                console.log(chapterData);
                

                var List = new NovelList({
                    title: $item.text(), 
                    href: $item.attr('href').split('http://www.biquku.com')[1]
                });

                List.save(function(err){
                    if(err){
                        console.log('保存失败');
                    }
                    console.log("保存完成");
                });
            });
        },'gbk').on('error',function(err){
            console.log(err);
        });
    }
    getList()
    // var getContent = function (){
    //     var chapterData = getList();

    //     for (var i = 0; i < chapterData.length; i++) {
    //         var subUrl = url + chapterData.id + '.html';
    //         gs.get(subUrl,function(data){
    //             var html= data;
    //             var $ = cheerio.load(html);
    //             var title = chapterData.title;
    //             var content = $('#content').text();

    //             var Novel = mongoose.model('Novel', {
    //                 title: String,
    //                 content: String
    //             });

    //             var Chapter = new Novel({
    //                 title: title, 
    //                 content: content
    //             });

    //             Chapter.save(function(err){
    //                 if(err){
    //                     console.log('保存失败');
    //                 }
    //                 console.log("保存完成");
    //             });
    //         },'gbk').on('error',function(err){
    //             console.log(err);
    //         });
    //     }
    // }
    // module.exports = {
    //     getList: getList,
    //     getContent: getContent
    // }
}).call(this);