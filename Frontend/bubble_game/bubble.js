function makeBubble() {
    let clutter = "";
for(let i = 1; i <=168; i++){
    clutter += `<div class="bubble">${Math.floor(Math.random()*10)}</div>`;
}
document.querySelector("#pdown").innerHTML = clutter;
}
let rn;
function hitValue(){
    rn = Math.floor(Math.random()* 10);
    document.querySelector("#hitval").textContent = rn;
}
let score = 0;
function increaseScore(){
    score += 10;
    document.querySelector("#score").textContent = score
}
let Name;
function getName(){
    Name = prompt("Enter your name: ");
}
let timer = 62;
function runtimer(){
    setInterval(function(){
        if(timer > 0){
            timer -= 1;
            document.querySelector("#timerval").textContent = timer;
        }
        else {
            document.querySelector("#pdown").innerHTML ="";
            document.querySelector("#msg").innerText = `Congratulation ${Name}!! Your Score is ${score}`
            document.querySelector(".winner").classList.remove("hide");
        }
    },1000)
}

document.querySelector("#pdown").addEventListener("click",function(dets){
    let ClickedNUm = Number(dets.target.textContent);
    if(ClickedNUm === rn){
        increaseScore();
        hitValue();
    }
})
let newbtn = document.querySelector("#btn");
newbtn.addEventListener("click",function(){
    document.querySelector(".winner").classList.add("hide");
    timer = 62;
    score = 0;
    document.querySelector("#score").textContent = 0;
    getName();
    makeBubble();
})
getName();
makeBubble();
runtimer();
hitValue();
