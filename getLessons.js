const needle = require('needle');
const cheerio = require('cheerio');

module.exports = async function(week) {

    // week:
    // 1 - previous
    // 2 - current
    // 3 - next
    // 4 - next + 1
    // ...
    var URL = `https://eners.kgeu.ru/apish2.php?group=%D0%A2%D0%A0%D0%9F-1-20&week=${week}&type=one`;

    
    return needle('get', URL)
    .then(res => {
        let data = {};
        // console.log(res.statusCode);
        const $ = cheerio.load(res.body);
        let $body = $('body');
        let $days = $body.find('.card');
        $days.each((i, $day) => {
            // Date
            let date = $($day).find('a.tx-gray-800').text();
            data[i] = {date: date, lessons: []};
            
            let $lessons = $($day).find('.list-group-item');
            $lessons.each((j, $lesson) => {

                let $time = $($lesson).find('.col-sm-2');
                // Start time
                let startTime = $($time).find('strong.tx-inverse.tx-medium').text();
                // End time
                let endTime = $time
                    .clone()    // clone the element
                    .children() // select all the children
                    .remove()   // remove all the children
                    .end()  //a gain go back to selected element
                    .text()
                    .replace(/\n|\t| /g, ''); // delete all spaces
                let $name = $($lesson).find('.col-sm-6')
                // Type of lesson
                let type = $($name).find('span').text();
                // Lesson name
                let name = $($name).find('strong').text().replace(' ', '');
                // Place
                let place = $($lesson).find('.col-sm-4 span.tx-normal').text();
                // Teacher
                let teacher = $($lesson).find('.col-sm-4 span.text-muted').text().replace(' ', '');

                data[i].lessons.push({
                    type: type,
                    name: name,
                    place: place,
                    teacher: teacher,
                    start: startTime,
                    end: endTime
                });
            });
        })
        return data;
    })
    .catch(err => {throw err});
}