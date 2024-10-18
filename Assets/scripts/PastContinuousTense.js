// script.js

let currentQuestion = 0;
const questions = [
  {
    text: "He ___ apples when I called.",
    options: ["was eating", "ate", "eating"],
    correctAnswer: "was eating"
  },
  {
    text: "She ___ to school when it started raining.",
    options: ["was going", "went", "is going"],
    correctAnswer: "was going"
  },
  {
    text: "They ___ football at 4 pm yesterday.",
    options: ["was playing", "were playing", "played"],
    correctAnswer: "were playing"
  },
  {
    text: "It ___ while we were driving.",
    options: ["was raining", "rains", "rained"],
    correctAnswer: "was raining"
  },
  {
    text: "We ___ dinner when the phone rang.",
    options: ["were having", "was having", "had"],
    correctAnswer: "were having"
  }
];

const totalQuestions = questions.length;
const progressBar = document.getElementById('progress-bar');
const feedback = document.getElementById('feedback');
const questionText = document.getElementById('question-text');
const optionsContainer = document.querySelector('.multiple-choice-container');

// Update question and options
function updateQuestion() {
  // Update the question text
  questionText.textContent = questions[currentQuestion].text;

  // Clear previous options
  optionsContainer.innerHTML = '';

  // Generate new options dynamically
  const formElement = document.createElement('form');
  formElement.id = 'quiz-form';

  questions[currentQuestion].options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = `choice${index + 1}`;
    radioButton.name = 'verb';
    radioButton.value = option;

    const label = document.createElement('label');
    label.htmlFor = `choice${index + 1}`;
    label.textContent = option;

    optionDiv.appendChild(radioButton);
    optionDiv.appendChild(label);
    formElement.appendChild(optionDiv);
  });

  // Masukkan tombol "Periksa" ke dalam form, bukan button-container
  const submitDiv = document.createElement('div');
  submitDiv.classList.add('check-div');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Periksa';
  submitButton.classList.add('check-button'); 
  submitDiv.appendChild(submitButton);
  formElement.appendChild(submitDiv);

  // Add event listener for the form submission
  formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedOption = document.querySelector('input[name="verb"]:checked');
    
    if (selectedOption) {
      if (selectedOption.value === questions[currentQuestion].correctAnswer) {
        feedback.textContent = 'Correct!';
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');

        // Move to the next question if correct
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
          updateQuestion();
          updateProgressBar();
        } else {
          feedback.textContent = 'Quiz Completed!';
          optionsContainer.innerHTML = ''; // Clear options after completion
        }
      } else {
        feedback.textContent = 'Try again.';
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
      }
    } else {
      feedback.textContent = 'Please select an answer.';
      feedback.classList.remove('correct', 'incorrect');
    }
  });

  optionsContainer.appendChild(formElement);
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  progressBar.style.width = progress + "%";
}

// Initial setup
updateQuestion();
updateProgressBar();

// Material Pop-up
const materialButton = document.getElementById('material-button');
const materialPopup = document.getElementById('material-popup');
const closePopup = document.querySelector('.close');

materialButton.addEventListener('click', function () {
  materialPopup.style.display = 'block';
});

closePopup.addEventListener('click', function () {
  materialPopup.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === materialPopup) {
    materialPopup.style.display = 'none';
  }
});

// Exit button to reset the quiz and redirect to Past Continuous Tense section
document.getElementById('exit-button').addEventListener('click', function () {
  currentQuestion = 0;
  updateQuestion();
  updateProgressBar();
  feedback.textContent = ''; // Clear any feedback
  window.location.href = "../main.html#pastContinuousTense"; // Redirects to Past Continuous Tense section
});

