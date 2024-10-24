/* 
    RESERVATIONS.JS

    An algorithm for making sure no resevations are overlapped
*/

// Use an ORM, or some other way to get this class from the data in your Database
class Reservation {
    constructor(beginDate, endDate) {
        if (new Date(endDate) < new Date(beginDate)) {
            throw new Error("End date cannot be before the begin date.");
        }

        this.beginDate = new Date(beginDate);
        this.endDate = new Date(endDate);
    }

    // Returns all dates that are reserved
    getBetweenDays() {
        var currentDate = new Date(this.beginDate);
        const dates = [];

        while (currentDate <= this.endDate) {
            dates.push(currentDate)
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }
}

// You should store your data in this array (used for checking and displaying reserved dates)
// Modify the script in a way where you get this from the backend 
// (or if you are doing this on the backend, modify it to get data from Database)
// Ensure this data is valid
const reservations = [
    new Reservation('2024-10-25', '2024-10-28'),
    new Reservation('2024-10-1', '2024-10-13'),
    new Reservation('2024-10-14', '2024-10-16'),
    new Reservation('2024-11-25', '2024-12-02')
];

function generateReservedDates(reservations) {
    const dates = []
    for (var i = 0; i < reservations.length; i++) {
        const reservationDates = reservations[i].getBetweenDays();
        for (var j = 0; j < reservationDates.length; j++) {
            dates.push(reservationDates[j]);
        }
    }

    return dates;
}

// In JS we have to compare dates using time, since date is an obj and will be compared by reference, not value
function isDateInArray(date, dateArray) {
    return dateArray.some(d => d.getTime() === date.getTime());
}

var reservedDates = generateReservedDates(reservations);


function reserve(startDate, endDate) {
    var reservation = new Reservation(startDate, endDate);
    const reservationDates = reservation.getBetweenDays();
    for (var i = 0; i < reservationDates.length; i++) {
        if (isDateInArray(reservationDates[i], reservedDates)) {
            throw new Error("Your reservation overlappes some reserved dates. Please select other dates");
        }
    }
    reservations.push(reservation);
    reservedDates = generateReservedDates(reservations);
}

// Used only for HTML purposes
function makeReservation() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        document.getElementById("message").innerText = "Please select both start and end dates.";
        return;
    }

    try {
        reserve(startDate, endDate);

        document.getElementById("message").innerText = "Reservation successful!";
        document.getElementById("message").style.color = "green";
    }
    catch (error) {
        document.getElementById("message").innerText = error.message;
        document.getElementById("message").style.color = "red";
    }
}