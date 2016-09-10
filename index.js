var path = require('path')
var express = require('express')
var novel = require('./modules/getNovelData')
var app = express()

var chapterData = novel.getList()

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'bower_components')))

app.listen(3000,function(){
    console.log('server started!')
})

novel.getContent()

// 首页
app.get('/',function(req,res){
    res.render('index',{
        title: '大主宰最新章节',
        chapters: chapterData
    })
})

// 章节详细页
app.get('/detail/:id',function(req,res){

    res.render('detail',{
        title: '大主宰最新章节',
        content: chatperContent
    })
})
