import './style.css';
import dayjs from 'dayjs';


const SUPABASE_URL = 'https://ipyxpocgjsqxyfnqaftw.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXhwb2NnanNxeHlmbnFhZnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDI3MTYsImV4cCI6MjA5NTgxODcxNn0.kFMz6PMC-WmKMb7OSZXRPa5em1woeuYj2q7dQKsezE0';

const articlesList = document.getElementById('articles-list');
const sortSelect = document.getElementById('sort-select');
const form = document.getElementById('add-article-form');


const fetchArticles = async () => {
  const sortValue = sortSelect.value;
  const apiUrl = `${SUPABASE_URL}/rest/v1/article?select=*&order=${sortValue}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error('Błąd pobierania');
    
    const data = await response.json();
    renderArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
    articlesList.innerHTML = '<p class="text-red-500 text-center">Błąd ładowania danych.</p>';
  }
};


function renderArticles(articles) {
  articlesList.innerHTML = '';
  
  if(articles.length === 0) {
      articlesList.innerHTML = '<p class="text-center text-gray-500">Brak artykułów w bazie.</p>';
      return;
  }

  articles.forEach(article => {
    
    const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

    articlesList.innerHTML += `
      <div class="bg-white p-6 rounded-lg shadow border border-gray-200 mb-4 text-left">
        <h3 class="text-2xl font-bold text-gray-900">${article.title}</h3>
        <h4 class="text-lg text-gray-600 mb-2">${article.subtitle || ''}</h4>
        <div class="text-sm text-gray-500 mb-4 flex justify-between">
          <span>Autor: <strong>${article.author}</strong></span>
          <span>Data: ${formattedDate}</span>
        </div>
        <p class="text-gray-700 whitespace-pre-wrap">${article.content}</p>
      </div>
    `;
  });
}


const createNewArticle = async (articleData) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/article`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    });

   
    if (response.status !== 201) {
      throw new Error(`Status: ${response.status}`);
    }

    form.reset();
    fetchArticles(); 
    alert('Dodano artykuł pomyślnie!');
    
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Wystąpił błąd podczas dodawania artykułu.');
  }
};


form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newArticle = {
    title: document.getElementById('input-title').value,
    subtitle: document.getElementById('input-subtitle').value,
    author: document.getElementById('input-author').value,
    content: document.getElementById('input-content').value,
  };

  const dateInput = document.getElementById('input-date').value;
  if (dateInput) {
    newArticle.created_at = new Date(dateInput).toISOString();
  }

  createNewArticle(newArticle);
});


sortSelect.addEventListener('change', fetchArticles);


fetchArticles();