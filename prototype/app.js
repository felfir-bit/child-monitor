(function () {
  'use strict';

  var STORAGE_KEY = 'child-monitor-prototype-v1';
  var MAX_AGE_MONTHS = 5 * 12 + 11;
  var NOTE_MAX_LENGTH = 4000;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ROLE_TITLES = { parent: 'Родитель', specialist: 'Специалист' };

  var appRoot = document.getElementById('app');
  var appbar = document.getElementById('appbar');
  var userLabel = document.getElementById('userLabel');
  var logoutBtn = document.getElementById('logoutBtn');

  var authForm = { role: 'parent', mode: 'login' };
  var editingNoteId = null;


  function el(tag, attrs) {
    var node = document.createElement(tag);
    var children = Array.prototype.slice.call(arguments, 2);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'text') node.textContent = value;
        else if (key === 'class') node.className = value;
        else if (key === 'value') node.value = value;
        else if (key.indexOf('on') === 0) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? '' : value);
      });
    }
    children.flat().forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function show(nodes) {
    appRoot.replaceChildren.apply(appRoot, nodes.filter(Boolean));
  }

  function navigate(path) {
    var target = '#/' + path;
    if (window.location.hash === target) render();
    else window.location.hash = target;
  }


  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toISODate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseISODate(s) {
    var p = s.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function todayISO() {
    return toISODate(new Date());
  }

  function ageInMonths(birthISO) {
    var birth = parseISODate(birthISO);
    var now = new Date();
    var months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) months -= 1;
    return months;
  }

  function plural(n, one, few, many) {
    var m10 = n % 10;
    var m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function formatAge(birthISO) {
    var total = Math.max(0, ageInMonths(birthISO));
    var years = Math.floor(total / 12);
    var months = total % 12;
    var parts = [];
    if (years > 0) parts.push(years + ' ' + plural(years, 'год', 'года', 'лет'));
    parts.push(months + ' ' + plural(months, 'месяц', 'месяца', 'месяцев'));
    return parts.join(' ');
  }

  function formatDate(value) {
    var date = value.length === 10 ? parseISODate(value) : new Date(value);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatDateTime(value) {
    return new Date(value).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function validateBirthDate(iso) {
    if (!iso) return 'Укажите дату рождения.';
    if (iso > todayISO()) return 'Дата рождения не может быть в будущем.';
    if (ageInMonths(iso) > MAX_AGE_MONTHS) {
      return 'Возраст ребенка превышает 5 лет 11 месяцев. Профиль можно создать только для детей от 0 до 5 лет 11 месяцев.';
    }
    return '';
  }


  function seedData() {
    var now = new Date().toISOString();
    return {
      session: null,
      users: [
        { id: 'u-parent-1', role: 'parent', email: 'parent@example.com', fullName: 'Ольга Смирнова' },
        { id: 'u-spec-1', role: 'specialist', email: 'specialist@example.com', fullName: 'Елена Козлова' },
        { id: 'u-spec-2', role: 'specialist', email: 'teacher@example.com', fullName: 'Дарья Ким' }
      ],
      children: [
        { id: 'c-1', parentId: 'u-parent-1', fullName: 'Миша Смирнов', birthDate: '2022-03-14' },
        { id: 'c-2', parentId: 'u-parent-1', fullName: 'Аня Смирнова', birthDate: '2024-09-02' }
      ],
      grants: [
        { id: 'g-1', childId: 'c-1', specialistId: 'u-spec-1', grantedAt: now },
        { id: 'g-2', childId: 'c-1', specialistId: 'u-spec-2', grantedAt: now }
      ],
      notes: [
        {
          id: 'n-1',
          childId: 'c-1',
          authorId: 'u-spec-1',
          text: 'Уверенно строит башню из четырех кубиков. Речь: короткие фразы из двух-трех слов.',
          createdAt: now,
          updatedAt: now
        }
      ]
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) return parsed;
      }
    } catch (e) {
      return seedData();
    }
    return seedData();
  }

  var state = loadState();

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      return;
    }
  }

  function uid(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2, 10);
  }

  function findUser(id) {
    return state.users.find(function (u) { return u.id === id; }) || null;
  }

  function currentUser() {
    return state.session ? findUser(state.session) : null;
  }

  function childrenOfParent(parentId) {
    return state.children.filter(function (c) { return c.parentId === parentId; });
  }

  function getChildForParent(parentId, childId) {
    return state.children.find(function (c) {
      return c.id === childId && c.parentId === parentId;
    }) || null;
  }

  function grantedChildrenFor(specialistId) {
    return state.children.filter(function (c) {
      return state.grants.some(function (g) {
        return g.childId === c.id && g.specialistId === specialistId;
      });
    });
  }

  function getChildForSpecialist(specialistId, childId) {
    var child = state.children.find(function (c) { return c.id === childId; }) || null;
    if (!child) return null;
    var granted = state.grants.some(function (g) {
      return g.childId === childId && g.specialistId === specialistId;
    });
    return granted ? child : null;
  }

  function notesForChild(childId) {
    return state.notes
      .filter(function (n) { return n.childId === childId; })
      .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  }


  function pageHeader(title, opts) {
    opts = opts || {};
    return el('header', { class: 'page-head' },
      opts.back ? el('a', { class: 'back', href: opts.back, text: '← ' + opts.backText }) : null,
      el('h1', { class: 'page-title', text: title }),
      opts.sub ? el('p', { class: 'muted', text: opts.sub }) : null
    );
  }

  function emptyState(text) {
    return el('p', { class: 'empty', text: text });
  }

  function childCard(child, href) {
    return el('li', null,
      el('a', { class: 'card card--link', href: href },
        el('span', { class: 'card__body' },
          el('span', { class: 'card__title', text: child.fullName }),
          el('span', { class: 'card__meta', text: 'Возраст: ' + formatAge(child.birthDate) })
        ),
        el('span', { class: 'card__chev', 'aria-hidden': 'true', text: '›' })
      )
    );
  }

  function plannedSection() {
    return el('section', { class: 'card card--planned', 'aria-labelledby': 'planned-title' },
      el('div', { class: 'planned__head' },
        el('h2', { id: 'planned-title', class: 'section-title', text: 'Показатели развития и динамика' }),
        el('span', { class: 'badge', text: 'Запланировано · Arsen' })
      ),
      el('p', { class: 'muted', text: 'Ввод показателей, история наблюдений и графики динамики. Раздел в разработке, в макете не реализован.' }),
      el('div', { class: 'skeleton', 'aria-hidden': 'true' },
        el('span', { class: 'skeleton__bar' }),
        el('span', { class: 'skeleton__bar skeleton__bar--short' }),
        el('span', { class: 'skeleton__bar' })
      )
    );
  }

  function bindCounter(textarea, counter, submitBtn) {
    function update() {
      var len = textarea.value.length;
      counter.textContent = len + ' / ' + NOTE_MAX_LENGTH;
      counter.classList.toggle('counter--over', len > NOTE_MAX_LENGTH);
      submitBtn.disabled = textarea.value.trim() === '' || len > NOTE_MAX_LENGTH;
    }
    textarea.addEventListener('input', update);
    update();
  }

  function noteMeta(note, viewerId) {
    var author = findUser(note.authorId);
    var who = note.authorId === viewerId ? 'Вы' : (author ? author.fullName : 'Специалист');
    var when = formatDateTime(note.createdAt);
    if (note.updatedAt !== note.createdAt) when += ' · изменено';
    return who + ' · ' + when;
  }


  function renderAuth() {
    var isRegister = authForm.mode === 'register';
    var errorBox = el('p', { class: 'form-error', role: 'alert' });
    var nameInput = el('input', { id: 'authName', type: 'text', autocomplete: 'name', maxlength: '120' });
    var emailInput = el('input', { id: 'authEmail', type: 'email', autocomplete: 'email', placeholder: 'name@example.com' });
    var passwordInput = el('input', {
      id: 'authPassword',
      type: 'password',
      autocomplete: isRegister ? 'new-password' : 'current-password'
    });
    var consentInput = el('input', { id: 'authConsent', type: 'checkbox' });

    function roleButton(role, label) {
      return el('button', {
        class: 'segmented__btn',
        type: 'button',
        'aria-pressed': String(authForm.role === role),
        text: label,
        onclick: function () {
          authForm.role = role;
          renderAuth();
        }
      });
    }

    function modeButton(mode, label) {
      return el('button', {
        class: 'segmented__btn',
        type: 'button',
        'aria-pressed': String(authForm.mode === mode),
        text: label,
        onclick: function () {
          authForm.mode = mode;
          renderAuth();
        }
      });
    }

    function signIn(user) {
      state.session = user.id;
      save();
      navigate(user.role);
    }

    function onSubmit(ev) {
      ev.preventDefault();
      errorBox.textContent = '';
      var email = emailInput.value.trim().toLowerCase();
      var password = passwordInput.value;

      if (!EMAIL_RE.test(email)) {
        errorBox.textContent = 'Введите корректный e-mail.';
        return;
      }
      if (password.length === 0) {
        errorBox.textContent = 'Введите пароль.';
        return;
      }

      if (!isRegister) {
        var existing = state.users.find(function (u) {
          return u.email === email && u.role === authForm.role;
        });
        if (!existing) {
          errorBox.textContent = 'Аккаунт с таким e-mail и ролью не найден. Проверьте данные или зарегистрируйтесь.';
          return;
        }
        signIn(existing);
        return;
      }

      var fullName = nameInput.value.trim();
      if (!fullName) {
        errorBox.textContent = 'Укажите полное имя.';
        return;
      }
      var passwordLength = Array.from(password).length;
      if (passwordLength < 15 || passwordLength > 128) {
        errorBox.textContent = 'Пароль должен содержать от 15 до 128 символов. Подойдет фраза из нескольких слов.';
        return;
      }
      if (!consentInput.checked) {
        errorBox.textContent = 'Чтобы создать аккаунт, подтвердите согласие на обработку персональных данных.';
        return;
      }
      if (state.users.some(function (u) { return u.email === email; })) {
        errorBox.textContent = 'Этот e-mail уже зарегистрирован.';
        return;
      }
      var created = { id: uid('u'), role: authForm.role, email: email, fullName: fullName };
      state.users.push(created);
      signIn(created);
    }

    var fields = [];
    if (isRegister) {
      fields.push(el('div', { class: 'field' },
        el('label', { for: 'authName', text: 'Полное имя' }), nameInput));
    }
    fields.push(el('div', { class: 'field' },
      el('label', { for: 'authEmail', text: 'E-mail' }), emailInput));
    fields.push(el('div', { class: 'field' },
      el('label', { for: 'authPassword', text: 'Пароль' }), passwordInput,
      isRegister ? el('p', { class: 'hint', text: 'От 15 до 128 символов, например фраза из нескольких слов.' }) : null));
    if (isRegister) {
      fields.push(el('div', { class: 'field field--check' },
        consentInput,
        el('label', { for: 'authConsent', text: 'Согласен(на) на обработку персональных данных моих и моего ребенка (Закон РК № 94-V)' })));
    }

    show([
      el('section', { class: 'auth' },
        el('h1', { class: 'auth__title', text: 'Мониторинг развития ребенка' }),
        el('p', { class: 'muted', text: 'Вход для родителей и специалистов' }),
        el('div', { class: 'segmented', role: 'group', 'aria-label': 'Роль' },
          roleButton('parent', 'Родитель'),
          roleButton('specialist', 'Специалист')
        ),
        el('div', { class: 'segmented', role: 'group', 'aria-label': 'Режим' },
          modeButton('login', 'Вход'),
          modeButton('register', 'Регистрация')
        ),
        el('form', { class: 'card form', novalidate: true, onsubmit: onSubmit },
          fields,
          errorBox,
          el('button', { class: 'btn btn--primary btn--block', type: 'submit', text: isRegister ? 'Зарегистрироваться' : 'Войти' })
        ),
        el('p', { class: 'hint', text: 'Макет: данные хранятся только в этом браузере, пароль не проверяется, запросы к API не выполняются. Демо-аккаунты: parent@example.com (родитель), specialist@example.com (специалист).' })
      )
    ]);
  }


  function renderParentHome(user) {
    var kids = childrenOfParent(user.id);
    show([
      pageHeader('Мои дети'),
      el('a', { class: 'btn btn--primary btn--block', href: '#/parent/new', text: 'Добавить ребенка' }),
      el('p', { class: 'muted muted--spaced', text: 'Профили создаются для детей от 0 до 5 лет 11 месяцев.' }),
      kids.length
        ? el('ul', { class: 'card-list' }, kids.map(function (c) {
          return childCard(c, '#/parent/child/' + c.id);
        }))
        : emptyState('Профилей пока нет. Добавьте ребенка, чтобы выдать доступ специалистам.')
    ]);
  }

  function renderNewChild(user) {
    var nameInput = el('input', { id: 'childName', type: 'text', maxlength: '120', autocomplete: 'off' });
    var birthInput = el('input', { id: 'childBirth', type: 'date', max: todayISO() });
    var sexInput = el('select', { id: 'childSex' },
      el('option', { value: '', text: 'Выберите' }),
      el('option', { value: 'female', text: 'Девочка' }),
      el('option', { value: 'male', text: 'Мальчик' }));
    var weeksInput = el('input', { id: 'childWeeks', type: 'number', min: '22', max: '44', inputmode: 'numeric', placeholder: 'например, 39' });
    var hint = el('p', { class: 'hint', 'aria-live': 'polite', text: 'Возраст ребенка — от 0 до 5 лет 11 месяцев.' });
    var errorBox = el('p', { class: 'form-error', role: 'alert' });

    birthInput.addEventListener('input', function () {
      var iso = birthInput.value;
      var problem = iso ? validateBirthDate(iso) : '';
      if (problem) {
        errorBox.textContent = problem;
        hint.textContent = 'Возраст вне допустимого диапазона.';
        hint.className = 'form-error';
      } else if (iso) {
        errorBox.textContent = '';
        hint.textContent = 'Возраст: ' + formatAge(iso);
        hint.className = 'hint hint--ok';
      } else {
        errorBox.textContent = '';
        hint.textContent = 'Возраст ребенка — от 0 до 5 лет 11 месяцев.';
        hint.className = 'hint';
      }
    });

    function onSubmit(ev) {
      ev.preventDefault();
      var name = nameInput.value.trim();
      var birth = birthInput.value;
      if (!name) {
        errorBox.textContent = 'Укажите ФИО ребенка.';
        return;
      }
      var problem = validateBirthDate(birth);
      if (problem) {
        errorBox.textContent = problem;
        return;
      }
      if (!sexInput.value) {
        errorBox.textContent = 'Укажите пол: нормы ВОЗ для мальчиков и девочек разные.';
        return;
      }
      var weeks = weeksInput.value ? Number(weeksInput.value) : null;
      if (weeks !== null && (!Number.isInteger(weeks) || weeks < 22 || weeks > 44)) {
        errorBox.textContent = 'Срок гестации указывается в полных неделях, от 22 до 44.';
        return;
      }
      state.children.push({ id: uid('c'), parentId: user.id, fullName: name, birthDate: birth, sex: sexInput.value, gestationalAgeWeeks: weeks });
      save();
      navigate('parent');
    }

    show([
      pageHeader('Новый ребенок', { back: '#/parent', backText: 'Мои дети' }),
      el('form', { class: 'card form', novalidate: true, onsubmit: onSubmit },
        el('div', { class: 'field' },
          el('label', { for: 'childName', text: 'ФИО ребенка' }), nameInput),
        el('div', { class: 'field' },
          el('label', { for: 'childBirth', text: 'Дата рождения' }), birthInput, hint),
        el('div', { class: 'field' },
          el('label', { for: 'childSex', text: 'Пол' }), sexInput),
        el('div', { class: 'field' },
          el('label', { for: 'childWeeks', text: 'Срок рождения, недель (необязательно)' }), weeksInput,
          el('p', { class: 'hint', text: 'Если ребенок родился раньше 37 недель, чек-листы подбираются по скорректированному возрасту.' })),
        errorBox,
        el('button', { class: 'btn btn--primary btn--block', type: 'submit', text: 'Сохранить профиль' })
      )
    ]);
  }

  function grantRow(child, grant) {
    var specialist = findUser(grant.specialistId);
    return el('li', { class: 'row' },
      el('div', { class: 'row__main' },
        el('span', { class: 'row__title', text: specialist ? specialist.email : 'Аккаунт удален' }),
        el('span', { class: 'row__meta', text: (specialist ? specialist.fullName + ' · ' : '') + 'доступ с ' + formatDate(grant.grantedAt) })
      ),
      el('button', {
        class: 'btn btn--danger btn--small',
        type: 'button',
        text: 'Отозвать',
        onclick: function () {
          var label = specialist ? specialist.email : 'специалиста';
          if (!window.confirm('Отозвать доступ у ' + label + ' к ребенку ' + child.fullName + '?')) return;
          state.grants = state.grants.filter(function (g) { return g.id !== grant.id; });
          save();
          render();
        }
      })
    );
  }

  function accessSection(child) {
    var grants = state.grants.filter(function (g) { return g.childId === child.id; });
    var errorBox = el('p', { class: 'form-error', role: 'alert' });
    var emailInput = el('input', { id: 'grantEmail', type: 'email', autocomplete: 'off', placeholder: 'specialist@example.com' });

    function onSubmit(ev) {
      ev.preventDefault();
      errorBox.textContent = '';
      var email = emailInput.value.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        errorBox.textContent = 'Введите корректный e-mail специалиста.';
        return;
      }
      var specialist = state.users.find(function (u) {
        return u.role === 'specialist' && u.email === email;
      });
      if (!specialist) {
        errorBox.textContent = 'Специалист с таким e-mail не зарегистрирован.';
        return;
      }
      var already = state.grants.some(function (g) {
        return g.childId === child.id && g.specialistId === specialist.id;
      });
      if (already) {
        errorBox.textContent = 'Доступ этому специалисту уже выдан.';
        return;
      }
      state.grants.push({ id: uid('g'), childId: child.id, specialistId: specialist.id, grantedAt: new Date().toISOString() });
      save();
      render();
    }

    return el('section', { class: 'card', 'aria-labelledby': 'access-title' },
      el('h2', { id: 'access-title', class: 'section-title', text: 'Доступ специалистов' }),
      el('p', { class: 'muted', text: 'Специалист видит только детей, к которым вы открыли доступ. Доступ можно отозвать в любой момент.' }),
      grants.length
        ? el('ul', { class: 'row-list' }, grants.map(function (g) { return grantRow(child, g); }))
        : el('p', { class: 'muted', text: 'Доступ пока никому не выдан.' }),
      el('form', { class: 'form', novalidate: true, onsubmit: onSubmit },
        el('div', { class: 'field' },
          el('label', { for: 'grantEmail', text: 'E-mail специалиста' }), emailInput),
        errorBox,
        el('button', { class: 'btn btn--primary btn--block', type: 'submit', text: 'Выдать доступ' })
      )
    );
  }

  function parentNotesSection(child) {
    var notes = notesForChild(child.id);
    return el('section', { class: 'card', 'aria-labelledby': 'notes-title' },
      el('h2', { id: 'notes-title', class: 'section-title', text: 'Заметки специалистов' }),
      el('p', { class: 'muted', text: 'Режим только для чтения. Редактировать и удалять заметку может только ее автор.' }),
      notes.length
        ? el('ul', { class: 'note-list' }, notes.map(function (note) {
          return el('li', { class: 'note' },
            el('div', { class: 'note__meta', text: noteMeta(note, null) }),
            el('p', { class: 'note__text', text: note.text })
          );
        }))
        : el('p', { class: 'muted', text: 'Заметок пока нет.' })
    );
  }

  function renderParentChild(user, childId) {
    var child = getChildForParent(user.id, childId);
    if (!child) return renderNotFound(user);
    show([
      pageHeader(child.fullName, {
        back: '#/parent',
        backText: 'Мои дети',
        sub: 'Возраст: ' + formatAge(child.birthDate) + ' · дата рождения: ' + formatDate(child.birthDate)
      }),
      accessSection(child),
      parentNotesSection(child),
      plannedSection()
    ]);
  }


  function renderSpecialistHome(user) {
    var kids = grantedChildrenFor(user.id);
    show([
      pageHeader('Мои дети', { sub: 'Здесь только дети, к которым родители открыли вам доступ.' }),
      kids.length
        ? el('ul', { class: 'card-list' }, kids.map(function (c) {
          return childCard(c, '#/specialist/child/' + c.id);
        }))
        : emptyState('Пока нет детей с открытым доступом. Родитель может выдать его по вашему e-mail.')
    ]);
  }

  function noteEditor(note) {
    var textarea = el('textarea', { rows: '4', 'aria-label': 'Текст заметки' });
    textarea.value = note.text;
    var counter = el('span', { class: 'counter' });
    var saveBtn = el('button', { class: 'btn btn--primary btn--small', type: 'button', text: 'Сохранить' });
    var cancelBtn = el('button', {
      class: 'btn btn--ghost btn--small',
      type: 'button',
      text: 'Отмена',
      onclick: function () {
        editingNoteId = null;
        render();
      }
    });

    saveBtn.addEventListener('click', function () {
      var text = textarea.value.trim();
      if (!text || text.length > NOTE_MAX_LENGTH) return;
      note.text = text;
      note.updatedAt = new Date().toISOString();
      editingNoteId = null;
      save();
      render();
    });
    bindCounter(textarea, counter, saveBtn);

    return el('li', { class: 'note' },
      el('div', { class: 'note-editor' },
        textarea,
        el('div', { class: 'note-editor__actions' }, counter, cancelBtn, saveBtn)
      )
    );
  }

  function specialistNoteItem(user, note) {
    if (editingNoteId === note.id && note.authorId === user.id) return noteEditor(note);
    var own = note.authorId === user.id;
    return el('li', { class: 'note' },
      el('div', { class: 'note__meta', text: noteMeta(note, user.id) }),
      el('p', { class: 'note__text', text: note.text }),
      own
        ? el('div', { class: 'note__actions' },
          el('button', {
            class: 'btn btn--ghost btn--small',
            type: 'button',
            text: 'Редактировать',
            onclick: function () {
              editingNoteId = note.id;
              render();
            }
          }),
          el('button', {
            class: 'btn btn--danger btn--small',
            type: 'button',
            text: 'Удалить',
            onclick: function () {
              if (!window.confirm('Удалить заметку?')) return;
              state.notes = state.notes.filter(function (n) { return n.id !== note.id; });
              save();
              render();
            }
          })
        )
        : null
    );
  }

  function specialistNotesSection(user, child) {
    var textarea = el('textarea', { id: 'newNote', rows: '4', placeholder: 'Наблюдение, рекомендация, итог занятия...' });
    var counter = el('span', { class: 'counter', 'aria-live': 'polite' });
    var errorBox = el('p', { class: 'form-error', role: 'alert' });
    var submitBtn = el('button', { class: 'btn btn--primary btn--block', type: 'submit', text: 'Добавить заметку' });
    bindCounter(textarea, counter, submitBtn);

    function onSubmit(ev) {
      ev.preventDefault();
      var text = textarea.value.trim();
      if (!text) return;
      if (textarea.value.length > NOTE_MAX_LENGTH) {
        errorBox.textContent = 'Заметка не может быть длиннее ' + NOTE_MAX_LENGTH + ' символов.';
        return;
      }
      var now = new Date().toISOString();
      state.notes.push({ id: uid('n'), childId: child.id, authorId: user.id, text: text, createdAt: now, updatedAt: now });
      save();
      render();
    }

    var notes = notesForChild(child.id);
    return el('section', { class: 'card', 'aria-labelledby': 'notes-title' },
      el('h2', { id: 'notes-title', class: 'section-title', text: 'Заметки' }),
      el('p', { class: 'muted', text: 'Заметки видны всем специалистам, которым открыт доступ. Редактировать и удалять можно только свои.' }),
      el('form', { class: 'note-form form', novalidate: true, onsubmit: onSubmit },
        el('div', { class: 'field' },
          el('label', { for: 'newNote', text: 'Новая заметка' }),
          textarea,
          counter
        ),
        errorBox,
        submitBtn
      ),
      notes.length
        ? el('ul', { class: 'note-list' }, notes.map(function (note) {
          return specialistNoteItem(user, note);
        }))
        : el('p', { class: 'muted', text: 'Заметок пока нет.' })
    );
  }

  function renderSpecialistChild(user, childId) {
    var child = getChildForSpecialist(user.id, childId);
    if (!child) return renderNotFound(user);
    show([
      pageHeader(child.fullName, {
        back: '#/specialist',
        backText: 'Мои дети',
        sub: 'Возраст: ' + formatAge(child.birthDate)
      }),
      specialistNotesSection(user, child),
      plannedSection()
    ]);
  }

  function renderNotFound(user) {
    show([
      pageHeader('Не найдено', { back: '#/' + user.role, backText: 'Назад' }),
      emptyState('Ребенок не найден или у вас нет к нему доступа.')
    ]);
  }


  function parseRoute() {
    return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  }

  function render() {
    var user = currentUser();
    var parts = parseRoute();
    appbar.hidden = !user;

    if (!user) {
      state.session = null;
      if (parts[0] !== 'login') {
        navigate('login');
        return;
      }
      renderAuth();
      return;
    }

    if (parts[0] !== user.role) {
      navigate(user.role);
      return;
    }

    userLabel.textContent = user.fullName + ' · ' + ROLE_TITLES[user.role];

    if (user.role === 'parent') {
      if (parts[1] === 'new') return renderNewChild(user);
      if (parts[1] === 'child' && parts[2]) return renderParentChild(user, parts[2]);
      return renderParentHome(user);
    }

    if (parts[1] === 'child' && parts[2]) return renderSpecialistChild(user, parts[2]);
    return renderSpecialistHome(user);
  }

  logoutBtn.addEventListener('click', function () {
    state.session = null;
    save();
    editingNoteId = null;
    navigate('login');
  });

  window.addEventListener('hashchange', function () {
    editingNoteId = null;
    window.scrollTo(0, 0);
    render();
  });

  render();
})();
