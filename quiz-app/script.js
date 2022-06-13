const quizData = [
  {
    question: "Which is the most beautiful country listed below?",
    a: "Mexico",
    b: "Columbia",
    c: "Peru",
    d: "Guatemala",
    correct: "b",
  },
  {
    question: "What is the most used language in Latin America? ",
    a: "English",
    b: "Chinese",
    c: "French",
    d: "Spanish",
    correct: "d",
  },
  {
    question: "Which country is most distant from China?",
    a: "Russia",
    b: "England",
    c: "Argentina",
    d: "Estonia",
    correct: "c",
  },
  {
    question: "What nationality was artist Henri Matisse?",
    a: "France",
    b: "Austria",
    c: "Germany",
    d: "Italy",
    correct: "a",
  },
  {
    question: "In what year did the Beatles first go to the USA?",
    a: "1970",
    b: "1964",
    c: "1959",
    d: "1966",
    correct: "b",
  },
];
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const quiz = document.getElementById("quiz-container");
const aText = document.getElementById("a-text");
const bText = document.getElementById("b-text");
const cText = document.getElementById("c-text");
const dText = document.getElementById("d-text");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;
loadQuiz();

function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];
  questionEl.innerText = currentQuizData.question;
  aText.innerText = currentQuizData.a;
  bText.innerText = currentQuizData.b;
  cText.innerText = currentQuizData.c;
  dText.innerText = currentQuizData.d;
}

function getSelectedAnswer() {
  let answer = undefined;

  answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.id;
    }
  });

  return answer;
}

function deselectAnswers() {
  const answerEls = document.querySelectorAll(".answer");
  answerEls.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

submitBtn.addEventListener("click", function () {
  const answer = getSelectedAnswer();

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }

    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      if (score === 5) {
        quiz.innerHTML = `
        <h3> Congratulation! <br>You answered all questions correctly! </h3>
        <button onclick="location.reload()">Reload</button>`;
      } else {
        quiz.innerHTML = `
        <h3> You answered correctly at <br> ${score}/${quizData.length} questions. </h3>
        <button onclick="location.reload()">Reload</button>`;
      }
    }
  }
});
