# Форма  проверкой и валидацией

За обработку на фронтенде отчечает объект с методами.
### Форма
 - [Ссылка](http://form.btrue.ru/)    
### Цвета
 - Взяты из сервиса    [color.adobe](https://color.adobe.com/)
 - ![colors](http://form.btrue.ru/Screenshot_4.png)    
### Поля адреса

  - Сервис daData
  - yandex maps api

### Телефон

  - Кода городов подгружаются из json (без флагов)
  - по событию подстваляется маска
  - 
### Модальное окно
   - Динамическое формирование
   - Отдельные методы принимат параметры (ширина, заголовок, контент, функция на кнопку действия)
### Защита от спама
  - Через простой инпут, если он заполнен, то форма не проходит
  
### Защита на сторне сервера 
   - Экранирование символов
   - Удаление тегов
   - Преодразование в html сущности
    
