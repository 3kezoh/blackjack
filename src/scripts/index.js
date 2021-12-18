import { get, getAll, getById, clearEvents } from './libs/Selector/selector.js';

const main = () => {
    getAll('.btn-action').click(function (e) {
        console.log(this.textContent);
    });
    console.log(getAll('.btn-action').get());
    console.log(getById('btn-test2').text());
    console.log(getById('btn-test2').html());
    console.log(get('.btn-action').hasClass('shut'));
    console.log(get('.btn-action').removeClass('shut'));
    console.log(get('#btn-test3').addClass('HEYY'));
    console.log(get('h1.text-center').hide());
    console.log(get('h1.text-center').show());
    console.log(getById('btn-test2').text());
    console.log(getById('btn-test1').css('color', 'red'));

    setTimeout(() => {
        clearEvents();
    }, 5000);
};

main();
