//fetch（地址(字符串)，配置）   
//{}为对象  以key value形式存在   例如{name:"张三"}
fetch("http://localhost:3000/personalized/newsong", {
    // method:get获取 post上传 delete删除 update修改
    method: "get",
    mode: "cors",
    //cors跨域，因为3000要去5500去拿   接口  域名地址，网络协议一样就不构成跨域
    //no-cors
})
.then(function(data){
    return data.json()
})
.then(function(data){
    console.log(data.result)
    //data.result是10个最新歌曲的数组
    //data.result[0].name //歌曲名
    //data.result[0].song.alias[0] //歌曲描述-副标题
    //data.result[0].song.artists[0].name //歌手名字
    //data.result[0].album.name  //专辑
    let str = ` ` //定义一个字符串为空 后面用来接收html模板
    for(i=0;i<data.result.length;i++)
    {
        //定义变量存放副标题，没有副标题时传入空字符串
        let des = data.result[i].song.alias[0]||""
        //   ?id=  是url的Query值
        str+=`
        <a href="play.html?id=${data.result[i].id}">
                <li>

                    <div class="play-icon"></div>

                    <div class="song-title-container">
                        <div class="song-title">
                            ${data.result[i].name}
                        </div>
                        <div class="song-des">
                            ${des}
                        </div>
                    </div>

                    <div class="singer">
                       <span class="sqicon"></span> 
                       ${data.result[i].song.artists[0].name}
                       -${data.result[i].song.album.name}
                    </div>
                </li>
            </a>
        `
    }

    let box =document.querySelector(".newSong>ul")
    box.innerHTML=str

})