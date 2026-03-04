const BRANCHES = {
  krasnodar: {
    id: 'krd',
    name: 'Краснодар',
    region: 'Краснодарском крае',
    address: 'ул. Гимназическая, д. 40, 3 этаж',
    phone: '8 861 203-47-40',
    email: 'krd@okbankrot.ru',
    manager: 'Анастасия Курчева',
    managerRole: 'Ведущий эксперт по Южному округу',
    casesInRegion: 1842,
    totalSaved: '1.2 млрд ₽',
    courts: ['Арбитражном суде Краснодарского края'],
    team: [
      { name: 'Мария С.', role: 'Юрист по ипотеке' },
      { name: 'Иван К.', role: 'Арбитражный управляющий' }
    ]
  },
  moscow: {
    id: 'msk',
    name: 'Москва',
    region: 'Московской области',
    address: 'ул. Щепкина, д. 28, офис 417',
    phone: '8 800 600-28-84',
    email: 'msk@okbankrot.ru',
    manager: 'Елена Соколова',
    managerRole: 'Старший юрист, член ассоциации АУ',
    casesInRegion: 4512,
    totalSaved: '5.8 млрд ₽',
    courts: ['Арбитражном суде г. Москвы', 'АС Московской области'],
    team: [
      { name: 'Сергей П.', role: 'Эксперт по субсидиарной ответственности' },
      { name: 'Анна В.', role: 'Специалист по защите активов' }
    ]
  },
  kazan: {
    id: 'kzn',
    name: 'Казань',
    region: 'Республике Татарстан',
    address: 'ул. Тази Гиззата, д. 3а, офис 211',
    phone: '8 843 206-07-37',
    email: 'kzn@okbankrot.ru',
    manager: 'Руслан Хабибуллин',
    managerRole: 'Руководитель филиала в Татарстане',
    casesInRegion: 924,
    totalSaved: '430 млн ₽',
    courts: ['Арбитражном суде Республики Татарстан'],
    team: [
      { name: 'Лилия М.', role: 'Специалист по семейным спорам' },
      { name: 'Тимур Г.', role: 'Ведущий юрист' }
    ]
  },
  chita: {
    id: 'cht',
    name: 'Чита',
    region: 'Забайкальском крае',
    address: 'ул. Костюшко-Григоровича, д. 27, офис 202',
    phone: '8 3022 217-712',
    email: 'chita@okbankrot.ru',
    manager: 'Виктория Ким',
    managerRole: 'Главный юрист регионального отделения',
    casesInRegion: 645,
    totalSaved: '210 млн ₽',
    courts: ['Арбитражном суде Забайкальского края'],
    team: [
      { name: 'Олег Б.', role: 'Арбитражный управляющий' },
      { name: 'Нина Д.', role: 'Специалист по кредитным спорам' }
    ]
  }
};

let currentCityKey = localStorage.getItem('selectedCity') || 'krasnodar';

const quizSteps = [
  {
    q: 'Каков ваш суммарный долг?',
    opts: ['До 300 000 ₽', '300 000 — 500 000 ₽', '500 000 — 1.5 млн ₽', 'Свыше 1.5 млн ₽'],
    icon: 'scale'
  },
  {
    q: 'Какое имущество находится в собственности?',
    opts: ['Только единственное жилье', 'Есть автомобиль', 'Вторая квартира / Участок', 'Нет имущества'],
    icon: 'building-2'
  },
  {
    q: 'Какая ваша главная цель сейчас?',
    opts: ['Остановить звонки коллекторов', 'Списать все долги полностью', 'Сохранить имущество/ипотеку', 'Снять аресты с карт'],
    icon: 'target'
  }
];

let currentQuizStep = 0;
let quizFinished = false;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Elements
  const navbar = document.getElementById('navbar');
  const navContainer = document.getElementById('nav-container');
  const cityModal = document.getElementById('city-modal');
  const callbackModal = document.getElementById('callback-modal');
  const btnMenuOpen = document.querySelectorAll('.btn-menu-open');
  const btnMenuClose = document.getElementById('btn-menu-close');
  const cityButtons = document.querySelectorAll('.city-select-btn');
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const btnCallbackOpen = document.querySelectorAll('.btn-callback');
  const btnCallbackClose = document.getElementById('btn-callback-close');

  // Mobile dropdown
  const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

  // Scroll effect for navbar (Floating Island style)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('py-4');
      navbar.classList.remove('py-6');
      if (navContainer) {
        navContainer.classList.add('bg-white/90', 'backdrop-blur-xl', 'shadow-xl', 'shadow-blue-900/5', 'rounded-full', 'border', 'border-white', 'px-8');
        navContainer.classList.remove('px-6');
      }
    } else {
      navbar.classList.add('py-6');
      navbar.classList.remove('py-4');
      if (navContainer) {
        navContainer.classList.remove('bg-white/90', 'backdrop-blur-xl', 'shadow-xl', 'shadow-blue-900/5', 'rounded-full', 'border', 'border-white', 'px-8');
        navContainer.classList.add('px-6');
      }
    }
  });

  // Mobile Dropdown Logic
  mobileDropdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-dropdown');
      const menu = document.getElementById(targetId);
      if (menu) {
        menu.classList.toggle('hidden');
      }
    });
  });

  // Modal logic
  btnMenuOpen.forEach(btn => {
    btn.addEventListener('click', () => {
      cityModal.classList.remove('hidden');
      setTimeout(() => cityModal.classList.remove('opacity-0', 'pointer-events-none'), 10);
    });
  });

  if (btnMenuClose) {
    btnMenuClose.addEventListener('click', () => {
      cityModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => cityModal.classList.add('hidden'), 300);
    });
  }

  btnCallbackOpen.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      callbackModal.classList.remove('hidden');
      setTimeout(() => callbackModal.classList.remove('opacity-0', 'pointer-events-none'), 10);
    });
  });

  if (btnCallbackClose) {
    btnCallbackClose.addEventListener('click', () => {
      callbackModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => callbackModal.classList.add('hidden'), 300);
    });
  }

  // City Selection
  cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-city');
      currentCityKey = key;
      localStorage.setItem('selectedCity', key);
      updateCityData();

      // Update active state
      cityButtons.forEach(b => {
        b.classList.remove('border-blue-500', 'bg-blue-50', 'shadow-2xl', 'shadow-blue-500/10', 'scale-105');
        b.classList.add('border-slate-100', 'bg-white');
      });
      btn.classList.add('border-blue-500', 'bg-blue-50', 'shadow-2xl', 'shadow-blue-500/10', 'scale-105');
      btn.classList.remove('border-slate-100', 'bg-white');

      cityModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => cityModal.classList.add('hidden'), 300);
    });
  });

  // Tabs Logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.remove('bg-white', 'text-blue-600', 'shadow-md');
        t.classList.add('text-slate-400');
      });
      tab.classList.remove('text-slate-400');
      tab.classList.add('bg-white', 'text-blue-600', 'shadow-md');

      tabContents.forEach(content => {
        if (content.id === target) {
          content.classList.remove('hidden');
          content.classList.add('grid');
        } else {
          content.classList.add('hidden');
          content.classList.remove('grid');
        }
      });
    });
  });

  // Quiz Logic
  const renderQuiz = () => {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    const stepData = quizSteps[currentQuizStep];

    if (quizFinished) {
      quizContainer.innerHTML = `
          <div class="text-center py-6 animate-fade-in text-slate-800">
            <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i data-lucide="shield-check" class="w-10 h-10 text-green-500"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Анализ завершен!</h3>
            <p class="text-slate-500 mb-8 max-w-sm mx-auto">Мы подобрали стратегию списания для города <span class="city-name-placeholder font-bold">${BRANCHES[currentCityKey].name}</span>. Получите расчет стоимости и план защиты.</p>
            <form onsubmit="event.preventDefault(); alert('Аудит завершен! С вами свяжутся юристы.');" class="max-w-xs mx-auto space-y-4">
              <input type="tel" required placeholder="+7 (___) ___ __ __" class="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-wider" />
              <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase text-xs tracking-widest">
                Получить план защиты
              </button>
              <p class="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">Бесплатно. Конфиденциально. <br /> В соответствии с 152-ФЗ</p>
            </form>
          </div>
          `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    let optionsHTML = stepData.opts.map((opt, i) => `
        <button class="quiz-opt-btn group p-5 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left flex justify-between items-center w-full">
          <span class="text-slate-600 group-hover:text-blue-700 font-medium">${opt}</span>
          <i data-lucide="chevron-right" class="w-5 h-5 text-slate-300 group-hover:text-blue-500"></i>
        </button>
      `).join('');

    quizContainer.innerHTML = `
      <div class="space-y-8 animate-fade-in text-slate-800">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <i data-lucide="${stepData.icon}" class="w-6 h-6"></i>
          </div>
          <div>
            <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Шаг ${currentQuizStep + 1} из ${quizSteps.length}</span>
            <h3 class="text-xl font-bold text-slate-800">${stepData.q}</h3>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${optionsHTML}
        </div>
      </div>
      `;

    if (window.lucide) lucide.createIcons();

    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentQuizStep < quizSteps.length - 1) {
          currentQuizStep++;
        } else {
          quizFinished = true;
        }
        renderQuiz();
      });
    })
  }

  const renderCases = () => {
    const container = document.getElementById('cases-container');
    if (!container) return;

    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `
        <div class="flex-shrink-0 w-[380px] bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:scale-[1.02] duration-500">
          <div class="flex justify-between items-start mb-8">
            <div class="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">№ А${32 + i}-${8492 + i * 23}/2025</div>
            <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-500"></i>
          </div>
          <h5 class="text-3xl font-black mb-6 tracking-tighter italic text-slate-900">Долг: ${(1.2 + i * 0.4).toFixed(1)} млн ₽</h5>
          <div class="space-y-4 mb-10 text-slate-800">
            <div class="flex justify-between text-[11px] font-bold uppercase tracking-widest">
              <span class="text-slate-400">Срок процедуры:</span>
              <span class="text-slate-700">6 месяцев</span>
            </div>
            <div class="flex justify-between text-[11px] font-bold uppercase tracking-widest">
              <span class="text-slate-400">Статус жилья:</span>
              <span class="text-emerald-600">Сохранено</span>
            </div>
            <div class="flex justify-between text-[11px] font-bold uppercase tracking-widest border-t border-slate-100 pt-4">
              <span class="text-slate-400">ИТОГ:</span>
              <span class="text-blue-600 font-black italic">СПИСАНО 100%</span>
            </div>
          </div>
          <a href="#" class="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 hover:text-blue-600 transition-colors tracking-[0.2em] group">
            КАРТОЧКА ДЕЛА <i data-lucide="external-link" class="w-3 h-3 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
        `;
    }
    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  }

  const updateCityData = () => {
    const city = BRANCHES[currentCityKey];

    // Update all elements globally
    document.querySelectorAll('.city-name-placeholder').forEach(el => el.textContent = city.name);
    document.querySelectorAll('.city-region-placeholder').forEach(el => el.textContent = city.region);
    document.querySelectorAll('.city-phone-placeholder').forEach(el => {
      el.textContent = city.phone;
      if (el.tagName === 'A') el.href = `tel:${city.phone}`;
    });
    document.querySelectorAll('.city-address-placeholder').forEach(el => el.textContent = city.address);
    document.querySelectorAll('.city-email-placeholder').forEach(el => el.textContent = city.email);
    document.querySelectorAll('.city-manager-placeholder').forEach(el => el.textContent = city.manager);
    document.querySelectorAll('.city-managerRole-placeholder').forEach(el => el.textContent = city.managerRole);
    document.querySelectorAll('.city-casesInRegion-placeholder').forEach(el => el.textContent = city.casesInRegion + '+');
    document.querySelectorAll('.city-totalSaved-placeholder').forEach(el => el.textContent = city.totalSaved);
    document.querySelectorAll('.city-courts-placeholder').forEach(el => el.textContent = city.courts[0]);

    // Update avatars for manager
    document.querySelectorAll('.manager-avatar').forEach(img => {
      img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${city.manager}`;
    });

    renderCases();
    renderTeam();
    if (quizFinished) { // re-render quiz if it's in final step to update city name
      renderQuiz();
    }
  };

  const renderTeam = () => {
    const cityData = BRANCHES[currentCityKey];
    const teamContainer = document.getElementById('team-container');
    if (!teamContainer) return;

    let html = '';
    cityData.team.forEach(member => {
      html += `
          <div class="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-xl">
              <div class="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}" alt="${member.name}" class="w-full h-full object-cover" />
              </div>
              <div class="overflow-hidden">
                  <div class="text-xs font-bold text-slate-900 truncate">${member.name}</div>
                  <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">${member.role}</div>
              </div>
          </div>
          `;
    });
    teamContainer.innerHTML = html;
  };

  // Initial draw
  updateCityData();
  renderQuiz();
});
