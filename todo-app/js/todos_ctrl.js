stik.register("TodosCtrl", "List", function($template, $courier, $viewBag){
  var self, tpl, todosElms, footer;

  self = this;
  self.todos = [];

  tpl             = $($template);
  listElm         = tpl.getElementById("todo-list");
  footer          = tpl.getElement("footer");
  completedMarker = tpl.getElementById("clear-completed");

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

    $viewBag.$render({
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

    $viewBag.$render({
      completed: completed.length
    });
  }

  $courier.$receive("todo-created", addTodo);
  $courier.$receive("todo-removed", removeTodo);
  $courier.$receive("todo-updated", updateListUI);
});

stik.register("TodosCtrl", "Show", function($template, $viewBag, $courier){
  var self      = this;
  console.log($);
  var tpl       = $($template);
  var toggle    = tpl.getElement(".toggle");
  var label     = tpl.getElement("label");
  var editInput = tpl.getElement(".edit");
  var remove    = tpl.getElement(".destroy");

  function updateView(todoData){
    $viewBag.$render(todoData);
  }

  toggle.addEvent("change", function(event){
    self.todo.completed = !self.todo.completed;
    tpl.toggleClass("completed", self.todo.completed);
    $courier.$send("todo-updated", self.todo);
  });

  label.addEvent("dblclick", function(event){
    tpl.addClass("editing");
    editInput.focus();
  });

  editInput.addEvent("keyup", function(event){
    if (event.key === "enter") {
      self.todo.task = event.target.value;

      updateView(self.todo);

      tpl.removeClass("editing");
    }
  }).addEvent("blur", function(event){
    tpl.removeClass("editing");
  });

  remove.addEvent("click", function(){
    $courier.$send("todo-removed", self.todo);
    tpl.destroy();
  });

  var unsubscribe = $courier.$receive("bind-todo", function(todoData){
    self.todo = todoData;
    updateView(self.todo);
    unsubscribe();
  });
});

stik.register("TodosCtrl", "New", function($template, $courier){
  var tpl = $($template);
  var input = tpl.getElement("input");

  input.addEvent("keyup", function(event){
    if (event.key === "enter") {
      var newTodo = new todoApp.Todo({task: event.target.value});

      $courier.$send("todo-created", newTodo);

      input.set("value", "");
    }
  });
});
