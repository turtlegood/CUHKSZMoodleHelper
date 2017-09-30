(function(){
    const ANS_KEY_ARR = ['1','2','3','4','5'];
    const POS_CONTROL_KEY_ARR = ['<','>'];

    var curQue = (() => {
        var curQueIdx = 1;

        var renderCurQue = (disableScrollTo) => {
            $(".mh-que-active").removeClass("mh-que-active");
            var $que = curQue.getQueEl();
            $que.addClass("mh-que-active");
            if(!disableScrollTo) {
                $('html, body')
                    .stop()
                    .animate({
                        scrollTop: $que.offset().top
                    }, 200);
            };
        }

        var getQueEl = (queIdx) => {
            queIdx = queIdx==undefined ? curQueIdx : queIdx;
            return $("#q" + queIdx);
        }

        var move = (step) => {
            var newQueIdx = curQueIdx + step;
            if(getQueEl(newQueIdx).length > 0) {
                curQueIdx = newQueIdx;
            }
            renderCurQue();
        }

        var init = () => {
            renderCurQue(true);
        }

        return {
            next() {
                move(1);
            },
            move: move,
            getQueEl: getQueEl,
            init: init,
        }
    })();

    function onAnsClick(ansIdx) {
        var $que = curQue.getQueEl();
        var $ans = $que.find('input[type=radio][id$='+ansIdx+']');
        $ans.click();
        curQue.next();
    }

    function onPosControlClick(deltaPos) {
        curQue.move(deltaPos);
    }

    var keyMapping = (() => {
        var mapping = {};
        for (var i = 0; i < ANS_KEY_ARR.length; ++i) {
            mapping[ANS_KEY_ARR[i]] = (function (idx) {
                return () => onAnsClick(idx);
            })(i);
        }
        mapping[POS_CONTROL_KEY_ARR[0]] = () => onPosControlClick(-1);
        mapping[POS_CONTROL_KEY_ARR[1]] = () => onPosControlClick(1);
        return mapping;
    })();

    function onKeyDown(e) {
        var runner = keyMapping[e.key];
        if (runner == undefined) return;
        runner();
    }

    function onInjectedDOMReady() {
        //TODO
    }

    function bootQuiz() {
        if(location.href.indexOf('quiz') == -1 || location.href.indexOf('attempt') == -1) {
            return;
        }

        $("body").keydown(onKeyDown);
        curQue.init();

        $.get(chrome.extension.getURL('/quiz.template.html'), function(data) {
            $(data).prependTo('#region-main div[role=main] form>div');
            onInjectedDOMReady();
        });

        // $(".answer input[type='radio']").click((e) => {
        //     var $target = $(e.target);
        //     var $que = $target.parents('.que.multichoice');
        //     var rawInputId = $target.attr('id');
        //     var jqInputId = rawInputId.replace(':','\\:');
        //     var queId = $que.attr('id');
        //     console.log(jqInputId, queId);
        // });
    }

    $(bootQuiz);

})();