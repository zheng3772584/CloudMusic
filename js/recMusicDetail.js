console.log(location.search)
//获取上一页 页面传递的id

// fetch("http://localhost:3000/playlist/detail"+location.search)
// .then( data=>data.json() )
// .then( data=>console.log("歌单详情",data) )

// fetch("http://localhost:3000/comment/playlist"+location.search)
// .then( data=>data.json() )
// .then( data=>console.log("歌单评论",data) )

// function(data){}
// 匿名函数=>
// (data,data2)=>{
//     console.log(data)
//     console.log(data2)
// }

// 如果只有一个形式参数，可以去掉圆括号；
// 如果｛｝里面只有一行代码，可以去掉｛｝
// data=>console.log(data)

// 如果｛｝里面只有一行代码，可以去掉｛｝不写return
// data=>data

function getSongDetail() {
    return axios.get("http://localhost:3000/playlist/detail" + location.search)
}

function SongComment() {
    return axios.get("http://localhost:3000/comment/playlist" + location.search)
}

axios.all([getSongDetail(), SongComment()])
    .then(axios.spread((SongDetailData, SongCommentData) => {
        console.log("歌曲详情", SongDetailData)
        console.log("推荐歌曲", SongCommentData)
        let songImg = document.querySelector(".songImg>img")
        let avatar = document.querySelector(".avatar>img")
        let songTitle = document.querySelector(".songTxt>h2")
        let author = document.querySelector(".user>p")
        let bg = document.querySelector(".bg>img")

        let songListUl = document.querySelector(".songList>ul")

        songImg.setAttribute("src", SongDetailData.data.playlist.coverImgUrl)
        bg.setAttribute("src", SongDetailData.data.playlist.coverImgUrl)
        avatar.setAttribute("src", SongDetailData.data.playlist.creator.avatarUrl)
        songTitle.innerHTML = SongDetailData.data.playlist.name
        author.innerHTML = SongDetailData.data.playlist.creator.nickname

        // SongDetailData.data.playlist.tags数组标签
        // SongDetailData.data.playlist.description简介

        let tags = SongDetailData.data.playlist.tags
        let des = SongDetailData.data.playlist.description

        //console.log(des)
        //  没g只替换第一个 g 就是global 全局替换  
        //  \n 回车 \d 数字字符0-9 \D非数字字符 [a-cA-D]表示选择范围 /a+/表示若干个a /.+/表示若干个任意字符
        let reg = /\n/g
        //console.log(des.match(reg))
        
        let desStr 
        if ( des ) {
            desStr = des.replace(reg, "<br>")
        }else{
            desStr = "无简介"
        }
        console.log(desStr)

        let tagStr = ``
        for (i = 0; i < tags.length; i++) {
            tagStr += `<span>${tags[i]}</span>`
        }
        $("titleContent").innerHTML = tagStr

        $(".intro_txt>p").innerHTML = desStr
        // 分行=>正则

        //渲染歌曲列表
        // SongDetailData.data.playlist.tracks歌曲列表
        //forEach就是循环，里面跟着一个function
        //value就是每一项内容
        //index就是索引
        //arr就是数组本身
        let songListStr = ``
        SongDetailData.data.playlist.tracks.forEach( (value, index, arr)=> {
            //console.log(index)
            songListStr += `
            <a href="play.html?id=${value.id}">
            <li>
                <div class="list">${index + 1}</div>
                <div class="songList-info">
                    <p>${value.name}</p>
                    <span>${value.ar[0].name}-${value.al.name}</span>
                </div>
                <play-icon>
                    <div class="play-icon"></div>
                </play-icon>
            </li>
            </a>`
        });
        songListUl.innerHTML = songListStr

        //精彩评论
        let hotStr = ``
        //
        SongCommentData.data.hotComments.forEach((value, index, arr) => {
            let repliedStr = ``
            if(value.beReplied.length != 0)
            {
                // 就是回复的数组长度不为0
                repliedStr = `<span>${value.beReplied[0].content}</span>`
            }
             hotStr += `
            <li>
                <div class="user">
                    <div class="left_img">
                        <div class="head">
                            <img src="${value.user.avatarUrl}" alt="">
                        </div>
                    </div>

                    <div class="user_info">
                        <p>${value.user.nickname}</p>
                        <span>${ parseTime(new Date(value.time))}</span>
                    </div>

                    <div class="right_icon">
                        <span>${value.likedCount}</span>
                        <svg class="u-svg u-svg-unzancmt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path fill="#999" d="m25.857 14.752c-.015.059-1.506 5.867-2.932 8.813-1.162 2.402-3 2.436-3.099 2.436h-12.826v-13c3 0 5.728-4 5.728-7.275 0-3.725 1.433-3.725 2.142-3.725 1.327 0 1.978 1.345 1.978 4 0 2.872-.832 4.525-.839 4.537-.161.31-.155.682.027.981.181.299.5.482.849.482h6.942c.922 0 1.551.215 1.866.64.467.626.286 1.705.164 2.112m-23.857 10.248v-10c0-1.795.659-1.981.855-2h2.145v13h-2.173c-.829 0-.827-.648-.827-1m25.309-13.54c-.713-.969-1.886-1.46-3.482-1.46h-5.519c.26-.932.519-2.285.519-4 0-5.221-2.507-6-4-6-1.909 0-4.185.993-4.185 5.725 0 2.206-1.923 5.275-3.815 5.275h-4-.011c-1.034.011-2.816.862-2.816 4v10.02c0 1.198.675 2.979 2.827 2.979h16.971.035c.364 0 3.224-.113 4.894-3.564 1.514-3.127 3.01-8.942 3.056-9.14.071-.23.664-2.289-.474-3.836"></path>
                        </svg>
                    </div>
                </div>
                <div class="comment">
                    <p>${value.content}</p>
                    ${repliedStr}
                </div>
            </li>
            `
        })

        $(".hot-comment>ul").innerHTML = hotStr
    }))

// 内容的显示和折叠
let num = 0
function show(obj) {
    // obj控制对象   
    num++
    if (num % 2 == 1) {//奇数次点击 第1 3 5 7 9 ...
        obj.style.height = "auto"

        $(".intro").style.height = "auto"
        // 控制箭头向上  先删除再添加样式
        $("icon").classList.remove("down")
        $("icon").classList.add("up")

    }
    else {//偶数次点击
        obj.style.height = "115px"
        $(".intro").style.height = "130px"
        $("icon").classList.remove("up")
        $("icon").classList.add("down")
    }
}

//13位数时间戳的转换方法1  采用默认格式
//console.log( new Date(1587082849718).toLocaleString() )

function parseTime(now) {
    //now是要传入的时间戳
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let date = now.getDate()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`
}

//let d = new Date(now)         //new Date传入时间戳
//console.log(parseTime(d))   //转换new Date