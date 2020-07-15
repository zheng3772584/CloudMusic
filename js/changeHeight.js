let tabBtn = document.querySelectorAll(".tab>label")
//console.log(tabBtn)

//获取三个屏幕
let screen = document.querySelectorAll(".inner>.screen")

for(let i=0;i<tabBtn.length;i++)
{
    tabBtn[i].onclick = function(){
        changeHeight(screen[i],screen[i].parentNode.parentNode)
    }
}

function changeHeight(obj,target){
    console.log(obj.offsetHeight)
    //obj是获取到高度的对象
    //target是控制对象
    target.style.height = obj.offsetHeight + "px"
}