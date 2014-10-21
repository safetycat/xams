(function() {
  var module = angular.module('angularBootstrapNavTree', []);

  module.directive('abnTree', ['$timeout', function($timeout) {
      



      return {
        restrict: 'E',
        templateUrl: "app/tree/abn_tree_template.html",
        replace: true,
        scope: {
          treeData: '=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '='
        },
          /**
           * function link 
           * links the directive with the HTML in the document and the data in the scope
           * The link function is invoked when AngularJS sets up each instance of the directive and receives three arguments: 
           * the SCOPE for the view in which the directive has been applied, 
           * the HTML element that the directive has been applied to, and 
           * the ATTRIBUTES of that HTML element. 
           **/
        link: function(scope, element, attrs) {
          var error;                // error handling method

          var expand_level = attrs.expandLevel ? parseInt(attrs.expandLevel, 10) : 3;  // default to 3 if expand level is unset
          var for_all_ancestors;    // itterator method
          var for_each_branch;      // itterator method

          var get_parent;           // helper method
          var expand_all_parents;   // helper method

          var n = scope.treeData.length;
          var on_treeData_change;   
          var select_branch = null;
          var selected_branch;
          var tree;
          var counter = 0;
        
          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
          
          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-folder-close  glyphicon glyphicon-folder-close  fa fa-folder';
          }
          
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-folder-open glyphicon glyphicon-folder-open fa fa-folder-open';
          }
          
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
                    
          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }

          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }

          scope.tree_rows = [];

          // -------------------- private methods ------------------ //

          /**
           * applies function f to all branches
           */
          for_each_branch = function(f) {
            var do_f;
            var root_branch;
            var _i;
            var _len;
            var _ref = scope.treeData;
            var _results = [];

              /**
               * apply the function f recursively to a branch
               */
              do_f = function(branch, level) {
                var child;
                var _i; 
                var _len;
                var _ref;
                var _results;

                f(branch, level);  // apply f to the branch

                if (branch.children != null) {
                  _ref = branch.children;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    _results.push(do_f(child, level + 1)); // recursive call
                  }
                  return _results;
                }
              }; // end do_f
            

            // apply do_f recursuvely to the whole tree (branch by branch)
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));  
            }

            return _results; // finally return the collection (where)
          };

          // ----------- //

          /**
           * selects a branch!
           * param: branch? 
           */
          select_branch = function(branch) {
            // calling with no param unselects all branches
            if (!branch) {  
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }

            if (branch !== selected_branch) {
              
              if (selected_branch != null) {
                selected_branch.selected = false;
              }

              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch); // open parents

              // call onSelect handler
              if (branch.onSelect != null) { 
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };


          /**
           * parent getter
           * param: child - node in list you want the parent of
           */
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };

          /**
           * itterate up tree applying function
           * param: child - the node to start from
           * fn - the function to apply
           */
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };

          /**
           * expands all parents
           * param: child - the node to start from 
           */
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };



          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };

          // ---------------------------------------------------------- //          

          /**
           * large function block triggered when treedata changes
           */
          on_treeData_change = function() {
            var add_branch_to_list; // method for adding a new branch
            var root_branch;        // pointer to root of tree
            var _i;                 // counter
            var _len;               // temp variable to hold array lengths
            var _ref;               // don?t know
            var _results;           // don?t know
            

            // add a unique id
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = b.quid || "" + counter++;
              }
            });

            console.log('UIDs are set.');

            // gives each child a parent_uid pointer (so you can traverse up the tree)
            for_each_branch(function(b) {
              var child;
              var _i;
              var _len;
              var _ref;       // holds pointer to child array in loop
              var _results;   // holds new array to return (to where?)

              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });

            scope.tree_rows = [];



            for_each_branch(function(branch) {
              var child;
              var f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };

                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child)); // call f 
                    }
                    return _results;
                  })();
                }
              } else {
                return //branch.children = [];  -- do not add children array to leaf nodes.
              }
            });

            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }

              if (!branch.children) {
                tree_icon = attrs.iconLeaf;
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              scope.tree_rows.push({
                level: level,
                branch: branch,
                label: branch.label,
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };

            // ---------------------------------------------------------- //

            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };
          
          // ---------------------------------------------------------- //

          scope.$watch('treeData', on_treeData_change, true);  // setup event handler
          
          // is there an initial selection attribute set?
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          
          //console.log('num root branches = ' + n);
          
          // open branches above the level we at
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });



          // ---------------------------------------------------------- //

          // create public methods
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {

              tree = scope.treeControl;
              
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;
                });
              };
              
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              
              tree.get_children = function(b) {
                return b.children;
              };
              
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };
              
              tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };

            }
          } // end definition of public methods

          // ---------------------------------------------------------- //
        }  // end link function ?

      }; // end return block ?
    }

  ]);

}).call(this);
