// Função para salvar dados no localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Função para formatar valores como moeda
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Função para adicionar atividades
function addActivity(day) {
  const activityInput = document.getElementById(`activityInput${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const hoursInput = document.getElementById(`hoursInput${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const activityText = activityInput.value.trim();
  const hours = parseFloat(hoursInput.value) || 0;

  if (activityText !== '' && hours > 0) {
    const list = document.getElementById(day);
    const li = document.createElement('li');
    li.textContent = `${activityText} (${hours} horas)`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function () {
      li.classList.toggle('completed', checkbox.checked);
      updateTotalHours(day);
    });

    li.appendChild(checkbox);
    list.appendChild(li);

    activityInput.value = '';
    hoursInput.value = '';

    // Salvar dados no localStorage após adicionar atividade
    saveData(day, Array.from(list.children).map(li => li.textContent));

    // Atualizar total de horas após adicionar atividade para o dia correto
    updateTotalHours(day);
  }
}

// Função para atualizar o total de horas
function updateTotalHours(day) {
  const list = document.getElementById(day);
  const totalHoursElement = document.getElementById(`totalHours${day.charAt(0).toUpperCase() + day.slice(1)}`);

  const totalHours = Array.from(list.children)
    .filter(li => li.classList.contains('completed'))
    .reduce((sum, li) => {
      const hours = parseFloat(li.textContent.match(/\((\d+(\.\d+)?) horas\)/)[1]) || 0;
      return sum + hours;
    }, 0);

  totalHoursElement.textContent = totalHours.toFixed(2);

  // Salvar o total no localStorage
  saveData(`totalHours${day}`, totalHours);
}

// Função para carregar dados do localStorage quando a página é carregada
function loadSavedData() {
};

  // Carregar atividades para cada dia da semana
  ['monday', 'tuesday' /* adicione os outros dias aqui */].forEach(day => {
    const savedData = loadData(day);
    if (savedData) {
      const list = document.getElementById(day);
      list.innerHTML = ''; // Limpar a lista antes de adicionar itens salvos
      savedData.forEach(activityText => {
        const li = document.createElement('li');
        li.textContent = activityText;
        list.appendChild(li);
      });
      updateTotalHours(day);
    }
  });


// Chamar a função para carregar dados quando a página é carregada
loadSavedData();

// Função para reiniciar as atividades de um dia específico
function resetDay(day) {
  const list = document.getElementById(day);
  list.innerHTML = ''; // Limpar a lista de atividades

  // Limpar o total de horas para o dia
  const totalHoursElement = document.getElementById(`totalHours${day.charAt(0).toUpperCase() + day.slice(1)}`);
  totalHoursElement.textContent = '0.00';

  // Limpar os dados salvos no localStorage para o dia
  saveData(day, []);
  saveData(`totalHours${day}`, 0);
}

// Função para adicionar atividades
function addActivity(day) {
  const activityInput = document.getElementById(`activityInput${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const hoursInput = document.getElementById(`hoursInput${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const valueInput = document.getElementById(`valueInput${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const activityText = activityInput.value.trim();
  const hours = parseFloat(hoursInput.value) || 0;
  const valuePerHour = parseFloat(valueInput.value) || 0;

  if (activityText !== '' && hours > 0 && valuePerHour > 0) {
    const list = document.getElementById(day);
    const li = document.createElement('li');
    
    // Modificar esta linha para incluir o custo total
    li.textContent = `${activityText} (${hours} horas) - Custo: ${formatCurrency(hours * valuePerHour)}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function () {
      li.classList.toggle('completed', checkbox.checked);
      updateTotalHours(day);
    });

    li.appendChild(checkbox);
    list.appendChild(li);

    activityInput.value = '';
    hoursInput.value = '';
    valueInput.value = '';

    // Salvar dados no localStorage após adicionar atividade
    saveData(day, Array.from(list.children).map(li => li.textContent));

    // Atualizar total de horas após adicionar atividade para o dia correto
    updateTotalHours(day);

    // Atualizar o custo total geral
    updateTotalCost();
  }
}


// Função para atualizar o total de horas
function updateTotalHours(day) {
  const list = document.getElementById(day);
  const totalHoursElement = document.getElementById(`totalHours${day.charAt(0).toUpperCase() + day.slice(1)}`);

  const totalHours = Array.from(list.children)
    .filter(li => li.classList.contains('completed'))
    .reduce((sum, li) => {
      const hours = parseFloat(li.textContent.match(/\((\d+(\.\d+)?) horas\)/)[1]) || 0;
      return sum + hours;
    }, 0);

  totalHoursElement.textContent = totalHours.toFixed(2);

  // Calcular e exibir o custo total para o dia
  const costPerHour = 50; // Defina o custo por hora conforme necessário
  const totalCost = totalHours * costPerHour;
  const totalCostElement = document.getElementById(`totalCost${day.charAt(0).toUpperCase() + day.slice(1)}`);
  totalCostElement.textContent = formatCurrency(totalCost);

  // Salvar o total no localStorage
  saveData(`totalHours${day}`, totalHours);
}

// Função para atualizar o total de horas e custo
function updateTotalHours(day) {
  const list = document.getElementById(day);
  const totalHoursElement = document.getElementById(`totalHours${day.charAt(0).toUpperCase() + day.slice(1)}`);
  const totalCostElement = document.getElementById(`totalCost${day.charAt(0).toUpperCase() + day.slice(1)}`);

  const totalHours = Array.from(list.children)
    .filter(li => li.classList.contains('completed'))
    .reduce((sum, li) => {
      const hours = parseFloat(li.textContent.match(/\((\d+(\.\d+)?) horas\)/)[1]) || 0;
      return sum + hours;
    }, 0);

  totalHoursElement.textContent = totalHours.toFixed(2);

  // Calcular e exibir o custo total para o dia
  const valuePerHour = 50; // Defina o custo por hora conforme necessário
  const totalCost = totalHours * valuePerHour;
  totalCostElement.textContent = formatCurrency(totalCost);

  // Salvar o total no localStorage
  saveData(`totalHours${day}`, totalHours);

  // Retornar o custo total para ser usado no cálculo do "Total Geral"
  return totalCost;
}


// Função para calcular o custo total para cada dia
function updateTotalCost() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let totalCostAllDays = 0;

  // Somar os custos de todos os dias
  daysOfWeek.forEach(day => {
    const totalCost = updateTotalHours(day);
    totalCostAllDays += totalCost;
  });

  // Exibir o total geral
  const totalAllDaysElement = document.getElementById('totalAllDays');
  totalAllDaysElement.textContent = formatCurrency(totalCostAllDays);

  // Salvar o total geral no localStorage (opcional)
  saveData('totalCostAllDays', totalCostAllDays);
}

