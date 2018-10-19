$(document).ready(() => {
    $('#login-modal').modal('attach events', '#login', 'show')
    $('#create-modal').modal('attach events', '#create', 'show')
    

    const eventCount = $('.event').length;
    const loggedIn = $('#log').html() === 'true' ? true : false;

    for (let i = 0; i < eventCount; i++) {
        $(`#event-detail-${i}`).modal('attach events', `#event-button-${i}`, 'show');
        if (!loggedIn) {
            $(`#feedback-modal-${i}`).modal('attach events', `#event-feedback-${i}`, 'show')
            $(`#checkin-modal-${i}`).modal('attach events', `#event-checkin-${i}`, 'show')
        }
    }

    $(document).on('click', '#login-submit', () => {
        $('#login-form').submit();
    });
    $(document).on('click', '#logout', () => {
        window.location = '/logout';
    });

});