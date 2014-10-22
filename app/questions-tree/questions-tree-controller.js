
app.controller(

  'QuestionsTreeController',                            // name of the controller

  function($scope, $timeout, $http, treeInterface) {    // constructor function

    var qTree;                                          // private controller property

    var dataUrl = "http://localhost:5500/questions/";   // url of questions

    $scope.questionsTree = {};                          // the directive attaches its API to this
    
    $scope.question = {}
    $scope.question.questionType = {};


    $scope.questions = [];                              // initialise tree with empty object to be replaced when data loaded



    $http.get(dataUrl)
        .success(function(data){
            $scope.questions = data;
//            $scope.questionsTree.select_branch($scope.questionsTree.get_first_branch());
        })
        .error(function(error){
            $scope.questions.error = error;
        });


    var downloadQuestionData = function(uid) {
      var url = "http://localhost:5500/question/"+uid;

      $http.get(url)
        .success(function(data){
            $scope.question.marks = data.marks;
            $scope.question.options = data.options;
            $scope.question.text = data.text;
            $scope.question.quid = data.id;
            $scope.question.questionType.currentQuestionType = data.type;
        })
        .error(function(error){
            // fail silent for now.
            //$scope.questions.error = error;
            if($scope.question.questionType.currentQuestionType != 13) {
                alert('This question has no data in this demo. \n\nPlease select from inside the Practice Questions / New Folder area\n\nand Practice Questions / New Folder / Task 1 area');
            } 
            $scope.question.questionType.currentQuestionType = 0;
        });
    };

    $scope.selectHandler = function(branch) {
      if(!$scope.isFolder()) {
        console.log(branch.uid);
        downloadQuestionData(branch.uid);
      }

      $scope.currentlySelectedBranch = branch;
      $scope.output = branch.label;
    };

    $scope.isFolder = treeInterface.isFolder;

    $scope.isSelected = treeInterface.isSelected;

    $scope.addFolder = treeInterface.addFolder;

    $scope.addQuestion = treeInterface.addQuestion

    $scope.renameItem = treeInterface.renameItem;

    $scope.addQuestionDisabled = treeInterface.addQuestionDisabled;

    $scope.renamer = function(data) {
        var branch = $scope.questionsTree.get_selected_branch();
        branch.label = data;
        $scope.output = branch.label;
    };
});  

