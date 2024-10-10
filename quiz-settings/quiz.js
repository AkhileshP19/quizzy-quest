const storedFormData = JSON.parse(localStorage.getItem('formData'))
const {noOfQues, category, difficulty} = storedFormData;
const container = document.querySelector('.container');
const timebarContainer = document.querySelector('.timebar-container')
const timebar = document.querySelector('.timebar');
const question = document.querySelector('.question');
const answers = document.querySelector('.allAnswers');
let allQuestions = [];
let allAnswers = [];
const allAnswersInStorage = [];
let allQuesCorrectAnswers = [];
let userSelectedAnswer;
let userAnswers = [];
const nextQuesBtnDiv = document.querySelector('.nextQuesBtnDiv');
let quesAndAnsTimeoutId;
let timebarTimeoutId;
const loaderContainer = document.querySelector('.loader-container')
const loader = document.querySelector('.loader');
let noOfQuesAttempted = 0;
let arrayToVerifyAnsAttemptedOrNot = new Array(noOfQues).fill(false); // Initialize array to track attempts for each question
let noOfCorrectAnswers = 0;
let playAgainBtn;

localStorage.setItem('userAns', JSON.stringify(userAnswers));

window.addEventListener('load', function() {
    // console.log(storedFormData);
    fetchQuiz();
})

async function fetchQuiz() {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${noOfQues}&category=${category}&difficulty=${difficulty}&type=multiple`);
        const result = await response.json();
        // console.log(result);
        displayResult(result.results);
    } catch (error) {
        console.log(error);        
    }
}

// Fisher yates shuffle algorithm:
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Get random index j
        [array[i], array[j]] = [array[j], array[i]];    // Swap array[i] and array[j]
    }
    return array;
}

function displayResult(result) {
    
    if (result?.length > 0) {
        loader.classList.add('hide'); 
        loaderContainer.style.height = '0';
        timebarContainer.classList.remove('hide');
    }

    let index = 0;

    function showQuestionAndOptions() {
        // console.log('showQuestionAndOptions() called');
        
        // console.log("index", index);
        
        if (index < result.length) {
            const item = result[index];
            // console.log(item.question);
    
            // console.log(`displayed ques ${index}`);
            question.innerText = `${index + 1}. ${item.question}`;
            allQuestions[index] = item.question;
            localStorage.setItem('allQuestionsInStorage', JSON.stringify(allQuestions));

            allQuesCorrectAnswers.push(item.correct_answer);
    
            answers.innerText = '';
            correctAnswer = item.correct_answer;
            // console.log(correctAnswer);
            allAnswers = [item.correct_answer, ...item.incorrect_answers];
            allAnswers = shuffleArray(allAnswers);
            allAnswersInStorage[index] = allAnswers;
            localStorage.setItem('allAnswersInStorage', JSON.stringify(allAnswersInStorage));
            // console.log(allAnswers);

            allAnswers.map((singleAns) => {                
                answers.innerHTML += `
                    <label class="userSelectedAnswerLabel block p-2 md:p-3 mb-2 bg-[#023047] text-white rounded-md cursor-pointer hover:bg-[#035582]">
                        <input class="userSelectedAnswer mr-2" type="radio" name="ans${index}" value="${singleAns}">
                        ${singleAns}
                    </label>
                `
            });
            
            userSelectedAnswer = document.querySelectorAll('.userSelectedAnswer');
            // console.log(userSelectedAnswer);
            
            userSelectedAnswer.forEach(singleAns => {
                singleAns.addEventListener('change', (e) => {
                    // console.log(e.target.value); 
                    userAnswers[index-1] = e.target.value;
                    // console.log(userAnswers, 'user answer');
                    localStorage.setItem('userAns', JSON.stringify(userAnswers));
                    if (!arrayToVerifyAnsAttemptedOrNot[index]) {
                        noOfQuesAttempted++; // Increment the number of questions attempted
                        arrayToVerifyAnsAttemptedOrNot[index] = true; // Mark this question as attempted
                    }
                });
            });

            let userSelectedAnswerLabel = document.querySelectorAll('.userSelectedAnswerLabel');
            userSelectedAnswerLabel.forEach(singleLabel => {
                singleLabel.addEventListener('click', () => {
                    userSelectedAnswerLabel.forEach(label => {
                        if (label.classList.contains('bg-[#035373]'))
                            label.classList.remove('bg-[#035373]');
                    })
                    singleLabel.classList.add('bg-[#035373]');
                })
            })

            nextQuesBtnDiv.innerHTML = `
                <button class="nextQuesBtn p-2 md:p-3 text-lg md:text-xl bg-[#023047] hover:bg-[#035373] rounded text-white font-bold">Go to next question</button>
            `

            if (index === noOfQues - 1) {
                const nextQuesBtn = document.querySelector('.nextQuesBtn');
                nextQuesBtn.innerText = 'End Quiz';
            }

            document.querySelector('.nextQuesBtn').addEventListener('click', () => {
                // console.log('clicked');    
                clearTimeout(quesAndAnsTimeoutId);
                count = 1;
                clearTimeout(timebarTimeoutId);
                updateTimeBar();
                showQuestionAndOptions();
            })
             
            index++;
            count = 1;
            clearTimeout(timebarTimeoutId);
            updateTimeBar();
            quesAndAnsTimeoutId = setTimeout(showQuestionAndOptions, 30000);
        } else {
            clearTimeout(quesAndAnsTimeoutId);
            clearTimeout(timebarTimeoutId);
            evaluateScore();
        }
    }

    showQuestionAndOptions();
}

function evaluateScore() {
    question.innerHTML = '';
    answers.innerHTML = '';
    nextQuesBtnDiv.innerHTML = '';
    
    // console.log("evaluateScore() called");
    // console.log(allQuesCorrectAnswers);
    let score = 0;
    for (let i = 0; i < noOfQues; i++) {
        const getUserChosenAnswers = JSON.parse(localStorage.getItem('userAns'));
        // console.log(getUserChosenAnswers);

        if (getUserChosenAnswers?.length > 0) {
            if (getUserChosenAnswers[i] === allQuesCorrectAnswers[i]) {
                score++;
                noOfCorrectAnswers++;
            }
        }
    }
    // console.log('score: ', score);  

    displayScoreAndSummary(score);
}

function displayScoreAndSummary(score) {
    // console.log("displayScore&SummaryCalled");
    
    const getAllQuestionsFromStorage = JSON.parse(localStorage.getItem('allQuestionsInStorage'));
    const getAllAnswersFromStorage = JSON.parse(localStorage.getItem('allAnswersInStorage'));
    const getUserChosenAnswers = JSON.parse(localStorage.getItem('userAns'));

    container.style.marginLeft = '0';
    container.style.marginRight = '0';
    container.classList.add('mx-auto')

    container.innerHTML = `
        <header class="flex flex-col items-center mb-4 pt-2 md:pt-5 mb-8 bg-[#023047] text-[#fb8500] pb-2">
            <div class="flex">
                <img src="../quizzy-quest-logo.png" class="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full mr-2" alt="logo">
                <h1 class="text-4xl md:text-5xl font-extrabold">QuizzyQuest</h1>
            </div>
            <p class="mt-2 text-lg md:text-xl italic">Unleash Your Knowledge Adventure!</p>
        </header>
    `

    container.innerHTML += `
        <div class="bg-[#023047] p-4 sm:w-[40vw] md:w-[50vw] lg:w-[60vw] font-bold mx-auto text-center">
            <div>
                <h1 class="text-[20px] md:text-[26px] text-center font-bold text-white mb-2 underline">Quiz Summary</h1>
                <div class="text-base md:text-lg">
                    <p class="text-white">Total no. of questions: ${noOfQues}</p>
                    <p class="text-white">No. of questions attempted: ${noOfQuesAttempted}</p>
                    <p class="text-yellow-400">No. of questions not attempted/skipped: ${noOfQues - noOfQuesAttempted}</p>
                    <p class="text-green-500">Correct: ${noOfCorrectAnswers}</p>
                    <p class="text-red-500">Wrong: ${noOfQues - noOfCorrectAnswers}</p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML += `
        <div class="flex justify-center md:justify-end w-full mt-4 mr-[5vw] rounded">
            <div class="flex items-center bg-[#023047] px-2 md:px-4 py-1">
                <div class="mr-2">
                    <img src="coin_thumbnail.png" class="coin w-[30px] h-[30px] md:w-[50px] md:h-[50px]" alt="coin_thumbnail" />
                </div>
                <div>
                    <p class="text-xl md:text-2xl font-bold text-[#fb8500]">Score: ${score}</p>
                </div>
            </div>
        </div>
    `

    for (let i = 0; i < noOfQues; i++) {
        container.innerHTML += `
            <p class="mx-8 text-base md:text-lg font-bold mt-6 mb-4">${i+1}. ${getAllQuestionsFromStorage[i]}</p>
        `

        for (let j = 0; j < 4; j++) {
            container.innerHTML += `
                    <h2 class="mx-10 md:mx-14 text-base md:text-lg summaryAllAnswers">${getAllAnswersFromStorage[i][j]}
                    </h2>
            `
        }
        const summaryAllAns = document.querySelectorAll('.summaryAllAnswers');
        // console.log(summaryAllAns, 'summaryAllAns');
        
        summaryAllAns.forEach(ans => {
            
            if (ans.innerText === allQuesCorrectAnswers[i]) {
                // console.log(ans, 'ans');
                ans.classList.add('bg-green-600', 'text-white')
            } else if (ans.innerText !== allQuesCorrectAnswers[i] && ans.innerText === getUserChosenAnswers[i]) {
                ans.classList.add('bg-red-600', 'text-white');
            } 
        })

        // console.log(getUserChosenAnswers[i]);
        
        if (getUserChosenAnswers?.length > 0) {
            if ((getUserChosenAnswers[i] ===         allQuesCorrectAnswers[i])) {
                container.innerHTML += '<p class="mt-2 text-sm md:text-base italic mx-10 md:mx-14">(Correct)</p>'
            } else if (getUserChosenAnswers[i] === null || getUserChosenAnswers[i] === undefined) {
                container.innerHTML += '<p class="mt-2 text-sm md:text-base italic mx-10 md:mx-14">(Answer not chosen)</p>'
            } 
            else if (getUserChosenAnswers[i] !== allQuesCorrectAnswers[i]){
                container.innerHTML += '<p class="mt-2 text-sm md:text-base italic mx-10 md:mx-14">(Wrong)</p>'
            }  
        } else {
            container.innerHTML += '<p class="mt-2 text-base italic mx-14">(Answer not chosen)</p>'
        }

    }

    container.innerHTML += `
        <div class="flex items-centers justify-center m-4">
            <button class="playAgainBtn mt-4 p-1.5 md:p-3 text-lg md:text-xl bg-[#023047] hover:bg-[#035373] rounded text-xl text-white font-bold">Play again</button>
        </div>
    `

    playAgainBtn = document.querySelector('.playAgainBtn');
    playAgainBtn.addEventListener('click', () => {
        window.location.href = 'quiz-settings.html'
    })

    userAnswers = [];
    localStorage.setItem('userAns', JSON.stringify(userAnswers));
}


let individualQuesTimeCount = 1;
let totalTimeCount = 1;
let totalTime = noOfQues * 30;

let count = 1;

function updateTimeBar() {
    timebar.style.width = `${3.33*count}%`;
    count++;
    timebarTimeoutId = setTimeout(updateTimeBar, 1000);   
}


