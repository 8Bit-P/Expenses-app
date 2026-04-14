import { BarChart2, Eye, Calendar, LayoutGrid, List, Clock, Plus } from 'lucide-react';

export function Subscriptions() {
  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Gestión de Suscripciones</h1>
        <p className="text-on-surface-variant text-lg">Controla tus gastos recurrentes y optimiza tu flujo de caja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="col-span-1 p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Gasto Mensual Total</span>
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-on-surface font-headline">$248.00</span>
            <span className="text-secondary font-semibold text-sm mt-2 flex items-center gap-1">
              -12% vs last month
            </span>
          </div>
        </div>
        <div className="col-span-1 p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Suscripciones Activas</span>
            <div className="p-2 bg-tertiary-container/10 rounded-lg">
              <Eye className="w-5 h-5 text-tertiary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-on-surface font-headline">8</span>
            <span className="text-on-surface-variant text-sm mt-2">2 pendientes de renovación</span>
          </div>
        </div>
        <div className="col-span-1 p-8 bg-gradient-to-br from-primary to-primary-container rounded-2xl shadow-lg shadow-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Próximo Cobro</span>
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-lg font-medium">Mañana: <span className="font-black text-2xl ml-1 font-headline">Netflix</span></span>
            <span className="text-white/90 text-2xl font-bold mt-1 font-headline">$15.99</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Tus Servicios</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container rounded-lg"><LayoutGrid className="w-5 h-5 text-on-surface-variant" /></button>
              <button className="p-2 text-on-surface-variant"><List className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { name: 'Netflix', price: '$15.99', date: '14 Oct, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Gb6FDMW6GDQbHfGQmBok5ifE_QFvXcriVD7emkmXuk0TDrFH1q3n5gunFZdpRKaBQ_TOM7ONK3SMhGnz5Vop40CBtR3ie86ZX677Yh-IVh6mqoKapwOHOq9rwe0gWXDUr6GDfBNMDM-h46adXe76ka-b56hSMXBwSQa48MVgZM68Satq729eRUw60gnELLu6hndlv5yf7pG_bf_951ll7t1a88MNDYav_t7h1XAFbpY7BlZjyAQb2Ma0lGPsBP_gsSyt97y6_UE', bg: 'bg-rose-500' },
              { name: 'Spotify', price: '$10.99', date: '18 Oct, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSCUQQTgRWa6sPZx429aFTga2JI-SMJZBJlEwSuKdz5UntahmqT8oPVF8fY52KXGI3vt3Cyw1DpigD-8W-YTGKvMvn6VLPdZDIQVUsER_mjUCBpM_7vIgvfMx5rJZtwX-FQyhJDZCvGXqUiVzBgRv7-65DKw39FvOK6Z-eKs8xH9m6ANtlA2sFPWSTIzdAjLqq1Mk9cwgOvLeeLQ2vQa9TKQMEYtGNYJ-a_2xKxKlMDreFC6khPItuR2EjO4kovPtaJbiIj5HYWd8', bg: 'bg-emerald-500' },
              { name: 'Fitness One', price: '$45.00', date: '01 Nov, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9tSOQ4F3Brm7shVVN3LRx65eAdfP273bNDx_hGyohiP9z9yQtMLgIs4mNwYG_OBMpJ9oDTHSr7NGTTzjD7lvXp1ZgBIhs3_OZaYnEpsAzq0fEea_e2jaCYbSAKMTH2WJ_RTc3M0CTuf3xmyZvyrTaAYdCPO9ghIYB9cVyzB1nmdc_yZHPfza2HhZPvY2gXb2rht2Hzf0CeZvL5ifQcJKX5MZeWrulvpmuxRgJacYYAiG5YXkx3i0Rw4tXO2wUJuGROuPOYl-ErlY', bg: 'bg-orange-500' },
              { name: 'iCloud+', price: '$2.99', date: '15 Oct, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHqsyq9d3M78cxsN2iAsUjK6BVscAk-xdLn315g3qCBYaXS4S7Rfq1D3wwdLgZKJpd0ePWbOgzOigkyyozUg9ShNhq-K-SjUnxyL-6dna8C25AUgTl8YxT5Fz6J27waM-gN_HYgBH7G_ssXzuqtSnbwFPkir3jjLphvggdYlowN0wP0SL2HaQ6nsIezZAn4Xin7YvasvScSUCz20IpqAbe8vjanDWUC81jQclHfXvQVoBEqniv1dJpV3qfUK5-s4PzrhkrgcZk9wM', bg: 'bg-indigo-100' },
              { name: 'ChatGPT Plus', price: '$20.00', date: '22 Oct, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZQgvNuph8YKL9k3nFYKyPX5bncW1foyfh2RdpPY09OQVqQNFhil2Z_UglQvqsCz-DrkUM_Tx8ICRsScCCOdA0PRLSG7vK-3y8bic-9buMYz1jxE1XZsmYrICRNAqgPybHimHf-MyMxFexN1Qc6NcS0af0TdYRs8ESHP0xiMCW-7mLNnsYuiiN94sZtnOrZb6wqHmZkv5xhrCbIPvUtG8CdJvSb3-f93UVXKOYo1_ehvcPGWnV4KCBWBhPvmAEpqPZHVqsnPpSAng', bg: 'bg-teal-600' },
              { name: 'Disney+', price: '$12.00', date: '05 Nov, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8O5DnJcThXufG6ZnwI-yAgr_rL9C5L0XRsLtg9mM8qI2a7YUKUEW1oR4zeh1tt9s4MHn60HDJ3ZzaxsUCvNDjanblucHv-oCiDGdVrTfhSSOl3YCmAHjpZrnwzArTKpW38cSAoLm3OZX4ucUPBwCe2zoUPkWZQCguVxft6Htv_R49iQPcQ6pLU8qrUU35tr98ib22JL_uxc6PflTE4o7fOkbTcOMVR5yk1seN6ddD9FB2a8N6TWXsjd4libbl3TM3L6Z88N76ukQ', bg: 'bg-blue-900' },
            ].map((sub) => (
              <div key={sub.name} className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/5">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 ${sub.bg} rounded-2xl flex items-center justify-center overflow-hidden`}>
                    <img src={sub.img} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-extrabold">{sub.price}</span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Por Mes</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{sub.name}</h3>
                <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Cobro: {sub.date}
                </p>
                <button className="w-full bg-surface-container-high text-on-surface font-bold py-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">Manage</button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="glass-panel p-8 rounded-2xl shadow-sm border border-outline-variant/10 h-fit sticky top-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Renewals
            </h2>
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
              {[
                { name: 'Netflix Premium', date: 'Mañana', amount: '$15.99', active: true },
                { name: 'iCloud+ 2TB', date: 'Viernes, 15 Oct', amount: '$2.99', active: false },
                { name: 'Spotify Duo', date: 'Lunes, 18 Oct', amount: '$10.99', active: false },
                { name: 'ChatGPT Plus', date: 'Jueves, 22 Oct', amount: '$20.00', active: false },
              ].map((renewal, i) => (
                <div key={i} className="relative pl-10">
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${renewal.active ? 'bg-primary ring-2 ring-primary/10' : 'bg-surface-container'}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{renewal.name}</p>
                      <p className="text-xs text-on-surface-variant">{renewal.date}</p>
                    </div>
                    <span className={`font-bold text-sm ${renewal.active ? 'text-primary' : 'text-on-surface-variant'}`}>{renewal.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-surface-container/50 rounded-2xl border border-dashed border-outline-variant/50">
              <p className="text-sm font-medium text-center text-on-surface-variant">Total esta semana</p>
              <p className="text-3xl font-black text-center mt-2 text-primary">$49.97</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
