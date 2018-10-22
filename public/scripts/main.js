$(document).ready(() => {
    
    const eventCount = $('.event').length;
    const loggedIn = $('#log').html() === 'true' ? true : false;

    if (!loggedIn) {
        $('#login-modal').modal('attach events', '#login', 'show')
    }
    $('#create-modal').modal('attach events', '#create', 'show')

    for (let i = 0; i < eventCount; i++) {
        $(`#event-detail-${i}`).modal('attach events', `#event-button-${i}`, 'show');
        if (!loggedIn) {
            $(`#feedback-modal-${i}`).modal('attach events', `#event-feedback-${i}`, 'show')
            $(`#checkin-modal-${i}`).modal('attach events', `#event-checkin-${i}`, 'show')
            $(`#event-detail-${i}`).modal('attach events', `#feedback-cancel-${i}`, 'show')
            $(`#event-detail-${i}`).modal('attach events', `#checkin-cancel-${i}`, 'show')

            $(document).on('click', `#checkin-submit-${i}`, () => {
                $(`#checkin-form-${i}`).submit();
            });
            $(document).on('click', `#feedback-submit-${i}`, () => {
                $(`#feedback-form-${i}`).submit();
            });
        } else {
            $(`#accept-modal-${i}`).modal('attach events', `#event-accept-${i}`, 'show')
            $(`#deny-modal-${i}`).modal('attach events', `#event-deny-${i}`, 'show')
            if ($(`#accept-cancel-${i}`).length) $(`#event-detail-${i}`).modal('attach events', `#accept-cancel-${i}`, 'show')
            if ($(`#deny-cancel-${i}`).length) $(`#event-detail-${i}`).modal('attach events', `#deny-cancel-${i}`, 'show')
        }
    }

    $(document).on('click', '#login-submit', () => {
        $('#login-form').submit();
    });
    $(document).on('click', '#create-submit', () => {
        $('#create-form').submit();
    });
    $(document).on('click', '#filter-submit', () => {
        $('#filter-form').submit();
    });
    $(document).on('click', '#search-submit', () => {
        $('#search-form').submit();
    });
    
    $(document).on('click', '#logout', () => {
        window.location = '/logout';
    });

});