const content = document.getElementById("content");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

// Music toggle
musicToggle.onclick = () => {
  if (music.paused) music.play();
  else music.pause();
};

// Floating hearts
setInterval(()=>{
  const heart=document.createElement("div");
  heart.className="heart";
  heart.style.left=Math.random()*window.innerWidth+"px";
  document.body.appendChild(heart);
  setTimeout(()=>heart.remove(),4000);
},500);

// Variables
let lang = null, qIndex = 0, answers = {};

// Smart responses
function getSmartResponse(text, lang){
  text=text.toLowerCase();
  const responses={
    tl:{pagod:["Magpahinga ka muna :)","Kaya mo yan 💖"],stress:["Huwag ka naman masyadong stress 💖"],school:["Mag-aral ka lang ng maayos masaya na aku 💖"],kaibigan:["Ano naman sa kaibigan mo? pwde naman mag usapan... pero okay nayan 💖"],gutom:["Kumain ka muna 💖"],masaya:["Ang saya mo naman hahahaha..."],hobby:["Ang saya ng libangan mo ah... nakakaingit hehe"],pangarap:["Kaya mo yan, stay strong 💪💪💪 "]},
    en:{tired:["Take a rest :)"],stress:["Don’t stress 💖"],school:["Just focus 💪"],friends:["Friends are great, It's fine if they bother you 💖"],hungry:["Hangry or Hungry? Just Incase eat rn 💖"],happy:["Glad to hear that your happy :) 👍👌"],hobby:["Enjoy your hobby 💖"],dream:["Keep chasing your dreams 💖"]}
  };
  const langRes=responses[lang];
  for(const key in langRes){ if(text.includes(key)) return langRes[key][Math.floor(Math.random()*langRes[key].length)]; }
  const fallback={tl:["Salamat sa pagshashare 💖","Ayos yan! 💖"],en:["Thanks for sharing 💖","That’s great! 💖"]};
  return fallback[lang][Math.floor(Math.random()*fallback[lang].length)];
}

// Questions array
function getQuestions(){
  if(lang==="tl"){
    return [
      {id:"day",text:"Goods ba ang araw mo ngayon?",type:"yesno"},
      {id:"badreason",text:"Bkit naman hindi maganda ang araw mo?",type:"text",smart:true,condition:()=>answers.day===false},
      {id:"feeling",text:"Ano ang pakiramdam mo ngayon?",type:"yesno",yesText:"Masaya",noText:"Pagod"},
      {id:"energy",text:"May energy ka pa ba??",type:"yesno"},
      {id:"color",text:"Ano ang paborito mong kulay?",type:"color"},
      {id:"important",text:"Sino ang pinakamahalaga sa iyo?",type:"text",smart:true},
      {id:"food",text:"Ano ang paborito mong pagkain?",type:"text",smart:true},
      {id:"hobby",text:"Ano ang libangan mo?",type:"text",smart:true},
      {id:"coping",text:"Ano ang ginagawa mo kapag nalulungkot ka?",type:"text",smart:true},
      {id:"dream",text:"Ano ang pangarap mo?",type:"text",smart:true},
      {id:"music",text:"Ano ang paborito mong kanta?",type:"text",smart:true},
      {id:"person",text:"Sino ang inspirasyon mo?",type:"text",smart:true}
    ];
  } else {
    return [
      {id:"day",text:"Are you having a good day?",type:"yesno"},
      {id:"badreason",text:"Why not?",type:"text",smart:true,condition:()=>answers.day===false},
      {id:"feeling",text:"How are you feeling right now?",type:"yesno",yesText:"Happy",noText:"Tired"},
      {id:"energy",text:"Do you have enough energy?",type:"yesno"},
      {id:"color",text:"What's your favorite color?",type:"color"},
      {id:"important",text:"Who is most important to you?",type:"text",smart:true},
      {id:"food",text:"What's your favorite food?",type:"text",smart:true},
      {id:"hobby",text:"What's your favorite hobby?",type:"text",smart:true},
      {id:"coping",text:"What do you do when you're sad?",type:"text",smart:true},
      {id:"dream",text:"What's your dream?",type:"text",smart:true},
      {id:"music",text:"What's your favorite song?",type:"text",smart:true},
      {id:"person",text:"Who inspired you?",type:"text",smart:true}
    ];
  }
}

// Set content with fade
function setContent(html, callback){
  content.style.opacity=0;
  setTimeout(()=>{
    content.innerHTML=html;
    content.style.opacity=1;
    if(callback) callback();
  },300);
}

// Show question
function showQuestion(){
  const questions=getQuestions();
  if(qIndex>=questions.length){ buildValentineQuestion(); return; }
  const q=questions[qIndex];
  if(q.condition && !q.condition()){ qIndex++; showQuestion(); return; }

  if(q.type==="yesno"){
    setContent(`<h2>${q.text}</h2>
      <button class="yes" data-val="yes">${q.yesText|| (lang==="tl"?"Oo":"Yes")}</button>
      <button class="no" data-val="no">${q.noText|| (lang==="tl"?"Hindi":"No")}</button>`, attachListeners);
  } else if(q.type==="text"){
    setContent(`<h2>${q.text}</h2>
      <input id="answer" placeholder="${lang==="tl"?"Type mo dito":"Type here and press Enter"}">
      <div class="message" id="msg"></div>`, attachListeners);
  } else if(q.type==="color"){
    setContent(`<h2>${q.text}</h2><input type="color" id="colorPicker">`, attachListeners);
  }
}

// Attach listeners
function attachListeners(){
  // Yes/No buttons
  document.querySelectorAll('button[data-val]').forEach(btn=>{
    btn.onclick=()=>{
      const val=btn.dataset.val;
      const q=getQuestions()[qIndex];
      answers[q.id]=(val==="yes");
      qIndex++;
      showQuestion();
    };
  });

  // Text input
  const input=document.getElementById("answer");
  if(input){
    input.focus();
    input.onkeydown=(e)=>{
      if(e.key==="Enter" && input.value.trim()!==""){
        const q=getQuestions()[qIndex];
        answers[q.id]=input.value;

        if(q.smart){
          const msg=document.getElementById("msg");
          msg.style.opacity=0;
          msg.innerText=getSmartResponse(input.value,lang);
          setTimeout(()=>msg.style.opacity=1,50);
        }

        setTimeout(()=>{
          qIndex++;
          showQuestion();
        },3000); // 3-second delay
      }
    }
  }

  // Color picker
  const picker=document.getElementById("colorPicker");
  if(picker){
    picker.onchange=()=>{
      document.documentElement.style.setProperty("--theme",picker.value);
      document.body.style.background=`linear-gradient(135deg, ${picker.value}, #fad0c4)`;
      const q=getQuestions()[qIndex];
      answers[q.id]=picker.value;
      qIndex++;
      showQuestion();
    }
  }
}

// Language selection
function selectLanguage(){
  setContent(`<h2>Choose Language / Piliin ang Wika</h2>
    <button data-lang="en">English</button>
    <button data-lang="tl">Tagalog</button>`, ()=>{
      document.querySelectorAll('button[data-lang]').forEach(btn=>{
        btn.onclick=()=>{
          lang=btn.dataset.lang;
          qIndex=0;
          answers={};
          showQuestion();
        }
      });
    });
}

// Final Valentine question
function buildValentineQuestion(){
  setContent(`<h2>${lang==="tl"?"Ikaw ba ang magiging Valentine ko?":"Will you be my Valentine?"}</h2>
    <button id="yesBtn">${lang==="tl"?"Oo 💖":"Yes 💖"}</button>
    <button id="noBtn">${lang==="tl"?"Hindi :c":"No :c"}</button>`, ()=>{
      const yes=document.getElementById("yesBtn");
      const no=document.getElementById("noBtn");
      function moveNo(){ no.style.left=Math.random()*220+"px"; no.style.top=Math.random()*60+"px"; }
      no.addEventListener("mouseover",moveNo);
      no.addEventListener("touchstart",moveNo);
      yes.addEventListener("click", ()=>{
        setContent(`<h2>${lang==="tl"?"WOW TALAGA???? Happy Valentines! 💖💖":"Wow really???? Happy valentines 💖💖"}</h2>`);
      });
    });
}

// Start
selectLanguage();
