const products = [
  {
    id: 1, name: 'The Little Book of Wonder', category: 'books', description: 'A cosy story for curious minds.', price: 4500, icon: '📚', badge: 'BESTSELLER', rating: 4,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2, name: 'The Art of Small Things', category: 'books', description: 'A colourful book full of ideas.', price: 5200, icon: '📖', badge: 'NEW', rating: 5,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3, name: 'Weekend Puzzle', category: 'games', description: 'A calm challenge to share.', price: 6800, icon: '🧩', badge: 'POPULAR', rating: 4,
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b8217d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4, name: 'Little Game Night', category: 'games', description: 'Big laughs in a small box.', price: 7900, icon: '🎲', badge: 'FAMILY PICK', rating: 5,
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5, name: 'Creative Colour Kit', category: 'toys', description: 'Make, draw, and imagine freely.', price: 3900, icon: '🖍️', badge: 'CREATIVE', rating: 4,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6, name: 'Tiny Garden Set', category: 'toys', description: 'A playful set for little builders.', price: 6100, icon: '🪴', badge: 'NEW', rating: 5,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7, name: 'Happy Day Gift Box', category: 'gifts', description: 'A thoughtful surprise for someone.', price: 8500, icon: '🎁', badge: 'GIFT IDEA', rating: 5,
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8, name: 'Cosy Mug & Notes', category: 'gifts', description: 'A small treat for slow mornings.', price: 4700, icon: '☕', badge: 'LITTLE TREAT', rating: 4,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80'
  }
];

const categoryNames = {
  all: 'all our little finds',
  books: 'books',
  games: 'games',
  toys: 'toys and play',
  gifts: 'gifts'
};

const categoryMessages = {
  all: 'Showing all our little finds.',
  books: 'A good story is waiting.',
  games: 'Let the fun begin.',
  toys: 'Time to make and play.',
  gifts: 'Find a little something for someone.'
};

const surpriseIdeas = [
  'Try a puzzle for a screen-free evening.',
  'Pick a book and make tonight story time.',
  'A creative kit can turn a quiet afternoon into an adventure.',
  'A small gift can make an ordinary day special.'
];

let activeCategory = 'all';
let cartCount = 0;
let surpriseIndex = 0;
let toastTimer;
let lastFocusedElement;
const favorites = new Set();
const userRatings = {};


function showToast(message) {
  const $toast = $('#toast');
  clearTimeout(toastTimer);
  $toast.stop(true, true).text(message).addClass('show').hide().fadeIn(180);
  toastTimer = setTimeout(function () {
    $toast.fadeOut(250, function () {
      $toast.removeClass('show');
    });
  }, 2400);
}

function productMatches(product, searchText) {
  const allText = product.name + ' ' + product.description + ' ' + product.category;
  return allText.toLowerCase().includes(searchText);
}

function getVisibleProducts() {
  const searchText = $('#searchInput').val().trim().toLowerCase();

  return products.filter(function (product) {
    const categoryOk = activeCategory === 'all' || product.category === activeCategory;
    const searchOk = productMatches(product, searchText);
    return categoryOk && searchOk;
  });
}

function makeStars(product) {
  const rating = userRatings[product.id] || product.rating;
  let html = '';

  for (let star = 1; star <= 5; star++) {
    const selected = star <= rating ? 'selected' : '';
    html += '<button type="button" class="' + selected + '" data-rating="' + star + '" ' +
      'data-product-id="' + product.id + '" ' +
      'aria-label="Rate ' + product.name + ' ' + star + ' out of 5 stars">★</button>';
  }
  return html;
}

function makeProductCard(product) {
  const isFavorite = favorites.has(product.id);

  return `
    <article class="product-card">
      <div class="product-visual visual-${product.id}">
        <img class="product-photo" data-src="${product.image}" alt="${product.name}">
        <span class="product-badge">${product.badge}</span>
        <button type="button" class="favorite-button ${isFavorite ? 'favorited' : ''}" data-favorite="${product.id}"
                aria-label="${isFavorite ? 'Remove from' : 'Add to'} favourites">${isFavorite ? '♥' : '♡'}</button>
        <span class="visual-icon" aria-hidden="true">${product.icon}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${categoryNames[product.category]}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="rating" aria-label="Product rating">${makeStars(product)}</div>
        <div class="product-bottom">
          <span class="price">₸${product.price.toLocaleString('en-US')}</span>
          <button class="add-button" type="button" data-add="${product.id}">Add to bag +</button>
        </div>
      </div>
    </article>`;
}



function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const count = visibleProducts.length;

  $('#productGrid').html(visibleProducts.map(makeProductCard).join(''));

  $('#resultsNote').text('Showing ' + count + (count === 1 ? ' find' : ' finds') + ' — ' + categoryNames[activeCategory]);
  $('#emptyState').prop('hidden', count !== 0);
  $('#productGrid').prop('hidden', count === 0);

  highlightMatches();
  loadVisibleImages();
}


function setupProductCards() {
  const $grid = $('#productGrid');

  $grid.on('click', '[data-add]', function () {
    const $button = $(this);
    const product = products.find(function (item) { return item.id === Number($button.data('add')); });

    cartCount++;
    $('#cartCount').text(cartCount);
    showToast(product.name + ' added to your bag.');

    $button.text('Added ✓');
    setTimeout(function () {
      if ($button[0].isConnected) $button.text('Add to bag +');
    }, 900);
  });

  $grid.on('click', '[data-favorite]', function () {
    const id = Number($(this).data('favorite'));

    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);

    renderProducts();
    showToast(favorites.has(id) ? 'Saved to your favourites.' : 'Removed from your favourites.');
  });

  $grid.on('click', '[data-rating]', function () {
    const productId = Number($(this).data('productId'));
    userRatings[productId] = Number($(this).data('rating'));

    renderProducts();
    showToast('Thanks for rating this find!');
  });
}

function setupCategoryFilters() {
  $('.filter-button').on('click', function () {
    const $button = $(this);
    activeCategory = $button.data('category');

    $('.filter-button').removeClass('active').attr('aria-pressed', 'false');
    $button.addClass('active').attr('aria-pressed', 'true');

    renderProducts();
    showToast(categoryMessages[activeCategory]);
  });
}


function setupLiveSearch() {
  $('#searchInput').on('input', function () {
    renderProducts();
    updateSuggestions();
  });
}


function hideSuggestions() {
  $('#searchSuggestions').prop('hidden', true);
}

function updateSuggestions() {
  const searchText = $('#searchInput').val().trim().toLowerCase();
  const $list = $('#searchSuggestions').empty();

  if (searchText === '') {
    hideSuggestions();
    return;
  }

  const matches = products
    .filter(function (product) { return productMatches(product, searchText); })
    .slice(0, 5);

  matches.forEach(function (product) {
    $('<li>').attr({ role: 'option', tabindex: 0 }).text(product.name).appendTo($list);
  });

  $list.prop('hidden', matches.length === 0);
}

function chooseSuggestion(name) {
  $('#searchInput').val(name);
  renderProducts();
  hideSuggestions();
  $('#searchInput').trigger('focus');
}

function setupAutocomplete() {
  const $list = $('#searchSuggestions');

  $list.on('click', 'li', function () {
    chooseSuggestion($(this).text());
  });

  $list.on('keydown', 'li', function (event) {
    if (event.key === 'Enter') chooseSuggestion($(this).text());
  });

  $('#searchInput').on('keydown', function (event) {
    if (event.key === 'Escape') {
      hideSuggestions();
    }
    if (event.key === 'Enter' && !$list.prop('hidden')) {
      event.preventDefault();
      chooseSuggestion($list.find('li').first().text());
    }
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.search-wrap').length === 0) hideSuggestions();
  });
}


function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatches() {
  const query = $('#searchInput').val().trim();

  $('.product-info h3, .product-description').each(function () {
    const plainText = $(this).text();

    if (query === '') {
      $(this).text(plainText);
      return;
    }

    const pattern = new RegExp('(' + escapeRegex(query) + ')', 'ig');
    $(this).html(plainText.replace(pattern, '<mark>$1</mark>'));
  });
}


function setupScrollProgress() {
  function updateProgress() {
    const scrolled = $(window).scrollTop();
    const maxScroll = $(document).height() - $(window).height();
    const percent = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;

    $('#scrollProgress').css('width', percent + '%');
  }

  $(window).on('scroll resize', updateProgress);
  updateProgress();
}


function setupCounters() {
  let started = false;

  function runCounters() {
    if (started) return;

    const sectionTop = $('#stats').offset().top;
    const screenBottom = $(window).scrollTop() + $(window).height();
    if (sectionTop > screenBottom - 40) return;

    started = true;

    $('.counter').each(function () {
      const $counter = $(this);
      const target = Number($counter.data('target'));
      const suffix = target === 4 ? '' : '+';

      $({ value: 0 }).animate({ value: target }, {
        duration: 1300,
        easing: 'swing',
        step: function () {
          $counter.text(Math.floor(this.value).toLocaleString());
        },
        complete: function () {
          $counter.text(target.toLocaleString() + suffix);
        }
      });
    });
  }

  $(window).on('scroll resize', runCounters);
  runCounters();
}


function setupSignupForm() {
  const $form = $('#signupForm');
  const $name = $('#signupName');
  const $email = $('#signupEmail');
  const $button = $('#signupSubmit');
  const $label = $button.find('.submit-label');
  const $spinner = $button.find('.submit-spinner');
  const $message = $('#formMessage');

  function showFieldError($input, errorText) {
    $input.toggleClass('invalid', errorText !== '');
    $input.parent().find('.field-error').text(errorText);
  }

  function clearErrors() {
    showFieldError($name, '');
    showFieldError($email, '');
    $message.text('');
  }

  $form.on('submit', function (event) {
    event.preventDefault();

    const nameValue = $name.val().trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val().trim());

    showFieldError($name, nameValue ? '' : 'Please enter your name.');
    showFieldError($email, emailIsValid ? '' : 'Please enter a valid email.');
    $message.text('');

    if (!nameValue || !emailIsValid) return;

    $button.prop('disabled', true);
    $label.text('Please wait…');
    $spinner.prop('hidden', false);

    setTimeout(function () {
      $button.prop('disabled', false);
      $label.html('Join the club <span>→</span>');
      $spinner.prop('hidden', true);

      $message.text('Thanks, ' + nameValue + '! You are on the Marwin demo list.');
      showToast('Form submitted successfully!');
    }, 1400);
  });

  $form.find('input').on('input', function () {
    showFieldError($(this), '');
    $message.text('');
  });

  $('#resetFormButton').on('click', function () {
    $form[0].reset();
    clearErrors();
    showToast('The form has been cleared.');
  });
}


function copyWithFallback(text, whenDone) {
  const $temp = $('<textarea>').val(text).css({ position: 'fixed', left: '-9999px' }).appendTo('body');
  let success = false;

  $temp[0].select();
  try { success = document.execCommand('copy'); } catch (error) { success = false; }
  $temp.remove();

  whenDone(success);
}

function setupCopyButton() {
  const $button = $('#copyNoteButton');

  $('#copyNoteText').on('copy', function () {
    showToast('Copied to clipboard!');
  });

  function showCopiedState() {
    $button.addClass('copied');
    $button.find('.copy-icon').text('✓');
    $button.find('.copy-label').text('Copied');
    showToast('Copied to clipboard!');

    setTimeout(function () {
      $button.removeClass('copied');
      $button.find('.copy-icon').text('⧉');
      $button.find('.copy-label').text('Copy');
    }, 2200);
  }

  function handleResult(success) {
    if (success) showCopiedState();
    else showToast('Please copy the Marwin note manually.');
  }

  $button.on('click', function () {
    const text = $('#copyNoteText').text();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(showCopiedState, function () {
        copyWithFallback(text, handleResult);
      });
    } else {
      copyWithFallback(text, handleResult);
    }
  });
}


function loadVisibleImages() {
  const loadLimit = $(window).scrollTop() + $(window).height() + 160;

  $('.product-photo[data-src]').each(function () {
    const $image = $(this);

    if ($image.offset().top <= loadLimit) {
      $image.on('load', function () { $image.addClass('loaded'); });
      $image.on('error', function () { $image.remove(); });
      $image.attr('src', $image.attr('data-src')).removeAttr('data-src');
    }
  });
}

function setupLazyLoading() {
  $(window).on('scroll resize', loadVisibleImages);
}


function setupThemeButton() {
  const $button = $('#themeButton');

  $button.on('click', function () {
    $('body').toggleClass('night');
    const isNight = $('body').hasClass('night');

    $button.text(isNight ? '☀' : '☾');
    $button.attr('aria-label', isNight ? 'Switch to day theme' : 'Switch to night theme');
    showToast(isNight ? 'Night mode is on.' : 'Day mode is on.');
  });
}


function playTinySound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.12);
    volume.gain.setValueAtTime(0.08, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);

    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.18);
    oscillator.onended = function () { audio.close(); };
  } catch (error) {
  }
}

function setupSurpriseButton() {
  $('#surpriseButton').on('click', function () {
    const $art = $('.hero-art');

    $('#surpriseMessage').text(surpriseIdeas[surpriseIndex]);
    surpriseIndex = (surpriseIndex + 1) % surpriseIdeas.length;

    $art.removeClass('celebrate');
    void $art[0].offsetWidth;
    $art.addClass('celebrate');

    playTinySound();
  });
}


function setupReadMore() {
  const $button = $('#readMoreButton');

  $button.on('click', function () {
    const wasExpanded = $button.attr('aria-expanded') === 'true';

    $('#aboutMore').prop('hidden', wasExpanded);
    $button.attr('aria-expanded', String(!wasExpanded));
    $button.html(wasExpanded ? 'Read our story <span>＋</span>' : 'Show less <span>−</span>');
  });
}


function setupFaq() {
  $('.faq-question').on('click', function () {
    const $question = $(this);
    const wasOpen = $question.attr('aria-expanded') === 'true';

    $question.attr('aria-expanded', String(!wasOpen));
    $question.closest('.faq-item').toggleClass('open', !wasOpen);
  });
}


function setupModal() {
  const $modal = $('#subscribeModal');

  function openModal() {
    lastFocusedElement = document.activeElement;
    $modal.prop('hidden', false);
    $('body').css('overflow', 'hidden');
    $('#subscribeEmail').trigger('focus');
  }

  function closeModal() {
    $modal.prop('hidden', true);
    $('body').css('overflow', '');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  $('#openModal').on('click', openModal);
  $modal.find('[data-close-modal]').on('click', closeModal);

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && !$modal.prop('hidden')) closeModal();
  });

  $('#subscribeForm').on('submit', function (event) {
    event.preventDefault();
    $('.modal-message').text('Thanks! ' + $('#subscribeEmail').val() + ' is added to this demo list.');
    this.reset();
  });
}


function setupNavKeyboard() {
  const $links = $('#mainNav a');

  $('#mainNav').on('keydown', function (event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();

    const currentIndex = $links.index(document.activeElement);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + step + $links.length) % $links.length;

    $links.get(nextIndex).focus();
  });
}


$(document).ready(function () {
  console.log('jQuery is ready!');

  setupProductCards();
  setupCategoryFilters();

  setupLiveSearch();
  setupAutocomplete();

  setupScrollProgress();
  setupCounters();
  setupSignupForm();

  setupCopyButton();
  setupLazyLoading();

  setupThemeButton();
  setupSurpriseButton();
  setupReadMore();
  setupFaq();
  setupModal();
  setupNavKeyboard();

  renderProducts();
});