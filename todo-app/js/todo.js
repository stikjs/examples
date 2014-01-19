window.todoApp || (window.todoApp = {});

(function(){
  var template = '<li data-controller="TodosCtrl" ' +
                     'data-action="Show">' +
    '<div class="view">' +
      '<input class="toggle" type="checkbox" />' +
      '<label data-bind="task"></label>' +
      '<button class="destroy"></button>' +
    '</div>' +
    '<input class="edit" value="" />' +
  '</li>';

  function Todo(args){
    this.id = '#' + Math.floor(
      Math.random()*16777215
    ).toString(16);

    this.task = args.task;
    this.completed = false;
  }

  Todo.prototype.view = function(){
    return new DOMParser().
      parseFromString(template, "text/html").body.firstChild;
  }

  todoApp.Todo = Todo;
})();
