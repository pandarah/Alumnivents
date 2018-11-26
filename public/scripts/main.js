/**
 * @file
 * @summary The general goal of this file is to attach certain actions to certain events.
 *  
 * @function ready
 * @summary This function attaches certain events to certain actions. It goes through each modal to attach the events, and also goes through each
 * individual event and attaches the appropriately IDed buttons to the event modal.
 * @callback
 *
 * @param {} - This function does not have any parameters
 *
 * @returns {} - This function does not return anything
 */
$(document).ready(() => {
    
    const eventCount = $('.event').length;
    const loggedIn = $('#log').html() === 'true' ? true : false;

    if (!loggedIn) {
        $('#login-modal').modal('attach events', '#login', 'show')
    }
    $('#create-modal').modal('attach events', '#create', 'show')

    $('.event').each(function () {
        const id = $(this).attr('id').slice(6);
        $(`#event-detail-${id}`).modal('attach events', `#event-button-${id}`, 'show');
        if (!loggedIn) {
            if ($(this).parent().attr('id') === 'past-events') {
                $(`#feedback-modal-${id}`).modal('attach events', `#event-feedback-${id}`, 'show')
                $(`#checkin-modal-${id}`).modal('attach events', `#event-checkin-${id}`, 'show')
                $(`#event-detail-${id}`).modal('attach events', `#feedback-cancel-${id}`, 'show')
                $(`#event-detail-${id}`).modal('attach events', `#checkin-cancel-${id}`, 'show')
                
                $(document).on('click', `#checkin-submit-${id}`, () => {
                    $(`#checkin-form-${id}`).submit();
                });
                $(document).on('click', `#feedback-submit-${id}`, () => {
                    $(`#feedback-form-${id}`).submit();
                });
            }
        } else {
            $(`#accept-modal-${id}`).modal('attach events', `#event-accept-${id}`, 'show')
            $(`#deny-modal-${id}`).modal('attach events', `#event-deny-${id}`, 'show')
            $(`#update-modal-${id}`).modal('attach events', `#event-update-${id}`, 'show')

            if ($(`#accept-cancel-${id}`).length) $(`#event-detail-${id}`).modal('attach events', `#accept-cancel-${id}`, 'show')
            if ($(`#deny-cancel-${id}`).length) $(`#event-detail-${id}`).modal('attach events', `#deny-cancel-${id}`, 'show')

            $(document).on('click', `#update-submit-${id}`, () => {
                $(`#update-form-${id}`).submit();
            });
        }
    });

    $(document).on('click', '#login-submit', () => {
        $('#login-form').submit();
    });
    $(document).on('click', '#create-submit', () => {
        $('#create-form').submit();
    });
    $(document).on('click', '#filter-submit', () => {
        const input = $('<input>')
		.attr('type', 'hidden')
		.attr('name', 'report')
		.val('0');
        $('#filter-form').append(input).submit();
    });
    $(document).on('click', '#report-submit', () => {
        const input = $('<input>')
            .attr('type', 'hidden')
            .attr('name', 'report')
            .val('1');
        $('#filter-form').append(input).submit();
    });
    $(document).on('click', '#search-submit', () => {
        $('#search-form').submit();
    });
    $(document).on('click', '#filter-clear', () => {
        $('#filter-form').form('clear');
        $('#search-form').form('clear');
        window.location = '/clear';
    });
    
    $(document).on('click', '#logout', () => {
        window.location = '/logout';
    });

});
