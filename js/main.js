jQuery(function () {
    var Dict = [{
            'q': 'как называется наша галактика?', /*вопрос*/
            'a': 'млечный путь', /*ответ*/
            'v': ['андромеда', 'проксима', 'абракадабра', 'всмысле галактика  ? О_о  земля же плоская!', 'млечный путь'], /*варианты*/
            't': 0/*тип вопроса*/
        }, {
            'q': 'семь красных линий зеленым цветом нарисуешь?а перпендикулярных',
            'a': 'да конечно',
            'v': ['нет', 'это не возможно', 'не уверен', 'не знаю'], /*варианты*/
            't': 1
        },
            {
                'q': 'JavaScript это',
                'a': 'JavaScript — мультипарадигменный язык программирования. Поддерживает объектно-ориентированный, императивный и функциональный стили. Является реализацией языка ECMAScript. JavaScript обычно используется как встраиваемый язык для программного доступа к объектам приложений.',
                'v': ['Прототипно-ориентированный скриптовый язык программирования', 'Объектно-ориентированный скриптовый язык программирования', 'Скриптовой язык программирования',], /*варианты*/
                't': 1
            },
            {
                'q': 'какой сегодня день недели',
                'a': (new Date).toLocaleString('ru', {weekday: 'long'}),
                'v': ['full name weekday, russian please '], /*нулевой  используется в качестве  текста перед полем ввода*/
                't': 2
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
            LI = [];
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
                    LI.push(li)

                })
                list.append(Shuffle(LI))// перемесим
            } else if (type == 2) {

                let v = Question.v[0]/*эот  будет  использоваться для  лабел */, li = $('<li class="form-group"/>'),
                    label = $('<label>'), inp = $('<textarea>'),
                    id = 'Question_' + current + '_answer_' + 0;

                label.attr({'for': id}).text(v)
                inp.attr({
                    'class': 'form-control',
                    'type': type,
                    'id': id,
                    'name': 'Question[' + current + ']',
                    'value': ''
                });
                li.append(label)
                li.append(inp)
                list.append(li)

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
                let status = false /*правильно нет ? по  умолчанию не  правильно*/;
                answer = typeof v.result == 'object' && v.result.length > 0 && typeof v.result[0].value !== 'undefined' ? v.result[0].value : false;
                key = i - 1;
                if (typeof Dict[key] == 'undefined')
                    return true;//нет  такого вопроса
                type = 't' in Dict[key] ? Dict[key].t : 0;
                if (type == 0) {//radio
                    A = Dict[key].v[answer] || ''
                    status = A.toString().replace(/\s*/, ' ').toLocaleLowerCase() == Dict[key].a.replace(/\s*/, ' ').toLocaleLowerCase()
                } else if (type == 1) {//checkbox
                    let Items = []
                    $.each(v.result, (ii, vv) => {/*сттрелочная функция, фишка 2018*/
                        xach = vv.name.match(/(.+)]\[(\d+)\]/)//регулярное выражение вырезает  последний номер в квадратных скобках из  имени
                        Items.push('<li>' + Dict[key].v[xach[2]] + '</li>')
                    })
                    A = '<ul>' + Items.join('\n') + '</ul>';
                }
                else if (type == 2) {// textarea
                    A = answer || ''

                    status = A.toString().replace(/\s*/, ' ').toLocaleLowerCase() == Dict[key].a.replace(/\s*/, ' ').toLocaleLowerCase()
                }
                tr = $('<tr/>')
                tr.attr('class', status ? 'table-success' : 'table-danger')
                tr = tr.append(($('<td/>').text(Dict[key].q)))// вопрос
                tr = tr.append(($('<td/>').text(Dict[key].a)))//правильный овет
                tr = tr.append(($('<td/>').html(A)))//ваш ответ

                table.append(tr)


            });
            tr = $('<tr/>')
            tr = tr.append(($('<td colspan="3"/>').html('<ul><li class="text-success">правильно <code  class="text-success">' + table.find('tr.table-success').length + '</code></li><li class="text-danger"> не правильно <code>' + table.find('tr.table-danger').length + '</code></li>' + '<li class="text-info"> всего <code>' + (table.find('tr').length - 1) + '</code></li></ul>')))
            table.append(tr)
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

        }, compareRandom = function (a, b)/*штучка для перемешивания*/ {
            return Math.random() - 0.5;

        }
        , Shuffle = function (arr)/*мешалка*/ {
            return arr.sort(compareRandom);
        };
    //вешаем событие на кнопку  далее
    next.on('click', goNext)

})
//(c)alal