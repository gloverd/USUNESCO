$(document).ready(function() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const sidebar = $('.alphabet-sidebar ul');
    const content = $('.content');

    function updateSidebar() {
        alphabet.forEach(letter => {
            const firstElement = content.find(`#${letter}`);
            if (firstElement.length > 0) {
                sidebar.find(`[data-letter=${letter}]`).removeClass('greyed');
            } else {
                sidebar.find(`[data-letter=${letter}]`).addClass('greyed');
            }
        });
    }

    function scrollToLetter(letter) {
        const target = content.find(`#${letter}`);
        if (target.length > 0) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 500);
        }
    }

    sidebar.on('click', 'li', function() {
        const letter = $(this).data('letter');
        scrollToLetter(letter);
    });

    $(window).on('scroll', function() {
        let currentLetter = '';
        content.find('.section').each(function() {
            const offsetTop = $(this).offset().top;
            const windowScroll = $(window).scrollTop();
            if (windowScroll >= offsetTop - $(window).height() / 2) {
                currentLetter = $(this).attr('id');
            }
        });
        sidebar.find('li').removeClass('bold');
        sidebar.find(`[data-letter=${currentLetter}]`).addClass('bold');
    });

    // Support Touch Function
    function supportTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    // Swipe functionality
    if (supportTouch()) {
        let startY = 0;
        let isSwiping = false;
        const letterHeight = sidebar.height() / alphabet.length;

        sidebar.on('touchstart', function(e) {
            startY = e.originalEvent.touches[0].clientY;
            isSwiping = true;
        });

        sidebar.on('touchmove', function(e) {
            if (!isSwiping) return;
            const currentY = e.originalEvent.touches[0].clientY;
            const currentIndex = Math.floor(currentY / letterHeight);
            if (currentIndex >= 0 && currentIndex < alphabet.length) {
                const letter = alphabet[currentIndex];
                scrollToLetter(letter);
            }
        });

        sidebar.on('touchend', function() {
            isSwiping = false;
        });
    }

    // Initial update for the sidebar
    updateSidebar();
});
