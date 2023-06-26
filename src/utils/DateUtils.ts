import TimeAgo from "javascript-time-ago";
// English.
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const checkDateDifferenceInDays =(d1: Date, d2: Date) => {
    var Difference_In_Time = d2.getTime() - d1.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
}

export const postTimeStamp = (date: Date) =>{
    let days = Math.abs(checkDateDifferenceInDays(new Date(), date));    
    if (days > 5) {
        return date.toDateString().split(' ').slice(1).join(' ');
    } else {
        return timeAgo.format(date);
    }
}