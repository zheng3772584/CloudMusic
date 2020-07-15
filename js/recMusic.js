//fetch（地址(字符串)，配置）   
//{}为对象  以key value形式存在   例如{name:"张三"}
fetch("http://localhost:3000/personalized", {
    // method:get获取 post上传 delete删除 update修改
    method: "get",
    mode: "cors",
    //cors跨域，因为3000要去5500去拿   接口  域名地址，网络协议一样就不构成跨域
    //no-cors
})
    .then(function (data) {
        // console.log(data)  data是数据流  第一步做数据转换 .then里面都是(function(){})
        return data.json()
    })
    .then(function (data) {   //数据的接收和呈现
        //data.result是最新歌单的数据
        //console.log(data.result);

        //data.result是一个数组，只需要前面留个数据slice切割数组 包前（左）不包后（右）
        //console.log(data.result.slice(0, 6))     //切割之后就是前6位的数组
        console.log(data.result)//data.result是6个推荐歌单的数组

        //let是定义变量的关键字，const定义常量关键字
        //let box = document.querySelector("#rec-song-group")

        // box.innerHTML       innerHTML在盒子中插入内容
        // box.innerHTML = "<p>我是一个p标签</p>"
        // box.innerHTML = "aaaa"  可以插入字符串
        // box.innerHTML = "<p style='color:blue'>我是一个p标签</p>"  插入的样式还可以带样式

        //第一步找盒子
        let recSongBox = document.querySelector(".rec-song")
        //第二步找到盒子之后需要插入6个song-item
        let str = ` `   //定义一个空的字符串
        for (i = 0; i < data.result.slice(0, 6).length; i++) {
            //box.innerHTML += 1

            str +=
                `
                <a href = "recMusic.html?id=${data.result[i].id}">
                <div class="song-item">
                    <img src="${data.result[i].picUrl}" alt="">
                    <p>${data.result[i].name}</p>
                </div>
                </a>
                `
            //在模板字符串``里的变量不能直接写；否则会被当做字符串处理，变量必须加${}
        }
        recSongBox.innerHTML = str
    })

//如何获取网页页面上的盒子   document是网页  querySelector是查找
//找样式用.号，找id用#号，找标签直接写
//console.log(document.querySelector(".header"))

//querySelector只会找到页面中符合要求的第一个元素
//console.log(document.querySelector("#rec-song-group"))

//如果要找到所有符合要求的元素，用querySelectorAll,找到的是数组
//console.log(document.querySelectorAll("div")[0])