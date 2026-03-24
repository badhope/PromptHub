const translations = {
  zh: {
    nav: {
      title: 'AI Agent',
      browse: '浏览智能体'
    },
    hero: {
      title: '探索',
      titleHighlight: 'AI Agent 生态系统',
      subtitle: '通过 GitHub Raw URL 即时激活专业智能体，无门槛跨平台使用',
      agents: '智能体',
      categories: '分类',
      browseBtn: '浏览全部智能体',
      stats: {
        agents: '智能体',
        categories: '分类'
      }
    },
    search: {
      placeholder: '搜索智能体名称、描述或标签...'
    },
    categories: {
      all: '全部'
    },
    card: {
      bestFor: '擅长领域'
    },
    modal: {
      activationCode: '激活码',
      copyCode: '复制激活码',
      copied: '已复制',
      close: '关闭',
      activate: '激活智能体'
    },
    empty: {
      title: '未找到匹配的智能体',
      desc: '尝试调整搜索条件或浏览其他分类'
    },
    toast: {
      copySuccess: '复制成功！'
    },
    footer: {
      copyright: '© 2024-2026 AI Agent Ecosystem · MIT License',
      github: 'GitHub',
      docs: '文档',
      license: '许可证'
    }
  },
  en: {
    nav: {
      title: 'AI Agent',
      browse: 'Browse Agents'
    },
    hero: {
      title: 'Explore',
      titleHighlight: 'AI Agent Ecosystem',
      subtitle: 'Instantly activate professional AI agents via GitHub Raw URLs. Cross-platform, no barriers.',
      agents: 'Agents',
      categories: 'Categories',
      browseBtn: 'Browse All Agents',
      stats: {
        agents: 'Agents',
        categories: 'Categories'
      }
    },
    search: {
      placeholder: 'Search agents by name, description, or tags...'
    },
    categories: {
      all: 'All'
    },
    card: {
      bestFor: 'Best for'
    },
    modal: {
      activationCode: 'Activation Code',
      copyCode: 'Copy Code',
      copied: 'Copied!',
      close: 'Close',
      activate: 'Activate Agent'
    },
    empty: {
      title: 'No matching agents found',
      desc: 'Try adjusting your search or browse other categories'
    },
    toast: {
      copySuccess: 'Copied successfully!'
    },
    footer: {
      copyright: '© 2024-2026 AI Agent Ecosystem · MIT License',
      github: 'GitHub',
      docs: 'Docs',
      license: 'License'
    }
  }
};

let currentLang = localStorage.getItem('lang') || 'zh';

function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      return key;
    }
  }
  return value;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateUI();
}

function getLang() {
  return currentLang;
}

function updateUI() {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.textContent = currentLang === 'zh' ? 'EN' : '中';
  }
  document.getElementById('heroTitle') && (document.getElementById('heroTitle').innerHTML = `${t('hero.title')} <span class="grad">${t('hero.titleHighlight')}</span>`);
  document.getElementById('heroSubtitle') && (document.getElementById('heroSubtitle').textContent = t('hero.subtitle'));
  document.getElementById('browseBtn') && (document.getElementById('browseBtn').textContent = t('hero.browseBtn'));
  document.getElementById('searchInput') && (document.getElementById('searchInput').placeholder = t('search.placeholder'));
  document.getElementById('agentsCount') && (document.getElementById('agentsCount').textContent = window.agentsData?.agents.length || 0);
  document.getElementById('categoriesCount') && (document.getElementById('categoriesCount').textContent = (window.agentsData?.categories.length || 0) - 1);
  document.getElementById('agentsLabel') && (document.getElementById('agentsLabel').textContent = t('hero.stats.agents'));
  document.getElementById('categoriesLabel') && (document.getElementById('categoriesLabel').textContent = t('hero.stats.categories'));
  renderCategories();
  renderAgents();
}

window.i18n = { t, setLang, getLang, updateUI, translations };