/**
 * PRAVINTH N - PORTFOLIO INTERACTION CONTROLLER
 * Handles Dark/Light theme switching, canvas particle network, 
 * dynamic typing animation, scroll tracking, validation, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Dark & Light Mode Theme Management
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check user preference or stored theme
    const savedTheme = localStorage.getItem('pravinth_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pravinth_theme', newTheme);
        showToast(`Switched to ${newTheme} mode`, 'info', 2000);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // -------------------------------------------------------------------------
    // 2. Subtle AI Particle Canvas Background
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particleCount = Math.min(Math.floor(window.innerWidth / 28), 45);
        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 1.8 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                const isLight = htmlElement.getAttribute('data-theme') === 'light';
                ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.45)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            const isLight = htmlElement.getAttribute('data-theme') === 'light';
            const lineColor = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - dist / 110;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawLines();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // -------------------------------------------------------------------------
    // 3. Dynamic Typing Loop
    // -------------------------------------------------------------------------
    const typingElement = document.getElementById('typingText');
    const rolePhrases = [
        'AI-Powered Applications',
        'Machine Learning Solutions',
        'Intelligent AI Agents',
        'Python Backend & Flask',
        'Alternative Credit Scoring'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
        if (!typingElement) return;

        const currentPhrase = rolePhrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 85;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 1900;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % rolePhrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();

    // -------------------------------------------------------------------------
    // 4. Cursor Follower Glow
    // -------------------------------------------------------------------------
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function renderCursor() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // -------------------------------------------------------------------------
    // 5. Header Scroll & Active Section Highlighting
    // -------------------------------------------------------------------------
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTop');

    function onScroll() {
        const scrollPos = window.pageYOffset;

        if (scrollPos > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollPos > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active link tracking
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            const secId = sec.getAttribute('id');

            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${secId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------------------
    // 6. Mobile Navigation Drawer
    // -------------------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 7. Toast Notification Utility
    // -------------------------------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info', duration = 3500) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;

        const iconSvg = type === 'success'
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

        toast.innerHTML = `${iconSvg}<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // -------------------------------------------------------------------------
    // 8. Copy Email to Clipboard
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailAddress = 'pravinthn008@gmail.com';

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(emailAddress);
                showToast(`Copied ${emailAddress} to clipboard!`, 'success');
            } catch (err) {
                // Fallback for older browsers
                const tempEl = document.createElement('input');
                tempEl.value = emailAddress;
                document.body.appendChild(tempEl);
                tempEl.select();
                document.execCommand('copy');
                document.body.removeChild(tempEl);
                showToast(`Copied ${emailAddress} to clipboard!`, 'success');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 9. Quick Project Details Modal
    // -------------------------------------------------------------------------
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDismissBtn = document.getElementById('modalDismissBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTriggers = document.querySelectorAll('.project-modal-trigger');

    function openModal(title, desc) {
        if (!projectModal) return;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-title') || 'Project Showcase';
            const desc = btn.getAttribute('data-desc') || 'Project details.';
            openModal(title, desc);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

    // -------------------------------------------------------------------------
    // 10. Contact Form Validation & Submission
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitFormBtn');

    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');

        function isValidEmail(val) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;

            if (!nameInput.value.trim()) {
                nameError.classList.add('visible');
                nameInput.style.borderColor = '#ef4444';
                hasError = true;
            } else {
                nameError.classList.remove('visible');
                nameInput.style.borderColor = '';
            }

            if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                emailError.classList.add('visible');
                emailInput.style.borderColor = '#ef4444';
                hasError = true;
            } else {
                emailError.classList.remove('visible');
                emailInput.style.borderColor = '';
            }

            if (!subjectInput.value.trim()) {
                subjectError.classList.add('visible');
                subjectInput.style.borderColor = '#ef4444';
                hasError = true;
            } else {
                subjectError.classList.remove('visible');
                subjectInput.style.borderColor = '';
            }

            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageError.classList.add('visible');
                messageInput.style.borderColor = '#ef4444';
                hasError = true;
            } else {
                messageError.classList.remove('visible');
                messageInput.style.borderColor = '';
            }

            if (hasError) {
                showToast('Please complete all required fields.', 'info');
                return;
            }

            // Simulate send
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Message...</span>`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                contactForm.reset();
                showToast(`Thank you, ${nameInput.value || 'friend'}! Your message has been sent. Pravinth will respond soon.`, 'success', 5000);
            }, 1000);
        });

        // Real-time error clearance
        [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
            if (inp) {
                inp.addEventListener('input', () => {
                    inp.style.borderColor = '';
                    const err = document.getElementById(inp.id.replace('contact', '').toLowerCase() + 'Error');
                    if (err) err.classList.remove('visible');
                });
            }
        });
    }

    // -------------------------------------------------------------------------
    // 11. Ambient Music Player & Station Controller
    // -------------------------------------------------------------------------
    const musicTracks = [
        {
            id: 0,
            title: 'Lofi Coding Chill',
            genre: 'Lofi Beats • 75 BPM Rhodes',
            src: 'assets/audio/lofi_chill.wav',
            defaultDuration: '0:25'
        },
        {
            id: 1,
            title: 'Cyberpunk Synthwave',
            genre: 'Synthwave • 110 BPM Arp Bass',
            src: 'assets/audio/cyberpunk_synth.wav',
            defaultDuration: '0:17'
        },
        {
            id: 2,
            title: 'Deep Focus 432Hz',
            genre: 'Ambient Drone • 432 Hz Binaural',
            src: 'assets/audio/deep_focus_432hz.wav',
            defaultDuration: '0:20'
        },
        {
            id: 3,
            title: 'AI Studio Flow',
            genre: 'Future Tech • 120 BPM Arpeggiator',
            src: 'assets/audio/ai_studio_flow.wav',
            defaultDuration: '0:16'
        }
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let isMuted = false;
    let prevVolume = 0.75;
    let visualizerInterval = null;

    // Elements
    const musicDock = document.getElementById('musicDock');
    const musicDockToggle = document.getElementById('musicDockToggle');
    const musicDockStatus = document.getElementById('musicDockStatus');
    const minimizePlayerBtn = document.getElementById('minimizePlayerBtn');
    const playlistToggleBtn = document.getElementById('playlistToggleBtn');
    const playlistCloseBtn = document.getElementById('playlistCloseBtn');
    const playlistDrawer = document.getElementById('playlistDrawer');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackGenre = document.getElementById('currentTrackGenre');
    const currentTimeEl = document.getElementById('currentTime');
    const totalDurationEl = document.getElementById('totalDuration');
    const progressBarWrap = document.getElementById('progressBarWrap');
    const progressFill = document.getElementById('progressFill');
    const prevTrackBtn = document.getElementById('prevTrackBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const playIconSvg = document.getElementById('playIconSvg');
    const pauseIconSvg = document.getElementById('pauseIconSvg');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeMuteBtn = document.getElementById('volumeMuteBtn');
    const volIconSvg = document.getElementById('volIconSvg');
    const songCardItems = document.querySelectorAll('.song-card-item');
    const navMusicPill = document.getElementById('navMusicPill');
    const navMusicText = document.getElementById('navMusicText');
    const visualizerBars = document.querySelectorAll('.music-visualizer .v-bar');

    // Audio Element initialization
    const audioPlayer = new Audio();
    audioPlayer.loop = true;
    audioPlayer.preload = 'metadata';
    audioPlayer.volume = 0.75;

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadTrack(index, autoPlay = false) {
        currentTrackIdx = (index + musicTracks.length) % musicTracks.length;
        const track = musicTracks[currentTrackIdx];

        if (currentTrackTitle) currentTrackTitle.textContent = track.title;
        if (currentTrackGenre) currentTrackGenre.textContent = track.genre;
        if (totalDurationEl) totalDurationEl.textContent = track.defaultDuration;
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        if (progressFill) progressFill.style.width = '0%';

        audioPlayer.src = track.src;

        // Update playlist active item
        songCardItems.forEach((card, idx) => {
            if (idx === currentTrackIdx) {
                card.classList.add('active');
                const badge = card.querySelector('.song-item-duration, .song-item-status');
                if (badge) {
                    badge.className = 'song-item-status';
                    badge.textContent = isPlaying ? 'Playing' : 'Active';
                }
            } else {
                card.classList.remove('active');
                const badge = card.querySelector('.song-item-duration, .song-item-status');
                if (badge) {
                    badge.className = 'song-item-duration';
                    badge.textContent = idx === 1 ? '110 BPM' : idx === 2 ? '432 Hz' : idx === 3 ? '120 BPM' : '75 BPM';
                }
            }
        });

        if (autoPlay) {
            playAudio();
        }
    }

    function playAudio() {
        if (!audioPlayer.src) {
            audioPlayer.src = musicTracks[currentTrackIdx].src;
        }

        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayStateUI();
                startVisualizerAnimation();
            }).catch(err => {
                console.warn('Audio playback notice:', err);
                // In some browsers user must click first; set state
                isPlaying = false;
                updatePlayStateUI();
                showToast('Tap play to start ambient background audio', 'info');
            });
        }
    }

    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayStateUI();
        stopVisualizerAnimation();
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseAudio();
            showToast('Ambient music paused', 'info', 1800);
        } else {
            playAudio();
            showToast(`Playing: ${musicTracks[currentTrackIdx].title}`, 'success', 2500);
        }
    }

    function updatePlayStateUI() {
        const track = musicTracks[currentTrackIdx];

        if (isPlaying) {
            if (musicDock) musicDock.classList.add('playing');
            if (navMusicPill) navMusicPill.classList.add('playing');
            if (playIconSvg) playIconSvg.style.display = 'none';
            if (pauseIconSvg) pauseIconSvg.style.display = 'block';
            if (navMusicText) navMusicText.textContent = `Playing: ${track.title}`;
            if (musicDockStatus) musicDockStatus.textContent = `Playing: ${track.title}`;

            // Update active item badge
            songCardItems.forEach((card, idx) => {
                const badge = card.querySelector('.song-item-status');
                if (idx === currentTrackIdx && badge) {
                    badge.textContent = 'Playing';
                }
            });
        } else {
            if (musicDock) musicDock.classList.remove('playing');
            if (navMusicPill) navMusicPill.classList.remove('playing');
            if (playIconSvg) playIconSvg.style.display = 'block';
            if (pauseIconSvg) pauseIconSvg.style.display = 'none';
            if (navMusicText) navMusicText.textContent = 'Play Music';
            if (musicDockStatus) musicDockStatus.textContent = 'Music: Paused';

            songCardItems.forEach((card, idx) => {
                const badge = card.querySelector('.song-item-status');
                if (idx === currentTrackIdx && badge) {
                    badge.textContent = 'Active';
                }
            });
        }
    }

    function startVisualizerAnimation() {
        stopVisualizerAnimation();
        visualizerInterval = setInterval(() => {
            if (!isPlaying) return;
            visualizerBars.forEach(bar => {
                const randHeight = Math.floor(Math.random() * 16) + 4;
                bar.style.height = `${randHeight}px`;
            });
        }, 120);
    }

    function stopVisualizerAnimation() {
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerInterval = null;
        }
        visualizerBars.forEach(bar => {
            bar.style.height = '3px';
        });
    }

    // Audio time update
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.currentTime) && !isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            if (totalDurationEl) totalDurationEl.textContent = formatTime(audioPlayer.duration);
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (progressFill) progressFill.style.width = `${percent}%`;
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (totalDurationEl && !isNaN(audioPlayer.duration)) {
            totalDurationEl.textContent = formatTime(audioPlayer.duration);
        }
    });

    // Seek on progress bar
    if (progressBarWrap) {
        progressBarWrap.addEventListener('click', (e) => {
            const rect = progressBarWrap.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audioPlayer.duration) {
                audioPlayer.currentTime = clickPos * audioPlayer.duration;
            }
        });
    }

    // Play/Pause main button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }

    // Previous & Next buttons
    if (prevTrackBtn) {
        prevTrackBtn.addEventListener('click', () => {
            loadTrack(currentTrackIdx - 1, isPlaying);
        });
    }

    if (nextTrackBtn) {
        nextTrackBtn.addEventListener('click', () => {
            loadTrack(currentTrackIdx + 1, isPlaying);
        });
    }

    // Playlist song items click
    songCardItems.forEach((card, idx) => {
        card.addEventListener('click', () => {
            loadTrack(idx, true);
        });
    });

    // Playlist toggle & close
    if (playlistToggleBtn && playlistDrawer) {
        playlistToggleBtn.addEventListener('click', () => {
            playlistDrawer.classList.toggle('open');
        });
    }

    if (playlistCloseBtn && playlistDrawer) {
        playlistCloseBtn.addEventListener('click', () => {
            playlistDrawer.classList.remove('open');
        });
    }

    // Minimize & Restore Dock
    if (minimizePlayerBtn && musicDock) {
        minimizePlayerBtn.addEventListener('click', () => {
            musicDock.classList.add('minimized');
            if (playlistDrawer) playlistDrawer.classList.remove('open');
        });
    }

    if (musicDockToggle && musicDock) {
        musicDockToggle.addEventListener('click', () => {
            musicDock.classList.remove('minimized');
        });
    }

    // Navbar Music Pill
    if (navMusicPill) {
        navMusicPill.addEventListener('click', () => {
            if (musicDock && musicDock.classList.contains('minimized')) {
                musicDock.classList.remove('minimized');
            }
            togglePlayPause();
        });
    }

    // Volume Slider & Mute
    function updateVolumeIcon() {
        if (!volIconSvg) return;
        if (isMuted || audioPlayer.volume === 0) {
            volIconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
        } else if (audioPlayer.volume < 0.5) {
            volIconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        } else {
            volIconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        }
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audioPlayer.volume = val;
            isMuted = (val === 0);
            updateVolumeIcon();
        });
    }

    if (volumeMuteBtn) {
        volumeMuteBtn.addEventListener('click', () => {
            if (isMuted) {
                audioPlayer.volume = prevVolume || 0.75;
                if (volumeSlider) volumeSlider.value = audioPlayer.volume;
                isMuted = false;
            } else {
                prevVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                isMuted = true;
            }
            updateVolumeIcon();
        });
    }

    // Initial setup
    loadTrack(0, false);
});
