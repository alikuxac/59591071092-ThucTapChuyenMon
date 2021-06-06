const Discord = require("discord.js");
const now = new Date();

class Utils {

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    shuffle(array) {
        const arr = array.slice(0);
        for (let i = arr.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    list(arr, conj = 'and') {
        const len = arr.length;
        if (len === 0) return '';
        if (len === 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }

    shorten(text, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }

    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    removeFromArray(arr, value) {
        const index = arr.indexOf(value);
        if (index > -1) return arr.splice(index, 1);
        return arr;
    }

    removeDuplicates(arr = []) {
        if (arr.length === 0 || arr.length === 1) return arr;
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (newArr.includes(arr[i])) continue;
            newArr.push(arr[i]);
        }
        return newArr;
    }

    sortByName(arr, prop) {
        return arr.sort((a, b) => {
            if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        });
    }

    formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2
        });
    }

    formatNumberK(number) {
        return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
    }

    formatTime(time) {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time - (min * 60));
        const ms = time - sec - (min * 60);
        return `${min}:${sec.toString().padStart(2, '0')}.${ms.toFixed(4).slice(2)}`;
    }

    base64(text, mode = 'encode') {
        if (mode === 'encode') return Buffer.from(text).toString('base64');
        if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
        throw new TypeError(`${mode} is not a supported base64 mode.`);
    }

    embedURL(title = "", url = "", display = "") {
        return `[${title}](${url.replaceAll(')', '%29')}${display ? ` "${display}"` : ''})`;
    }

    escapeRegex(string = "") {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    titleCase(string = "", split = " ") {
        return string.toLowerCase().split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(split);
    }

    percentColor(pct, percentColors) {
        let i = 1;
        for (i; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        const lower = percentColors[i - 1];
        const upper = percentColors[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper)).toString(16).padStart(2, '0'),
            g: Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper)).toString(16).padStart(2, '0'),
            b: Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper)).toString(16).padStart(2, '0')
        };
        return `#${color.r}${color.g}${color.b}`;
    }

    msToHHMMSS(duration = 0) {
        let seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    replaceAll(str, match, replacement) {
        return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
    }

    createVoiceID() {
        const all = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
        let voiceKey = '';
        for (let i = 0; i < 6; i++) {
            const random = Math.floor((Math.random() * all.length) + 1);
            const char = all.charAt(random);
            voiceKey += char
        }
        return voiceKey;
    }
}

class DateUtils {
    today(timeZone = 0) {
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
        return now;
    }

    tomorrow(timeZone = 0) {
        const today = DateUtils.today(timeZone);
        today.setDate(today.getDate() + 1);
        return today;
    }

    yesterday(timeZone = 0) {
        const yesterday = DateUtils.today(timeZone);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    }

    formatDuration(ms = 0) {
        if (ms < 0) ms = -ms;
        const time = {
            day: Math.floor(ms / 86400000),
            hour: Math.floor(ms / 3600000) % 24,
            minute: Math.floor(ms / 60000) % 60,
            second: Math.floor(ms / 1000) % 60,
            millisecond: Math.floor(ms) % 1000
        };
        return Object.entries(time)
            .filter(val => val[1] !== 0)
            .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
            .join(', ');
    }

    formatSeconds(s = 0) {
        const [hour, minute, second, sign] =
            s > 0
                ? [s / 3600, (s / 60) % 60, s % 60, '']
                : [-s / 3600, (-s / 60) % 60, -s % 60, '-'];
        return (
            sign +
            [hour, minute, second]
                .map(v => `${Math.floor(v)}`.padStart(2, '0'))
                .join(':')
        );
    }

    toISOStringWithTimezone(date = new Date()) {
        const tzOffset = -date.getTimezoneOffset();
        const diff = tzOffset >= 0 ? '+' : '-';
        const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            diff + pad(tzOffset / 60) +
            ':' + pad(tzOffset % 60);
    }

    countWeekDaysBetween(startDate = new Date(), endDate = new Date()) {
        Array
            .from({ length: (endDate - startDate) / (1000 * 3600 * 24) })
            .reduce(count => {
                if (startDate.getDay() % 6 !== 0) count++;
                startDate = new Date(startDate.setDate(startDate.getDate() + 1));
                return count;
            }, 0);
    }

    addMinutesToDate(date = "", n = 0) {
        const d = new Date(date);
        d.setTime(d.getTime() + n * 60000);
        return d.toISOString().split('.')[0].replace('T', ' ');
    }

    isDateValid(...val) {
        return !Number.isNaN(new Date(...val).valueOf());
    }

    addWeekDays(startDate = new Date(), count = 0) {
        return Array.from({ length: count }).reduce(date => {
            date = new Date(date.setDate(date.getDate() + 1));
            if (date.getDay() % 6 === 0)
                date = new Date(date.setDate(date.getDate() + (date.getDay() / 6 + 1)));
            return date;
        }, startDate);
    }

    addDaysToDate(date = "", n = 0) {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d.toISOString().split('T')[0];
    }

    getColonTimeFromDate(date = new Date()) {
        return date.toTimeString().slice(0, 8);
    }

    isISOString(val = "") {
        const d = new Date(val);
        return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
    }

    quarterOfYear(date = new Date()) {
        return [Math.ceil((date.getMonth() + 1) / 3),
        date.getFullYear()];
    }

    dayOfYear(date = new Date()) {
        return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    }

    maxDates(...dates) {
        return new Date(Math.max(...dates));
    }

    minDates(...dates) {
        return new Date(Math.min(...dates));
    }

    dayName(date = new Date(), locale = "") {
        return date.toLocaleDateString(locale, { weekday: 'long' });
    }

    daysAgo(n = 0) {
        let d = new Date();
        d.setDate(d.getDate() - Math.abs(n));
        return d.toISOString().split('T')[0];
    }

    daysFromNow(n = 0) {
        let d = new Date();
        d.setDate(d.getDate() + Math.abs(n));
        return d.toISOString().split('T')[0];
    }

    getDaysDiffBetweenDates(dateInitial = new Date(), dateFinal = new Date()) {
        return (dateFinal - dateInitial) / (1000 * 3600 * 24);
    }

    getTimestamp(date = new Date()) {
        return Math.floor(date.getTime() / 1000);
    }

    lastDateOfMonth(date = new Date()) {
        let d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return d.toISOString().split('T')[0];
    }

    getMeridiemSuffixOfInteger(num = 0) {
        return num === 0 || num === 24
            ? 12 + 'am'
            : num === 12
                ? 12 + 'pm'
                : num < 12
                    ? (num % 12) + 'am'
                    : (num % 12) + 'pm';
    }

    getHoursDiffBetweenDates(dateInitial = new Date(), dateFinal = new Date()) {
        return (dateFinal - dateInitial) / (1000 * 3600);
    }

    getMinutesDiffBetweenDates(dateInitial = new Date(), dateFinal = new Date()) {
        return (dateFinal - dateInitial) / (1000 * 60);
    }

    getSecondsDiffBetweenDates(dateInitial = new Date(), dateFinal = new Date()) {
        return (dateFinal - dateInitial) / 1000;
    }

    fromTimestamp(timestamp = 0) {
        return new Date(timestamp * 1000);
    }

    isSameDate(dateA = new Date(), dateB = new Date()) {
        return dateA.toISOString() === dateB.toISOString();
    }

    isLeapYear(year = 0) {
        return new Date(year, 1, 29).getMonth() === 1;
    }

    isWeakDay(d = new Date()) {
        return d.getDay() % 6 !== 0;
    }

    isWeakend(d = new Date()) {
        return d.getDay() % 6 === 0;
    }

    isAfterDate(dateA = new Date(), dateB = new Date()) {
        return dateA > dateB;
    }

    isBeforeDate(dateA = new Date(), dateB = new Date()) {
        return dateA < dateB;
    }

    isSameDate(dateA = new Date(), dateB = new Date()) {
        return dateA.toISOString() === dateB.toISOString();
    }
}

class MusicUtils {
    async autoplay(client, player) {
        try {
            if (player.queue.length > 0) return;
            const previoustrack = player.get("previoustrack");
            if (!previoustrack) return;

            const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
            const response = await client.manager.search(mixURL, previoustrack.requester);
            //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
            if (!response || response.loadType === "LOAD_FAILED" || response.loadType !== "PLAYLIST_LOADED") {
                return player.stop();
            }
            player.queue.add(response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]);
            return player.play();
        } catch (e) {
            client.logger.log(e.stack)
        }
    }

    format(millis) {
        try {
            var h = Math.floor(millis / 3600000),
                m = Math.floor(millis / 60000),
                s = ((millis % 60000) / 1000).toFixed(0);
            if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
            else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
        } catch (e) {
            console.log(e.stack)
        }
    }

}

module.exports = {
    Utils: Utils,
    DateUtils: DateUtils,
    MusicUtils: MusicUtils
}