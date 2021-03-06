//Initializing all the library components that are used in the ui

$(document).ready(() => {
    const eventCount = $('.event').length;
    const loggedIn = $('#log').html() === 'true' ? true : false;
    
    $('.ui.accordion').accordion();
    $('.ui.dropdown').dropdown();
    $('.ui.modal').modal({
        allowMultiple: false,
    });

    // Event Ratings 
    $('.ui.rating').rating({
        maxRating: 5,
        interactive: false,
    });
    $('.event-rating').each(function () {
        const id = $(this).attr('id').slice(13);
        $(this).rating({
            maxRating: 5,
            interactive: true,
            onRate: value => {
                $(`#event-rating-input-${id}`).val(value);
            },
        })
    })

    // Forms and Form Validation
    $('#login-form').form({
        fields: {
            password: 'empty',
        },
    });
    $('#create-form').form({
        fields: createFields(loggedIn),
    });
    $('#create-form').form('clear');
    $('#search-form').form({
        fields: {
            search: 'empty',
        },
    });

    for (let i = 0; i < eventCount; i++) {
        $(`#checkin-form-${i}`).form({
            fields: userFields,
        });
        $(`#feedback-form-${i}`).form({
            fields: {
                firstname: 'empty',
                lastname: 'empty',
                rating: ['integer'],
                comment: 'empty',
            },
        });
    };

    // Date Time Picker Intialization
    $('#dateTimeSelector').flatpickr({
        enableTime: true,
        altInput: true,
        altFormat: 'F j, Y at h:i K',
        minDate: 'today',
        dateFormat: 'U',
        onChange: (selected, dateStr, instance) => {
            $('#endTimeSelector').flatpickr({
                enableTime: true,
                noCalendar: true,
                altInput: true,
                altFormat: 'h:i K',
                dateFormat: 'U',
                minDate: dateStr,
                maxDate: moment.unix(parseInt(dateStr)).add(1, 'd').i
            });
        },
    });
    $('#endTimeSelector').flatpickr({
        enableTime: true,
        noCalendar: true,
        altInput: true,
        altFormat: 'h:i K',
        dateFormat: 'U',
    });

    $('.update-date').each(function () {
        $(this).flatpickr({
            enableTime: true,
            altInput: true,
            altFormat: 'F j, Y at h:i K',
            minDate: 'today',
            dateFormat: 'U',
            onChange: (selected, dateStr, instance) => {
                $(`#.update-endtime`).flatpickr({
                    enableTime: true,
                    noCalendar: true,
                    altInput: true,
                    altFormat: 'h:i K',
                    dateFormat: 'U',
                    minDate: dateStr,
                    maxDate: moment.unix(parseInt(dateStr)).add(1, 'd').i
                });
            },
        })
    });
    $(`.update-endtime`).each(function () {
        $(this).flatpickr({
            enableTime: true,
            noCalendar: true,
            altInput: true,
            altFormat: 'h:i K',
            dateFormat: 'U',
        });
    });

});

const userFields = {
    firstname: 'empty',
    lastname: 'empty',
    graduation: ['exactLength[4]', 'integer', 'empty'],
    major: 'empty',
};

const eventFields = {
    name: 'empty',
    address: 'empty',
    city: 'empty',
    zipcode: 'empty',
    country: 'empty',
    date: 'empty',
    endTime: 'empty',
    description: 'empty',
    category: 'empty',
};

/**
 * @function createFields
 * @summary Builds a form validation object for the create form
 * 
 * @param {Boolean} loggedIn - whether the user is logged in
 * 
 * @returns {Object} form validation object
 */
const createFields = loggedIn => {
    if (loggedIn) {
        return eventFields;
    } else {
        return Object.assign({}, userFields, eventFields, { email: ['email', 'empty'] });
    }
}