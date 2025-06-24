import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import DetailPage from '@/pages/DetailPage.vue';
import NewsPricesPage from '@/pages/NewsPricesPage.vue';
import PortfolioPage from '@/pages/PortfolioPage.vue';
import WatchListPage from '@/pages/WatchListPage.vue';
import ProPage from '@/pages/ProPage.vue';
import LoginPage from '@/pages/LoginPage.vue';

const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/search', name: 'search', component: SearchPage },
  { path: '/detail/:symbol?', name: 'detail', component: DetailPage },
  { path: '/news-prices', name: 'news-prices', component: NewsPricesPage },
  { path: '/portfolio', name: 'portfolio', component: PortfolioPage },
  { path: '/watchlist', name: 'watchlist', component: WatchListPage },
  { path: '/pro', name: 'pro', component: ProPage },
  { path: '/login', name: 'login', component: LoginPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
