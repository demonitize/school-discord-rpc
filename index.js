const csv = require('csv-parser');
const discord_rpc = require('discord-rich-presence')('924324822421471242');
const fs = require('fs');
const results = [];

const beautified_lesson_names = {
    "wobi": "Meetup",
    "de": "German",
    "ge": "History",
    "ma": "Math",
    "Mittag": "Lunch",
    "bio": "Biology",
    "pb": "Political Science",
    "reli": "Religion🔫",
    "eng": "English",
    "phy": "Physics",
    "ku": "Art",
    "semi": "Seminar Course",
    "sp": "Sport",
    "": "Break"
}

const date = new Date();
const day_name = date.toLocaleDateString('en-US', { weekday: 'long' });
const current_time = date.toLocaleTimeString('de-DE');

fs.createReadStream('timetable.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    for (let i = 0; i < results.length; i++) {
      const time = results[i].time.split('-');
      const [hour_o, minute_o] = current_time.split(':').map((x) => parseInt(x));
      const [hour_n1, minute_n1] = time[0].split(':').map((x) => parseInt(x));
      const [hour_n2, minute_n2] = time[1].split(':').map((x) => parseInt(x));
      if (hour_o > hour_n1 || (hour_o === hour_n1 && minute_o >= minute_n1)) {
        if (hour_o < hour_n2 || (hour_o === hour_n2 && minute_o <= minute_n2)) {
            const lesson_start_time = new Date();
            lesson_start_time.setHours(hour_n1, minute_n1, 0, 0);

            const lesson_end_time = new Date();
            lesson_end_time.setHours(hour_n2, minute_n2, 0, 0);
            
            let current_status = "In school";
            let current_lesson = results[i][day_name];
            if (current_lesson) {
                current_lesson = beautified_lesson_names[current_lesson];
            }

            discord_rpc.updatePresence({
                state: current_status,
                details: "Currently in " + current_lesson,
                startTimestamp: lesson_start_time,
                endTimestamp: lesson_end_time,
                instance: true,
            });
        }
      }
    }
  });
