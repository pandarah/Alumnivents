$(document).ready(function() {
    $('.ui.accordion').accordion();
    $('.ui.modal').modal({
        allowMultiple: false,
    });
    $('.ui.rating').rating({
        maxRating: 5,
        interactive: false,
    });
    $('.ui.rating.event-rating').rating({
        maxRating: 5,
    });
    $('#login-form').form({
        fields: {
            password: 'empty',
        },
    });
    $('#create-form').form({
        fields: eventFields,
    });
    $('#dateTimeSelector').flatpickr({
        enableTime: true,
        minDate: 'today',
        dateFormat: 'F j, Y at h:i K',
    });
    $('#endTimeSelector').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: 'h:i K',
    })
});

const userFields = {
    firstName: 'empty',
    lastName: 'empty',
    graduation: ['regExp[\d{4}]', 'empty'],
    major: 'empty',
};

const eventFields = {
    name: 'empty',
    location: 'empty',
    date: 'empty',
    endTime: 'empty',
    description: 'empty',
}
