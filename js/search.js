// 搜索页的逻辑
let searchInput = document.querySelector(".search-bar>input")
let searchBar = document.querySelector(".search-bar>input")

searchHot()//渲染出热门搜索关键字
getInfo()  //渲染出本地的搜索记录

//判断输入框是否有焦点
/* 
searchInput.onfocus=function(){
    console.log("输入框有焦点")
}

searchInput.onblur=function(){
    console.log("输入框失去焦点")
} 
*/
searchInput.onfocus = function () {
    searchInput.onkeyup = function (e) {
        if (searchInput.value == "") {
            //输入框为空展示默认页面
            showContainer(document.querySelector(".search-def"))
            getInfo()  //回到搜索页重新渲染出本地的搜索记录
        }
        else {
            if (e.keyCode == 13) {
                // includes indexOf find findIndex map each some forEach

                //回车键，展示搜索结果
                showContainer(document.querySelector(".search-res"))
                // 离线存储key:value存在，singerName:"周杰伦"
                // let arr=[ ]
                // arr.push(searchInput.value)
                // JSON.stringify把对象或者数组转为json格式的字符串
                // ["周杰伦","蔡依林"]=>"['周杰伦','蔡依林']"

                //思路应该是，先从离线存储里面取出数据["周杰伦"]
                //在这个取出来的数组之上，再进行push
                //离线存储的关键是整存整取
                //整个离线存储取出来，操作过后再整个存入离线存储

                //json.parse把具有json格式的字符串，转为对象或者数组
                let arr = JSON.parse(localStorage.getItem("singerName")) || []
                //arr就是离线存储取出来的内容
                if (!arr.includes(searchInput.value)) {
                    arr.push(searchInput.value)
                    localStorage.setItem("singerName", JSON.stringify(arr))
                }

                //发送ajax
                axios.all([getAblum(), getMusicURL()])
                    //数据拿完后的一系列操作
                    .then(axios.spread((getAblumInfo, getSongListInfo) => {
                        //console.log("专辑和歌手信息", getAblumInfo)
                        //console.log("歌曲列表", getSongListInfo)//歌手信息

                        //getSongListInfo.data.result.songs[0].id  歌曲id
                        // data.result.artlist.name歌手名
                        // data.result.artlist.picUrl专辑图片

                        //专辑信息
                        // data.data.result.album.name
                        // data.data.result.album.blurPicUrl

                        //歌曲列表
                        // data.data.result.songs.name歌曲名字

                        let ablumBox = document.querySelector(".search-res>ol")
                        let songListBox = document.querySelector(".search-res>ul")
                        let ablumStr = ``
                        let songListStr = ``

                        //专辑和歌手信息插入
                        if (Object.keys(getAblumInfo.data.result)) {
                            ablumStr += `
                            <li>
                                <img src="${getAblumInfo.data.result.artist[0].picUrl}" alt="">
                                <p>${getAblumInfo.data.result.artist[0].name}</p>
                            </li>
                            <li>
                                <img src="${getAblumInfo.data.result.album[0].blurPicUrl}" alt="">
                                <p>${getAblumInfo.data.result.album[0].name}</p>
                            </li>
                        `
                            ablumBox.innerHTML = ablumStr
                        }

                        let songArr = getSongListInfo.data.result.songs

                        for (i = 0; i < songArr.length; i++) {   //搜索出来的结果
                            songListStr += `
                             <a href="play.html?id=${getSongListInfo.data.result.songs[i].id}">
                                <li>
                                    <div class="play-icon"></div>
            
                                    <div class="song-title-container">
                                        <div class="song-title">
                                            <p>${songArr[i].name}</p>
                                        </div>
                                    </div>
            
                                    <div class="singer">
                                        <span class="sqicon"></span> 
                                        ${songArr[i].artists[0].name}-${songArr[i].album.name}
                                    </div>
                                </li>
                             </a>
                            `
                        }
                        songListBox.innerHTML = songListStr

                        console.log($(".inner>.screen:nth-child(3)"))

                        changeHeight( $(".inner>.screen:nth-child(3)" ) , $(".content") )

                    }))

            }
            else {
                //按下任意键  除了回车之外键盘按键，展示搜索建议
                showContainer(document.querySelector(".search-rem"))
                searchAdv()
            }
            
            changeHeight( $(".inner>.screen:nth-child(3)" ) , $(".content") )

        }
    }

}

//定义方法，尚未执行
function searchHot() {
    fetch("http://localhost:3000/search/hot", {
        method: "get",
        mode: "cors"
    })
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            //console.log(data.result.hots[0].first)
            let box = document.querySelector(".search-hot")
            let str = ``
            for (i = 0; i < data.result.hots.length; i++) {
                str += `<span>${data.result.hots[i].first}</span>`
            }
            box.innerHTML = str
        })
}

//渲染离线存储
function getInfo() {
    //去离线存储拿数据，拿到之后转为数组
    let arr = JSON.parse(localStorage.getItem("singerName")) || []
    let str = ` `
    let box = document.querySelector(".search-list")
    for (i = 0; i < arr.length; i++) {
        str += `
        <li>
            <p>${arr[i]}</p>
            <span onclick="delInfo(${i})">×</span>
        </li>
        `
    }
    box.innerHTML = str
}

//离线存储的删除功能  x形参
function delInfo(x) {
    console.log(x)
    //整存整取,取出离线存储转为数组
    let arr = JSON.parse(localStorage.getItem("singerName")) || []
    arr.splice(x, 1)
    //还需要存进去
    localStorage.setItem("singerName", JSON.stringify(arr))

    getInfo() //操作过后的离线存储数据，再次渲染出来
}

//搜索建议功能
function searchAdv() {
    let box = document.querySelector(".search-rem>.search-list")
    fetch(`http://localhost:3000/search/suggest?keywords=${searchBar.value}&type=mobile`)
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            console.log("搜索建议", data)
            // data.result.allMatchs搜索建议数组
            // keyword关键词
            let str = ``  //用来接收循环后的数据
            for (i = 0; i < data.result.allMatch.length; i++) {
                str +=
                    `
                    <li>${data.result.allMatch[i].keyword}</li>
                    `
            }
            box.innerHTML = str

        })
}

//搜索结果功能

//搜索歌手信息和专辑介绍
//http://localhost:3000/search/multimatch?keywords=周杰伦

//搜索歌曲列表
//http://localhost:3000/search?keywords=周杰伦


function getAblum() {
    return axios.get(`http://localhost:3000/search/multimatch?keywords=${searchInput.value}`);
}

function getMusicURL() {
    return axios.get(`http://localhost:3000/search?keywords=周杰伦`);
}
