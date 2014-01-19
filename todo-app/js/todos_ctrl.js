stik.controller("TodosCtrl", "List", function($template, $courier, $viewBag){
  var self, todosElms, footer;

  self = this;
  self.todos = [];

  listElm         = $template.getElementById("todo-list");
  footer          = $template.getElement("footer");
  completedMarker = $template.getElementById("clear-completed");

  function addTodo(todo){
    self.todos.push(todo);
    $(todo.view()).inject(listElm);

    stik.bindLazy();
    $courier.$send("bind-todo", todo);

    listElm.setStyle("display", "block");

    updateFooter();
  }

  function removeTodo(todo){
    self.todos = self.todos.filter(function(td){
      return td.id !== todo.id;
    });

    updateFooter();
  }

  function updateFooter(){
    if (self.todos.length > 0) {
      footer.setStyle("display", "block");
    } else {
      footer.setStyle("display", "none");
    }

    $viewBag.$push({
      todosSize: self.todos.length
    });

    updateCompletedCount();
  }

  function updateListUI(todo){
    var index = self.todos.indexOf(todo);
    self.todos[index] = todo;

    updateCompletedCount();
  }

  function updateCompletedCount(){
    var completed = self.todos.filter(function(todo){
      return todo.completed;
    });

    if (completed.length > 0) {
      completedMarker.setStyle("display", "block");
    } else {
      completedMarker.setStyle("display", "none");
    }

    $viewBag.$push({
      completed: completed.length
    });
  }

  $courier.$receive("todo-created", addTodo);
  $courier.$receive("todo-removed", removeTodo);
  $courier.$receive("todo-updated", updateListUI);
});

stik.controller("TodosCtrl", "Show", function($template, $viewBag, $courier){
  var self      = this;

  var toggle    = $template.getElement(".toggle");
  var label     = $template.getElement("label");
  var editInput = $template.getElement(".edit");
  var remove    = $template.getElement(".destroy");

  function updateView(todoData){
    $viewBag.$push(todoData);
  }

  toggle.addEvent("change", function(event){
    self.todo.completed = !self.todo.completed;
    $template.toggleClass("completed", self.todo.completed);
    $courier.$send("todo-updated", self.todo);
  });

  label.addEvent("dblclick", function(event){
    $template.addClass("editing");
    editInput.focus();
  });

  editInput.addEvent("keyup", function(event){
    if (event.key === "enter") {
      self.todo.task = event.target.value;

      updateView(self.todo);

      $template.removeClass("editing");
    }
  }).addEvent("blur", function(event){
    $template.removeClass("editing");
  });

  remove.addEvent("click", function(){
    $courier.$send("todo-removed", self.todo);
    $template.destroy();
  });

  var unsubscribe = $courier.$receive("bind-todo", function(todoData){
    self.todo = todoData;
    updateView(self.todo);
    unsubscribe();
  });
});

stik.controller("TodosCtrl", "New", function($template, $courier){
  var input = $template.getElement("input");

  input.addEvent("keyup", function(event){
    if (event.key === "enter") {
      var newTodo = new todoApp.Todo({task: event.target.value});

      $courier.$send("todo-created", newTodo);

      input.set("value", "");
    }
  });
});
