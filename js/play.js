//1.接收上一个页面的id值
console.log(location.search)
// location.search是上一个页面传递过来的id值

//2.然后根据这个id值取加载歌曲，进行播放音乐   获取音乐地址代码
/* 
fetch("http://localhost:3000/song/url"+ location.search,{
    method:"get",
    mode:"cors"
})
.then(function(data){
    return data.json()
})
.then(function(data){
    console.log(data.data[0].url)
    //data.data[0].url歌曲地址
    let box =document.querySelector(".music")
    //box.innerHTML = `<audio src="${data.data[0].url}" controls></audio>`
}) 
*/

//在这个页面，我们需要获取至少三个信息
//1、音乐地址 2、专辑图片  3、歌词信息

//使用axios同时获取三个数据信息  方法运行后必须使用一下

//1、获取音乐地址
function getMusicURL() {
    return axios.get("http://localhost:3000/song/url" + location.search);
}

// 2、获取专辑图片
function ablumImg() {
    return axios.get("http://localhost:3000/song/detail?ids=" + location.search.slice(4));
}

// 3、获取歌词信息
function getLyric() {
    return axios.get("http://localhost:3000/lyric" + location.search)
}

axios.all([getMusicURL(), ablumImg(), getLyric()])
    .then(axios.spread(function (musicUrlData, ablumImgData, lyricData) {
        // 两个请求现在都执行完成
        console.log(musicUrlData.data.data[0].url)  //歌曲地址
        console.log(ablumImgData.data.songs[0].name)//歌曲名字
        console.log(ablumImgData.data.songs[0].al.picUrl)//专辑图片
        console.log(lyricData.data.lrc.lyric)       //歌词

        // 样式: .  id:  #id  标签：直接写
        let songImg = document.querySelector(".song-img>img")
        let bg = document.querySelector(".bg>img")
        let title = document.querySelector(".song-lyric>h2")
        let lyricTxt = document.querySelector(".song-lyric>p")
        let musicAudio = document.querySelector("#audio")
        let disc = document.querySelector(".disc")
        let rangBar = document.querySelector("#range")

        //定义一个歌词播放的lyric对象
        let lyric = new window.Lyric(lyricData.data.lrc.lyric, function (obj) {
            //console.log(obj)
            // console.log(obj.txt)
            lyricTxt.innerHTML = obj.txt
        })

        //背景和专辑头像的设置
        //  .setAttribute(属性，属性值）
        songImg.setAttribute("src", ablumImgData.data.songs[0].al.picUrl)
        bg.setAttribute("src", ablumImgData.data.songs[0].al.picUrl)
        //设置歌词和标题
        title.innerHTML = ablumImgData.data.songs[0].name
        //lyricTxt.innerHTML = lyricData.data.lrc.lyric
        //设置音频地址
        musicAudio.setAttribute("src", musicUrlData.data.data[0].url)

        //播放和暂停效果
        // musicAudio.addEventListener("交互动作",执行事件)
        disc.addEventListener("click", isPlay)

        //paused表示暂停属性  pause表示暂停动作
        function isPlay() {
            //console.log("被点击到了")
            if (musicAudio.paused) {
                musicAudio.play()
                disc.classList.remove("paused")
                disc.classList.add("playing")
                lyric.togglePlay()  //歌词的暂停和播放状态相互切换
            }
            else {
                musicAudio.pause()
                disc.classList.remove("playing")
                disc.classList.add("paused")
                lyric.togglePlay()  //歌词的暂停和播放状态相互切换
            }
        }

        musicAudio.onloadedmetadata = function () {
            // 进度条当前位置
            musicAudio.ontimeupdate = function () {
                rangBar.value = musicAudio.currentTime * 100 / musicAudio.duration
            }

            // 进度条拖动效果
            rangBar.oninput =function(){
                musicAudio.currentTime = rangBar.value * musicAudio.duration / 100
                //musicAudio.currentTime单位是秒，要转化成毫秒
                // 歌词跟随进度条拖动
                lyric.seek( musicAudio.currentTime * 1000)
            }

        }

    }));