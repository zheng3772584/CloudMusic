
// 当Obj传入我们需要的盒子的时候，就能控制三个盒子都隐藏
// 只有obj显示
function showContainer(obj){//obj是我们要控制显示的盒子
    let box = document.querySelector(".search-container")
    let child = box.children
    for(i=0;i<child.length;i++)
    {
        //先遍历子节点，让三个盒子都隐藏
        child[i].style.display="none"
        //child[i].style.width="100px"
        //child[i].style.background="red"
    }

    //obj是我们要控制显示的盒子
    obj.style.display="block"
    
}