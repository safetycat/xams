app.controller(

  'QuestionEditorController',                          // name of the controller

  function($scope) {                                    // constructor function
    
    $scope.question.questionType.NONE              = 0;
    $scope.question.questionType.MULTIPLE_CHOICE   = 1;
    $scope.question.questionType.MULTIPLE_RESPONSE = 2;
    $scope.question.questionType.MATCH_QUESTION    = 3;
    $scope.question.questionType.LABEL_QUESTION    = 4;
    $scope.question.questionType.TRUE_OR_FALSE     = 5;
    $scope.question.questionType.QUESTION_GROUP    = 6;
    $scope.question.questionType.LONG_TEXT         = 7;
    $scope.question.questionType.TASK_GROUP        = 8;
    $scope.question.questionType.MULTI_TEXT        = 9;
    $scope.question.questionType.ASCX_QUESTION     = 10;
    $scope.question.questionType.TABLE_QUESTION    = 11;
    $scope.question.questionType.PAPER_PART        = 12;
    $scope.question.questionType.NEW               = 13;

    $scope.question.questionType.currentQuestionType = $scope.question.questionType.NONE;

    $scope.setQuestionType = function(questionType) {
      $scope.question.questionType.currentQuestionType = questionType
      if($scope.question.answerText) {$scope.question.answerText = ''}
    };

    $scope.cancelQuestionType = function() {
      $scope.question.questionType.currentQuestionType = $scope.question.questionType.NONE;
    };

    $scope.addAnswer = function(answerText) {
      if(!angular.isArray($scope.question.options)) {$scope.question.options = []}
      $scope.question.options.push({Score:0,Text:answerText});
      $scope.question.answerText = '';
    };

    /**
     * this associates the question with the menu item, does not save to server or anything
     */
    $scope.saveQuestion = function() {

      // $scope.question.questionType.currentQuestionType;
      // $scope.question.marks;
      // $scope.question.options
      // $scope.question.text
      // $scope.question.quid


      console.dir($scope.question);
      //console.dir($scope.questionsTree.get_selected_branch());
    };


    $scope.dropdown = [
      {
        "text": "Multiple Choice",
        click: 'setQuestionType(question.questionType.MULTIPLE_CHOICE)'
      },
      {
        "text": "Multiple Response",
        click: 'setQuestionType(question.questionType.MULTIPLE_RESPONSE)'
      },
      {
        "text": "Match Question",
        click: 'setQuestionType(question.questionType.MATCH_QUESTION)'
      },
      {
        "text": "Label Question",
        click: 'setQuestionType(question.questionType.LABEL_QUESTION)'
      },
      {
        "text": "True or False Question",
        click: 'setQuestionType(question.questionType.TRUE_OR_FALSE)'
      },
      {
        "text": "Question Group",
        click: 'setQuestionType(question.questionType.QUESTION_GROUP)'
      },
      {
        "text": "Long text question",
        click: 'setQuestionType(question.questionType.LONG_TEXT)'
      },
      {
        "text": "Task Group",
        click: 'setQuestionType(question.questionType.TASK_GROUP)'
      },
      {
        "text": "Multi-Text Question",
        click: 'setQuestionType(question.questionType.MULTI_TEXT)'
      },
      {
        "text": "ASCX Question",
        click: 'setQuestionType(question.questionType.ASCX_QUESTION)'
      },
      {
        "text": "Table Question",
        click: 'setQuestionType(question.questionType.TABLE_QUESTION)'
      },
      {
        "text": "Paper Part",
        click: 'setQuestionType(question.questionType.PAPER_PART)'
      }
    ];

  }

);  

      // {
      //   "divider": true
      // },