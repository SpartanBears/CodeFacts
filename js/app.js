/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        this.initInterface();
    },

    initInterface: function(){

        this.loadBookData();
        this.initMaterializeElements();
        
        //prevents illegal characters
        $(function() {
            $('#codeLinesInput').on('keydown', function(e) {
                -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault()
            });
        });
    },

    initMaterializeElements: function(){

        //book select
        $('#bookSelect').material_select();
    }, 

    //loads book data and set the update events
    loadBookData: function(){

        //TODO

        $('#bookSelect').on('change', this.events.bookSelectEvt.bind(this));
        $('#codeLinesInput').on('change paste keyup', this.events.linesInputEvt.bind(this));
    },

    updateResult: function(){

        if(this.validateBookSelect() && this.validateLinesInput()){

            var devLines = this.getLinesInput();
            var devWords = this.getWordsFromLines(devLines);
            
            var book = this.getSelectedBook();

            var times = this.getTimesPerBook(book.words, devWords);

            this.setResultTimesPerBook(times);
            this.setResultBookTitle(book.title);

            $('#resultCol').show();
        }
    },

    getLinesInput: function(){

        var lines = 0;

        var linesInputVal = $('#codeLinesInput').val();

        if($.isNumeric(linesInputVal)){

            lines = linesInputVal;
        }

        return lines;
    },

    getSelectedBook: function(){

        var book = {};

        var title = $('option:selected', '#bookSelect').text();
        var words = $('option:selected', '#bookSelect').val();

        book.title = title;
        book.words = words;

        return book;
    },

    setResultTimesPerBook: function(times){

        $('#resultTimesPerBook').html(times);
    },

    setResultBookTitle: function(book){

        $('#resultBookTitle').html(book);
    },

    getWordsFromLines: function(lines){

        //words per line average
        var factor = 3;

        return (lines*factor);
    },

    //returns type number
    getTimesPerBook: function(wordsBook, wordsDev){

        var times = "";

        //rounded to 1 decimal point
        //var round = Math.round((wordsDev/wordsBook)*10)/10;
        var calc = wordsDev/wordsBook;

        var whole = Math.floor(calc);
        var floating = (Math.round(calc*100)/100) % 1;
        var fraction = new Fraction(floating).toFraction();

        if(whole > 0){
            times += whole;

            if(floating > 0){

                times += " and " + fraction;
            }

        }else if(floating > 0){

            times += fraction;

        }else{

            times = 0;
        }


        return times;
    },

    events:{
        bookSelectEvt:function(e){

            this.updateResult();
        },
        linesInputEvt:function(e){

            this.updateResult();
        }
    },

    //prevents negative numbers and illegal characters
    validateLinesInput:function(){

        return $('#codeLinesInput').val().length > 0;
    },

    //returns false if no book has been selected
    validateBookSelect:function(){

        return this.getSelectedBook().words != "default";
    }
};

app.initialize();