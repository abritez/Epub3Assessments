// Create closure.
(function( $ ) {

    $.fn.epubmatching = function( options ) {
        var defaults = {
            groupLabels: ["Term", "Definition"],
            selectButtonLabel: "Select Pair",
            selectButtonStyles: null,
            description: null,
            answerElement: null,
            showSelectedItems: true,
            showAnswerItems: true
        };
        options = $.extend(defaults, options);

        this.selectionArray = [];
        this.answerArray = [];

        swapUI( this, options );
        createBtn(this, options);
        drawConnect(this);
        addListeners(this)
    };

    //loop all ols and turn to fieldsets and lis to radios and labels
    function swapUI(obj, options) {


        //store answers
        $(options.answerElement).children().each(function(e){
            obj.answerArray[e] = this.textContent
        });

        if(!options.showAnswerItems){
            $(options.answerElement).hide();
        }

        $(obj).find(".question > ol").each(function( index ) {
            var olIndex = index;
            $( this ).replaceWith(function(){
                var ele =  "<fieldset><legend>"+options.groupLabels[index]+"</legend><div class='radiogroup radiogroup"+ olIndex +"'>";
                $(this).children().each(function(index){
                    ele += "<label><span><input type='radio' name='group" + olIndex + "' value='" + $( this ).text() + "'></span> <span>"+ $( this ).text() +"<span></label>";
                });
                ele += "</div></label></fieldset>";
                return ele
            });
        });
        $(obj).wrap("<form></form>");
    }

    function createBtn(obj, options){
        //create a results list
        $(obj).append("<ol class='results-list' aria-live='assertive' aria-relevant='additions'></ol>");

        if(!options.showSelectedItems){
            $(obj)[0].querySelector(".results-list").className = "visibly-hidden";
        }

        $($(obj).find(".question .radiogroup")[0]).children().each(function(index){
            $(obj).find('.results-list').append("<li></li>");
        });

        $(".match-problem").append("<button class='matchingSubmit_btn "+ options.selectButtonStyles +"'>"+options.selectButtonLabel+"</button>")

        $(".match-problem > .matchingSubmit_btn").on('click', function(event){
            event.preventDefault();



            //get index to check answer
            var radioGroups = $(this).find(".radiogroup");
            var group0_index = $('input[type="radio"][name="group0"]:checked').closest('label').index(radioGroups[0]);
            var group1_index = $('input[type="radio"][name="group1"]:checked').closest('label').index(radioGroups[1]);

            var group0_value = $('input[type="radio"][name="group0"]:checked').val();
            var group1_value = $('input[type="radio"][name="group1"]:checked').val();


            obj.selectionArray[group0_index] = {
                radio_index: group1_index,
                group0_value: group0_value,
                group1_value: group1_value
            };

            var correctAnswer = obj.answerArray[group0_index];
            var selectedAnswer =  group1_value + " " + group0_value;

            if(correctAnswer == selectedAnswer){
                alert("correct")
            }else{
                alert('incorrect')
            }

            $('.results-list li:eq("'+ group0_index +'")').replaceWith('<li>'+obj.selectionArray[group0_index].group0_value+' <em>is connected with</em> ' + obj.selectionArray[group0_index].group1_value + '</li>');
        });
    }

    function addListeners(obj){
        $('input[type=radio][name="group0"]').change(function(e) {
            updateConnect();
        });
        $('input[type=radio][name="group1"]').change(function(e) {
            updateConnect();
        });

        $(window).resize(function(){
            updateConnect();
        });

        var updateConnect = function(){
            //checked 1
            if($('input[type=radio]:checked').length == 2){

                var radio_diameter = 15;

                //todo make definition and term dynamic
                //var aria_message = "The definition,  " + $('input[type="radio"][name="group0"]:checked').val() + " is connected to term " + $('input[type="radio"][name="group1"]:checked').val()
                //$('input[type=radio][name="group0"]:checked')[0].setAttribute("aria-label", aria_message);
                //$('input[type=radio][name="group1"]:checked')[0].setAttribute("aria-label", aria_message);

                var c1_position = $($('input[type=radio][name="group0"]:checked')[0]).position();
                var c2_position = $($('input[type=radio][name="group1"]:checked')[0]).position();

                $('.checkedConnector line')[0].setAttribute('x1', 0);
                $('.checkedConnector line')[0].setAttribute('x2', ((c2_position.left - c1_position.left)-radio_diameter));
                $('.checkedConnector')[0].setAttribute('width', ((c2_position.left - c1_position.left)-radio_diameter));
                $('.checkedConnector')[0].setAttribute('height', 400);
                $($('.checkedConnector')[0]).css('left', (c1_position.left + radio_diameter));
                $('.checkedConnector line')[0].setAttribute('y1', (c1_position.top + (radio_diameter/2)));
                $('.checkedConnector line')[0].setAttribute('y2', c2_position.top + (radio_diameter/2));
            }
        }
    }

     var drawConnect = function(obj){
        $(obj).append('<svg class="checkedConnector" width="0" height="0"><line style="stroke:rgb(255,0,0);stroke-width:2" /></svg>');
    }




})( jQuery );