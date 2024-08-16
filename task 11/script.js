
const genForm = document.getElementById('generator-form');
const genBtn = document.getElementById('gen-btn');
const copyBtn = document.getElementById('copy-btn');
const genContent = document.getElementById('gen-content');

// default count value is 5 & default option is 'paras;
let count = 5, option = "paras", tempCount = 0, tempOption = "";

// get user input count value
function getValues(){
    count = parseInt(genForm.gen_count.value);
    option = genForm.gen_options.value;
    validateValues();

    let url = `https://baconipsum.com/api/?type=meat-and-filler&${option}=${count}&start-with-lorem=1`;
    fetchContent(url);
}

// input text and option validation
function validateValues(){
    if(option === "words"){
        [tempCount, tempOption] = [count, option];
        [option, count] = ["paras", 100]; // 100 paragraphs will be generated and then words will be extracted from it

        if(tempCount > 2000){
            invalidInput();
            tempCount = 2000; // max words which can be generated is 2000 only
            genForm.gen_count.value = "2000";
        } else if(tempCount < 1 || isNaN(tempCount)){
            invalidInput();
            tempCount = 5; // min words is 5 
            genForm.gen_count.value = "5";
        }
    } else {
        tempCount = "";
        // paragraphs and sentences > 100 is not allowed
        if(count > 100){
            invalidInput();
            count = 100; // setting by default to 100 if larger value is entered
            genForm.gen_count.value = "100";
        } else if(count < 1 || isNaN(count)){
            invalidInput();
            count = 5;
            genForm.gen_count.value = "5"; // if value < 1 or invalid value is entered, then by default the value will be set to 5
        }
    }
}

function invalidInput(){
    genForm.gen_count.style.borderColor = "#ff6a67";
    setTimeout(() => {
        genForm.gen_count.style.borderColor = "#d3dbe4";
    }, 1000);
}

// fetching the randomly generated text
async function fetchContent(url){
    let response = await fetch(url);
    if(response.status === 200){
        let data = await response.json();
        displayGenContent(data);
    } else {
        alert("An error occurred");
    }
}

// displaying the generated random text
function displayGenContent(data){
    console.log(data);
    let texts = "";
    // we will generate entered no. of words by using paragraphs
    if(tempOption === "words"){
        tempOption = "";
        // in case of words by default 100 paragraphs will be generated
        texts = data.join();
        console.log(texts);
        if(tempCount <= texts.length){
            let textArray = texts.split(" ");
            let selectedText = textArray.splice(0, tempCount).join(" "); // selecting only the user entered no. of words
            genContent.innerHTML = selectedText + ".";
            return;
        }
    } else {
        texts = data.join("<br><br>"); // br for breaking lines
        genContent.innerHTML = texts;
    }
}

// copy text to clipboard
function copyToClipboard(){
    let copyText = genContent.textContent;
    navigator.clipboard.writeText(copyText);
}

// event listeners
genBtn.addEventListener('click', getValues);
window.addEventListener("DOMContentLoaded", getValues);
copyBtn.addEventListener('click', copyToClipboard);