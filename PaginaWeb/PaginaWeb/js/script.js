/**
 * @file script.js
 * @description Script principal para o site StayIn
 */

document.addEventListener("DOMContentLoaded", () => {
  // assim o codigo só atua quando o html carregar totalmente

  // =========================================================================
  // 1. LÓGICA GLOBAL: SELETOR DE TEMA (DARK MODE)
  // =========================================================================
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  const showActiveTheme = (theme) => {
    const themeIconActive = document.getElementById("theme-icon-active");
    if (!themeIconActive) return;

    if (theme === "dark") {
      themeIconActive.className = "bi bi-moon-stars-fill";
    } else if (theme === "light") {
      themeIconActive.className = "bi bi-sun-fill";
    } else {
      themeIconActive.className = "bi bi-circle-half";
    }
  };

  const initialTheme = localStorage.getItem("theme") || "auto";
  setTheme(initialTheme);
  showActiveTheme(initialTheme);

  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      localStorage.setItem("theme", theme);
      setTheme(theme);
      showActiveTheme(theme);
    });
  });

  // =========================================================================
  // 2. LÓGICA GLOBAL: AUTENTICAÇÃO E ESTADO DA NAVBAR
  // =========================================================================
  const loggedOutItems = document.querySelectorAll(".nav-logged-out");
  const loggedInItems = document.querySelectorAll(".nav-logged-in");
  const logoutButton = document.getElementById("logout-button");

  function updateNavbarState() {
    const navbarUsername = document.getElementById("navbar-username");

    if (localStorage.getItem("isLoggedIn") === "true") {
      loggedOutItems.forEach((item) => item.classList.add("d-none"));
      loggedInItems.forEach((item) => item.classList.remove("d-none"));

      // Assim mostra o nome do utilizador na Navbar
      if (navbarUsername) {
        const userName = localStorage.getItem("userName") || "Utilizador";
        navbarUsername.innerText = userName;
      }
    } else {
      loggedOutItems.forEach((item) => item.classList.remove("d-none"));
      loggedInItems.forEach((item) => item.classList.add("d-none"));
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName"); // vai limpar o nome ao sair
      window.location.href = "index.html";
    });
  }
  updateNavbarState(); // vai fazer isto em todas as paginas

  // =========================================================================
  // 3. LÓGICA DE LOGIN E REGISTO
  // =========================================================================
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.setItem("isLoggedIn", "true");
      // Define um nome padrão no primeiro login
      if (!localStorage.getItem("userName")) {
        localStorage.setItem("userName", "Viajante");
      }
      window.location.href = "index.html"; // Redireciona para a homepage para ver a personalização
    });
  }

 const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (registerForm.checkValidity()) {
      // Formulário válido!

      // 1. Obter o primeiro nome do campo com o novo ID
      const firstName = document.getElementById("register-firstname").value.trim();

      // 2. Simular o login
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", firstName);

      // 3. Redirecionar para a página principal
      window.location.href = "index.html";
      
    } else {
      // O formulário é inválido, o Bootstrap mostra os erros
    }

    registerForm.classList.add("was-validated");
  });
}

  // =========================================================================
  // 4. LÓGICA DA HOMEPAGE (PERSONALIZAÇÃO E CONTEÚDO DINÂMICO)
  // =========================================================================
  if (document.body.classList.contains("homepage")) {
    const ofertasSection = document.getElementById("ofertas-section");
    const recomendacoesSection = document.getElementById(
      "recomendacoes-section"
    );
    const heroTitle = document.getElementById("hero-title");
    const heroSubtitle = document.getElementById("hero-subtitle");

    if (localStorage.getItem("isLoggedIn") === "true") {
      // 1. Personaliza a saudação do cabeçalho
      const userName = localStorage.getItem("userName") || "Viajante";
      if (heroTitle) {
        heroTitle.innerText = `Para onde vamos agora, ${userName}?`;
      }
      if (heroSubtitle) {
        heroSubtitle.innerText =
          "As suas próximas aventuras começam aqui. Inspire-se nas nossas recomendações.";
      }

      // 2. Mostra as recomendações e esconde as ofertas
      if (ofertasSection) ofertasSection.style.display = "none";
      if (recomendacoesSection) recomendacoesSection.style.display = "block";
    } else {
      // 3. Mostra as ofertas e esconde as recomendações para visitantes
      if (ofertasSection) ofertasSection.style.display = "block";
      if (recomendacoesSection) recomendacoesSection.style.display = "none";
    }
  }

  // =========================================================================
  // 5. NOVA LÓGICA: PÁGINA "MINHA CONTA"
  // =========================================================================
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    const firstNameInput = document.getElementById("profile-firstname");

    // Carrega o nome atual no campo do formulário
    const currentName = localStorage.getItem("userName") || "";
    firstNameInput.value = currentName;

    // Evento para guardar as alterações do perfil
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newName = firstNameInput.value.trim();

      if (newName) {
        // Guarda o novo nome
        localStorage.setItem("userName", newName);

        // Atualiza a navbar imediatamente
        updateNavbarState();

        // Feedback para o utilizador
        alert("Perfil atualizado com sucesso!");
      } else {
        alert("Por favor, insira um nome.");
      }
    });
  }

// =========================================================================
  // 6. LÓGICA DO STEPPER E FORMULÁRIO DE RESERVA
  // =========================================================================
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    const stepperItems = document.querySelectorAll(".stepper .step");
    const formSteps = document.querySelectorAll(".form-step");
    const nextButtons = document.querySelectorAll(".next-step-btn");
    const prevButtons = document.querySelectorAll(".prev-step-btn");
    let currentStep = 0;

    // --- LÓGICA PARA MOSTRAR CAMPOS DE PAGAMENTO ---
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById('credit-card-details');
    const mbwayDetails = document.getElementById('mbway-details');
    const ccFields = creditCardDetails.querySelectorAll('input');

    paymentMethodRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Esconde todas as secções de detalhes
        creditCardDetails.classList.add('d-none');
        mbwayDetails.classList.add('d-none');
        // Remove 'required' de todos os campos de cartão e mbway
        ccFields.forEach(field => field.required = false);
        if (document.getElementById('mbway-phone')) {
          document.getElementById('mbway-phone').required = false;
        }

        if (radio.id === 'payment-cc' && radio.checked) {
          creditCardDetails.classList.remove('d-none');
          // Adiciona 'required' aos campos de cartão
          ccFields.forEach(field => field.required = true);
        } else if (radio.id === 'payment-mbway' && radio.checked) {
          mbwayDetails.classList.remove('d-none');
          document.getElementById('mbway-phone').required = true;
        }
      });
    });

    const showStep = (stepIndex) => {
      formSteps.forEach(step => (step.style.display = "none"));
      if (formSteps[stepIndex]) formSteps[stepIndex].style.display = "block";
      
      stepperItems.forEach((step, index) => {
        step.classList.toggle("active", index < stepIndex + 1);
      });
      currentStep = stepIndex;
    };
    
    const validateCurrentStep = () => {
      let isValid = true;
      const currentStepFields = formSteps[currentStep].querySelectorAll("input[required]");
      currentStepFields.forEach(field => {
        if (!field.checkValidity()) {
          isValid = false;
        }
      });
      return isValid;
    };

    const populateConfirmationStep = () => {
      document.getElementById("confirm-nome").innerText = `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`;
      document.getElementById("confirm-email").innerText = document.getElementById("email").value;
      // Atualiza para mostrar o método de pagamento selecionado
      const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
      document.getElementById("confirm-pagamento").innerText = selectedPayment ? selectedPayment.value : "Não selecionado";
    };

    nextButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (validateCurrentStep()) {
          if (currentStep === 1) { // Ao sair do passo de pagamento
            populateConfirmationStep();
          }
          if (currentStep < formSteps.length - 1) {
            showStep(currentStep + 1);
          }
        } else {
          bookingForm.classList.add("was-validated");
        }
      });
    });

    prevButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      });
    });

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário
      
      // 1. Guardar os detalhes da reserva no localStorage
      const reservaDetalhes = {
        alojamento: "Hotel Central", // Exemplo, pode ser dinâmico
        checkin: document.getElementById("resumo-checkin").innerText,
        checkout: document.getElementById("resumo-checkout").innerText,
        hospedes: document.getElementById("resumo-hospedes").innerText,
        preco: document.getElementById("resumo-preco").innerText,
      };
      localStorage.setItem("reservaDetalhes", JSON.stringify(reservaDetalhes));

      // 2. Mostrar o spinner de carregamento no botão
      const finalButton = document.querySelector('#booking-form button[type="submit"]');
      if (finalButton) {
        finalButton.disabled = true;
        finalButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> A Processar...`;
      }

      // 3. Simular o processamento e redirecionar para a página de confirmação
      setTimeout(() => {
        window.location.href = "confirmacao.html";
      }, 1500); // Espera 1.5 segundos (como nos sites de reserva normais)
    });

    if (formSteps.length > 0) {
      showStep(0);
    }

    // =========================================================================
    // 6.1. Interceptar a tecla Enter (para evitar submissão antes da hora)
    // =========================================================================

    bookingForm.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Sempre prevenir o comportamento padrão do Enter

        // Vamos verificar em qual passo estamos
        if (currentStep === 0) {
          // Se estivermos no Passo 1 (Dados Pessoais), Enter avança para o próximo passo
          if (validateCurrentStep()) {
            showStep(1); // Avança para o passo 2
          } else {
            // Forçar validação visual se falta algum campo
            bookingForm.classList.add("was-validated");
          }
        } else if (currentStep === 1) {
          // Se estivermos no Passo 2 (Pagamento), Enter avança para a confirmação
          if (validateCurrentStep()) {
            populateConfirmationStep(); // Preenche o resumo da confirmação
            showStep(2); // Avança para o passo 3 (Confirmação)
          } else {
            // Forçar validação visual se falta algum campo
            bookingForm.classList.add("was-validated");
          }
        } else if (currentStep === 2) {
          
        }
      }
    });
  }

  // =========================================================================
  // 7. LÓGICA DA PÁGINA DE CONFIRMAÇÃO
  // =========================================================================
  const confirmationPage = document.querySelector(".confirmation-summary");
  if (confirmationPage) {
    // 1. Procura os detalhes da reserva que foram guardados no localStorage
    const detalhes = JSON.parse(localStorage.getItem("reservaDetalhes"));

    // 2. Verifica se os detalhes existem (para evitar erros)
    if (detalhes) {
      // 3. Preenche os elementos na página com a informação da reserva
      document.getElementById("conf-alojamento").innerText = detalhes.alojamento;
      document.getElementById("conf-checkin").innerText = detalhes.checkin;
      document.getElementById("conf-checkout").innerText = detalhes.checkout;
      document.getElementById("conf-hospedes").innerText = detalhes.hospedes;
      document.getElementById("conf-preco").innerText = detalhes.preco;

      // 4. Limpa os detalhes do localStorage depois de os mostrar
      // Isto impede que a mesma informação seja mostrada numa visita futura à página.
      localStorage.removeItem("reservaDetalhes");
    }
  }

// =========================================================================
  // 8. BLOQUEIO DE ACESSO À PÁGINA DE RESERVA PARA NÃO AUTENTICADOS
  // =========================================================================
  // Verifica se estamos na página de reserva
  if (window.location.pathname.includes("reserva.html")) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Se não estiver autenticado, redireciona para a página de login
      window.location.href = "login.html";
    }
  }


});
