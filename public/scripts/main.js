$(document).ready(() => {
    $('#login-modal').modal('attach events', '#login', 'show')
    $('#create-modal').modal('attach events', '#create', 'show')

    const eventCount = $('.event').length;
    for (let i = 0; i < eventCount; i++) {
        $(`#event-detail-${i}`).modal('attach events', `#event-button-${i}`, 'show');
    }
});