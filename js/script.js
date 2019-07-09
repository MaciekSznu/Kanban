'use strict';
//instrukcja powodująca wykonanie kodu dopiero po załadowaniu całego DOM
document.addEventListener('DOMContentLoaded', function() {
    //funkcja generująca losową nazwę 
    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    //funkcja pobierająca templatkę HTML z index.html, parsująca, renderująca z użyciem naszej biblioteki szablonów, a następnie zwracająca gotowy rezultat 
    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');
      
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
      
        return element;
    }
    //funkcja gereująca klasę Column
    function Column(name) {
        var self = this;
      
        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', { name: this.name, id: this.id });
      
        this.element.querySelector('.column').addEventListener('click', function (event) {
          if (event.target.classList.contains('btn-delete')) {
            self.removeColumn();
          }
      
          if (event.target.classList.contains('add-card')) {
            self.addCard(new Card(prompt("Enter the name of the card")));
          }
        });
    }
    //metody na usuwanie kolumn oraz dodawanie kart
    Column.prototype = {
        addCard: function(card) {
          this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function() {
          this.element.parentNode.removeChild(this.element);
        }
    };
    //funkcja konstruująca kartę + eventlistenery
    function Card(description) {
        var self = this;
      
        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', { description: this.description || 'No name card'}, 'li');
      
        this.element.querySelector('.card').addEventListener('click', function (event) {
          event.stopPropagation();
      
          if (event.target.classList.contains('btn-delete-card')) {
            self.removeCard();
          }
        });
    }
    //metoda usuwająca kartę
    Card.prototype = {
        removeCard: function() {
            this.element.parentNode.removeChild(this.element);
        }
    };
    // obiekt tablicy 
    var board = {
      name: 'Kanban Board',
      addColumn: function(column) {
        this.element.appendChild(column.element);
        initSortable(column.id); 
      },
      element: document.querySelector('#board .column-container')
    };
    //funkcja sortująca
    function initSortable(id) {
      var el = document.getElementById(id);
      var sortable = Sortable.create(el, {
        group: 'kanban',
        sort: true
      });
    };
    //funkcja obsługująca przycisk dodający kolumnę
    document.querySelector('#board .create-column').addEventListener('click', function() {
      var name = prompt('Enter a column name');
      var column = new Column(name || 'No name column');
      board.addColumn(column);
    });
    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('In progress');
    var doneColumn = new Column('Done');
    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);
    // CREATING CARDS
    // var card1 = new Card('New task');
    // var card2 = new Card('Create kanban boards');
    // var card3 = new Card('New task 2');
    // var card4 = new Card('Create kanban boards 3');
    // ADDING CARDS TO COLUMNS
    // todoColumn.addCard(card1);
    // todoColumn.addCard(card2);
    // todoColumn.addCard(card3);
    // todoColumn.addCard(card4);
});