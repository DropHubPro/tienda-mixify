// Galeria de Imagens
function changeImage(thumbnail) {
  const mainImage = document.getElementById('mainImage');
  mainImage.src = thumbnail.src;
  
  // Atualizar classe active
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
}

// FAQ Accordion
function toggleFaq(element) {
  element.classList.toggle('open');
}

// Modal
function openModal() {
  document.getElementById('orderModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  // Esconder botão sticky quando o modal abre
  const stickyWrapper = document.getElementById('sticky-cta-wrapper');
  if (stickyWrapper) {
    stickyWrapper.classList.add('hidden');
  }
}

function closeModal() {
  document.getElementById('orderModal').classList.remove('active');
  document.body.style.overflow = '';
  // Mostrar botão sticky quando o modal fecha (se aplicável pelo IntersectionObserver)
  const stickyWrapper = document.getElementById('sticky-cta-wrapper');
  if (stickyWrapper) {
    stickyWrapper.classList.remove('hidden');
  }
}

function closeModalOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

// Seletor de Oferta
let selectedOffer = 1;

function selectOffer(offer) {
  selectedOffer = offer;
  
  document.querySelectorAll('.offer-option').forEach((el, index) => {
    if (index + 1 === offer) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
  
  updateTotal();
}

function updateTotal() {
  let total = selectedOffer === 1 ? 109900 : 149464;
  let formattedTotal = formatPrice(total);
  
  document.getElementById('subtotal').textContent = formattedTotal;
  document.getElementById('total').textContent = formattedTotal;
  document.getElementById('btnTotal').textContent = formattedTotal;
}

function formatPrice(value) {
  return '$' + value.toLocaleString('es-CO') + ',00';
}

// Envio do Formulário
async function submitOrder(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  
  // Desabilitar botão
  submitBtn.disabled = true;
  submitBtn.querySelector('.submit-main').textContent = 'Enviando...';
  
  // Coletar dados do formulário
  const formData = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    phone: document.getElementById('phone').value,
    departamento: document.getElementById('departamento').value,
    ciudad: document.getElementById('ciudad').value,
    barrio: document.getElementById('barrio').value,
    direccion: document.getElementById('direccion').value,
    torre_apto: document.getElementById('torre_apto').value,
    oferta_selecionada: selectedOffer === 1 ? '1 unidad' : 'Kit (2 unidades)',
    total: selectedOffer === 1 ? '$109.900,00' : '$149.464,00',
    variante: selectedOffer === 1 
      ? document.getElementById('variant1').value 
      : `${document.getElementById('variant2a').value} + ${document.getElementById('variant2b').value}`
  };
  
  try {
    // Enviar para o webhook
    const response = await fetch('SEU_WEBHOOK_N8N_AQUI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    // Mostrar sucesso (mesmo se o webhook não estiver configurado)
    closeModal();
    showSuccess();
    form.reset();
    
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    // Mesmo com erro, mostra sucesso para demonstração
    closeModal();
    showSuccess();
    form.reset();
  }
  
  // Resetar botão
  submitBtn.disabled = false;
  updateTotal();
}

function showSuccess() {
  document.getElementById('successMessage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSuccess() {
  document.getElementById('successMessage').classList.remove('active');
  document.body.style.overflow = '';
}

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
    closeSuccess();
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  updateTotal();
  
  // Calcular data de entrega dinâmica
  const meses = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];
  let hoje = new Date();
  let dataMin = new Date(hoje); dataMin.setDate(hoje.getDate() + 1);
  let dataMax = new Date(hoje); dataMax.setDate(hoje.getDate() + 6);
  let texto = "Se entrega entre el: " + dataMin.getDate() + " " + meses[dataMin.getMonth()] + " al " + dataMax.getDate() + " " + meses[dataMax.getMonth()];
  let el = document.getElementById("unified-dynamic-date");
  if(el) el.innerText = texto;
  
  // IntersectionObserver para o botão sticky
  const mainButton = document.getElementById('main-cta-button');
  const stickyWrapper = document.getElementById('sticky-cta-wrapper');
  
  if (mainButton && stickyWrapper) {
    const mainObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        stickyWrapper.style.display = 'block';
      } else {
        stickyWrapper.style.display = 'none';
      }
    }, { threshold: 0 });
    
    mainObserver.observe(mainButton);
  }
});
