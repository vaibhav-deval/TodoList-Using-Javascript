const text = document.getElementById("add-Text");
const list = document.getElementById("list");

function addTodo() {
  if (text.value === "") {
    alert("Please Enter Some Text");
  } else {
    let li = document.createElement("li");
    li.innerHTML = text.value;
    list.appendChild(li);
    let span =document.createElement("span");
    span.innerHTML= "\u00d7";
    li.append(span);
    
}
text.value=""
save();
}

list.addEventListener("click",function(e){
    if (e.target.tagName==="LI") {
        e.target.classList.toggle("checked")
        save();
        
    } else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        save();
        
    }
},false)


function save(){
    localStorage.setItem("data",list.innerHTML)
}

function get(){
    list.innerHTML=localStorage.getItem("data");
}
get();