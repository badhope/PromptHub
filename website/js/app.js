(function() {
  const { agents, categories, getAgentUrl, getActivationPrompt } = window.agentsData;
  const { t, getLang, updateUI } = window.i18n;

  let currentCat = 'all';
  let currentAgent = null;
  let searchQuery = '';

  function init() {
    renderCategories();
    renderAgents();
    setupEventListeners();
    updateUI();
    window.agentsData = agents;
  }

  function renderCategories() {
    const catsContainer = document.getElementById('categories');
    if (!catsContainer) return;

    const catCounts = {};
    agents.forEach(agent => {
      catCounts[agent.cat] = (catCounts[agent.cat] || 0) + 1;
    });

    catsContainer.innerHTML = categories.map(cat => {
      const count = cat.id === 'all' ? agents.length : (catCounts[cat.id] || 0);
      const isActive = cat.id === currentCat;
      return `
        <button class="cat-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}">
          ${cat.icon} ${getLang() === 'zh' ? cat.name : cat.name}
          <span class="count">${count}</span>
        </button>
      `;
    }).join('');
  }

  function renderAgents() {
    const grid = document.getElementById('agentsGrid');
    if (!grid) return;

    let filtered = agents;

    if (currentCat !== 'all') {
      filtered = filtered.filter(a => a.cat === currentCat);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.desc.toLowerCase().includes(query) ||
        (a.bestFor && a.bestFor.toLowerCase().includes(query)) ||
        (a.cat && a.cat.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <h3>${t('empty.title')}</h3>
          <p>${t('empty.desc')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(agent => `
      <div class="agent-card" data-agent='${JSON.stringify(agent).replace(/'/g, "&#39;")}'>
        <div class="card-header">
          <div class="card-avatar">${agent.icon}</div>
          <div class="card-info">
            <h3>${agent.name}</h3>
            <span class="cat-tag">${getCategoryName(agent.cat)}</span>
          </div>
        </div>
        <p class="card-desc">${agent.desc}</p>
        <div class="card-tags">
          ${agent.bestFor.split('、').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  function getCategoryName(catId) {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  }

  function openModal(agent) {
    currentAgent = agent;
    const modal = document.getElementById('modal');
    if (!modal) return;

    document.getElementById('modalAvatar').textContent = agent.icon;
    document.getElementById('modalTitle').textContent = agent.name;
    document.getElementById('modalCat').textContent = getCategoryName(agent.cat);
    document.getElementById('modalDesc').textContent = agent.desc;
    document.getElementById('modalTags').innerHTML = agent.bestFor.split('、').map(tag =>
      `<span class="tag">${tag.trim()}</span>`
    ).join('');

    const activationCode = getActivationPrompt(agent);
    document.getElementById('modalCode').textContent = activationCode;
    document.getElementById('modalCode').dataset.code = activationCode;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    currentAgent = null;
  }

  async function copyCode() {
    const code = document.getElementById('modalCode').dataset.code || document.getElementById('modalCode').textContent;
    try {
      await navigator.clipboard.writeText(code);
      showToast(t('toast.copySuccess'));
      const copyBtn = document.getElementById('copyBtn');
      if (copyBtn) {
        copyBtn.textContent = t('modal.copied');
        setTimeout(() => {
          copyBtn.textContent = t('modal.copyCode');
        }, 2000);
      }
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(t('toast.copySuccess'));
    }
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      document.getElementById('toastMessage').textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }

  function setupEventListeners() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.agent-card');
      if (card) {
        try {
          const agentData = card.dataset.agent;
          const agent = JSON.parse(agentData);
          openModal(agent);
        } catch (err) {
          console.error('Error parsing agent data:', err);
        }
      }

      const catBtn = e.target.closest('.cat-btn');
      if (catBtn) {
        currentCat = catBtn.dataset.cat;
        renderCategories();
        renderAgents();
      }

      if (e.target.id === 'modalOverlay' || e.target.closest('.modal-close') || e.target.closest('.modal-close-btn')) {
        closeModal();
      }

      if (e.target.id === 'copyBtn' || e.target.closest('#copyBtn') || e.target.closest('.modal-code-copy')) {
        copyCode();
      }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchQuery = e.target.value;
          renderAgents();
        }, 200);
      });
    }

    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
      langSwitch.addEventListener('click', () => {
        const newLang = getLang() === 'zh' ? 'en' : 'zh';
        window.i18n.setLang(newLang);
      });
    }

    const activateBtn = document.getElementById('activateBtn');
    if (activateBtn) {
      activateBtn.addEventListener('click', () => {
        copyCode();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    const browseBtn = document.getElementById('browseBtn');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        document.getElementById('agentsSection')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', () => {
      const nav = document.querySelector('nav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();