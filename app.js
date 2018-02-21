!function() {

	var data = [
		{
			prompt: 'Who was the star in Black Panther?',
			answers: [
				'Brad Pitt',
				'Jim Kelly',
				'Angela Bassett',
				'Rodger Moore',
				'Chadwick Boseman'
			],
			correctIndex: 4
		},{
			prompt: 'The Black Panther is a fictional Movie?',
			answers: [
				'Yes',
				'No',
				'Not Sure'
			],
			correctIndex: 0
		},{
			prompt: 'My Kids want to Watch Black Panther again?',
			answers: [
				'No they are done',
				'What is Black Panther?',
				'Yes, they loved it'
			],
			correctIndex: 2
		}
	];

	function Question(datum) {
		this.prompt = datum.prompt;
		this.answers = datum.answers;
		this.correctIndex = datum.correctIndex;
	}

	Question.prototype.checkAnswer = function(index) {
		return index === this.correctIndex;
	};

	Question.prototype.forEachAnswer = function(callback, context) {
		this.answers.forEach(callback, context);
	};


	function Quiz(data) {
		this.numberCorrect = 0;
		this.counter = 0;
		this.questions = [];

		this.addQuestions(data);
	}

	Quiz.prototype.addQuestions = function(data) {
		for (var i = 0; i < data.length; i++) {
			this.questions.push(new Question(data[i]));
		}
	};

	Quiz.prototype.advanceQuestion = function(lastAnswer) {
		if (this.currentQuestion && this.currentQuestion.checkAnswer(lastAnswer)) {
			this.numberCorrect++;
		}

		this.currentQuestion = this.questions[this.counter++];

		return this.currentQuestion;
	};


	function QuizApp(data) {
		this.data = data;
		this.introView = new IntroView('#quiz-intro', this);
		this.outroView = new OutroView('#quiz-outro', this);
		this.questionView = new QuestionView('#quiz-form', this);

		this.introView.attachEventHandlers();
		this.outroView.attachEventHandlers();
		this.questionView.attachEventHandlers();
	}

	QuizApp.prototype.startQuiz = function() {
		this.quiz = new Quiz(this.data);

		this.introView.toggle(true);
		this.outroView.toggle(true);
		this.questionView.toggle(false);

		this.nextQuestion();
	};

	QuizApp.prototype.nextQuestion = function(answer) {
		var nextQuestion = this.quiz.advanceQuestion(answer);

		if (nextQuestion) {
			this.questionView.setQuestion(nextQuestion);
		} else {
			this.endQuiz();
		}
	};

	QuizApp.prototype.endQuiz = function() {
		this.questionView.toggle(true);
		this.outroView.toggle(false);

		this.outroView.displayOutroMessage(this.quiz.numberCorrect, this.quiz.questions.length);
	};


	function IntroView(selector, quizApp) {
		this.element = $(selector);
		this.startButton = this.element.find('.start-button');
		this.quizApp = quizApp;
	}

	IntroView.prototype.attachEventHandlers = function() {
		var self = this;

		this.startButton.click(function() {
			self.quizApp.startQuiz();
		});
	};

	IntroView.prototype.toggle = function(hide) {
		this.element.toggleClass('hidden', hide);
	};


	function OutroView(selector, quizApp) {
		this.element = $(selector);
		this.resetButton = this.element.find('.reset-button');
		this.outroMessage = this.element.find('.quiz-outro-message');
		this.quizApp = quizApp;
	}

	OutroView.prototype.displayOutroMessage = function(numberCorrect, totalQuestions) {
		var message = 'You got ' + numberCorrect + ' questions right out of ' +
			totalQuestions + '. Would you like to try again?';

		this.outroMessage.html(message);
	};

	OutroView.prototype.attachEventHandlers = function() {
		var self = this;

		this.resetButton.click(function() {
			self.quizApp.startQuiz();
		});
	};

	OutroView.prototype.toggle = function(hide) {
		this.element.toggleClass('hidden', hide);
	};


	function QuestionView(selector, quizApp) {
		this.element = $(selector);
		this.submitAnswerButton = this.element.find('.submit-answer-button');
		this.questionContainer = this.element.find('.question-container');
		this.answersContainer = this.element.find('.answers-container');
		this.quizApp = quizApp;
	}

	QuestionView.prototype.attachEventHandlers = function() {
		var self = this;

		this.submitAnswerButton.click(function() {
			var checkedInput = self.answersContainer.find('input:checked');

			if (!checkedInput.length) alert('Please select an answer');
			else {
				var answer = +checkedInput.val();
				self.quizApp.nextQuestion(answer);
			}
		});
	};

	QuestionView.prototype.setQuestion = function(question) {
		var radios = '';

		this.questionContainer.text(question.prompt);

		question.forEachAnswer(function(answer, index) {
			radios +=
				'<li>' +
					'<input type="radio" name="answer" value="' + index + '" id="answer' + index + '"></input>' +
					'<label for="answer' + index + '">' + answer + '</label>' +
				'</li>';
		});

		this.answersContainer.html(radios);
	};

	QuestionView.prototype.toggle = function(hide) {
		this.element.toggleClass('hidden', hide);
	};


	$(function() {
		var quizApp = new QuizApp(data);
	});
}();
