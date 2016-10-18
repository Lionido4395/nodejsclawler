var path = require('path');
var express = require('express');
var app = express();
var cheerio = require('cheerio');
var gs = require('nodegrass');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/novel');

var NovelList = mongoose.model('NovelList', {
    title: String,
    href: String
});


var host = 'http://www.biquku.com/';

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'bower_components')));

app.listen(3000,function(){
    console.log('server started!');
});



// 首页
app.get('/',function(req,res){
    var list = '';

    NovelList.find({},function(err,docs){
        if(!err){
            list = docs;
            res.render('index',{
                title: '全部列表',
                listData: list
            });
        }else{
            console.log(err);
        }
    });

    
});

// 章节详细页
app.get('/novel/:idx/:id',function(req,res){
    var id = req.params.id;
    var idx = req.params.idx;

    var url = host + idx + '/' + id + '/';

    var chapterList = [];

    gs.get(url,function(data){
        var html= data;
        var $ = cheerio.load(html);
        var info = {};
        info.author = $('#info p').eq(0).text();
        info.newUpdate = $('#info p').eq(2).text();
        info.desc = $('#intro p').eq(0).text();
        $('#list dl dd').each(function(idx, item){
            var $item = $(item).find('a');
            chapterList.push({
                'title': $item.text(),
                'id': $item.attr('href')
            });
        });
        res.render('novel',{
            title: $('#info h1').text(),
            list: chapterList,
            info: info
        });
    },'gbk').on('error',function(err){
        console.log(err);
    });
});

// 章节内容
app.get('/novel/:idx/:id/:content',function(req,res){
    var id = req.params.id;
    var idx = req.params.idx;
    var content = req.params.content;

    var url = host + idx + '/' + id + '/' + content;

    var chapterList = [];

    gs.get(url,function(data){
        var html= data;
        var $ = cheerio.load(html);
        
        var content = $('#content').text().split(/\s{4}/g);
        var prev = $('.bookname .bottem1 a').eq(1).prop('href');
        var next = $('.bookname .bottem1 a').eq(3).prop('href');
        res.render('content',{
            title: $('.bookname h1').text(),
            content: content,
            prev: prev,
            next: next
        });
        console.log(prev,next)
    },'gbk').on('error',function(err){
        console.log(err);
    });
});
