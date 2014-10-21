app.factory("treeInterface",function() {
  
  // provides shared methods for the 3 tree controllers
  
  treeInterface = {}

  // scope.questionstree is created by the directive
  // this will be populated wih a set of functions for navigating and controlling the tree.
  // expand_all :: function()
  // collapse_all :: function()
  // get_first_branch :: function()
  // select_first_branch :: function()
  // get_selected_branch :: function()  // 
  // get_parent_branch :: function(b)
  // select_branch :: function(b)
  // get_children :: function(b)
  // select_parent_branch :: function(b)
  // add_branch :: function(parent, :: new_branch)
  // add_root_branch :: function(new_branch)
  // expand_branch :: function(b)
  // collapse_branch :: function(b)
  // get_siblings :: function(b)
  // get_next_sibling :: function(b)
  // get_prev_sibling :: function(b)
  // select_next_sibling :: function(b)
  // select_prev_sibling :: function(b)
  // get_first_child :: function(b)
  // get_closest_ancestor_next_sibling :: function(b)
  // get_next_branch :: function(b)
  // select_next_branch :: function(b)
  // last_descendant :: function(b)
  // get_prev_branch :: function(b)
  // select_prev_branch :: function(b)

  // these functions (methods) attached to $scope define a public API
  // 'this' refers to $scope

  treeInterface.selectHandler = function(branch) {
    this.currentlySelectedBranch = branch;
    this.output = branch.label;
  };

  treeInterface.isFolder = function() {
    if (!Object.keys(this.questionsTree).length) return // we could somehow do better than this

    var sel = this.questionsTree.get_selected_branch();
    if(sel) {
      return angular.isArray(sel.children);
    }
  };

  treeInterface.isSelected = function() {
    if (!Object.keys(this.questionsTree).length) return // we could somehow do better than this

    return  this.questionsTree.get_selected_branch();
  }

  /**
   * adds a branch to the tree
   */
  treeInterface.addFolder = function() {
   if (!Object.keys(this.questionsTree).length) return // we could somehow do better than this

   var b = this.questionsTree.get_selected_branch();
   // is selected item a question?
   if(!b.children) {
    b = this.questionsTree.get_parent_branch(b); // if so add folder to its parent
   }
   var newb = this.questionsTree.add_branch( b, { "label" : "New Folder", "children" : [] } );
   this.questionsTree.select_branch(newb);
   this.questionsTree.expand_branch(newb);
   this.folderNameEditor.$show();
   // this is not right but no time to figure out component API

   setTimeout(function() {

      document.getElementById("rename").children[1].children[0].children[1].children[0].children[0].value = "New Folder";
    }, 200);
  };

  /**
   * adds a question to the tree
   */
   treeInterface.addQuestion = function() {
    if (!Object.keys(this.questionsTree).length) return // we could somehow do better than this

     var b = this.questionsTree.get_selected_branch();
     // is selected item a question?
     if(!b.children) {
      b = this.questionsTree.get_parent_branch(b); // if so add folder to its parent
     }
     var newb = this.questionsTree.add_branch( b, { "label" : "New Question" } );
     this.questionsTree.select_branch(newb);
     this.questionsTree.expand_branch(newb);  
   };

   treeInterface.addQuestionDisabled = function() {
    alert("Please select a folder to add the question to first");
   };

  /**
   * used to rename both folders and items
   */
   treeInterface.renameItem = function() {
    alert('what the foo?');
   }

   return treeInterface;
});