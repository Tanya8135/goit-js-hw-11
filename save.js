/* Рознести логіки по різним js файлам */
import './css/main.min.css'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

/**
 * Burger menu
 */
(() => {
    const mobileMenu = document.querySelector('.js-menu-container');
    const openMenuBtn = document.querySelector('.js-open-menu');
    const closeMenuBtn = document.querySelector('.js-close-menu');

    const toggleMenu = () => {
        const isMenuOpen =
            openMenuBtn.getAttribute('aria-expanded') === 'true' || false;
        openMenuBtn.setAttribute('aria-expanded', !isMenuOpen);
        mobileMenu.classList.toggle('is-open');

        const scrollLockMethod = !isMenuOpen ? disableBodyScroll : enableBodyScroll;
        scrollLockMethod(document.body);
    };

    openMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    // Close the mobile menu on wider screens if the device orientation changes
    window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
        if (!e.matches) return;
        mobileMenu.classList.remove('is-open');
        openMenuBtn.setAttribute('aria-expanded', false);
        bodyScrollLock.enableBodyScroll(document.body);
    });
})();

/**
 * Load more -- View archive
 */
const archiveBtn = document.querySelector('.archive-btn');
const archiveList = document.querySelector('.archive-list');
import listArchive from './js/item';

// Додати обробник подій для кнопки
archiveBtn.addEventListener('click', function () {
    // Якщо список вже відкритий, закрити його
    if (archiveList.style.display === 'block') {
        archiveList.style.display = 'none';
        archiveList.innerHTML = ''; // Видалити попередні елементи списку
        archiveBtn.innerHTML = "View archive" + `<svg width="30" height="30" style="fill: #575445; margin-left: 10px;">
        <use href="./images/icons.svg#icon-arrow-btn"></use>
    </svg>`;
    } else {
        // Якщо список закритий, відкрити його та додати новий елемент
        archiveList.style.display = 'block';
        const newListItem = document.createElement('li');
        newListItem.innerHTML = listArchive;
        archiveList.appendChild(newListItem);
        archiveBtn.textContent = "Close archive";
    }
});