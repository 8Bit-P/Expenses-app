import { Edit, Sliders, Shield, Key, ShieldCheck, EyeOff, BellRing, Link, Database, Link2 } from 'lucide-react';

export function Settings() {
  return (
    <div className="px-12 py-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight font-headline text-slate-900">Configuración</h2>
        <p className="text-slate-500 mt-2 font-medium">Manage your ethereal vault and guardian preferences.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Section: Perfil */}
        <section className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border-none">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-indigo-50">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrEnUIiEC42Vfse4Vxb-OAHgOJE1WkLeMauCVf9h849fL22LdZgNVppSgqQcwKDENFEmHIuu1s8LxQ8fSezPNuVsERIF9ctl-MLSyHztF08uI56nBkg_gx2QvLDBJKhYcEZCUncml5ZmskbzbFa67Xv9ODX_ffCNLDkJyQq1IqU0UMIqqDpPGxnHEIDVQBaxLZKVLf1DaUVXZFKoTPb-dQ5vef8h3kjUFyebg2Gu-o3PTr8mnKxma7X5NJJX3JMILVKsFnOEf7aI0"
                    alt="User Profile Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg scale-90 hover:scale-100 transition-transform">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline">Julian Thorne</h3>
                <p className="text-slate-500 font-medium">julian.thorne@luminous.io</p>
                <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  Premium Guardian
                </span>
              </div>
            </div>
            <button className="px-6 py-2 border-2 border-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre</p>
              <p className="font-semibold">Julian Thorne</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Idioma</p>
              <p className="font-semibold">Español (ES)</p>
            </div>
          </div>
        </section>

        {/* Section: Preferencias de la App */}
        <section className="col-span-12 lg:col-span-5 bg-indigo-50/50 rounded-2xl p-8 border-none space-y-6">
          <h4 className="text-lg font-bold font-headline flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Preferencias de la App
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <span className="font-semibold text-slate-700">Tema Visual</span>
              <div className="flex bg-surface-container rounded-lg p-1">
                <button className="px-4 py-1 rounded-md text-xs font-bold bg-white text-indigo-600 shadow-sm">Light</button>
                <button className="px-4 py-1 rounded-md text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Dark</button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <span className="font-semibold text-slate-700">Moneda</span>
              <select className="bg-transparent border-none text-indigo-600 font-bold focus:ring-0 cursor-pointer">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option selected>MXN ($)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section: Cuenta y Seguridad */}
        <section className="col-span-12 lg:col-span-4 space-y-4">
          <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-600" />
            Cuenta y Seguridad
          </h4>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <Key className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Cambiar contraseña</p>
                  <p className="text-xs text-slate-400">Actualizada hace 3 meses</p>
                </div>
              </div>
            </button>
            <div className="w-full flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Autenticación (2FA)</p>
                  <p className="text-xs text-secondary-fixed-dim font-bold">Activado</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <EyeOff className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <p className="font-bold text-slate-800 text-sm">Privacidad</p>
              </div>
            </button>
          </div>
        </section>

        {/* Section: Notificaciones */}
        <section className="col-span-12 lg:col-span-4 space-y-4">
          <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-slate-600" />
            Notificaciones
          </h4>
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Alertas por email</p>
                <p className="text-xs text-slate-400">Weekly reports & insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Presupuestos</p>
                <p className="text-xs text-slate-400">Push when over 80% limit</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Inversiones</p>
                <p className="text-xs text-slate-400">Market shift updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section: Conexiones */}
        <section className="col-span-12 lg:col-span-4 space-y-4">
          <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2">
            <Link className="w-5 h-5 text-slate-600" />
            Conexiones
          </h4>
          <div className="bg-surface-container-low rounded-2xl p-6 border-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 h-8 w-8 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-700 text-sm">Supabase DB</span>
              </div>
              <span className="text-[10px] font-black uppercase text-secondary tracking-widest bg-secondary-container px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-500">Bank Syncs (3)</span>
              <button className="text-indigo-600 text-xs font-bold hover:underline">Manage</button>
            </div>
            <button className="w-full mt-4 py-3 bg-white border border-indigo-100 rounded-xl text-indigo-600 text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
              <Link2 className="w-4 h-4" />
              Connect New Service
            </button>
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <div className="mt-16 p-8 rounded-2xl bg-error-container/20 border border-error/10 flex items-center justify-between">
        <div>
          <h5 className="text-on-error-container font-extrabold font-headline">Danger Zone</h5>
          <p className="text-error/70 text-sm font-medium">Permanently delete your vault and all ethereal data.</p>
        </div>
        <button className="px-6 py-2 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all active:scale-95">
          Delete Account
        </button>
      </div>
    </div>
  );
}
