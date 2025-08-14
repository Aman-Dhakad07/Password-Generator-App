const passworddisplay = document.querySelector("[data-passworddisplay]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck  = document.querySelector("#lowercase");

const symbolCheck = document.querySelector("#symbols");

const numberCheck = document.querySelector("#numbers");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_+={[}]:;"<,>.?/';


let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();


//to set the password length on UI and in function
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+"% 100%"
}

//function to set the color in the indicator

function setIndicator(color){
     indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;


}


//function to get the random Integer

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

//funciton to get the random uppercase values
function generateuppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

//function to get the random lower case value
function generatelowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

//function to get the random number
function getRandomNumber(){
    return getRandomInteger(0,9);
}

//function to get Random symbol
function getRandomsymbol(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasupper=false;
    let haslower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasupper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasupper && haslower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }else if(
        (haslower || hasupper) &&
        (hasNum || hasSym) && 
        passwordLength>=6
    ) {
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}


// function to copy the function 

async function copyContent(){
    try{
        await  navigator.clipboard.writeText(passworddisplay.value);
        copyMsg.innerText="copied";
    }catch (e){
        copyMsg.classList.add("active");
        setTimeout( ()=>{
            copyMsg.classList.remove("active");
        },2000);
    }
}

//function to shuffle the generated pasword

function shufflePassword(array){
    //fisher yield method

    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    //store the shuffled password in the string 
    let str="";
    array.forEach((el) =>(str +=el));
    return str;
}


//function to handle Checkboxes

function handleCheckBoxchange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

    allCheckBox.forEach((checkbox)=>{
        checkbox.addEventListener('change',handleCheckBoxchange);
    });

    inputSlider.addEventListener('input',(e)=>{
        passwordLength = e.target.value;
        handleSlider();
    });

    copyBtn.addEventListener('click',()=>{
        if(passworddisplay.value)
            copyContent();
    });
    
 generateBtn.addEventListener('click',()=>{
        //none of the checkbox are selected 
           if(checkCount <=0) return;

           if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
           }
          //remove password
           password="";



           
        let funcArr =[];

        if(lowercaseCheck.checked)
            funcArr.push(generatelowercase);

         if(uppercaseCheck.checked)
            funcArr.push(generateuppercase);

          if(numberCheck.checked)
            funcArr.push(getRandomNumber);

           if(symbolCheck.checked)
            funcArr.push(getRandomsymbol);

           //compulsory addition
           for(let i=0;i<funcArr.length;i++){
            password += funcArr[i]();
           }

           

           for(let i=0 ;i<passwordLength-funcArr.length; i++){
            let randIndex = getRandomInteger(0,funcArr.length);
            password += funcArr[randIndex]();
           }

           // shuffle the password
           password = shufflePassword(Array.from(password));

           //show password
           passworddisplay.value = password;
           
           //calculate strength
           calcStrength();

        
    });