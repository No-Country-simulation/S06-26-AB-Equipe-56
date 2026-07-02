import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// SVG Icons inlined for maximum React stability
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const AlertCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
    <polygon points="21.73 18 13.5 4 9.5 4 1.73 18 21.73 18"/>
    <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const BookOpenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-1"/><path d="M4.42 4.42 3 11l7 7"/><path d="M3 4h1l7 8"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const TrendingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);

const SatelliteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const QuoteIcon = ({ width = 28, height = 28 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [splashHidden, setSplashHidden] = useState(() => {
    return !!sessionStorage.getItem('splashShown');
  });

  useEffect(() => {
    // Splash screen logic (runs once per session to prevent annoying loops on page returns)
    const isSplashShown = sessionStorage.getItem('splashShown');
    let splashTimer;

    if (!isSplashShown) {
      document.body.style.overflow = 'hidden';
      splashTimer = setTimeout(() => {
        setSplashHidden(true);
        sessionStorage.setItem('splashShown', 'true');
        document.body.style.overflow = '';
      }, 2200);
    } else {
      document.body.style.overflow = '';
    }

    // Scroll event listener for navigation background
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-a]').forEach((el) => revealObserver.observe(el));

    // Counter animation helper
    const animateCounter = (el, target, dur = 1600) => {
      let start = 0;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.floor(e * target).toLocaleString('pt-BR') + '+';
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // Counter observer
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.dataset.counter) {
            animateCounter(e.target, parseInt(e.target.dataset.counter, 10));
            counterObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));

    // Smooth anchor link scrolling
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    const anchorElements = document.querySelectorAll('a[href^="#"]');
    anchorElements.forEach((a) => a.addEventListener('click', handleAnchorClick));

    // Clean up
    return () => {
      if (splashTimer) clearTimeout(splashTimer);
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      counterObserver.disconnect();
      anchorElements.forEach((a) => a.removeEventListener('click', handleAnchorClick));
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="landing-page-container">
      {/* SPLASH SCREEN LOADER */}
      <div id="splash" className={splashHidden ? 'hide' : ''}>
        <svg className="splash-tree" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path className="draw-path p1" d="M20 37V20" stroke="#5B3EA6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path className="draw-path p2" d="M20 28C16 25 10 23 8 18" stroke="#5B3EA6" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path className="draw-path p2" d="M20 28C24 25 30 23 32 18" stroke="#5B3EA6" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path className="draw-path p3" d="M20 22C16 19 13 14 12 10" stroke="#5B3EA6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path className="draw-path p3" d="M20 22C24 19 27 14 28 10" stroke="#5B3EA6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          
          <polygon className="draw-leaf l1" points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="#3D2480"/>
          <polygon className="draw-leaf l2" points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="#0B9484"/>
          <polygon className="draw-leaf l2" points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="#0B9484"/>
          <circle className="draw-leaf l3" cx="20" cy="16" r="2.5" fill="#C44D30"/>
        </svg>
        <div className="splash-nm">Inclusi<span>.va</span></div>
      </div>

      {/* NAV */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a className="nav-brand" href="#root">
          <svg width="32" height="32" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 37V20" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M20 28C16 25 10 23 8 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M20 28C24 25 30 23 32 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M20 22C16 19 13 14 12 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M20 22C24 19 27 14 28 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="var(--color-primary-strong)"/>
            <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="var(--color-secondary)"/>
            <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="var(--color-secondary)"/>
            <circle cx="20" cy="16" r="2.5" fill="var(--color-accent)"/>
          </svg>
          <span className="nav-nm">Inclusi<span>.va</span></span>
        </a>
        <ul className="nav-links">
          <li><a href="#problema">Problema</a></li>
          <li><a href="#proposito">Propósito</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#fluxo">Fluxo</a></li>
          <li><a href="#matching">IA &amp; Matching</a></li>
          <li><a href="#esg">ESG</a></li>
        </ul>
        <div className="nav-act">
          <Link to="/login" className="btn md out">Entrar</Link>
          <Link to="/registro-empresa" className="btn md pri">
            <span>Cadastrar</span><span className="nav-btn-word-extra"> Empresa</span>
            <span className="nav-btn-icon-extra"> <ArrowRight /></span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-orb1"></div>
        <div className="hero-orb2"></div>
        <div className="hero-orb3"></div>
        <div className="hero-hex-bg"></div>
        <div className="hero-inner">
          <div data-a="fr">
            <div className="hero-eyebrow">
              <div className="pill dk">
                <span className="dot-live"></span>Plataforma B2B de Empregabilidade
              </div>
            </div>
            <h1 className="display">
              <span style={{ color: 'rgba(255,255,255,.9)' }}>Diversidade no</span><br/>
              <span className="grad-vl">centro</span> <span style={{ color: 'rgba(255,255,255,.9)' }}>da</span><br/>
              <span className="grad-tl">estratégia</span>
            </h1>
            <p className="hero-desc">Conectamos empresas com talentos de grupos sub-representados usando IA explicável, mapa geográfico de concentração e métricas ESG auditáveis para investidores.</p>
            <div className="hero-ctas">
              <Link to="/registro-empresa" className="btn lg pri">
                Cadastrar Empresa <ArrowRight />
              </Link>
              <Link to="/login" className="btn lg gw">Acessar o Painel</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-n" data-counter="3400">0</span>
                <span className="stat-l">Talentos Conectados</span>
              </div>
              <div className="hero-stat">
                <span className="stat-n">97%</span>
                <span className="stat-l">Satisfação dos RHs</span>
              </div>
              <div className="hero-stat">
                <span className="stat-n">80+</span>
                <span className="stat-l">Empresas Parceiras</span>
              </div>
            </div>
          </div>

          <div className="hero-img-wrap" data-a="fl">
            <div className="float-card fc1">
              <svg width="16" height="16" style={{ color: '#C44D30' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              Match: <strong style={{ color: '#8ae3d9' }}>96%</strong>
            </div>
            <div className="float-card fc2">
              <svg width="16" height="16" style={{ color: '#0B9484' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Meta ESG atingida!
            </div>
            <img src="/hero_visual_network_1782783865106.png" alt="Rede de matching de talentos" loading="lazy" />
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <div className="stat-strip">
        <div className="stat-strip-inner">
          <div className="ss-item" data-a="fu" data-d="1"><span className="ss-n">3.4k+</span><div class="ss-l">Talentos na plataforma</div></div>
          <div className="ss-item" data-a="fu" data-d="2"><span class="ss-n">97%</span><div class="ss-l">Satisfação de RHs</div></div>
          <div className="ss-item" data-a="fu" data-d="3"><span class="ss-n">42%</span><div class="ss-l">Aumento médio em diversidade</div></div>
          <div className="ss-item" data-a="fu" data-d="4"><span class="ss-n">80+</span><div class="ss-l">Empresas parceiras</div></div>
        </div>
      </div>

      {/* PROBLEMA */}
      <section className="prob-sec" id="problema">
        <div className="prob-deco1"></div>
        <div className="prob-deco2"></div>
        <div className="prob-geo">
          <svg width="400" height="460" viewBox="0 0 400 460">
            <polygon points="200,10 390,115 390,345 200,450 10,345 10,115" fill="none" stroke="rgba(91,62,166,.15)" strokeWidth="1"/>
            <polygon points="200,50 350,135 350,325 200,410 50,325 50,135" fill="none" stroke="rgba(91,62,166,.1)" strokeWidth="1"/>
            <polygon points="200,90 310,155 310,305 200,370 90,305 90,155" fill="none" stroke="rgba(91,62,166,.06)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="wrap">
          <div className="prob-grid">
            <div>
              <div className="pill rs" style={{ marginBottom: '20px' }} data-a="fu">
                <AlertCircle /> O Problema
              </div>
              <h2 className="display prob-h" data-a="fu" data-d="1">Empresas com metas ESG não conseguem contratar com <span style={{ color: '#f4a490' }}>eficiência</span></h2>
              <p className="prob-sub" data-a="fu" data-d="2">Os processos seletivos tradicionais perpetuam vieses e excluem exatamente quem poderia cumprir as metas de diversidade.</p>
              <div className="pain-cards">
                <div className="pain-card" data-a="fu" data-d="1">
                  <div className="pain-icon"><SearchIcon /></div>
                  <div>
                    <div className="pain-title">Candidatos invisíveis</div>
                    <div className="pain-desc">Dificuldade em encontrar profissionais qualificados de grupos sub-representados nas fontes tradicionais.</div>
                  </div>
                </div>
                <div className="pain-card" data-a="fu" data-d="2">
                  <div className="pain-icon"><BrainIcon /></div>
                  <div>
                    <div className="pain-title">Viés inconsciente sistêmico</div>
                    <div className="pain-desc">Processos que perpetuam a exclusão por padrões históricos — sem que os recrutadores percebam.</div>
                  </div>
                </div>
                <div className="pain-card" data-a="fu" data-d="3">
                  <div className="pain-icon"><BarChartIcon /></div>
                  <div>
                    <div className="pain-title">Falta de dados confiáveis</div>
                    <div className="pain-desc">Ausência de métricas robustas para embasar decisões de diversidade e reportar a stakeholders.</div>
                  </div>
                </div>
                <div className="pain-card" data-a="fu" data-d="4">
                  <div className="pain-icon"><MapPinIcon /></div>
                  <div>
                    <div className="pain-title">Desconhecimento geográfico</div>
                    <div className="pain-desc">Empresas não sabem onde estão os talentos por região — perdendo oportunidades locais de contratação inclusiva.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="quote-panel" data-a="fl">
              <div className="qp-deco"></div><div className="qp-deco2"></div>
              <div className="q-accent">"</div>
              <p className="q-text">Empresas com diversidade étnica e de gênero têm maior probabilidade de superar seus concorrentes financeiramente.</p>
              <div className="q-stats">
                <div className="q-row">
                  <span className="q-num grad-vl">35%</span>
                  <span className="q-desc">mais lucrativas — empresas com diversidade étnica superior à média do setor (McKinsey)</span>
                </div>
                <div className="q-row">
                  <span className="q-num grad-tl">25%</span>
                  <span className="q-desc">mais rentáveis — empresas líderes em diversidade de gênero na liderança</span>
                </div>
                <div className="q-row">
                  <span className="q-num" style={{ background: 'linear-gradient(135deg,#C44D30,#9A3A1E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>87%</span>
                  <span className="q-desc">dos investidores consideram ESG critério relevante para decisão de aporte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONEXÃO HUMANA */}
      <section className="human-sec" id="proposito">
        <div className="human-bg-glow1"></div>
        <div className="human-bg-glow2"></div>
        <div className="wrap">
          <div className="human-grid">
            <div className="human-text-col" data-a="fr">
              <div className="pill tl" style={{ marginBottom: '20px' }}>
                <HeartIcon /> Foco nas Pessoas
              </div>
              <h2 className="display human-h">
                Transformamos o potencial dos <span className="grad-vl">talentos</span> em impacto real.
              </h2>
              <p className="human-desc">
                Por trás de cada métrica ESG e algoritmo de IA, existem trajetórias reais de vida.
                Na Inclusi.va, unimos a precisão tecnológica ao cuidado humano para que a diversidade 
                deixe de ser apenas um dado e se torne a maior força de inovação da sua empresa.
              </p>
              <div className="human-features">
                <div className="human-feat-item">
                  <div className="human-feat-dot dot-vl"></div>
                  <div>
                    <strong>Cuidado com a jornada:</strong> Desenvolvemos trilhas de acolhimento e suporte desde o primeiro contato do candidato.
                  </div>
                </div>
                <div className="human-feat-item">
                  <div className="human-feat-dot dot-tl"></div>
                  <div>
                    <strong>Cultura que acolhe:</strong> Preparamos as lideranças e equipes para integrar e desenvolver os novos talentos de forma inclusiva.
                  </div>
                </div>
                <div className="human-feat-item">
                  <div className="human-feat-dot dot-tc"></div>
                  <div>
                    <strong>Match de afinidade:</strong> Avaliamos competências técnicas aliadas ao contexto socioeconômico e de pertencimento regional.
                  </div>
                </div>
              </div>
              <div className="human-action" style={{ marginTop: '36px' }}>
                <a href="#servicos" className="btn lg pri">
                  Conheça Nossos Serviços <ArrowRight />
                </a>
              </div>
            </div>
            
            <div className="human-img-col" data-a="fl">
              <div className="human-photo-wrapper">
                <div className="human-photo-glow"></div>
                <img 
                  src="/talent_smiling_glow.png" 
                  alt="Talento sorridente da Inclusi.va" 
                  className="human-photo-img" 
                />
                
                {/* Floating Micro-interactions / highlights showing details */}
                <div className="human-tag tag-top">
                  <span className="dot-live"></span>
                  <span>Conectando histórias</span>
                </div>
                <div className="human-tag tag-bottom">
                  <span>Cuidado &amp; Tecnologia 💜</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="srv-sec" id="servicos">
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div data-a="fu" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '8px' }}>
            <div>
              <div className="pill vl" style={{ marginBottom: '14px' }}>
                <BriefcaseIcon /> Os 5 Serviços — MVP
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>Uma plataforma.<br/><span className="grad-mixed">Cinco frentes</span> de impacto.</h2>
            </div>
            <p style={{ fontSize: '16px', color: 'var(--n600)', maxWidth: '380px', lineHeight: 1.7 }}>Não é apenas recrutamento. É a diversidade no centro da estratégia de negócio — com dados reais e impacto mensurável.</p>
          </div>
          <div className="srv-grid">
            <div className="srv-card feat" data-a="fs">
              <div className="srv-fi">
                <div>
                  <div className="srv-num">Serviço 01</div>
                  <div className="srv-icon si-dk"><BriefcaseIcon /></div>
                  <h3 className="srv-ttl">Empregabilidade</h3>
                  <p className="srv-desc">Publicação de vagas com matching inteligente. Score de compatibilidade + badge de diversidade + filtro anti-viés para reduzir discriminação inconsciente no processo seletivo.</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <span className="pill dk">
                      <svg width="10" height="10" className="mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      Core MVP
                    </span>
                    <span className="pill dk">
                      <TrendingIcon /> Revenue
                    </span>
                  </div>
                </div>
                <div className="srv-code">
                  <div className="srv-code-lbl">POST /match</div>
                  <pre>{`{
  "empresa_id": "bit-001",
  "vaga": {
    "titulo": "Dev Full Stack",
    "skills": ["React","Node"],
    "nivel": "junior",
    "regiao": "SP"
  },
  "filtros": {
    "anti_vies": true,
    "diversidade_minima": 0.4
  }
}`}</pre>
                </div>
              </div>
            </div>

            <div className="srv-card" data-a="fu" data-d="1">
              <div className="srv-num">Serviço 02</div>
              <div className="srv-icon si-tc"><BookOpenIcon /></div>
              <h3 className="srv-ttl">Formações</h3>
              <p className="srv-desc">Trilhas de capacitação em diversidade e inclusão para equipes de RH e lideranças. Cultura inclusiva de dentro para fora.</p>
              <span className="pill tc" style={{ marginTop: '18px', fontSize: '10px' }}>Cultura D&amp;I</span>
            </div>

            <div className="srv-card" data-a="fu" data-d="2">
              <div className="srv-num">Serviço 03</div>
              <div className="srv-icon si-pu"><MicIcon /></div>
              <h3 className="srv-ttl">Experiências Estruturantes</h3>
              <p className="srv-desc">Eventos corporativos — painéis e palestras com líderes de grupos sub-representados para inspirar a cultura interna.</p>
              <span className="pill" style={{ background: '#F3E8FF', color: '#7C3AED', border: '1px solid rgba(124,58,237,.2)', marginTop: '18px', fontSize: '10px' }}>Eventos &amp; Cultura</span>
            </div>

            <div className="srv-card" data-a="fu" data-d="3">
              <div className="srv-num">Serviço 04</div>
              <div className="srv-icon si-tl"><HandshakeIcon /></div>
              <h3 className="srv-ttl">Mentorias</h3>
              <p className="srv-desc">Conexão com líderes de diversidade de outras empresas para troca de boas práticas. Networking orientado por impacto real.</p>
              <span className="pill tl" style={{ marginTop: '18px', fontSize: '10px' }}>Networking</span>
            </div>

            <div className="srv-card" data-a="fu" data-d="4">
              <div className="srv-num">Serviço 05</div>
              <div className="srv-icon si-rs"><HeartIcon /></div>
              <h3 className="srv-ttl">Saúde do Time</h3>
              <p className="srv-desc">Dashboard de bem-estar por perfil e região. Identifique riscos de burnout ou exclusão antes que virem problema.</p>
              <span className="pill rs" style={{ marginTop: '18px', fontSize: '10px' }}>People Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* FLUXO + MAPA */}
      <section className="flow-sec" id="fluxo">
        <div className="flow-bg-shape"></div>
        <div className="wrap">
          <div data-a="fu">
            <div className="pill vl" style={{ marginBottom: '14px' }}>
              <svg width="12" height="12" className="mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              Fluxo do Usuário Recrutador
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: '14px' }}>Do cadastro ao insight<br/><span className="grad-vl">em 6 etapas</span></h2>
          </div>
          <div className="flow-grid">
            <div className="flow-steps">
              <div className="flow-step" data-a="fr" data-d="1">
                <div className="flow-line"><div className="flow-circle">1</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">Cadastro e configuração</div>
                  <div className="flow-desc">Empresa se cadastra e configura perfil de diversidade, definindo metas ESG e indicadores para o período.</div>
                </div>
              </div>
              <div className="flow-step" data-a="fr" data-d="2">
                <div className="flow-line"><div className="flow-circle">2</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">Publicação da vaga</div>
                  <div className="flow-desc">Recrutador publica com requisitos técnicos (skills, nível, região) e filtros de diversidade — sem preenchimento complexo.</div>
                </div>
              </div>
              <div className="flow-step" data-a="fr" data-d="3">
                <div className="flow-line"><div className="flow-circle" style={{ background: 'var(--vl-dk)', borderColor: 'var(--vl-dk)', color: 'var(--wh)' }}>3</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">IA retorna shortlist</div>
                  <div className="flow-desc">Agente processa <code className="ci">POST /match</code> e retorna candidatos com score, badge de diversidade e justificativa explicável.</div>
                </div>
              </div>
              <div className="flow-step" data-a="fr" data-d="4">
                <div className="flow-line"><div className="flow-circle">4</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">Mapa de concentração</div>
                  <div className="flow-desc">Visualiza talentos por região via <strong>Vísent CDRView</strong> — onde estão os candidatos e qual a conectividade local.</div>
                </div>
              </div>
              <div className="flow-step" data-a="fr" data-d="5">
                <div className="flow-line"><div className="flow-circle">5</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">Seleção e contato</div>
                  <div className="flow-desc">Recrutador seleciona e inicia o processo de contato diretamente pela plataforma.</div>
                </div>
              </div>
              <div className="flow-step" data-a="fr" data-d="6">
                <div className="flow-line"><div className="flow-circle" style={{ background: 'var(--tl-dk)', borderColor: 'var(--tl-dk)', color: 'var(--wh)' }}>6</div><div className="flow-conn"></div></div>
                <div className="flow-body">
                  <div className="flow-ttl">Dashboard atualizado</div>
                  <div className="flow-desc">Métricas atualizadas em tempo real. Relatório exportável em PDF para stakeholders e investidores.</div>
                </div>
              </div>
            </div>

            <div className="map-panel" data-a="fl">
              <div className="map-img-wrap">
                <img src="/esg_map_visual_1782783882617.png" alt="Mapa de concentração de talentos por região no Brasil" />
                <div className="map-overlay">
                  <div className="map-stat"><span className="map-stat-n">2.8k</span><div className="map-stat-l">Perfis disponíveis na região</div></div>
                  <div className="map-stat"><span className="map-stat-n">94%</span><div className="map-stat-l">Cobertura 4G na área</div></div>
                </div>
              </div>
              <div className="cdr-note">
                <SatelliteIcon />
                <div>
                  <div className="cdr-ttl">Dataset Vísent CDRView</div>
                  <div className="cdr-desc">Dados de concentração por zona + cobertura ERB (5G/4G/3G) com coordenadas reais de antenas Anatel. Endpoint <code className="ci">GET /insights</code> retorna mapa de talentos por região.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATCHING */}
      <section className="match-sec" id="matching">
        <div className="match-deco"></div>
        <div className="wrap">
          <div data-a="fu">
            <div className="pill vl" style={{ marginBottom: '14px' }}>
              <BrainIcon /> Motor de Matching
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: 0 }}>IA com explicabilidade.<br/><span className="grad-vl">caixa-preta</span>.</h2>
          </div>
          <div className="match-grid">
            <div className="feat-list">
              <div className="feat-item" data-a="fr" data-d="1">
                <div className="feat-ic fi-vl"><SearchIcon /></div>
                <div>
                  <div className="feat-ttl">Matching Anti-Viés com NLP</div>
                  <div className="feat-desc">Processamento de linguagem natural elimina padrões históricos de exclusão inconsciente na triagem inicial.</div>
                </div>
              </div>
              <div className="feat-item" data-a="fr" data-d="2">
                <div className="feat-ic fi-tl"><AwardIcon /></div>
                <div>
                  <div className="feat-ttl">Badge de Diversidade</div>
                  <div className="feat-desc">Cada candidato recebe badges declarativos (Gênero, Raça/Etnia, PCD, LGBTQIA+) que enriquecem o score sem substituir avaliação técnica.</div>
                </div>
              </div>
              <div className="feat-item" data-a="fr" data-d="3">
                <div className="feat-ic fi-tc">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                  <div className="feat-ttl">Explicabilidade por Candidato</div>
                  <div className="feat-desc">Cada recomendação vem com justificativa completa — skills compatíveis, ausentes e impacto ESG da contratação.</div>
                </div>
              </div>
              <div className="feat-item" data-a="fr" data-d="4">
                <div className="feat-ic fi-pu">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div className="feat-ttl">Relatório Exportável em PDF</div>
                  <div className="feat-desc">Relatórios de diversidade com indicadores reais e histórico de metas para apresentar a investidores.</div>
                </div>
              </div>
            </div>
            <div className="ai-vis" data-a="fl">
              <div className="ai-cand">
                <div className="ai-row">
                  <div className="ai-av">
                    <img src="/avatar_gabriela_1782786086760.png" alt="Gabriela Mendes" />
                  </div>
                  <div>
                    <div className="ai-nm">Gabriela Mendes Santos</div>
                    <div className="ai-sb">Cientista de Dados · Sênior</div>
                  </div>
                  <div className="ai-sc">97%</div>
                </div>
                <div className="ai-bdgs">
                  <span className="ai-b ab-vl">Mulher</span>
                  <span className="ai-b ab-tc">Parda</span>
                  <span className="ai-b ab-tl">↑ ESG</span>
                </div>
              </div>
              <div className="expl-box">
                <div className="expl-lbl">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Explicabilidade · IA Inclusi.va
                </div>
                <div className="expl-row"><div className="ei ok"><CheckIcon /></div><span className="et">Python · SQL · NLP · Pandas</span></div>
                <div className="expl-row"><div className="ei ok"><CheckIcon /></div><span className="et">Promove equidade de gênero em STEM</span></div>
                <div className="expl-row"><div className="ei ok"><CheckIcon /></div><span className="et">+6% no índice ESG da empresa</span></div>
                <div className="expl-row miss"><div className="ei no"><XIcon /></div><span className="et">Docker (ausente no perfil)</span></div>
              </div>
              <div className="json-box">
                <div className="json-lbl">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Response /match
                </div>
                <pre>{`{ "score_match": 0.97,
  "badge": ["F","PA"],
  "lat": -23.5489,
  "lng": -46.6388 }`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="esg-sec" id="esg">
        <div className="esg-bg-num">ESG</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="esg-intro" data-a="fu">
            <div>
              <div className="pill tl" style={{ marginBottom: '16px' }}><TrendingIcon /> Impacto ESG</div>
              <h2 className="display esg-h">Diversidade não é cota.<br/>É <span className="grad-tl">estratégia</span>.</h2>
            </div>
            <p className="esg-sub">Empresas com times diversos são 35% mais lucrativas. Ajudamos você a medir, acompanhar e comunicar esse impacto com dados reais e auditáveis para reguladores e investidores.</p>
          </div>
          <div className="esg-grid">
            <div className="esg-card c1" data-a="fu" data-d="1">
              <span className="esg-ic"><svg width="32" height="32" style={{ color: 'rgba(196,180,253,.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
              <span className="esg-num" style={{ color: '#c4b5fd' }}>50%</span>
              <div className="esg-lbl">Meta de mulheres em cargos tech</div>
            </div>
            <div className="esg-card c2" data-a="fu" data-d="2">
              <span className="esg-ic"><TargetIcon /></span>
              <span className="esg-num" style={{ color: '#6dddd3' }}>45%</span>
              <div className="esg-lbl">Meta de negros e pardos</div>
            </div>
            <div className="esg-card c3" data-a="fu" data-d="3">
              <span className="esg-ic"><svg width="32" height="32" style={{ color: 'rgba(249,180,158,.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></span>
              <span className="esg-num" style={{ color: '#f9b49e' }}>10%</span>
              <div className="esg-lbl">Meta PCD — Lei de Cotas</div>
            </div>
            <div className="esg-card c4" data-a="fu" data-d="4">
              <span className="esg-ic"><AwardIcon /></span>
              <span className="esg-num" style={{ color: '#c4b5fd' }}>20%</span>
              <div className="esg-lbl">Meta LGBTQIA+ em liderança</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="testi-sec" id="depoimentos">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '52px' }} data-a="fu">
            <div className="pill vl" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <QuoteIcon width={12} height={12} /> Depoimentos
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>O que nossos clientes <span className="grad-vl">dizem</span></h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card" data-a="fu" data-d="1">
              <span className="testi-ic"><QuoteIcon /></span>
              <p className="testi-txt">"Em 3 meses, aumentamos a representatividade feminina no time de tecnologia de 18% para 41%. Os dados de explicabilidade salvaram muitas discussões sobre mérito x diversidade."</p>
              <div className="testi-auth">
                <div className="t-av">
                  <img src="/avatar_paula_1782786103524.png" alt="Paula Ferreira" />
                </div>
                <div>
                  <div className="t-nm">Paula Ferreira</div>
                  <div className="t-rl">Head de People, Tech Inclusão</div>
                </div>
              </div>
            </div>
            <div className="testi-card" data-a="fu" data-d="2">
              <span className="testi-ic"><QuoteIcon /></span>
              <p className="testi-txt">"Finalmente conseguimos reportar indicadores ESG com dados concretos e auditáveis para investidores. Simplificou algo que levava semanas de trabalho manual."</p>
              <div className="testi-auth">
                <div className="t-av">
                  <img src="/avatar_rafael_1782786136013.png" alt="Rafael Moura" />
                </div>
                <div>
                  <div className="t-nm">Rafael Moura</div>
                  <div className="t-rl">CHRO, Solar Tech S/A</div>
                </div>
              </div>
            </div>
            <div className="testi-card" data-a="fu" data-d="3">
              <span className="testi-ic"><QuoteIcon /></span>
              <p className="testi-txt">"O mapa de talentos foi revelador. Descobrimos concentração enorme de profissionais em zonas periféricas que nunca chegariam até nós pelos métodos tradicionais."</p>
              <div className="testi-auth">
                <div className="t-av">
                  <img src="/avatar_aline_1782786119702.png" alt="Camila Andrade" />
                </div>
                <div>
                  <div className="t-nm">Camila Andrade</div>
                  <div className="t-rl">Gerente de RH, Visão Tech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-ring" style={{ width: '300px', height: '300px', bottom: '-100px', left: '-100px' }}></div>
        <div className="cta-ring" style={{ width: '200px', height: '200px', top: '-60px', right: '20%' }}></div>
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div data-a="fu">
            <div className="pill dk" style={{ marginBottom: '20px', display: 'inline-flex' }}>Pronto para começar?</div>
            <h2 className="display cta-h">Diversidade no centro.<br/>Resultados com impacto.</h2>
            <p className="cta-sub">Junte-se a mais de 80 empresas que já transformam seus processos seletivos com IA inclusiva, mapa de talentos e relatórios ESG auditáveis.</p>
          </div>
          <div className="cta-btns" data-a="fu" data-d="1">
            <Link to="/registro-empresa" className="btn lg lit">
              Cadastrar Empresa <ArrowRight />
            </Link>
            <Link to="/login" className="btn lg gw">Acessar o Painel</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <svg width="26" height="26" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 37V20" stroke="#7B5EC4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <path d="M20 28C16 25 10 23 8 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M20 28C24 25 30 23 32 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="#5B3EA6"/>
                  <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="#0B9484"/>
                  <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="#0B9484"/>
                </svg>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '18px', color: 'rgba(255,255,255,.8)' }}>Inclusi<span style={{ color: '#7B5EC4' }}>.va</span></span>
              </div>
              <p className="footer-desc">Plataforma B2B de empregabilidade inteligente e inclusiva.<br/>Desenvolvida com 💜 para o Hackathon de Empregabilidade.<br/><a href="https://github.com/wongola-bit/appbit">github.com/wongola-bit/appbit</a></p>
            </div>
            <div><div className="fcol-h">Produto</div><ul className="footer-lnks"><li><a href="#servicos">Empregabilidade</a></li><li><a href="#servicos">Formações</a></li><li><a href="#fluxo">Mapa CDRView</a></li><li><a href="#matching">IA &amp; Matching</a></li></ul></div>
            <div><div className="fcol-h">Empresa</div><ul className="footer-lnks"><li><a href="#problema">Sobre nós</a></li><li><a href="#depoimentos">Depoimentos</a></li><li><a href="#root">Carreiras</a></li><li><a href="#root">Contato</a></li></ul></div>
            <div><div className="fcol-h">Legal</div><ul className="footer-lnks"><li><a href="#root">Termos de Uso</a></li><li><a href="#root">Privacidade</a></li><li><a href="#root">Política ESG</a></li><li><a href="#root">LGPD</a></li></ul></div>
          </div>
          <hr className="footer-hr" />
          <div className="footer-bot">
            <span>© 2026 Inclusi.va. Todos os direitos reservados.</span>
            <span>Hackathon de Empregabilidade &amp; Diversidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
