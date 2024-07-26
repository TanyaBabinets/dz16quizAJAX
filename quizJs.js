"use strict"

$(document).ready(function () {
    let timer;
    let timeLeft = 10;
    let currentQindex = 0;
    let questions = [];
    let score = 0;

    function loadQuest() {
        $.ajax({
            url: 'answers.json',
            dataType: 'json',
            success: function (data) {
                questions = data;
                showQuest();
                startTime();
            }
        });
    }
    //SHOW QUESTIONS
    function showQuest() {
        if (currentQindex < questions.length) {
            const quest = $('#questions');
            const answ = $('#answers');
            quest.empty();
            answ.empty();//после показа очищаем форму


            const currentQ = questions[currentQindex];
            const number = currentQindex + 1; //показываю номер вопроса на экране

            quest.append(`<div><i>Вопрос ${number}: </i></br><strong> ${currentQ.question}</strong></div>`);
            currentQ.answers.forEach((a, i) => {  //варианты ответа для текущего вопроса
                answ.append(`<div>
                <input type="checkbox" name="question-${currentQindex}"
                value="${a.correct}">${a.text}         
                </div>`);
            });//тут значения из json  - correct & text

        } else {
            finishQuiz();
        }
    }
//TIMER
    function startTime() {
        timeLeft = 10;
        $('#timeLeft').text(timeLeft);
        timer = setInterval(function () {
            if (timeLeft <= 0) {
                clearInterval(timer);
                $('#submitBtn').click();
            }
            else {
                timeLeft--;
                $('#timeLeft').text(timeLeft);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
  

    function finishQuiz() {
        const totalCorrectAnswers = questions.reduce((total, question) => { //выбираем правильные ответы
            return total + question.answers.filter(answer => answer.correct).length;
        }, 0);
        const checked = $('input[type=checkbox]:checked');
        let correctAnswersCount = 0;
        checked.each(function () {
            if ($(this).val() === 'true') {
                correctAnswersCount++;
                
            }
        });
       
        alert(`Поздравляем! Тест сдан на количество баллов: ${score} из ${totalCorrectAnswers}`);
        $('#questions').html(`
        <div>
            <strong>Поздравляем! Тест сдан на количество баллов: ${correctAnswersCount} из ${totalCorrectAnswers}</strong>
        </div>
    `);
        $('#timer').hide();
        $('#answers').hide();
        $('#submitBtn').hide();
        $('#questions').show();
    }
       
    function resetForm() { 
        currentQindex = 0;
        score = 0;
        $('quizForm')[0].reset();
    }

    $('#quizForm').submit(function (e) {
        e.preventDefault();
        stopTimer();
        const checked = $('input[type=checkbox]:checked'); //тут все отмеченные чекбоксы
        checked.each(function () {
            if ($(this).val() === 'true') { //если значение чекбокса true то плюсуем счет
                score++;
            }
        });
        currentQindex++;
        showQuest();
        if (currentQindex < questions.length) {
            startTime();
        }

    });

    loadQuest();

});