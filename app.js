// Arquivo JavaScript para animações e interatividade

// Função para animar elementos ao scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Smooth scroll para links internos
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
                const headerOffset = 0; // Ajuste se houver header fixo
                
                window.scrollTo({
                    top: offsetTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animação de contador (caso queira adicionar estatísticas no futuro)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Efeito parallax suave no hero
function parallaxEffect() {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        hero.style.transform = `translate3d(0, ${parallax}px, 0)`;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Observador de interseção para animações mais eficientes
function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Para de observar o elemento após a animação
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observa todos os elementos fade-in
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Animação escalonada para os cards dos atletas
function staggerCardAnimations() {
    const cards = document.querySelectorAll('.athlete-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Efeito de hover nos badges de esporte
function animateSportBadges() {
    const badges = document.querySelectorAll('.sport-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Função para detectar se o usuário prefere movimento reduzido
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Loading da página com fade-in
function pageLoadAnimation() {
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        if (!respectsReducedMotion()) {
            document.body.style.transition = 'opacity 0.5s ease';
        }
        document.body.style.opacity = '1';
    });
}

// Otimização para scroll (throttling)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Animação do título hero com efeito typewriter (opcional)
function typewriterEffect(element, text, speed = 100) {
    if (respectsReducedMotion()) {
        element.textContent = text;
        return;
    }
    
    let i = 0;
    element.textContent = '';
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funções
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    } else {
        // Fallback para navegadores antigos
        window.addEventListener('scroll', throttle(animateOnScroll, 16));
    }
    
    smoothScroll();
    staggerCardAnimations();
    animateSportBadges();
    pageLoadAnimation();
    
    // Só ativa parallax se o usuário não preferir movimento reduzido
    if (!respectsReducedMotion()) {
        parallaxEffect();
    }
    
    // Animação inicial para elementos visíveis
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }, 300);
});

// Event listeners adicionais
window.addEventListener('scroll', throttle(() => {
    // Adiciona classe para header transparente (se implementar)
    const scrolled = window.pageYOffset > 100;
    document.body.classList.toggle('scrolled', scrolled);
}, 16));

// Resize listener para recalcular animações
window.addEventListener('resize', throttle(() => {
    // Recalcula posições se necessário
    animateOnScroll();
}, 250));

// Função para melhorar a acessibilidade - foco visível
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Log para debug (remover em produção)
console.log('Esportistas Negros do Brasil - JavaScript carregado com sucesso!');

// Expoção de funções globais para uso futuro
window.AtletasApp = {
    animateOnScroll,
    animateCounter,
    typewriterEffect,
    respectsReducedMotion
};