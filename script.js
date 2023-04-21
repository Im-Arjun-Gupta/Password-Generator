const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*()-_=+\|:,<.>/?';

// pre-required entry in the application
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();
// handleSlider will change the length number according to slider value
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (passwordLength)*100/max + "% 100%"
}

// setIndicator will change the color of the div
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // add shadow of that color
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// getRndInteger will give the number between max and min
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min; // floor will give round off the number
}

// generateRandomNumber will give a random number between 0 and 9
function generateRandomNumber(){
    return getRndInteger(0, 9);
}

// generateLowerCase will give a random number between 97 and 123 and then convert it into string
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123))
}

// generateUpperCase will give a random number between 65 and 91 and then convert it into string
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91))
}

// generateSymbols will give a number and behalf of that it will take a char from symbols variable
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// calcStrength will give an color according to the check box and password length
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    
    // if the check box is checked then set the value to true
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if((hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

// copyContent will copy the text to clipboard and set timeout function using active class concept
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // copy to clipboard
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( () => { // timeout function
        copyMsg.classList.remove("active");
    }, 2000);
}

// shufflePassword will shuffle the password using Fisher Yates Method
function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// handleCheckBoxChange will count everytime when the checkbox is being clicked
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// allCheckBox will add event listner to all the checkbox
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// inputSlider will change the password length according to the slider value
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// copyBtn will copy the content to the clipboard if it is not empty
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // if none of the checkbox is selected
    if(checkCount == 0){
        return;
    }

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // generate the password
    
    //remove old password
    password = "";

    // let put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    // new way to add character in the password

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password and send it by converting into array
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
});

