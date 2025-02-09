const quiz = {
    id: "uniqueID",
    questions: [
        { id: 1, text: "2 + 2 ได้เท่าไหร่?", choices: ["2", "3", "4", "5"], correct: "4" },
        { id: 2, text: "5 x 3 ได้เท่าไหร่?", choices: ["8", "15", "10", "20"], correct: "15" },
        { id: 3, text: "10 - 7 ได้เท่าไหร่?", choices: ["2", "3", "4", "5"], correct: "3" },
        { id: 4, text: "6 / 2 ได้เท่าไหร่?", choices: ["1", "2", "3", "4"], correct: "3" },
        { id: 5, text: "9 + 6 ได้เท่าไหร่?", choices: ["12", "14", "15", "16"], correct: "15" },
        { id: 6, text: "7 x 8 ได้เท่าไหร่?", choices: ["49", "56", "63", "70"], correct: "56" },
        { id: 7, text: "12 / 4 ได้เท่าไหร่?", choices: ["2", "3", "4", "5"], correct: "3" },
        { id: 8, text: "15 - 5 ได้เท่าไหร่?", choices: ["8", "9", "10", "11"], correct: "10" },
        { id: 9, text: "18 + 7 ได้เท่าไหร่?", choices: ["23", "24", "25", "26"], correct: "25" },
        { id: 10, text: "20 - 9 ได้เท่าไหร่?", choices: ["9", "10", "11", "12"], correct: "11" },
        { id: 11, text: "3 + 4 ได้เท่าไหร่?", choices: ["5", "6", "7", "8"], correct: "7" },
        { id: 12, text: "8 x 5 ได้เท่าไหร่?", choices: ["35", "40", "45", "50"], correct: "40" },
        { id: 13, text: "14 - 6 ได้เท่าไหร่?", choices: ["5", "7", "8", "9"], correct: "8" },
        { id: 14, text: "9 x 9 ได้เท่าไหร่?", choices: ["72", "81", "90", "99"], correct: "81" },
        { id: 15, text: "16 / 4 ได้เท่าไหร่?", choices: ["2", "3", "4", "5"], correct: "4" },
        { id: 16, text: "5 + 12 ได้เท่าไหร่?", choices: ["16", "17", "18", "19"], correct: "17" },
        { id: 17, text: "13 x 7 ได้เท่าไหร่?", choices: ["85", "90", "91", "95"], correct: "91" },
        { id: 18, text: "18 / 3 ได้เท่าไหร่?", choices: ["5", "6", "7", "8"], correct: "6" },
        { id: 19, text: "11 + 8 ได้เท่าไหร่?", choices: ["18", "19", "20", "21"], correct: "19" },
        { id: 20, text: "10 x 10 ได้เท่าไหร่?", choices: ["90", "100", "110", "120"], correct: "100" }
    ],
    timeLimit: 60, // วินาที
    passingScore: 60
};

let userAnswers = {};
let timer;
let startTime;
let randomQuestions = [];

function startQuiz(quizId) {
    localStorage.setItem("quizData", JSON.stringify(quiz));
    userAnswers = {};
    startTime = Date.now();
    randomQuestions = getRandomQuestions();
    displayQuestions();
    startTimer();

    document.getElementById("start-btn").style.display = "none"; // ซ่อนปุ่มเมื่อเริ่มทำข้อสอบ
    console.log("เริ่มทำข้อสอบ");
}

function getRandomQuestions() {
    const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, 5); // เลือก 5 ข้อจากทั้งหมด
}

function displayQuestions() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // ล้างข้อมูลเดิม

    randomQuestions.forEach(q => {
        const questionElem = document.createElement("div");
        questionElem.innerHTML = `
            <p>${q.text}</p>
            ${q.choices.map(choice => `
                <button onclick="submitAnswer(${q.id}, '${choice}')">${choice}</button>
            `).join("")}
        `;
        quizContainer.appendChild(questionElem);
    });
}

function submitAnswer(questionId, answer) {
    if (userAnswers[questionId]) return; // ไม่ให้เลือกคำตอบซ้ำ
    userAnswers[questionId] = answer;
    console.log(`ตอบคำถาม ${questionId}: ${answer}`);

    // เมื่อผู้ใช้ตอบครบ 5 ข้อแล้ว
    if (Object.keys(userAnswers).length === 5) {
        endQuiz();
    }
}

function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timer = setInterval(() => {
        const timeLeft = Math.max(0, quiz.timeLimit - Math.floor((Date.now() - startTime) / 1000));
        timerDisplay.innerText = `เวลาเหลือ: ${timeLeft} วินาที`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function calculateScore() {
    let correctCount = 0;
    randomQuestions.forEach(q => {
        if (userAnswers[q.id] === q.correct) {
            correctCount++;
        }
    });
    return correctCount; // คะแนน = จำนวนข้อที่ตอบถูก
}

function endQuiz() {
    const score = calculateScore();
    const results = document.getElementById("results");
    const scoreElement = document.getElementById("score");
    
    // ลบเวลาออก
    document.getElementById("timer").style.display = "none";

    results.innerHTML = "<h3>คำตอบของคุณ:</h3>";
    
    randomQuestions.forEach(q => {
        const userAnswer = userAnswers[q.id] ? userAnswers[q.id] : "ไม่ได้ตอบ";
        results.innerHTML += `
            <p>${q.text} | คุณตอบ: ${userAnswer}</p>
        `;
    });

    setTimeout(() => {
        results.innerHTML += "<h3>เฉลยข้อสอบ:</h3>";
        randomQuestions.forEach(q => {
            results.innerHTML += `
                <p>${q.text} คำตอบที่ถูกต้อง: ${q.correct}</p>
            `;
        });

        scoreElement.innerHTML = `คะแนนที่ได้: ${score} / 5 คะแนน`;
        console.log(`คะแนนที่ได้: ${score} / 5 คะแนน`);

        // แสดงปุ่มเริ่มใหม่
        document.getElementById("restart-container").style.display = "block";
    }, 1000); // แสดงคำเฉลยหลังจาก 1 วินาที
}


function restartQuiz() {
    // รีเซ็ตข้อมูลทั้งหมดและเริ่มทำข้อสอบใหม่
    document.getElementById("results").innerHTML = "";
    document.getElementById("score").innerHTML = "";
    document.getElementById("timer").style.display = "block"; 
    document.getElementById("timer").innerText = "เวลาเหลือ: 60";

   
    document.getElementById("restart-container").style.display = "none";

    
    document.getElementById("start-btn").style.display = "inline-block"; 
    startQuiz('uniqueID');
}


