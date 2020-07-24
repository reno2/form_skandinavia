const validate = {

    init: function () {
        validate.setListener();
        validate.setPhoneoptions("#country");
        validate.formInputs = $("#form").find("input").not("input[type='hidden']");
    },
    dataToken: '4411ab8ee14736f68ad24c1b445ce5e15fa395b4',
    noticeNsg: {
        name: "Только быквы и - не более 25 символов",
        phone: "Объязательно, не более 25 символов",
        city: "Город должен быть указан",
        city2: "Город должен быть указан",
    },
    rulesValidate: {
        name: function (el) {
            return true;
            let res = el.match(/^[a-zа-я-]*$/i);
            if (el == "") return true;
            else {
                if (!!res == false || el.length >= 25) {

                    return false;
                } else {
                    return true;
                }
            }
        },
        phone: function (el) {
            let res = el.match(/^[0-9() +-]*$/);
            if (!!res == false || el.length >= 25 || el == "") return false;
            return true;
        },
        city: function (el) {
            if (el == "") return false;
            return true
        },
        city2: function (el) {

            if (el == "") return false;
            return true
        },
    },
    addNotice: function (el, msg) {
        $(el).addClass("b-error").after(`<span class="error">${msg}</span>`);
    },
    removeNotice: function (el) {
        if ($(el).parent().find(".error").length > 0) {
            $(el).parent().find(".error").remove();
            $(el).removeClass("b-error");
        }
    },
    formInputs: [],
    formClear:function(){
      $('#form').trigger('reset')
    },
    setListener: function () {
        $(document).on("submit", "#form", validate.formSubmit);
        $("#form").on("keydown", "input", function () {
            validate.removeNotice(this);
        });
        $('#city').on('keydown', validate.getAddresDatata);
        $('#city2').on('click', function () {
            validate.modalOpen('800px', 'Выбрать адрес', '<div id="map"></div>', validate.getArrresYaMap).then(function (st) {

                validate.yamapInit()
            })

        })
        $('.m-footer__close').on('click', validate.modalClose)
        $(document).on('click', '.b-modal__wrap', function (e) {

            if (e.target == $('.b-modal__wrap')[0])
                validate.modalClose()
        })

        $('body').on('click', '.i-dropdown .item', function () {
            $(this).parent().prev().val($(this).text());
            $(this).parent().remove();
        });

    },
    yamapInit: function () {
        var myPlacemark,
            myMap = new ymaps.Map('map', {
                center: [59.91807704072416, 30.304899499999895],
                zoom: 9
            }, {
                searchControlProvider: 'yandex#search'
            });

        // Слушаем клик на карте.
        myMap.events.add('click', function (e) {
            var coords = e.get('coords');

            // Если метка уже создана – просто передвигаем ее.
            if (myPlacemark) {
                myPlacemark.geometry.setCoordinates(coords);
            }
            // Если нет – создаем.
            else {
                myPlacemark = createPlacemark(coords);
                myMap.geoObjects.add(myPlacemark);
                // Слушаем событие окончания перетаскивания на метке.
                myPlacemark.events.add('dragend', function () {
                    getAddress(myPlacemark.geometry.getCoordinates());
                });
            }

            getAddress(coords);
        });

        // Создание метки.
        function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                iconCaption: 'поиск...'
            }, {
                preset: 'islands#violetDotIconWithCaption',
                draggable: true
            });
        }

        // Определяем адрес по координатам (обратное геокодирование).
        function getAddress(coords) {

            myPlacemark.properties.set('iconCaption', 'поиск...');
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);


                // Название населенного пункта или вышестоящее административно-территориальное образование.
                let r = [firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ]
                    .filter(Boolean).join(', ');

                myPlacemark.properties
                    .set({
                        // Формируем строку с данными об объекте.
                        iconCaption: [
                            // Название населенного пункта или вышестоящее административно-территориальное образование.
                            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                        ].filter(Boolean).join(', '),
                        // В качестве контента балуна задаем строку с адресом объекта.
                        balloonContent: firstGeoObject.getAddressLine()
                    });
                $('.select-addres').remove()
                if (r) {
                    $("<div/>", {
                        "class": "select-addres",
                        html: r
                    }).appendTo("#map");
                }
            })

        }
    },
    getArrresYaMap() {

        if ($('.select-addres') && $('.select-addres').text().length > 0) {
            $('#addres-yamap').val($('.select-addres').text());
            validate.removeNotice('#addres-yamap');
            validate.modalClose();
        }

    },

    getAddresDatata: function (e) {

        if (e.target.value.length > 3) {

            let q = e.target.value,
                element = $(e.target)

            $.ajax({
                type: 'POST',
                url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + validate.dataToken
                },
                data: JSON.stringify({
                    'query': q,
                    'count': 5
                }),
                success: function (response) {
                    if (element.next('.i-dropdown').length == 0) {
                        element.after('<div class="i-dropdown"></div>');
                    }
                    element.next('.i-dropdown').html('');
                    $.each(response.suggestions, function () {
                        element.next('.i-dropdown').append('<div class="item">' + this.value + '</div>');
                    });

                }
            })
        }
    },
    setPhoneoptions: function (el) {
        $.getJSON("js/phone-codes.json", function (data) {
            var items = [];
            $.each(data, function (key, val) {
                let selected;
                if (val.name_ru == "Россия") selected = "selected=selected";
                items.push(
                    "<option " +
                    selected +
                    "  value='" +
                    val.mask +
                    "'>" +
                    val.name_ru +
                    "</option>"
                );
            });
            $(el).prepend(
                "<select id='b-contries' class='b-phone__s'>" +
                items.join("") +
                "</select>"
            );
            $('#phone').attr('placeholder', '+7(999)999-99-99').mask('+7(999)999-99-99')
        }).done(function () {
            $("#b-contries").change(function () {
                validate.maskPhone("#b-contries");
            });
        });
    },
    maskPhone: function () {
        let mask = $("#b-contries option:selected").val();
        console.log(mask);
        $("#phone").attr('placeholder', mask).mask(mask);
    },
    formSubmit: function (e) {
        e.preventDefault();
        if (validate.formValidate($(this))) {
            let f = document.getElementById("form");
            let formData = new FormData(f);
            $.ajax({
                url: 'server.php',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                beforeSend: function() {
                    $('.i-sbt__btn').text('Идёт отправка...');
                },
                success: function ( data ) {
                    let msg = JSON.parse(data);
                    validate.modalOpen('400px', msg.title, msg.message);
                    validate.formClear();
                    $('.i-sbt__btn').text('Отправить');
                }
            });
            // Список пар ключ/значение
            for (let [name, value] of formData) {
                //console.log(`${name} = ${value}`); // key1=value1, потом key2=value2
            }
        }
    },
    formValidate: function (form) {
        //console.log(form);

        valid = true;
        validate.formInputs.each(function (inx, el) {
            let name = el.name;
            validate.removeNotice(el);

            //console.log(validate.rulesValidate[name].call(el, el.value));
            if (!validate.rulesValidate[name].call(el, el.value)) {
                validate.addNotice(el, validate.noticeNsg[name]);
                valid = false
            }
        });
        return valid
    },

    modalOpen(width, title, content, func = null) {
        return new Promise(function (resolve, reject) {
            let modal = $('.b-modal');
            modal.css('width', width);
            $('.b-modal__wrap').addClass('m-open');
            modal.find('.b-modal__title').html(title);

            modal.find('.m-content__inner').html(content);
            if (func)
                modal.find('.m-footer__action').css('display', 'block').on('click', func);
            else {
                modal.find('.m-footer__action').css('display', 'none');
            }
            resolve('good')
        })

    },
    modalClose() {
        $('.b-modal__wrap').removeClass('m-open');
    },
};

$(document).ready(function () {
    validate.init();

});
