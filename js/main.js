jQuery(function () {
    var Dict = [{
            'q': 'как называется наша галактика?', /*вопрос*/
            'a': 'млечный путь', /*ответ*/
            'v': ['андромеда', 'проксима', 'абракадабра', 'всмысле галактика  ? О_о  земля же плоская!'], /*варианты*/
            't': 0/*тип вопроса*/
        }, {
            'q': 'семь красных линий зеленым цветом нарисуешь?а перпендикулярных',
            'a': 'да конечно',
            'v': ['нет', 'это не возможно', 'не уверен', 'не знаю'], /*варианты*/
            't': 1
        },
        ], /*список  вопросов*/
        next = $('#next')/*кнопка далее*/,
        Questions = $('#Questions') /*область вопросов*/,
        current = 0/*указатель на  текущий вопрос*/,
        create = function (Question)/*функция создания вопроса*/ {
            type = 't' in Question ? Question.t : 0;//получаем  тип, если не задан значит один вариант  ответа
            wrapper = $('<form class="wrapper form-"  data-current="' + current + '"/>');
            p = $('<p/>');
            list = $('<ul />'); //html элемент со списком ответов
            ;
            p.html('<strong>' + Question.q + '</strong>');
            if (type == 0 || type == 1) {
                types = ['radio', 'checkbox'];
                type = types[type]

                $.each(Question.v, function (i, v) {
                    let li = $('<li class="form-group"/>'), label = $('<label>'), inp = $('<input>'),
                        id = 'Question_' + current + '_answer_' + i;

                    label.attr({'for': id}).text(v)
                    inp.attr({
                        'class': 'form-control',
                        'type': type,
                        'id': id,
                        'name': (type == 'radio' ? 'Question[' + current + ']' : 'Question[' + current + '][' + i + ']'),
                        'value': (type == 'radio' ? i : '')
                    });
                    li.append(label)
                    li.append(inp)
                    list.append(li)
                })
            } else if (type == 2) {

            }
            else {
            }
            wrapper.append(p)
            wrapper.append(list)
            Questions.html(wrapper[0].outerHTML);
        },
        renderResult = function ()/*рисуем таблицу  результатов*/ {
            table = $('<table class="table table-bordered">');
            tr = $('<tr/>')
            $.each(['вопрос', 'правильный овет', 'ваш ответ'], function (i, v) {
                //рисуем заголовки таблицы результатов
                tr = tr.append($('<th/>').text(v))

            });
            table.append(tr);
            $.each(Result, function (i, v) {

                answer = typeof v.result == 'object' && v.result.length > 0 && typeof v.result[0].value !== 'undefined' ? v.result[0].value : false;
                key = i - 1;
                if (typeof Dict[key] == 'undefined')
                    return true;//нет  такого вопроса
                type = 't' in Dict[key] ? Dict[key].t : 0;
                if (type == 0) {
                    A = Dict[key].v[answer]
                } else if (type == 1) {
                    let Items = []
                    $.each(v.result, (ii, vv) => {/*сттрелочная функция, фишка 2018*/
                        xach = vv.name.match(/(.+)]\[(\d+)\]/)//регулярное выражение вырезает  последний номер в квадратных скобках из  имени
                        Items.push('<li>' + Dict[key].v[xach[2]] + '</li>')
                    })
                    A = '<ul>' + Items.join('\n') + '</ul>';
                }
                tr = $('<tr/>')
                tr = tr.append(($('<td/>').text(Dict[key].q)))// вопрос
                tr = tr.append(($('<td/>').text(Dict[key].a)))//правильный овет
                tr = tr.append(($('<td/>').html(A)))//ваш ответ
                table.append(tr)
            });
            Questions.html(table[0].outerHTML);
        }, Result = [],     //массив  результатов
        goNext = function ()/*функция обработки перехода на следующий шаг*/ {
            let r = {'result': $('.wrapper').serializeArray(), 'start': new Date};

            Result[current] = r;
            if (current >= Dict.length) {
                renderResult();
                return false;
                /*следующий шаг не рисуем*/
            }
            create(Dict[current++]);

        }
    //вешаем событие на кнопку  далее
    next.on('click', goNext)

})
//(c)alal