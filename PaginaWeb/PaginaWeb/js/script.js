/**
 * @file script.js
 * @description Script principal para o site StayIn
 * 
 * Índice:
 * 1. Lógica Global: Selecionar Tema (Dark Mode)
 * 2. Lógica Global: Autenticação e Estado da Navbar
 * 3. Lógica de Login e Registo
 * 4. Lógica da Homepage (Personalização e Conteúdo Dinâmico)
 * 5. Lógica da Página Minha Conta
 * 6. Lógica do Stepper e Formulário de Reserva
 *    6.1. Interceptar Tecla Enter no Formulário de Reserva
 * 7. Lógica da Página de Confirmação
 * 8. Bloqueio de Acesso à Página de Reserva para Não Autenticados
 * 9. Configuração do DateRangePicker (Check-in e Check-out)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Assim garantimos que o JS só corre depois do HTML carregar 

  
  // 1. Lógica Global: Selecionar Tema (Dark Mode)
 

  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
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

  // 2. Lógica Global: Autenticação e Estado da Navbar
  

  const loggedOutItems = document.querySelectorAll(".nav-logged-out");
  const loggedInItems = document.querySelectorAll(".nav-logged-in");
  const logoutButton = document.getElementById("logout-button");

  function updateNavbarState() {
    const navbarUsername = document.getElementById("navbar-username");

    if (localStorage.getItem("isLoggedIn") === "true") {
      // Mostrar itens do utilizador autenticado
      loggedOutItems.forEach((item) => item.classList.add("d-none"));
      loggedInItems.forEach((item) => item.classList.remove("d-none"));

      // Atualizar o nome na navbar - muda consuante o nome que escolheres
      if (navbarUsername) {
        const userName = localStorage.getItem("userName") || "Utilizador";
        navbarUsername.innerText = userName;
      }
    } else {
      // Mostrar itens de utilizador não autenticado
      loggedOutItems.forEach((item) => item.classList.remove("d-none"));
      loggedInItems.forEach((item) => item.classList.add("d-none"));
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      window.location.href = "index.html";
    });
  }

  // Chamar a função para deixar a navbar no estado certo
  updateNavbarState();

  
  // 3. Lógica de Login e Registo
  

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.setItem("isLoggedIn", "true");

      // Define o nome para "Viajante" se for o primeiro login, fica mais catita
      if (!localStorage.getItem("userName")) {
        localStorage.setItem("userName", "Viajante");
      }
      window.location.href = "index.html";
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (registerForm.checkValidity()) {
        const firstName = document.getElementById("register-firstname").value.trim();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", firstName);
        window.location.href = "index.html";
      }

      registerForm.classList.add("was-validated");
    });
  }

  

  // 4. Lógica da Homepage (Personalização e Conteúdo Dinâmico)
  

  if (document.body.classList.contains("homepage")) {
    // Só corre se estiver na homepage
    const ofertasSection = document.getElementById("ofertas-section");
    const recomendacoesSection = document.getElementById("recomendacoes-section");
    const heroTitle = document.getElementById("hero-title");
    const heroSubtitle = document.getElementById("hero-subtitle");

    if (localStorage.getItem("isLoggedIn") === "true") {
      // Personaliza o hero com o nome do utilizador
      const userName = localStorage.getItem("userName") || "Viajante";
      if (heroTitle) {
        heroTitle.innerText = `Para onde vamos agora, ${userName}?`;
      }
      if (heroSubtitle) {
        heroSubtitle.innerText =
          "As suas próximas aventuras começam aqui. Inspire-se nas nossas recomendações.";
      }

      // Mostra recomendações, esconde ofertas
      if (ofertasSection) ofertasSection.style.display = "none";
      if (recomendacoesSection) recomendacoesSection.style.display = "block";
    } else {
      // Mostra ofertas, esconde recomendações
      if (ofertasSection) ofertasSection.style.display = "block";
      if (recomendacoesSection) recomendacoesSection.style.display = "none";
    }
  }

  
  // 5. Lógica da Página "Minha Conta"
  

  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    const firstNameInput = document.getElementById("profile-firstname");

    // Preenche o nome atual no input
    const currentName = localStorage.getItem("userName") || "";
    firstNameInput.value = currentName;

    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      let formIsValid = true;

      // Validação de nome
      const newName = firstNameInput.value.trim();
      const lastNameInput = document.getElementById("profile-lastname");
      if (!newName) {
        firstNameInput.classList.add("is-invalid");
        formIsValid = false;
      } else {
        firstNameInput.classList.remove("is-invalid");
      }

      if (!lastNameInput.value.trim()) {
        lastNameInput.classList.add("is-invalid");
        formIsValid = false;
      } else {
        lastNameInput.classList.remove("is-invalid");
      }

      // Validação de passwords (se estiver preenchida)
      const currentPassword = document.getElementById("current-password");
      const newPassword = document.getElementById("new-password");
      const confirmPassword = document.getElementById("confirm-password");

      currentPassword.classList.remove("is-invalid");
      newPassword.classList.remove("is-invalid");
      confirmPassword.classList.remove("is-invalid");

      const isPasswordChange =
        currentPassword.value.trim() !== "" ||
        newPassword.value.trim() !== "" ||
        confirmPassword.value.trim() !== "";

      if (isPasswordChange) {
        if (currentPassword.value.trim() === "") {
          currentPassword.classList.add("is-invalid");
          formIsValid = false;
        }
        if (currentPassword.value.trim() == newPassword.value.trim()) {
          alert("A nova password não pode ser igual à atual.");
          newPassword.classList.add("is-invalid");
          formIsValid = false;
        }
        if (confirmPassword.value.trim() === "") {
          confirmPassword.classList.add("is-invalid");
          formIsValid = false;
        }
        if (newPassword.value.trim().length > 0 && newPassword.value.trim().length < 6) {
          newPassword.classList.add("is-invalid");
          formIsValid = false;
        }
        if (newPassword.value.trim() !== confirmPassword.value.trim()) {
          confirmPassword.classList.add("is-invalid");
          formIsValid = false;
        }
      }
        

      // Se o formulário for válido, atualiza o perfil
      if (formIsValid) {
        localStorage.setItem("userName", newName);
        alert("Perfil atualizado com sucesso!");
        

        // Atualizar a navbar com o novo nome - muda consuante o nome que escolheres
        if (typeof updateNavbarState === "function") {
          updateNavbarState();
        }

        // Limpar os campos de password após a atualização
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        profileForm.classList.remove("was-validated");
      } else {
        alert("Por favor, corrija os erros no formulário.");
        profileForm.classList.add("was-validated");
      }
    });
  }

  
  // 6. Lógica do Stepper e Formulário de Reserva
   

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    const stepperItems = document.querySelectorAll(".stepper .step");
    const formSteps = document.querySelectorAll(".form-step");
    const nextButtons = document.querySelectorAll(".next-step-btn");
    const prevButtons = document.querySelectorAll(".prev-step-btn");
    let currentStep = 0;

    // --- CAMPOS DE PAGAMENTO ---
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById("credit-card-details");
    const mbwayDetails = document.getElementById("mbway-details");
    const paypalDetails = document.getElementById("paypal-details");
    const ccFields = creditCardDetails ? creditCardDetails.querySelectorAll("input") : [];
    const cardNumberField = document.getElementById("cardNumber");
    const cardCVCField = document.getElementById("cardCVC");
    const cardExpiryField = document.getElementById("cardExpiry");
    const mbwayPhoneField = document.getElementById("mbway-phone");
    const paypalEmailField = document.getElementById("paypal-email");

    // Alternar campos de pagamento conforme o método que escolher
    paymentMethodRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (creditCardDetails) creditCardDetails.classList.add("d-none");
        if (mbwayDetails) mbwayDetails.classList.add("d-none");
        if (paypalDetails) paypalDetails.classList.add("d-none");

        ccFields.forEach((field) => (field.required = false));
        if (mbwayPhoneField) mbwayPhoneField.required = false;
        if (paypalEmailField) paypalEmailField.required = false;

        if (radio.id === "payment-cc" && radio.checked) {
          creditCardDetails.classList.remove("d-none");
          ccFields.forEach((field) => (field.required = true));
        } else if (radio.id === "payment-mbway" && radio.checked) {
          mbwayDetails.classList.remove("d-none");
          if (mbwayPhoneField) mbwayPhoneField.required = true;
        } else if (radio.id === "payment-paypal" && radio.checked) {
          paypalDetails.classList.remove("d-none");
          if (paypalEmailField) paypalEmailField.required = true;
        }
      });
    });

    // --- VALIDAÇÃO DO CARTÃO DE CRÉDITO ---

    // Validação do Número do Cartão
    cardNumberField.addEventListener("input", () => {
      const cardNumber = cardNumberField.value.replace(/\s+/g, ""); // Remove espaços
      if (cardNumber.length < 16) {
        cardNumberField.setCustomValidity("O número do cartão deve ter 16 dígitos.");
      } else if (!/^\d{16,19}$/.test(cardNumber)) {
        cardNumberField.setCustomValidity("Insira apenas dígitos (0-9).");
      } else {
        cardNumberField.setCustomValidity(""); // Válido
      }
    });

    // Validação do CVC
    cardCVCField.addEventListener("input", () => {
      const cvc = cardCVCField.value;
      if (cvc.length !== 3) {
        cardCVCField.setCustomValidity("O CVC deve ter exatamente 3 dígitos.");
      } else if (!/^\d{3}$/.test(cvc)) {
        cardCVCField.setCustomValidity("O CVC deve conter apenas números.");
      } else {
        cardCVCField.setCustomValidity(""); // Válido
      }
    });

    // Validação da Data de Validade (mínimo: mês atual, máximo: +5 anos)
    if (cardExpiryField) {
      const now = new Date();
      const minYear = now.getFullYear();
      const minMonth = String(now.getMonth() + 1).padStart(2, "0");
      const minValue = `${minYear}-${minMonth}`; // Ex.: 2025-12

      const maxYear = now.getFullYear() + 5;
      const maxMonth = minMonth;
      const maxValue = `${maxYear}-${maxMonth}`;

      cardExpiryField.min = minValue;
      cardExpiryField.max = maxValue;

      const validateExpiryRange = () => {
        const v = cardExpiryField.value; // 'YYYY-MM'
        if (!v) {
          cardExpiryField.setCustomValidity("");
          return;
        }
        if (v < minValue) {
          cardExpiryField.setCustomValidity("A validade não pode ser anterior ao mês atual.");
        } else if (v > maxValue) {
          cardExpiryField.setCustomValidity("A validade não pode ser superior a 5 anos a partir de agora.");
        } else {
          cardExpiryField.setCustomValidity("");
        }
      };

      cardExpiryField.addEventListener("input", validateExpiryRange);
      cardExpiryField.addEventListener("change", validateExpiryRange);
    }

    
    const showStep = (stepIndex) => {
      formSteps.forEach((step) => (step.style.display = "none"));
      if (formSteps[stepIndex]) formSteps[stepIndex].style.display = "block";

      
      stepperItems.forEach((step, index) => {
        step.classList.toggle("active", index < stepIndex + 1);
      });

      currentStep = stepIndex;
    };

    
    const validateCurrentStep = () => {
      let isValid = true;
      const currentStepFields = formSteps[currentStep].querySelectorAll(
        "input[required], select[required]"
      );

      currentStepFields.forEach((field) => {
        if (!field.checkValidity()) {
          isValid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
          field.classList.add("is-valid");
        }
      });
      return isValid;
    };

    // Preenche o resumo final (passo de confirmação)
    const populateConfirmationStep = () => {
      document.getElementById("confirm-nome").innerText = `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`;
      document.getElementById("confirm-email").innerText = document.getElementById("email").value;

      const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
      document.getElementById("confirm-pagamento").innerText = selectedPayment
        ? selectedPayment.value
        : "Não selecionado";
    };

    
    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (validateCurrentStep()) {
          if (currentStep === 1) {
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

    
    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      });
    });

    
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add("was-validated");
        return;
      }

      
      const reservaDetalhes = {
        alojamento: "Hotel Central",
        checkin: document.getElementById("resumo-checkin").innerText,
        checkout: document.getElementById("resumo-checkout").innerText,
        hospedes: document.getElementById("resumo-hospedes").innerText,
        preco: document.getElementById("resumo-preco").innerText,
      };
      localStorage.setItem("reservaDetalhes", JSON.stringify(reservaDetalhes));

      
      const finalButton = document.querySelector('#booking-form button[type="submit"]');
      if (finalButton) {
        finalButton.disabled = true;
        finalButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> A Processar...`;
      }

      // Simular o processamento e redirecionar
      setTimeout(() => {
        window.location.href = "confirmacao.html";
      }, 1500);
    });

    // Mostrar o primeiro passo ao carregar
    if (formSteps.length > 0) {
      showStep(0);
    }

    
    // 6.1. Interceptar a Tecla Enter no Formulário de Reserva
    

    bookingForm.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Ao clicar Enter ele avançava o formulário, agora não

        if (currentStep === 0) {
          
          if (validateCurrentStep()) {
            showStep(1);
          } else {
            bookingForm.classList.add("was-validated");
          }
        } else if (currentStep === 1) {
          
          if (validateCurrentStep()) {
            populateConfirmationStep();
            showStep(2);
          } else {
            bookingForm.classList.add("was-validated");
          }
        }
        // No Passo 3, Enter não faz nada 
      }
    });
  }

   
  // 7. Lógica da Página de Confirmação
  

  const confirmationPage = document.querySelector(".confirmation-summary");
  if (confirmationPage) {
    const detalhes = JSON.parse(localStorage.getItem("reservaDetalhes"));

    if (detalhes) {
      // Preenche os dados da reserva na página de confirmação
      document.getElementById("conf-alojamento").innerText = detalhes.alojamento;
      document.getElementById("conf-checkin").innerText = detalhes.checkin;
      document.getElementById("conf-checkout").innerText = detalhes.checkout;
      document.getElementById("conf-hospedes").innerText = detalhes.hospedes;
      document.getElementById("conf-preco").innerText = detalhes.preco;

      
      localStorage.removeItem("reservaDetalhes");
    }
  }

  
  // 8. Bloqueio de Acesso à Página de Reserva para Não Autenticados
  
  // Se nao tens login, nao reservas nada.
  if (window.location.pathname.includes("reserva.html")) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Se não estiver autenticado, manda para o login
      window.location.href = "login.html";
    }
  }

   
  // 9. Configuração do Daterangepicker (Check-in e Check-out)
  

  $(document).ready(function () {
    $('input[name="daterange"]').daterangepicker({
      opens: 'center',
      autoApply: true,
      minDate: moment().startOf('day'), // Bloqueia datas anteriores á data atual, tal como nos sites de reservas atuais
      locale: {
        format: 'DD/MM/YYYY',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        fromLabel: 'De',
        toLabel: 'Até',
        daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        monthNames: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        firstDay: 1 // Começa a semana na segunda-feira
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM totalmente carregado, inicializando comentários...');

  // Função para inicializar o sistema de comentários para reservas concluídas
  function inicializarComentarios() {
    // Seleciona todos os cards de reservas concluídas que possuem comentários
    const reservasConcluidas = document.querySelectorAll('.reserva-concluida');

    reservasConcluidas.forEach((reserva) => {
      const reservaId = reserva.getAttribute('data-reserva-id');
      console.log('Inicializando reserva concluída ID:', reservaId);

      const btnComentar = reserva.querySelector('.btn-comentar');
      const comentarioForm = reserva.querySelector('.comentario-form');
      const comentarioSalvo = reserva.querySelector('.comentario-salvo');
      const btnEnviarComentario = reserva.querySelector('.btn-enviar-comentario');
      const comentarioTexto = reserva.querySelector('.comentario-texto');
      const estrelasInput = reserva.querySelectorAll('.rating-input i');
      const estrelasSalvas = reserva.querySelector('.rating-stars-salvas');
      const comentarioSalvoTexto = reserva.querySelector('.comentario-salvo-texto');

      let avaliacaoSelecionada = 0;

      // Checagem básica para garantir que todos os elementos foram encontrados
      if (!btnComentar || !comentarioForm || !comentarioTexto || !btnEnviarComentario || !estrelasInput.length || !comentarioSalvo || !estrelasSalvas || !comentarioSalvoTexto) {
        console.error(`Erro: Elementos não encontrados para a reserva ${reservaId}`);
        return;
      }

      // Carrega o comentário salvo (se existir) do localStorage
      const comentarioGuardado = JSON.parse(localStorage.getItem(`comentario-${reservaId}`));
      if (comentarioGuardado) {
        console.log(`Comentário encontrado no localStorage para ${reservaId}`, comentarioGuardado);

        // Exibe a avaliação e o comentário salvos
        exibirComentarioSalvo(comentarioGuardado, estrelasSalvas, comentarioSalvoTexto);
        comentarioSalvo.classList.remove('d-none');
        btnComentar.classList.add('d-none'); // Esconde o botão "Avaliar" se já houver uma avaliação
      }

      // Evento para exibir ou ocultar o formulário de comentário ao clicar no botão "Avaliar"
      btnComentar.addEventListener('click', () => {
        console.log(`Botão Avaliar clicado para ${reservaId}`);
        comentarioForm.classList.toggle('d-none');
      });

      // Evento de clique nas estrelas para selecionar a avaliação
      estrelasInput.forEach((estrela) => {
        estrela.addEventListener('click', () => {
          avaliacaoSelecionada = parseInt(estrela.getAttribute('data-star'), 10);
          console.log(`Estrela ${avaliacaoSelecionada} selecionada para ${reservaId}`);
          atualizarEstrelasVisual(avaliacaoSelecionada, estrelasInput);
        });
      });

      // Evento para enviar o comentário
      btnEnviarComentario.addEventListener('click', () => {
        const textoComentario = comentarioTexto.value.trim();
        console.log(`Enviando comentário para ${reservaId}. Avaliação: ${avaliacaoSelecionada}, Comentário: "${textoComentario}"`);

        // Validação básica do comentário e da avaliação
        if (!textoComentario) {
          comentarioTexto.classList.add('is-invalid');
          console.warn('Comentário vazio detectado.');
        } else {
          comentarioTexto.classList.remove('is-invalid');
        }

        if (avaliacaoSelecionada === 0) {
          alert('Por favor, selecione uma classificação de 1 a 5 estrelas.');
          return;
        }

        if (textoComentario && avaliacaoSelecionada > 0) {
          // Cria o objeto de comentário para armazenar
          const comentarioData = {
            avaliacao: avaliacaoSelecionada,
            comentario: textoComentario,
            data: new Date().toISOString(), // Data do comentário para referência
          };

          // Salva no localStorage (chave única por reserva)
          localStorage.setItem(`comentario-${reservaId}`, JSON.stringify(comentarioData));
          console.log(`Comentário salvo no localStorage para ${reservaId}.`, comentarioData);

          // Exibe o comentário salvo
          exibirComentarioSalvo(comentarioData, estrelasSalvas, comentarioSalvoTexto);

          // Oculta o formulário e exibe a seção de comentário salvo
          comentarioForm.classList.add('d-none');
          comentarioSalvo.classList.remove('d-none');

          // Esconde o botão "Avaliar" após o envio do comentário
          btnComentar.classList.add('d-none');
        }
      });
    });
  }

  // Função para atualizar a exibição visual das estrelas selecionadas
  function atualizarEstrelasVisual(avaliacao, estrelasInput) {
    estrelasInput.forEach((estrela) => {
      const starValue = parseInt(estrela.getAttribute('data-star'), 10);
      if (starValue <= avaliacao) {
        estrela.classList.remove('bi-star');
        estrela.classList.add('bi-star-fill');
      } else {
        estrela.classList.remove('bi-star-fill');
        estrela.classList.add('bi-star');
      }
    });
  }

  // Função para exibir visualmente um comentário salvo (estrelas e texto)
  function exibirComentarioSalvo(comentarioData, estrelasSalvas, comentarioSalvoTexto) {
    // Exibe as estrelas salvas preenchidas de acordo com a avaliação
    estrelasSalvas.innerHTML = ''; // Limpa o conteúdo anterior
    for (let i = 1; i <= 5; i++) {
      const starIcon = document.createElement('i');
      starIcon.classList.add('bi');
      if (i <= comentarioData.avaliacao) {
        starIcon.classList.add('bi-star-fill'); // Preenchida
      } else {
        starIcon.classList.add('bi-star'); // Vazia
      }
      estrelasSalvas.appendChild(starIcon);
    }

    // Exibe o texto do comentário salvo
    comentarioSalvoTexto.innerText = comentarioData.comentario;
  }

  // Inicializa o sistema de comentários ao carregar a página
  inicializarComentarios();
});
}); 


