// -----------------------------
// TAB SWITCHING
// -----------------------------
function openTab(tabId, event) {
  // hide all tab contents
  document.querySelectorAll('.content').forEach(c => {
    c.style.display = 'none';
    c.classList.remove('active');
  });

  // show selected tab
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = 'block';
    activeTab.classList.add('active');
  }

  // update tab buttons
  document.querySelectorAll('.tab-button').forEach(b => {
    b.classList.remove('active');
  });

  if (event && event.target) {
    event.target.classList.add('active');
  }

  // show language toggle ONLY on About tab
  const langToggle = document.querySelector('.language-toggle');
  if (langToggle) {
    langToggle.style.display = tabId === 'about' ? 'flex' : 'none';
  }
}

// -----------------------------
// LANGUAGE SWITCHING
// -----------------------------
function setLanguage(lang, clickedBtn) {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  // hide all language contents
  aboutSection.querySelectorAll('.lang').forEach(el => {
    el.style.display = 'none';
  });

  // show selected language
  const activeLang = aboutSection.querySelector('.lang.' + lang);
  if (activeLang) {
    activeLang.style.display = 'block';
  }

  // remove active class from all language buttons
  document.querySelectorAll('.language-toggle .lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // activate clicked button
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }
}

// -----------------------------
// INITIAL STATE ON PAGE LOAD
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  // ensure About tab is visible on load
  const aboutTab = document.getElementById('about');
  if (aboutTab) {
    aboutTab.style.display = 'block';
  }

  // hide other tabs initially
  document.querySelectorAll('.content').forEach(c => {
    if (c.id !== 'about') {
      c.style.display = 'none';
    }
  });

  // ensure language toggle is visible on load
  const langToggle = document.querySelector('.language-toggle');
  if (langToggle) {
    langToggle.style.display = 'flex';
  }
});
